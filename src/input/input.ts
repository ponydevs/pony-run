import { PonyInput } from '../type/ponyRun';

export const createInput = (): PonyInput => {
    return {
        onCrouch: () => {},
        onCrouchEnd: () => {},
        onJump: () => {},
    };
};
