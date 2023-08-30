import DAO from "../libs/DAO.js";

export default class Carro extends DAO {

    id = 0
    nome = ''
    image = ''
    url = ''
    marcaId = 0

    constructor(id = 0) {
        super();

        if (id) {
            this.id = id;
        }
    }

    getUnique() {
        return `nome = '${this.nome}' AND marcaId = '${this.marcaId}'`;
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