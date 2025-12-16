import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import PersonaForm from './pages/PersonaForm';
import PersonasList from './pages/PersonasList';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Layout>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route
              path="/personas"
              element={
                <ProtectedRoute>
                  <PersonasList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/personas/nuevo"
              element={
                <ProtectedRoute>
                  <PersonaForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/personas/editar/:id"
              element={
                <ProtectedRoute>
                  <PersonaForm />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Layout>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
