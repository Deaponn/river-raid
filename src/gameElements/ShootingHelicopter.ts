import SAMEntity from "./components/SAMEntity";
import { MovingIndicator } from "./components/MovingEntity";

const width = 30
const height = 20

export class ShootingHelicopter extends SAMEntity {
    readonly type =  "shootingHelicopter";
    private currentMovingFrame = 0
    private counter = 0
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

    override changeFrame(){
        this.counter++
        if(this.counter < 10) return
        this.counter = 0
        this.currentMovingFrame = this.currentMovingFrame === 1 ? 0 : 1
        this.currentAnimationFrame = (this.movingX === -1 ? 0 : 2) + this.currentMovingFrame
    }
}
