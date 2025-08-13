import { Routes, Route, Navigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import HomePage from "./pages/HomePage";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import ProfilePage from "./pages/ProfilePage";
import ErrorBoundary from "./components/ErrorBoundary";
import { useUserStore } from "./stores/userStore";

function App() {
  const { user, isAuthenticated, initializeAuth } = useUserStore();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initialize = async () => {
      if (!sessionStorage.getItem("logging-out")) {
        await initializeAuth();
      }
      setIsInitialized(true);
    };

    initialize();
  }, [initializeAuth]);

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
          <p className="mt-4 text-gray-400">Loading DevSphere...</p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-900 flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route
              path="/"
              element={
                isAuthenticated ? (
                  <HomePage />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/profile/:id?"
              element={
                isAuthenticated ? (
                  <ProfilePage />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/login"
              element={
                !isAuthenticated ? <LoginPage /> : <Navigate to="/" replace />
              }
            />
            <Route
              path="/signup"
              element={
                !isAuthenticated ? <SignUpPage /> : <Navigate to="/" replace />
              }
            />
            <Route
              path="*"
              element={
                <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                  <div className="text-center text-white">
                    <h1 className="text-4xl font-bold mb-4">
                      404 - Page Not Found
                    </h1>
                    <p className="text-gray-400 mb-6">
                      The page you're looking for doesn't exist.
                    </p>
                    <Link to="/" className="btn-primary">
                      Go Home
                    </Link>
                  </div>
                </div>
              }
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </ErrorBoundary>
  );
}

export default App;
