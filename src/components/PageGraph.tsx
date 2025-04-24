import { useCallback, useMemo, useRef, useState } from "react";
import {
  ReactFlow,
  Controls,
  type Node,
  type Edge,
  useNodesState,
  useEdgesState,
  applyNodeChanges,
  type OnNodesChange,
  type NodeChange,
  type NodePositionChange,
  type Connection,
  type OnConnect,
  addEdge,
  Background,
} from "@xyflow/react";
import '@xyflow/react/dist/style.css';
import { PageData, PageDataNode } from "../types/page";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField } from "@mui/material";
import { updateStoryPages } from "../api/story";
import { createPage, updatePage } from "../api/page";
import { nodeTypes } from "../utils/reactFlowUtil";

interface PageGraphProps {
  pages: PageDataNode[];
  storyId: number;
  rootPageNumber: number;
}

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
    const existingPageData = (node.data.page as PageDataNode)
    const page: PageDataNode = {
      ...existingPageData,
      positionX: node.position.x,
      positionY: node.position.y,
    }
    return page;
  });
  updateStoryPages(storyId, pagesMap);
}

function getFirstAvailablePageNumber (pages: PageDataNode[]): number {
  const pageNumbers = pages.map(page => page.pageNumber);
  if (!pageNumbers) return 1;
  pageNumbers.sort();
  if (pageNumbers[pageNumbers.length - 1] < 1) return 1;
  const numbersSet = new Set(pageNumbers);
  let length = numbersSet.size;
  for (let i = 1; i <= length; i++) {
    if (!numbersSet.has(i)) {
      return i;
    }
  }

  return length + 1;
}

function getInitialNodes (pages: PageDataNode[]): Node[] {
  return pages.map((page) => ({
    id: page.pageNumber.toString(),
    type: "pageNode",
    position: { x: page.positionX, y: page.positionY },
    data: { page },
  }));
}

function PageGraph({ pages, storyId, rootPageNumber }: PageGraphProps) {
  const edges = useMemo(() => buildEdges(pages), [pages]);
  const saveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const updateQueueRef = useRef<Map<number, PageDataNode>>(new Map());
  const [nodes, setNodes, onNodesChange] = useNodesState(getInitialNodes(pages));
  const [edgeState, setEdges, onEdgesChange] = useEdgesState(edges);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [choiceText, setChoiceText] = useState("");
  const [pendingConnection, setPendingConnection] = useState<Connection | null>(null);
  const [isAddPageDialogOpen, setIsAddPageDialogOpen] = useState(false);
  const [newPageTitle, setNewPageTitle] = useState("");

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

  const handleNodeChange: OnNodesChange = useCallback(
    (changes: NodeChange[]) => {
      onNodesChange(changes);
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

          const existingPageData = (updatedNode.data.page as PageDataNode)
          const updatedPage = {
            ...existingPageData,
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
    setNewPageTitle("");
    setIsAddPageDialogOpen(true);
  };

  const handleConfirmAddPage = async () => {
    const pageNumber = getFirstAvailablePageNumber(nodes.map(node => node.data.page as PageDataNode))
    console.log(pageNumber)
    const newPage: PageDataNode = {
      storyId: storyId,
      pageNumber: pageNumber,
      title: newPageTitle || `Untitled Page`,
      paragraphs: [],
      choices: [],
      positionX: 100 + pageNumber * 100,
      positionY: 100,
      endPage: false,
    };
  
    try {
      const responsePage = await createPage(newPage);
      const newNode: Node = {
        id: responsePage.pageNumber.toString(),
        type: "pageNode",
        position: { x: responsePage.positionX, y: responsePage.positionY },
        data: { page: responsePage },
      };
  
      setNodes((prev) => [...prev, newNode]);
      setIsAddPageDialogOpen(false);
      setNewPageTitle("");
    } catch (err) {
      console.error("Failed to create page:", err);
    }
  };

  const handleConnect: OnConnect = useCallback((params: Connection) => {
    setPendingConnection(params);
    setChoiceText("");
    setIsModalOpen(true);
  }, []);

  const handleConfirmChoice = () => {
    if (!pendingConnection) return;
  
    const sourceId = parseInt(pendingConnection.source!);
    const targetId = parseInt(pendingConnection.target!);
  
    setNodes((prevNodes) => {
      return prevNodes.map((node) => {
        if (parseInt(node.id) !== sourceId) return node;
        const existingPageData = (node.data.page as PageDataNode)
  
        const page: PageDataNode = {
          ...existingPageData,
          choices: [
            ...existingPageData.choices,
            {
              targetPage: targetId,
              text: choiceText || "Untitled Choice",
            },
          ],
        };
  
        updateQueueRef.current.set(page.id!, page);
        debouncedSave();
  
        setEdges((prev) =>
          addEdge({ ...pendingConnection, id: `${sourceId}-${targetId}` }, prev)
        );
  
        return {
          ...node,
          data: { ...node.data, page },
        };
      });
    });
  
    setIsModalOpen(false);
    setPendingConnection(null);
  };

  const handleNodesDelete = useCallback((nodesToDelete: Node[]) => {
    console.warn("Node deletion is disabled.", nodesToDelete);
  }, []);

  const handleEdgesDelete = useCallback((deleted: Edge[]) => {
    setEdges((prevEdges) =>
      prevEdges.filter((edge) => !deleted.some((d) => d.id === edge.id))
    );
  
    setNodes((prevNodes) =>
      prevNodes.map((node) => {
        const page = node.data.page as PageDataNode;
  
        const updatedChoices = page.choices.filter(
          (choice) =>
            !deleted.some(
              (edge) =>
                edge.source === node.id &&
                edge.target === choice.targetPage.toString()
            )
        );
  
        if (updatedChoices.length !== page.choices.length) {
          const updatedPage: PageDataNode = {
            ...page,
            choices: updatedChoices,
          };
          updateQueueRef.current.set(updatedPage.id!, updatedPage);
          debouncedSave();
  
          return {
            ...node,
            data: {
              ...node.data,
              page: updatedPage,
            },
          };
        }
  
        return node;
      })
    );
  }, [setEdges, setNodes, debouncedSave]);

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
        onConnect={handleConnect}
        onNodesDelete={handleNodesDelete}
        onEdgesDelete={handleEdgesDelete}
        nodeTypes={nodeTypes}
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>
      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} fullWidth maxWidth={'sm'}>
        <DialogTitle>Enter Choice Text</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            placeholder="Choice Text"
            value={choiceText}
            onChange={(e) => setChoiceText(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleConfirmChoice}>Add Choice</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={isAddPageDialogOpen} onClose={() => setIsAddPageDialogOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>New Page</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            autoFocus
            placeholder="Page Title"
            value={newPageTitle}
            onChange={(e) => setNewPageTitle(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsAddPageDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleConfirmAddPage}>Add Page</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default PageGraph;