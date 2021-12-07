import GameManager from "./GameManager";
import InputManager from "./InputManager";
import constants from "./Constants";

function setDimensions(canvas: HTMLCanvasElement) {
    canvas.width = constants.WIDTH
    canvas.height = constants.HEIGHT
}

const gameCanvas: HTMLCanvasElement = document.getElementById("main") as HTMLCanvasElement;
const context = gameCanvas.getContext("2d") as CanvasRenderingContext2D;
const interfaceCanvas: HTMLCanvasElement = document.getElementById("interface") as HTMLCanvasElement;
const interfaceContext = interfaceCanvas.getContext("2d") as CanvasRenderingContext2D;
const backgroundCanvas: HTMLCanvasElement = document.getElementById("background") as HTMLCanvasElement;
const backgroundContext = backgroundCanvas.getContext("2d") as CanvasRenderingContext2D;
context.imageSmoothingEnabled = false;

setDimensions(gameCanvas);
setDimensions(interfaceCanvas);
setDimensions(backgroundCanvas);
window.onresize = () => {
    setDimensions(gameCanvas);
    setDimensions(interfaceCanvas);
    setDimensions(backgroundCanvas);
};

const inputManager = new InputManager(document.body);
const gameManager = new GameManager(context, interfaceContext, backgroundContext, inputManager.getKeys());
