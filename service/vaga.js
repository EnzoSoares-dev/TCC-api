import { Vaga } from "../db/models/vaga.js"

export const postVaga = async (req, res) => {
    const { id } = req.params
    const novaVaga = new Vaga({
        idEmpresa: id,
        dataInicio: new Date(req.body.dataInicio),
        dataFinal: new Date(req.body.dataFinal), ...req.body
    });
    try {
        const response = await novaVaga.save()
        if (response._id) {
            res.status(200).json({
                "message": "Vaga cadastrada com sucesso!",
                "id":response._id
            })
        }
    } catch (e) {
        console.info(e)
        res.status(500).json({
            "message": "Não foi possível criar a vaga, por favor tente novamente mais tarde."
        })
    }
}
export const createEtapa = async (req, res) => {
    const { idVaga } = req.params;
    const { body } = req;
    try {
        const findVaga = await Vaga.findById(idVaga);
        body.posicao = findVaga.etapas.length + 1;
        findVaga.etapas.push(body);

        const response = findVaga.save();
        if (response !== undefined) {
            res.status(200).json({
                "message": "Vaga atualizada"
            })
        }
    } catch (e) {
        console.info(e);
        res.status(500).json({
            "message": "Não foi possível atualizar! por favor tente novamente mais tarde"
        });
    }
}
export const createQuestao = async (req, res) => {
    const { idEtapa } = req.params;
    const { body } = req;
    try {
        const response = await Vaga.findOneAndUpdate({ 'etapas._id': idEtapa }, { $set: { 'etapas.$.questoes': body.questoes } }, { new: true });;
        if (response !== null) {
            res.status(200).json({
                "message": "Questões inseridas com sucesso"
            })
        }
    } catch (e) {
        console.info(e);
        res.status(500).json({
            "message": "Não foi possível inserir as questoes, tente novamente mais tarde."
        })
    }
}
export const insertCandidato = async (req, res) => {    
    const { idVaga } = req.params;
    const { idCandidato } = req.params;
    if(Vaga.findOne({ _id: idVaga, 'candidatos.idCandidato': idCandidato })){
        try {
            const response = await Vaga.findOneAndUpdate({ "_id": idVaga },{$push:{candidatos:{idCandidato:idCandidato,etapaVigente:1,nomeCandidato:req.body.nomeCandidato}}});
            if(response){
                res.status(200).json({
                    "message":"Candidatura realizada com sucesso!"
                });
            }
        } catch (e) {
            console.info(e);
            res.status(500).json({
                "message": "Não foi possível realizar a candidatura."
            });
        }
    }else{
        res.status(403).json({
            "message":"Candidatura já efetuada."
        })
    }
}
export const getVagaByName = async (req,res) =>{
    const {nomeVaga} = req.params
    const vaga = JSON.parse(nomeVaga)
    try{
        const response = await Vaga.find({"nome":{$regex:'.*'+vaga.vaga+'.*', $options: 'i' }});
        if(response.length>=1){
            res.status(200).json(response);
        }else{
            res.status(200).json([]);
        }
    }catch(e){
        console.info(e)
        res.status(404).json({
            "message":"Vagas não encontradas"
        });
    }
}
export const getvagaById = async (req, res) => {
    const {idVaga} = req.params
    try{
        const response = await Vaga.findOne({"_id":idVaga});
        if(response){
            res.status(200).json(response)
        }
    }catch(e){
        console.log(e)
        res.status(503).json({
            "message":"Ocorreu um erro, tente novamente mais tarde"
        });
    }
}
export const getVaga = async (req, res) => {
    try{
        const response = await Vaga.find()
        if(response){
            res.status(200).json(response);
        }else{
            res.status(404).json({
                "message":"Não há vagas"
            })
        }
    }catch(e){
        console.info(e)
        res.status(500).json({
            "message":"Não foi possível buscar vagas"
        });
    }
}
export const getVagaByIdCandidato = async (req, res) => {
    const {idcandidato} = req.params;
    const newResponse = []
    try{
        const response = await Vaga.find({"candidatos.idCandidato":idcandidato});
        if(response.length>=1){
            res.status(200).json(response);
        }else{
            res.status(404).json({
                "message":"Não foi possível buscar as suas candidaturas!"
            });
        }
    }catch(e){
        console.info(e)
        res.status(404).json({
            "message":"Não foi possível buscar as suas candidaturas!"
        });
    }
}
export const getVagaByIdEmpresa = async (req, res) => {
    const {idEmpresa} = req.params;    
    try{
        const response = await Vaga.find({"idEmpresa":idEmpresa});
        if(response.length>=1){
            res.status(200).json(response);
        }else{
            res.status(404).json({
                "message":"Não foi possível buscar as suas candidaturas!"
            });
        }
    }catch(e){
        console.info(e)
        res.status(404).json({
            "message":"Não foi possível buscar as seus processos seletivos."
        });
    }
}
export const updateVaga = async (req,res) =>{
    const {idVaga} = req.params;
    const {body} = req;

    Vaga.findOneAndUpdate({_id:idVaga},body).then((atualizada)=>{
        res.status(200).json({
            "message":"Vaga atualizada com sucesso"
        })
    }).catch(err =>{
        console.info(err)
        res.status(500).json({
            "message":"Não foi possível atualizar o processo, tente novamente mais tarde"
        })
    })
}
export const deleteVaga = async (req,res) => {
    const {idVaga} =req.params;

    const response = await Vaga.findOne({"_id":idVaga});
    if(Date.now() >response.dataInicio && Date.now() <response.dataFinal){
        try{
            Vaga.findOneAndDelete({ _id: idVaga }).then((result)=>{
                res.status(203).json({
                    "message":"Vaga deletada com sucesso!"
                })
            });
        }catch(e){
            console.info(e)
            res.status(200).json({
                "message":"Não foi possível deletar a vaga, tente novamente mais tarde."
            })
        }
    }else{
        res.status(403).json({
            "message":"Não é possível deletar um processo seletivo em andamento."
        })
    }
}
export const deleteEtapa = async (req,res) => {
    const {idVaga} =req.params;
    const {idEtapa} =req.params;

    const response = await Vaga.findOne({"_id":idVaga});
    if(Date.now() >response.dataInicio && Date.now() <response.dataFinal){
        try{
            Vaga.findOneAndUpdate({ _id: idVaga },{$pull:{etapas:{_id: idEtapa}}}).then((result)=>{
                res.status(203).json({
                    "message":"Etapa deletada com sucesso"
                })
            })            
        }catch(e){
            console.info(e)
            res.status(200).json({
                "message":"Não foi possível deletar a etapa, tente novamente mais tarde."
            })
        }
    }else{
        res.status(403).json({
            "message":"Não é possível deletar uma etapa durante um processo seletivo em andamento."
        })
    }
}
export const deleteQuestao = async (req,res) => {
    const {idVaga} =req.params;
    const {idEtapa} =req.params;
    const {idQuestao} = req.params

    const response = await Vaga.findOne({"_id":idVaga});

    if(new Date() >new Date(response.dataInicio) && new Date() > new Date(response.dataFinal)){
        try{
        Vaga.updateMany(
            { 'etapas.questoes._id': idQuestao },
            { $pull: { 'etapas.$.questoes': { _id: idQuestao }}}).then(result => {
                res.status(200).json({
                    "message":"Questão deletada com sucesso"
                })
              });
    }catch(e){
        console.info(e)
        res.status(200).json({
            "message":"Não foi possível deletar a questao, tente novamente mais tarde."
        })
    }}else{
        res.status(403).json({
            "message":"Não é possível deletar uma questão durante um processo seletivo em andamento."
        })
    }
}