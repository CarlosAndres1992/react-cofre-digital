import { useEffect, useState } from "react";
import { Eye } from "lucide-react";
import { loadAndDecryptVault } from "../utils/vault";
import PasswordCard from "../modules/passwords/PasswordCard";

interface Props {
  username: string;
  password: string;
}

export default function HomeScreen({ username, password }: Props) {
  const [entries, setEntries] = useState<Record<string, string>[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  useEffect(() => {
    const loadVault = async () => {
      try {
        const response = await fetch(`/load-vault?username=${username}`);
        if (!response.ok) throw new Error("No se pudo cargar el vault");

        const { data } = await response.json();
        const result = loadAndDecryptVault(username, password, data);

        if (result.success && Array.isArray(result.data.passwords)) {
          setEntries(result.data.passwords);
        } else {
          alert("Vault vacío o corrupto.");
        }
      } catch (err) {
        console.error("Error al cargar el vault:", err);
        alert("Error al cargar el vault.");
      }
    };

    loadVault();
  }, [username, password]);

  return (
    <div className="space-y-4 text-gray-800">
      <h2 className="text-xl font-semibold">Cofres guardados</h2>

      {entries.length === 0 ? (
        <p>No hay contraseñas guardadas.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {entries.map((entry, index) => (
            <div
              key={index}
              className="flex items-center justify-between border border-gray-300 rounded-md p-4"
            >
              <span className="font-semibold">
                {entry.plataforma || "Sin nombre"}
              </span>
              <button
                onClick={() =>
                  setSelectedIndex(index === selectedIndex ? null : index)
                }
                className="text-indigo-600 hover:text-indigo-800"
                title="Ver detalles"
              >
                <Eye className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {selectedIndex !== null && entries[selectedIndex] && (
        <PasswordCard
          entry={entries[selectedIndex]}
          onClose={() => setSelectedIndex(null)}
        />
      )}
    </div>
  );
}
