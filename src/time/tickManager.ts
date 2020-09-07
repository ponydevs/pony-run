import { TimeManager } from './timeManager';

export interface TickManager {
    start: () => void;
    pause: () => void;
    togglePause: () => void;
}

export interface TickManagerProp {
    timeManager: TimeManager;
    tick: (delta: number) => void;
}

export const createTickManager = (prop: TickManagerProp): TickManager => {
    const { timeManager, tick } = prop;

    let running = false;

    const loop = () => {
        if (running) {
            tick(timeManager.delta());
            requestAnimationFrame(loop);
        }
    };

    const me = {
        start: () => {
            running = true;
            timeManager.start();
            loop();
        },
        pause: () => {
            running = false;
            timeManager.pause();
        },
        togglePause: () => {
            if (running) {
                me.pause();
            } else {
                me.start();
            }
        },
    };

    return me;
};
