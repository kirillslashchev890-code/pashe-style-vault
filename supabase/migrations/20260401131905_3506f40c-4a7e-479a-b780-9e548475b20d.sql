
DROP POLICY "Authenticated users can update stock" ON public.stock_levels;
DROP POLICY "Authenticated can insert stock" ON public.stock_levels;
CREATE POLICY "Authenticated users can decrement stock" ON public.stock_levels FOR UPDATE TO authenticated USING (true) WITH CHECK (quantity >= 0);
CREATE POLICY "Authenticated users can insert stock" ON public.stock_levels FOR INSERT TO authenticated WITH CHECK (true);
