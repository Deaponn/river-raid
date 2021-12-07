export interface Keys {
    [key: string]: {
        press: boolean;
        longPress: boolean;
    };
}

export default class InputManager {
    private readonly htmlElement: HTMLElement;
    private readonly keysPressed: Keys;
    constructor(htmlElement: HTMLElement) {
        this.htmlElement = htmlElement;
        this.keysPressed = {};
        this.htmlElement.onkeydown = this.handleKeyDown.bind(this);
        this.htmlElement.onkeyup = this.handleKeyUp.bind(this);
    }

    handleKeyDown(event: KeyboardEvent): void {
        this.keysPressed[event.key] = { press: true, longPress: event.repeat };
    }

    handleKeyUp(event: KeyboardEvent): void {
        this.keysPressed[event.key] = { press: false, longPress: false };
    }

    getKeys(): Keys {
        return this.keysPressed;
    }
}
