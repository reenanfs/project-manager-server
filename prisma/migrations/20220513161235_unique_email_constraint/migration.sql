-- This is an empty migration.
ALTER TABLE users ADD CONSTRAINT unique_email UNIQUE (email);