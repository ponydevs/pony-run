import { PonyDisplay, Pony } from "../type/ponyRun";

export interface SpriteHandlerProp {
    display: PonyDisplay;
}

interface SpriteInfo {
    spriteIndex: number;
    ponySprite: Pony['spriteKind'];
}

export interface SpriteHandler {
    tick: (delta: number, speed: number, jumpingAnimationProgress: number, jumping: boolean, crouch: boolean) => void;
    getSpriteInfo: () => SpriteInfo;
    reset: () => void;
    onCrouch: () => void;
}

export const createSpriteHandler = (props: SpriteHandlerProp) => {
    const { display } = props;
    let spriteIndexFloat = 0;
    let ponySprite: Pony['spriteKind'] = 'run';

    const animationLoop = (delta: number, speed: number, jumpingAnimationProgress: number) => {
        jumpingAnimationProgress = jumpingAnimationProgress === -1 ? 0 : jumpingAnimationProgress
        spriteIndexFloat += delta * 0.020 * speed;

        if (ponySprite === 'run' && spriteIndexFloat >= display.runningPony.frameCount) spriteIndexFloat = 0;
        else if (ponySprite === 'jump') {
            ///////////////////////////////////
            // JUMPING 65%  / LANDING %35   //
            //////////////////////////////////
            const maxJumpFrame = Math.floor(display.jumpingPony.frameCount * 0.65);

            if (jumpingAnimationProgress < 0.5) {
                spriteIndexFloat = jumpingAnimationProgress * maxJumpFrame / 0.5
            } else {
                const leftJumpFrames = display.jumpingPony.frameCount - maxJumpFrame
                spriteIndexFloat = maxJumpFrame + (jumpingAnimationProgress - 0.5) * leftJumpFrames / 0.5
            }
        }
        else if (ponySprite === 'crawl' && spriteIndexFloat >= display.crawlingPony.frameCount) spriteIndexFloat = display.crawlingPony.frameCount - 1;
    }

    const setSprite = (jumping: boolean, crouch: boolean) => {
        if (jumping && ponySprite !== 'jump') ponySprite = 'jump';
        else if (crouch && ponySprite !== 'crawl') ponySprite = 'crawl';
        else if (!crouch && !jumping) ponySprite = 'run';
    }

    const onCrouch = () => {
        spriteIndexFloat = 0;
    }

    const tick = (delta: number, speed: number, jumpingAnimationProgress: number, jumping: boolean, crouch: boolean) => {
        setSprite(jumping, crouch);
        animationLoop(delta, speed, jumpingAnimationProgress);
    }

    const getSpriteInfo = (): SpriteInfo => {
        return {
            spriteIndex: Math.floor(spriteIndexFloat),
            ponySprite,
        }
    }

    const reset = () => {
        ponySprite = 'run';
        spriteIndexFloat = 0;
    }

    return {
        tick,
        getSpriteInfo,
        reset,
        onCrouch,
    }

}