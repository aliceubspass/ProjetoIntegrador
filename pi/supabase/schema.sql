-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.escola (
  id_escola bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  nome_escola text NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT escola_pkey PRIMARY KEY (id_escola)
);
CREATE TABLE public.itens_pedido (
  id_pedido bigint NOT NULL,
  id_produto bigint NOT NULL,
  quantidade integer NOT NULL CHECK (quantidade > 0),
  preco_unitario numeric NOT NULL,
  CONSTRAINT itens_pedido_pkey PRIMARY KEY (id_pedido, id_produto),
  CONSTRAINT itens_pedido_id_pedido_fkey FOREIGN KEY (id_pedido) REFERENCES public.pedido(id_pedido),
  CONSTRAINT itens_pedido_id_produto_fkey FOREIGN KEY (id_produto) REFERENCES public.produto(id_produto)
);
CREATE TABLE public.lanchonete (
  id_lanchonete bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  id_escola bigint NOT NULL,
  nome_lanchonete text NOT NULL,
  id_senac text,
  id_sesc text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT lanchonete_pkey PRIMARY KEY (id_lanchonete),
  CONSTRAINT lanchonete_id_escola_fkey FOREIGN KEY (id_escola) REFERENCES public.escola(id_escola)
);
CREATE TABLE public.pedido (
  id_pedido bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  id_lanchonete bigint NOT NULL,
  id_user_cliente uuid NOT NULL,
  status_pedido text DEFAULT 'Pendente'::text,
  valor_total numeric NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT pedido_pkey PRIMARY KEY (id_pedido),
  CONSTRAINT pedido_id_lanchonete_fkey FOREIGN KEY (id_lanchonete) REFERENCES public.lanchonete(id_lanchonete),
  CONSTRAINT pedido_id_user_cliente_fkey FOREIGN KEY (id_user_cliente) REFERENCES auth.users(id)
);
CREATE TABLE public.perfil (
  id_user uuid NOT NULL,
  nome text,
  cep text,
  cidade text,
  estado text,
  rua text,
  bairro text,
  complemento text,
  sexo text,
  telefone text,
  data_nascimento date,
  foto text,
  CONSTRAINT perfil_pkey PRIMARY KEY (id_user),
  CONSTRAINT perfil_id_user_fkey FOREIGN KEY (id_user) REFERENCES auth.users(id)
);
CREATE TABLE public.produto (
  id_produto bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  nome_produto text NOT NULL,
  descricao text,
  preco numeric NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  created_by uuid,
  categoria text DEFAULT 'bebidas'::text CHECK (categoria = ANY (ARRAY['bebidas'::text, 'cafe'::text, 'doces'::text, 'chas'::text, 'salgados'::text])),
  CONSTRAINT produto_pkey PRIMARY KEY (id_produto),
  CONSTRAINT produto_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id)
);
CREATE TABLE public.profiles (
  id uuid NOT NULL,
  updated_at timestamp with time zone,
  username text UNIQUE CHECK (char_length(username) >= 3),
  full_name text,
  avatar_url text,
  website text,
  CONSTRAINT profiles_pkey PRIMARY KEY (id),
  CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id)
);