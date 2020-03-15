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
import { promiseObjectAll } from '../util/promise';
import { loadGifFrameList } from './loadGifFrameList';
import { loadImage } from './loadImage';

export interface Asset {
    background: HTMLImageElement;
    birdCanvasList: HTMLCanvasElement[];
    cactus: HTMLImageElement;
    runningPonyCanvasList: HTMLCanvasElement[];
    jumpingPonyCanvasList: HTMLCanvasElement[];
}

export const getAsset = async (): Promise<Asset> => {
    const background = loadImage(backgroundUrl);
    const cactus = loadImage(cactusUrl);

    const birdCanvasList = loadGifFrameList(birdUrl);
    const runningPonyCanvasList = loadGifFrameList(runningPonyGifUrl);
    const jumpingPonyCanvasList = loadGifFrameList(jumpingPonyGifUrl);

    return promiseObjectAll<Asset>({
        background,
        birdCanvasList,
        cactus,
        runningPonyCanvasList,
        jumpingPonyCanvasList,
    });
};
