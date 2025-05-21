interface ConfirmModalProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  message,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-sm text-center">
        <p className="text-gray-800 text-base mb-6">{message}</p>
        <div className="flex justify-center gap-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm rounded-md text-gray-600 hover:bg-gray-100"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}
