
ALTER TABLE public.reviews ADD COLUMN IF NOT EXISTS photo_urls jsonb NOT NULL DEFAULT '[]'::jsonb;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('review-photos', 'review-photos', true) 
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Review photos are public" ON storage.objects FOR SELECT USING (bucket_id = 'review-photos');
CREATE POLICY "Users upload own review photos" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'review-photos' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users delete own review photos" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'review-photos' AND auth.uid()::text = (storage.foldername(name))[1]);
