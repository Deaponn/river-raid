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
        positionX: 406,
        positionY: 3533, // 3316
        direction: 1,
        moving: false,
        shooting: false,
    },
    {
        type: "bridge",
        positionX: 378,
        positionY: 6393, // 6176 = 217
        direction: 1,
        moving: false,
        shooting: false,
    },
    {
        type: "bridge",
        positionX: 410,
        positionY: 9245, // 9028 = 217
        direction: 1,
        moving: false,
        shooting: false,
    },
    {
        type: "bridge",
        positionX: 373,
        positionY: 12082, // 11866 = 216
        direction: 1,
        moving: false,
        shooting: false,
    },
    {
        type: "bridge",
        positionX: 363,
        positionY: 14914, // 14698 = 216
        direction: 1,
        moving: false,
        shooting: false,
    },
    {
        type: "bridge",
        positionX: 426,
        positionY: 17770, // 17554 = 216
        direction: 1,
        moving: false,
        shooting: false,
    },
    {
        type: "bridge",
        positionX: 442,
        positionY: 20622, // 20404 = 218
        direction: 1,
        moving: false,
        shooting: false,
    },
    {
        type: "bridge",
        positionX: 433,
        positionY: 23474, // 23258 = 216
        direction: 1,
        moving: false,
        shooting: false,
    },
    {
        type: "bridge",
        positionX: 385,
        positionY: 26330, // 26112 = 218
        direction: 1,
        moving: false,
        shooting: false,
    },
];

export default opponents;
