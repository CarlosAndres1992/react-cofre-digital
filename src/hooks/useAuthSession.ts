import { useState, useEffect } from "react";
import { loadAndDecryptVault } from "../utils/vault";

export function useAuthSession() {
  const [unlocked, setUnlocked] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [isLoginLoading, setIsLoginLoading] = useState(false);

  useEffect(() => {
    const savedUser = sessionStorage.getItem("vault-username") || "";
    const savedPass = sessionStorage.getItem("vault-password") || "";

    if (savedUser && savedPass) {
      handleLogin(savedUser, savedPass, true);
    } else {
      setTimeout(() => setLoading(false), 1000);
    }
  }, []);

  const handleLogin = async (
    username: string,
    password: string,
    fromAutoLogin = false
  ) => {
    setIsLoginLoading(true);
    const startTime = Date.now();

    try {
      const response = await fetch(`/load-vault?username=${username}`);
      if (!response.ok) throw new Error("Vault no encontrado");

      const { data } = await response.json();
      const { success } = loadAndDecryptVault(username, password, data);

      if (success) {
        setUnlocked(true);
        setUsername(username);
        setPassword(password);
        sessionStorage.setItem("vault-username", username);
        sessionStorage.setItem("vault-password", password);
      } else if (!fromAutoLogin) {
        alert("Contraseña incorrecta o archivo corrupto.");
      }
    } catch (err) {
      console.error("Error en login:", err);
      if (!fromAutoLogin) {
        alert("Usuario no encontrado o error al leer el archivo.");
      }
    } finally {
      const elapsed = Date.now() - startTime;
      const delay = Math.max(2000 - elapsed, 0);
      setTimeout(() => {
        setIsLoginLoading(false);
        setLoading(false);
      }, delay);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("vault-username");
    sessionStorage.removeItem("vault-password");
    setUnlocked(false);
    setUsername("");
    setPassword("");
  };

  return {
    unlocked,
    username,
    password,
    loading,
    isLoginLoading,
    handleLogin,
    handleLogout,
  };
}
