import Bullet from "./Bullet";
import { MovingIndicator } from "./components/MovingEntity";
import Entity from "./components/SAMEntity";

export default class PlayerBullet extends Bullet {
    readonly type = "playerBullet";
    constructor(
        id: number,
        owner: Entity,
        positionX: number,
        positionY: number,
        width: number,
        height: number,
        speedX: number,
        speedY: number,
        movingX: MovingIndicator,
        movingY: MovingIndicator
    ) {
        super(id, owner, positionX, positionY, width, height, speedX, speedY, movingX, movingY, 0);
    }

    move(delta: number) {
        this.positionX = this.owner.positionX;
        this.positionY += delta * this.speedY * this.movingY;
    }
}
