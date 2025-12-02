import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CartDrawer from "./CartDrawer";
import { useCart } from "../context/CartContext";
import { supabase } from "../service/supabase";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { cartItems, clearCart } = useCart();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
    // limpar carrinho e redirecionar para login
    clearCart();
    navigate("/login");
  };

  return (
    <header className="flex justify-between items-center p-4 bg-[#f8f5e4] shadow-md">
      <h1 className="text-xl font-bold">Minha Cafeteria</h1>

      <div className="flex items-center gap-4">
        <button
          onClick={() => setIsOpen(true)}
          className="relative text-2xl"
          aria-label="Abrir carrinho"
        >
          🛒
          {cartItems.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-2">
              {cartItems.length}
            </span>
          )}
        </button>

        <button
          onClick={handleLogout}
          className="w-8 h-8 flex items-center justify-center bg-transparent hover:bg-gray-200 rounded transition"
          aria-label="Sair"
          title="Sair"
        >
          {/* ícone logout (seta saindo) */}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-[#5b3a29]">
            <path d="M16 13v-2H7V8l-5 4 5 4v-3z" />
            <path d="M20 3h-8v2h8v14h-8v2h8a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2z" />
          </svg>
        </button>
      </div>

      <CartDrawer isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </header>
  );
}