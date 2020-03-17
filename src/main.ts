import { createCore } from './core/core';
import { getAsset } from './display/asset';
import { createDisplay } from './display/display';
import { createInput } from './input/input';
import { createCoreMock } from './mock/coreMock';
import { init } from './page/init';
import { createTimeManager } from './time/timeManager';
import { ifEnabled } from './util/ifEnabled';
import { createTickManager } from './time/tickManager';
import { createWindowFocusManager } from './input/windowFocusManager';

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

    const timeManager = createTimeManager();

    const tickManager = createTickManager({
        timeManager,
        tick: core.tick,
    });

    const windowFocusManager = createWindowFocusManager({ window });

    windowFocusManager.onBlur(tickManager.pause);
    windowFocusManager.onFocus(tickManager.start);

    tickManager.start();
};
