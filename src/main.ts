import { init } from './page/init';
import { createCore } from './core/core';
import { createDisplay } from './display/display';
import { createInput } from './input/input';
import { schedule } from './time/schedule';
import { createTimeManager } from './time/time';
import { getAsset } from './display/asset';

export const main = async () => {
    const { canvas } = init();
    const asset = await getAsset();
    const display = createDisplay({ asset, canvas });
    const input = createInput();
    const core = createCore({
        display,
        input,
    });

    const time = createTimeManager();

    const mainLoop = schedule(() => {
        core.tick(time.delta());
    }, requestAnimationFrame);

    time.start();
    mainLoop();
};
