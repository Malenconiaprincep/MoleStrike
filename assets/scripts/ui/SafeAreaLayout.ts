import { _decorator, Component, Node, sys, Vec3, view } from 'cc';

const { ccclass } = _decorator;

interface SafeAreaEntry {
    node: Node;
    basePosition: Vec3;
}

/**
 * 将关键交互节点推入设备安全区域。
 * 微信 Android 首帧可能稍后才返回准确值，因此运行期间低频复查安全区。
 */
@ccclass('SafeAreaLayout')
export class SafeAreaLayout extends Component {
    private topEntries: SafeAreaEntry[] = [];
    private bottomEntries: SafeAreaEntry[] = [];
    private elapsed = 0;
    private lastTopInset = -1;
    private lastBottomInset = -1;

    public configure(topNodes: Node[], bottomNodes: Node[]): void {
        this.topEntries = this.createEntries(topNodes);
        this.bottomEntries = this.createEntries(bottomNodes);
        this.refresh(true);
    }

    protected update(deltaTime: number): void {
        this.elapsed += deltaTime;
        if (this.elapsed < 0.5) {
            return;
        }

        this.elapsed = 0;
        this.refresh(false);
    }

    private refresh(force: boolean): void {
        const visibleSize = view.getVisibleSize();
        const safeArea = sys.getSafeAreaRect(false);
        const topInset = Math.max(0, visibleSize.height - safeArea.y - safeArea.height);
        const bottomInset = Math.max(0, safeArea.y);

        if (!force
            && Math.abs(topInset - this.lastTopInset) < 0.5
            && Math.abs(bottomInset - this.lastBottomInset) < 0.5) {
            return;
        }

        this.lastTopInset = topInset;
        this.lastBottomInset = bottomInset;
        for (const entry of this.topEntries) {
            if (entry.node.isValid) {
                entry.node.setPosition(
                    entry.basePosition.x,
                    entry.basePosition.y - topInset,
                    entry.basePosition.z,
                );
            }
        }
        for (const entry of this.bottomEntries) {
            if (entry.node.isValid) {
                entry.node.setPosition(
                    entry.basePosition.x,
                    entry.basePosition.y + bottomInset,
                    entry.basePosition.z,
                );
            }
        }
    }

    private createEntries(nodes: Node[]): SafeAreaEntry[] {
        return nodes.map((node) => ({
            node,
            basePosition: node.position.clone(),
        }));
    }
}
