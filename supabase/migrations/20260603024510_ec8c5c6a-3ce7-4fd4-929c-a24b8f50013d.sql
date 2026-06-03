-- Add explicit restrictive policies to order_items so users cannot modify/delete their own order items after placement
-- Admins retain full control

-- Admin can update order items
CREATE POLICY "Admins can update order items"
ON public.order_items
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admin can delete order items
CREATE POLICY "Admins can delete order items"
ON public.order_items
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Explicit deny: regular users cannot update order items
CREATE POLICY "Users cannot update order items"
ON public.order_items
FOR UPDATE
TO authenticated
USING (FALSE);

-- Explicit deny: regular users cannot delete order items
CREATE POLICY "Users cannot delete order items"
ON public.order_items
FOR DELETE
TO authenticated
USING (FALSE);