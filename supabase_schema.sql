-- 虾米与汉堡 数据库建表脚本
-- 请在 Supabase SQL Editor 中运行
-- 打开 https://frmwqyraqqnxxgfvllhw.supabase.co → 左侧 SQL Editor → 粘贴 → Run

-- 1. 回忆（时光轴）
CREATE TABLE IF NOT EXISTS couple_memories (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL DEFAULT 'photo',
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  "position" JSONB DEFAULT '{"x":0,"y":0}',
  date TEXT DEFAULT '',
  "createdBy" TEXT DEFAULT '',
  mood TEXT DEFAULT '',
  "moodEmoji" TEXT DEFAULT '',
  badge TEXT DEFAULT NULL,
  "isFirst" BOOLEAN DEFAULT false,
  "mediaUrl" TEXT DEFAULT NULL,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. 交换日记
CREATE TABLE IF NOT EXISTS couple_diary (
  id TEXT PRIMARY KEY,
  date TEXT DEFAULT '',
  topic TEXT DEFAULT '',
  entries JSONB DEFAULT '{}',
  "currentTurn" TEXT DEFAULT '',
  updated_at TIMESTAMPTZ DEFAULT now()
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
  "isOpened" BOOLEAN DEFAULT false,
  updated_at TIMESTAMPTZ DEFAULT now()
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
  "createdAt" BIGINT DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 5. 100种表达
CREATE TABLE IF NOT EXISTS couple_expressions (
  id TEXT PRIMARY KEY,
  author TEXT DEFAULT '',
  content TEXT DEFAULT '',
  date TEXT DEFAULT '',
  turn INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 6. 问答罐
CREATE TABLE IF NOT EXISTS couple_quiz (
  id TEXT PRIMARY KEY,
  question TEXT DEFAULT '',
  answers JSONB DEFAULT '{}',
  revealed BOOLEAN DEFAULT false,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 7. 倒计时
CREATE TABLE IF NOT EXISTS couple_countdowns (
  id TEXT PRIMARY KEY,
  title TEXT DEFAULT '',
  "targetDate" TEXT DEFAULT '',
  "createdBy" TEXT DEFAULT '',
  icon TEXT DEFAULT '⏳',
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 8. 第一次
CREATE TABLE IF NOT EXISTS couple_firsts (
  id TEXT PRIMARY KEY,
  title TEXT DEFAULT '',
  date TEXT DEFAULT '',
  description TEXT DEFAULT '',
  badge TEXT DEFAULT '⭐',
  unlocked BOOLEAN DEFAULT true,
  updated_at TIMESTAMPTZ DEFAULT now()
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
  "moodStamp" TEXT DEFAULT '',
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ====== 开放权限 ======
ALTER TABLE couple_memories ENABLE ROW LEVEL SECURITY;
ALTER TABLE couple_diary ENABLE ROW LEVEL SECURITY;
ALTER TABLE couple_letters ENABLE ROW LEVEL SECURITY;
ALTER TABLE couple_vouchers ENABLE ROW LEVEL SECURITY;
ALTER TABLE couple_expressions ENABLE ROW LEVEL SECURITY;
ALTER TABLE couple_quiz ENABLE ROW LEVEL SECURITY;
ALTER TABLE couple_countdowns ENABLE ROW LEVEL SECURITY;
ALTER TABLE couple_firsts ENABLE ROW LEVEL SECURITY;
ALTER TABLE couple_mailbox ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all" ON couple_memories FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON couple_diary FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON couple_letters FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON couple_vouchers FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON couple_expressions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON couple_quiz FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON couple_countdowns FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON couple_firsts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON couple_mailbox FOR ALL USING (true) WITH CHECK (true);
