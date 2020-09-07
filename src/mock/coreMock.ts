import { CoreProp } from '../core/core';
import { PonyCore } from '../type/ponyRun';

const birdSpeed = -1;

export const createCoreMock = (prop: CoreProp): PonyCore => {
    const { display, input } = prop;

    input.onCrouch(() => console.log('crouch'));
    input.onCrouchEnd(() => console.log('crouchEnd'));
    input.onJump(() => console.log('jump'));

    let birdSpriteIndex = 0;
    let ponySpriteIndex = 0;

    let birdX = 2 * 800;
    let birdY = 50 + 50 * Math.random();

    let score = 0;

    const tick = (delta: number) => {
        const scrollDelta = -delta / 2;

        score += -scrollDelta;

        birdX += scrollDelta + birdSpeed;

        if (birdX < -display.bird.width) {
            birdX = 2 * 800;
            birdY = 50 + 150 * Math.random();
        }

        display.render({
            background: {
                scrollDelta,
            },
            birdList: [
                {
                    spriteIndex: Math.floor(birdSpriteIndex),
                    x: birdX,
                    y: birdY,
                },
            ],
            cactusList: [
                {
                    x: 200 + scrollDelta ** 2,
                },
            ],
            pony: {
                y: 176,
                spriteIndex: Math.floor(ponySpriteIndex),
                spriteKind: [
                    'run' as const,
                    'jump' as const,
                    'crawl' as const,
                    'crawl' as const,
                ][Math.floor(ponySpriteIndex * 4) % 4],
            },
            score: Math.floor(score),
            screen: 'play',
            showHitbox: true,
        });

        birdSpriteIndex += 0.4;
        birdSpriteIndex %= display.bird.frameCount;

        ponySpriteIndex += 0.05;
        ponySpriteIndex %= display.crawlingPony.frameCount;
    };

    return {
        tick,
    };
};
