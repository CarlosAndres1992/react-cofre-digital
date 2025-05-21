import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import Layout from "./layout/Layout";
import Header from "./layout/Header";
import HomeScreen from "./screens/HomeScreen";
import { useAuthSession } from "./hooks/useAuthSession";
import { useState } from "react";

function App() {
  const {
    unlocked,
    username,
    password,
    loading,
    isLoginLoading,
    handleLogin,
    handleLogout,
  } = useAuthSession();

  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const showMainLoading = unlocked && (loading || isLoginLoading);

  return (
    <div className="relative">
      <div
        className={
          showMainLoading ? "blur-md pointer-events-none select-none" : ""
        }
      >
        {unlocked ? (
          <Layout
            headerContent={
              <Header
                username={username}
                password={password}
                onLogoutRequest={handleLogout}
              />
            }
          >
            <HomeScreen username={username} password={password} />
          </Layout>
        ) : isRegisterMode ? (
          <RegisterScreen onGoToLogin={() => setIsRegisterMode(false)} />
        ) : (
          <LoginScreen
            onLogin={handleLogin}
            onGoToRegister={() => setIsRegisterMode(true)}
          />
        )}
      </div>

      {showMainLoading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
}

export default App;
