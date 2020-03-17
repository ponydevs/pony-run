import { CallbackSetter } from './callbackType';

export interface WindowFocusManager {
    onBlur: CallbackSetter;
    onFocus: CallbackSetter;
    removeAll: () => void;
}

export interface WindowFocusManagerProp {
    window: Window;
}

export const createWindowFocusManager = (
    prop: WindowFocusManagerProp,
): WindowFocusManager => {
    let blurCallback = () => {};
    let focusCallback = () => {};

    const handleBlur = () => {
        blurCallback();
    };

    const handleFocus = () => {
        focusCallback();
    };

    window.addEventListener('blur', handleBlur, true);
    window.addEventListener('focus', handleFocus, true);

    const removeAll = () => {
        window.removeEventListener('blur', handleBlur, true);
        window.removeEventListener('focus', handleFocus, true);
    };

    return {
        onBlur: (callback) => {
            blurCallback = callback;
        },
        onFocus: (callback) => {
            focusCallback = callback;
        },
        removeAll,
    };
};
