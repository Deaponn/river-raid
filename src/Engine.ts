import Bullet from "./gameElements/Bullet";
import constants from "./Constants";
import Entity, { IEntity } from "./gameElements/components/Entity";
import { Opponent } from "./opponents";
import Player from "./gameElements/Player";
import PlayerBullet from "./gameElements/PlayerBullet";
import SAMEntity from "./gameElements/components/SAMEntity";
import { Balloon } from "./gameElements/Balloon";
import { Helicopter } from "./gameElements/Helicopter";
import { Ship } from "./gameElements/Ship";
import { Keys } from "./InputManager";
import MovingEntity, { MovingIndicator } from "./gameElements/components/MovingEntity";
import AnimationEntity from "./gameElements/components/AnimationEntity";
import { Plane } from "./gameElements/Plane";
import { Tank } from "./gameElements/Tank";
import TankBullet from "./gameElements/TankBullet";
import { Fuel } from "./gameElements/Fuel";
import { Bridge } from "./gameElements/Bridge";
import { ShootingHelicopter } from "./gameElements/ShootingHelicopter";
import SoundManager from "./SoundManager";

export interface Boundaries {
    startX: number;
    startY: number;
    lengthX: number;
    lengthY: number;
}

export interface EngineData {
    entities: IEntity[];
    distance: number;
}

export interface Overlap extends Boundaries {
    endX: number;
    endY: number;
}

const deathFrames = [
    [1, 2, 3, 2],
    [2, 3, 4, 3],
    [4, 5, 6, 5],
    [3, 4, 5, 4],
];

const refillFuelOnCollision = ["fuel"];
const omitCollisionWithPlayer = ["player", "playerBullet", "animation", "tankBullet"];
const omitTerrainCollision = ["plane", "animation", "tank", "tankBullet"];
const destroyOnCollision = ["player", "playerBullet", "bullet"];
const bounceOnCollision = ["helicopter", "shootingHelicopter", "ship", "balloon"];
const stopOnNoCollision = ["tank"];
const animatedMovement = ["helicopter", "shootingHelicopter", "tank"];

export default class Engine {
    private readonly mapCollisions: CanvasRenderingContext2D;
    readonly entities: IEntity[];
    private readonly getSprite: (name: string, frame: number, boundaries: Boundaries) => ImageData;
    private readonly getSpriteFragment: (name: string, frame: number, dx: number, dy: number, lenX: number, lenY: number) => ImageData;
    private readonly announcePlayerKill: (entityType: string) => void;
    private readonly refillFuel: () => void;
    private readonly soundPlayer: SoundManager;
    private opponents: Opponent[];
    private entityCounter = 0;
    private distance = 0;
    showcasing: boolean;

    constructor(
        map: CanvasRenderingContext2D,
        initialOpponents: Opponent[],
        getSprite: (name: string, frame: number) => ImageData,
        getSpriteFragment: (name: string, frame: number, dx: number, dy: number, lenX: number, lenY: number) => ImageData,
        announcePlayerKill: (entityType: string) => void,
        refillFuel: () => void,
        soundPlayer: SoundManager
    ) {
        this.mapCollisions = map;
        this.entities = [];
        this.opponents = initialOpponents;
        this.getSprite = getSprite;
        this.getSpriteFragment = getSpriteFragment;
        this.announcePlayerKill = announcePlayerKill;
        this.refillFuel = refillFuel;
        this.soundPlayer = soundPlayer;
    }

    getData(): EngineData {
        return { entities: this.entities, distance: this.distance };
    }

    getDistance(): number {
        return this.distance;
    }

    getPlayerAlive(): boolean {
        return !!this.findPlayer();
    }

    setDistance(newDistance: number): void {
        this.distance = newDistance;
    }

    putEnemiesData(enemiesToSpawn: Opponent[]) {
        this.opponents = enemiesToSpawn;
    }

    addPlayer(positionX: number) {
        this.entities.push(new Player(this.nextEntityId(), positionX, this.distance));
    }

    beginGame(enemiesToSpawn: Opponent[], positionX: number) {
        this.opponents = enemiesToSpawn;
        this.entities.length = 0;
        this.addPlayer(positionX);
    }

    triggerRefresh(delta: number, input: Keys): void {
        this.purgeEntities();
        this.spawnEnemy(this.testNewEnemy());
        this.handleInput(input);
        this.calculate(delta);
    }

    purgeEntities(): void {
        for (const entity of this.entities) {
            if (
                entity.positionY < this.distance + 100 ||
                entity.lifetime === 0 ||
                (entity.type === "tankBullet" && !this.getEntityById((entity as TankBullet).owner.id))
            ) {
                this.destroyEntity(entity.id, true);
            }
        }
    }

    getEntityById(id: number): IEntity | null {
        const index = this.entities.findIndex((entity: IEntity) => {
            return entity.id === id;
        });
        if (index !== -1) return this.entities[index] as IEntity;
        else return null;
    }

    testNewEnemy(): Opponent | null {
        if (
            this.opponents.length > 0 &&
            ((!this.showcasing && this.distance + 680 > this.opponents[0].positionY) || (this.showcasing && this.distance + 700 > this.opponents[0].positionY))
        )
            return this.opponents.shift()!;
        else return null;
    }

    spawnEnemy(data: Opponent | null): void {
        if (!data) return;
        switch (data.type) {
            case "helicopter": {
                const helicopter = new Helicopter(this.nextEntityId(), data.positionX, data.positionY, 0, 0, data.direction, 0);
                if (data.moving) helicopter.ruchable = true;
                this.entities.push(helicopter);
                break;
            }
            case "shootingHelicopter": {
                const shootingHelicopter = new ShootingHelicopter(this.nextEntityId(), data.positionX, data.positionY, 0, 0, data.direction, 0);
                if (data.moving) shootingHelicopter.ruchable = true;
                this.entities.push(shootingHelicopter);
                if (data.shooting) this.entityShoot(shootingHelicopter);
                break;
            }
            case "ship": {
                const ship = new Ship(this.nextEntityId(), data.positionX, data.positionY, 0, 0, data.direction, 0);
                if (data.moving) ship.ruchable = true;
                this.entities.push(ship);
                break;
            }
            case "balloon": {
                const balloon = new Balloon(this.nextEntityId(), data.positionX, data.positionY, 0, 0, data.direction, 0);
                if (data.moving) balloon.ruchable = true;
                this.entities.push(balloon);
                break;
            }
            case "bridge": {
                const bridge = new Bridge(this.nextEntityId(), data.positionX, data.positionY, 0, 0, data.direction, 0);
                this.entities.push(bridge);
                break;
            }
            case "plane": {
                const plane = new Plane(this.nextEntityId(), data.positionX, data.positionY, 5, 0, data.direction, 0);
                this.entities.push(plane);
                break;
            }
            case "tank": {
                const tank = new Tank(this.nextEntityId(), data.positionX, data.positionY, 1, 0, data.direction, 0, data.shootAt);
                this.entities.push(tank);
                break;
            }
            case "fuel": {
                const fuel = new Fuel(this.nextEntityId(), data.positionX, data.positionY, 0, 0, data.direction, 0);
                this.entities.push(fuel);
                break;
            }
            case "bridgeTank": {
                console.log("spawning bridge tank");
                const nextId = this.nextEntityId();
                const tank = new Tank(nextId, data.positionX, data.positionY, 1, 0, data.direction, 0, data.shootAt);
                tank.bridgeRiding = true;
                tank.guarded = true;
                const bridge = this.entities[this.entities.length - 1] as Bridge;
                bridge.tankId = nextId;
                tank.dontShootAfter = tank.movingX === 1 ? bridge.positionX - bridge.width / 2 : bridge.positionX + bridge.width / 2;
                this.entities.push(tank);
            }
        }
    }

    createAnimatedEntity(entity: IEntity, frames: 0 | 1 | 2 | 3 | number[]) {
        const animationFrames = typeof frames === "number" ? deathFrames[frames] : frames;
        this.entities.push(
            new AnimationEntity(this.nextEntityId(), entity.positionX, entity.positionY, entity.width, entity.height, entity.type, animationFrames)
        );
    }

    handleInput(input: Keys): void {
        const player = this.findPlayer();
        if (!player) return;
        if (input.a?.press) {
            player.changeMovement("x", -1);
            player.speedX = Math.min(player.speedX + (player.speedX + 1) / 30, player.maxSpeedX);
        }
        if (input.d?.press) {
            player.changeMovement("x", 1);
            player.speedX = Math.min(player.speedX + (player.speedX + 1) / 30, player.maxSpeedX);
        }
        if ((input.a?.press && input.d?.press) || (!input.a?.press && !input.d?.press)) {
            player.changeMovement("x", 0);
            player.speedX = 0;
        }
        if (input[" "]?.press) this.entityShoot(player);
        if (input.w?.press) {
            player.speedY = Math.min(player.speedY + (player.speedY + 1) / 70, player.maxSpeedY);
            this.soundPlayer.playSound("fastFlight");
        } else {
            player.speedY = 1;
            this.soundPlayer.playSound("flight");
        }
    }

    calculate(delta: number): void {
        const player = this.findPlayer();
        this.manageCollisions();
        this.updateEntities(delta);
        if (player && player.speedY === 1) this.distance += delta;
        else this.distance += delta * (player?.speedY || 0);
    }

    updateEntities(delta: number) {
        const player = this.findPlayer();
        for (const entity of this.entities) {
            if (entity.type !== "animation" && (!!player || this.showcasing) && this.distance + 600 > entity.positionY) entity.move?.(delta); // moving
            if (entity.type === "animation") (entity as AnimationEntity).updateState(delta);
            // updating death animation
            else if (animatedMovement.includes(entity.type)) entity.changeFrame(); // updating move animation
            if (entity.ruchable && Math.random() < 0.002) (entity as MovingEntity).speedX = 1;
        }
    }

    nextEntityId(): number {
        this.entityCounter++;
        return this.entityCounter;
    }

    findPlayer(): Player | null {
        const index = this.entities.findIndex((entity: Entity) => {
            return entity.type === "player";
        });
        if (index !== -1) return this.entities[index] as Player;
        else return null;
    }

    entityShoot(who: SAMEntity): void {
        if (!this.getEntityById(who.id)) return;
        const bullet = who.createBullet(this.nextEntityId());
        if (bullet) {
            this.entities.push(bullet);
            if (who.type === "player") this.soundPlayer.playSound("playerShoot");
            if (who.type === "shootingHelicopter") this.soundPlayer.playSound("helicopterShoot");
            if (who.type === "tank") this.soundPlayer.playSound("tankShoot");
        }
    }

    manageCollisions(): void {
        const player = this.findPlayer();
        for (const entity of this.entities) {
            const boundaries: Boundaries = this.getEntityBoundaries(entity);
            const collisionArea = this.mapCollisions?.getImageData(boundaries.startX, boundaries.startY, boundaries.lengthX, boundaries.lengthY) as ImageData;
            if (
                !omitTerrainCollision.includes(entity.type) &&
                this.checkTerrainCollision(collisionArea, this.getSprite(entity.type, entity.currentAnimationFrame, boundaries), entity.type === "player")
            ) {
                this.handleTerrainCollision(entity);
            }
            if (
                stopOnNoCollision.includes(entity.type) &&
                this.checkWaterCollision(collisionArea, this.getSprite(entity.type, entity.currentAnimationFrame, boundaries))
            ) {
                this.handleWaterCollision(entity as Tank);
            }
            if (player) {
                const playerBoundaries = this.getEntityBoundaries(player);
                const playerBullet = this.getEntityById(player.bulletId) as PlayerBullet;
                const playerBulletBoundaries = this.getEntityBoundaries(playerBullet);
                const entityCollision = this.checkEntityCollision(entity, boundaries, player, playerBullet, playerBoundaries, playerBulletBoundaries);
                if (entityCollision.collision) {
                    if (refillFuelOnCollision.includes(entity.type) && this.getEntityById(entityCollision.with)?.type === "player") {
                        this.refillFuel();
                    } else {
                        this.destroyEntity(entityCollision.with);
                        this.destroyEntity(entity.id);
                    }
                }
            }
        }
    }

    checkTerrainCollision(area: ImageData, entityFrame: ImageData, deeperCheck: boolean): boolean {
        // if (area.data.length !== entityFrame.data.length) this.debugCollisionContext.putImageData(entityFrame, 0, 0);
        for (let i = 0; i < area.data.length; i += 4) {
            if (area.data[i + 3] !== 3 && (!deeperCheck || ((area.data[i + 1] >= 60 || area.data[i] === 0) && entityFrame.data[i + 3] !== 0))) return true; // #003900
        }
        return false;
    }

    checkWaterCollision(area: ImageData, entityFrame: ImageData): boolean {
        for (let i = 0; i < area.data.length; i += 4) {
            if ((area.data[i] === 63 || area.data[i + 3] === 3) && entityFrame.data[i + 3] !== 0) return true;
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
    ): { collision: false; with?: number } | { collision: true; with: number } {
        if (omitCollisionWithPlayer.includes(entity.type)) return { collision: false };
        if (playerBullet && this.collisionBetweenBoundaries(playerBulletBoundaries, boundaries)) {
            return {
                collision:
                    this.collisionBetweenSprites(playerBullet, playerBulletBoundaries, entity, boundaries) &&
                    entity.type !== "bullet" &&
                    entity.type !== "tankBullet",
                with: playerBullet.id,
            };
        }
        if (this.collisionBetweenBoundaries(playerBoundaries, boundaries)) {
            return {
                collision:
                    this.collisionBetweenSprites(player, playerBoundaries, entity, boundaries) ||
                    (entity.type === "bullet" && entity.currentAnimationFrame === 0),
                with: player.id,
            };
        } else return { collision: false };
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

    collisionBetweenSprites(
        playerOrHisBullet: Player | PlayerBullet,
        playerOrHisBulletBoundaries: Boundaries,
        entity: IEntity,
        entityBoundaries: Boundaries
    ): boolean {
        const overlap: Overlap = {
            startX: Math.max(playerOrHisBulletBoundaries.startX, entityBoundaries.startX),
            startY: Math.max(playerOrHisBulletBoundaries.startY, entityBoundaries.startY),
            endX: Math.min(playerOrHisBulletBoundaries.startX + playerOrHisBulletBoundaries.lengthX, entityBoundaries.startX + entityBoundaries.lengthX),
            endY: Math.min(playerOrHisBulletBoundaries.startY + playerOrHisBulletBoundaries.lengthY, entityBoundaries.startY + entityBoundaries.lengthY),
            lengthX: 0,
            lengthY: 0,
        };

        overlap.lengthX = Math.abs(overlap.startX - overlap.endX);
        overlap.lengthY = Math.abs(overlap.startY - overlap.endY);

        if (overlap.lengthX < 1 || overlap.lengthY < 1) return false;

        const dx1 = Math.abs(playerOrHisBulletBoundaries.startX - overlap.startX);
        const dy1 = Math.abs(playerOrHisBulletBoundaries.startY - overlap.startY);
        const dx2 = Math.abs(entityBoundaries.startX - overlap.startX);
        const dy2 = Math.abs(entityBoundaries.startY - overlap.startY);

        const playerOrHisBulletSpriteFragment = this.getSpriteFragment(
            playerOrHisBullet.type,
            playerOrHisBullet.currentAnimationFrame,
            dx1,
            dy1,
            overlap.lengthX,
            overlap.lengthY
        );
        const entitySpriteFragment = this.getSpriteFragment(entity.type, entity.currentAnimationFrame, dx2, dy2, overlap.lengthX, overlap.lengthY);

        for (let i = 0; i < playerOrHisBulletSpriteFragment.data.length; i += 4) {
            if (playerOrHisBulletSpriteFragment.data[i + 3] !== 0 && entitySpriteFragment.data[i + 3] !== 0) return true;
        }

        return false;
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
        if (destroyOnCollision.includes(entity.type)) this.destroyEntity(entity.id);
        if (bounceOnCollision.includes(entity.type) && this.distance + 600 > entity.positionY) {
            const movingEntity = entity as MovingEntity;
            movingEntity.changeMovement("x", -movingEntity.movingX as MovingIndicator);
            // movingEntity.move(0.8)
        }
    }

    handleWaterCollision(tank: Tank) {
        // if (!tank.bridgeRiding) {
        if (!tank.bridgeRiding) {
            if (!tank.guarded) {
                this.destroyEntity(tank.id);
            } else {
                if (tank.speedX !== 0) {
                    this.entityShoot(tank);
                    tank.speedX = 0;
                    tank.positionX--;
                }
            }
        }
        // } else if (!tank.guarded) this.destroyEntity(tank.id);
    }

    destroyEntity(id: number, noPoints = false) {
        const indexToDestroy = this.entities.findIndex((entity: Entity) => {
            return entity.id === id;
        });
        switch (this.entities[indexToDestroy].type) {
            case "player": {
                // handle losing here
                this.soundPlayer.playSound("playerDeath");
                this.createAnimatedEntity(this.entities[indexToDestroy], 3);
                break;
            }
            case "bullet": {
                const bullet = this.entities[indexToDestroy] as Bullet;
                const owner = bullet.owner as SAMEntity;
                this.entityShoot(owner);
                if (bullet.exType === "tankBullet") {
                    this.createAnimatedEntity(this.entities[indexToDestroy], bullet.getRemainingFrames());
                }
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
                if (!noPoints) this.announcePlayerKill("helicopter");
                this.createAnimatedEntity(this.entities[indexToDestroy], 2);
                break;
            }
            case "shootingHelicopter": {
                if (!noPoints) this.announcePlayerKill("shootingHelicopter");
                this.createAnimatedEntity(this.entities[indexToDestroy], 2);
                break;
            }
            case "ship": {
                if (!noPoints) this.announcePlayerKill("ship");
                this.createAnimatedEntity(this.entities[indexToDestroy], 1);
                break;
            }
            case "balloon": {
                if (!noPoints) this.announcePlayerKill("balloon");
                this.createAnimatedEntity(this.entities[indexToDestroy], 0);
                break;
            }
            case "bridge": {
                if (!noPoints) this.announcePlayerKill("bridge");
                this.createAnimatedEntity(this.entities[indexToDestroy], 0);
                const bridge = this.entities[indexToDestroy] as Bridge;
                if (bridge.tankId && this.getEntityById(bridge.tankId)) {
                    const tank = this.getEntityById(bridge.tankId) as Tank;
                    tank.speedX = 0;
                    tank.bridgeRiding = false;
                    tank.guarded = false;
                    this.entityShoot(tank);
                }
                break;
            }
            case "fuel": {
                if (!noPoints) this.announcePlayerKill("fuel");
                this.createAnimatedEntity(this.entities[indexToDestroy], 0);
                break;
            }
            case "plane": {
                if (!noPoints) this.announcePlayerKill("plane");
                this.createAnimatedEntity(this.entities[indexToDestroy], 1);
                break;
            }
            case "tank": {
                if (!noPoints) this.announcePlayerKill("tank");
                this.createAnimatedEntity(this.entities[indexToDestroy], 2);
                break;
            }
            case "tankBullet": {
                const bullet = this.entities[indexToDestroy] as TankBullet;
                const owner = bullet.owner as SAMEntity;
                this.entityShoot(owner);
                this.createAnimatedEntity(this.entities[indexToDestroy], bullet.getRemainingFrames());
                break;
            }
            default: {
                console.log("unknown entity to destroy: ", this.entities[indexToDestroy].type, " not destroying");
            }
        }
        this.entities.splice(indexToDestroy, 1);
    }
}
