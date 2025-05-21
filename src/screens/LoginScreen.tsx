import { useState } from "react";
import fondoLogin from "@/assets/img/fondo-login.jpg";

<img
  src={fondoLogin}
  alt="Fondo"
  className="absolute w-full h-full object-cover z-0"
/>;

interface Props {
  onLogin: (username: string, password: string) => void;
  onGoToRegister: () => void;
}

export default function LoginScreen({ onLogin, onGoToRegister }: Props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = () => {
    if (username.trim() && password.trim()) {
      onLogin(username.trim(), password);
    }
  };

  return (
    <div className="w-full h-full min-h-screen overflow-hidden fixed inset-0">
      {/* Fondo */}
      <img
        src={fondoLogin}
        alt="Fondo"
        className="absolute w-full h-full object-cover z-0"
      />
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm z-0" />

      {/* Contenido */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-[350px] bg-white/10 border-2 border-indigo-500 backdrop-blur-lg p-8 rounded-xl shadow-2xl text-white box-border">
          <h2 className="text-2xl font-bold text-center mb-6">
            Cofre Personal
          </h2>

          <form
            className="flex flex-col gap-4 items-center"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="text"
              placeholder="Nombre del perfil"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 rounded-md bg-white/20 text-white placeholder-white outline-none focus:ring-2 focus:ring-indigo-400"
            />

            <input
              type="password"
              placeholder="Clave maestra"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-md bg-white/20 text-white placeholder-white outline-none focus:ring-2 focus:ring-indigo-400"
            />

            <button
              onClick={handleSubmit}
              className="mt-2 bg-indigo-600 hover:bg-indigo-700 transition-colors text-white font-semibold py-2 px-6 rounded-md"
            >
              Acceder
            </button>

            <p className="text-sm text-center">
              ¿Nuevo aquí?{" "}
              <span
                onClick={onGoToRegister}
                className="underline cursor-pointer hover:text-indigo-300"
              >
                Crear nueva clave maestra
              </span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
