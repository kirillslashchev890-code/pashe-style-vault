
-- Stock levels table (text-based product IDs to match frontend)
CREATE TABLE public.stock_levels (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id text NOT NULL,
  size text NOT NULL,
  color_name text NOT NULL,
  quantity integer NOT NULL DEFAULT 50,
  UNIQUE(product_id, size, color_name)
);
ALTER TABLE public.stock_levels ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Stock is publicly readable" ON public.stock_levels FOR SELECT TO public USING (true);
CREATE POLICY "Authenticated users can update stock" ON public.stock_levels FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Admins can manage stock" ON public.stock_levels FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Authenticated can insert stock" ON public.stock_levels FOR INSERT TO authenticated WITH CHECK (true);

-- Return requests table
CREATE TABLE public.return_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL,
  user_id uuid NOT NULL,
  reason text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  admin_comment text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.return_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own returns" ON public.return_requests FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can create returns" ON public.return_requests FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can view all returns" ON public.return_requests FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update returns" ON public.return_requests FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Support messages table
CREATE TABLE public.support_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  conversation_id uuid NOT NULL DEFAULT gen_random_uuid(),
  role text NOT NULL DEFAULT 'user',
  content text NOT NULL,
  needs_admin boolean NOT NULL DEFAULT false,
  admin_reply text,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.support_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own messages" ON public.support_messages FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can send messages" ON public.support_messages FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can view all messages" ON public.support_messages FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update messages" ON public.support_messages FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
