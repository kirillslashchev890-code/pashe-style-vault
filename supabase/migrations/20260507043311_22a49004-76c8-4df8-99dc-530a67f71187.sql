CREATE POLICY "Users can update their own review photos"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'review-photos' AND (auth.uid())::text = (storage.foldername(name))[1])
WITH CHECK (bucket_id = 'review-photos' AND (auth.uid())::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own review photos"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'review-photos' AND (auth.uid())::text = (storage.foldername(name))[1]);