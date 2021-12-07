import Bullet from "./gameElements/Bullet";
import constants from "./Constants";
import Entity, { IEntity } from "./gameElements/components/Entity";
import opponents, { Opponent } from "./opponents";
import Player from "./gameElements/Player";
import PlayerBullet from "./gameElements/PlayerBullet";
import SAMEntity from "./gameElements/components/SAMEntity";
import { Helicopter } from "./gameElements/Helicopter";
import { Keys } from "./InputManager";
import { MovingIndicator } from "./gameElements/components/MovingEntity";
import AnimationEntity from "./gameElements/components/AnimationEntity";

export interface Boundaries {
    startX: number;
    startY: number;
    lengthX: number;
    lengthY: number;
}

export interface EngineData {
    player: PlayerData;
    entities: IEntity[];
    distance: number;
}

export interface PlayerData {
    points: number;
    lifes: number;
    fuel: number;
    highscore: number;
    gameId: number;
    bridge: number;
}

export default class Engine {
    private readonly mapCollisions: CanvasRenderingContext2D;
    private readonly playerData: PlayerData = { points: 0, lifes: 3, fuel: 100, highscore: 0, gameId: 1, bridge: 1 };
    private readonly entities: IEntity[];
    private readonly getSprite: (name: string, frame: number) => ImageData;
    private opponents = JSON.parse(JSON.stringify(opponents));
    private entityCounter = 0;
    private distance = 0;

    //DEBUGGING:
    private readonly debugCollisionContext: CanvasRenderingContext2D;
    private counter: number;

    constructor(map: CanvasRenderingContext2D, getSprite: (name: string, frame: number) => ImageData) {
        this.mapCollisions = map;
        this.entities = [];
        this.getSprite = getSprite;
        this.entities.push(new Player(this.nextEntityId()));

        //DEBUGGING:
        this.entities.push(new Helicopter(this.nextEntityId(), 400, 800, 30, 20, 0, 0, 0, 0));

        this.counter = 10;
        const canvas = document.createElement("canvas") as HTMLCanvasElement;
        canvas.classList.add("debugging");
        document.body.appendChild(canvas);
        this.debugCollisionContext = canvas.getContext("2d") as CanvasRenderingContext2D;
        canvas.width = 200;
        canvas.height = 100;
        this.debugCollisionContext.fillStyle = "black";
        this.debugCollisionContext.fillRect(0, 0, 42, 26);
    }

    getData(): EngineData {
        return { player: this.playerData, entities: this.entities, distance: this.distance };
    }

    getDistance(): number {
        return this.distance;
    }

    setDistance(newDistance: number): void {
        this.distance = newDistance;
    }

    triggerRefresh(delta: number, input: Keys): void {
        console.log(this.entities.length)
        this.purgeEntities();
        this.spawnEnemy(this.testNewEnemy());
        this.handleInput(delta, input);
        this.calculate(delta);
    }

    purgeEntities(): void {
        for (let i = 0; i < this.entities.length; i++) {
            if (this.entities[i].positionY < this.distance + 100) {
                this.destroyEntity(this.entities[i].id);
            }
        }
    }

    getEntityById(id: number): IEntity {
        return this.entities[
            this.entities.findIndex((entity: IEntity) => {
                return entity.id === id;
            })
        ];
    }

    testNewEnemy(): Opponent | null {
        if (this.opponents.length > 0 && this.distance + 700 > this.opponents[0].positionY) return this.opponents.shift();
        else return null;
    }

    spawnEnemy(data: Opponent | null): void {
        if (!data) return;
        switch (data.type) {
            case "helicopter": {
                const helicopter = new Helicopter(this.nextEntityId(), data.positionX, data.positionY, 30, 20, data.moving ? 1 : 0, 0, data.direction, 0);
                this.entities.push(helicopter);
                if (data.shooting) this.entityShoot(helicopter);
                break;
            }
            default: {
                console.log("unsupported spawn type: ", data.type);
            }
        }
    }

    createAnimatedEntity(entity: IEntity) {
        this.entities.push(
            new AnimationEntity(this.nextEntityId(), entity.positionX, entity.positionY, entity.width, entity.height, entity.type, [4, 5, 6, 5])
        );
    }

    handleInput(delta: number, input: Keys): void {
        const player = this.findPlayer();
        if (!player) return;
        if (input.a?.press) {
            player.changeMovement("x", -1);
            player.speedX = Math.min(player.speedX + (player.speedX + 1) / 30, player.maxSpeed);
        }
        if (input.d?.press) {
            player.changeMovement("x", 1);
            player.speedX = Math.min(player.speedX + (player.speedX + 1) / 30, player.maxSpeed);
        }
        if ((input.a?.press && input.d?.press) || (!input.a?.press && !input.d?.press)) {
            player.changeMovement("x", 0);
            player.speedX = 0;
        }
        if (input[" "]?.press) this.entityShoot(player);
        player.move(delta);
    }

    calculate(delta: number): void {
        this.playerData.fuel -= delta / 50;
        this.manageCollisions();
        this.moveEntities(delta);
        this.progressAnimations(delta);
        this.distance += delta;
    }

    nextEntityId(): number {
        this.entityCounter++;
        return this.entityCounter;
    }

    findPlayer(): Player | null {
        const index = this.entities.findIndex((entity: Entity) => {
            return entity.type === "player";
        });
        if (index !== -1)
            return this.entities[
                this.entities.findIndex((entity: Entity) => {
                    return entity.type === "player";
                })
            ] as Player;
        else return null;
    }

    moveEntities(delta: number): void {
        for (let i = 0; i < this.entities.length; i++) {
            switch (this.entities[i].type) {
                case "bullet": {
                    this.entities[i].move?.(delta);
                    break;
                }
                case "playerBullet": {
                    this.entities[i].move?.(delta);
                    break;
                }
                case "helicopter": {
                    this.entities[i].move?.(delta);
                    break;
                }
                case "player": {
                    break;
                }
                case "animation": {
                    break;
                }
                default: {
                    console.log("invalid entity to move: ", this.entities[i].type);
                }
            }
            // if (this.entities[i].type !== "player") this.entities[i].move?.();
        }
    }

    progressAnimations(delta: number) {
        for (const entity of this.entities) {
            if (entity.type === "animation") (entity as AnimationEntity).updateState(delta);
            else if(["helicopter", "tank"].includes(entity.type)) entity.changeFrame()
        }
    }

    entityShoot(who: SAMEntity): void {
        if (this.entities.findIndex((entity) => entity.id === who.id) === -1) return;
        const bullet = who.createBullet(this.nextEntityId());
        if (bullet) this.entities.push(bullet);
        // else console.log(this.entities[this.entities.length - 1])
    }

    manageCollisions(): void {
        const player = this.findPlayer();
        if (!player) return;
        const playerBoundaries = this.getEntityBoundaries(player);
        const playerBullet = this.getEntityById(player.bulletId) as PlayerBullet;
        const playerBulletBoundaries = this.getEntityBoundaries(playerBullet);
        for (const entity of this.entities) {
            const boundaries: Boundaries = this.getEntityBoundaries(entity);
            const collisionArea = this.mapCollisions?.getImageData(boundaries.startX, boundaries.startY, boundaries.lengthX, boundaries.lengthY) as ImageData;
            if (this.checkTerrainCollision(collisionArea)) {
                this.handleTerrainCollision(entity);
            }
            if (this.checkEntityCollision(entity, boundaries, player, playerBullet, playerBoundaries, playerBulletBoundaries)) {
                // this.destroyEntity(player.bulletId);
                this.destroyEntity(entity.id);
            }
        }
    }

    checkTerrainCollision(area: ImageData): boolean {
        for (let i = 0; i < area.data.length; i += 4) {
            if (area.data[i + 3] !== 3) return true;
        }
        return false;
    }

    // there is no need to check for collisions between other entites,
    // so we check only between player and anything else and playerBullet and anything else
    checkEntityCollision(
        entity: IEntity,
        boundaries: Boundaries,
        player: Player,
        playerBullet: PlayerBullet,
        playerBoundaries: Boundaries,
        playerBulletBoundaries: Boundaries
    ): boolean {
        if (["player", "playerBullet", "animation"].includes(entity.type)) return false;
        if (this.collisionBetweenBoundaries(playerBoundaries, boundaries) && this.collisionBetweenSprites(player, entity)) return true;
        if (this.collisionBetweenBoundaries(playerBulletBoundaries, boundaries) && this.collisionBetweenSprites(playerBullet, entity)) return true;
        else return false;
    }

    collisionBetweenBoundaries(first: Boundaries, second: Boundaries): boolean {
        if (
            ((first.startX >= second.startX && first.startX <= second.startX + second.lengthX) ||
                (first.startX <= second.startX && first.startX + first.lengthX >= second.startX + second.lengthX) ||
                (first.startX + first.lengthX >= second.startX && first.startX + first.lengthX <= second.startX + second.lengthX)) &&
            ((first.startY >= second.startY && first.startY <= second.startY + second.lengthY) ||
                (first.startY <= second.startY && first.startY + first.lengthY >= second.startY + second.lengthY) ||
                (first.startY + first.lengthY >= second.startY && first.startY + first.lengthY <= second.startY + second.lengthY))
        )
            return true;
        else return false;
    }

    collisionBetweenSprites(playerOrHisBullet: Player | PlayerBullet, entity: IEntity): boolean {
        const firstSprite = this.getSprite(playerOrHisBullet.type, playerOrHisBullet.currentAnimationFrame);
        const secondSprite = this.getSprite(entity.type, entity.currentAnimationFrame);
        this.debugCollisionContext.putImageData(secondSprite, 0, 0);
        this.debugCollisionContext.putImageData(firstSprite, 20, 15);
        return true;
    }

    getEntityBoundaries(entity: IEntity | null): Boundaries {
        if (!entity) return { startX: 0, startY: 0, lengthX: 0, lengthY: 0 };
        return {
            startX: entity.positionX - entity.width / 2,
            startY: constants.HEIGHT - (entity.positionY - this.distance - entity.height / 2) + (entity.hitboxOffsetY || 0),
            lengthX: entity.width,
            lengthY: entity.height,
        };
    }

    handleTerrainCollision(entity: Entity) {
        switch (entity.type) {
            case "player": {
                this.destroyEntity(entity.id);
                break;
            }
            case "bullet": {
                this.destroyEntity(entity.id);
                break;
            }
            case "playerBullet": {
                console.log("niszcze bullet");
                this.destroyEntity(entity.id);
                break;
            }
            case "helicopter": {
                const helicopter = entity as Helicopter;
                helicopter.changeMovement("x", -helicopter.movingX as MovingIndicator);
                break;
            }
            case "animation": {
                break;
            }
            default: {
                console.log("unknown entity: ", entity.type);
            }
        }
    }

    destroyEntity(id: number) {
        const indexToDestroy = this.entities.findIndex((entity: Entity) => {
            return entity.id === id;
        });
        switch (this.entities[indexToDestroy].type) {
            case "player": {
                // handle losing here
                this.playerData.lifes--;
                break;
            }
            case "bullet": {
                const bullet = this.entities[indexToDestroy] as Bullet;
                const owner = bullet.owner as SAMEntity;
                this.entityShoot(owner);
                break;
            }
            case "playerBullet": {
                const player = this.findPlayer();
                if (!player) return;
                else player.hasBullet = false;
                break;
            }
            case "animation": {
                break;
            }
            case "helicopter": {
                this.createAnimatedEntity(this.entities[indexToDestroy]);
                break;
            }
            default: {
                console.log("unknown entity to destroy: ", this.entities[indexToDestroy].type, " not destroying");
            }
        }
        this.entities.splice(indexToDestroy, 1);
    }
}
