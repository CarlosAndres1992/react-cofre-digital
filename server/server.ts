import express from "express";
import type { Request, Response } from "express";
import cors from "cors";
import { Db, MongoClient } from "mongodb";
import path from "path";
import { fileURLToPath } from "url";

// __dirname para ESModules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Express
const app = express();
app.use(cors());
app.use(express.json());

// Conexión MongoDB (Railway)
const MONGO_URI = process.env.MONGO_URI!;
const client = new MongoClient(MONGO_URI);
let db: Db;

client.connect().then(() => {
  db = client.db("cofreDB");
  console.log("Conectado a MongoDB de Railway");
});

// -------------------------
// Endpoints API backend
// -------------------------

app.post("/save-vault", async (req: Request, res: Response) => {
  const { username, data } = req.body;

  try {
    await db
      .collection("vaults")
      .updateOne({ username }, { $set: { data } }, { upsert: true });

    res.json({ message: "Archivo guardado correctamente." });
  } catch (err) {
    console.error("Error al guardar:", err);
    res.status(500).json({ message: "Error al guardar en base de datos." });
  }
});

app.get("/load-vault", async (req: Request, res: Response) => {
  const username = req.query.username as string;

  if (!username) {
    return res.status(400).json({ message: "Parámetro 'username' inválido" });
  }

  try {
    const vault = await db.collection("vaults").findOne({ username });

    if (!vault) {
      return res.status(404).json({ message: "Vault no encontrado" });
    }

    return res.json({ data: vault.data });
  } catch (err) {
    console.error("Error al leer:", err);
    return res
      .status(500)
      .json({ message: "Error al leer desde base de datos." });
  }
});

// -------------------------
// Servir frontend
// -------------------------

const distPath = path.resolve(__dirname, "../dist");
app.use(express.static(distPath));

app.get("*", (req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

// -------------------------
app.listen(3001, () => {
  console.log("Servidor en http://localhost:3001");
});
