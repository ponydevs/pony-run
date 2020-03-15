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
    onRightClick: SetCallback;
    removeAll: () => void;
}

export const createMouseManager = (prop: MouseManagerProp): MouseManager => {
    const { element } = prop;

    const createHandler = <T extends string>(setterName: T): Handler<T> => {
        const me: Handler<T> = {
            callback: undefined,
            handle: (ev) => {
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
    const rightClick = createHandler('onRightClick');

    element.addEventListener('mousedown', leftClickDown.handle, true);
    element.addEventListener('mouseup', leftClickUp.handle, true);
    element.addEventListener('contextmenu', rightClick.handle, true);

    const removeAll = () => {
        // untested // TODO?
        element.removeEventListener('mousedown', leftClickDown.handle, true);
        element.removeEventListener('mouseup', leftClickUp.handle, true);
        element.removeEventListener('contextmenu', rightClick.handle, true);
    };

    return {
        ...leftClickDown.callbackSetter,
        ...leftClickUp.callbackSetter,
        ...rightClick.callbackSetter,
        removeAll,
    };
};
