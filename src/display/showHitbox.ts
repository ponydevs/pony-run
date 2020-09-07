import { PonyDisplay, PonyRenderProp, SpriteInfo } from '../type/ponyRun';
import { spriteInfo } from './display';

const drawHitbox = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    info: SpriteInfo,
) => {
    ctx.strokeStyle = '#00FF00';
    const hb = info.hitbox;
    ctx.strokeRect(x + hb.x, y + hb.y, hb.width, hb.height);
};

export const showHitbox = (
    ctx: CanvasRenderingContext2D,
    display: PonyDisplay,
    prop: PonyRenderProp,
) => {
    prop.birdList.forEach(({ x, y }) => drawHitbox(ctx, x, y, display.bird));
    prop.cactusList.forEach(({ x }) =>
        drawHitbox(ctx, x, display.cactus.y, display.cactus),
    );

    let spriteInfo;
    if (prop.pony.spriteKind === 'run') {
        spriteInfo = display.runningPony;
    } else if (prop.pony.spriteKind === 'jump') {
        spriteInfo = display.jumpingPony;
    } else {
        spriteInfo = display.crawlingPony;
    }
    drawHitbox(ctx, display.pony.x, prop.pony.y, spriteInfo);
};
