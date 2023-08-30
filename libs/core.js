import dotenv from "dotenv";
import fs from 'fs';

export function uploadFile(oldpath, newpath) {
    return new Promise((resolve, reject) => {
        fs.rename(oldpath, newpath, function (err) {
            if (err) reject(err);
            resolve()
        });
    });
}

export function base64Encode(str) {
    return Buffer.from(str).toString('base64')
}

export function base64Decode(str) {
    let buff = new Buffer.from(str, 'base64');
    return buff.toString('utf8');
}

export const log = (...str) => {
    console.log(JSON.stringify(str, null, 2));
}

export const config = () => {
    dotenv.config();
}

export function printInformation(res, data, count, next = undefined) {
    res.status(200).json({
        data,
        count,
        next: next ? next(data, count) : undefined
    });
    return
}


export default {
    base64Encode,
    log,
    config
}
