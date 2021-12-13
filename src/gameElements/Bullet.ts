import MovingEntity, { MovingIndicator } from "./components/MovingEntity";
import Entity from "./components/Entity";

export default class Bullet extends MovingEntity {
    owner: Entity;
    type = "bullet"
    exType?: string
    hitboxOffsetY: number
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
        movingY: MovingIndicator,
        hitboxOffsetY: number
    ) {
        super(id, positionX, positionY, width, height, speedX, speedY, movingX, movingY);
        this.owner = owner;
        this.hitboxOffsetY = hitboxOffsetY
    }

    getRemainingFrames(){
        return [0]
    }
}
