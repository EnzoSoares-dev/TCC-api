import { Schema, model } from "mongoose";

const empresaSchema = new Schema({
    nome: String,
    email: String,
    senha: String,
    cnpj: String
})
export const Empresa = model("Empresa", empresaSchema)