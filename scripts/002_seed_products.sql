-- Inserir categorias
INSERT INTO categories (name, label, description) VALUES
  ('eyewear', 'Óculos', 'Coleção de óculos de luxo BELLVION'),
  ('watches', 'Relógios', 'Coleção de relógios exclusivos BELLVION'),
  ('collectibles', 'Colecionáveis', 'Peças raras e colecionáveis BELLVION')
ON CONFLICT (name) DO NOTHING;

-- Inserir produtos de óculos
INSERT INTO products (name, artistic_name, description, category, rarity, price, image_url, specifications, stock) VALUES
  ('BELLVION Classic Black', 'Obsidian Vision', 'Elegância atemporal encontra sofisticação moderna nesta icónica armação preta.', 'eyewear', 'limited', 3500.00, '/images/bellvion-classic-black.png', ARRAY['Armação de Titânio', 'Lentes Polarizadas', 'Proteção UV400', 'Artesanal'], 47),
  ('BELLVION Gold Frame', 'Aurelius Gaze', 'Armações luxuosas banhadas a ouro que incorporam a essência do gosto refinado.', 'eyewear', 'exclusive', 3500.00, '/images/bellvion-gold-frame.png', ARRAY['Banho de Ouro 24K', 'Lentes de Cristal', 'Artesanato Italiano', 'Série Limitada'], 23),
  ('BELLVION Smart Glasses', 'Nexus Sight', 'O futuro dos óculos - onde a tecnologia encontra o design atemporal.', 'eyewear', 'masterpiece', 3500.00, '/images/bellvion-smart-glasses.png', ARRAY['Display AR', 'Controlo por Voz', 'Carregamento Sem Fios', 'Integração IA'], 12),
  ('BELLVION Spectacles', 'Scholar''s Dream', 'Óculos clássicos reimaginados para o intelectual moderno.', 'eyewear', 'limited', 3500.00, '/images/bellvion-spectacles.png', ARRAY['Armação de Acetato', 'Filtro de Luz Azul', 'Revestimento Anti-Reflexo', 'Apoios Nasais Ajustáveis'], 89),
  ('BELLVION Eternal Moment', 'Chronos Whisper', 'Capturando a essência do tempo em cada olhar.', 'eyewear', 'exclusive', 3500.00, '/images/bellvion-eternal-moment.jpeg', ARRAY['Cristal de Safira', 'Lentes Fotocromáticas', 'Titânio com Memória', 'Garantia Vitalícia'], 31);

-- Inserir produtos de relógios
INSERT INTO products (name, artistic_name, description, category, rarity, price, image_url, specifications, stock) VALUES
  ('BELLVION Dragon Duo', 'Twin Serpents', 'Dois dragões eternamente dançando ao redor do próprio tempo.', 'watches', 'masterpiece', 4250.00, '/images/bellvion-dragon-duo.jpeg', ARRAY['Movimento Suíço', 'Gravação de Dragão', 'Cristal de Safira', 'Resistente à Água 100m'], 8),
  ('BELLVION Silver Dragon', 'Lunar Guardian', 'O dragão prateado vigia a passagem do tempo.', 'watches', 'exclusive', 4250.00, '/images/bellvion-silver-dragon.jpeg', ARRAY['Caixa de Prata Sterling', 'Movimento Automático', 'Motivo de Dragão', 'Pulseira de Couro'], 15),
  ('BELLVION Skeleton Master', 'Temporal Architect', 'Onde a mecânica se torna arte e o tempo se torna visível.', 'watches', 'masterpiece', 4250.00, '/images/bellvion-skeleton-master.jpeg', ARRAY['Movimento Skeleton', 'Fundo Transparente', 'Montagem Manual', 'Edição Limitada'], 5),
  ('BELLVION Rose Dragon', 'Crimson Timekeeper', 'Elegância em ouro rosa encontra poder mítico.', 'watches', 'exclusive', 4250.00, '/images/bellvion-rose-dragon.jpeg', ARRAY['Caixa de Ouro Rosa', 'Padrão Escama de Dragão', 'Quartzo Suíço', 'Fecho Deployant'], 19),
  ('BELLVION Forsining Elite', 'Golden Sovereign', 'Artesanato de elite em perfeição dourada.', 'watches', 'limited', 4250.00, '/images/bellvion-forsining-elite.jpeg', ARRAY['Banhado a Ouro', 'Movimento Mecânico', 'Mostrador de Data', 'Bracelete em Malha'], 42),
  ('BELLVION Winner Diamond', 'Victory''s Crown', 'Para aqueles que conquistaram o próprio tempo.', 'watches', 'masterpiece', 4250.00, '/images/bellvion-winner-diamond.jpeg', ARRAY['Índices de Diamante', 'Caixa de Platina', 'Movimento Tourbillon', 'Couro de Crocodilo'], 3),
  ('BELLVION Racing Collection', 'Speed Demon', 'Nascido do espírito das corridas, construído para campeões.', 'watches', 'limited', 4250.00, '/images/bellvion-racing-collection.jpeg', ARRAY['Função Cronógrafo', 'Escala Taquimétrica', 'Pulseira de Corrida', 'Anti-Magnético'], 67),
  ('BELLVION Blue Skeleton', 'Azure Phantom', 'Profundezas azuis revelando a alma do tempo.', 'watches', 'exclusive', 4250.00, '/images/bellvion-blue-skeleton.jpeg', ARRAY['Revestimento PVD Azul', 'Design Coração Aberto', 'Corda Automática', 'Vidro de Safira'], 21);
