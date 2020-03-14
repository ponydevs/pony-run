export interface PonyInput {
    onJump: RegisterFunction;
    onCrouch: RegisterFunction;
    onCrouchEnd: RegisterFunction;
}

export type RegisterFunction = (callback: () => void) => void;

export interface PonyDisplay {
    render: (prop: PonyRenderProp) => void;
    bird: SpriteInfo;
    cactus: SpriteInfo;
    runningPony: SpriteInfo;
}

export interface PonyRenderProp {
    background: Background;
    birdList: Bird[];
    cactusList: Cactus[];
    screen: 'play' | 'score';
    pony: Pony;
    score: number;
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
    spriteKind: 'run' | 'jump';
    spriteIndex: number;
}

export interface Rect {
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface SpriteInfo {
    hitbox: Rect;
    frameCount: number;
}
