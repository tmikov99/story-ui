import { Handle, Position, NodeTypes } from '@xyflow/react';
import PageCard from '../components/PageCard';
import { PageData } from '../types/page';

export function PageCardNode({ data }: { data: { page: PageData } }) {
  return (
    <div style={{ width: 300, position: "relative" }}>
      <Handle type="target" position={Position.Left} style={{ background: "#555", width: "1rem", height: "1rem" }} />
      <PageCard page={data.page} />
      <Handle type="source" position={Position.Right} style={{ background: "#555", width: "1rem", height: "1rem" }} />
    </div>
  );
}

export const nodeTypes: NodeTypes = {
  pageNode: PageCardNode,
};