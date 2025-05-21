import { X } from "lucide-react";

interface AddCustomFieldModalProps {
  onClose: () => void;
  onAdd: (label: string) => void;
}

export default function AddCustomFieldModal({
  onClose,
  onAdd,
}: AddCustomFieldModalProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const input = form.elements.namedItem("label") as HTMLInputElement;
    const label = input.value.trim();
    if (label) {
      onAdd(label);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-sm p-6 space-y-6 relative">
        {/* Botón de cerrar */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
          title="Cerrar"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Título */}
        <h2 className="text-xl font-semibold text-center text-gray-800">
          Nuevo Campo
        </h2>

        {/* Formulario */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1">
            <label
              htmlFor="label"
              className="text-sm font-medium text-gray-700"
            >
              Nombre del Campo
            </label>
            <input
              id="label"
              name="label"
              type="text"
              className="border border-gray-300 rounded-md px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="Ej. PIN, Código de acceso..."
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-md font-medium"
          >
            Añadir Campo
          </button>
        </form>
      </div>
    </div>
  );
}
