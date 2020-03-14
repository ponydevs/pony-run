import { PonyDisplay, PonyInput, PonyCore } from '../type/ponyRun';

export interface CoreProp {
    display: PonyDisplay;
    input: PonyInput;
}

export const createCore = (prop: CoreProp): PonyCore => {
    const { display, input } = prop;

    // input.onJump ...
    // input. ...

    const tick = (delta: number) => {
        // ...

        const scrollDelta = delta / 2;

        display.render({
            background: {
                scrollDelta,
            },
            birdList: [],
            cactusList: [],
            pony: {
                y: 20,
            } as any,
            score: 0,
            screen: 'play',
        });
    };

    return {
        tick,
    };
};
