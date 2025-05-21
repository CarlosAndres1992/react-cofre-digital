import { useState } from "react";
import { X } from "lucide-react";
import { createEncryptedVault } from "../utils/vault";

interface Props {
  onGoToLogin: () => void;
}

export default function RegisterScreen({ onGoToLogin }: Props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async () => {
    if (
      username.trim() &&
      password.trim() &&
      confirmPassword.trim() &&
      password === confirmPassword
    ) {
      const encrypted = createEncryptedVault(username, password, { passwords: [] });
  
      try {
        await fetch("http://localhost:3001/save-vault", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username,
            data: encrypted,
          }),
        });
  
        alert("Cofre creado correctamente. Puedes descargarlo más adelante desde tu panel.");
        onGoToLogin();
      } catch (err) {
        console.error("Error al guardar el cofre:", err);
        alert("Error al guardar el cofre.");
      }
    } else {
      alert("Las contraseñas no coinciden o hay campos vacíos.");
    }
  };
  
  return (
    <div className="w-full h-full min-h-screen overflow-hidden fixed inset-0">
      {/* Fondo */}
      <img
        src="/src/assets/img/fondo-login.jpg"
        alt="Fondo"
        className="absolute w-full h-full object-cover z-0"
      />
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm z-0" />

      {/* Contenido */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="relative w-full max-w-[400px] bg-white/10 border-2 border-indigo-500 backdrop-blur-lg p-8 rounded-xl shadow-2xl text-white box-border">
          {/* Botón de cerrar */}
          <button
            onClick={onGoToLogin}
            className="absolute top-3 right-3 text-white hover:text-red-400"
            aria-label="Cerrar"
          >
            <X size={20} />
          </button>

          <h2 className="text-2xl font-bold text-center mb-6">Crear Cofre Digital</h2>

          <form
            className="flex flex-col gap-4 items-center"
            onSubmit={(e) => e.preventDefault()}
          >
            <div className="w-full">
              <input
                type="text"
                placeholder="Nombre de usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 rounded-md bg-white/20 text-white placeholder-white outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <p className="text-xs mt-1 text-gray-300">
                Elige un nombre fácil de recordar, único y personal.
              </p>
            </div>

            <div className="w-full">
              <input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 rounded-md bg-white/20 text-white placeholder-white outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <p className="text-xs mt-1 text-gray-300">
                Usa al menos 8 caracteres, incluyendo mayúsculas, números y símbolos.
              </p>
            </div>

            <input
              type="password"
              placeholder="Repetir contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-md bg-white/20 text-white placeholder-white outline-none focus:ring-2 focus:ring-indigo-400"
            />

            <button
              onClick={handleSubmit}
              className="mt-2 bg-indigo-600 hover:bg-indigo-700 transition-colors text-white font-semibold py-2 px-6 rounded-md"
            >
              Crear Cofre
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
