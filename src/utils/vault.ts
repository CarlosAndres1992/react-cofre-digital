/* eslint-disable @typescript-eslint/no-explicit-any */
import CryptoJS from "crypto-js";

// Crear vault cifrado
export function createEncryptedVault(
  username: string,
  password: string,
  data: object,
  existingToken?: string
): string {
  const token = existingToken || crypto.randomUUID();
  const key = CryptoJS.SHA256(username + password + token).toString();

  const encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), key).toString();

  return JSON.stringify({ token, encrypted });
}

// Descargar vault como archivo
export function downloadVaultFile(
  encryptedData: string,
  filename = "vault.cofre"
) {
  const blob = new Blob([encryptedData], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Cargar y descifrar vault
export function loadAndDecryptVault(
  username: string,
  password: string,
  encryptedJson: string
): { success: boolean; data?: any } {
  try {
    const { token, encrypted } = JSON.parse(encryptedJson);
    const key = CryptoJS.SHA256(username + password + token).toString();

    const decrypted = CryptoJS.AES.decrypt(encrypted, key).toString(
      CryptoJS.enc.Utf8
    );
    const parsed = JSON.parse(decrypted);

    return { success: true, data: parsed };
  } catch {
    return { success: false };
  }
}
