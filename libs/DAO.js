
import QueryBuilder from './QueryBuilder.js';

export default class DAO {

    async save() {
        await this.insert();
    }

    async insert() {

        let id = await this.check();

        if (id) {
            this.id = id;
            return await this.update();
        }

        let table = this.constructor.name.toLowerCase();

        let QB = new QueryBuilder();

        QB = QB.insert(table);

        let fields = Object.keys(this);

        for (const field of fields) {
            if (field !== 'id') {
                QB = QB.set(field, this[field]);
            }
        }

        const r = await QB.exec();

        this.id = r.insertId;
    }

    async update() {
        let table = this.constructor.name.toLowerCase();

        let QB = new QueryBuilder();

        QB = QB.update(table);

        let fields = Object.keys(this);

        for (const field of fields) {
            if (field !== 'id') {
                QB = QB.set(field, this[field]);
            }
        }

        QB = QB.where(`id = '${this.id}'`);

        return await QB.exec();
    }

    async delete() {

    }

    async check() {

        let table = this.constructor.name.toLowerCase();

        let QB = new QueryBuilder();

        QB = QB.select(table, 'id');

        QB = QB.where(this.getUnique());

        const results = await QB.exec();

        if (results && results[0] && results[0].id) {
            return results[0].id;
        }

        return 0;
    }

    createTable() {

        let qb = new QueryBuilder();

        let table = this.constructor.name.toLowerCase();

        qb = qb.create().table(table);

        let fields = Object.keys(this);

        for (const iterator of fields) {
            qb.addCollum(iterator, typeof this[iterator]);
        }

        qb.save();
    }
}