export type Opponent =
    | {
          type: "helicopter" | "shootingHelicopter" | "ship" | "balloon" | "plane" | "tank" | "fuel" | "bridge" | "bridgeTank";
          positionX: number;
          positionY: number;
          direction: -1 | 1; // left | right
          moving: boolean;
          shooting: boolean;
      }
    | {
          type: "fuel";
          positionX: number;
          positionY: number;
          direction: 1; // left | right
          moving: false;
          shooting: false;
      };

const opponents: Opponent[] = [
    {
        type: "ship",
        positionX: 510,
        positionY: 900,
        direction: -1,
        moving: false,
        shooting: false,
    },
    {
        type: "ship",
        positionX: 660,
        positionY: 1020,
        direction: -1,
        moving: false,
        shooting: false,
    },
    {
        type: "ship",
        positionX: 500,
        positionY: 1100,
        direction: -1,
        moving: false,
        shooting: false,
    },
    {
        type: "helicopter",
        positionX: 600,
        positionY: 1200,
        direction: 1,
        moving: true,
        shooting: false,
    },
    {
        type: "fuel",
        positionX: 550,
        positionY: 1380,
        direction: 1,
        moving: false,
        shooting: false,
    },
    {
        type: "helicopter",
        positionX: 250,
        positionY: 1340,
        direction: -1,
        moving: false,
        shooting: false,
    },
    {
        type: "helicopter",
        positionX: 180,
        positionY: 1430,
        direction: -1,
        moving: false,
        shooting: false,
    },
    {
        type: "fuel",
        positionX: 130,
        positionY: 1560,
        direction: 1,
        moving: false,
        shooting: false,
    },
    {
        type: "ship",
        positionX: 230,
        positionY: 1620,
        direction: 1,
        moving: true,
        shooting: false,
    },
    {
        type: "ship",
        positionX: 310,
        positionY: 1760,
        direction: 1,
        moving: false,
        shooting: false,
    },
    {
        type: "ship",
        positionX: 280,
        positionY: 1820,
        direction: 1,
        moving: true,
        shooting: false,
    },
    {
        type: "ship",
        positionX: 300,
        positionY: 1960,
        direction: 1,
        moving: false,
        shooting: false,
    },
    {
        type: "ship",
        positionX: 300,
        positionY: 2080,
        direction: 1,
        moving: false,
        shooting: false,
    },
    {
        type: "fuel",
        positionX: 500,
        positionY: 2150,
        direction: 1,
        moving: false,
        shooting: false,
    },
    {
        type: "fuel",
        positionX: 300,
        positionY: 2250,
        direction: 1,
        moving: false,
        shooting: false,
    },
    {
        type: "helicopter",
        positionX: 300,
        positionY: 2320,
        direction: 1,
        moving: true,
        shooting: false,
    },
    {
        type: "fuel",
        positionX: 490,
        positionY: 2450,
        direction: 1,
        moving: false,
        shooting: false,
    },
    {
        type: "ship",
        positionX: 520,
        positionY: 2520,
        direction: -1,
        moving: false,
        shooting: false,
    },
    {
        type: "ship",
        positionX: 490,
        positionY: 2590,
        direction: -1,
        moving: false,
        shooting: false,
    },
    {
        type: "fuel",
        positionX: 550,
        positionY: 2680,
        direction: 1,
        moving: false,
        shooting: false,
    },
    {
        type: "helicopter",
        positionX: 540,
        positionY: 2760,
        direction: -1,
        moving: false,
        shooting: false,
    },
    {
        type: "ship",
        positionX: 140,
        positionY: 2800,
        direction: 1,
        moving: false,
        shooting: false,
    },
    {
        type: "fuel",
        positionX: 620,
        positionY: 3000,
        direction: 1,
        moving: false,
        shooting: false,
    },
    {
        type: "fuel",
        positionX: 560,
        positionY: 3100,
        direction: 1,
        moving: false,
        shooting: false,
    },
    {
        type: "helicopter",
        positionX: 550,
        positionY: 3180,
        direction: 1,
        moving: false,
        shooting: false,
    },
    {
        type: "helicopter",
        positionX: 550,
        positionY: 3380,
        direction: -1,
        moving: false,
        shooting: false,
    },
    {
        type: "bridge",
        positionX: 406,
        positionY: 3533,
        direction: 1,
        moving: false,
        shooting: false,
    },
    {
        type: "bridgeTank",
        positionX: 20,
        positionY: 3514,
        direction: 1,
        moving: true,
        shooting: false,
    },
    {
        type: "balloon",
        positionX: 526,
        positionY: 3653,
        direction: 1,
        moving: false,
        shooting: false,
    },
    {
        type: "fuel",
        positionX: 306,
        positionY: 3933,
        direction: 1,
        moving: false,
        shooting: false,
    },
    {
        type: "ship",
        positionX: 406,
        positionY: 3993,
        direction: 1,
        moving: false,
        shooting: false,
    },
    {
        type: "ship",
        positionX: 306,
        positionY: 4133,
        direction: 1,
        moving: false,
        shooting: false,
    },
    {
        type: "fuel",
        positionX: 346,
        positionY: 4233,
        direction: 1,
        moving: false,
        shooting: false,
    },
    {
        type: "fuel",
        positionX: 306,
        positionY: 4300,
        direction: 1,
        moving: false,
        shooting: false,
    },
    {
        type: "ship",
        positionX: 456,
        positionY: 4400,
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
