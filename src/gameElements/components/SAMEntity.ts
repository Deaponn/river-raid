import MovingEntity, { MovingIndicator } from "./MovingEntity";
import Bullet from "../Bullet";

export default class SAMEntity extends MovingEntity {
    hasBullet = false
    shootCooldown = 0
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

    update(): boolean {
        this.shootCooldown--;
        if (this.shootCooldown === 0) return true;
        return false;
    }

    setShootCooldown() {
        this.shootCooldown = 10;
    }

    createBullet(id: number): Bullet | null{
        return new Bullet(id, this, this.positionX + (this.width / 2 * this.movingX), this.positionY, 28, 18, 5, 0, this.movingX, 0, 0)
    }
}
