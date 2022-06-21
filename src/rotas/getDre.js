import knex from '../database/db';
import axios from 'axios';

export async function getDre() {

  console.log('Entrou no getDre')

  //const url ='https://api-athenasaude.sensedia.com/desenvolvimento/api-transformacoes-allstrategy-mv/interno/v1/dre'
  const url_SAMES = 'https://api-athenasaude.sensedia.com/desenvolvimento/api-transformacoes-allstrategy-sames-mv/interno/v1/dre'
  const url_HEMO = 'https://api-athenasaude.sensedia.com/desenvolvimento/api-transformacoes-allstrategy-hemodinamica-mv/interno/v1/dre'

  try {
    const result = await knex.raw(`
    SELECT DISTINCT  
    To_char(To_Date(dt_lancamento, 'DD/MM/RRRR'), 'RRRR-MM-DD') COMP,
    To_char(To_Date(dt_lancamento, 'DD/MM/RRRR'), 'MM') MES,
    To_char(To_Date(dt_lancamento, 'DD/MM/RRRR'), 'RRRR') ANO,
    To_char(To_Date(dt_lancamento, 'DD/MM/RRRR'), 'DD/MM/RRRR') DATA,
    (CASE WHEN ds_contabil_credito IS NULL THEN ds_contabil_debito ELSE ds_contabil_credito END) DESC_CONTA,
    imv_contabil.CD_LOTE ||'.'||imv_contabil.cd_lancamento DOC,
    (CASE WHEN To_Char(cd_contabil_credito) IS NULL THEN To_Char(cd_contabil_debito) ELSE To_Char(cd_contabil_credito) END) COD_CONTA,
    vl_lancamento VALOR,
    (CASE WHEN cd_contabil_credito IS NULL THEN 'D'
          WHEN cd_contabil_debito IS NULL THEN 'C'
          ELSE 'A' END) NATUREZA,
    ds_complemento_historico HIS,
    (CASE WHEN lcto_Setor.cd_setor_credito IS NOT NULL THEN (SELECT (CASE WHEN cd_cen_cus IS NULL THEN '4000' ELSE cd_cen_cus END) FROM setor WHERE cd_setor = lcto_Setor.cd_setor_credito) 
          WHEN lcto_Setor.cd_setor_debito IS NOT NULL THEN (SELECT (CASE WHEN cd_cen_cus IS NULL THEN '4000' ELSE cd_cen_cus END) FROM setor WHERE cd_setor = lcto_Setor.cd_setor_debito)
     ELSE NULL END) COD_CC,
    (CASE WHEN lcto_Setor.cd_setor_credito IS NOT NULL THEN (SELECT nm_setor FROM setor WHERE cd_setor = lcto_Setor.cd_setor_credito) 
          WHEN lcto_Setor.cd_setor_debito IS NOT NULL THEN (SELECT nm_setor FROM setor WHERE cd_setor = lcto_Setor.cd_setor_debito)
     ELSE NULL END) DESC_CC,
    (CASE WHEN lcto_Setor.cd_setor_credito IS NULL AND lcto_Setor.cd_setor_debito IS NULL THEN 'N' ELSE 'S' END) RATEIO,
    cd_multi_empresa COD_UNID,
    lcto_Setor.cd_setor_credito,
    lcto_Setor.cd_setor_debito,
    imv_contabil.cd_lancamento             
    FROM mvintegra.imv_contabil
    LEFT JOIN dbamv.lcto_Setor ON lcto_Setor.cd_lcto_contabil = imv_contabil.cd_lancamento
    WHERE tp_registro = '003'
    AND cd_lote =  199553
    AND To_char(To_Date(dt_lancamento, 'DD/MM/RRRR'), 'RRRR') = '2022' 
    AND To_char(To_Date(dt_lancamento, 'DD/MM/RRRR'), 'MM') = '02'
    AND ((CASE WHEN To_Char(cd_contabil_credito) IS NULL THEN To_Char(cd_contabil_debito) ELSE To_Char(cd_contabil_credito) END) LIKE '3%' 
    OR (CASE WHEN To_Char(cd_contabil_credito) IS NULL THEN To_Char(cd_contabil_debito) ELSE To_Char(cd_contabil_credito) END) LIKE '4%')
`);


 console.log(result.length)

    if (!result || result.length === 0) {
      console.log('Não encontrado registro no banco de dados')
      return {
        result: 'ERROR',
        debug_msg: 'Não encontrado registro no banco de dados',
      };
    }

    const dados = [];
    result.forEach(element => {
      dados.push({
        MES: element.MES,
        ANO: element.ANO,
        DATA: element.DATA,
        COD_UNIDADE: element.COD_UNID,
        COD_CC: element.COD_CC,
        DESC_CC: element.DESC_CC,
        COD_CONTA:element.COD_CONTA,
        DESC_CONTA: element.DESC_CONTA,
        DOCUMENTO: element.DOC,
        NATUREZA: element.NATUREZA,
        VALOR: element.VALOR,
        HISTORICO: element.HIS,
        COD_PROJETO: null,
        GERADOR: null,
        COD_DIMENSAO: null,
        RATEIO: element.RATEIO
      });
    });

    console.log(result[0].COD_UNID)
    
  if (result[0].COD_UNID === 19) {
  console.log('Entrou SAMES') 
  const data = { PAGINAS: 1, COMPETENCIA: result[0].COMP, CARGA_ADICIONAL: 0, PAGINA : 1, IMPORTACAO: dados }
  const response = await axios.post(url_SAMES, data, {headers: {
    'client_id': 'dd117c3f-2887-3eae-baab-84477ce72029',
    'Content-Type': 'application/json',
  }})

}

  if (result[0].COD_UNID === 7) {
    console.log('Entrou HEMO') 
    const data = { PAGINAS: 1, COMPETENCIA: result[0].COMP, CARGA_ADICIONAL: 0, PAGINA : 1, IMPORTACAO: dados }
    const response = await axios.post(url_HEMO, data, {headers: {
      'client_id': '5ec63be2-138d-3086-a6fa-903bc3af53df',
      'Content-Type': 'application/json',
    }})
  }


    return data[0];
  } catch (error) {
    return console.log(error);
  }
}
 
