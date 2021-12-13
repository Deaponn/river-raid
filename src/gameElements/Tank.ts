import SAMEntity from "./components/SAMEntity";
import { MovingIndicator } from "./components/MovingEntity";
import TankBullet from "./TankBullet";
import { getTrajectory } from "./components/TrajectoryFactory";

const width = 30
const height = 20

export class Tank extends SAMEntity {
    readonly type = "tank";
    currentMovingFrame = 0
    private counter = 0
    bridgeRiding: boolean = false
    guarded: boolean = true
    constructor(
        id: number,
        positionX: number,
        positionY: number,
        speedX: number,
        speedY: number,
        movingX: MovingIndicator,
        movingY: MovingIndicator
    ) {
        super(id, positionX, positionY, width, height, speedX, speedY, movingX, movingY);
        this.rightDirection = 2;
        this.currentAnimationFrame = (this.movingX === -1 ? 0 : 2) + this.currentMovingFrame;
    }

    override createBullet(id: number): TankBullet | null {
        const trajectory = getTrajectory(480)
        const bullet = new TankBullet(id, this, this.positionX, this.positionY, 8, 2, 5, 0, this.movingX, 0, 16, trajectory)
        return bullet
    }

    override changeFrame(){
        this.counter++
        if(this.counter < 10) return
        this.counter = 0
        this.currentMovingFrame = this.currentMovingFrame === 1 ? 0 : 1
        this.currentAnimationFrame = (this.movingX === -1 ? 0 : 2) + this.currentMovingFrame
    }
}
