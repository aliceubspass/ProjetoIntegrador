import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BackButton from "../components/BackButton";
import { supabase } from "../service/supabase.js";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !senha) {
      alert("Preencha e-mail e senha!");
      return;
    }

    try {
      setLoading(true);

      // Suporta supabase-js v2 (signInWithPassword) e v1 (signIn)
      let response;
      if (supabase.auth && typeof supabase.auth.signInWithPassword === "function") {
        response = await supabase.auth.signInWithPassword({ email, password: senha });
      } else if (supabase.auth && typeof supabase.auth.signIn === "function") {
        response = await supabase.auth.signIn({ email, password: senha });
      } else {
        throw new Error("Método de autenticação do Supabase não encontrado.");
      }

      // Normaliza possíveis formatos de retorno
      const error = response.error ?? null;
      const user = response.data?.user ?? response.user ?? null;

      if (error) {
        console.error("Login error:", error);
        alert("Erro ao autenticar: " + (error.message || error));
        return;
      }

      if (user) {
        navigate("/choose");
      } else {
        alert("Falha no login. Verifique e-mail/senha.");
      }
    } catch (err) {
      console.error(err);
      alert("Erro inesperado ao efetuar login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[#fdf6e3]">
      <div className="absolute top-4 left-4">
        <BackButton />
      </div>
      <form onSubmit={handleLogin} className="bg-white p-8 rounded-lg shadow-md max-w-sm w-full">
        <h2 className="text-2xl font-bold mb-6 text-[#6b4f4f]">Login</h2>
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
        <button
          type="submit"
          disabled={loading}
          className="bg-[#6b4f4f] text-white w-full py-3 rounded hover:bg-[#5a3f3f] transition duration-300 disabled:opacity-50"
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>
        <p className="text-sm text-center mt-4 text-gray-600 hover:underline cursor-pointer">
          Esqueci minha senha
        </p>
      </form>
    </div>
  );
}