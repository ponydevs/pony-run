// @ts-ignore
import backgroundUrl from '../../asset/background/background.png';
// @ts-ignore
import birdUrl from '../../asset/bird/rainbow-dash-swimming-697334-resized.gif';
// @ts-ignore
import cactusUrl from '../../asset/cactus/cactus.png';
// @ts-ignore
import jumpingPonyGifUrl from '../../asset/pinkie/jumping-122112-resize-50.gif';
// @ts-ignore
import runningPonyGifUrl from '../../asset/pinkie/running-1436106.gif';
// @ts-ignore
import crawlingPonyGifUrl from '../../asset/pinkie/crouching-1437074.gif';
import { promiseObjectAll } from '../util/promise';
import { loadGifCanvasList } from './loadGifFrameList';
import { loadImage } from './loadImage';

export interface Asset {
    background: HTMLImageElement;
    birdCanvasList: HTMLCanvasElement[];
    cactus: HTMLImageElement;
    crawlingPonyCanvasList: HTMLCanvasElement[];
    runningPonyCanvasList: HTMLCanvasElement[];
    jumpingPonyCanvasList: HTMLCanvasElement[];
}

export const getAsset = async (): Promise<Asset> => {
    const background = loadImage(backgroundUrl);
    const cactus = loadImage(cactusUrl);

    const birdCanvasList = loadGifCanvasList(birdUrl);
    const crawlingPonyCanvasList = loadGifCanvasList(crawlingPonyGifUrl);
    const runningPonyCanvasList = loadGifCanvasList(runningPonyGifUrl);
    const jumpingPonyCanvasList = loadGifCanvasList(jumpingPonyGifUrl);

    return promiseObjectAll<Asset>({
        background,
        birdCanvasList,
        cactus,
        crawlingPonyCanvasList,
        runningPonyCanvasList,
        jumpingPonyCanvasList,
    });
};
