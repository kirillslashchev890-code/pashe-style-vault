ALTER TABLE public.support_messages
ADD COLUMN IF NOT EXISTS ticket_status text NOT NULL DEFAULT 'open',
ADD COLUMN IF NOT EXISTS assigned_admin_id uuid NULL,
ADD COLUMN IF NOT EXISTS resolved_at timestamp with time zone NULL,
ADD COLUMN IF NOT EXISTS resolved_by uuid NULL;

ALTER TABLE public.return_requests
ADD COLUMN IF NOT EXISTS defect_photo_url text NULL,
ADD COLUMN IF NOT EXISTS return_description text NULL,
ADD COLUMN IF NOT EXISTS return_shipping_note text NULL;

CREATE TABLE IF NOT EXISTS public.monthly_revenue_snapshots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  month_key text NOT NULL UNIQUE,
  revenue numeric NOT NULL DEFAULT 0,
  delivered_orders integer NOT NULL DEFAULT 0,
  items_summary jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.monthly_revenue_snapshots ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'monthly_revenue_snapshots' AND policyname = 'Admins can view revenue snapshots'
  ) THEN
    CREATE POLICY "Admins can view revenue snapshots"
    ON public.monthly_revenue_snapshots
    FOR SELECT
    TO authenticated
    USING (public.has_role(auth.uid(), 'admin'));
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'monthly_revenue_snapshots' AND policyname = 'Admins can manage revenue snapshots'
  ) THEN
    CREATE POLICY "Admins can manage revenue snapshots"
    ON public.monthly_revenue_snapshots
    FOR ALL
    TO authenticated
    USING (public.has_role(auth.uid(), 'admin'))
    WITH CHECK (public.has_role(auth.uid(), 'admin'));
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_support_messages_ticket_status ON public.support_messages(ticket_status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_support_messages_user_conversation ON public.support_messages(user_id, conversation_id, created_at ASC);
CREATE INDEX IF NOT EXISTS idx_return_requests_status_created_at ON public.return_requests(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_monthly_revenue_snapshots_month_key ON public.monthly_revenue_snapshots(month_key);

DROP TRIGGER IF EXISTS update_monthly_revenue_snapshots_updated_at ON public.monthly_revenue_snapshots;
CREATE TRIGGER update_monthly_revenue_snapshots_updated_at
BEFORE UPDATE ON public.monthly_revenue_snapshots
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();