import DAO from "../libs/DAO.js";

export default class Versao extends DAO {

    id = 0
    carroID = 0;
    versao = ''
    image = ''
    ano = ''
    url = ''
    tipo = ''
    tanque = ''

    constructor(id = 0) {
        super();

        if (id) {
            this.id = id;
        }
    }

    getUnique() {
        return `versao = '${this.versao}' AND ano = '${this.ano}' AND carroID = '${this.carroID}' `;
    }

    setVersao(versao) {
        this.versao = versao;
    }

    setImg(image) {
        this.image = image;
    }

    setUrl(url) {
        this.url = url;
    }
}