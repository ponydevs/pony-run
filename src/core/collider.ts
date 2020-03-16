import { PonyDisplay, Rect, Pony, Cactus } from "../type/ponyRun";
import { Obstacles } from "./obstacles";

export interface Collider {
    x: number;
    y: number;
    width: number;
    height: number;
}
export interface ColliderProp {
    display: PonyDisplay;
    endGame: () => void;
}

export interface CreateCollider {
    check: (ponyJumpState: number, ponySprite: Pony['spriteKind'], obstacles: Obstacles) => void;
}

export const createCollider = (props: ColliderProp) => {
    const { display, endGame } = props;

    const check = (ponyJumpState: number, ponySprite: Pony['spriteKind'], obstacles: Obstacles) => {
        let ponyHitbox: Rect;
        switch (ponySprite) {
            case 'crawl':
                ponyHitbox = { ...display.crawlingPony.hitbox };
                break;
            case 'jump':
                ponyHitbox = { ...display.jumpingPony.hitbox };
                break;
            default:
                ponyHitbox = { ...display.runningPony.hitbox };
                break;
        }
        ponyHitbox.y = ponyJumpState;
        ponyHitbox.x = display.pony.x
        obstacles.cactusList.forEach(c => {
            const cactusHitBox = { ...display.cactus.hitbox }
            cactusHitBox.x = c.x;
            cactusHitBox.y = display.cactus.y;
            if (isThereCollision(ponyHitbox, cactusHitBox)) {
                endGame();
            }
        });

        obstacles.birdListFloat.forEach(b => {
            const birdHitBox = { ...display.bird.hitbox }
            birdHitBox.x = b.x;
            birdHitBox.y = b.y;
            if (isThereCollision(ponyHitbox, birdHitBox)) {
                endGame();
            }
        });
    };

    const isThereCollision = (f: Collider, s: Collider): boolean => {
        if (
            f.x + f.width >= s.x &&
            f.x <= s.x + s.width &&
            f.y + f.height >= s.y &&
            f.y <= s.y + s.height
        ) {
            return true;
        }
        return false;
    }

    return {
        check,
    }
}
