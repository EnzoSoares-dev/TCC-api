import { Schema, model } from "mongoose";

const candidatoSchema = new Schema({
    nome: String,
    email: String,
    senha: String,
    cpf: String,
    curriculo: {
        descricao: String,
        idiomas: [{
            nome: String,
            fluencia: String
        }],
        experiencias: [{
            empresa: String,
            cargo: String,
            descricao: String,
            data_inicio: Date,
            data_final: Date
        }],
        certificados: [{
            nome: String,
            descricao: String,
            data_inicio: Date,
            data_final: Date
        }]
    }
})
export const Candidato = model("Candidato",candidatoSchema)