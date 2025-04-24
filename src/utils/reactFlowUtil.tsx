import { Handle, Position, NodeTypes } from '@xyflow/react';
import PageCard from '../components/PageCard';
import { PageData } from '../types/page';

interface PageCardNodeProps {
  data: { 
    page: PageData;
    onMenuOpen?: (e: React.MouseEvent<HTMLElement>, page: PageData) => void;
   };
  selected: boolean;
  
}

export function PageCardNode({ data, selected }: PageCardNodeProps) {
  const { page, onMenuOpen } = data;
  return (
    <div style={{ width: 300, position: "relative" }}>
      <Handle type="target" position={Position.Left} style={{ background: "#555", width: "1rem", height: "1rem" }} />
      <PageCard page={page} selected={selected} onMenuOpen={onMenuOpen}/>
      <Handle type="source" position={Position.Right} style={{ background: "#555", width: "1rem", height: "1rem" }} />
    </div>
  );
}

export const nodeTypes: NodeTypes = {
  pageNode: PageCardNode,
};