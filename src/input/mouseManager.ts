import { RegisterFunction } from '../type/ponyRun';

export interface MouseManagerProp {
    element: HTMLElement;
}

export interface Handler<T extends string> {
    callback?: () => void;
    handle: (ev: any) => void;
    callbackSetter: NamedCallbackSetter<T>;
}

export type NamedCallbackSetter<T extends string> = {
    [K in T]: RegisterFunction;
};

export interface MouseManager {
    onLeftClickDown: RegisterFunction;
    onLeftClickUp: RegisterFunction;
    onRightClickDown: RegisterFunction;
    onRightClickUp: RegisterFunction;
    removeAll: () => void;
}

export const createMouseManager = (prop: MouseManagerProp): MouseManager => {
    const { element } = prop;

    const createHandler = <T extends string>(setterName: T): Handler<T> => {
        const me: Handler<T> = {
            callback: undefined,
            handle: (ev: MouseEvent) => {
                if (me.callback !== undefined) {
                    me.callback();
                    ev.preventDefault();
                }
            },
            callbackSetter: {
                [setterName]: (callback: () => void) => {
                    me.callback = callback;
                },
            } as NamedCallbackSetter<T>,
        };
        return me;
    };

    const leftClickDown = createHandler('onLeftClickDown');
    const leftClickUp = createHandler('onLeftClickUp');
    const rightClickDown = createHandler('onRightClickDown');
    const rightClickUp = createHandler('onRightClickUp');

    const handleDown = (ev: MouseEvent) => {
        ({
            [0]: leftClickDown.handle,
            [2]: rightClickDown.handle,
        }[ev.button]?.(ev));
    };

    const handleUp = (ev: MouseEvent) => {
        if (ev.button === 0) {
            leftClickUp.handle(ev);
        }
    };

    const handleRightUp = (ev: MouseEvent) => {
        rightClickUp.handle(ev);
    };

    element.addEventListener('mousedown', handleDown, true);
    element.addEventListener('mouseup', handleUp, true);
    element.addEventListener('contextmenu', handleRightUp, true);

    const removeAll = () => {
        // untested // TODO?
        element.removeEventListener('mousedown', handleDown, true);
        element.removeEventListener('mouseup', handleUp, true);
        element.removeEventListener('contextmenu', handleRightUp, true);
    };

    return {
        ...leftClickDown.callbackSetter,
        ...leftClickUp.callbackSetter,
        ...rightClickDown.callbackSetter,
        ...rightClickUp.callbackSetter,
        removeAll,
    };
};
