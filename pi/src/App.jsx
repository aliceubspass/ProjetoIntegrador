import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { CartProvider } from "./context/CartContext";

import { supabase } from '../src/service/supabase';

// Páginas principais
import Welcome from "./pages/Welcome";
import Login from "./pages/Login";
import Login2 from "./pages/Login2";
import Register from "./pages/Register";
import ChooseInstitution from "./pages/ChooseInstitution";
import Menu from "./pages/Menu";

// Lazy loading para categorias
const Bebidas = lazy(() => import("./pages/Bebidas"));
const Cafe = lazy(() => import("./pages/Cafe"));
const Doces = lazy(() => import("./pages/Doces"));
const Chas = lazy(() => import("./pages/Chas"));
const Salgados = lazy(() => import("./pages/Salgados"));

// Página dinâmica para instituição
const Instituicao = lazy(() => import("./pages/Instituicao"));

// Fluxo do carrinho
const Pagamento = lazy(() => import("./pages/Pagamento"));
const Confirmacao = lazy(() => import("./pages/Confirmacao"));

// Painel Administrador
const AdminPanel = lazy(() => import("./pages/AdminPanel"));

function App() {
  return (
    <CartProvider>
      <Router>
        <Suspense fallback={<div>Carregando...</div>}>
          <Routes>
            {/* Páginas principais */}
            <Route path="/" element={<Welcome />} />
            <Route path="/login" element={<Login />} />
            <Route path="/login2" element={<Login2 />} />
            <Route path="/register" element={<Register />} />
            <Route path="/choose" element={<ChooseInstitution />} />
            <Route path="/menu" element={<Menu />} />

            {/* Painel Administrador */}
            <Route path="/admin" element={<AdminPanel />} />

            {/* Instituição */}
            <Route path="/instituicao/:nome" element={<Instituicao />} />

            {/* Categorias */}
            <Route path="/bebidas" element={<Bebidas />} />
            <Route path="/cafe" element={<Cafe />} />
            <Route path="/doces" element={<Doces />} />
            <Route path="/chas" element={<Chas />} />
            <Route path="/salgados" element={<Salgados />} />

            {/* Fluxo de compra */}
            <Route path="/pagamento" element={<Pagamento />} />
            <Route path="/confirmacao" element={<Confirmacao />} />
          </Routes>
        </Suspense>
      </Router>
    </CartProvider>
  );
}

export default App;