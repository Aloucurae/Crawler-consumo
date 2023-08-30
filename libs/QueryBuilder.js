
import { connect } from "../services/mysql.js";

export default class QueryBuilder {

    collums = [];
    pkeys = [];
    keys = [];
    tableDB = '';
    WHERE = [];

    select(table, fields) {
        this.action = `SELECT ${fields} FROM`;
        this.tableDB = table;
        return this;
    }

    insert(table) {
        this.action = 'INSERT INTO';
        this.tableDB = `${table} SET `;
        return this;
    }

    update(table) {
        this.action = 'UPDATE';
        this.tableDB = `${table} SET `;
        return this;
    }

    where(filter) {
        this.WHERE.push(filter);
        return this;
    }

    create() {
        this.action = 'CREATE'
        return this;
    }

    table(table) {
        this.action += ' TABLE ';
        this.tableDB = table;
        return this;
    }

    addPKey(name) {
        this.pkeys.push(`PRIMARY KEY (${name})`);
        return this;
    }

    addCollum(name, type) {

        if (this.keys.includes(name)) {
            return this;
        }

        this.keys.push(name);

        let collum = `${name} `;

        if (type == 'string') {
            collum += 'VARCHAR(250)';
        }

        if (type == 'number') {
            collum += 'float';
        }

        if (!this.collums.length) {
            this.keys.push('id');
            this.collums.push('id INT(11) NOT NULL AUTO_INCREMENT');
            this.addPKey('id');
        }

        this.collums.push(collum);

        return this;
    }

    set(field, value) {
        this.collums.push(`${field} = '${value}'`);
        return this;
    }

    toString() {

        let fields = [...this.collums, ...this.pkeys].join(',');

        let sql = '';

        if (this.action.indexOf('CREATE') < -1) {
            sql = `${this.action} ${this.tableDB} (${fields})`;
        } else {

            let where = this.WHERE.join('AND ');

            if (where) {
                where = `WHERE ${where}`;
            }

            sql = `${this.action} ${this.tableDB} ${fields} ${where}`;
        }

        // console.log(sql);
        return sql;
    }

    exec() {
        return this.query(this.toString());
    }

    query(sql) {
        return new Promise((resolve, reject) => {
            connect().then(con => {
                con.query(sql, (error, results, fields) => {
                    if (error) reject(error);
                    resolve(results);
                });
            }).catch(reject)
        })
    }

}