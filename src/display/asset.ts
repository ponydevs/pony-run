// @ts-ignore
import backgroundUrl from '../../asset/background/background.png';
// @ts-ignore
import birdUrl from '../../asset/bird/rainbow-dash-swimming-697334-resized.gif';
// @ts-ignore
import cactusUrl from '../../asset/cactus/cactus.png';
// @ts-ignore
import ponyGifUrl from '../../asset/pinkie/running-1436106.gif';
import { promiseObjectAll } from '../util/promise';
import { loadGifFrameList } from './loadGifFrameList';
import { loadImage } from './loadImage';

export interface Asset {
    background: HTMLImageElement;
    birdCanvasList: HTMLCanvasElement[];
    cactus: HTMLImageElement;
    ponyCanvasList: HTMLCanvasElement[];
}

export const getAsset = async (): Promise<Asset> => {
    const background = loadImage(backgroundUrl);
    const cactus = loadImage(cactusUrl);

    const birdCanvasList = loadGifFrameList(birdUrl);
    const ponyCanvasList = loadGifFrameList(ponyGifUrl);

    return promiseObjectAll<Asset>({
        background,
        birdCanvasList,
        cactus,
        ponyCanvasList,
    });
};
