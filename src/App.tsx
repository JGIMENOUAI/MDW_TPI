import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import ContratoForm from "./pages/ContratoForm";
import ContratosList from "./pages/ContratosList";
import Home from "./pages/Home";
import InmuebleForm from "./pages/InmuebleForm";
import InmueblesList from "./pages/InmueblesList";
import Login from "./pages/Login";
import PersonaForm from "./pages/PersonaForm";
import PersonasList from "./pages/PersonasList";
import Register from "./pages/Register";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Layout>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Register />} />
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
            <Route
              path="/inmuebles"
              element={
                <ProtectedRoute>
                  <InmueblesList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/inmuebles/nuevo"
              element={
                <ProtectedRoute>
                  <InmuebleForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/inmuebles/editar/:id"
              element={
                <ProtectedRoute>
                  <InmuebleForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/contratos"
              element={
                <ProtectedRoute>
                  <ContratosList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/contratos/nuevo"
              element={
                <ProtectedRoute>
                  <ContratoForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/contratos/editar/:id"
              element={
                <ProtectedRoute>
                  <ContratoForm />
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
