import { h } from './lib/hyper';
import { githubCornerHTML } from './lib/githubCorner';

export const init = () => {
    const canvas = h('canvas');
    canvas.width = 800;
    canvas.height = 600;

    document.body.append(
        h('h1', {
            textContent: 'Pony Run',
        }),
        canvas,
        h('div', {
            innerHTML: githubCornerHTML('https://github.com/ponydevs/pony-run'),
        }),
    );

    return { canvas };
};
