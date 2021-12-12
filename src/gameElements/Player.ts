import PlayerBullet from "./PlayerBullet";
import SAMEntity from "./components/SAMEntity";

const canvasMiddleX = 384;
const distanceOffset = 202;
const playerWidth = 32;
const playerHeight = 30;
const playerSpeedX = 0;
const playerSpeedY = 1;
const playerMovingX = 0;
const playerMovingY = 1;
const bulletWidth = 4;
const bulletHeight = 10;

export default class Player extends SAMEntity {
    readonly type = "player";
    readonly maxSpeedX = 3
    readonly maxSpeedY = 2.5
    speedY = 2
    bulletId: number
    hasBullet: boolean = false;
    accellerationSpeed: number = 20;
    constructor(id: number, currentDistance: number) {
        super(id, canvasMiddleX, currentDistance + distanceOffset, playerWidth, playerHeight, playerSpeedX, playerSpeedY, playerMovingX, playerMovingY);
        this.currentAnimationFrame = 1;
        this.rightDirection = 2;
    }

    override createBullet(id: number): null | PlayerBullet {
        if (this.hasBullet) return null;
        this.hasBullet = true;
        this.bulletId = id
        return new PlayerBullet(id, this, this.positionX, this.positionY, bulletWidth, bulletHeight, 0, 10, 0, 1);
    }
}
