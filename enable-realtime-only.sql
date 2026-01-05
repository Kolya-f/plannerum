-- Лише увімкнути Realtime (якщо таблиця вже існує)
ALTER PUBLICATION supabase_realtime ADD TABLE messages;

-- Перевірити результат
SELECT 
  'Realtime enabled for messages' as status,
  tablename,
  pubname
FROM pg_publication_tables 
WHERE tablename = 'messages';

-- Додати тестові повідомлення (якщо їх немає)
INSERT INTO messages (text, user_id, user_name) 
SELECT * FROM (VALUES
  ('👋 Welcome to Global Chat!', 'system', 'System'),
  ('💬 Messages sync in real-time', 'system', 'System'),
  ('🌍 Open in two browsers to test', 'system', 'System')
) AS new_messages(text, user_id, user_name)
WHERE NOT EXISTS (SELECT 1 FROM messages WHERE text = new_messages.text);

-- Показати результат
SELECT 'Setup complete' as status, COUNT(*) as total_messages FROM messages;
