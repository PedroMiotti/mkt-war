export const waitMS = (ms) => {
    return new Promise<void>((resolve) => {
        setTimeout(() => {
            resolve();
        }, ms);
    });
};

export const countdownFrom = (from, onCount) => {
    return new Promise<void>(async (resolve) => {
        var counted = from;
        var keepCounting = true;

        while (counted >= 0 && keepCounting) {
            onCount(counted, () => keepCounting = false);

            if(keepCounting) {
                await module.exports.waitMS(1000);
                counted--;
            }
        }

        resolve();
    });
}
