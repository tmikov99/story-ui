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
import { ChoiceData, PageData, PageDataNode } from "../../types/page";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Menu, MenuItem, Stack, TextField } from "@mui/material";
import { updateStoryPages } from "../../api/story";
import { createPage, deletePage, updatePage } from "../../api/page";
import { nodeTypes } from "../../utils/reactFlowUtil";

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
  const [newPageParagraphs, setNewPageParagraphs] = useState(['']);
  const [newPageChoices, setNewPageChoices] = useState<ChoiceData[]>([]);
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [menuTargetPage, setMenuTargetPage] = useState<PageData | null>(null);
  const [dialogMode, setDialogMode] = useState<"add" | "edit">("add");
  const [editingPageNumber, setEditingPageNumber] = useState<number | null>(null);


  function handleMenuOpen (event: React.MouseEvent<HTMLElement>, page: PageData) {
    event.stopPropagation();
    setMenuAnchorEl(event.currentTarget);
    setMenuTargetPage(page);
  };

  function getInitialNodes (pages: PageDataNode[]): Node[] {
    return pages.map((page) => ({
      id: page.pageNumber.toString(),
      type: "pageNode",
      position: { x: page.positionX, y: page.positionY },
      data: { 
        page,
        onMenuOpen: (event: React.MouseEvent<HTMLElement>, page: PageData) => handleMenuOpen(event, page)
       },
      
    }));
  }

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setMenuTargetPage(null);
  };

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
    setDialogMode("add");
    setNewPageTitle("");
    setNewPageParagraphs([""]);
    setNewPageChoices([]);
    setIsAddPageDialogOpen(true);
  };

  const handleConfirmAddPage = async () => {
    if (dialogMode === "add") {
      const pageNumber = getFirstAvailablePageNumber(nodes.map(node => node.data.page as PageDataNode));
      const newPage: PageDataNode = {
        storyId,
        pageNumber,
        title: newPageTitle || `Untitled Page`,
        paragraphs: newPageParagraphs,
        choices: newPageChoices,
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
          data: { page: responsePage, onMenuOpen: handleMenuOpen },
        };
  
        setNodes((prev) => {
          const updatedNodes = [...prev, newNode];
          const updatedPages = updatedNodes.map(node => node.data.page as PageDataNode);
          setEdges(buildEdges(updatedPages));
          return updatedNodes;
        });
    
        setIsAddPageDialogOpen(false);
        setNewPageTitle("");
      } catch (err) {
        console.error("Failed to create page:", err);
      }
    } else if (dialogMode === "edit" && editingPageNumber !== null) {
      setNodes((prevNodes) => {
        const updatedNodes = prevNodes.map((node) => {
          if (parseInt(node.id) !== editingPageNumber) return node;
          const pageData = (node.data.page  as PageDataNode);
          
          const page = {
            ...pageData,
            title: newPageTitle,
            paragraphs: newPageParagraphs,
            choices: newPageChoices
          };
  
          updateQueueRef.current.set(page.id!, page);
          debouncedSave();
  
          return {
            ...node,
            data: {
              ...node.data,
              page,
            },
          };
        });
        const updatedPages = updatedNodes.map((node) => node.data.page as PageDataNode);
        setEdges(buildEdges(updatedPages));
      
        return updatedNodes;
      });
  
      setIsAddPageDialogOpen(false);
      setNewPageTitle("");
      setEditingPageNumber(null);
      setDialogMode("add");
    }
  };

  const handleConnect: OnConnect = useCallback((params: Connection) => {
    setPendingConnection(params);
    setChoiceText("");
    setIsModalOpen(true);
  }, []);

  const handleEditPage = () => {
    if (menuTargetPage) {
      setDialogMode("edit");
      setEditingPageNumber(menuTargetPage.pageNumber);
      setNewPageTitle(menuTargetPage.title);
      setNewPageParagraphs([...menuTargetPage.paragraphs]);
      setNewPageChoices([...menuTargetPage.choices]);
      setIsAddPageDialogOpen(true);
    }
    handleMenuClose();
  }

  const handleDeletePage = async () => {
    if (!menuTargetPage || !menuTargetPage.id) return;

    const pageIdToDelete = menuTargetPage.pageNumber.toString();

    setNodes((prevNodes) => prevNodes.filter((node) => node.id !== pageIdToDelete));

    setEdges((prevEdges) =>
      prevEdges.filter(
        (edge) => edge.source !== pageIdToDelete && edge.target !== pageIdToDelete
      )
    );

    await deletePage(menuTargetPage.id);

    handleMenuClose();
  }

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
          {newPageParagraphs.map((p, idx) => (
            <TextField
              key={idx}
              fullWidth
              multiline
              placeholder={`Paragraph ${idx + 1}`}
              value={p}
              onChange={(e) => {
                const updated = [...newPageParagraphs];
                updated[idx] = e.target.value;
                setNewPageParagraphs(updated);
              }}
              sx={{ mb: 1 }}
            />
          ))}
          <Button onClick={() => setNewPageParagraphs([...newPageParagraphs, ''])}>
            Add Paragraph
          </Button>

          {newPageChoices.map((choice, idx) => (
            <Stack direction="row" spacing={1} alignItems="center" key={idx} sx={{ mt: 1 }}>
              <TextField
                fullWidth
                placeholder="Choice Text"
                value={choice.text}
                onChange={(e) => {
                  const updated = [...newPageChoices];
                  updated[idx].text = e.target.value;
                  setNewPageChoices(updated);
                }}
              />
              <TextField
                placeholder="Target Page"
                value={choice.targetPage}
                onChange={(e) => {
                  const updated = [...newPageChoices];
                  updated[idx].targetPage = Number(e.target.value);
                  setNewPageChoices(updated);
                }}
                sx={{ width: 100 }}
              />
            </Stack>
          ))}
          <Button onClick={() => setNewPageChoices([...newPageChoices, { text: '', targetPage: 0 }])}>
            Add Choice
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsAddPageDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleConfirmAddPage}>
            {dialogMode === "add" ? "Add Page" : "Save Changes"}
          </Button>
        </DialogActions>
      </Dialog>
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleEditPage}>Edit</MenuItem>
        <MenuItem onClick={handleDeletePage}>Delete</MenuItem>
      </Menu>
    </Box>
  );
}

export default PageGraph;