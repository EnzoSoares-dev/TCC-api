import { ObjectId } from "mongodb";
import { Schema, model } from "mongoose";

const resultadoSchema = Schema({
    idCandidato: ObjectId,
    idEtapa: ObjectId,
    media: Number,
    aprovado: Boolean
})
export const Resultado = model("Resultado", resultadoSchema)