import TextureManager from "./TextureManager";
import FrameRenderer from "./FrameRenderer";
import Engine from "./Engine";
import opponents, { Opponent } from "./opponents";
import { Keys } from "./InputManager";

export interface PlayerData {
    points: number;
    lifes: number;
    fuel: number;
    highscore: number;
    gameId: number;
    bridge: number;
}

export default class GameManager {
    private readonly textureManager: TextureManager = new TextureManager();
    private readonly context: CanvasRenderingContext2D;
    private readonly interfaceContext: CanvasRenderingContext2D;
    private readonly backgroundContext: CanvasRenderingContext2D;
    private readonly pressedKeys: Keys;
    private readonly playerData: PlayerData = { lifes: 3, points: 0, highscore: 0, fuel: 100, bridge: 1, gameId: 1 };
    private readonly bridgeDistances = [458, 3316, 6176, 9028, 11866, 14698, 17554, 20404, 23258, 26112];
    private engine: Engine;
    private frameRenderer: FrameRenderer;
    private currentBridgeDistance = 458; // 458
    private slidingAnimationStart = 0;
    private slidingStartPoint = 0; // 0
    private playerDeathTimestamp: number | null;
    private previousTimestamp: number | null;
    private offset: number;

    constructor(context: CanvasRenderingContext2D, interfaceContext: CanvasRenderingContext2D, backgroundContext: CanvasRenderingContext2D, pressedKeys: Keys) {
        this.context = context;
        this.interfaceContext = interfaceContext;
        this.backgroundContext = backgroundContext;
        this.pressedKeys = pressedKeys;
        this.loadAssets();
    }

    async loadAssets() {
        await this.textureManager.load();
        this.frameRenderer = new FrameRenderer(this.context, this.interfaceContext, this.backgroundContext, this.textureManager.textures);
        this.engine = new Engine(
            this.context,
            JSON.parse(JSON.stringify(opponents)),
            this.textureManager.getSprite.bind(this.textureManager),
            (entityType: string) => {
                this.playerKilled(entityType);
            },
            () => {
                this.refillFuel();
            }
        );
        this.frameRenderer.blackout();
        this.frameRenderer.drawInterface(this.playerData);
        this.slideIntoView(0, this.currentBridgeDistance, 0.3);
        // first bridge: 458, second bridge: 3316, third bridge: 6176, fourth bridge: 9028,
        // fifth bridge: 11866, sixth bridge: 14698, seventh bridge: 17554, eigth bridge: 20404,
        // ninth bridge: 23258, tenth bridge: 26112
    }

    playerKilled(entityType: string) {
        // this.playerData.points += points;
        switch (entityType) {
            case "helicopter": {
                this.playerData.points += 60;
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
                break;
            }
            default: {
                console.log("unknown entity killed: ", entityType);
            }
        }
    }

    refillFuel() {
        this.playerData.fuel = Math.min(100, this.playerData.fuel += 0.2)
    }

    slideIntoView(timestamp: number, toWhere: number, speed: number) {
        const currentDistance = (timestamp - this.slidingAnimationStart) * speed + this.slidingStartPoint;
        this.offset = currentDistance - toWhere;
        this.frameRenderer.drawMap(toWhere, this.offset);
        if (currentDistance < toWhere)
            requestAnimationFrame((timestamp) => {
                this.slideIntoView(timestamp, toWhere, speed);
            });
        else {
            this.frameRenderer.drawMap(toWhere);
            this.engine.setDistance(toWhere);
            document.body.addEventListener("keydown", this.startTheGame.bind(this), { once: true });
        }
    }

    startTheGame() {
        this.previousTimestamp = null;
        this.engine.beginGame(
            JSON.parse(JSON.stringify(opponents)).filter((enemy: Opponent) => {
                return enemy.positionY > this.currentBridgeDistance;
            })
        );
        this.draw(0);
    }

    draw(timestamp: number) {
        // this.context.imageSmoothingEnabled = false;
        if (!this.previousTimestamp) this.previousTimestamp = timestamp;
        const delta = timestamp - this.previousTimestamp;
        this.previousTimestamp = timestamp;
        this.checkIfPlayerDied(timestamp);
        this.frameUpdate(delta);
        if (!this.playerDeathTimestamp || timestamp - this.playerDeathTimestamp < 1000) {
            requestAnimationFrame((timestamp) => {
                this.draw(timestamp);
            });
        } else {
            this.playerDeathTimestamp = null;
            this.slidingAnimationStart = timestamp;
            this.slideIntoView(timestamp, this.currentBridgeDistance, 0.3);
        }
    }

    frameUpdate(delta: number) {
        if (!this.playerDeathTimestamp) {
            if (this.pressedKeys.w?.press) this.playerData.fuel = Math.max(0, this.playerData.fuel - delta / 250);
            else this.playerData.fuel = Math.max(0, this.playerData.fuel - delta / 625);
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

    // below method works only once, on player death
    checkIfPlayerDied(timestamp: number) {
        if (!this.playerDeathTimestamp && !this.engine.getPlayerAlive()) {
            this.currentBridgeDistance = this.bridgeDistances[this.playerData.bridge - 1];
            this.slidingStartPoint = this.currentBridgeDistance - 458;
            this.playerDeathTimestamp = timestamp;
            this.playerData.lifes--;
            this.playerData.fuel = 100;
        }
    }
}
