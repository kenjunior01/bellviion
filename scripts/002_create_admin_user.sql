-- Script para criar o utilizador admin
-- IMPORTANTE: Execute este script DEPOIS de criar o utilizador no Supabase Auth

-- 1. Primeiro, vá ao Supabase Dashboard > Authentication > Users
-- 2. Clique em "Add User" > "Create New User"
-- 3. Email: admin@bellviion.site
-- 4. Password: Sarent0305
-- 5. Clique em "Create User"

-- 6. Depois de criar o utilizador, execute este SQL para adicionar como admin:
-- (Substitua 'USER_ID_HERE' pelo ID do utilizador criado)

-- INSERT INTO admins (user_id, email, role)
-- VALUES ('USER_ID_HERE', 'admin@bellviion.site', 'super_admin');

-- OU use este comando que adiciona automaticamente baseado no email:
INSERT INTO admins (user_id, email, role)
SELECT id, email, 'super_admin'
FROM auth.users
WHERE email = 'admin@bellviion.site'
ON CONFLICT (email) DO NOTHING;
