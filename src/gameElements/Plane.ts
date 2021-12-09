import constants from "../Constants";
import MovingEntity from "./components/MovingEntity";
import { MovingIndicator } from "./components/MovingEntity";

const width = 32
const height = 12

export class Plane extends MovingEntity {
    readonly type = "plane";
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
    override move(delta: number) {
        this.positionX += ((this.speedX * this.movingX) * (delta));
        if(this.movingY !== 0) this.positionY += delta * this.speedY;
        if(this.positionX < -32) this.positionX = constants.WIDTH + 32
        if(this.positionX > constants.WIDTH + 32) this.positionX = -32
    }
}
