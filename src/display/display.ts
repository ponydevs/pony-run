import {
    PonyDisplay,
    PonyRenderProp,
    Cactus,
    Bird,
    Pony,
} from '../type/ponyRun';
import { Asset } from './asset';
import { mod } from '../util/mod';
import { h } from '../page/lib/hyper';

export interface PonyDisplayProp {
    asset: Asset;
    canvas: HTMLCanvasElement;
}

export const createDisplay = (prop: PonyDisplayProp): PonyDisplay => {
    let a = 0;

    const { asset, canvas } = prop;
    const ctx = canvas.getContext('2d');
    if (ctx === null) {
        throw ctx;
    }

    let bgPosX = 0;

    const render = (prop: PonyRenderProp) => {
        if (a % (60 * 4) === 0) {
            console.log('render', prop);
        }
        a++;

        renderBackground(prop.background);
        renderPony(prop.pony);

        prop.birdList.forEach(renderBird);
        prop.cactusList.forEach(renderCactus);
    };

    const renderBackground = (prop: PonyRenderProp['background']) => {
        const { scrollDelta } = prop;
        const scrollX = Math.abs(scrollDelta);
        bgPosX = mod(bgPosX - scrollX + 800, asset.background.width) - 800;

        for (let x = bgPosX; x < 800; x += asset.background.width) {
            ctx.drawImage(asset.background, x, 0);
        }
    };

    const renderBird = (bird: Bird) => {
        ctx.drawImage(asset.cactus, bird.x, bird.y);
    };
    const renderCactus = (cactus: Cactus) => {
        ctx.drawImage(asset.cactus, cactus.x, me.cactus.y);
    };
    const renderPony = async (pony: Pony) => {
        const image = asset.ponyFrameList[pony.spriteIndex];
        ctx.drawImage(image, me.pony.x, pony.y);
    };

    const me = {
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
            y: 160,
        },
        render,
        pony: {
            x: 100,
        },
        runningPony: {
            frameCount: asset.ponyFrameList.length,
            hitbox: {
                height: 80,
                width: 80,
                x: 10,
                y: 10,
            },
        },
    };

    return me;
};
