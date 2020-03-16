import { PonyDisplay, PonyInput, PonyCore, PonyRenderProp } from '../type/ponyRun';
import { createCollider, CreateCollider } from './collider';
import { ifEnabled } from '../util/ifEnabled';
import { createObstacles, CreateObstacles } from './obstacles';
import { SpriteHandler, createSpriteHandler } from './sprites';

export interface CoreProp {
    display: PonyDisplay;
    input: PonyInput;
}
export const createCore = (prop: CoreProp): PonyCore => {
    const { display, input } = prop;

    let collider: CreateCollider;
    let obstacles: CreateObstacles;
    let spriteHandler: SpriteHandler;

    const GROUND_LEVEL = 180;
    const MAX_JUMP_LEVEL = 125;
    const SCORE_THAT_SHOULD_STOP_ACCELERATING = 3000;
    let MAX_SPEED = 2;
    let START_SPEED = 1;
    let speed = START_SPEED;
    let ponyJumpState = GROUND_LEVEL;

    let godMode = false;
    let screen: PonyRenderProp['screen'] = 'play';
    let jumping = false;
    let falling = false;
    let crouch = false;
    let jumpingAnimationProgress = -1;
    let paused = true;
    let scrollDelta = 0;
    let scoreFloat = 0;
    let score = 0;
    let showHitbox = false;

    const experimental = () => {
        ifEnabled('hitboxes').do(() => {
            showHitbox = true;
        });
        ifEnabled('insanemode').do(() => {
            START_SPEED = 2;
        });
        ifEnabled('slowmode').do(() => {
            MAX_SPEED = 0.5;
            START_SPEED = 0.5;
        });
        ifEnabled('godmode').do(() => {
            godMode = true;
        });
    };

    const calculateJump = (delta: number) => {
        if (!jumping) return;
        const jumpSpeed = delta * 2 * speed;
        const maxJumpHeight = GROUND_LEVEL - MAX_JUMP_LEVEL
        const safeLowestPercentage = 0.25;

        const jumpStatus = ponyJumpState - maxJumpHeight;
        const percentage = jumpStatus / MAX_JUMP_LEVEL;
        const percentageInverted = (percentage * -1) + 1

        if (falling) {
            jumpingAnimationProgress = 0.5 + (percentage * 0.5);
            let correctedPercentage = percentage;
            if (correctedPercentage < safeLowestPercentage) correctedPercentage = safeLowestPercentage;
            ponyJumpState += jumpSpeed * correctedPercentage;
        } else {
            jumpingAnimationProgress = percentageInverted * 0.5;
            let correctedPercentage = percentage;
            if (correctedPercentage < safeLowestPercentage) correctedPercentage = safeLowestPercentage;
            ponyJumpState -= jumpSpeed * correctedPercentage;
        }

        if (ponyJumpState > GROUND_LEVEL) {
            jumping = false;
            falling = false;
            ponyJumpState = GROUND_LEVEL;
            jumpingAnimationProgress = -1;
        }
        if (ponyJumpState < maxJumpHeight) {
            falling = true;
            ponyJumpState = maxJumpHeight;
        }
    }


    const accelerateGame = () => {
        speed = START_SPEED + (score * MAX_SPEED / SCORE_THAT_SHOULD_STOP_ACCELERATING);
    }

    const endGame = () => {
        paused = true;
        screen = 'score';
    };

    const startGame = () => {
        if (screen === 'score') {
            spriteHandler.reset();
            scoreFloat = 0;
            obstacles.reset();
            screen = 'play';
            speed = START_SPEED;
        }
    }

    const countScore = (delta: number) => {
        scoreFloat += delta * 0.01 * speed;
        score = Math.floor(scoreFloat);
    }

    const tick = (delta: number) => {
        const ob = obstacles.getObstacles();
        const { ponySprite, spriteIndex } = spriteHandler.getSpriteInfo();
        if (!paused) {
            spriteHandler.tick(delta, speed, jumpingAnimationProgress, jumping, crouch)
            scrollDelta = delta * 0.5 * speed;
            obstacles.tick(delta, speed, scoreFloat);
            calculateJump(scrollDelta);
            countScore(delta);
            accelerateGame();
            if (!godMode) collider.check(ponyJumpState, ponySprite, ob)
        } else scrollDelta = 0;

        display.render({
            showHitbox,
            background: {
                scrollDelta,
            },
            birdList: ob.birdList,
            cactusList: ob.cactusList,
            pony: {
                y: ponyJumpState,
                spriteIndex,
                spriteKind: ponySprite,
            },
            score,
            screen,
        });
    };

    const constructor = () => {
        experimental();
        obstacles = createObstacles({ display, GROUND_LEVEL, MAX_JUMP_LEVEL });
        collider = createCollider({ display, endGame })
        spriteHandler = createSpriteHandler({ display });
        input.onJump(() => {
            if (screen === 'score') startGame();

            if (paused) paused = false;
            else if (!crouch) jumping = true;
        });
        input.onCrouch(() => {
            if (screen === 'score') return;
            if (!jumping) {
                spriteHandler.onCrouch();
                crouch = true
            };
        });
        input.onCrouchEnd(() => {
            if (screen === 'score') return;
            crouch = false;
        });
    }
    constructor();

    return {
        tick,
    };
};
