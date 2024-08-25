import { Empresa } from "../db/models/empresa.js"
import { PRIVATE_KEY } from "./auth.js";
import jsonwebtoken from "jsonwebtoken";

export const postEmpresa = async (req, res) => {
    const novaEmpresa = new Empresa(req.body);
    if (validaCnpj(novaEmpresa.cnpj) === true) {
        if (await Empresa.findOne({ email: novaEmpresa.email,cnpj:novaEmpresa.cnpj}) === null) {
            try {
                const response = await novaEmpresa.save();
                if (response._id) {
                    res.status(200).json({
                        "message": "Empresa cadastrada com sucesso!"
                    });
                };
            } catch (e) {
                console.info(e);
                res.status(500).json({
                    "message": "Não foi possível cadastrar a empresa."
                });
            };
        }else{
            res.status(409).json({
                "message": "Usuário já cadastrado."
            });
        }
    } else {
        res.status(500).json({
            "message": "CNPJ inválido."
        });
    }

}

export const getEmpresa = async (req, res) => {
    const { id } = req.params;
    try {
        const response = await Empresa.findById(id);
        res.status(200).json(response)
    } catch (e) {
        console.info(e)
        res.status(404).json({
            "message": "Não foi possível buscar a empresa"
        })
    }

}

export const updateEmpresa = async (req, res) => {
    const { id } = req.params;
    const body = req.body;
    try {
        const response = await Empresa.findByIdAndUpdate(id, body);
        if (response !== undefined) {
            res.status(200).json({
                "message": "Empresa atualizada"
            })
        }
    } catch (e) {
        console.info(e)
        res.status(500).json({
            "message": "Erro ao atualizar, por favor tente mais tarde"
        })
    }
}

export const deleteEmpresa = (req, res) => {

}

export const loginEmpresa = async (req, res) => {
    const { email, senha } = req.body;
    try {
        const response = await Empresa.findOne({ email: email, senha: senha });
        console.log(response)
        const token = jsonwebtoken.sign(
            { id: response._id, role: "empresa" },
            PRIVATE_KEY,
            { expiresIn: "60m" }
        );
        res.status(200).json({
            "token": token
        })
    } catch (e) {
        console.info(e)
        res.status(401).json({
            "message": "Email ou senha incorretas"
        });
    }
}

const validaCnpj = (cnpj) => {
    let somaCnpjPrimeiroDigito = 0;
    let somaCnpjSegundoDigito = 0;
    const cnpjNumber = [];
    const verificaPrimeiroDigito = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
    const verificaSegundoDigito = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
    let aux =0;
    while(aux < cnpj.length){
        if(isNaN(cnpj[aux])===false){cnpjNumber.push(Number(cnpj[aux]))}
        aux++;
    }
    verificaPrimeiroDigito.forEach((digito, index) => {
        somaCnpjPrimeiroDigito += cnpjNumber[index] * digito;
    })
    if (somaCnpjPrimeiroDigito % 11 < 2) {
        somaCnpjPrimeiroDigito = 0;
    } else {
        somaCnpjPrimeiroDigito = 11 - somaCnpjPrimeiroDigito%11;
    }
    if (somaCnpjPrimeiroDigito !== cnpjNumber[12]) { return false }
    verificaSegundoDigito.forEach((digito, index) => {
        somaCnpjSegundoDigito += cnpjNumber[index] * digito;
    });
    if (somaCnpjSegundoDigito % 11 < 2) {
        somaCnpjSegundoDigito = 0;
    } else {
        somaCnpjSegundoDigito = 11 - somaCnpjSegundoDigito%11;
    }
    if (somaCnpjSegundoDigito !== cnpjNumber[13]) { return false }
    return true;
}