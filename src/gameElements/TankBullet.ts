import MovingEntity, { MovingIndicator } from "./components/MovingEntity";
import Entity from "./components/Entity";
import { Trajectory } from "./components/TrajectoryFactory";

interface Dimensions {
    width: number;
    height: number;
    offsetY: number;
}

const exploding: Dimensions[] = [
    { width: 8, height: 2, offsetY: 16 },
    { width: 6, height: 6, offsetY: 12 },
    { width: 6, height: 6, offsetY: 12 },
    { width: 12, height: 10, offsetY: 8 },
    { width: 12, height: 10, offsetY: 8 },
    { width: 12, height: 14, offsetY: 4 },
    { width: 12, height: 14, offsetY: 4 },
    { width: 20, height: 18, offsetY: 0 },
    { width: 20, height: 18, offsetY: 0 },
    { width: 28, height: 18, offsetY: 0 },
    { width: 28, height: 18, offsetY: 0 },
];

export default class TankBullet extends MovingEntity {
    readonly originalPositionX: number;
    readonly originalPositionY: number;
    readonly trajectory: Trajectory;
    readonly frameLength = 8;
    owner: Entity;
    type = "tankBullet";
    hitboxOffsetY: number;
    explodeDuration = 0;
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
        hitboxOffsetY: number,
        trajectory: (x: number) => number
    ) {
        super(id, positionX, positionY, width, height, speedX / 2, speedY, movingX, movingY);
        this.owner = owner;
        this.hitboxOffsetY = hitboxOffsetY;
        this.originalPositionX = positionX;
        this.originalPositionY = positionY;
        this.trajectory = trajectory;
    }

    override move(delta: number) {
        const distanceTravelledSinceBeginning = Math.abs(this.originalPositionX - this.positionX);
        const trajectory = this.trajectory(distanceTravelledSinceBeginning);
        if (trajectory !== 0 || (trajectory === 0 && this.originalPositionX === this.positionX)) {
            this.positionX += this.speedX * this.movingX * delta;
            this.positionY = this.originalPositionY + trajectory;
        } else this.updateState(delta);
    }

    updateState(delta: number) {
        if (Math.floor(this.explodeDuration / this.frameLength) >= exploding.length - 1) {
            this.lifetime = 0;
            return;
        }
        this.type = "bullet";
        this.explodeDuration += delta;
        this.currentAnimationFrame = Math.floor(this.explodeDuration / this.frameLength);
        this.width = exploding[this.currentAnimationFrame].width;
        this.height = exploding[this.currentAnimationFrame].height;
        this.hitboxOffsetY = exploding[this.currentAnimationFrame].offsetY;
    }

    getRemainingFrames(): number[] {
        const remainingFrames = [];
        for (let i = this.currentAnimationFrame; i < 10; i++) {
            remainingFrames.push(i);
        }
        return remainingFrames;
    }
}
