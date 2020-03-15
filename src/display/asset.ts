// @ts-ignore
import backgroundUrl from '../../asset/background/background.png';
// @ts-ignore
import cactusUrl from '../../asset/cactus/cactus.png';
// @ts-ignore
// import ponyGifUrl from '../../asset/pinkie/running-1436106.gif';
// import { loadGifFrameList } from './loadGifFrameList';
import { loadImage } from './loadImage';
import { promiseObjectAll } from '../util/promise';

export interface Asset {
    background: HTMLImageElement;
    cactus: HTMLImageElement;
}

export const getAsset = async (): Promise<Asset> => {
    const background = loadImage(backgroundUrl);
    const cactus = loadImage(cactusUrl);

    // const ponyFrameList = loadGifFrameList(ponyGifUrl);

    return promiseObjectAll<Asset>({
        background,
        cactus,
    });
};
