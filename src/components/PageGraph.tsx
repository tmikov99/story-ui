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
  NodePositionChange,
} from "react-flow-renderer";
import PageCard from "./PageCard";
import { PageData, PageDataNode } from "../types/page";
import { Box, Button, Stack } from "@mui/material";
import { updateStoryPages } from "../api/story";
import { createPage, updatePage } from "../api/page";

interface PageGraphProps {
  pages: PageDataNode[];
  storyId: number;
  rootPageNumber: number;
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
  const edges = useMemo(() => buildEdges(pages), [pages]);
  const saveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const updateQueueRef = useRef<Map<number, PageDataNode>>(new Map());

  const debouncedSave = useCallback(() => {
    if (saveTimeout.current) {
        clearTimeout(saveTimeout.current);
    }

    saveTimeout.current = setTimeout(async () => {
      const updates = Array.from(updateQueueRef.current.values());
      if (updates.length > 0) {
        try {
          await Promise.all(updates.map((page) => updatePage(page)));
        } catch (err) {
          console.error("Failed to update page positions:", err);
        }
        updateQueueRef.current.clear();
      }
    }, 500);
    }, []);


  const initialNodes: Node[] = pages.map((page) => ({
    id: page.pageNumber.toString(),
    type: "pageNode",
    position: { x: page.positionX, y: page.positionY },
    data: { page },
  }));

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edgeState, setEdges, onEdgesChange] = useEdgesState(edges);

  const handleNodeChange: OnNodesChange = useCallback(
    (changes: NodeChange[]) => {
      const hasPositionChanged = changes.some(
        (change): change is NodePositionChange => change.type === "position"
      );
      if (!hasPositionChanged) return;
      
      const updatedNodes = applyNodeChanges(changes, nodes);
      setNodes(updatedNodes);

      const updatedPages = changes
        .filter((c): c is NodePositionChange => c.type === "position")
        .map((change) => {
          const updatedNode = updatedNodes.find((node) => node.id === change.id);
          if (!updatedNode) return null;

          const updatedPage = {
            ...updatedNode.data.page,
            positionX: updatedNode.position.x,
            positionY: updatedNode.position.y,
          };
          return updatedPage;
        })
        .filter((p): p is PageDataNode => p !== null);

      for (const page of updatedPages) {
        updateQueueRef.current.set(page.id!, page);
      }

      debouncedSave();
    },
    [nodes, setNodes]
  );

  const handleAddPage = async () => {
    const newId = nodes.length > 0 
      ? Math.max(...nodes.map((n) => parseInt(n.id))) + 1 
      : 1;
  
    const newPage: PageDataNode = {
      storyId: storyId,
      pageNumber: newId,
      title: `Untitled Page`,
      paragraphs: [],
      choices: [],
      positionX: 100 + newId * 100,
      positionY: 100,
      endPage: false,
    };

    try {
      const responsePage = await createPage(newPage);
      const newNode: Node = {
        id: responsePage.id.toString(),
        type: "pageNode",
        position: { x: responsePage.positionX, y: responsePage.positionY },
        data: { page: responsePage },
      };
  
      setNodes((prev) => [...prev, newNode]);
    } catch (err) {
      console.error("Failed to create page:", err);
    }
  };

  //TODO: Take height from theme/calc
  return (
    <Box style={{ height: "84vh", width: "100%" }}>
      <Stack direction={"row"} gap={1}>
        <Button variant="outlined" onClick={() => savePositions(storyId, nodes)}>Save</Button>
        <Button
          variant="contained"
          onClick={handleAddPage}
        >
          Add Page
        </Button>
      </Stack>
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
    </Box>
  );
}

export default PageGraph;