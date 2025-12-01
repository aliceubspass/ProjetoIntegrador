import React from "react";
import { useNavigate } from "react-router-dom";

export default function BackButton({ to }) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => (to ? navigate(to) : navigate("/"))} // padrão: "/" (boas-vindas)
      className="p-2 rounded hover:bg-[#efe9d8] focus:outline-none"
      aria-label="Voltar"
    >
      {/* seta minimalista marrom (mesma do Menu) */}
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M15 18L9 12L15 6" stroke="#5b3a29" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </button>
  );
}