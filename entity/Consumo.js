import DAO from "../libs/DAO.js";

export default class Consumo extends DAO {

    id = 0
    versaoID = 0;
    consumo = 0;
    tipo = ''; // estrada|cidade
    combustivel = ''; // gasolina|alcool|hybrid 

    constructor(id = 0) {
        super();

        if (id) {
            this.id = id;
        }
    }

    getUnique() {
        return `versaoID = '${this.versaoID}' AND tipo = '${this.tipo}' AND combustivel = '${this.combustivel}'`;
    }

}