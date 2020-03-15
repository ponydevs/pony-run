import { PonyDisplay, PonyInput, PonyCore, Cactus } from '../type/ponyRun';

export interface CoreProp {
    display: PonyDisplay;
    input: PonyInput;
}

export const createCore = (prop: CoreProp): PonyCore => {
    const { display, input } = prop;
    const GROUND_LEVEL = 180;
    const MAX_JUMP_LEVEL = 125;
    const MAX_CACTUSES = 5;
    const cactuses: Cactus[] = [];
    let ponyJumpState = GROUND_LEVEL;
    let ponySprite: 'run' | 'jump' | 'crawl' = 'run';
    let jumping = false;
    let falling = false;
    let crouch = false;
    let spriteIndexFloat = 0;
    let spriteIndex = 0;
    let paused = true;
    let scrollDelta = 0;
    let speed = 1;
    let scoreFloat = 1;
    let score = 0;
    let jumpingAnimationProgress = -1;

    const getRandomFloat = (min: number, max: number) => {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    const _initCactuses = () => {
        const cactusesCount = Math.floor(MAX_CACTUSES * .75)
        const cactusAres = 500 / cactusesCount;
        for (let i = 0; i < cactusesCount; i++) {
            const startArea = 250 + i * cactusAres;
            cactuses.push({ x: getRandomFloat(startArea, startArea + cactusAres) });
        }
    }

    const setSprite = () => {
        if (jumping && ponySprite !== 'jump') ponySprite = 'jump';
        else if (crouch && ponySprite !== 'crawl') ponySprite = 'crawl';
        else if (!crouch && !jumping) ponySprite = 'run';
    }

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

    const animationLoop = (delta: number) => {
        spriteIndexFloat += delta * 0.020 * speed;

        if (ponySprite === 'run' && spriteIndexFloat > display.runningPony.frameCount) spriteIndexFloat = 0;
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
        else if (ponySprite === 'crawl' && spriteIndexFloat > display.crawlingPony.frameCount) spriteIndexFloat = display.crawlingPony.frameCount - 1;
        spriteIndex = Math.floor(spriteIndexFloat);
    }


    const spawnCactus = () => {
        const lastSpawnedCactus = (cactuses[cactuses.length - 1])
        const whereItCanSpawn = lastSpawnedCactus.x + 150;
        const range = whereItCanSpawn + 200
        cactuses.push({ x: getRandomFloat(whereItCanSpawn, range) })
    }

    const handleCaucuses = (delta: number) => {
        if (cactuses.length < MAX_CACTUSES) spawnCactus();

        const removeCactuses: Cactus[] = [];

        cactuses.forEach(c => {
            if (c.x < 0 - display.cactus.hitbox.width) removeCactuses.push(c);
            else c.x -= delta * 0.30 * speed;
        });
        removeCactuses.forEach(c => {
            const indexOf = cactuses.indexOf(c)
            cactuses.splice(indexOf, 1);
        });
    }

    const countScore = (delta: number) => {
        scoreFloat += delta * 0.01 * speed;
        score = Math.floor(scoreFloat);
    }

    const tick = (delta: number) => {

        if (!paused) {
            scrollDelta = delta * 0.5 * speed;
            calculateJump(scrollDelta);
            handleCaucuses(delta);
            countScore(delta);
            setSprite();
            animationLoop(delta);
        }
        display.render({
            // showHitbox: true,
            background: {
                scrollDelta,
            },
            birdList: [],
            cactusList: cactuses,
            pony: {
                y: ponyJumpState,
                spriteIndex: spriteIndex,
                spriteKind: ponySprite,
            },
            score,
            screen: 'play',
        });
    };

    const constructor = () => {
        _initCactuses()
        input.onJump(() => {
            if (paused) paused = false;
            if (!crouch) jumping = true;
        });
        input.onCrouch(() => {
            if (!jumping) {
                spriteIndexFloat = 0
                crouch = true
            };
        });
        input.onCrouchEnd(() => {
            crouch = false;
        });
    }
    constructor();

    return {
        tick,
    };
};
