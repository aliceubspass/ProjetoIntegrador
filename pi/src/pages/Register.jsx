import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BackButton from "../components/BackButton";
import { supabase } from "../service/supabase.js";

export default function Register() {
  const navigate = useNavigate();

  // Estados para os campos do formulário
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmSenha, setConfirmSenha] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();

    // Validação simples
    if (!nome || !email || !senha || !confirmSenha) {
      alert("Preencha todos os campos!");
      return;
    }

    if (senha !== confirmSenha) {
      alert("As senhas não coincidem!");
      return;
    }

    try {
      setLoading(true);

      // Usar Supabase Auth para criar usuário
      const { data, error } = await supabase.auth.signUp(
        { email, password: senha },
        { data: { nome } }
      );

      if (error) {
        console.error("Supabase auth error:", error);
        alert("Erro ao cadastrar usuário: " + error.message);
      } else {
        alert(
          "Cadastro realizado com sucesso! Verifique seu e-mail para confirmar a conta (se aplicável)."
        );
        navigate("/choose");
      }
    } catch (err) {
      console.error(err);
      alert("Erro inesperado!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[#fdf6e3]">
      <div className="absolute top-4 left-4">
        <BackButton />
      </div>
      <form
        onSubmit={handleRegister}
        className="bg-white p-8 rounded-lg shadow-md max-w-sm w-full"
      >
        <h2 className="text-2xl font-bold mb-6 text-[#6b4f4f]">
          Cadastro de Usuário
        </h2>
        <input
          type="text"
          placeholder="Nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          className="border p-3 w-full mb-4 rounded focus:outline-none focus:ring-2 focus:ring-[#6b4f4f]"
        />
        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-3 w-full mb-4 rounded focus:outline-none focus:ring-2 focus:ring-[#6b4f4f]"
        />
        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          className="border p-3 w-full mb-4 rounded focus:outline-none focus:ring-2 focus:ring-[#6b4f4f]"
        />
        <input
          type="password"
          placeholder="Confirmar senha"
          value={confirmSenha}
          onChange={(e) => setConfirmSenha(e.target.value)}
          className="border p-3 w-full mb-4 rounded focus:outline-none focus:ring-2 focus:ring-[#6b4f4f]"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-[#6b4f4f] text-white w-full py-3 rounded hover:bg-[#5a3f3f] transition duration-300 disabled:opacity-50"
        >
          {loading ? "Cadastrando..." : "Cadastrar"}
        </button>
      </form>
    </div>
  );
}