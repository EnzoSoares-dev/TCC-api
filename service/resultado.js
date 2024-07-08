import { Vaga } from "../db/models/vaga.js"
import { Resultado } from "../db/models/resultado.js"

export const postResultado = async (req, res) => {
    const { idCandidato, idEtapa } = req.params;
    const { body } = req;
    let media = 0;
    
    body.forEach((questao, index) => {        
        if (questao.certa) {
            media++;
        }
    });
    media = media / body.length;
    const aprovado = media > 7 ? true : false;
    const resultado = new Resultado({ idCandidato: idCandidato, idEtapa: idEtapa, media: media, aprovado: aprovado });
    const response = resultado.save();
    if (response) {
        if (aprovado) {
            Vaga.findOneAndUpdate({'candidatos.idCandidato': idCandidato }, { $inc: { 'candidatos.$.etapaVigente': 1 } })
        }
        res.status(200).json({
            "message":"Prova realizada com sucesso!"
        })
    }else{
        res.status(400).json({
            "message":"Não foi possível concluir a sua prova, tente novamente mais tarde."
        });
    }
}