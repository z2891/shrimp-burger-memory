import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DiaryBook from '../components/diary/DiaryBook.jsx';
import DiaryEditor from '../components/diary/DiaryEditor.jsx';
import { useData } from '../contexts/DataContext.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';

export default function DiaryPage() {
  const { data, addDiaryEntry, updateDiaryEntry } = useData();
  const { user } = useAuth();
  const [showEditor, setShowEditor] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);

  const entries = data.diary || [];

  const handleNewEntry = (existingEntry) => {
    setEditingEntry(existingEntry);
    setShowEditor(true);
  };

  const handleSave = (entryData) => {
    if (editingEntry) {
      // Reply to existing entry
      const updatedEntries = {
        ...editingEntry.entries,
        [user.username]: {
          content: entryData.content,
          mood: entryData.mood,
          writtenAt: Date.now(),
        },
      };
      updateDiaryEntry(editingEntry.id, { entries: updatedEntries });
    } else {
      // New entry
      const newEntry = {
        date: entryData.date,
        topic: entryData.topic,
        entries: {
          'xia-mi': { content: null, mood: null, writtenAt: null },
          'han-bao': { content: null, mood: null, writtenAt: null },
          [user.username]: {
            content: entryData.content,
            mood: entryData.mood,
            writtenAt: Date.now(),
          },
        },
        currentTurn: user.username === 'xia-mi' ? 'han-bao' : 'xia-mi',
      };
      addDiaryEntry(newEntry);
    }
    setShowEditor(false);
    setEditingEntry(null);
  };

  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: 20 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem' }}>📔 交换日记</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
          {user?.username === 'xia-mi' ? '🦐 虾米' : '🍔 汉堡'}，今天想写点什么？
        </p>
      </div>

      {showEditor ? (
        <DiaryEditor
          existingEntry={editingEntry}
          onSave={handleSave}
          onCancel={() => { setShowEditor(false); setEditingEntry(null); }}
        />
      ) : (
        <DiaryBook
          entries={entries}
          onNewEntry={handleNewEntry}
        />
      )}
    </div>
  );
}
