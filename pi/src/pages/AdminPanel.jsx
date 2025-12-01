import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BackButton from "../components/BackButton";
import { supabase } from "../service/supabase.js";

export default function AdminPanel() {
	// carregar produtos do banco em vez de usar dados estáticos
	const [entradas, setEntradas] = useState([]);
	const [loadingProdutos, setLoadingProdutos] = useState(false);

	// buscar produtos no Supabase ao montar
	useEffect(() => {
		let mounted = true;
		const fetchProdutos = async () => {
			try {
				setLoadingProdutos(true);
				const { data, error } = await supabase.from("produto").select("*");
				if (error) {
					console.error("Erro ao buscar produtos:", error);
					return;
				}
				if (!mounted) return;

				// mapear resultado para o formato usado pela UI
				const mapped = (data || []).map((row) => ({
					id_produto: row.id_produto ?? row.id,
					produto: row.nome_produto,
					valor: typeof row.preco === "number" ? `R$ ${row.preco.toFixed(2).replace(".", ",")}` : `R$ ${String(row.preco)}`,
					descricao: row.descricao,
					categoria: row.categoria ?? null,
				}));
				setEntradas(mapped);
			} catch (err) {
				console.error("Erro inesperado ao buscar produtos:", err);
			} finally {
				setLoadingProdutos(false);
			}
		};

		fetchProdutos();
		return () => {
			mounted = false;
		};
	}, []);

	const [showModal, setShowModal] = useState(false);
	const [novoProduto, setNovoProduto] = useState("");
	const [novoPreco, setNovoPreco] = useState("");
	const [novoCategoria, setNovoCategoria] = useState("bebidas");
	const [novaDescricao, setNovaDescricao] = useState("");
	const [loadingAdd, setLoadingAdd] = useState(false);
	const [loadingRemoveId, setLoadingRemoveId] = useState(null);
	const navigate = useNavigate();

	// helper para formatar erros em string legível
	const formatError = (err) => {
		if (!err) return "Erro desconhecido";
		if (typeof err === "string") return err;
		if (err.message) return err.message;

		const parts = [];
		["details", "hint", "code", "name"].forEach((k) => {
			if (err[k]) parts.push(`${k}: ${err[k]}`);
		});
		if (parts.length) return parts.join(" | ");

		try {
			const str = JSON.stringify(err);
			if (str && str !== "{}") return str;
			const entries = Object.entries(err || {}).map(([k, v]) => `${k}: ${String(v)}`);
			if (entries.length) return entries.join(" | ");
		} catch (e) {
			// ignore
		}
		return "Erro desconhecido";
	};

	const handleAddProduto = async (e) => {
		e.preventDefault();

		// normalizar e validar preço (aceita "1,5" ou "1.5")
		const precoRaw = String(novoPreco || "").trim();
		const precoNum = parseFloat(precoRaw.replace(",", "."));

		if (!novoProduto || !precoRaw || isNaN(precoNum) || precoNum <= 0) {
			alert("Preencha nome e um preço válido (>0).");
			return;
		}

		// verificar sessão/usuário (compatível com supabase-js v1/v2)
		let sessionUser = null;
		try {
			if (supabase.auth && typeof supabase.auth.getUser === "function") {
				const { data: userData, error: userError } = await supabase.auth.getUser();
				if (userError) console.warn("Erro ao obter usuário:", userError);
				sessionUser = userData?.user ?? null;
			} else if (supabase.auth && typeof supabase.auth.user === "function") {
				sessionUser = supabase.auth.user();
			} else if (supabase.auth && typeof supabase.auth.session === "function") {
				sessionUser = supabase.auth.session()?.user ?? null;
			}
		} catch (err) {
			console.warn("Falha ao verificar sessão:", err);
		}

		if (!sessionUser) {
			const confirmGo = window.confirm(
				"Você precisa estar autenticado para adicionar produtos. Deseja ir para a tela de login?"
			);
			alert(
				"A inserção foi bloqueada pela Row Level Security da tabela 'produto'. Faça login ou ajuste as policies no painel do Supabase."
			);
			if (confirmGo) navigate("/login");
			return;
		}

		// preco numérico vindo do campo
	const precoNumerico = precoNum;
	const valorCalculado = `R$ ${precoNumerico.toFixed(2).replace(".", ",")}`;

		try {
			setLoadingAdd(true);

			// payload incluindo created_by obrigatório para a policy insertProduto
			const payloadWithOwner = {
				nome_produto: novoProduto,
				descricao: novaDescricao,
				categoria: novoCategoria,
				preco: precoNumerico,
				created_by: sessionUser.id, // enviado sempre
			};

			// tenta inserir e retorna a linha inserida
			console.debug("Tentando INSERT produto com payload:", payloadWithOwner);
			const res = await supabase
				.from("produto")
				.insert([payloadWithOwner])
				.select("*")
				.single();

			if (res.error) {
				// erro no insert
				console.error("Insert error:", res.error);
				const errMsg = formatError ? formatError(res.error) : (res.error?.message ?? JSON.stringify(res.error));
				// detectar RLS e indicar policy insertProduto
				const isRls = String(errMsg).toLowerCase().includes("row-level") || String(errMsg).toLowerCase().includes("row level");
				if (isRls) {
					alert(
						"Inserção bloqueada por Row Level Security (policy: insertProduto).\n" +
						"Verifique no Supabase Console se a policy 'insertProduto' permite INSERT com created_by = auth.uid().\n\n" +
						"Erro: " + errMsg
					);
				} else {
					alert("Erro ao salvar produto: " + errMsg);
				}
				return;
			}

			const insertedRow = res.data;
			console.debug("Insert sucessful, row:", insertedRow);

			// mapear id corretamente: sua tabela usa id_produto
			const idProduto = insertedRow?.id_produto ?? insertedRow?.id ?? null;

			const inserted = {
				id_produto: idProduto,
				produto: insertedRow?.nome_produto ?? novoProduto,
				valor:
					typeof insertedRow?.preco === "number"
						? `R$ ${insertedRow.preco.toFixed(2).replace(".", ",")}`
						: valorCalculado,
				descricao: insertedRow?.descricao ?? novaDescricao,
				categoria: insertedRow?.categoria ?? novoCategoria,
				// nao armazenamos quantidade aqui; mostramos apenas o valor
			};

			setEntradas((prev) => [...prev, inserted]);

			// cleanup
			setNovoProduto("");
			setNovoPreco("");
			setNovoCategoria("bebidas");
			setNovaDescricao("");
			setShowModal(false);
		} catch (err) {
			console.error("Erro inesperado ao salvar produto:", err);
			const errMsg = formatError ? formatError(err) : (err?.message ?? JSON.stringify(err));
			alert("Erro inesperado ao salvar produto: " + errMsg);
		} finally {
			setLoadingAdd(false);
		}
	};

	const handleRemoveProduto = async (item, index) => {
		// confirmação
		if (!window.confirm(`Remover o produto "${item.produto}"?`)) return;

		// se não tem id_produto no DB, remove localmente
		if (!item.id_produto) {
			setEntradas((prev) => prev.filter((_, i) => i !== index));
			return;
		}

		// verificar sessão (compatível com supabase-js v1/v2)
		let sessionUser = null;
		try {
			if (supabase.auth && typeof supabase.auth.getUser === "function") {
				const { data: userData } = await supabase.auth.getUser();
				sessionUser = userData?.user ?? null;
			} else if (supabase.auth && typeof supabase.auth.user === "function") {
				sessionUser = supabase.auth.user();
			} else if (supabase.auth && typeof supabase.auth.session === "function") {
				sessionUser = supabase.auth.session()?.user ?? null;
			}
		} catch (err) {
			console.warn("Falha ao verificar sessão:", err);
		}

		if (!sessionUser) {
			alert("Você precisa estar autenticado para remover produtos. Ajuste as policies no Supabase se necessário.");
			return;
		}

		// remover no Supabase
		try {
			setLoadingRemoveId(item.id_produto);
			const { data: delData, error: delError } = await supabase.from("produto").delete().eq("id_produto", item.id_produto);

			if (delError) {
				console.error("Erro ao deletar produto (Supabase):", delError);
				alert("Erro ao remover produto: " + (delError.message ?? JSON.stringify(delError)));
				return;
			}

			// atualizar estado local removendo pelo id
			setEntradas((prev) => prev.filter((p) => p.id_produto !== item.id_produto));
		} catch (err) {
			console.error("Erro inesperado ao remover produto:", err);
			alert("Erro inesperado ao remover produto: " + (err?.message ?? JSON.stringify(err)));
		} finally {
			setLoadingRemoveId(null);
		}
	};

	return (
		<div className="min-h-screen bg-[#fdf6e3] p-6">
			<div className="absolute top-4 left-4">
				<BackButton />
			</div>

			<h1 className="text-3xl font-bold text-[#6b4f4f] mb-6 text-center">
				Painel Administrador
			</h1>

			{/* Tabela de Entradas (apenas Produto, Valor, Descrição) */}
			<div className="bg-white p-4 rounded-lg shadow-md mb-6">
				<div className="flex justify-between items-center mb-4">
					<h2 className="text-xl font-semibold text-[#6b4f4f]">Tabela de Entradas</h2>
					<button
						onClick={() => setShowModal(true)}
						className="bg-[#6b4f4f] text-white px-4 py-2 rounded hover:bg-[#5a3f3f] transition"
					>
						Adicionar Produto
					</button>
				</div>
				<table className="w-full text-left border-collapse">
					<thead>
						<tr>
							<th className="border-b p-2">Produto</th>
							<th className="border-b p-2">Valor</th>
							<th className="border-b p-2">Descrição</th>
							<th className="border-b p-2">Ações</th> {/* coluna de ações */}
						</tr>
					</thead>
					<tbody>
						{entradas.map((item, index) => (
							<tr key={index}>
								<td className="p-2">{item.produto}</td>
								<td className="p-2">{item.valor}</td>
								<td className="p-2">{item.descricao}</td>
								<td className="p-2">
									<button
										onClick={() => handleRemoveProduto(item, index)}
										disabled={loadingRemoveId !== null && loadingRemoveId !== item.id_produto}
										className="px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600 disabled:opacity-50"
									>
										{loadingRemoveId === item.id_produto ? "Removendo..." : "Remover"}
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			{/* Modal */}
			{showModal && (
				<div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center animate-fade">
					<div className="bg-white p-6 rounded-lg shadow-lg w-80 transform animate-scale">
						<h2 className="text-xl font-bold mb-4 text-[#6b4f4f]">Adicionar Produto</h2>
						<form onSubmit={handleAddProduto} className="flex flex-col gap-4">
							<input
								type="text"
								placeholder="Nome do Produto"
								value={novoProduto}
								onChange={(e) => setNovoProduto(e.target.value)}
								className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-[#6b4f4f]"
							/>
							<input
								type="number"
								placeholder="Preço (ex: 4.50)"
								value={novoPreco}
								onChange={(e) => setNovoPreco(e.target.value)}
								step="0.01"
								min="0.01"
								className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-[#6b4f4f]"
							/>
							<input
								type="text"
								placeholder="Descrição"
								value={novaDescricao}
								onChange={(e) => setNovaDescricao(e.target.value)}
								className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-[#6b4f4f]"
							/>
							<select
								value={novoCategoria}
								onChange={(e) => setNovoCategoria(e.target.value)}
								className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-[#6b4f4f]"
							>
								<option value="bebidas">Bebidas</option>
								<option value="cafe">Café</option>
								<option value="doces">Doces</option>
								<option value="chas">Chás</option>
								<option value="salgados">Salgados</option>,
								
							</select>
							<div className="flex justify-end gap-2">
								<button
									type="button"
									onClick={() => setShowModal(false)}
									className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
								>
									Cancelar
								</button>
								<button
									type="submit"
									disabled={loadingAdd}
									className="px-4 py-2 rounded bg-[#6b4f4f] text-white hover:bg-[#5a3f3f] disabled:opacity-50"
								>
									{loadingAdd ? "Adicionando..." : "Adicionar"}
								</button>
							</div>
						</form>
					</div>
				</div>
			)}
		</div>
	);
}