import { h } from './lib/hyper';

export let setLayout = () => {
    document.body.appendChild(
        h('h1', {
            textContent: 'Ponyrun',
        }),
    );
};
