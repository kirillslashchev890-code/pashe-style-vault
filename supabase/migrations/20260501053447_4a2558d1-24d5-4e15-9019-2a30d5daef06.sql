CREATE OR REPLACE FUNCTION public.decrement_stock(
  _product_id text,
  _size text,
  _color_name text,
  _qty integer
) RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _new_qty integer;
  _current integer;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  IF _qty IS NULL OR _qty < 1 OR _qty > 50 THEN
    RAISE EXCEPTION 'Invalid quantity';
  END IF;

  SELECT quantity INTO _current
  FROM public.stock_levels
  WHERE product_id = _product_id AND size = _size
    AND (color_name IS NOT DISTINCT FROM _color_name);

  IF _current IS NULL THEN
    INSERT INTO public.stock_levels (product_id, size, color_name, quantity)
    VALUES (_product_id, _size, _color_name, GREATEST(0, 50 - _qty))
    RETURNING quantity INTO _new_qty;
    RETURN _new_qty;
  END IF;

  _new_qty := GREATEST(0, _current - _qty);

  UPDATE public.stock_levels
  SET quantity = _new_qty
  WHERE product_id = _product_id AND size = _size
    AND (color_name IS NOT DISTINCT FROM _color_name);

  RETURN _new_qty;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.decrement_stock(text, text, text, integer) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.decrement_stock(text, text, text, integer) TO authenticated;