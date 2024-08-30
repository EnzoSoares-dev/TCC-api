import express from 'express';
import cors from 'cors';
import { connect } from './db/connection.js';
import { getEmpresa, postEmpresa, updateEmpresa, loginEmpresa } from './service/empresa.js';
import bodyParser from 'body-parser';
import { validaLoginCandidato, validaLoginEmpresa } from './service/auth.js';
import { getCandidato, loginCandidato, postCandidato, updateCandidato } from './service/candidato.js';
import { postVaga, createEtapa, createQuestao, insertCandidato, getVagaByName, getvagaById, getVaga, getVagaByIdCandidato, getVagaByIdEmpresa, deleteVaga, deleteEtapa, deleteQuestao } from './service/vaga.js';
import { postResultado } from './service/resultado.js';

const routes = express();
connect()
routes.use(cors())
routes.use(bodyParser.json())

routes.get("/", (req, res) => res.send("Olá"))

routes.post("/empresa", postEmpresa);
routes.get("/empresa/login/:email/:senha", loginEmpresa);
routes.get("/empresa/:id",validaLoginEmpresa, getEmpresa);
routes.put("/empresa/:id",validaLoginEmpresa, updateEmpresa);

routes.post("/candidato",postCandidato);
routes.get("/candidato/login/:email/:senha",loginCandidato);
routes.get("/candidato/:id",validaLoginCandidato,getCandidato);
routes.put("/candidato/:id",validaLoginCandidato,updateCandidato);
routes.put("/candidato/:idCandidato/:idVaga/candidatar",validaLoginCandidato,insertCandidato);

routes.post("/empresa/:id/vaga",validaLoginEmpresa,postVaga);
routes.put("/empresa/etapa/:idVaga",validaLoginEmpresa,createEtapa);
routes.put("/empresa/vaga/etapa/:idEtapa/questao",validaLoginEmpresa,createQuestao);
routes.get("/vaga/:idVaga",getvagaById);
routes.get("/vaga",validaLoginCandidato,getVaga);
routes.get("/vaga/nome",validaLoginCandidato,getVagaByName);
routes.get("/candidato/vagas/:idcandidato",validaLoginCandidato,getVagaByIdCandidato)
routes.get("/empresa/vagas/:idEmpresa",validaLoginEmpresa,getVagaByIdEmpresa);
routes.delete("/empresa/vagas/:idVaga",validaLoginEmpresa,deleteVaga);
routes.delete("/empresa/vagas/:idVaga/etapa/:idEtapa",validaLoginEmpresa,deleteEtapa);
routes.delete("/empresa/vagas/:idVaga/etapa/:idEtapa/questao/:idQuestao",validaLoginEmpresa,deleteQuestao);

routes.post("/candidato/:idCandidato/etapa/:idEtapa/resultado",validaLoginCandidato,postResultado);

routes.listen(9000, () => console.log("Servidor rodando na porta 9000"))