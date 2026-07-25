import TimeMap from '../components/map/TimeMap.jsx';
import { useData } from '../contexts/DataContext.jsx';
import { generateId } from '../utils/storage.js';

export default function HomePage() {
  const { data, addMemory, updateMemory, deleteMemory } = useData();
  const memories = data.memories || [];

  const handleAddMemory = (memoryData) => {
    addMemory({ id: generateId(), ...memoryData });
  };

  const handleEditMemory = (id, updates) => {
    updateMemory(id, updates);
  };

  const handleDeleteMemory = (id) => {
    deleteMemory(id);
  };

  return (
    <div style={{ paddingBottom: 16 }}>
      <TimeMap
        memories={memories}
        onAddMemory={handleAddMemory}
        onEditMemory={handleEditMemory}
        onDeleteMemory={handleDeleteMemory}
      />
    </div>
  );
}
