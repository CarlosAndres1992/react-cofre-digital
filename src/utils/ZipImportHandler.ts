import JSZip from "jszip";
import { loadAndDecryptVault, createEncryptedVault } from "./vault";

export async function importZipAndMergeVault(
  zipFile: File,
  username: string,
  password: string
): Promise<{ success: boolean; message: string }> {
  try {
    const zip = await JSZip.loadAsync(zipFile);
    const fileName = Object.keys(zip.files).find((name) =>
      name.endsWith(".json")
    );

    if (!fileName) {
      return { success: false, message: "El ZIP no contiene ningún .json." };
    }

    const jsonText = await zip.files[fileName].async("text");
    const importedData = JSON.parse(jsonText);

    const response = await fetch(
      `http://localhost:3001/load-vault?username=${username}`
    );
    if (!response.ok) throw new Error("Vault no encontrado");

    const { data: encryptedVault } = await response.json();
    const result = loadAndDecryptVault(username, password, encryptedVault);
    if (!result.success) throw new Error("Vault corrupto o clave incorrecta");

    const currentVault = result.data;
    const token = JSON.parse(encryptedVault).token;

    if (!Array.isArray(currentVault.passwords)) {
      currentVault.passwords = [];
    }

    const importedPasswords = importedData.passwords || [];

    currentVault.passwords.push(...importedPasswords);

    const encrypted = createEncryptedVault(
      username,
      password,
      currentVault,
      token
    );

    await fetch("http://localhost:3001/save-vault", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, data: encrypted }),
    });

    return { success: true, message: "Vault actualizado correctamente." };
  } catch (err) {
    console.error("Error al importar ZIP:", err);
    return { success: false, message: "Error al importar ZIP." };
  }
}
