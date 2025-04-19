import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ReactFlow, {
  Background,
  Controls,
  Node,
  Edge,
  useNodesState,
  useEdgesState,
  Handle,
  Position,
  NodeTypes,
  OnNodesChange,
  OnEdgesChange,
  NodeChange,
  EdgeChange,
  applyNodeChanges,
  applyEdgeChanges,
} from "react-flow-renderer";
import PageCard from "./PageCard";
import { PageData, PageDataNode } from "../types/page";
import { Button } from "@mui/material";
import { updateStoryPages } from "../api/story";

interface PageGraphProps {
  pages: PageDataNode[];
  storyId: number;
  rootPageNumber: number;
}

interface SavedPosition {
  x: number;
  y: number;
}

function PageCardNode({ data }: { data: { page: PageData } }) {
  return (
    <div style={{ width: 300, position: "relative" }}>
      <Handle type="target" position={Position.Left} style={{ background: "#555" }} />
      <PageCard page={data.page} />
      <Handle type="source" position={Position.Right} style={{ background: "#555" }} />
    </div>
  );
}

const nodeTypes: NodeTypes = {
    pageNode: PageCardNode,
};

const LOCAL_STORAGE_KEY = "page_positions";



function buildEdges(pages: PageData[]): Edge[] {
  const edges: Edge[] = [];
  for (const page of pages) {
    for (const choice of page.choices) {
      edges.push({
        id: `${page.pageNumber}-${choice.targetPage}`,
        source: page.pageNumber.toString(),
        target: choice.targetPage.toString(),
      });
    }
  }
  return edges;
}

function loadPositions(): Record<number, SavedPosition> {
  const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
  return saved ? JSON.parse(saved) : {};
}

function savePositions(storyId: number, nodes: Node[]) {
  const pagesMap: PageDataNode[] = nodes.map(node => {
    const page: PageDataNode = {
      ...node.data.page,
      positionX: node.position.x,
      positionY: node.position.y,
    }
    return page;
  });
  updateStoryPages(storyId, pagesMap).then(() => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  })
}

function PageGraph({ pages, storyId, rootPageNumber }: PageGraphProps) {
  const savedPositions = useMemo(loadPositions, []);
  const edges = useMemo(() => buildEdges(pages), [pages]);
  const saveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const debouncedSave = useCallback((positions: Record<number, SavedPosition>) => {
    if (saveTimeout.current) {
        clearTimeout(saveTimeout.current);
    }

    saveTimeout.current = setTimeout(() => {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(positions));
        saveTimeout.current = null;
    }, 500);
    }, []);


  const initialNodes: Node[] = pages.map((page) => ({
    id: page.pageNumber.toString(),
    type: "pageNode",
    position: savedPositions[page.pageNumber] || { x: page.positionX, y: page.positionY },
    data: { page },
  }));

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edgeState, setEdges, onEdgesChange] = useEdgesState(edges);

  // Save on drag/move
  const handleNodeChange: OnNodesChange = useCallback(
    (changes: NodeChange[]) => {
      const hasPositionChanged = changes.some(change => change.type === 'position');
      if (!hasPositionChanged) return;
      
      const updatedNodes = applyNodeChanges(changes, nodes);
      setNodes(updatedNodes);

      const positions: Record<number, SavedPosition> = {};
      updatedNodes.forEach((node) => {
        positions[parseInt(node.id)] = node.position;
      });
      debouncedSave(positions);
    },
    [nodes, setNodes]
  );

  return (
    <div style={{ height: "90vh", width: "100%" }}>
      <Button variant="outlined" onClick={() => savePositions(storyId, nodes)}>Save</Button>
      <ReactFlow
        nodes={nodes}
        edges={edgeState}
        onNodesChange={handleNodeChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}

export default PageGraph;