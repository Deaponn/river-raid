import Entity from "./components/Entity";
import { MovingIndicator } from "./components/MovingEntity";

const width = 30
const height = 48

export class Fuel extends Entity {
    readonly type = "fuel";
    constructor(
        id: number,
        positionX: number,
        positionY: number
    ) {
        super(id, positionX, positionY, width, height);
    }
}
