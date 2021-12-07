import SAMEntity from "./components/SAMEntity";
import { MovingIndicator } from "./components/MovingEntity";

export class Helicopter extends SAMEntity {
    readonly type = "helicopter";
    private currentMovingFrame = 0
    private counter = 0
    constructor(
        id: number,
        positionX: number,
        positionY: number,
        width: number,
        height: number,
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
        if(this.counter < 20) return
        this.counter = 0
        this.currentMovingFrame = this.currentMovingFrame === 1 ? 0 : 1
        this.currentAnimationFrame = (this.movingX === -1 ? 0 : 2) + this.currentMovingFrame
    }
}
