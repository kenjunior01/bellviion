-- Criar tabela de produtos BELLVION
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  artistic_name TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('eyewear', 'watches', 'collectibles')),
  rarity TEXT NOT NULL CHECK (rarity IN ('limited', 'exclusive', 'masterpiece')),
  price DECIMAL(10, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'MT',
  image_url TEXT NOT NULL,
  specifications TEXT[] NOT NULL DEFAULT '{}',
  stock INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de categorias
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  label TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de administradores
CREATE TABLE IF NOT EXISTS admins (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de pedidos/contactos WhatsApp
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  customer_phone TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'completed', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Políticas para produtos (leitura pública, escrita apenas admin)
CREATE POLICY "Produtos são visíveis publicamente" ON products
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins podem ver todos os produtos" ON products
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM admins WHERE admins.id = auth.uid() AND admins.is_active = true)
  );

CREATE POLICY "Admins podem inserir produtos" ON products
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM admins WHERE admins.id = auth.uid() AND admins.is_active = true)
  );

CREATE POLICY "Admins podem atualizar produtos" ON products
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM admins WHERE admins.id = auth.uid() AND admins.is_active = true)
  );

CREATE POLICY "Admins podem eliminar produtos" ON products
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM admins WHERE admins.id = auth.uid() AND admins.is_active = true)
  );

-- Políticas para categorias
CREATE POLICY "Categorias são visíveis publicamente" ON categories
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins podem gerir categorias" ON categories
  FOR ALL USING (
    EXISTS (SELECT 1 FROM admins WHERE admins.id = auth.uid() AND admins.is_active = true)
  );

-- Políticas para admins
CREATE POLICY "Admins podem ver outros admins" ON admins
  FOR SELECT USING (auth.uid() = id OR EXISTS (
    SELECT 1 FROM admins WHERE admins.id = auth.uid() AND admins.role = 'super_admin'
  ));

CREATE POLICY "Super admins podem gerir admins" ON admins
  FOR ALL USING (
    EXISTS (SELECT 1 FROM admins WHERE admins.id = auth.uid() AND admins.role = 'super_admin')
  );

-- Políticas para pedidos
CREATE POLICY "Admins podem ver pedidos" ON orders
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM admins WHERE admins.id = auth.uid() AND admins.is_active = true)
  );

CREATE POLICY "Admins podem gerir pedidos" ON orders
  FOR ALL USING (
    EXISTS (SELECT 1 FROM admins WHERE admins.id = auth.uid() AND admins.is_active = true)
  );

-- Inserir pedidos é público (para quando cliente clica no WhatsApp)
CREATE POLICY "Qualquer um pode criar pedido" ON orders
  FOR INSERT WITH CHECK (true);

-- Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
