import mysql from 'mysql';
import { config } from '../libs/core.js';

config();

const { HOST, PORT, USER, PASS, BASE } = process.env;

const database = BASE || 'comsumoapp';

const connectionParams = {
    host: HOST,
    port: PORT || "3306",
    user: USER || 'root',
    password: PASS || '',
    connectTimeout: 60000,
    reconnect: true,
    connectionLimit: 15
}

let isConected = false;
let conRetrys = 0;

export let conn;

export const escape = mysql.escape;

export function connect() {
    return new Promise((resolve, reject) => {
        if (isConected) {
            resolve(conn);
            return;
        }

        conn = mysql.createConnection({ ...connectionParams, database });

        conn.on('end', () => {
            isConected = false;
            conn = undefined;
            console.log('connection ends retrys:', conRetrys);
        });

        conn.on('error', () => {
            isConected = false;
            conn = undefined;
            console.log('connection ends retrys:', conRetrys);
        });

        conn.connect((err) => {
            if (err) {
                console.error('error connecting: ' + err.stack);
                reject(err);
                isConected = true;
            }

            console.log('connected as id ' + conn.threadId);

            isConected = true;

            resolve(conn);
        });
    });
}
