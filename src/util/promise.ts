// delayName :: (k, Promise a) -> Promise (k, a)
const delayName = ([name, promise]) => promise.then((result) => [name, result]);

export type PromiseValues<TO> = {
    [TK in keyof TO]: Promise<TO[TK]>;
};

// promiseObjectAll :: {k: Promise a} -> Promise {k: a}
export const promiseObjectAll = <T>(object: PromiseValues<T>): Promise<T> => {
    const promiseList = Object.entries(object).map(delayName);
    return Promise.all(promiseList).then(Object.fromEntries);
};
