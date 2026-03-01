
-- Fix all RLS policies: recreate as PERMISSIVE (default) instead of RESTRICTIVE

-- cart_items
DROP POLICY IF EXISTS "Users can view own cart" ON cart_items;
DROP POLICY IF EXISTS "Users can add to own cart" ON cart_items;
DROP POLICY IF EXISTS "Users can update own cart" ON cart_items;
DROP POLICY IF EXISTS "Users can delete from own cart" ON cart_items;
CREATE POLICY "Users can view own cart" ON cart_items FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can add to own cart" ON cart_items FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own cart" ON cart_items FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete from own cart" ON cart_items FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- wishlist
DROP POLICY IF EXISTS "Users can view own wishlist" ON wishlist;
DROP POLICY IF EXISTS "Users can add to own wishlist" ON wishlist;
DROP POLICY IF EXISTS "Users can delete from own wishlist" ON wishlist;
CREATE POLICY "Users can view own wishlist" ON wishlist FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can add to own wishlist" ON wishlist FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete from own wishlist" ON wishlist FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- orders
DROP POLICY IF EXISTS "Users can view own orders" ON orders;
DROP POLICY IF EXISTS "Users can create own orders" ON orders;
DROP POLICY IF EXISTS "Admins can manage orders" ON orders;
CREATE POLICY "Users can view own orders" ON orders FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can create own orders" ON orders FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can view all orders" ON orders FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- order_items
DROP POLICY IF EXISTS "Users can view own order items" ON order_items;
DROP POLICY IF EXISTS "Admins can manage order items" ON order_items;
CREATE POLICY "Users can view own order items" ON order_items FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()));
CREATE POLICY "Users can insert order items" ON order_items FOR INSERT TO authenticated WITH CHECK (EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()));
CREATE POLICY "Admins can view all order items" ON order_items FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- profiles
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can view all profiles" ON profiles FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- user_roles
DROP POLICY IF EXISTS "Users can view own roles" ON user_roles;
DROP POLICY IF EXISTS "Admins can manage roles" ON user_roles;
CREATE POLICY "Users can view own roles" ON user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage roles" ON user_roles FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- products
DROP POLICY IF EXISTS "Products are public" ON products;
DROP POLICY IF EXISTS "Admins can manage products" ON products;
CREATE POLICY "Products are public" ON products FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage products" ON products FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- categories
DROP POLICY IF EXISTS "Categories are public" ON categories;
DROP POLICY IF EXISTS "Admins can manage categories" ON categories;
CREATE POLICY "Categories are public" ON categories FOR SELECT USING (true);
CREATE POLICY "Admins can manage categories" ON categories FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- brands
DROP POLICY IF EXISTS "Brands are public" ON brands;
DROP POLICY IF EXISTS "Admins can manage brands" ON brands;
CREATE POLICY "Brands are public" ON brands FOR SELECT USING (true);
CREATE POLICY "Admins can manage brands" ON brands FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- size_guide
DROP POLICY IF EXISTS "Size guide is public" ON size_guide;
DROP POLICY IF EXISTS "Admins can manage size guide" ON size_guide;
CREATE POLICY "Size guide is public" ON size_guide FOR SELECT USING (true);
CREATE POLICY "Admins can manage size guide" ON size_guide FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- product_colors
DROP POLICY IF EXISTS "Product colors are public" ON product_colors;
DROP POLICY IF EXISTS "Admins can manage product colors" ON product_colors;
CREATE POLICY "Product colors are public" ON product_colors FOR SELECT USING (true);
CREATE POLICY "Admins can manage product colors" ON product_colors FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- product_images
DROP POLICY IF EXISTS "Product images are public" ON product_images;
DROP POLICY IF EXISTS "Admins can manage product images" ON product_images;
CREATE POLICY "Product images are public" ON product_images FOR SELECT USING (true);
CREATE POLICY "Admins can manage product images" ON product_images FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- product_inventory
DROP POLICY IF EXISTS "Inventory is public" ON product_inventory;
DROP POLICY IF EXISTS "Admins can manage inventory" ON product_inventory;
CREATE POLICY "Inventory is public" ON product_inventory FOR SELECT USING (true);
CREATE POLICY "Admins can manage inventory" ON product_inventory FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- reviews already created as permissive
