import express from "express";
import type { Request, Response } from "express";
import fs from "fs";
import path from "path";
import cors from "cors";
import { fileURLToPath } from "url";

// Necesario para usar __dirname con ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// -------------------------
// Endpoints API backend
// -------------------------
app.post("/save-vault", (req: Request, res: Response) => {
  const { username, data } = req.body;
  const filePath = path.resolve("src/assets/vaults", `${username}.cofre`);

  try {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, data, "utf-8");
    res.json({ message: "Archivo guardado correctamente." });
  } catch (err) {
    console.error("Error al guardar:", err);
    res.status(500).json({ message: "Error al guardar el archivo." });
  }
});

app.get("/load-vault", (req: Request, res: Response) => {
  const username = req.query.username as string;

  if (!username) {
    return res.status(400).json({ message: "Parámetro 'username' inválido" });
  }

  const filePath = path.resolve("src/assets/vaults", `${username}.cofre`);

  try {
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "Vault no encontrado" });
    }

    const data = fs.readFileSync(filePath, "utf-8");
    return res.json({ data });
  } catch (err) {
    console.error("Error al leer vault:", err);
    return res.status(500).json({ message: "Error al leer el archivo" });
  }
});

// -------------------------
// Servir frontend de /dist
// -------------------------
const distPath = path.resolve(__dirname, "../dist");
app.use(express.static(distPath));

// Soporte para rutas de React (SPA)
app.get("*", (req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

// -------------------------
app.listen(3001, () => {
  console.log("Servidor en http://localhost:3001");
});
