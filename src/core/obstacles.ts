import { Cactus, PonyDisplay, Bird } from "../type/ponyRun";

export interface ObstaclesProp {
    display: PonyDisplay;
    GROUND_LEVEL: number
    MAX_JUMP_LEVEL: number;
}

export interface Obstacles {
    cactusList: Cactus[];
    birdList: Bird[];
    birdListFloat: BirdFloat[];
}

export interface BirdFloat extends Bird {
    spriteIndexFloat: number;
}


export interface CreateObstacles {
    reset: () => void;
    tick: (delta: number, gameSpeed: number, score: number) => void;
    getObstacles: () => Obstacles;
}

export const createObstacles = (props: ObstaclesProp) => {
    const { display, GROUND_LEVEL, MAX_JUMP_LEVEL } = props;

    const MAX_CACTUSES = 5;
    let cactusList: Cactus[] = [];
    let birdListFloat: BirdFloat[] = [];
    let birdSpawnTime = 0;

    const initCactuses = () => {
        cactusList.push({ x: getRandomFloat(300, 500) });
        while (cactusList.length < MAX_CACTUSES) spawnCactus();
    };

    const getRandomFloat = (min: number, max: number) => {
        return Math.random() * (max - min) + min;
    }

    const handleCaucuses = (delta: number, gameSpeed: number) => {
        while (cactusList.length < MAX_CACTUSES) spawnCactus();
        const removeCactuses: Cactus[] = [];

        cactusList.forEach(c => {
            if (c.x < 0 - display.cactus.width) removeCactuses.push(c);
            else c.x -= delta * 0.30 * gameSpeed;
        });
        removeCactuses.forEach(c => {
            const indexOf = cactusList.indexOf(c)
            cactusList.splice(indexOf, 1);
        });
    }


    const handleBird = (delta: number, gameSpeed: number) => {
        const removeBirds: BirdFloat[] = [];

        birdListFloat.forEach(b => {
            if (b.x < 0 - display.bird.width) removeBirds.push(b);
            else {
                b.x -= delta * 0.30 * gameSpeed;
                b.spriteIndexFloat += delta * 0.020 * gameSpeed
                if (b.spriteIndexFloat > display.bird.frameCount) b.spriteIndexFloat = 0;
                b.spriteIndex = Math.floor(b.spriteIndexFloat);
            }
        });
        removeBirds.forEach(c => {
            const indexOf = birdListFloat.indexOf(c)
            birdListFloat.splice(indexOf, 1);
        });
    }

    const shouldSpawnBird = (gameSpeed: number, score: number) => {
        if (birdSpawnTime < score) {
            const lastSpawnedCactus = (cactusList[cactusList.length - 1])
            const lastSpawnedBird = (birdListFloat[birdListFloat.length - 1])

            const whereCanSpawn = [
                GROUND_LEVEL + display.crawlingPony.hitbox.height * 0.25,
                GROUND_LEVEL - display.crawlingPony.hitbox.height,
                MAX_JUMP_LEVEL - display.bird.height
            ]
            const randomItem = Math.floor(Math.random() * whereCanSpawn.length);
            const bird: BirdFloat = {
                spriteIndex: 0,
                spriteIndexFloat: 0,
                x: 0,
                y: whereCanSpawn[randomItem],
            }
            const randomX = getRandomFloat(100, 200)
            if (lastSpawnedBird && lastSpawnedCactus.x < lastSpawnedBird.x) { bird.x = lastSpawnedBird.x + randomX; }
            else bird.x = lastSpawnedCactus.x + randomX;
            birdListFloat.push(bird)
            setBirdSpawnTime(score);
        }
    };

    const spawnCactus = () => {
        const SPAWN_RANGE = [140, 170];
        const spawnRange = getRandomFloat(SPAWN_RANGE[0], SPAWN_RANGE[1])

        const lastSpawnedCactus = (cactusList[cactusList.length - 1])
        const lastSpawnedBird = (birdListFloat[birdListFloat.length - 1])
        let whereItCanSpawn = lastSpawnedCactus.x + spawnRange;
        if (lastSpawnedBird) {
            if (lastSpawnedBird.x > lastSpawnedCactus.x) {
                whereItCanSpawn = lastSpawnedBird.x + spawnRange;
            }
        }
        const range = whereItCanSpawn + getRandomFloat(110, 160)
        cactusList.push({ x: getRandomFloat(whereItCanSpawn, range) })
    }

    const setBirdSpawnTime = (score: number) => {
        birdSpawnTime = getRandomFloat(score + 20, score + 40);
    };

    const getObstacles = (): Obstacles => {
        const birdList: Bird[] = []
        birdListFloat.forEach(e => {
            const bd = { ...e };
            delete bd.spriteIndexFloat;
            birdList.push(bd)
        })
        return {
            birdList,
            cactusList,
            birdListFloat,
        } as Obstacles;
    }

    const tick = (delta: number, gameSpeed: number, score: number) => {
        shouldSpawnBird(delta, score);
        handleCaucuses(delta, gameSpeed);
        handleBird(delta, gameSpeed);
    }

    const reset = () => {
        birdSpawnTime = 0;
        cactusList = [];
        birdListFloat = [];
        initCactuses();
        setBirdSpawnTime(0);
    }

    initCactuses();

    return {
        reset,
        tick,
        getObstacles,
    }
}
