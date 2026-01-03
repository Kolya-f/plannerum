-- Створити таблицю повідомлень
CREATE TABLE IF NOT EXISTS messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  text TEXT NOT NULL,
  user_id TEXT NOT NULL,
  user_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Додати індекс для швидкого пошуку
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);
CREATE INDEX IF NOT EXISTS idx_messages_user_id ON messages(user_id);

-- Увімкнути real-time для таблиці
ALTER TABLE messages REPLICA IDENTITY FULL;

-- Створити політики безпеки (для анонімного доступу)
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous insert" ON messages
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow anonymous select" ON messages
  FOR SELECT USING (true);
