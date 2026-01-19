-- Update ALL users to have role 'admin' in metadata
-- This ensures you get access back immediately.
-- You can later use the UI to downgrade others.

UPDATE auth.users
SET raw_user_meta_data = 
  COALESCE(raw_user_meta_data, '{}'::jsonb) || '{"role": "admin"}'::jsonb;

-- Also sync to profiles table if you are using it for queries
UPDATE public.profiles
SET role = 'admin';
