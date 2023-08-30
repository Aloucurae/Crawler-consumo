import axios from "axios";
import cheerio from "cheerio";
import Marca from "./entity/Marca.js";
import Carro from "./entity/Carro.js";
import Versao from "./entity/Versao.js";
import Consumo from "./entity/Consumo.js";
import Fipe from "./libs/fipe.js";

const urlBase = 'https://combustivel.app/';

function levenshteinDistance(a, b) {
    const dp = [];
    for (let i = 0; i <= a.length; i++) {
        dp[i] = [i];
        for (let j = 1; j <= b.length; j++) {
            if (i === 0) dp[i][j] = j;
            else {
                dp[i][j] = Math.min(
                    dp[i - 1][j] + 1,
                    dp[i][j - 1] + 1,
                    dp[i - 1][j - 1] + (a[i - 1] !== b[j - 1] ? 1 : 0)
                );
            }
        }
    }
    return dp[a.length][b.length];
}

function sortBySimilarity(reference, array) {
    let novoArra = array.sort((a, b) => {
        const distanceA = levenshteinDistance(reference.toLowerCase(), a.nome.toLowerCase());
        const distanceB = levenshteinDistance(reference.toLowerCase(), b.nome.toLowerCase());
        const indexA = a.nome.toLowerCase().indexOf(reference.toLowerCase());
        const indexB = b.nome.toLowerCase().indexOf(reference.toLowerCase());

        if (indexA === -1 && indexB === -1) {
            return distanceA - distanceB; // Ordenar pela distância de Levenshtein se não houver correspondência parcial
        } else if (indexA === -1) {
            return 1; // B contém a referência, então B vem primeiro
        } else if (indexB === -1) {
            return -1; // A contém a referência, então A vem primeiro
        } else {
            // Ambos contêm a referência, ordenar primeiro pela posição da referência
            // e depois pela distância de Levenshtein
            const positionDiff = indexA - indexB;
            if (positionDiff === 0) {
                return distanceA - distanceB;
            } else {
                return positionDiff;
            }
        }
        return 0;
    })

    // console.log(novoArra, reference);
    return novoArra[0];
}

async function getPageData(url) {
    const pageHTML = await axios.get(url);

    const $ = cheerio.load(pageHTML.data);

    return $;
}

async function getFromUrl(url, seletor, callback) {

    let $ = await getPageData(url);

    let lista = $(seletor);

    // console.log(lista.length);

    let res = [];

    for (let v = 0; v < lista.length; v++) {
        const e = lista[v];

        let r = await callback($, e, lista);
        res.push(r);
    }

    return res;
}

(async () => {

    var fipe = new Fipe();

    let marcasFipe = await fipe.getMarcas();

    var marcas = [];

    await getFromUrl(urlBase, 'ul.lista-marcas li a', async ($, element) => {
        const marca = new Marca();

        marca.setNome($(element).find(".titulo").text());
        marca.setImg($(element).find("img").attr("src"));
        marca.setUrl($(element).attr("href"));

        await marca.save();

        let ff = marcasFipe.find(m => (m.nome == marca.nome));

        if (!ff) {
            ff = sortBySimilarity(marca.nome, marcasFipe);
        }

        marca.codigoMarca = ff.id;

        marcas.push(marca);
    });


    for (let i = 0; i < marcas.length; i++) {
        const marca = marcas[i];

        marca.carros = [];

        await getFromUrl(marca.url, 'ul.lista-nomes li a', async ($, e) => {
            const carro = new Carro();

            carro.marcaId = marca.id;
            carro.setUrl($(e).attr("href"));
            carro.setNome($(e).find(".titulo").text());

            await carro.save();

            marca.carros.push(carro);
        });
    }


    for (let i = 0; i < marcas.length; i++) {
        const marca = marcas[i];

        const modelos = await fipe.getModelos(marca.codigoMarca);

        console.log(modelos);

        for (let i = 0; i < marca.carros.length; i++) {
            const carro = marca.carros[i];

            carro.versions = [];

            await getFromUrl(carro.url, 'ul.listagem-carros li', async ($, e) => {

                let modelo = modelos.find(m => (m.nome == $(e).find("h3").text()));

                if (!modelo) {
                    modelo = sortBySimilarity($(e).find("h3").text(), modelos);
                }

                let anosModelo = await fipe.getAnoModelo(marca.codigoMarca, modelo.id);

                const versao = new Versao();

                versao.carroID = carro.id;
                versao.versao = $(e).find("h3").text().replace(carro.nome, '').trim();
                versao.ano = $(e).find(".ano").text();
                versao.tipo = $(e).find(".comb").text();
                versao.url = $(e).find("a").attr('href');
                versao.image = $(e).find("img").attr('src');
                versao.tanque = parseInt($(e).find(".tanq").html().replace('Tanque', '').replace('litros', '').trim());

                let anoModelo = anosModelo.find(a => (a.ano == versao.ano));
                if (!anoModelo) {
                    let s = anosModelo.sort((a, b) => (parseInt(b.ano) - parseInt(versao.ano)));
                    anoModelo = s.shift();
                }

                versao.anoFipe = anoModelo.ano;

                var combustivel = versao.tipo;

                let valorModelo = await fipe.getValorModelo(marca.codigoMarca, modelo.id, versao.anoFipe);

                if (valorModelo && valorModelo.Valor) {

                    valorModelo.Valor = valorModelo.Valor.replace('R$ ', '').replace('.', '').replace(',', '.');
                    // console.log(valorModelo.Valor);
                    versao.valorFipe = (valorModelo.Valor);
                    versao.valorFipe = parseFloat(valorModelo.Valor);
                    versao.ModeloFipe = valorModelo.Modelo;
                } else {
                    console.log(valorModelo);
                }

                await versao.save();

                let consumos = [];

                let cidade = $(e).find(".cons.cidade").find('.dados-cons').html();
                let estrada = $(e).find(".cons.estrada").find('.dados-cons').html();

                if (cidade) {
                    cidade = cidade.split('<br>');

                    for (let cdd = 0; cdd < cidade.length; cdd++) {
                        const cidd = cidade[cdd];

                        let consumo = cidd.split(' ')[0];

                        consumo = consumo.replace(',', '.');
                        consumo = parseFloat(consumo);

                        if (cidd.indexOf('(A)') > - 1) {
                            combustivel = 'Álcool';
                        } else if (cidd.indexOf('(G)') > - 1) {
                            combustivel = 'Gasolina';
                        }

                        consumos.push({
                            tipo: 'cidade',
                            combustivel,
                            consumo
                        });
                    }
                }

                combustivel = versao.tipo;

                if (estrada) {
                    estrada = estrada.split('<br>');

                    for (let cdd = 0; cdd < estrada.length; cdd++) {
                        const cidd = estrada[cdd];

                        let consumo = cidd.split(' ')[0];

                        consumo = consumo.replace(',', '.');
                        consumo = parseFloat(consumo);

                        if (cidd.indexOf('(A)') > - 1) {
                            combustivel = 'Álcool';
                        } else if (cidd.indexOf('(G)') > - 1) {
                            combustivel = 'Gasolina';
                        }

                        consumos.push({
                            tipo: 'estrada',
                            combustivel,
                            consumo
                        });
                    }
                }

                for (let iix = 0; iix < consumos.length; iix++) {
                    const cc = consumos[iix];

                    const comsumo = new Consumo();

                    comsumo.tipo = cc.tipo;
                    comsumo.versaoID = versao.id;
                    comsumo.consumo = cc.consumo;
                    comsumo.combustivel = cc.combustivel;

                    // await comsumo.save();

                    consumos[iix] = comsumo;
                }

                console.log(carro.nome, versao.versao, versao.ano);
                console.table(versao);
                // console.table(consumos);
                console.log('');

                carro.versions.push(versao);
            });

        }
    }

})();