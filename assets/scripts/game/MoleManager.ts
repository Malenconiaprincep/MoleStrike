import { _decorator, Color, Component, Graphics, instantiate, Node, Prefab, UITransform, Vec3 } from 'cc';
import { AudioManager } from '../core/AudioManager';
import { ArtAssetKey, ArtResourceManager } from '../core/ArtResourceManager';
import { BOMB_MOLE_CONFIG, GOLDEN_MOLE_CONFIG, MoleConfig, MoleType, NORMAL_MOLE_CONFIG } from '../core/GameTypes';
import { Mole } from './Mole';

const { ccclass, property } = _decorator;

type MoleScoreCallback = (score: number, hit: boolean, hole: Node) => void;

/**
 * 地鼠生成管理器。
 * 根据难度控制地鼠类型、生成速度和同屏数量。
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
    private readonly activeMoles = new Map<Node, { moleNode: Node; mole: Mole }>();
    private spawnDelayLeft = -1;
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
        } else if (this.difficultyLevel === 2) {
            this.minSpawnDelay = 0.2;
            this.maxSpawnDelay = 0.62;
        } else {
            this.minSpawnDelay = 0.12;
            this.maxSpawnDelay = 0.46;
        }

        this.scheduleNextSpawn(0);
    }

    public pauseSpawning(): void {
        if (!this.running) {
            return;
        }

        this.paused = true;
        for (const activeMole of this.activeMoles.values()) {
            activeMole.mole.pauseMole();
        }
    }

    public resumeSpawning(): void {
        if (!this.running) {
            return;
        }

        this.paused = false;
        for (const activeMole of this.activeMoles.values()) {
            activeMole.mole.resumeMole();
        }

        this.scheduleNextSpawn();
    }

    public stopSpawning(): void {
        this.running = false;
        this.paused = false;
        this.onScore = null;
        this.spawnDelayLeft = -1;
        this.clearActiveMoles();
    }

    protected update(deltaTime: number): void {
        if (!this.running || this.paused) {
            return;
        }

        this.pruneInactiveMoles();
        if (this.activeMoles.size >= this.getMaxActiveMoles()) {
            this.spawnDelayLeft = -1;
            return;
        }

        if (this.spawnDelayLeft < 0) {
            this.scheduleNextSpawn();
        }

        this.spawnDelayLeft -= deltaTime;
        if (this.spawnDelayLeft <= 0) {
            this.spawnOneMole();
        }
    }

    private scheduleNextSpawn(delay?: number): void {
        this.pruneInactiveMoles();

        if (!this.running || this.paused || this.activeMoles.size >= this.getMaxActiveMoles()) {
            return;
        }

        if (delay === 0 || this.spawnDelayLeft < 0) {
            this.spawnDelayLeft = delay ?? this.randomRange(this.minSpawnDelay, this.maxSpawnDelay);
        }
    }

    private spawnOneMole = (): void => {
        this.spawnDelayLeft = -1;
        this.pruneInactiveMoles();

        if (!this.running || this.paused || this.holes.length === 0) {
            return;
        }

        const openHoles = this.holes.filter((hole) => !this.activeMoles.has(hole));
        const capacity = Math.min(this.getMaxActiveMoles() - this.activeMoles.size, openHoles.length);
        const spawnCount = Math.min(capacity, this.pickSpawnCount());
        for (let i = 0; i < spawnCount; i += 1) {
            const holeIndex = Math.floor(Math.random() * openHoles.length);
            const [hole] = openHoles.splice(holeIndex, 1);
            this.spawnMoleInHole(hole);
        }

        this.scheduleNextSpawn();
    };

    private spawnMoleInHole(hole: Node): void {
        const config = this.pickMoleConfig();
        const moleNode = this.getMoleNode(config.type);
        hole.addChild(moleNode);
        moleNode.active = true;
        moleNode.setPosition(Vec3.ZERO);
        moleNode.layer = hole.layer;
        for (const child of moleNode.children) {
            child.layer = hole.layer;
        }

        const mole = moleNode.getComponent(Mole);
        if (!mole) {
            moleNode.destroy();
            return;
        }

        this.activeMoles.set(hole, { moleNode, mole });
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
                this.clearActiveMole(hole);
                this.scheduleNextSpawn();
            },
        );
    }

    private pickMoleConfig(): MoleConfig {
        const roll = Math.random();

        if (this.difficultyLevel === 1) {
            if (roll < 0.1) {
                return this.withDifficulty(GOLDEN_MOLE_CONFIG);
            }

            if (roll < 0.18) {
                return this.withDifficulty(BOMB_MOLE_CONFIG);
            }

            return this.withDifficulty(NORMAL_MOLE_CONFIG);
        }

        if (this.difficultyLevel === 2) {
            if (roll < 0.16) {
                return this.withDifficulty(GOLDEN_MOLE_CONFIG);
            }

            if (roll < 0.36) {
                return this.withDifficulty(BOMB_MOLE_CONFIG);
            }

            return this.withDifficulty(NORMAL_MOLE_CONFIG);
        }

        if (roll < 0.18) {
            return this.withDifficulty(GOLDEN_MOLE_CONFIG);
        }

        if (roll < 0.48) {
            return this.withDifficulty(BOMB_MOLE_CONFIG);
        }

        return this.withDifficulty(NORMAL_MOLE_CONFIG);
    }

    private pickSpawnCount(): number {
        const roll = Math.random();

        if (this.difficultyLevel === 1) {
            return roll < 0.3 ? 2 : 1;
        }

        if (this.difficultyLevel === 2) {
            return roll < 0.35 ? 2 : 1;
        }

        if (roll < 0.18) {
            return 3;
        }

        return roll < 0.58 ? 2 : 1;
    }

    private getMaxActiveMoles(): number {
        if (this.difficultyLevel === 1) {
            return 2;
        }

        if (this.difficultyLevel === 2) {
            return 2;
        }

        return 3;
    }

    private withDifficulty(config: MoleConfig): MoleConfig {
        const stayMultiplier = this.difficultyLevel === 1 ? 1 : this.difficultyLevel === 2 ? 0.82 : 0.66;
        return {
            ...config,
            staySeconds: Math.max(0.45, config.staySeconds * stayMultiplier),
        };
    }

    private clearActiveMole(hole: Node): void {
        const activeMole = this.activeMoles.get(hole);
        if (activeMole?.moleNode.isValid) {
            this.recycleMoleNode(activeMole.moleNode);
        }

        this.activeMoles.delete(hole);
    }

    private clearActiveMoles(): void {
        for (const activeMole of this.activeMoles.values()) {
            if (activeMole.moleNode.isValid) {
                this.recycleMoleNode(activeMole.moleNode);
            }
        }

        this.activeMoles.clear();
    }

    private pruneInactiveMoles(): void {
        for (const [hole, activeMole] of this.activeMoles.entries()) {
            if (!activeMole.moleNode.isValid || activeMole.moleNode.parent !== hole) {
                this.activeMoles.delete(hole);
            }
        }
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
