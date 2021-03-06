import {
    PonyDisplay,
    PonyRenderProp,
    Cactus,
    Bird,
    Pony,
    Rect,
} from '../type/ponyRun';
import { Asset } from './asset';
import { mod } from '../util/mod';
import { showHitbox } from './showHitbox';

export interface PonyDisplayProp {
    asset: Asset;
    canvas: HTMLCanvasElement;
}

export interface Position {
    x: number;
    y: number;
}

export const createDisplay = (prop: PonyDisplayProp): PonyDisplay => {
    const { asset, canvas } = prop;
    const ctx = canvas.getContext('2d');
    if (ctx === null) {
        throw ctx;
    }

    let bgPosX = 0;

    const scoreLowPosition = {
        x: 10,
        y: 600 - 15,
    };

    const scoreCenterPosition = {
        x: 800 / 2 - 80,
        y: 600 / 2 - 10,
    };

    const render = (prop: PonyRenderProp) => {
        renderBackground(prop.background);
        renderPony(prop.pony);

        prop.birdList.forEach(renderBird);
        prop.cactusList.forEach(renderCactus);

        renderScore(
            prop.score,
            prop.screen === 'play' ? scoreLowPosition : scoreCenterPosition,
        );

        if (prop.showHitbox) {
            showHitbox(ctx, me, prop);
        }
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

    const renderPony = (pony: Pony) => {
        let image: HTMLCanvasElement;

        let list: HTMLCanvasElement[];
        if (pony.spriteKind === 'run') {
            list = asset.runningPonyCanvasList;
        } else if (pony.spriteKind === 'jump') {
            list = asset.jumpingPonyCanvasList;
        } else {
            list = asset.crawlingPonyCanvasList;
        }
        image = list[pony.spriteIndex];

        ctx.drawImage(image, me.pony.x, pony.y);
    };

    const renderScore = (score: number, scorePos: Position) => {
        ctx.font = "32px 'Courier New', Courier, monospace";
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'white';
        ctx.fillText('Score: ' + score, scorePos.x, scorePos.y);
        ctx.strokeText('Score: ' + score, scorePos.x, scorePos.y);
    };

    const me: PonyDisplay = {
        bird: spriteInfo({}, asset.birdCanvasList, {
            height: 15,
            width: 40,
            x: 5,
            y: 10,
        }),
        cactus: spriteInfo({ y: 160 }, [asset.cactus], {
            height: 50,
            width: 10,
            x: 14,
            y: 10,
        }),
        render,
        pony: {
            x: 100,
        },
        runningPony: spriteInfo({}, asset.runningPonyCanvasList, {
            height: 20,
            width: 48,
            x: 20,
            y: 15,
        }),
        jumpingPony: spriteInfo({}, asset.jumpingPonyCanvasList, {
            height: 35,
            width: 30,
            x: 15,
            y: 15,
        }),
        crawlingPony: spriteInfo({}, asset.crawlingPonyCanvasList, {
            height: 20,
            width: 30,
            x: 15,
            y: 25,
        }),
    };

    console.log('display', me);

    return me;
};

export const spriteInfo = <T>(extra: T, canvasList: any[], hitbox: Rect) => ({
    frameCount: canvasList.length,
    hitbox,
    height: canvasList[0].height,
    width: canvasList[0].width,
    ...extra,
});
