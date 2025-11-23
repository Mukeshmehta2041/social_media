import { List } from 'react-window';
import type { Advertisement } from '../../types';
import AdCard from './AdCard';

interface VirtualizedAdListProps {
  ads: Advertisement[];
  height?: number;
}

const VirtualizedAdList = ({ ads, height = 600 }: VirtualizedAdListProps) => {
  if (ads.length === 0) {
    return null;
  }

  // Calculate item height (approximate height of AdCard)
  const itemHeight = 140;

  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => (
    <div style={style}>
      <AdCard ad={ads[index]} />
    </div>
  );

  return (
    <List<Record<string, never>>
      defaultHeight={Math.min(height, ads.length * itemHeight)}
      rowCount={ads.length}
      rowHeight={itemHeight}
      rowComponent={Row}
      rowProps={{}}
      style={{ width: '100%' }}
    />
  );
};

export default VirtualizedAdList;

