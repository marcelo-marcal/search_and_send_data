//import "dotenv/config";
import express from "express";
const cron = require("node-cron");
import { getDre } from "./rotas/getDre";
const app = express();

app.use(express.json({ limit: '1000mb' }))


cron.schedule("*/10 * * * *", async (req,res) => {
  console.log("Executando a tarefa a cada 5 minuto");
  const json = await getDre();
  console.res.json(json);
  return res.json(json);
});


app.get("/dre",async (req, res) => {
  const json = await getDre();
  return res.json(json);
});

app.listen(8181, (err, data) => {
  console.log("Ouvindo na porta 8181");
});

export default app;