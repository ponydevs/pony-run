import { h } from './lib/hyper';

export const init = () => {
    const canvas = h('canvas');

    document.body.appendChild(
        h('h1', {
            textContent: 'Pony Run',
        }),
    );

    document.body.appendChild(canvas);

    return { canvas };
};
