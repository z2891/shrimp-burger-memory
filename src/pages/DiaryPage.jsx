import { useState } from 'react';
import DiaryBook from '../components/diary/DiaryBook.jsx';
import DiaryEditor from '../components/diary/DiaryEditor.jsx';
import { useData } from '../contexts/DataContext.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';

export default function DiaryPage() {
  const { data, addDiaryEntry, updateDiaryEntry, addMemory } = useData();
  const { user } = useAuth();
  const [showEditor, setShowEditor] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [editingOwnContent, setEditingOwnContent] = useState(null);
  const [editingOwnMood, setEditingOwnMood] = useState(null);

  const entries = data.diary || [];

  // Write new or reply (partner hasn't written yet)
  const handleNewEntry = (existingEntry) => {
    setEditingEntry(existingEntry);
    setEditingOwnContent(null);
    setEditingOwnMood(null);
    setShowEditor(true);
  };

  // Edit own existing entry
  const handleEditOwn = (entry) => {
    const ownEntry = entry.entries?.[user?.username];
    setEditingEntry(entry);
    setEditingOwnContent(ownEntry?.content || '');
    setEditingOwnMood(ownEntry?.mood || 'happy-bubble');
    setShowEditor(true);
  };

  const handleSave = (entryData) => {
    const updatedEntries = {
      ...(editingEntry?.entries || {}),
      [user.username]: {
        content: entryData.content,
        mood: entryData.mood,
        photo: entryData.photo || editingEntry?.entries?.[user.username]?.photo || null,
        writtenAt: Date.now(),
      },
    };

    if (editingEntry) {
      const isFirstTime = !editingEntry.entries?.[user.username]?.content;

      updateDiaryEntry(editingEntry.id, {
        entries: updatedEntries,
        currentTurn: isFirstTime ? (user.username === 'xia-mi' ? 'han-bao' : 'xia-mi') : editingEntry.currentTurn,
      });

      // Upsert timeline card — same ID as first person's card, add() now deduplicates locally
      const bothWritten = updatedEntries['xia-mi']?.content && updatedEntries['han-bao']?.content;
      const desc = bothWritten
        ? `🦐${(updatedEntries['xia-mi']?.content || '').slice(0, 70)}...\n🍔${(updatedEntries['han-bao']?.content || '').slice(0, 70)}...`
        : entryData.content.slice(0, 150) + (entryData.content.length > 150 ? '...' : '');
      addMemory({
        id: 'mem_diary_' + editingEntry.id,
        type: 'diary',
        title: entryData.topic || editingEntry.topic,
        description: desc,
        date: entryData.date || editingEntry.date,
        createdBy: bothWritten ? 'xia-mi' : user?.username,
        mood: bothWritten ? 'love' : entryData.mood,
        moodEmoji: bothWritten ? '✅' : '📔',
      });
    } else {
      // New diary
      const diaryId = 'diary_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
      const newEntry = {
        id: diaryId,
        date: entryData.date,
        topic: entryData.topic,
        entries: {
          'xia-mi': { content: null, mood: null, writtenAt: null },
          'han-bao': { content: null, mood: null, writtenAt: null },
          [user.username]: {
            content: entryData.content,
            mood: entryData.mood,
            photo: entryData.photo || null,
            writtenAt: Date.now(),
          },
        },
        currentTurn: user.username === 'xia-mi' ? 'han-bao' : 'xia-mi',
      };
      addDiaryEntry(newEntry);
      addMemory({
        id: 'mem_diary_' + diaryId,
        type: 'diary',
        title: entryData.topic,
        description: entryData.content.slice(0, 150) + (entryData.content.length > 150 ? '...' : ''),
        date: entryData.date,
        createdBy: user?.username,
        mood: entryData.mood,
        moodEmoji: '📔',
      });
    }
    setShowEditor(false);
    setEditingEntry(null);
    setEditingOwnContent(null);
    setEditingOwnMood(null);
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
          ownPreviousContent={editingOwnContent}
          ownPreviousMood={editingOwnMood}
          onSave={handleSave}
          onCancel={() => { setShowEditor(false); setEditingEntry(null); setEditingOwnContent(null); setEditingOwnMood(null); }}
        />
      ) : (
        <DiaryBook
          entries={entries}
          onNewEntry={handleNewEntry}
          onEditOwn={handleEditOwn}
        />
      )}
    </div>
  );
}
