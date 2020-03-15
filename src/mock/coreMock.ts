import { CoreProp } from '../core/core';
import { PonyCore } from '../type/ponyRun';

export const createCoreMock = (prop: CoreProp): PonyCore => {
    const { display } = prop;

    let ponySpriteIndex = 0;

    const tick = (delta: number) => {
        const scrollDelta = delta / 2;

        display.render({
            background: {
                scrollDelta,
            },
            birdList: [],
            cactusList: [
                {
                    x: 200 + scrollDelta ** 2,
                },
            ],
            pony: {
                y: 176,
                spriteIndex: Math.floor(ponySpriteIndex),
                spriteKind: 'run',
            },
            score: 0,
            screen: 'play',
        });

        ponySpriteIndex += 0.25;
        ponySpriteIndex %= display.runningPony.frameCount;
    };

    return {
        tick,
    };
};
