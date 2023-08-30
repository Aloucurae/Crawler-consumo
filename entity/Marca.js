import DAO from "../libs/DAO.js";

export default class Marca extends DAO {

    nome = ''
    image = ''
    url = ''
    id = 0

    constructor(id = 0) {
        super();

        if (id) {
            this.id = id;
        }
    }

    getUnique() {
        return `nome = '${this.nome}'`;
    }

    setNome(nome) {
        this.nome = nome;
    }

    setImg(image) {
        this.image = image;
    }

    setUrl(url) {
        this.url = url;
    }
}