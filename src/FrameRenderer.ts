import AnimationEntity from "./gameElements/components/AnimationEntity";
import constants from "./Constants";
import Interface from "./interfaceElements/Interface";
import { EngineData } from "./Engine";
import { IEntity } from "./gameElements/components/Entity";
import { PlayerData } from "./GameManager";
import { Textures } from "./TextureManager";

export default class FrameRenderer {
    private readonly context: CanvasRenderingContext2D;
    private readonly interfaceContext: CanvasRenderingContext2D;
    private readonly backgroundContext: CanvasRenderingContext2D;
    private readonly textures: Textures;
    private readonly interface: Interface;
    private readonly mapLength = 28508;
    private previousInterfaceData: PlayerData;
    gameStarted = false;
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
        this.backgroundContext.fillStyle = "rgba(45,50,184,1)";
        this.backgroundContext.fillRect(0, 0, constants.WIDTH, constants.HEIGHT);
        this.interfaceContext.font = "28px atari";
    }

    draw(engineData: EngineData, playerData: PlayerData) {
        this.context.beginPath();
        this.drawInterface(playerData);
        this.drawEntities(engineData.entities, engineData.distance);
    }

    drawMap(distance: number, offset = 0) {
        // console.log("drawing map distance: ", distance)
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

    drawInterface(data: PlayerData) {
        if (JSON.stringify(this.previousInterfaceData) !== JSON.stringify(data)) this.interface.draw(data);
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
        if (entity.type === "tankBullet") entityTexture = this.textures.bullet;
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
            // this.context.fillRect(
            //     Math.round(entity.positionX) - entity.width / 2,
            //     600 - Math.round(entity.positionY - distance - entity.height / 2) + (entity.hitboxOffsetY || 0),
            //     entity.width,
            //     entity.height
            // );
        } else {
            console.log("not drawing entity: ", entity);
        }
    }

    blackout() {
        this.context.fillStyle = "rgba(0,0,0,1)";
        this.context.fillRect(0, 0, 800, 600);
    }

    drawTextAnimation(timestamp: number) {
        // console.log(timestamp)
        this.interfaceContext.fillStyle = "rgba(0,0,0,1)";
        this.interfaceContext.fillRect(0, 552, 800, 48);
        this.interfaceContext.fillStyle = "#c0c0c0";
        this.interfaceContext.fillText(
            "RIVER RAID TM by Bartosz Sajecki            Copyright 2021                      Press ANY key to begin playing",
            constants.WIDTH - ((timestamp / 5) % 4000),
            580
        );
        this.interfaceContext.drawImage(this.textures.activision.sourceCanvas, 1640 + constants.WIDTH - ((timestamp / 5) % 4000), 562);
        if (!this.gameStarted) {
            requestAnimationFrame((timestamp) => {
                this.drawTextAnimation(timestamp);
            });
        } else {
            this.interfaceContext.fillStyle = "rgba(0,0,0,1)";
            this.interfaceContext.fillRect(0, 552, 800, 48);
            this.interfaceContext.drawImage(this.textures.activision.sourceCanvas, 100, 562);
        }
    }

    blink() {
        this.backgroundContext.fillStyle = "#500e5d";
        this.backgroundContext.fillRect(0, 0, constants.WIDTH, constants.HEIGHT);
        if (Math.random() > 0.5) {
            setTimeout(() => {
                this.backgroundContext.fillStyle = "rgba(45,50,184,1)";
                this.backgroundContext.fillRect(0, 0, constants.WIDTH, constants.HEIGHT);
            }, 300);
        } else {
            setTimeout(() => {
                this.backgroundContext.fillStyle = "rgba(45,50,184,1)";
                this.backgroundContext.fillRect(0, 0, constants.WIDTH, constants.HEIGHT);
                setTimeout(() => {
                    this.backgroundContext.fillStyle = "#500e5d";
                    this.backgroundContext.fillRect(0, 0, constants.WIDTH, constants.HEIGHT);
                    setTimeout(() => {
                        this.backgroundContext.fillStyle = "rgba(45,50,184,1)";
                        this.backgroundContext.fillRect(0, 0, constants.WIDTH, constants.HEIGHT);
                        setTimeout(() => {
                            this.backgroundContext.fillStyle = "#500e5d";
                            this.backgroundContext.fillRect(0, 0, constants.WIDTH, constants.HEIGHT);
                            setTimeout(() => {
                                this.backgroundContext.fillStyle = "rgba(45,50,184,1)";
                                this.backgroundContext.fillRect(0, 0, constants.WIDTH, constants.HEIGHT);
                            }, 100);
                        }, 100);
                    }, 100);
                }, 100);
            }, 100);
        }
    }
}
