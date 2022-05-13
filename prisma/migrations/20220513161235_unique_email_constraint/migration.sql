-- This is an empty migration.
ALTER TABLE public.users ADD CONSTRAINT unique_email UNIQUE (email);