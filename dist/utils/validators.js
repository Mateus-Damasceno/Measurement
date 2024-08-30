"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidBase64 = isValidBase64;
function isValidBase64(str) {
    try {
        return btoa(atob(str)) === str;
    }
    catch (err) {
        return false;
    }
}
