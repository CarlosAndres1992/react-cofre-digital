import { useState } from "react";
import { User, Search, Plus, LogOut } from "lucide-react";
import NewPasswordForm from "../modules/passwords/NewPasswordForm";
import SideNav from "../components/SideNav";
import ConfirmModal from "../components/ConfirmModal";

interface HeaderProps {
  username: string;
  password: string;
  onLogoutRequest: () => void;
}

export default function Header({
  username,
  password,
  onLogoutRequest,
}: HeaderProps) {
  const [showForm, setShowForm] = useState(false);
  const [showSideNav, setShowSideNav] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <>
    <div className="flex justify-between items-center w-full gap-4 flex-nowrap text-gray-800 overflow-x-auto">
        <button
          onClick={() => setShowSideNav(true)}
          className="flex items-center gap-2 w-full sm:w-1/3 hover:text-indigo-600 transition text-left"
        >
          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
            <User className="w-8 h-8" />
          </div>
          <span className="hidden sm:inline font-medium">{username}</span>
        </button>

        <div className="flex items-center justify-center w-full sm:w-1/3">
          <label className="flex items-center gap-2 bg-gray-200 px-3 py-1 rounded-md w-full sm:w-full">
            <Search className="w-4 h-4 text-gray-600" />
            <input
              type="text"
              placeholder="Busca tu contraseña"
              className="bg-transparent outline-none text-gray-800 placeholder-gray-500 text-sm w-auto h-5"
            />
          </label>
        </div>

        <div className="flex items-center justify-end gap-4 w-full sm:w-1/3">
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-1 hover:text-indigo-600 transition text-sm text-gray-800"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Nueva Contraseña</span>
          </button>

          <button
            onClick={() => setShowConfirm(true)}
            className="flex items-center gap-1 hover:text-indigo-600 transition text-sm text-gray-800"
          >
            <LogOut className="w-5 h-5" />
            <span className="hidden sm:inline">Cerrar sesión</span>
          </button>
        </div>
      </div>

      {showForm && (
        <NewPasswordForm
          username={username}
          password={password}
          onClose={() => setShowForm(false)}
        />
      )}

      {showSideNav && (
        <SideNav
          username={username}
          password={password}
          onClose={() => setShowSideNav(false)}
          onLogoutRequest={onLogoutRequest}
        />
      )}

      {showConfirm && (
        <ConfirmModal
          message="¿Estás seguro de que quieres cerrar sesión?"
          onConfirm={() => {
            onLogoutRequest();
            setShowConfirm(false);
          }}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </>
  );
}
