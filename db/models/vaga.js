import { ObjectId } from "mongodb";
import { Schema, model } from "mongoose";


const vagaSchema = Schema({
    idEmpresa: ObjectId,
    nomeEmpresa: String,
    nome: String,
    descricao: String,
    salario:Number,
    dataInicio: Date,
    dataFinal: Date,
    etapas: [{
        posicao: Number,
        descricao: String,
        dataInicio: Date,
        dataFinal: Date,
        questoes: [{
            titulo: String,
            enunciado: String,
            opcoes: [{
                resposta: String,
                certa: Boolean
            }]
        }],
    }],
    candidatos: [{
        idCandidato: ObjectId,
        nomeCandidato:String,
        etapaVigente: Number
    }]
})
export const Vaga = model("Vaga", vagaSchema)