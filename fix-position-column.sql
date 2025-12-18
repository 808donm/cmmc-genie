-- Fix for login error: "The column User.position does not exist in the current database"
-- Execute this SQL in your Neon database dashboard

ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "position" TEXT;

-- Verify the column was added
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'User' AND column_name = 'position';
