import { h } from '../page/lib/hyper';

/**
 * Load an image, encapsulated in a promise which garantees that the loading
 * has completed.
 *
 * @param url url of the image
 */
export const loadImage = async (url: string): Promise<HTMLImageElement> => {
    let resolve;

    const onload = () => resolve();

    const image = h('img', { onload, src: url });

    await new Promise((resFunc) => {
        resolve = resFunc;
    });

    return image;
};
