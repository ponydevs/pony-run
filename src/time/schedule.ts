export const schedule = (
    run: () => void,
    schedulerFunction: (run: () => void) => void,
) => {
    const loop = () => {
        run();
        schedulerFunction(loop);
    };

    return loop;
};
