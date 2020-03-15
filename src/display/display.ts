import {
    PonyDisplay,
    PonyRenderProp,
    Cactus,
    Bird,
    Pony,
} from '../type/ponyRun';
import { Asset } from './asset';
import { mod } from '../util/mod';

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
        const image = asset.birdCanvasList[bird.spriteIndex];
        ctx.drawImage(image, bird.x, bird.y);
    };
    const renderCactus = (cactus: Cactus) => {
        ctx.drawImage(asset.cactus, cactus.x, me.cactus.y);
    };
    const renderPony = async (pony: Pony) => {
        const image = asset.ponyCanvasList[pony.spriteIndex];
        ctx.drawImage(image, me.pony.x, pony.y);
    };

    const me: PonyDisplay = {
        bird: {
            frameCount: asset.birdCanvasList.length,
            hitbox: {
                height: 40,
                width: 40,
                x: 5,
                y: 5,
            },
            height: asset.birdCanvasList[0].height,
            width: asset.birdCanvasList[0].width,
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
            height: asset.cactus.height,
            width: asset.cactus.width,
        },
        render,
        pony: {
            x: 100,
        },
        runningPony: {
            frameCount: asset.ponyCanvasList.length,
            hitbox: {
                height: 40,
                width: 80,
                x: 10,
                y: 10,
            },
            height: asset.ponyCanvasList[0].height,
            width: asset.ponyCanvasList[0].width,
        },
    };

    return me;
};
