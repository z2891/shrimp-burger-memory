// ============================================
// Constants — Colors, moods, users, topics
// ============================================

export const USERS = {
  'xia-mi': { name: '虾米', emoji: '🦐', color: '#FF6B6B', lightColor: '#FFE0E0', darkColor: '#D94444' },
  'han-bao': { name: '汉堡', emoji: '🍔', color: '#FFB347', lightColor: '#FFF0D0', darkColor: '#E89920' },
};

export const MOOD_STAMPS = [
  { id: 'happy-bubble', label: '开心到冒泡', emoji: '🫧', color: '#FF6B6B' },
  { id: 'miss-you', label: '有点想你', emoji: '💭', color: '#B8D4E3' },
  { id: 'fed', label: '被投喂中', emoji: '🍜', color: '#FFB347' },
  { id: 'grateful', label: '好幸运有你', emoji: '✨', color: '#F0C75E' },
  { id: 'cozy', label: '暖暖的', emoji: '🕯️', color: '#E8A598' },
  { id: 'silly', label: '一起犯傻', emoji: '🤪', color: '#8CB89F' },
  { id: 'love', label: '超爱你', emoji: '💖', color: '#FF6B6B' },
  { id: 'sleepy', label: '困困的', emoji: '😴', color: '#B8A899' },
  { id: 'excited', label: '期待见面', emoji: '🎪', color: '#F0C75E' },
  { id: 'adventure', label: '冒险日', emoji: '🗺️', color: '#8CB89F' },
  { id: 'foodie', label: '美食打卡', emoji: '🍰', color: '#FFB347' },
  { id: 'rainy', label: '下雨天想你', emoji: '🌧️', color: '#B8D4E3' },
];

export const DIARY_TOPICS = [
  '今天最想和你分享的一件事',
  '我们第一次见面的那天',
  '你最让我心动的瞬间',
  '如果明天是世界末日',
  '我想和你一起变老的方式',
  '最近一次被你感动',
  '我们的秘密暗号',
  '明年今天，我们会在哪里？',
  '你做过最让我开心的事',
  '我最喜欢的你的小习惯',
  '如果可以回到过去',
  '写给你的一封迷你情书',
  '今天你让我笑出声的时刻',
  '我们一起做过的疯狂小事',
  '你的哪个瞬间让我觉得"就是你了"',
];

export const VOUCHER_TEMPLATES = [
  { title: '💆 按摩券', description: '有效期：一次，时长：30分钟', icon: '💆' },
  { title: '😤 免生气金牌', description: '使用后立即生效，生气清零', icon: '🏅' },
  { title: '🤗 无条件拥抱券', description: '随时兑换一个大大拥抱', icon: '🤗' },
  { title: '🍳 早餐服务券', description: '兑换一份爱心早餐', icon: '🍳' },
  { title: '🎬 电影选择权', description: '这次看什么你说了算', icon: '🎬' },
  { title: '🌙 睡前故事券', description: '兑换一个睡前故事', icon: '🌙' },
  { title: '🙏 一个愿望券', description: '许一个愿，我来帮你实现', icon: '🌟' },
  { title: '🍰 甜品日', description: '今天的甜品我包了', icon: '🍰' },
];

export const ANNIVERSARIES = [
  { date: '02-14', label: '在一起的日子 💕', isMain: true },
  { date: '03-20', label: '虾米的生日 🦐', forUser: 'xia-mi' },
  { date: '09-08', label: '汉堡的生日 🍔', forUser: 'han-bao' },
];

export const RELATIONSHIP_START = '2026-02-14';

export const STORAGE_KEYS = {
  AUTH: 'couple_auth',
  MEMORIES: 'couple_memories',
  DIARY: 'couple_diary',
  LETTERS: 'couple_letters',
  VOUCHERS: 'couple_vouchers',
  EXPRESSIONS: 'couple_expressions',
  QUIZ: 'couple_quiz',
  COUNTDOWNS: 'couple_countdowns',
  FIRSTS: 'couple_firsts',
  MAILBOX: 'couple_mailbox',
};
