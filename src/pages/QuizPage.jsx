import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useData } from '../contexts/DataContext.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';
import { USERS } from '../utils/constants.js';

const QUESTIONS = [
  '上一次被我感动是什么时候？',
  '你最喜欢和我一起做的事是什么？',
  '你觉得我最可爱的瞬间是？',
  '如果可以回到过去，你最想重温我们的哪个时刻？',
  '你最近一次想我是什么时候？',
  '你觉得我们的默契体现在哪里？',
  '我做过最让你意外的事是什么？',
];

export default function QuizPage() {
  const { data, submitQuizAnswer, addQuiz } = useData();
  const { user } = useAuth();
  const [currentQ, setCurrentQ] = useState(null);
  const [answer, setAnswer] = useState('');
  const [shaking, setShaking] = useState(false);

  const quizList = data.quiz || [];

  const handleShake = () => {
    setShaking(true);
    setTimeout(() => {
      setShaking(false);
      const question = QUESTIONS[Math.floor(Math.random() * QUESTIONS.length)];
      setCurrentQ(question);
    }, 800);
  };

  const handleSubmit = () => {
    if (!answer.trim() || !currentQ) return;
    // Find or create quiz
    let quiz = quizList.find(q => q.question === currentQ && !q.revealed);
    if (!quiz) {
      quiz = {
        question: currentQ,
        answers: { 'xia-mi': { content: null, submittedAt: null }, 'han-bao': { content: null, submittedAt: null } },
        revealed: false,
      };
      addQuiz(quiz);
      // Find the newly added quiz
      quiz = (data.quiz || []).find(q => q.question === currentQ && !q.revealed) || quiz;
    }
    submitQuizAnswer(quiz.id, user?.username, answer.trim());
    setAnswer('');
    setCurrentQ(null);
  };

  const partnerKey = user?.username === 'xia-mi' ? 'han-bao' : 'xia-mi';
  const partner = USERS[partnerKey];

  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: 20 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem' }}>🏺 秘密问答罐</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
          摇一摇罐子，回答对方的问题
        </p>
      </div>

      {/* Jar */}
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <motion.button
          onClick={handleShake}
          animate={shaking ? { rotate: [0, -15, 15, -15, 15, 0], x: [0, -5, 5, -5, 5, 0] } : {}}
          transition={{ duration: 0.6 }}
          style={{
            fontSize: '5rem', cursor: 'pointer',
            background: 'none', border: 'none',
            filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.15))',
          }}
        >
          🏺
        </motion.button>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 8 }}>
          👆 点击摇一摇
        </p>
      </div>

      {/* Current Question */}
      <AnimatePresence>
        {currentQ && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="hand-drawn-card"
            style={{ marginBottom: 20 }}
          >
            <div style={{ textAlign: 'center', marginBottom: 16 }}>
              <span style={{ fontSize: '1.2rem' }}>📜</span>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', margin: '8px 0' }}>
                {currentQ}
              </h3>
            </div>
            <textarea
              value={answer}
              onChange={e => setAnswer(e.target.value)}
              rows={3}
              placeholder="写下你的真心话……"
              style={{
                width: '100%', padding: '12px',
                borderRadius: 'var(--radius-card)',
                border: '1px solid var(--border-color)',
                fontFamily: 'var(--font-body)', fontSize: '0.9rem',
                resize: 'vertical',
              }}
            />
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 12 }}>
              <button onClick={() => setCurrentQ(null)} className="hand-drawn-btn">跳过</button>
              <button onClick={handleSubmit} className="hand-drawn-btn primary">💌 封存答案</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Answered Quizzes */}
      <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: 12, fontSize: '1rem' }}>
        📋 已回答的问题
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {quizList.filter(q => q.answers[user?.username]?.content).map(quiz => {
          const bothAnswered = quiz.answers['xia-mi']?.content && quiz.answers['han-bao']?.content;
          return (
            <motion.div
              key={quiz.id}
              className="hand-drawn-card"
              style={{ padding: 14, opacity: bothAnswered ? 1 : 0.7 }}
            >
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.9rem', marginBottom: 6 }}>
                {quiz.question}
              </div>
              {bothAnswered ? (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  <div style={{ fontSize: '0.8rem', padding: 8, background: 'var(--shrimp-light)', borderRadius: 8 }}>
                    🦐 {quiz.answers['xia-mi'].content}
                  </div>
                  <div style={{ fontSize: '0.8rem', padding: 8, background: 'var(--burger-light)', borderRadius: 8 }}>
                    🍔 {quiz.answers['han-bao'].content}
                  </div>
                </div>
              ) : (
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  等待{partner?.emoji} {partner?.name}的回答……
                </div>
              )}
            </motion.div>
          );
        })}
        {quizList.filter(q => q.answers[user?.username]?.content).length === 0 && (
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 20 }}>
            还没有回答过问题，摇一摇罐子吧～
          </p>
        )}
      </div>
    </div>
  );
}
