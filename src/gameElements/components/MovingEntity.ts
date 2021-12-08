import Entity from "./Entity";

export type MovingIndicator = -1 | 0 | 1;

export default class MovingEntity extends Entity {
    positionX: number;
    positionY: number;
    speedX: number;
    readonly speedY: number;
    movingX: MovingIndicator;
    movingY: MovingIndicator;
    leftDirection = 0
    rightDirection = 1
    constructor(
        id: number,
        positionX: number,
        positionY: number,
        width: number,
        height: number,
        speedX: number,
        speedY: number,
        movingX: -1 | 0 | 1,
        movingY: -1 | 0 | 1,
    ) {
        super(id, positionX, positionY, width, height);
        this.speedX = speedX;
        this.speedY = speedY;
        this.movingX = movingX;
        this.movingY = movingY;
    }

    move(delta: number) {
        this.positionX += ((this.speedX * this.movingX) * (delta));
        if(this.movingY !== 0) this.positionY += delta;
    }

    changeMovement(axis: "x" | "y", newValue: -1 | 0 | 1) {
        if (newValue === -1) this.currentAnimationFrame = this.leftDirection;
        if (newValue === 0) this.currentAnimationFrame = 1;
        if (newValue === 1) this.currentAnimationFrame = this.rightDirection;
        if (axis === "x") this.movingX = newValue;
        if (axis === "y") this.movingY = newValue;
    }
}
