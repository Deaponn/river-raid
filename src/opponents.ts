export interface Opponent {
    type: "helicopter" | "ship" | "balloon" | "plane" | "tank" | "fuel" | "bridge";
    positionX: number;
    positionY: number;
    direction: -1 | 1; // left | right
    moving: boolean;
    shooting: boolean;
}

const opponents: Opponent[] = [
    {
        type: "helicopter",
        positionX: 200,
        positionY: 1100,
        direction: -1,
        moving: true,
        shooting: true,
    },
    {
        type: "tank",
        positionX: 0,
        positionY: 1000,
        direction: 1,
        moving: true,
        shooting: true,
    },
    {
        type: "ship",
        positionX: 600,
        positionY: 1200,
        direction: 1,
        moving: true,
        shooting: false,
    },
    {
        type: "plane",
        positionX: 320,
        positionY: 1400,
        direction: -1,
        moving: true,
        shooting: false,
    },
    {
        type: "fuel",
        positionX: 320,
        positionY: 1500,
        direction: 1,
        moving: false,
        shooting: false,
    },
    {
        type: "bridge",
        positionX: 420,
        positionY: 3616,
        direction: 1,
        moving: false,
        shooting: false,
    },
];

export default opponents;
