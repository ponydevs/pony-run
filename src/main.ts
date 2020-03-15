import { createCore } from './core/core';
import { getAsset } from './display/asset';
import { createDisplay } from './display/display';
import { createInput } from './input/input';
import { createCoreMock } from './mock/coreMock';
import { init } from './page/init';
import { schedule } from './time/schedule';
import { createTimeManager } from './time/time';
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

    const time = createTimeManager();

    const mainLoop = schedule(() => {
        core.tick(time.delta());
    }, requestAnimationFrame);

    time.start();
    mainLoop();
};
