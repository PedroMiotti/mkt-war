"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.waitMS = (ms) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, ms);
    });
};
exports.countdownFrom = (from, onCount) => {
    return new Promise(async (resolve) => {
        var counted = from;
        var keepCounting = true;
        while (counted >= 0 && keepCounting) {
            onCount(counted, () => keepCounting = false);
            if (keepCounting) {
                await module.exports.waitMS(1000);
                counted--;
            }
        }
        resolve();
    });
};
//# sourceMappingURL=Time.js.map