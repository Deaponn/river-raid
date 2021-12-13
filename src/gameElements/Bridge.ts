import MovingEntity from "./components/MovingEntity";
import { MovingIndicator } from "./components/MovingEntity";

const width = 140
const height = 42

export class Bridge extends MovingEntity {
    readonly type = "bridge";
    tankId?: number
    constructor(
        id: number,
        positionX: number,
        positionY: number,
        speedX: number,
        speedY: number,
        movingX: MovingIndicator,
        movingY: MovingIndicator,
    ) {
        super(id, positionX, positionY, width, height, speedX, speedY, movingX, movingY);
        this.rightDirection = 0;
        this.currentAnimationFrame = 0;
    }
}
