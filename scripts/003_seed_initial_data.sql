-- Script para inserir dados iniciais
-- Execute depois de criar as tabelas

-- Inserir categorias
INSERT INTO categories (name, description, icon) VALUES
  ('Óculos', 'Óculos de luxo BELLVION com design exclusivo', 'glasses'),
  ('Relógios', 'Relógios de alta relojoaria BELLVION', 'watch'),
  ('Colecionáveis', 'Peças de coleção raras e exclusivas', 'gem')
ON CONFLICT (name) DO NOTHING;

-- Inserir produtos de óculos
INSERT INTO products (name, artistic_name, description, price, category_id, image_url, specs, is_active, stock)
SELECT 
  'BELLVION Classic Black',
  'Obsidian Vision',
  'Armação clássica em preto com detalhes dourados, representando a elegância intemporal da marca BELLVION.',
  3500.00,
  c.id,
  '/placeholder.svg?height=400&width=400',
  '{"material": "Titânio", "lentes": "Polarizadas UV400", "peso": "28g", "origem": "Itália"}'::jsonb,
  true,
  10
FROM categories c WHERE c.name = 'Óculos'
ON CONFLICT DO NOTHING;

INSERT INTO products (name, artistic_name, description, price, category_id, image_url, specs, is_active, stock)
SELECT 
  'BELLVION Royal Gold',
  'Golden Dawn',
  'Design arrojado com acabamento em ouro 18k, para quem busca exclusividade absoluta.',
  3500.00,
  c.id,
  '/placeholder.svg?height=400&width=400',
  '{"material": "Ouro 18k", "lentes": "Cristal temperado", "peso": "32g", "origem": "Suíça"}'::jsonb,
  true,
  5
FROM categories c WHERE c.name = 'Óculos'
ON CONFLICT DO NOTHING;

INSERT INTO products (name, artistic_name, description, price, category_id, image_url, specs, is_active, stock)
SELECT 
  'BELLVION Sapphire',
  'Azure Dreams',
  'Lentes em tom safira com armação prateada, inspirado nas profundezas do oceano.',
  3500.00,
  c.id,
  '/placeholder.svg?height=400&width=400',
  '{"material": "Prata 925", "lentes": "Safira sintética", "peso": "30g", "origem": "França"}'::jsonb,
  true,
  8
FROM categories c WHERE c.name = 'Óculos'
ON CONFLICT DO NOTHING;

INSERT INTO products (name, artistic_name, description, price, category_id, image_url, specs, is_active, stock)
SELECT 
  'BELLVION Midnight',
  'Night Walker',
  'Armação totalmente preta com acabamento fosco, perfeita para o estilo noturno.',
  3500.00,
  c.id,
  '/placeholder.svg?height=400&width=400',
  '{"material": "Carbono", "lentes": "Anti-reflexo", "peso": "24g", "origem": "Japão"}'::jsonb,
  true,
  12
FROM categories c WHERE c.name = 'Óculos'
ON CONFLICT DO NOTHING;

-- Inserir produtos de relógios
INSERT INTO products (name, artistic_name, description, price, category_id, image_url, specs, is_active, stock)
SELECT 
  'BELLVION Chronograph Elite',
  'Eternal Time',
  'Cronógrafo de luxo com movimento automático suíço e caixa em ouro rosa.',
  4250.00,
  c.id,
  '/placeholder.svg?height=400&width=400',
  '{"movimento": "Automático Suíço", "caixa": "Ouro Rosa 18k", "resistência": "100m", "reserva": "72h"}'::jsonb,
  true,
  3
FROM categories c WHERE c.name = 'Relógios'
ON CONFLICT DO NOTHING;

INSERT INTO products (name, artistic_name, description, price, category_id, image_url, specs, is_active, stock)
SELECT 
  'BELLVION Skeleton Master',
  'Transparent Soul',
  'Design skeleton revelando a complexidade do movimento mecânico interno.',
  4250.00,
  c.id,
  '/placeholder.svg?height=400&width=400',
  '{"movimento": "Manual", "caixa": "Titânio", "cristal": "Safira dupla face", "reserva": "48h"}'::jsonb,
  true,
  4
FROM categories c WHERE c.name = 'Relógios'
ON CONFLICT DO NOTHING;

INSERT INTO products (name, artistic_name, description, price, category_id, image_url, specs, is_active, stock)
SELECT 
  'BELLVION Diver Pro',
  'Ocean Guardian',
  'Relógio de mergulho profissional com resistência até 300m.',
  4250.00,
  c.id,
  '/placeholder.svg?height=400&width=400',
  '{"movimento": "Automático", "caixa": "Aço 316L", "resistência": "300m", "bisel": "Cerâmica"}'::jsonb,
  true,
  6
FROM categories c WHERE c.name = 'Relógios'
ON CONFLICT DO NOTHING;

INSERT INTO products (name, artistic_name, description, price, category_id, image_url, specs, is_active, stock)
SELECT 
  'BELLVION Moonphase',
  'Lunar Poetry',
  'Elegante relógio com complicação de fase lunar e mostrador em madrepérola.',
  4250.00,
  c.id,
  '/placeholder.svg?height=400&width=400',
  '{"movimento": "Automático", "mostrador": "Madrepérola", "complicação": "Fase Lunar", "bracelete": "Couro Crocodilo"}'::jsonb,
  true,
  2
FROM categories c WHERE c.name = 'Relógios'
ON CONFLICT DO NOTHING;
