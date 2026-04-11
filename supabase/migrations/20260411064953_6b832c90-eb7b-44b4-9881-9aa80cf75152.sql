
CREATE TABLE public.product_overrides (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id text UNIQUE NOT NULL,
  price numeric,
  original_price numeric,
  is_new boolean,
  discount_until timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.product_overrides ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Product overrides are public readable"
  ON public.product_overrides FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage product overrides"
  ON public.product_overrides FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TABLE public.custom_products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_key text UNIQUE NOT NULL,
  name text NOT NULL,
  category text NOT NULL,
  subcategory text,
  brand text NOT NULL DEFAULT 'PASHE Original',
  description text,
  composition text,
  care text,
  country text,
  price numeric NOT NULL,
  original_price numeric,
  is_new boolean DEFAULT false,
  colors jsonb NOT NULL DEFAULT '[]'::jsonb,
  color_images jsonb NOT NULL DEFAULT '{}'::jsonb,
  images jsonb NOT NULL DEFAULT '[]'::jsonb,
  sizes jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.custom_products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Custom products are public readable"
  ON public.custom_products FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage custom products"
  ON public.custom_products FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
