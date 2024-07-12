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

    update(delta: number): boolean {
        this.shootCooldown = Math.max(0, this.shootCooldown - delta);
        if (this.shootCooldown === 0 && this.hasBullet === false) return true;
        return false;
    }

    setShootCooldown() {
        this.hasBullet = false;
        this.shootCooldown = 10;
    }

    createBullet(id: number): Bullet | null{
        this.hasBullet = true;
        return new Bullet(id, this, this.positionX + (this.width / 2 * this.movingX), this.positionY, 28, 18, 5, 0, this.movingX, 0, 0)
    }
}
