export const createTimeManager = () => {
    let last: number;
    return {
        start: () => {
            last = performance.now();
        },
        delta: () => {
            if (last === undefined) {
                throw 'Please call .start before .delta';
            }
            const now = performance.now();
            const result = now - last;
            last = now;
            return result;
        },
    };
};
