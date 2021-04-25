"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.countdownFrom = exports.waitMS = void 0;
const waitMS = (ms) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, ms);
    });
};
exports.waitMS = waitMS;
const countdownFrom = (from, onCount) => {
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
exports.countdownFrom = countdownFrom;
//# sourceMappingURL=Time.js.map