import { Candidato } from '../db/models/candidato.js'
import { PRIVATE_KEY } from "./auth.js";
import jsonwebtoken from "jsonwebtoken";

export const postCandidato = async (req, res) => {
    const novoCandidato = new Candidato(req.body)
    if (validaCPF(novoCandidato.cpf) == true) {
        if (await Candidato.findOne({email:novoCandidato.email,cpf:novoCandidato.cpf})===null) {
            try{
                const response = await novoCandidato.save();
                if(response._id){
                    const token = jsonwebtoken.sign(
                        { id: response._id, role: "candidato" },
                        PRIVATE_KEY,
                        { expiresIn: "60m" }
                    );
                    res.status(200).json({
                        "token":token,
                        "message":"Usuário cadastrado com sucesso!"
                    })
                }
            }catch(e){
                console.info(e);
                res.status(500).json({
                    "message": "Não foi possível cadastrar o candidato."
                });
            }
        }else{
            res.status(409).json({
                "message":"Usuário já cadastrado."
            })
        }
    } else {
        res.status(500).json({
            "message": "CPF inválido."
        })
    }
}
export const getCandidato = async (req, res) => {
    const { id } = req.params;
    try {
        const response = await Candidato.findById(id);
        res.status(200).json(response)
    } catch (e) {
        console.log(e)
        res.status(404).json({
            "message": "Não foi possível buscar o candidato"
        })
    }
}
export const updateCandidato = async(req, res) => {
    const {id} = req.params;
    const {body} = req;
    try{
        const response = await Candidato.findByIdAndUpdate(id,body);
        if (response !== undefined) {
            res.status(200).json({
                "message": "Candidato atualizado"
            })
        }
    }catch(e){
        console.info(e);
        res.status(500).json({
            "message":"Não foi possível atualizar! por favor tente novamente mais tarde"
        });
    }
}
export const deleteCandidato = (req, res) => {

}
export const loginCandidato = async (req, res) => {
    const { email, senha } = req.params;
    try{
        const response = await Candidato.findOne({ email: email, senha: senha })
        const token = jsonwebtoken.sign(
            { id: response._id, role: "candidato" },
            PRIVATE_KEY,
            { expiresIn: "60m" }
        );
        res.status(200).json({
            "token": token
        })
    }catch(e){
        console.info(e)
        res.status(401).json({
            "message": "Email ou senha incorretas"
        });
    }
}

const validaCPF = (cpf) => {
    let somaCpfPrimeiroDigito = 0;
    let somaCpfSegundoDigito = 0;
    const cpfNumber = [];
    const verificaPrimeiroDigito = [10, 9, 8, 7, 6, 5, 4, 3, 2];
    const verificaSegundoDigito = [11, 10, 9, 8, 7, 6, 5, 4, 3, 2];
    for (let i = 0; i < cpf.length; i++) {
        if (isNaN(cpf[i]) === false) { cpfNumber.push(Number(cpf[i])) }
    }
    verificaPrimeiroDigito.forEach((digito, index) => {
        somaCpfPrimeiroDigito += cpfNumber[index] * digito;
    })
    if ((somaCpfPrimeiroDigito * 10) % 11 === 10 || (somaCpfPrimeiroDigito * 10) % 11 === 11) {
        somaCpfPrimeiroDigito = 0;
    } else {
        somaCpfPrimeiroDigito = (somaCpfPrimeiroDigito * 10) % 11
    }
    if (somaCpfPrimeiroDigito !== cpfNumber[9]) return false;
    verificaSegundoDigito.forEach((digito, index) => {
        somaCpfSegundoDigito += cpfNumber[index] * digito;
    })
    if ((somaCpfSegundoDigito * 10) % 11 === 10 || (somaCpfSegundoDigito * 10) % 11 === 11) {
        somaCpfSegundoDigito = 0;
    } else {
        somaCpfSegundoDigito = (somaCpfSegundoDigito * 10) % 11
    }
    if (somaCpfSegundoDigito !== cpfNumber[10]) return false;
    return true;
}