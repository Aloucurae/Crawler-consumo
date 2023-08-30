import axios from "axios";


export default class fipe {
    urlbase = 'https://veiculos.fipe.org.br/api/veiculos/'


    params = {
        codigoTabelaReferencia: 300,
        codigoTipoVeiculo: 1,
    }

    post(path, data) {
        return axios.post(`${this.urlbase}${path}`, data);
    }

    async getMarcas() {
        const x = await this.post('ConsultarMarcas', this.params);

        return x.data.map(m => ({
            id: m.Value,
            nome: m.Label,
        }));
    }

    async getModelos(codigoMarca) {
        const x = await this.post('ConsultarModelos', {
            ...this.params,
            codigoMarca
        });

        return x.data.Modelos.map(m => ({
            id: m.Value,
            nome: m.Label,
        }));
    }

    async getAnoModelo(codigoMarca, codigoModelo) {
        const x = await this.post('ConsultarAnoModelo', {
            ...this.params,
            codigoMarca,
            codigoModelo
        });

        return x.data.map(m => {
            const ano = m.Label.split(' ')[0];
            
            return {
                id: m.Value,
                nome: m.Label,
                ano
            }
        });
    }

    async getValorModelo(codigoMarca, codigoModelo, anoModelo, combustivel) {

        let codigoTipoCombustivel = 1;

        const x = await this.post('ConsultarValorComTodosParametros', {
            ...this.params,
            codigoMarca,
            codigoModelo,
            anoModelo,
            codigoTipoCombustivel,
            tipoVeiculo: 'carro',
            tipoConsulta: 'tradicional'
        });

        return x.data;
    }


}