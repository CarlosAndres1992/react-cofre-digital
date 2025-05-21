/* eslint-disable @typescript-eslint/no-explicit-any */
import { Upload, Download, Settings, LogOut, List } from "lucide-react";
import { downloadVaultFile, loadAndDecryptVault } from "../utils/vault";
import JSZip from "jszip";
import { importZipAndMergeVault } from "../utils/ZipImportHandler";

interface Props {
  username: string;
  password: string;
  onLogout: () => void;
}

export default function SideNavActions({
  username,
  password,
  onLogout,
}: Props) {
  const handleDownloadCofre = () => {
    fetch(`http://localhost:3001/load-vault?username=${username}`)
      .then((res) => {
        if (!res.ok) throw new Error("No se pudo cargar el archivo.");
        return res.json();
      })
      .then(({ data }) => {
        if (!data) throw new Error("Archivo vacío o no encontrado.");
        downloadVaultFile(data, `${username}.cofre`);
      })
      .catch(() => {
        alert("Error al descargar el cofre.");
      });
  };

  const handleDownloadZip = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/load-vault?username=${username}`
      );
      if (!response.ok) throw new Error("No se pudo obtener el vault");

      const { data: encryptedJson } = await response.json();

      const result = loadAndDecryptVault(username, password, encryptedJson);
      if (!result.success) throw new Error("Vault corrupto o clave incorrecta");

      const sanitizedData = { ...result.data };
      delete (sanitizedData as any).username;
      delete (sanitizedData as any).password;

      const jsonBlob = new Blob([JSON.stringify(sanitizedData, null, 2)], {
        type: "application/json",
      });

      const zip = new JSZip();
      zip.file(`${username}-vault.json`, jsonBlob);

      const zipBlob = await zip.generateAsync({ type: "blob" });

      const url = URL.createObjectURL(zipBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${username}-vault.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      alert("Error al generar el ZIP.");
      console.error(err);
    }
  };

  const handleUploadZip = async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".zip";

    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;

      const loader = document.createElement("div");
      loader.className =
        "fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm";
      loader.innerHTML =
        '<div class="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>';
      document.body.appendChild(loader);

      const { success, message } = await importZipAndMergeVault(
        file,
        username,
        password
      );

      document.body.removeChild(loader);

      alert(message);

      if (success) {
        window.location.reload();
      }
    };

    input.click();
  };

  return (
    <div className="flex flex-col gap-4">
      <button className="flex items-center gap-3 text-gray-700 hover:text-indigo-600">
        <Settings className="w-5 h-5" />
        Editar perfil
      </button>

      <button className="flex items-center gap-3 text-gray-700 hover:text-indigo-600">
        <List className="w-5 h-5" />
        Lista
      </button>

      <button
        className="flex items-center gap-3 text-gray-700 hover:text-indigo-600"
        onClick={handleUploadZip}
      >
        <Upload className="w-5 h-5" />
        Cargar ZIP
      </button>

      <button
        className="flex items-center gap-3 text-gray-700 hover:text-indigo-600"
        onClick={handleDownloadZip}
      >
        <Download className="w-5 h-5" />
        Descargar ZIP
      </button>

      <button
        className="flex items-center gap-3 text-gray-700 hover:text-indigo-600"
        onClick={handleDownloadCofre}
      >
        <Download className="w-5 h-5" />
        Descargar Cofre
      </button>

      <button
        className="flex items-center gap-3 text-gray-700 hover:text-red-600 mt-4"
        onClick={onLogout}
      >
        <LogOut className="w-5 h-5" />
        Cerrar sesión
      </button>
    </div>
  );
}
