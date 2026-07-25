import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useData } from '../contexts/DataContext.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';
import { USERS } from '../utils/constants.js';

const QUESTIONS = [
  '上一次被我感动是什么时候？', '你最喜欢和我一起做的事是什么？', '你觉得我最可爱的瞬间是？',
  '如果可以回到过去，你最想重温我们的哪个时刻？', '你最近一次想我是什么时候？',
  '你觉得我们的默契体现在哪里？', '我做过最让你意外的事是什么？',
  '你最想和我一起去的地方是？', '用一个词形容我在你心里的样子',
  '如果给我改一个昵称，你会叫我什么？', '我们之间最搞笑的一件事是？',
  '如果有一天我们吵架了，你会怎么做？',
];

export default function QuizPage() {
  const { data, submitQuizAnswer, addQuiz } = useData();
  const { user } = useAuth();
  const [currentQ, setCurrentQ] = useState(null);
  const [answer, setAnswer] = useState('');
  const [shaking, setShaking] = useState(false);

  const quizList = data.quiz || [];
  const partnerKey = user?.username === 'xia-mi' ? 'han-bao' : 'xia-mi';
  const partner = USERS[partnerKey];

  const handleShake = () => {
    setShaking(true);
    setTimeout(() => {
      setShaking(false);
      setCurrentQ(QUESTIONS[Math.floor(Math.random() * QUESTIONS.length)]);
    }, 700);
  };

  const handleSubmit = () => {
    if (!answer.trim() || !currentQ) return;
    let quiz = quizList.find(q => q.question === currentQ && !q.revealed);
    if (!quiz) {
      quiz = {
        question: currentQ,
        answers: { 'xia-mi': { content: null, submittedAt: null }, 'han-bao': { content: null, submittedAt: null } },
        revealed: false,
      };
      addQuiz(quiz);
    }
    submitQuizAnswer(quiz.id, user?.username, answer.trim());
    setAnswer('');
    setCurrentQ(null);
  };

  return (
    <div>
      <div className="page-header">
        <h1>🏺 秘密问答罐</h1>
        <p>摇一摇罐子，回答藏在里面的问题</p>
      </div>

      {/* Jar */}
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <motion.button onClick={handleShake}
          animate={shaking ? { rotate: [0, -12, 12, -12, 12, 0], x: [0, -4, 4, -4, 4, 0] } : {}}
          transition={{ duration: 0.5 }}
          whileHover={{ scale: 1.05, rotate: [0, -3, 3, 0] }}
          style={{
            fontSize: '5rem', cursor: 'pointer', background: 'none', border: 'none',
            filter: 'drop-shadow(0 6px 16px rgba(0,0,0,0.12))',
          }}>
          🏺
        </motion.button>
        <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 8 }}>👆 点击摇一摇</p>
      </div>

      <AnimatePresence>
        {currentQ && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
            className="hand-drawn-card" style={{ marginBottom: 20 }}>
            <div style={{ textAlign: 'center', marginBottom: 14 }}>
              <span style={{ fontSize: '1.2rem' }}>📜</span>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', margin: '6px 0' }}>{currentQ}</h3>
            </div>
            <textarea value={answer} onChange={e => setAnswer(e.target.value)} rows={3}
              placeholder="写下你的真心话……" className="textarea-field" />
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 12 }}>
              <button onClick={() => setCurrentQ(null)} className="hand-drawn-btn">跳过</button>
              <button onClick={handleSubmit} className="hand-drawn-btn primary">💌 封存答案</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <h3 className="section-title">📋 已回答的问题</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {quizList.filter(q => q.answers?.[user?.username]?.content).map(quiz => {
          const bothAnswered = quiz.answers?.['xia-mi']?.content && quiz.answers?.['han-bao']?.content;
          return (
            <motion.div key={quiz.id} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
              className="hand-drawn-card flat" style={{ padding: 14 }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.9rem', marginBottom: 8 }}>{quiz.question}</div>
              {bothAnswered ? (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  <div style={{ fontSize: '0.8rem', padding: 10, background: 'var(--shrimp-light)', borderRadius: 10, border: '1px solid var(--shrimp-color)30' }}>
                    <div style={{ fontSize: '0.68rem', marginBottom: 4 }}>🦐 虾米</div>
                    {quiz.answers['xia-mi'].content}
                  </div>
                  <div style={{ fontSize: '0.8rem', padding: 10, background: 'var(--burger-light)', borderRadius: 10, border: '1px solid var(--burger-color)30' }}>
                    <div style={{ fontSize: '0.68rem', marginBottom: 4 }}>🍔 汉堡</div>
                    {quiz.answers['han-bao'].content}
                  </div>
                </div>
              ) : (
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  等待 {partner?.emoji} {partner?.name} 的回答……
                </div>
              )}
            </motion.div>
          );
        })}
        {quizList.filter(q => q.answers?.[user?.username]?.content).length === 0 && (
          <div className="empty-state"><span className="empty-icon">🏺</span><p className="empty-title">还没有回答过问题</p><p className="empty-subtitle">摇一摇罐子开始吧～</p></div>
        )}
      </div>
    </div>
  );
}
