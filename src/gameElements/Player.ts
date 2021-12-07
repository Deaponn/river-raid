import PlayerBullet from "./PlayerBullet";
import SAMEntity from "./components/SAMEntity";

const canvasMiddleX = 384;
const firstDistance = 672;
const playerWidth = 30;
const playerHeight = 28;
const playerSpeedX = 0;
const playerSpeedY = 1;
const playerMovingX = 0;
const playerMovingY = 1;
const bulletWidth = 4;
const bulletHeight = 10;

export default class Player extends SAMEntity {
    readonly type = "player";
    readonly maxSpeed = 3
    bulletId: number
    hasBullet: boolean = false;
    accellerationSpeed: number = 20;
    constructor(id: number) {
        super(id, canvasMiddleX, firstDistance, playerWidth, playerHeight, playerSpeedX, playerSpeedY, playerMovingX, playerMovingY);
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
