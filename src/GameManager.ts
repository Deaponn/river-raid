import TextureManager from "./TextureManager";
import FrameRenderer from "./FrameRenderer";
import Engine from "./Engine";
import constants from "./Constants";
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
    private engine: Engine;
    private frameRenderer: FrameRenderer;
    private slidingAnimationStart: number = 0;
    private playerDeathTimestamp: number | null;
    private previousTimestamp: number | null;
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
        this.engine = new Engine(this.context, this.textureManager.getSprite.bind(this.textureManager), (points: number) => {
            this.playerKilled(points);
        });
        this.frameRenderer.blackout();
        this.frameRenderer.drawInterface(this.playerData);
        this.slideIntoView(0, 458, 0.3);
    }

    playerKilled(points: number) {
        this.playerData.points += points;
    }

    slideIntoView(timestamp: number, toWhere: number, speed: number) {
        this.frameRenderer.drawMap((timestamp - this.slidingAnimationStart) * speed);
        if ((timestamp - this.slidingAnimationStart) * speed < toWhere)
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
        this.engine.resurrectPlayer();
        this.draw(0);
    }

    draw(timestamp: number) {
        // this.context.imageSmoothingEnabled = false;
        if (!this.previousTimestamp) this.previousTimestamp = timestamp;
        const delta = timestamp - this.previousTimestamp;
        this.previousTimestamp = timestamp;
        this.playerData.fuel -= delta / 500;
        if (!this.playerDeathTimestamp && !this.engine.getPlayerAlive()) {
            this.playerDeathTimestamp = timestamp;
            this.playerData.lifes--;
        }
        this.frameRenderer.drawMap(this.engine.getDistance());
        this.engine.triggerRefresh(delta / 10, this.pressedKeys);
        this.frameRenderer.draw(this.engine.getData(), this.playerData);
        if (!this.playerDeathTimestamp || timestamp - this.playerDeathTimestamp < 1000) {
            requestAnimationFrame((timestamp) => {
                this.draw(timestamp);
            });
        } else {
            this.playerDeathTimestamp = null;
            this.slidingAnimationStart = timestamp;
            this.slideIntoView(timestamp, 458, 0.3);
        }
    }
}
