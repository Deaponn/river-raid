import Entity from "./components/Entity";
import { MovingIndicator } from "./components/MovingEntity";

const width = 140
const height = 42

export class Bridge extends Entity {
    readonly type = "bridge";
    tankId?: number
    constructor(
        id: number,
        positionX: number,
        positionY: number
    ) {
        super(id, positionX, positionY, width, height);
    }
}
