import MovingEntity, { MovingIndicator } from "./MovingEntity";
import Bullet from "../Bullet";

export default class SAMEntity extends MovingEntity {
    hasBullet = false
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
    }

    createBullet(id: number): Bullet | null{
        return new Bullet(id, this, this.positionX + (this.width / 2 * this.movingX), this.positionY, 28, 18, 5, 0, this.movingX, 0, 0)
    }
}
