import jsonwebtoken from "jsonwebtoken"

export const PRIVATE_KEY = "as7Jd0x1QYsn7Nt2227E"

export const validaLoginEmpresa = (req, res, next) => {
    const token = req.headers.authorization.split(" ")[1]
    jsonwebtoken.verify(token, PRIVATE_KEY, (err, user) => {
        if (err || user.role !== "empresa"){
            res.status(403).json({
                "message": "Não autorizado"
            })
        }else{
            next();
        }
    })
}
export const validaLoginCandidato = (req, res, next) => {
    const token = req.headers.authorization.split(" ")[1]
    if (jsonwebtoken.verify(token, PRIVATE_KEY, (err, user) => user.role !== "candidato") === true) {
        res.status(403).json({
            "message": "Não autorizado"
        })
    } else {
        next()
    }
}