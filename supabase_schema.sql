-- 虾米与汉堡 数据库建表脚本
-- 请在 Supabase SQL Editor 中运行此文件全部内容

-- 注意：from 和 to 是 SQL 保留字，必须用双引号括起来

-- 1. 回忆（时光轴）
CREATE TABLE IF NOT EXISTS couple_memories (
  id TEXT PRIMARY KEY,
  type TEXT DEFAULT 'photo',
  title TEXT DEFAULT '',
  description TEXT DEFAULT '',
  date TEXT DEFAULT '',
  "createdBy" TEXT DEFAULT '',
  mood TEXT DEFAULT '',
  "moodEmoji" TEXT DEFAULT '',
  badge TEXT DEFAULT NULL,
  "isFirst" BOOLEAN DEFAULT false,
  "mediaUrl" TEXT DEFAULT NULL
);

-- 2. 交换日记
CREATE TABLE IF NOT EXISTS couple_diary (
  id TEXT PRIMARY KEY,
  date TEXT DEFAULT '',
  topic TEXT DEFAULT '',
  entries JSONB DEFAULT '{}',
  "currentTurn" TEXT DEFAULT ''
);

-- 3. 时光信
CREATE TABLE IF NOT EXISTS couple_letters (
  id TEXT PRIMARY KEY,
  "from" TEXT DEFAULT '',
  title TEXT DEFAULT '',
  content TEXT DEFAULT '',
  "sealColor" TEXT DEFAULT '#FF6B6B',
  "writtenAt" BIGINT DEFAULT 0,
  "unlockAt" TEXT DEFAULT '',
  "isOpened" BOOLEAN DEFAULT false
);

-- 4. 兑换券
CREATE TABLE IF NOT EXISTS couple_vouchers (
  id TEXT PRIMARY KEY,
  "from" TEXT DEFAULT '',
  title TEXT DEFAULT '',
  description TEXT DEFAULT '',
  icon TEXT DEFAULT '🎫',
  "isRedeemed" BOOLEAN DEFAULT false,
  "redeemedAt" BIGINT DEFAULT NULL,
  "createdAt" BIGINT DEFAULT 0
);

-- 5. 100种表达
CREATE TABLE IF NOT EXISTS couple_expressions (
  id TEXT PRIMARY KEY,
  author TEXT DEFAULT '',
  content TEXT DEFAULT '',
  date TEXT DEFAULT '',
  turn INTEGER DEFAULT 0
);

-- 6. 问答罐
CREATE TABLE IF NOT EXISTS couple_quiz (
  id TEXT PRIMARY KEY,
  question TEXT DEFAULT '',
  answers JSONB DEFAULT '{}',
  revealed BOOLEAN DEFAULT false
);

-- 7. 倒计时
CREATE TABLE IF NOT EXISTS couple_countdowns (
  id TEXT PRIMARY KEY,
  title TEXT DEFAULT '',
  "targetDate" TEXT DEFAULT '',
  "createdBy" TEXT DEFAULT '',
  icon TEXT DEFAULT '⏳'
);

-- 8. 第一次
CREATE TABLE IF NOT EXISTS couple_firsts (
  id TEXT PRIMARY KEY,
  title TEXT DEFAULT '',
  date TEXT DEFAULT '',
  description TEXT DEFAULT '',
  badge TEXT DEFAULT '⭐',
  unlocked BOOLEAN DEFAULT true
);

-- 9. 信箱
CREATE TABLE IF NOT EXISTS couple_mailbox (
  id TEXT PRIMARY KEY,
  "from" TEXT DEFAULT '',
  "to" TEXT DEFAULT '',
  title TEXT DEFAULT '',
  content TEXT DEFAULT '',
  "sendAt" TEXT DEFAULT '',
  "deliveredAt" TEXT DEFAULT '',
  "isDelivered" BOOLEAN DEFAULT false,
  "isRead" BOOLEAN DEFAULT false,
  "moodStamp" TEXT DEFAULT ''
);

-- ====== 开放权限（链接即私密） ======
DO $$
DECLARE
  tbl TEXT;
BEGIN
  FOR tbl IN
    SELECT unnest(ARRAY[
      'couple_memories','couple_diary','couple_letters','couple_vouchers',
      'couple_expressions','couple_quiz','couple_countdowns','couple_firsts','couple_mailbox'
    ])
  LOOP
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', tbl);
    EXECUTE format('DROP POLICY IF EXISTS "Allow all" ON %I', tbl);
    EXECUTE format('CREATE POLICY "Allow all" ON %I FOR ALL USING (true) WITH CHECK (true)', tbl);
  END LOOP;
END $$;
