export interface Actions {
    horizontalAction: -1 | 0 | 1;
    verticalAction: -1 | 0 | 1;
    shoot: 0 | 1;
}

interface Keys {
    [key: string]: boolean;
}

export default class InputManager {
    private readonly htmlElement: HTMLElement;
    private readonly keysPressed: Keys;
    private static readonly bindings = {
        turnLeft: ["a", "A", "ArrowLeft"],
        turnRight: ["d", "D", "ArrowRight"],
        accelerate: ["w", "W", "ArrowUp"],
        slowDown: ["s", "S", "ArrowDown"],
        shoot: [" ", "z", "Z"]
    };
    constructor(htmlElement: HTMLElement) {
        this.htmlElement = htmlElement;
        this.keysPressed = {};
        this.htmlElement.onkeydown = this.handleKeyDown.bind(this);
        this.htmlElement.onkeyup = this.handleKeyUp.bind(this);
    }

    handleKeyDown(event: KeyboardEvent): void {
        this.keysPressed[event.key] = true;
    }

    handleKeyUp(event: KeyboardEvent): void {
        this.keysPressed[event.key] = false;
    }

    getActions(): Actions {
        let horizontalCount = 0;
        let verticalCount = 0;
        let shoot = 0;
        for (const [key, value] of Object.entries(this.keysPressed)) {
            if (value && InputManager.bindings.turnLeft.includes(key)) horizontalCount--;
            if (value && InputManager.bindings.turnRight.includes(key)) horizontalCount++;
            if (value && InputManager.bindings.accelerate.includes(key)) verticalCount++;
            if (value && InputManager.bindings.slowDown.includes(key)) verticalCount--;
            if (value && InputManager.bindings.shoot.includes(key)) shoot++;
        }
        return {
            horizontalAction: Math.sign(horizontalCount) as -1 | 0 | 1,
            verticalAction: Math.sign(verticalCount) as -1 | 0 | 1,
            shoot: Math.sign(shoot) as 0 | 1
        };
    }
}
