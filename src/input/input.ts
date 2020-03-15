import { PonyInput } from '../type/ponyRun';
import { createKeyboardManager } from './keyboardManager';
import { createMouseManager } from './mouseManager';

export const createInput = (): PonyInput => {
    const keyboard = createKeyboardManager({
        element: document.body,
        evPropName: 'key',
    });

    const mouse = createMouseManager({
        element: document.body,
    });

    return {
        onCrouch: (callback: () => void) => {
            keyboard.onKeydown('Shift', callback);
            mouse.onLeftClickDown(callback);
        },
        onCrouchEnd: (callback: () => void) => {
            keyboard.onKeyup('Shift', callback);
            mouse.onLeftClickUp(callback);
        },
        onJump: (callback: () => void) => {
            keyboard.onKeydown(' ', callback);
            mouse.onRightClick(callback);
        },
        removeAll: () => {
            keyboard.removeAll();
        },
    };
};
