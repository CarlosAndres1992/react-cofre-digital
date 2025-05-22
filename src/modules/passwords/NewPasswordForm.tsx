import { useState, useRef } from "react";
import { Plus, X } from "lucide-react";
import AddCustomFieldModal from "./AddCustomFieldModal";
import { createEncryptedVault, loadAndDecryptVault } from "../../utils/vault";

interface Props {
  username: string;
  password: string;
  onClose: () => void;
}

export default function NewPasswordForm({
  username,
  password,
  onClose,
}: Props) {
  const [customFields, setCustomFields] = useState<string[]>([]);
  const [showAddFieldModal, setShowAddFieldModal] = useState(false);

  const platformRef = useRef<HTMLInputElement>(null);
  const accountRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const urlRef = useRef<HTMLInputElement>(null);
  const customRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const handleAddCustomField = (label: string) => {
    setCustomFields((prev) => [...prev, label]);
  };

  const handleSave = async () => {
    const platform = platformRef.current?.value.trim() || "";
    const account = accountRef.current?.value.trim() || "";
    const pass = passwordRef.current?.value.trim() || "";
    const url = urlRef.current?.value.trim() || "";

    if (!platform || !account || !pass) {
      alert("Los campos obligatorios no pueden estar vacíos.");
      return;
    }

    const entry: Record<string, string> = {
      plataforma: platform,
      cuenta: account,
      contraseña: pass,
    };

    if (url) entry.url = url;

    for (const label of customFields) {
      const value = customRefs.current[label]?.value.trim();
      if (value) entry[label] = value;
    }

    try {
      const response = await fetch(`/load-vault?username=${username}`);
      if (!response.ok) throw new Error("Vault no encontrado");

      const { data } = await response.json();
      const parsed = JSON.parse(data);
      const token = parsed.token;

      const result = loadAndDecryptVault(username, password, data);
      if (!result.success) throw new Error("No se pudo descifrar el vault");

      const vaultData = result.data;

      if (!Array.isArray(vaultData.passwords)) {
        vaultData.passwords = [];
      }

      vaultData.passwords.push(entry);

      const encrypted = createEncryptedVault(
        username,
        password,
        vaultData,
        token
      );

      await fetch("/save-vault", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, data: encrypted }),
      });

      alert("Cofre guardado correctamente.");
      onClose();
    } catch (err) {
      console.error("Error al guardar:", err);
      alert("Hubo un error al guardar el cofre.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 space-y-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
          title="Cerrar"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-2xl font-semibold text-center text-gray-800">
          Nuevo Cofre
        </h2>

        <div className="flex flex-col gap-1">
          <label
            htmlFor="platform"
            className="text-sm font-medium text-gray-700"
          >
            Nombre de la Plataforma
          </label>
          <input
            ref={platformRef}
            id="platform"
            type="text"
            placeholder="Ej. Gmail, Facebook..."
            className="border border-gray-300 rounded-md px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label
            htmlFor="account"
            className="text-sm font-medium text-gray-700"
          >
            Usuario o Correo
          </label>
          <input
            ref={accountRef}
            id="account"
            type="text"
            className="border border-gray-300 rounded-md px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label
            htmlFor="password"
            className="text-sm font-medium text-gray-700"
          >
            Contraseña
          </label>
          <input
            ref={passwordRef}
            id="password"
            type="text"
            className="border border-gray-300 rounded-md px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="url" className="text-sm font-medium text-gray-700">
            URL del Sitio
          </label>
          <input
            ref={urlRef}
            id="url"
            type="url"
            placeholder="https://..."
            className="border border-gray-300 rounded-md px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>

        {customFields.map((label, index) => (
          <div className="flex flex-col gap-1" key={index}>
            <label className="text-sm font-medium text-gray-700">{label}</label>
            <input
              ref={(el: HTMLInputElement | null) => {
                customRefs.current[label] = el;
              }}
              type="text"
              className="border border-gray-300 rounded-md px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
        ))}

        <div className="flex justify-center">
          <button
            onClick={() => setShowAddFieldModal(true)}
            className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-full text-sm font-medium"
            title="Añadir campo"
          >
            <Plus className="w-4 h-4" />
            Nuevo campo
          </button>
        </div>

        <div>
          <button
            onClick={handleSave}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-md font-medium"
          >
            Guardar Cofre
          </button>
        </div>
      </div>

      {showAddFieldModal && (
        <AddCustomFieldModal
          onClose={() => setShowAddFieldModal(false)}
          onAdd={handleAddCustomField}
        />
      )}
    </div>
  );
}
