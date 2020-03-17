export type TimeManager = ReturnType<typeof createTimeManager>;

export const createTimeManager = () => {
    let last: number;
    let running = false;
    let timeElapsedBeforePause = 0;

    return {
        start: () => {
            console.assert(
                running === false,
                'start called while already running',
            );
            last = performance.now();
            running = true;
        },
        pause: () => {
            console.assert(running === true, 'pause called while not running');
            timeElapsedBeforePause = performance.now() - last;
            running = false;
        },
        delta: () => {
            console.assert(running === true, 'delta called while not running');
            const now = performance.now();
            const result = now - last;
            last = now;
            running = true; // Useless if the TimeManager is used correctly
            return result;
        },
    };
};
