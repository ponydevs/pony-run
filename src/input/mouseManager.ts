export interface WithRemover {
    remove: () => void;
}

export interface MouseManagerProp {
    element: HTMLElement;
}

export interface Handler<T extends string> {
    callback?: () => void;
    handle: (ev: any) => void;
    callbackSetter: CallbackSetter<T>;
}

export type CallbackSetter<T extends string> = {
    [K in T]: SetCallback;
};

export type SetCallback = (callback: () => void) => void;

export interface MouseManager {
    onLeftClickDown: SetCallback;
    onLeftClickUp: SetCallback;
    onRightClickDown: SetCallback;
    onRightClickUp: SetCallback;
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
            } as CallbackSetter<T>,
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
