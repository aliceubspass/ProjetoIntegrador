import React, { useState } from "react";
import CartDrawer from "./CartDrawer";
import { useCart } from "../context/CartContext";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { cartItems } = useCart();

  return (
    <header className="flex justify-between items-center p-4 bg-[#f8f5e4] shadow-md">
      <h1 className="text-xl font-bold">Minha Cafeteria</h1>
      <button
        onClick={() => setIsOpen(true)}
        className="relative text-2xl"
      >
        🛒
        {cartItems.length > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-2">
            {cartItems.length}
          </span>
        )}
      </button>
      <CartDrawer isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </header>
  );
}