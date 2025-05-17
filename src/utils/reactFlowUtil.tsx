import { Handle, Position, NodeTypes } from '@xyflow/react';
import PageCard from '../components/page/PageCard';
import { PageData } from '../types/page';
import { Badge } from '@mui/material';

interface PageCardNodeProps {
  data: { 
    page: PageData;
    rootPageNumber?: number;
    onMenuOpen?: (e: React.MouseEvent<HTMLElement>, page: PageData) => void;
   };
  selected: boolean;
  
}

export function PageCardNode({ data, selected }: PageCardNodeProps) {
  const { page, onMenuOpen, rootPageNumber } = data;
  const isStartPage = page.pageNumber === rootPageNumber;

  return (
    <div style={{ width: 300, position: "relative" }}>
      <Handle type="target" position={Position.Left} style={{ background: "#555", width: "1rem", height: "1rem" }} />
      <Badge
        badgeContent="Start"
        color="primary"
        invisible={!isStartPage}
        sx={{ position: "absolute", top: 0, right: 0, zIndex: 10 }}
      />
      <PageCard page={page} selected={selected} onMenuOpen={onMenuOpen}/>
      <Handle type="source" position={Position.Right} style={{ background: "#555", width: "1rem", height: "1rem" }} />
    </div>
  );
}

export const nodeTypes: NodeTypes = {
  pageNode: PageCardNode,
};