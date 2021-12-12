export interface IEntity {
    readonly id: number;
    readonly type: string;
    positionX: number;
    positionY: number;
    width: number;
    height: number;
    currentAnimationFrame: number;
    lifetime?: number
    hitboxOffsetY?: number
    move?: (delta?: number) => void;
    changeFrame: () => void
}

export default class Entity implements IEntity {
    readonly id: number;
    readonly type: string;
    positionX: number;
    positionY: number;
    width: number;
    height: number;
    currentAnimationFrame = 0;
    lifetime?: number
    constructor(id: number, positionX: number, positionY: number, width: number, height: number) {
        this.id = id;
        this.positionX = positionX;
        this.positionY = positionY;
        this.width = width;
        this.height = height;
    }

    changeFrame(){}
}
