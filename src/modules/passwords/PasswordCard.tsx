import { useState } from "react";
import { X, Copy } from "lucide-react";

interface Props {
  entry: Record<string, string>;
  onClose: () => void;
}

export default function PasswordCard({ entry, onClose }: Props) {
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const handleCopy = (value: string) => {
    navigator.clipboard
      .writeText(value)
      .then(() => {
        setCopiedText(value);
        setTimeout(() => setCopiedText(null), 2000);
      })
      .catch((err) => {
        console.error("Error al copiar:", err);
      });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-red-500"
          title="Cerrar"
        >
          <X className="w-6 h-6" />
        </button>

        <h3 className="text-2xl font-bold text-gray-800 text-center">
          Detalles del Cofre
        </h3>

        <div className="flex flex-col gap-4 text-gray-700">
          {Object.entries(entry).map(([key, value]) => (
            <div
              key={key}
              className="flex items-center justify-between bg-gray-100 p-3 rounded-md"
            >
              <div className="flex flex-col">
                <span className="text-xs uppercase text-gray-500 font-semibold">
                  {key}
                </span>
                <span className="text-sm font-medium break-words">{value}</span>
              </div>
              <button
                onClick={() => handleCopy(value)}
                className="text-gray-500 hover:text-indigo-600 transition"
                title="Copiar"
              >
                <Copy className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>

        {/* Mensaje de copiado */}
        {copiedText && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white text-xs font-semibold px-4 py-2 rounded-full shadow-lg">
            Copiado: {copiedText}
          </div>
        )}
      </div>
    </div>
  );
}
