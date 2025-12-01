import React, { createContext, useState, useContext } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);

  const addItem = (item) => setCartItems((prev) => [...prev, item]);
  const removeItem = (index) =>
    setCartItems((prev) => prev.filter((_, i) => i !== index));
  const clearCart = () => setCartItems([]);

  const total = cartItems.reduce((acc, item) => acc + item.preco, 0);

  return (
    <CartContext.Provider value={{ cartItems, addItem, removeItem, clearCart, total }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);