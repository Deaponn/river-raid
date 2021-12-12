import MovingEntity from "./components/MovingEntity";
import { MovingIndicator } from "./components/MovingEntity";

const width = 30
const height = 48

export class Fuel extends MovingEntity {
    readonly type = "fuel";
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
