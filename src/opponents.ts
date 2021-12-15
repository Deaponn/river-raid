export type Opponent =
    | {
          type: "helicopter" | "shootingHelicopter" | "ship" | "balloon" | "plane" | "fuel" | "bridge";
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
      }
    | {
          type: "tank" | "bridgeTank";
          positionX: number;
          positionY: number;
          direction: -1 | 1;
          moving: true;
          shooting: false;
          shootAt: number;
      }
    | {
          type: "bridgeTank";
          positionX: number;
          positionY: number;
          direction: -1 | 1;
          moving: true;
          shooting: false;
          shootAt: number;
      };

const opponents: Opponent[] = [
    { type: "ship", positionX: 510, positionY: 3752, direction: -1, moving: false, shooting: false },
    { type: "ship", positionX: 660, positionY: 3872, direction: -1, moving: false, shooting: false },
    { type: "ship", positionX: 500, positionY: 3952, direction: -1, moving: true, shooting: false },
    { type: "helicopter", positionX: 600, positionY: 4052, direction: 1, moving: true, shooting: false },
    { type: "fuel", positionX: 550, positionY: 4232, direction: 1, moving: false, shooting: false },
    { type: "helicopter", positionX: 250, positionY: 4192, direction: -1, moving: false, shooting: false },
    { type: "helicopter", positionX: 180, positionY: 4282, direction: -1, moving: false, shooting: false },
    { type: "fuel", positionX: 130, positionY: 4412, direction: 1, moving: false, shooting: false },
    { type: "ship", positionX: 230, positionY: 4472, direction: 1, moving: true, shooting: false },
    { type: "ship", positionX: 310, positionY: 4612, direction: 1, moving: false, shooting: false },
    { type: "ship", positionX: 280, positionY: 4672, direction: 1, moving: true, shooting: false },
    { type: "ship", positionX: 300, positionY: 4812, direction: 1, moving: false, shooting: false },
    { type: "ship", positionX: 300, positionY: 4932, direction: 1, moving: false, shooting: false },
    { type: "fuel", positionX: 500, positionY: 5002, direction: 1, moving: false, shooting: false },
    { type: "fuel", positionX: 300, positionY: 5102, direction: 1, moving: false, shooting: false },
    { type: "helicopter", positionX: 300, positionY: 5172, direction: 1, moving: true, shooting: false },
    { type: "fuel", positionX: 490, positionY: 5302, direction: 1, moving: false, shooting: false },
    { type: "ship", positionX: 520, positionY: 5372, direction: -1, moving: false, shooting: false },
    { type: "ship", positionX: 490, positionY: 5442, direction: -1, moving: false, shooting: false },
    { type: "fuel", positionX: 550, positionY: 5532, direction: 1, moving: false, shooting: false },
    { type: "helicopter", positionX: 540, positionY: 5612, direction: -1, moving: false, shooting: false },
    { type: "ship", positionX: 140, positionY: 5652, direction: 1, moving: false, shooting: false },
    { type: "fuel", positionX: 620, positionY: 5852, direction: 1, moving: false, shooting: false },
    { type: "fuel", positionX: 560, positionY: 5952, direction: 1, moving: false, shooting: false },
    { type: "helicopter", positionX: 550, positionY: 6032, direction: 1, moving: false, shooting: false },
    { type: "helicopter", positionX: 550, positionY: 6232, direction: -1, moving: false, shooting: false },
    { type: "bridge", positionX: 406, positionY: 6385, direction: 1, moving: false, shooting: false },
    { type: "bridgeTank", positionX: 20, positionY: 6366, direction: 1, moving: true, shooting: false, shootAt: 390 },
    { type: "balloon", positionX: 526, positionY: 6505, direction: 1, moving: false, shooting: false },
    { type: "fuel", positionX: 306, positionY: 6785, direction: 1, moving: false, shooting: false },
    { type: "ship", positionX: 406, positionY: 6845, direction: 1, moving: false, shooting: false },
    { type: "ship", positionX: 306, positionY: 6985, direction: 1, moving: false, shooting: false },
    { type: "fuel", positionX: 346, positionY: 7085, direction: 1, moving: false, shooting: false },
    { type: "fuel", positionX: 306, positionY: 7152, direction: 1, moving: false, shooting: false },
    { type: "ship", positionX: 456, positionY: 7252, direction: 1, moving: false, shooting: false },
    { type: "bridge", positionX: 378, positionY: 9245, direction: 1, moving: false, shooting: false },
    { type: "bridge", positionX: 410, positionY: 12097, direction: 1, moving: false, shooting: false },
    { type: "bridge", positionX: 373, positionY: 14934, direction: 1, moving: false, shooting: false },
    { type: "bridge", positionX: 363, positionY: 17766, direction: 1, moving: false, shooting: false },
    { type: "bridge", positionX: 426, positionY: 20622, direction: 1, moving: false, shooting: false },
    { type: "bridge", positionX: 442, positionY: 23474, direction: 1, moving: false, shooting: false },
    { type: "bridge", positionX: 433, positionY: 26326, direction: 1, moving: false, shooting: false },
    { type: "bridge", positionX: 385, positionY: 29182, direction: 1, moving: false, shooting: false },
];

export default opponents;
