export interface Opponent {
    type: "helicopter";
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
        positionY: 1000,
        direction: -1,
        moving: true,
        shooting: true,
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
        type: "helicopter",
        positionX: 320,
        positionY: 1400,
        direction: -1,
        moving: false,
        shooting: true,
    },
];

export default opponents;
