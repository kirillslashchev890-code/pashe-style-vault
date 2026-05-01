-- Restrict avatar storage policies to owner (folder = user uid)
DROP POLICY IF EXISTS "Users can upload avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can update avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete avatar" ON storage.objects;
DROP POLICY IF EXISTS "Avatars are public" ON storage.objects;

CREATE POLICY "Avatars are publicly readable by file path"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload own avatar"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'avatars'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update own avatar"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'avatars'
  AND auth.uid()::text = (storage.foldername(name))[1]
)
WITH CHECK (
  bucket_id = 'avatars'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete own avatar"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'avatars'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Restrict stock_levels write operations to admins only
DROP POLICY IF EXISTS "Authenticated users can decrement stock" ON public.stock_levels;
DROP POLICY IF EXISTS "Authenticated users can insert stock" ON public.stock_levels;