import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ArticlePage from './pages/ArticlePage';
import ArticlesPage from './pages/ArticlesPage';
import CreateArticlePage from './pages/CreateArticlePage';
import EditArticlePage from './pages/EditArticlePage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import NotFoundPage from './pages/NotFoundPage';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

// Composant pour rediriger vers le profil de l'utilisateur connecté
const ProfileRedirect = () => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" />;
  }
  return <Navigate to={`/profile/${user.username}`} />;
};

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="articles" element={<ArticlesPage />} />
          <Route path="articles/:id" element={<ArticlePage />} />
          <Route 
            path="articles/create" 
            element={
              <ProtectedRoute>
                <CreateArticlePage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="articles/:id/edit" 
            element={
              <ProtectedRoute>
                <EditArticlePage />
              </ProtectedRoute>
            } 
          />
          <Route path="profile" element={<ProfileRedirect />} />
          <Route path="profile/:username" element={<ProfilePage />} />
          <Route 
            path="settings" 
            element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            } 
          />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App; 