import PlayerBullet from "./PlayerBullet";
import SAMEntity from "./components/SAMEntity";

const distanceOffset = 202;
const playerWidth = 32;
const playerHeight = 30;
const playerSpeedX = 0;
const playerSpeedY = 1;
const playerMovingX = 0;
const playerMovingY = 1;
const bulletWidth = 4;
const bulletHeight = 10;

export interface PlayerData {
    points: number;
    lifes: number;
    fuel: number;
    highscore: number;
    gameId: number;
    bridge: number;
}

export default class Player extends SAMEntity {
    readonly type = "player";
    readonly maxSpeedX = 3
    readonly maxSpeedY = 2.5
    readonly minSpeedY = 0.5
    speedY = 1
    bulletId: number
    hasBullet: boolean = false;
    accellerationSpeed: number = 20;
    constructor(id: number, positionX: number, currentDistance: number) {
        super(id, positionX, currentDistance + distanceOffset, playerWidth, playerHeight, playerSpeedX, playerSpeedY, playerMovingX, playerMovingY);
        this.currentAnimationFrame = 1;
        this.rightDirection = 2;
    }

    override update(delta: number): boolean {
        this.shootCooldown -= delta;
        return false;
    }

    override createBullet(id: number): null | PlayerBullet {
        if (this.hasBullet || this.shootCooldown > 0) return null;
        this.hasBullet = true;
        this.bulletId = id
        return new PlayerBullet(id, this, this.positionX, this.positionY, bulletWidth, bulletHeight, 0, 15, 0, 1);
    }

    static initialPlayerData(): PlayerData {
        return {
            lifes: 4,
            points: 0,
            highscore: parseInt(localStorage.getItem("highscore") || "0"),
            fuel: 100,
            bridge: 1,
            gameId: 1,
        };
    }
}
