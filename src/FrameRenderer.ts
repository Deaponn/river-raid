import AnimationEntity from "./gameElements/components/AnimationEntity";
import constants from "./Constants";
import Interface from "./interfaceElements/Interface";
import { EngineData } from "./Engine";
import { IEntity } from "./gameElements/components/Entity";
import { PlayerData } from "./gameElements/Player";
import { Textures } from "./TextureManager";

export default class FrameRenderer {
    private readonly context: CanvasRenderingContext2D;
    private readonly interfaceContext: CanvasRenderingContext2D;
    private readonly backgroundContext: CanvasRenderingContext2D;
    private readonly textures: Textures;
    private readonly interface: Interface;
    private readonly mapLength = 28508;
    private readonly scoreCanvasContext: CanvasRenderingContext2D;
    private static readonly blinkData: { color: string, time: number }[] = [
        { color: "rgba(45,50,184,1)", time: 100 },
        { color: "#500e5d", time: 100 },
        { color: "rgba(45,50,184,1)", time: 100 },
        { color: "#500e5d", time: 100 },
        { color: "rgba(45,50,184,1)", time: 100 },
    ];
    private previousInterfaceData: PlayerData;
    gameStarted = false;
    textAnimationStart = performance.now();
    gameOverAnimId: number
    scoreBlinkId: NodeJS.Timer;
    scoreBlinkId2: NodeJS.Timer;
    constructor(
        context: CanvasRenderingContext2D,
        interfaceContext: CanvasRenderingContext2D,
        backgroundContext: CanvasRenderingContext2D,
        textures: Textures
    ) {
        this.context = context;
        this.interfaceContext = interfaceContext;
        this.backgroundContext = backgroundContext;
        this.textures = textures;
        this.interface = new Interface(
            this.interfaceContext,
            this.textures.interface,
            this.textures.fuel_indicator,
            this.textures.life,
            this.textures.digits_black,
            this.textures.digits_yellow
        );
        this.fillBackground();
        this.interfaceContext.font = "28px atari";

        const canvas = document.createElement("canvas") as HTMLCanvasElement;
        this.scoreCanvasContext = canvas.getContext("2d") as CanvasRenderingContext2D;
        canvas.classList.add("hide-score");
        document.body.appendChild(canvas);
        this.scoreCanvasContext.fillStyle = "#606060";
    }

    draw(engineData: EngineData, playerData: PlayerData) {
        this.context.beginPath();
        this.drawInterface(playerData);
        this.drawEntities(engineData.entities, engineData.distance);
    }

    drawMap(distance: number, offset = 0) {
        this.context.clearRect(0, 0, constants.WIDTH, constants.HEIGHT);
        this.context.drawImage(
            this.textures.map.sourceCanvas,
            0,
            this.mapLength - distance,
            constants.WIDTH,
            constants.HEIGHT,
            0,
            offset,
            constants.WIDTH,
            constants.HEIGHT
        );
        if (offset === 0) return;
        this.context.fillStyle = "black";
        this.context.fillRect(0, offset + 454, constants.WIDTH, constants.HEIGHT);
    }

    resizeDraw(engineData: EngineData, playerData: PlayerData, distance: number) {
        this.context.beginPath();
        this.drawMap(distance);
        this.drawInterface(playerData, true);
        this.drawEntities(engineData.entities, engineData.distance);
        this.fillBackground();
        if (this.gameStarted) this.drawTextAnimation(0);
    }

    drawInterface(data: PlayerData, force: boolean = false) {
        this.interfaceContext.font = "28px atari";
        if (JSON.stringify(this.previousInterfaceData) !== JSON.stringify(data) || force) this.interface.draw(data);
        this.previousInterfaceData = JSON.parse(JSON.stringify(data));
    }

    drawEntities(entities: IEntity[] | AnimationEntity[], distance: number) {
        let remember;
        for (const entity of entities) {
            if (entity.type === "player") remember = entity;
            this.drawEntity(entity, distance);
        }
        if (remember) this.drawEntity(remember, distance);
    }

    drawEntity(entity: IEntity | AnimationEntity, distance: number) {
        let entityTexture = entity.type !== "animation" ? this.textures[entity.type] : this.textures[(entity as AnimationEntity).animatedEntity];
        if (entity.type === "tankBullet" || (entity as AnimationEntity).animatedEntity === "tankBullet") entityTexture = this.textures.bullet;
        this.context.fillStyle = "rgba(255,0,255,0.3)";
        if (entityTexture) {
            this.context.drawImage(
                entityTexture.sourceCanvas,
                entity.currentAnimationFrame * entityTexture.frameWidth,
                0,
                entityTexture.frameWidth,
                entityTexture.height,
                Math.round(entity.positionX - entityTexture.frameWidth / 2),
                600 - Math.round(entity.positionY - distance - entityTexture.height / 2),
                entityTexture.frameWidth,
                entityTexture.height
            );
        } else {
            console.log("not drawing entity: ", entity);
        }
    }

    blackout() {
        this.context.fillStyle = "rgba(0,0,0,1)";
        this.context.fillRect(0, 0, 800, 600);
    }

    fillBackground() {
        this.backgroundContext.fillStyle = "rgba(45,50,184,1)";
        this.backgroundContext.fillRect(0, 0, constants.WIDTH, constants.HEIGHT);
    }

    drawTextAnimation(timestamp: number) {
        if (!this.gameStarted) {
            const elapsed = timestamp - this.textAnimationStart; 
            this.interfaceContext.fillStyle = "rgba(0,0,0,1)";
            this.interfaceContext.fillRect(0, 552, 800, 48);
            this.interfaceContext.fillStyle = "#c0c0c0";
            this.interfaceContext.fillText(
                "RIVER RAID TM by Bartosz Sajecki            Copyright 2021                      Press ANY key to begin playing",
                constants.WIDTH - ((elapsed / 5) % 4000),
                580
            );
            this.interfaceContext.drawImage(this.textures.activision.sourceCanvas, 1640 + constants.WIDTH - ((elapsed / 5) % 4000), 562);
            requestAnimationFrame((timestamp) => {
                this.drawTextAnimation(timestamp);
            });
        } else {
            this.interfaceContext.fillStyle = "rgba(0,0,0,1)";
            this.interfaceContext.fillRect(0, 552, 800, 48);
            this.interfaceContext.drawImage(this.textures.activision.sourceCanvas, 100, 562);
        }
    }

    scoreBlink() {
        this.scoreBlinkId2 = setTimeout(() => {
            this.scoreCanvasContext.fillRect(0, 0, 999999, 999999);
        }, 700);
        this.scoreBlinkId = setInterval(() => {
            this.scoreCanvasContext.clearRect(0, 0, 999999, 999999);
            this.scoreBlinkId2 = setTimeout(() => {
                this.scoreCanvasContext.fillRect(0, 0, 999999, 999999);
            }, 700);
        }, 1400);
    }

    stopScoreBlink() {
        clearInterval(this.scoreBlinkId);
        clearInterval(this.scoreBlinkId2);
        this.scoreCanvasContext.clearRect(0, 0, 999999, 999999);
    }

    gameLostTextAnimation(timestamp: number) {
        const elapsed = timestamp - this.textAnimationStart;
        this.interfaceContext.fillStyle = "rgba(0,0,0,1)";
        this.interfaceContext.fillRect(0, 552, 800, 48);
        this.interfaceContext.fillStyle = "#c0c0c0";
        this.interfaceContext.fillText(".........GAME OVER.........", constants.WIDTH - ((elapsed / 5) % 4000), 580);
        if (elapsed < 10000) {
            this.gameOverAnimId = requestAnimationFrame((timestamp) => {
                this.gameLostTextAnimation(timestamp);
            });
        }
    }

    async blink() {
        this.backgroundContext.fillStyle = "#500e5d";
        this.backgroundContext.fillRect(0, 0, constants.WIDTH, constants.HEIGHT);
        if (Math.random() > 0.5) {
            setTimeout(() => {
                this.backgroundContext.fillStyle = "rgba(45,50,184,1)";
                this.backgroundContext.fillRect(0, 0, constants.WIDTH, constants.HEIGHT);
            }, 300);
        } else {
            for (let index = 0; index < FrameRenderer.blinkData.length; index++) {
                let { color, time } = FrameRenderer.blinkData[index];
                this.backgroundContext.fillStyle = color;
                this.backgroundContext.fillRect(0, 0, constants.WIDTH, constants.HEIGHT);
                await FrameRenderer.wait(time);
            }
        }
    }

    static wait(time: number) {
        return new Promise(res => setTimeout(res, time))
    }
}
