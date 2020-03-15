// https://github.com/mathieucaroff/cellular-automaton-explorer-1d/blob/7cb4e7360f/src/display/keyboardManager.ts
//
// with:
// - me.onKeyup added
// - me.removeAll improved

export interface WithRemover {
    remove: () => void;
}

export interface KeyboardManagerProp {
    element: Element;
    evPropName: keyof KeyboardEvent;
}

export interface KeyboardManager {
    onKeydown: (key: string, callback: () => void) => WithRemover;
    onKeyup: (key: string, callback: () => void) => WithRemover;
    onBoth: (prop: {
        key: string;
        keydown: () => void;
        keyup: () => void;
    }) => WithRemover;
    removeAll: () => void;
}

export const createKeyboardManager = (
    prop: KeyboardManagerProp,
): KeyboardManager => {
    const { element, evPropName } = prop;

    type EventMap = Record<string, (() => void) | undefined>;
    let onKeydownMap: EventMap = {};
    let onKeyupMap: EventMap = {};

    const eventHandler = (closureName: string, onEventMap: EventMap) => (
        ev,
    ) => {
        const key = '' + ev[evPropName];
        const handler = onEventMap[key];
        if (handler !== undefined) {
            handler();
            ev.preventDefault();
        }
    };

    const handleKeydown = eventHandler('down', onKeydownMap);
    const handleKeyup = eventHandler('up', onKeyupMap);

    element.addEventListener('keydown', handleKeydown, true);
    element.addEventListener('keyup', handleKeyup, true);

    const removeAll = () => {
        // untested // TODO?
        onKeydownMap = {};
        onKeyupMap = {};
        element.removeEventListener('keydown', handleKeydown, true);
        element.removeEventListener('keyup', handleKeyup, true);
    };

    return {
        onKeydown: (key: string, callback: () => void) => {
            if (onKeydownMap[key] !== undefined) {
                throw new Error(`keyboard event ${key}(down) assigned twice`);
            }
            onKeydownMap[key] = callback;

            return {
                remove: () => {
                    delete onKeydownMap[key];
                },
            };
        },

        onKeyup: (key: string, callback: () => void) => {
            if (onKeyupMap[key] !== undefined) {
                throw new Error(`keyboard event ${key}(up) assigned twice`);
            }
            onKeyupMap[key] = callback;

            return {
                remove: () => {
                    delete onKeyupMap[key];
                },
            };
        },

        onBoth: (prop) => {
            const { key, keydown, keyup } = prop;
            if (onKeydownMap[key] !== undefined) {
                throw new Error(`keyboard event ${key}(down) assigned twice`);
            }
            if (onKeyupMap[key] !== undefined) {
                throw new Error(`keyboard event ${key}(up) assigned twice`);
            }

            onKeydownMap[key] = keydown;
            onKeyupMap[key] = keyup;

            return {
                remove: () => {
                    delete onKeydownMap[key];
                    delete onKeyupMap[key];
                },
            };
        },

        removeAll,
    };
};
