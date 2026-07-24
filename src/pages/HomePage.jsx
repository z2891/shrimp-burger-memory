import TimeMap from '../components/map/TimeMap.jsx';
import { useData } from '../contexts/DataContext.jsx';
import { generateId } from '../utils/storage.js';

export default function HomePage() {
  const { data, addMemory } = useData();
  const memories = data.memories || [];

  const handleAddMemory = (memoryData) => {
    addMemory({
      id: generateId(),
      ...memoryData,
    });
  };

  return (
    <div style={{ paddingBottom: 16 }}>
      <TimeMap
        memories={memories}
        onAddMemory={handleAddMemory}
      />
    </div>
  );
}
