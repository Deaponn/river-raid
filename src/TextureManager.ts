export interface Texture {
    width: number;
    height: number;
    sprites: number;
    frameWidth: number;
    sourceCanvas: HTMLCanvasElement;
}

export interface Textures {
    [key: string]: Texture;
}

interface Source {
    path: string;
    sprites: number;
}

export default class TextureManager {
    private readonly gameplaySourceList: Source[];
    private readonly interfaceSourceList: Source[];
    textures: Textures;
    constructor() {
        this.gameplaySourceList = [
            {
                path: "balloon.png",
                sprites: 4,
            },
            {
                path: "bridge.png",
                sprites: 4,
            },
            {
                path: "bullet.png",
                sprites: 10,
            },
            {
                path: "fuel.png",
                sprites: 4,
            },
            {
                path: "helicopter.png",
                sprites: 7,
            },
            {
                path: "shootingHelicopter.png",
                sprites: 7,
            },
            {
                path: "map.png",
                sprites: 1,
            },
            {
                path: "plane.png",
                sprites: 5,
            },
            {
                path: "player.png",
                sprites: 6,
            },
            {
                path: "playerBullet.png",
                sprites: 1,
            },
            {
                path: "ship.png",
                sprites: 5,
            },
            {
                path: "tank.png",
                sprites: 7,
            },
        ];
        this.interfaceSourceList = [
            {
                path: "activision.png",
                sprites: 1,
            },
            {
                path: "fuel_indicator.png",
                sprites: 1,
            },
            {
                path: "interface.png",
                sprites: 1,
            },
            {
                path: "life.png",
                sprites: 1,
            },
            {
                path: "digits_black.png",
                sprites: 10,
            },
            {
                path: "digits_yellow.png",
                sprites: 10,
            },
        ];
        this.textures = {};
    }

    async load() {
        for (let i = 0; i < this.gameplaySourceList.length; i++) {
            await this.loadTexture(this.gameplaySourceList[i], "../assets/gameplay/");
        }
        for (let i = 0; i < this.interfaceSourceList.length; i++) {
            await this.loadTexture(this.interfaceSourceList[i], "../assets/interface/");
        }
    }

    async loadTexture(source: Source, catalog: string): Promise<void> {
        return new Promise((resolve, reject) => {
            const image: HTMLImageElement = new Image();
            const canvas: HTMLCanvasElement = document.createElement("canvas");
            const context = canvas.getContext("2d") as CanvasRenderingContext2D;
            const name = source.path.replace(/\..*/, "");
            image.src = catalog + source.path;
            image.onload = (event: Event) => {
                canvas.width = image.naturalWidth;
                canvas.height = image.naturalHeight;
                context.drawImage(image, 0, 0);
                this.textures[name] = {
                    width: canvas.width,
                    height: canvas.height,
                    sprites: source.sprites,
                    frameWidth: canvas.width / source.sprites,
                    sourceCanvas: canvas,
                };
                resolve();
            };
        });
    }

    getSprite(name: string, frame: number): ImageData {
        if (name === "animation") return (this.textures.helicopter.sourceCanvas.getContext("2d") as CanvasRenderingContext2D).getImageData(-1, -1, 1, 1);
        const texture = this.textures[name];
        const context = texture.sourceCanvas.getContext("2d") as CanvasRenderingContext2D;
        return context.getImageData(frame * texture.frameWidth, 0, texture.frameWidth, texture.height);
    }

    getSpriteFragment(name: string, frame: number, dx: number, dy: number, lenX: number, lenY: number): ImageData {
        if (name === "animation") return (this.textures.helicopter.sourceCanvas.getContext("2d") as CanvasRenderingContext2D).getImageData(-1, -1, 1, 1);
        const texture = this.textures[name];
        const context = texture.sourceCanvas.getContext("2d") as CanvasRenderingContext2D;
        return context.getImageData((frame * texture.frameWidth) + dx, 0 + dy, lenX, lenY);
    }
}
