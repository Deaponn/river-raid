export type Trajectory = (x: number) => number;

export function getTrajectory(lengthX: number) {
    const trajectory: Trajectory = (x) => {
        if (x <= lengthX) {
            const offset = Math.sqrt(-x+lengthX) - Math.sqrt(lengthX)
            return offset
        } else return 0;
    };
    return trajectory;
}
