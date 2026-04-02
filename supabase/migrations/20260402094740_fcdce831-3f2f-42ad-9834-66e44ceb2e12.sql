
-- Allow admins to delete profiles
CREATE POLICY "Admins can delete profiles" ON public.profiles
FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Allow admins to delete user_roles
CREATE POLICY "Admins can delete roles" ON public.user_roles
FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Allow admins to delete cart_items for any user
CREATE POLICY "Admins can delete cart items" ON public.cart_items
FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Allow admins to delete wishlist for any user
CREATE POLICY "Admins can delete wishlist" ON public.wishlist
FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));
