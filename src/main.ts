import { createCore } from './core/core';
import { getAsset } from './display/asset';
import { createDisplay } from './display/display';
import { createInput } from './input/input';
import { createWindowFocusManager } from './input/windowFocusManager';
import { createCoreMock } from './mock/coreMock';
import { init } from './page/init';
import { createTickManager } from './time/tickManager';
import { createTimeManager } from './time/timeManager';
import { ifEnabled } from './util/ifEnabled';

export const main = async () => {
    const { canvas } = init();
    const asset = await getAsset();
    const display = createDisplay({ asset, canvas });
    const input = createInput();
    let core = createCore({
        display,
        input,
    });

    ifEnabled('mcTest').do(() => {
        core = createCoreMock({
            display,
            input,
        });
    });

    const tickManager = createTickManager({
        timeManager: createTimeManager(),
        tick: core.tick,
    });

    const windowFocusManager = createWindowFocusManager({ window });

    windowFocusManager.onBlur(tickManager.pause);
    windowFocusManager.onFocus(tickManager.start);

    input.onTogglePause(tickManager.togglePause);

    tickManager.start();
};
