import MovingEntity from "./components/MovingEntity";
import { MovingIndicator } from "./components/MovingEntity";

const width = 32
const height = 40

export class Balloon extends MovingEntity {
    readonly type = "balloon";
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
        this.rightDirection = 0;
        this.currentAnimationFrame = 0;
    }
}
