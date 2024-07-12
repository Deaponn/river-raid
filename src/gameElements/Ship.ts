import MovingEntity, { MovingIndicator } from "./components/MovingEntity";

const width = 64
const height = 16

export class Ship extends MovingEntity {
    readonly type = "ship";
    private currentMovingFrame = 0
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
        this.rightDirection = 1;
        this.currentAnimationFrame = (this.movingX === -1 ? 0 : 1) + this.currentMovingFrame;
    }
}
