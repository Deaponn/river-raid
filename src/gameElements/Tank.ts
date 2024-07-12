import SAMEntity from "./components/SAMEntity";
import { MovingIndicator } from "./components/MovingEntity";
import TankBullet from "./TankBullet";
import { getTrajectory } from "./components/TrajectoryFactory";

const width = 30;
const height = 20;

export class Tank extends SAMEntity {
    readonly type = "tank";
    currentMovingFrame = 0;
    private counter = 0;
    bridgeRiding: boolean = false;
    guarded: boolean = true;
    private readonly shootAt: number;
    dontShootAfter: number;
    constructor(
        id: number,
        positionX: number,
        positionY: number,
        speedX: number,
        speedY: number,
        movingX: MovingIndicator,
        movingY: MovingIndicator,
        shootAt: number
    ) {
        super(id, positionX, positionY, width, height, speedX, speedY, movingX, movingY);
        this.shootAt = shootAt;
        this.rightDirection = 2;
        this.currentAnimationFrame = (this.movingX === -1 ? 0 : 2) + this.currentMovingFrame;
    }

    override createBullet(id: number): TankBullet | null {
        if (
            this.dontShootAfter &&
            ((this.movingX === -1 && this.positionX < this.dontShootAfter) || (this.movingX === 1 && this.positionX > this.dontShootAfter))
        )
            return null;
        if (this.speedX !== 0) return null;
        this.hasBullet = true;
        const trajectory = getTrajectory(Math.abs(this.positionX - this.shootAt));
        const bullet = new TankBullet(id, this, this.positionX + (this.width / 2) * this.movingX, this.positionY, 8, 2, 5, 0, this.movingX, 0, 16, trajectory);
        return bullet;
    }

    override changeFrame() {
        this.counter++;
        if (this.counter < 10) return;
        this.counter = 0;
        this.currentMovingFrame = this.currentMovingFrame === 1 ? 0 : 1;
        this.currentAnimationFrame = (this.movingX === -1 ? 0 : 2) + this.currentMovingFrame;
    }
}
