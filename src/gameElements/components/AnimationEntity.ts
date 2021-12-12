import Entity, { IEntity } from "./Entity";

interface IAnimationEntity {
    type: "animation";
    frameLength: number;
    currentTime: number;
    steps: number[];
}

export default class AnimationEntity extends Entity implements IEntity, IAnimationEntity {
    readonly type = "animation"
    readonly animatedEntity: string
    readonly frameLength = 20
    readonly steps: number[]
    hitboxOffsetY: number
    currentTime = 0
    constructor(id: number, positionX: number, positionY: number, width: number, height: number, animatedEntity: string, steps: number[]){
        super(id, positionX, positionY, width, height)
        this.animatedEntity = animatedEntity
        this.steps = steps
    }

    updateState(delta: number){
        this.currentTime += delta
        this.currentAnimationFrame = this.steps[Math.floor(this.currentTime / this.frameLength)]
        if(Math.floor(this.currentTime / this.frameLength) > this.steps.length - 1) this.lifetime = 0
    }
}
