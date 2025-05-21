import { useState } from "react";
import { User } from "lucide-react";
import ConfirmModal from "./ConfirmModal";
import SideNavActions from "./SideNavActions";

interface Props {
  username: string;
  password: string;
  onClose: () => void;
  onLogoutRequest: () => void;
}
export default function SideNav({ username, password, onClose, onLogoutRequest }: Props) {

  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/50" onClick={onClose}>
        <div
          className="bg-white w-80 h-full shadow-xl p-6 flex flex-col gap-6"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex flex-col items-center gap-2">
            <div className="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
              <User className="w-10 h-10" />
            </div>
            <span className="text-lg font-semibold text-gray-800">
              {username}
            </span>
          </div>

          <hr />

          <SideNavActions
            username={username}
            password={password}
            onLogout={() => setShowConfirm(true)}
          />
        </div>
      </div>

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
