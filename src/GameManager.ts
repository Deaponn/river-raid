import TextureManager from "./TextureManager";
import FrameRenderer from "./FrameRenderer";
import Engine from "./Engine";
import opponents, { Opponent } from "./opponents";
import { Keys } from "./InputManager";
import constants from "./Constants";
import SoundManager from "./SoundManager";

export interface PlayerData {
    points: number;
    lifes: number;
    fuel: number;
    highscore: number;
    gameId: number;
    bridge: number;
}

export default class GameManager {
    private readonly textureManager: TextureManager;
    private readonly context: CanvasRenderingContext2D;
    private readonly pressedKeys: Keys;
    readonly playerData: PlayerData = {
        lifes: 4,
        points: 0,
        highscore: parseInt(localStorage.getItem("highscore") || "0"),
        fuel: 100,
        bridge: 1,
        gameId: 1,
    };
    private readonly bridgeDistances = [446, 3306, 6168, 9028, 11880, 14716, 17550, 20404, 23258, 26108];
    private readonly bridgeCenters = [398, 400, 406, 378, 410, 373, 363, 426, 442, 433, 395];
    private readonly soundPlayer: SoundManager;
    private readonly frameRenderer: FrameRenderer;
    private engine: Engine;
    private currentBridgeDistance: number;
    private slidingAnimationStart: number;
    private slidingStartPoint: number;
    private playerDeathTimestamp: number | null;
    private previousTimestamp: number | null;
    private slideShowId: number;
    private previousSlideShowTimestamp: number;
    private gameOverFlag: boolean = false;
    private readonly newGame: () => void;
    private slideShowStart: number;

    constructor(
        context: CanvasRenderingContext2D,
        frameRenderer: FrameRenderer,
        textureManager: TextureManager,
        pressedKeys: Keys,
        soundPlayer: SoundManager,
        newGame: () => void
    ) {
        this.context = context;
        this.textureManager = textureManager;
        this.soundPlayer = soundPlayer;
        this.frameRenderer = frameRenderer;
        this.pressedKeys = pressedKeys;
        this.newGame = newGame;
        this.bootUp();
    }

    bootUp(prevTimestamp: number | null = null) {
        if (this.gameOverFlag) return;
        this.currentBridgeDistance = 446; // [446, 3306, 6168, 9028, 11880, 14716, 17550, 20404, 23258, 26108]
        this.slidingAnimationStart = performance.now();
        this.slidingStartPoint = 0; // 0
        this.playerDeathTimestamp = null;
        this.previousTimestamp = prevTimestamp;
        this.engine = new Engine(
            this.context,
            JSON.parse(JSON.stringify(opponents)),
            this.textureManager.getSprite.bind(this.textureManager),
            this.textureManager.getSpriteFragment.bind(this.textureManager),
            (entityType: string) => {
                this.playerKilled(entityType);
            },
            () => {
                this.refillFuel();
            },
            this.soundPlayer
        );
        this.frameRenderer.blackout();
        this.frameRenderer.drawInterface(this.playerData);
        const enemiesCopy = JSON.parse(JSON.stringify(opponents)) as Opponent[];
        this.engine.putEnemiesData(enemiesCopy);
        this.engine.showcasing = true;
        document.body.addEventListener(
            "keydown",
            () => {
                this.soundPlayer.playSound("boot");
                cancelAnimationFrame(this.slideShowId);
                this.engine.setDistance(0);
                this.engine.showcasing = false;
                this.slideIntoView(0, this.currentBridgeDistance, 0.6);
                this.frameRenderer.gameStarted = true;
            },
            { once: true }
        );
        this.slideShow(performance.now());
        this.frameRenderer.drawTextAnimation(performance.now());
        // first bridge: 458, second bridge: 3316, third bridge: 6176, fourth bridge: 9028,
        // fifth bridge: 11866, sixth bridge: 14698, seventh bridge: 17554, eigth bridge: 20404,
        // ninth bridge: 23258, tenth bridge: 26112
    }

    playerKilled(entityType: string) {
        if (this.gameOverFlag) return;
        // this.playerData.points += points;
        this.soundPlayer.playSound("enemyDeath");
        const oldPoints = this.playerData.points;
        switch (entityType) {
            case "helicopter": {
                this.playerData.points += 60;
                break;
            }
            case "shootingHelicopter": {
                this.playerData.points += 150;
                break;
            }
            case "ship": {
                this.playerData.points += 30;
                break;
            }
            case "balloon": {
                this.playerData.points += 60;
                break;
            }
            case "plane": {
                this.playerData.points += 100;
                break;
            }
            case "tank": {
                this.playerData.points += 250;
                break;
            }
            case "fuel": {
                this.playerData.points += 80;
                break;
            }
            case "bridge": {
                this.playerData.points += 500;
                this.riverBlink();
                break;
            }
            default: {
                console.log("unknown entity killed: ", entityType);
            }
        }
        if (oldPoints % 10000 > this.playerData.points % 10000) this.playerData.lifes++;
    }

    refillFuel() {
        if (this.gameOverFlag) return;
        this.playerData.fuel = Math.min(100, (this.playerData.fuel += 0.3));
        if (this.playerData.fuel === 100) this.soundPlayer.playSound("tankingFull");
        else this.soundPlayer.playSound("tanking");
    }

    slideShow(timestamp: number, toWhere: number = 28508, speed: number = 0.1) {
        if (this.gameOverFlag) return;
        if (!this.slideShowStart) this.slideShowStart = timestamp;
        if (!this.previousSlideShowTimestamp) this.previousSlideShowTimestamp = timestamp;
        const currentDistance = (timestamp - this.slideShowStart) * speed;
        this.engine.setDistance(currentDistance);
        this.frameRenderer.drawMap(currentDistance);
        this.engine.manageCollisions();
        this.engine.purgeEntities();
        this.engine.updateEntities((timestamp - this.previousSlideShowTimestamp) / 10);
        this.previousSlideShowTimestamp = timestamp;
        this.engine.spawnEnemy(this.engine.testNewEnemy());
        this.frameRenderer.draw(this.engine.getData(), this.playerData);
        this.slidingAnimationStart = timestamp;
        if (currentDistance < toWhere) {
            this.slideShowId = requestAnimationFrame((timestamp) => {
                this.slideShow(timestamp);
            });
        }
    }

    riverBlink() {
        if (this.gameOverFlag) return;
        this.frameRenderer.blink();
    }

    slideIntoView(timestamp: number, toWhere: number, speed: number) {
        if (this.gameOverFlag) return;
        const currentDistance = (timestamp - this.slidingAnimationStart) * speed + this.slidingStartPoint;
        const offset = currentDistance - toWhere;
        this.engine.setDistance(currentDistance);
        this.frameRenderer.drawMap(toWhere, offset);
        this.engine.spawnEnemy(this.engine.testNewEnemy());
        this.frameRenderer.draw(this.engine.getData(), this.playerData);
        if (currentDistance < toWhere)
            requestAnimationFrame((timestamp) => {
                this.slideIntoView(timestamp, toWhere, speed);
            });
        else {
            this.frameRenderer.drawMap(toWhere);
            this.engine.setDistance(toWhere);
            this.engine.spawnEnemy(this.engine.testNewEnemy());
            this.engine.addPlayer(this.bridgeCenters[this.playerData.bridge - 1]);
            this.playerData.lifes--;
            this.frameRenderer.draw(this.engine.getData(), this.playerData);
            this.frameRenderer.scoreBlink();
            document.body.addEventListener("keydown", this.startTheGame.bind(this), { once: true });
        }
    }

    startTheGame() {
        if (this.gameOverFlag) return;
        this.frameRenderer.stopScoreBlink();
        const enemiesCopy = JSON.parse(JSON.stringify(opponents)) as Opponent[];
        this.previousTimestamp = null;
        this.engine.beginGame(
            enemiesCopy.filter((enemy: Opponent) => {
                return enemy.positionY - 218 > this.currentBridgeDistance;
            }),
            this.bridgeCenters[this.playerData.bridge - 1]
        );
        this.soundPlayer.playSound("flightStart");
        this.draw(0);
    }

    draw(timestamp: number) {
        // this.context.imageSmoothingEnabled = false;
        if (!this.previousTimestamp) this.previousTimestamp = timestamp;
        const delta = timestamp - this.previousTimestamp;
        this.previousTimestamp = timestamp;
        this.checkIfPlayerDied(timestamp);
        this.frameUpdate(delta);
        if ((!this.playerDeathTimestamp || timestamp - this.playerDeathTimestamp < 1000) && !this.gameOverFlag) {
            requestAnimationFrame((timestamp) => {
                this.draw(timestamp);
            });
        } else {
            if (this.gameOverFlag) return;
            this.engine.entities.length = 0;
            this.playerDeathTimestamp = null;
            this.slidingAnimationStart = timestamp;
            const enemiesCopy = JSON.parse(JSON.stringify(opponents)) as Opponent[];
            this.engine.putEnemiesData(
                enemiesCopy.filter((enemy: Opponent) => {
                    return enemy.positionY - 218 > this.currentBridgeDistance && enemy.positionY - 218 < this.currentBridgeDistance + constants.HEIGHT;
                })
            );
            if (this.playerData.lifes === 0) this.gameOver();
            this.slideIntoView(timestamp, this.currentBridgeDistance, 0.3);
        }
    }

    frameUpdate(delta: number) {
        if (!this.playerDeathTimestamp) {
            this.playerData.fuel = Math.max(0, this.playerData.fuel - delta / 300);
            if (this.playerData.fuel < 25) this.soundPlayer.playSound("lowFuel");
        }
        for (let i = 0; i < this.bridgeDistances.length; i++) {
            if (this.bridgeDistances[i] > this.engine.getDistance()) break;
            else this.playerData.bridge = i + 1;
        }
        if (this.playerData.fuel === 0 && this.engine.getPlayerAlive()) this.engine.destroyEntity(this.engine.findPlayer()!.id);
        if (this.bridgeDistances[this.playerData.bridge] < this.engine.getDistance()) this.playerData.bridge++;
        this.frameRenderer.drawMap(this.engine.getDistance());
        this.engine.triggerRefresh(delta / 10, this.pressedKeys);
        this.frameRenderer.draw(this.engine.getData(), this.playerData);
    }

    frameUpdateForSlideShow(delta: number) {
        this.frameRenderer.drawMap(this.engine.getDistance());
        this.engine.triggerRefresh(delta / 10, this.pressedKeys);
        this.frameRenderer.draw(this.engine.getData(), this.playerData);
    }

    // below method works only once, on player death
    checkIfPlayerDied(timestamp: number) {
        if (!this.playerDeathTimestamp && !this.engine.getPlayerAlive()) {
            this.currentBridgeDistance = this.bridgeDistances[this.playerData.bridge - 1];
            this.slidingStartPoint = this.currentBridgeDistance - 458;
            this.playerDeathTimestamp = timestamp;
            this.playerData.fuel = 100;
            if (this.engine.getDistance() > 28922) {
                const gif = new Image();
                gif.src = "../assets/gameplay/absolute_win.gif";
                console.log(gif);
                gif.onload = () => {
                    console.log(gif);
                    document.body.append(gif);
                    this.soundPlayer.playSound("absolute_win");
                };
            }
        }
    }

    gameOver() {
        this.saveScore();
        this.gameOverFlag = true;
        this.newGame();
    }

    saveScore() {
        if (this.gameOverFlag) return;
        const highscore = localStorage.getItem("highscore");
        if (!highscore || parseInt(highscore) < this.playerData.points) {
            localStorage.setItem("highscore", this.playerData.points.toString());
            this.playerData.highscore = this.playerData.points;
            this.playerData.points = 0;
        }
    }
}
