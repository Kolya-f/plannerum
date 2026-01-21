-- Перевірити чи існує таблиця
SELECT 
  table_name,
  EXISTS (
    SELECT 1 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'messages'
  ) as table_exists
FROM information_schema.tables 
WHERE table_name = 'messages';

-- Перевірити чи увімкнено Realtime
SELECT 
  schemaname,
  tablename,
  pubname
FROM pg_publication_tables 
WHERE tablename = 'messages';

-- Показати структуру таблиці
SELECT 
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
AND table_name = 'messages'
ORDER BY ordinal_position;

-- Показати повідомлення
SELECT COUNT(*) as message_count FROM messages;
SELECT * FROM messages ORDER BY created_at DESC LIMIT 5;
