export interface PonyInput {
    onJump: RegisterFunction;
    onCrouch: RegisterFunction;
    onCrouchEnd: RegisterFunction;
    removeAll: () => void;
}

export type RegisterFunction = (callback: () => void) => void;

export interface PonyCore {
    tick: (delta: number) => void;
}

export interface PonyDisplay {
    render: (prop: PonyRenderProp) => void;
    bird: SpriteInfo;
    cactus: SpriteInfo & WithY;
    pony: WithX;
    runningPony: SpriteInfo;
    jumpingPony: SpriteInfo;
}

export interface PonyRenderProp {
    background: Background;
    birdList: Bird[];
    cactusList: Cactus[];
    screen: 'play' | 'score';
    pony: Pony;
    score: number;
    showHitbox?: boolean;
}

export interface Background {
    scrollDelta: number;
}

export interface Bird {
    x: number;
    y: number;
    spriteIndex: number;
}

export interface Cactus {
    x: number;
}

export interface Pony {
    y: number;
    spriteKind: 'run' | 'jump' | 'crawl';
    spriteIndex: number;
}

export interface Rect {
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface SpriteInfo {
    frameCount: number;
    height: number;
    hitbox: Rect;
    width: number;
}

export interface WithX {
    x: number;
}

export interface WithY {
    y: number;
}
