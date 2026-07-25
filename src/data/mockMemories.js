import { generateId } from '../utils/storage.js';

export function createMockData() {
  const now = new Date();
  const fmt = d => d.toISOString().split('T')[0];

  return {
    memories: [
      {
        id: generateId(), type: 'first', title: '我们的第一次合照', description: '情人节那天，在江边的日落时分，你笑得好灿烂。那天风很温柔，我偷偷看了你好多次。', position: { x: 38, y: 28 }, date: '2026-02-14', createdBy: 'xia-mi', mood: '开心到冒泡', moodEmoji: '🫧', badge: '📸', isFirst: true,
      },
      {
        id: generateId(), type: 'first', title: '第一次一起下厨', description: '你切菜我炒菜，厨房被我们搞得一团糟，但那顿饭是全世界最好吃的。', position: { x: 55, y: 45 }, date: '2026-03-08', createdBy: 'han-bao', mood: '被投喂中', moodEmoji: '🍜', badge: '🍳', isFirst: true,
      },
      {
        id: generateId(), type: 'first', title: '第一次一起旅行', description: '春天的杭州，西湖边的柳树刚发芽。和你一起骑车环湖，我想时间就停在这一刻。', position: { x: 25, y: 55 }, date: '2026-04-04', createdBy: 'xia-mi', mood: '冒险日', moodEmoji: '🗺️', badge: '✈️', isFirst: true,
      },
      {
        id: generateId(), type: 'photo', title: '虾米的生日惊喜', description: '偷偷准备了半个月，看到你惊讶的表情一切都值了。', position: { x: 65, y: 20 }, date: '2026-03-20', createdBy: 'han-bao', mood: '超爱你', moodEmoji: '💖',
      },
      {
        id: generateId(), type: 'photo', title: '周末野餐', description: '阳光、草地、三明治和你，完美的周末配方。', position: { x: 45, y: 60 }, date: '2026-05-02', createdBy: 'xia-mi', mood: '暖暖的', moodEmoji: '🕯️',
      },
      {
        id: generateId(), type: 'diary', title: '雨天的小事', description: '下雨天一起窝在沙发上看电影，你靠在我肩上睡着了。', position: { x: 70, y: 35 }, date: '2026-06-08', createdBy: 'han-bao', mood: '下雨天想你', moodEmoji: '🌧️',
      },
      {
        id: generateId(), type: 'photo', title: '一起看演唱会', description: '灯光亮起的那一刻，我们同时转头看向对方。', position: { x: 30, y: 40 }, date: '2026-07-01', createdBy: 'xia-mi', mood: '期待见面', moodEmoji: '🎪',
      },
      {
        id: generateId(), type: 'letter', title: '一封时光信', description: '写给明年今天的我们……', position: { x: 50, y: 70 }, date: '2026-07-15', createdBy: 'han-bao', mood: '好幸运有你', moodEmoji: '✨',
      },
      {
        id: generateId(), type: 'first', title: '第一次说"我爱你"', description: '不是刻意的，就是看着你的眼睛，自然而然就说出来了。', position: { x: 60, y: 50 }, date: '2026-03-01', createdBy: 'han-bao', mood: '超爱你', moodEmoji: '💖', badge: '💕', isFirst: true,
      },
      {
        id: generateId(), type: 'first', title: '100天纪念日', description: '100天啦！感觉像刚认识，又感觉认识了一辈子。', position: { x: 42, y: 38 }, date: '2026-05-25', createdBy: 'xia-mi', mood: '好幸运有你', moodEmoji: '✨', badge: '💯', isFirst: true,
      },
    ],
    diary: [
      {
        id: 'diary_001', date: fmt(new Date(now - 7*86400000)), topic: '今天最想和你分享的一件事',
        entries: {
          'xia-mi': { content: '今天上班路上看到一只小橘猫，胖嘟嘟的，让我想起你说我像猫。其实你才像猫——又傲娇又黏人。\n\n中午吃饭的时候同事问我为什么总是笑，我没说。因为我在想昨晚你发的那个傻傻的表情包。', mood: '暖暖的', writtenAt: Date.now() - 7*86400000 },
          'han-bao': { content: '被你说像猫，我要反驳！我明明是威猛的大老虎。\n\n不过今天确实有件开心的事：项目终于通过了！第一个就想告诉你，但忍住了，想当面看你替我高兴的样子。', mood: '开心到冒泡', writtenAt: Date.now() - 6*86400000 },
        },
        currentTurn: 'xia-mi',
      },
      {
        id: 'diary_002', date: fmt(new Date(now - 3*86400000)), topic: '如果明天是世界末日',
        entries: {
          'xia-mi': { content: '如果明天是世界末日，我今天要做的事很简单：\n\n1. 和你一起吃一顿好的\n2. 翻一遍我们的相册\n3. 在你怀里睡去\n\n好像也不需要什么特别的。有你在，末日也没什么好怕的。', mood: '好幸运有你', writtenAt: Date.now() - 3*86400000 },
          'han-bao': { content: null, mood: null, writtenAt: null },
        },
        currentTurn: 'han-bao',
      },
      {
        id: 'diary_003', date: fmt(new Date(now - 1*86400000)), topic: '我最喜欢的你的小习惯',
        entries: {
          'xia-mi': { content: null, mood: null, writtenAt: null },
          'han-bao': { content: '你睡觉前一定要刷一遍手机才肯放下，但你不知道的是，你每次刷完手机都会往我这边蹭一蹭，像在确认我还在。\n\n这个习惯，请保持一辈子。', mood: '有点想你', writtenAt: Date.now() - 1*86400000 },
        },
        currentTurn: 'xia-mi',
      },
    ],
    firsts: [
      { id: generateId(), title: '第一次合照', date: '2026-02-14', description: '情人节的江边日落', badge: '📸', unlocked: true },
      { id: generateId(), title: '第一次牵手', date: '2026-02-14', description: '看完日落往回走的时候', badge: '🤝', unlocked: true },
      { id: generateId(), title: '第一次说"我爱你"', date: '2026-03-01', description: '在回家的路上，脱口而出', badge: '💕', unlocked: true },
      { id: generateId(), title: '第一次一起下厨', date: '2026-03-08', description: '你的拿手菜：番茄炒蛋', badge: '🍳', unlocked: true },
      { id: generateId(), title: '第一次一起旅行', date: '2026-04-04', description: '杭州，西湖环湖骑行', badge: '✈️', unlocked: true },
      { id: generateId(), title: '第一次吵架又和好', date: '2026-04-20', description: '忘了为什么吵，只记得和好后抱了很久', badge: '🌈', unlocked: true },
      { id: generateId(), title: '100天纪念日', date: '2026-05-25', description: '100天！做了对方最喜欢的菜', badge: '💯', unlocked: true },
      { id: generateId(), title: '第一次给对方过生日', date: '2026-03-20', description: '偷偷准备了一个月', badge: '🎂', unlocked: true },
    ],
    letters: [
      {
        id: generateId(), from: 'xia-mi', title: '给下个月的你', content: '嘿，一个月后的汉堡：\n\n现在的你过得怎么样？还在为那个项目头疼吗？不管怎样，我想告诉你——你超棒的！\n\n一个月前的虾米\n（正在偷偷想你）',
        sealColor: '#FF6B6B', writtenAt: Date.now() - 15*86400000,
        unlockAt: new Date(now.getTime() + 15*86400000).toISOString(), isOpened: false,
      },
    ],
    vouchers: [
      { id: generateId(), from: 'han-bao', title: '💆 按摩券', description: '有效期：随时，时长：30分钟', icon: '💆', isRedeemed: false, redeemedAt: null, createdAt: Date.now() - 7*86400000 },
      { id: generateId(), from: 'xia-mi', title: '🏅 免生气金牌', description: '使用后立即生效，生气清零', icon: '🏅', isRedeemed: false, redeemedAt: null, createdAt: Date.now() - 3*86400000 },
      { id: generateId(), from: 'han-bao', title: '🌟 一个愿望券', description: '许一个愿，我来帮你实现', icon: '🌟', isRedeemed: true, redeemedAt: Date.now() - 1*86400000, createdAt: Date.now() - 14*86400000 },
    ],
    expressions: [
      { id: generateId(), author: 'xia-mi', content: '今天路过你爱吃的蛋糕店，不自觉就走了进去。', date: fmt(new Date(now - 6*86400000)), turn: 1 },
      { id: generateId(), author: 'han-bao', content: '你就是那种让我想要变得更好的人。', date: fmt(new Date(now - 5*86400000)), turn: 2 },
      { id: generateId(), author: 'xia-mi', content: '和你在一起，无聊的事都变得有趣。', date: fmt(new Date(now - 4*86400000)), turn: 3 },
      { id: generateId(), author: 'han-bao', content: '我今天看见一朵云，形状像🦐。', date: fmt(new Date(now - 3*86400000)), turn: 4 },
      { id: generateId(), author: 'xia-mi', content: '你睡着的样子很可爱，像一只安静的🍔。', date: fmt(new Date(now - 2*86400000)), turn: 5 },
    ],
    quiz: [
      {
        id: generateId(), question: '上一次被我感动是什么时候？',
        answers: { 'xia-mi': { content: null, submittedAt: null }, 'han-bao': { content: null, submittedAt: null } }, revealed: false,
      },
      {
        id: generateId(), question: '你最喜欢和我一起做的事是什么？',
        answers: { 'xia-mi': { content: '一起躺在沙发上看电影，什么都不用想。', submittedAt: Date.now() - 7*86400000 }, 'han-bao': { content: '一起逛超市，推着购物车讨论今天吃什么。', submittedAt: Date.now() - 6*86400000 } }, revealed: true,
      },
    ],
    countdowns: [
      { id: generateId(), title: '🏖️ 下次海边旅行', targetDate: '2026-09-15', createdBy: 'han-bao', icon: '🏖️' },
      { id: generateId(), title: '🎂 虾米的生日', targetDate: '2027-03-20', createdBy: 'han-bao', icon: '🦐' },
      { id: generateId(), title: '💕 一周年纪念日', targetDate: '2027-02-14', createdBy: 'xia-mi', icon: '💕' },
    ],
  };
}

// Initialize mock data if first visit
export function initializeMockData() {
  const STORAGE_KEYS = {
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

  const CURRENT_VERSION = 'v2';
  if (localStorage.getItem('couple_version') === CURRENT_VERSION) return;

  const mock = createMockData();

  // Always reset auth with correct password
  localStorage.setItem('couple_auth', JSON.stringify({
    users: {
      'xia-mi': { name: '虾米', emoji: '🦐', color: '#FF6B6B', password: '20260214' },
      'han-bao': { name: '汉堡', emoji: '🍔', color: '#FFB347', password: '20260214' },
    }
  }));

  localStorage.setItem('couple_memories', JSON.stringify(mock.memories));
  localStorage.setItem('couple_diary', JSON.stringify(mock.diary));
  localStorage.setItem('couple_letters', JSON.stringify(mock.letters));
  localStorage.setItem('couple_vouchers', JSON.stringify(mock.vouchers));
  localStorage.setItem('couple_expressions', JSON.stringify(mock.expressions));
  localStorage.setItem('couple_quiz', JSON.stringify(mock.quiz));
  localStorage.setItem('couple_countdowns', JSON.stringify(mock.countdowns));
  localStorage.setItem('couple_firsts', JSON.stringify(mock.firsts));
  localStorage.setItem('couple_mailbox', JSON.stringify([]));

  localStorage.setItem('couple_version', CURRENT_VERSION);
}
