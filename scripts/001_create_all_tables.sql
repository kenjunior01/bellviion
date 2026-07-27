-- Script de criação das tabelas BELLVION
-- Execute este script no Supabase SQL Editor

-- Tabela de categorias
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de produtos
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  artistic_name TEXT,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  image_url TEXT,
  specs JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  stock INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de agentes comerciais
CREATE TABLE IF NOT EXISTS agents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT NOT NULL,
  age INTEGER NOT NULL,
  country TEXT NOT NULL,
  province TEXT NOT NULL,
  city TEXT,
  status TEXT DEFAULT 'pending',
  commission_rate DECIMAL(5,2) DEFAULT 10.00,
  total_sales DECIMAL(10,2) DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de admins
CREATE TABLE IF NOT EXISTS admins (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  email TEXT NOT NULL UNIQUE,
  role TEXT DEFAULT 'admin',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habilitar RLS em todas as tabelas
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- Políticas para categorias (leitura pública)
DROP POLICY IF EXISTS "Categories public read" ON categories;
CREATE POLICY "Categories public read" ON categories FOR SELECT USING (true);

-- Políticas para produtos (leitura pública)
DROP POLICY IF EXISTS "Products public read" ON products;
CREATE POLICY "Products public read" ON products FOR SELECT USING (true);

-- Políticas para agentes (inserção pública)
DROP POLICY IF EXISTS "Agents public insert" ON agents;
CREATE POLICY "Agents public insert" ON agents FOR INSERT WITH CHECK (true);

-- Inserir categorias iniciais
INSERT INTO categories (name, description, icon) VALUES
  ('Óculos', 'Óculos de luxo BELLVION', 'glasses'),
  ('Relógios', 'Relógios exclusivos BELLVION', 'watch'),
  ('Colecionáveis', 'Peças de coleção raras', 'gem')
ON CONFLICT (name) DO NOTHING;

-- Inserir produtos iniciais (óculos)
INSERT INTO products (name, artistic_name, description, price, category_id, image_url, specs, is_active, stock)
SELECT 
  'BELLVION Classic Black',
  'Obsidian Vision',
  'Armação clássica em preto com detalhes dourados, representando a elegância intemporal.',
  3500.00,
  id,
  '/placeholder.svg?height=400&width=400',
  '{"material": "Titânio", "lentes": "Polarizadas UV400", "peso": "28g"}'::jsonb,
  true,
  10
FROM categories WHERE name = 'Óculos'
ON CONFLICT DO NOTHING;

INSERT INTO products (name, artistic_name, description, price, category_id, image_url, specs, is_active, stock)
SELECT 
  'BELLVION Royal Gold',
  'Golden Dawn',
  'Design arrojado com acabamento em ouro 18k, para quem busca exclusividade absoluta.',
  3500.00,
  id,
  '/placeholder.svg?height=400&width=400',
  '{"material": "Ouro 18k", "lentes": "Cristal temperado", "peso": "32g"}'::jsonb,
  true,
  5
FROM categories WHERE name = 'Óculos'
ON CONFLICT DO NOTHING;

INSERT INTO products (name, artistic_name, description, price, category_id, image_url, specs, is_active, stock)
SELECT 
  'BELLVION Sapphire',
  'Azure Dreams',
  'Lentes em tom safira com armação prateada, inspirado nas profundezas do oceano.',
  3500.00,
  id,
  '/placeholder.svg?height=400&width=400',
  '{"material": "Prata 925", "lentes": "Safira sintética", "peso": "30g"}'::jsonb,
  true,
  8
FROM categories WHERE name = 'Óculos'
ON CONFLICT DO NOTHING;

-- Inserir produtos iniciais (relógios)
INSERT INTO products (name, artistic_name, description, price, category_id, image_url, specs, is_active, stock)
SELECT 
  'BELLVION Chronograph Elite',
  'Eternal Time',
  'Cronógrafo de luxo com movimento automático suíço e caixa em ouro rosa.',
  4250.00,
  id,
  '/placeholder.svg?height=400&width=400',
  '{"movimento": "Automático Suíço", "caixa": "Ouro Rosa 18k", "resistência": "100m"}'::jsonb,
  true,
  3
FROM categories WHERE name = 'Relógios'
ON CONFLICT DO NOTHING;

INSERT INTO products (name, artistic_name, description, price, category_id, image_url, specs, is_active, stock)
SELECT 
  'BELLVION Skeleton Master',
  'Transparent Soul',
  'Design skeleton revelando a complexidade do movimento mecânico interno.',
  4250.00,
  id,
  '/placeholder.svg?height=400&width=400',
  '{"movimento": "Manual", "caixa": "Titânio", "cristal": "Safira dupla face"}'::jsonb,
  true,
  4
FROM categories WHERE name = 'Relógios'
ON CONFLICT DO NOTHING;
