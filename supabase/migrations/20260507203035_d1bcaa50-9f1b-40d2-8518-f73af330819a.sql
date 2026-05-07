CREATE TABLE public.early_access (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT,
  organisation TEXT,
  board_sim_choice TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.early_access ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone can insert early access" ON public.early_access FOR INSERT TO anon, authenticated WITH CHECK (true);