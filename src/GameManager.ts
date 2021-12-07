import TextureManager from "./TextureManager";
import FrameRenderer from "./FrameRenderer";
import Engine from "./Engine";
import constants from "./Constants";
import { Keys } from "./InputManager";

export default class GameManager {
    private readonly textureManager: TextureManager = new TextureManager();
    private readonly context: CanvasRenderingContext2D;
    private readonly interfaceContext: CanvasRenderingContext2D;
    private readonly backgroundContext: CanvasRenderingContext2D;
    private readonly pressedKeys: Keys;
    private engine: Engine;
    private frameRenderer: FrameRenderer;
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
        this.engine = new Engine(this.context, this.textureManager.getSprite.bind(this.textureManager));
        this.frameRenderer.blackout();
        this.frameRenderer.drawInterface({points: 0, lifes: 3, fuel: 100, highscore: 0, gameId: 1, bridge: 1})
        this.slideIntoView(0, 458, 0.3);
    }

    slideIntoView(timestamp: number, toWhere: number, speed: number) {
        this.frameRenderer.drawMap(timestamp * speed);
        if (timestamp * speed < toWhere)
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
        this.draw(0);
    }

    draw(timestamp: number) {
        // this.context.imageSmoothingEnabled = false;
        if (!this.previousTimestamp) this.previousTimestamp = timestamp;
        const delta = timestamp - this.previousTimestamp;
        this.previousTimestamp = timestamp;
        this.frameRenderer.drawMap(this.engine.getDistance());
        this.engine.triggerRefresh(delta / 10, this.pressedKeys);
        this.frameRenderer.draw(this.engine.getData());
        requestAnimationFrame((timestamp) => {
            this.draw(timestamp);
        });
    }
}
