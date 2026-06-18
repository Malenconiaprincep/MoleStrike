import { _decorator, Color, Component, Graphics, instantiate, Node, Prefab, UITransform, Vec3 } from 'cc';
import { AudioManager } from '../core/AudioManager';
import { ArtAssetKey, ArtResourceManager } from '../core/ArtResourceManager';
import { BOMB_MOLE_CONFIG, GOLDEN_MOLE_CONFIG, MoleConfig, MoleType, NORMAL_MOLE_CONFIG } from '../core/GameTypes';
import { Mole } from './Mole';

const { ccclass, property } = _decorator;

type MoleScoreCallback = (score: number, hit: boolean, hole: Node) => void;

/**
 * 地鼠生成管理器。
 * 当前阶段同一时间只生成 1 只普通地鼠；后续扩展不同地鼠类型时只需要替换 pickMoleConfig。
 */
@ccclass('MoleManager')
export class MoleManager extends Component {
    @property({ type: [Node] })
    public holes: Node[] = [];

    @property(Prefab)
    public molePrefab: Prefab | null = null;

    @property(AudioManager)
    public audioManager: AudioManager | null = null;

    @property
    public minSpawnDelay = 0.2;

    @property
    public maxSpawnDelay = 0.8;

    private running = false;
    private paused = false;
    private activeMoleNode: Node | null = null;
    private activeMole: Mole | null = null;
    private onScore: MoleScoreCallback | null = null;
    private difficultyLevel = 1;
    private readonly molePools = new Map<MoleType, Node[]>();

    public startSpawning(onScore: MoleScoreCallback): void {
        this.stopSpawning();
        this.running = true;
        this.paused = false;
        this.onScore = onScore;
        this.setDifficultyLevel(1);
        this.scheduleNextSpawn(0);
    }

    public setDifficultyLevel(level: number): void {
        this.difficultyLevel = Math.max(1, Math.min(3, Math.floor(level)));

        if (this.difficultyLevel === 1) {
            this.minSpawnDelay = 0.28;
            this.maxSpawnDelay = 0.8;
            return;
        }

        if (this.difficultyLevel === 2) {
            this.minSpawnDelay = 0.2;
            this.maxSpawnDelay = 0.62;
            return;
        }

        this.minSpawnDelay = 0.12;
        this.maxSpawnDelay = 0.46;
    }

    public pauseSpawning(): void {
        if (!this.running) {
            return;
        }

        this.paused = true;
        this.unschedule(this.spawnOneMole);
        this.activeMole?.pauseMole();
    }

    public resumeSpawning(): void {
        if (!this.running) {
            return;
        }

        this.paused = false;
        if (this.activeMole) {
            this.activeMole.resumeMole();
            return;
        }

        this.scheduleNextSpawn();
    }

    public stopSpawning(): void {
        this.running = false;
        this.paused = false;
        this.onScore = null;
        this.unschedule(this.spawnOneMole);
        this.clearActiveMole();
    }

    private scheduleNextSpawn(delay?: number): void {
        if (!this.running || this.paused) {
            return;
        }

        const nextDelay = delay ?? this.randomRange(this.minSpawnDelay, this.maxSpawnDelay);
        this.scheduleOnce(this.spawnOneMole, nextDelay);
    }

    private spawnOneMole = (): void => {
        if (!this.running || this.paused || this.activeMoleNode || this.holes.length === 0) {
            return;
        }

        const hole = this.holes[Math.floor(Math.random() * this.holes.length)];
        const config = this.pickMoleConfig();
        const moleNode = this.getMoleNode(config.type);
        hole.addChild(moleNode);
        moleNode.active = true;
        moleNode.setPosition(Vec3.ZERO);
        moleNode.layer = hole.layer;

        const mole = moleNode.getComponent(Mole);
        if (!mole) {
            moleNode.destroy();
            return;
        }

        this.activeMoleNode = moleNode;
        this.activeMole = mole;
        this.audioManager?.playMoleAppear();

        mole.show(
            config,
            (score) => {
                this.audioManager?.playHitMole();
                this.onScore?.(score, true, hole);
            },
            (hit) => {
                if (!hit) {
                    this.onScore?.(0, false, hole);
                }
                this.clearActiveMole();
                this.scheduleNextSpawn();
            },
        );
    };

    private pickMoleConfig(): MoleConfig {
        const roll = Math.random();

        if (this.difficultyLevel === 1) {
            if (roll < 0.1) {
                return this.withDifficulty(GOLDEN_MOLE_CONFIG);
            }

            return this.withDifficulty(NORMAL_MOLE_CONFIG);
        }

        if (this.difficultyLevel === 2) {
            if (roll < 0.16) {
                return this.withDifficulty(GOLDEN_MOLE_CONFIG);
            }

            if (roll < 0.28) {
                return this.withDifficulty(BOMB_MOLE_CONFIG);
            }

            return this.withDifficulty(NORMAL_MOLE_CONFIG);
        }

        if (roll < 0.18) {
            return this.withDifficulty(GOLDEN_MOLE_CONFIG);
        }

        if (roll < 0.38) {
            return this.withDifficulty(BOMB_MOLE_CONFIG);
        }

        return this.withDifficulty(NORMAL_MOLE_CONFIG);
    }

    private withDifficulty(config: MoleConfig): MoleConfig {
        const stayMultiplier = this.difficultyLevel === 1 ? 1 : this.difficultyLevel === 2 ? 0.82 : 0.66;
        return {
            ...config,
            staySeconds: Math.max(0.45, config.staySeconds * stayMultiplier),
        };
    }

    private clearActiveMole(): void {
        if (this.activeMoleNode && this.activeMoleNode.isValid) {
            this.recycleMoleNode(this.activeMoleNode);
        }

        this.activeMoleNode = null;
        this.activeMole = null;
    }

    private randomRange(min: number, max: number): number {
        return min + Math.random() * Math.max(0, max - min);
    }

    private getMoleNode(type: MoleType): Node {
        const pool = this.molePools.get(type);
        const pooledNode = pool?.pop();
        if (pooledNode?.isValid) {
            return pooledNode;
        }

        return this.molePrefab ? instantiate(this.molePrefab) : this.createDefaultMoleNode(type);
    }

    private recycleMoleNode(moleNode: Node): void {
        const moleType = this.getNodeMoleType(moleNode);
        moleNode.removeFromParent();
        moleNode.active = false;
        moleNode.setScale(Vec3.ONE);

        const pool = this.molePools.get(moleType) ?? [];
        pool.push(moleNode);
        this.molePools.set(moleType, pool);
    }

    private getNodeMoleType(moleNode: Node): MoleType {
        if (moleNode.name.includes(MoleType.Golden)) {
            return MoleType.Golden;
        }

        if (moleNode.name.includes(MoleType.Bomb)) {
            return MoleType.Bomb;
        }

        return MoleType.Normal;
    }

    private createDefaultMoleNode(type: MoleType): Node {
        const moleNode = new Node('Mole');
        moleNode.name = `Mole_${type}`;
        moleNode.addComponent(UITransform).setContentSize(142, 142);

        const graphics = moleNode.addComponent(Graphics);
        const mainColor = this.getMoleMainColor(type);
        const bellyColor = this.getMoleBellyColor(type);
        const eyeColor = type === MoleType.Bomb ? new Color(255, 245, 212, 255) : new Color(255, 255, 255, 255);

        graphics.fillColor = mainColor;
        graphics.circle(0, -4, 58);
        graphics.fill();

        if (type === MoleType.Golden) {
            graphics.fillColor = new Color(255, 246, 137, 255);
            graphics.circle(-24, 33, 14);
            graphics.circle(0, 43, 14);
            graphics.circle(24, 33, 14);
            graphics.fill();
        }

        if (type === MoleType.Bomb) {
            graphics.fillColor = new Color(255, 88, 64, 255);
            graphics.circle(0, 47, 14);
            graphics.fill();
            graphics.strokeColor = new Color(255, 213, 87, 255);
            graphics.lineWidth = 5;
            graphics.moveTo(0, 60);
            graphics.lineTo(16, 77);
            graphics.stroke();
        }

        graphics.fillColor = bellyColor;
        graphics.circle(0, -18, 40);
        graphics.fill();

        graphics.fillColor = eyeColor;
        graphics.circle(-22, 20, 14);
        graphics.circle(22, 20, 14);
        graphics.fill();

        graphics.fillColor = type === MoleType.Bomb ? new Color(206, 37, 31, 255) : new Color(35, 22, 18, 255);
        if (type === MoleType.Bomb) {
            graphics.moveTo(-32, 27);
            graphics.lineTo(-12, 16);
            graphics.lineTo(-30, 11);
            graphics.close();
            graphics.moveTo(32, 27);
            graphics.lineTo(12, 16);
            graphics.lineTo(30, 11);
            graphics.close();
            graphics.fill();
        } else {
            graphics.circle(-22, 20, 7);
            graphics.circle(22, 20, 7);
            graphics.fill();
        }

        graphics.fillColor = new Color(35, 22, 18, 255);
        graphics.circle(0, -1, 6);
        graphics.fill();

        graphics.strokeColor = new Color(83, 45, 27, 255);
        graphics.lineWidth = 4;
        if (type === MoleType.Bomb) {
            graphics.moveTo(-17, -31);
            graphics.lineTo(17, -31);
        } else {
            graphics.moveTo(-16, -24);
            graphics.quadraticCurveTo(0, -34, 16, -24);
        }
        graphics.stroke();

        graphics.fillColor = type === MoleType.Bomb ? new Color(255, 245, 212, 140) : new Color(255, 255, 255, 120);
        graphics.circle(-27, 26, 4);
        graphics.circle(17, 26, 4);
        graphics.fill();

        moleNode.addComponent(Mole);
        ArtResourceManager.applySprite(moleNode, this.getMoleArtKey(type), 172, 172);
        return moleNode;
    }

    private getMoleArtKey(type: MoleType): ArtAssetKey {
        if (type === MoleType.Golden) {
            return ArtAssetKey.GoldenMole;
        }

        if (type === MoleType.Bomb) {
            return ArtAssetKey.BombMole;
        }

        return ArtAssetKey.NormalMole;
    }

    private getMoleMainColor(type: MoleType): Color {
        if (type === MoleType.Golden) {
            return new Color(245, 177, 45, 255);
        }

        if (type === MoleType.Bomb) {
            return new Color(58, 57, 63, 255);
        }

        return new Color(139, 83, 45, 255);
    }

    private getMoleBellyColor(type: MoleType): Color {
        if (type === MoleType.Golden) {
            return new Color(255, 216, 88, 255);
        }

        if (type === MoleType.Bomb) {
            return new Color(91, 88, 96, 255);
        }

        return new Color(190, 123, 72, 255);
    }
}
