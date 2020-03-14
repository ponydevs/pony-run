import { PonyDisplay } from '../type/ponyRun';

export interface PonyDisplayProp {
    canvas: HTMLCanvasElement;
}

export const createDisplay = (prop: PonyDisplayProp): PonyDisplay => {
    let a = 0;

    const { canvas } = prop;
    const ctx = canvas.getContext('2d');
    if (ctx === null) {
        throw ctx;
    }

    const render = (prop) => {
        if (a % (60 * 4) === 0) {
            console.log('render', prop);
        }
        a++;
    };

    return {
        bird: {
            frameCount: 5,
            hitbox: {
                height: 40,
                width: 40,
                x: 5,
                y: 5,
            },
        },
        cactus: {
            frameCount: 1,
            hitbox: {
                height: 90,
                width: 20,
                x: 10,
                y: 10,
            },
        },
        render,
        runningPony: {
            frameCount: 5,
            hitbox: {
                height: 80,
                width: 80,
                x: 10,
                y: 10,
            },
        },
    };
};
