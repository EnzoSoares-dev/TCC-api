import mongoose from "mongoose";

const uri = "mongodb+srv://soaressenzo:Qu3rop4st3l.@tcc.dvwwoeb.mongodb.net/TCC?retryWrites=true&w=majority"

export const connect = () => {
    mongoose.connect(uri).then(() => {
        console.info("Conectado")
    })
}