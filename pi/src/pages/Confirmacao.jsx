import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { supabase } from "../service/supabase";

export default function Confirmacao() {
  const [secondsLeft, setSecondsLeft] = useState(15);
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const hasExitedRef = useRef(false);

  const handleExit = async () => {
    if (hasExitedRef.current) return;
    hasExitedRef.current = true;

    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error("Erro ao sair após confirmação:", error);
    }

    clearCart();
    navigate("/login", { replace: true });
  };

  useEffect(() => {
    if (secondsLeft <= 0) {
      handleExit();
      return;
    }

    const timerId = setTimeout(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timerId);
  }, [secondsLeft]);

  return (
    <div className="min-h-screen bg-[#f8f5e4] flex flex-col justify-center items-center font-sans text-[#111] gap-4 text-center px-4">
      <div className="text-6xl">✔</div>
      <h1 className="text-2xl font-bold">Pedido Confirmado</h1>
      <p className="text-lg text-[#5b3a29]">
        Obrigado pela compra! Você será desconectado automaticamente em
      </p>
      <div className="text-4xl font-semibold text-[#5b3a29]">
        {secondsLeft}s
      </div>
      <button
        onClick={handleExit}
        className="mt-6 px-6 py-3 rounded-md bg-[#5b3a29] text-white hover:bg-[#4a3021] transition"
      >
        Sair agora
      </button>
    </div>
  );
}