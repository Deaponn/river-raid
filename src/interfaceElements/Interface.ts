import { Texture } from "../TextureManager";
import { PlayerData } from "../Engine";

export default class Interface {
    private readonly context: CanvasRenderingContext2D;
    private readonly background: Texture;
    private readonly fuelIndicator: Texture;
    private readonly life: Texture;
    private readonly blackDigits: Texture;
    private readonly yellowDigits: Texture;
    private readonly spaceBetweenDigits = 28
    constructor(context: CanvasRenderingContext2D, background: Texture, fuelIndicator: Texture, life: Texture, blackDigits: Texture, yellowDigits: Texture) {
        this.context = context;
        this.background = background;
        this.fuelIndicator = fuelIndicator;
        this.life = life;
        this.blackDigits = blackDigits;
        this.yellowDigits = yellowDigits;
    }

    draw(data: PlayerData) {
        this.context.drawImage(this.fuelIndicator.sourceCanvas, Math.round(65 + data.fuel * 1.51), 501); // drawing fuel indocator, max: 216, min: 65
        this.context.drawImage(this.background.sourceCanvas, 0, 454); // background
        this.drawScore(data.points.toString(), 330, 470, "yellow");
        this.drawScore(data.highscore.toString(), 710, 472);
        this.drawScore(data.bridge.toString(), 710, 500, "yellow");
        this.drawScore(data.gameId.toString(), 136, 524);
        this.drawLifes(data.lifes)
    }

    drawScore(points: string, startX: number, startY: number, color: "yellow" | "black" = "black") {
        const startingPoint = startX - ((points.length - 1) * this.spaceBetweenDigits)
        const chosenColor = color === "yellow" ? this.yellowDigits : this.blackDigits
        for (let i = 0; i < points.length; i++) {
            this.context.drawImage(chosenColor.sourceCanvas, chosenColor.frameWidth * parseInt(points[i]), 0, chosenColor.frameWidth, chosenColor.height, startingPoint + (i * this.spaceBetweenDigits), startY, chosenColor.frameWidth, chosenColor.height); // draw one digit
        }
    }

    drawLifes(lifes: number){
        for(let i = 0; i < lifes; i++){
            this.context.drawImage(this.life.sourceCanvas, 0, 0, this.life.frameWidth, this.life.height, 444 + (i * 40), 520, this.life.frameWidth, this.life.height)
        }
    }
}
