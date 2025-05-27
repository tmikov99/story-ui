import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
import { ChoiceData, Enemy, PageData, PageDataNode, StatModifiers, StoryItem } from "../../types/page";
import { Avatar, Box, Button, Card, CardActions, CardContent, Checkbox, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Divider, FormControlLabel, FormGroup, IconButton, Menu, MenuItem, Stack, TextField, Typography } from "@mui/material";
import { updateStartPageNumber } from "../../api/story";
import { createPage, deletePage, updatePage } from "../../api/page";
import { nodeTypes } from "../../utils/reactFlowUtil";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { showSnackbar } from "../../redux/snackbarSlice";
import { useConfirmDialog } from "../../hooks/ConfirmDialogProvider";
import Grid from '@mui/material/Grid2';
import DeleteIcon from '@mui/icons-material/Delete';
import { createStoryItem, deleteStoryItem, fetchStoryItems, updateStoryItem } from "../../api/items";
import { getStatFormatting } from "../../utils/formatStory";
import { gray } from "../../theme/themePrimitives";

interface PageGraphProps {
  pages: PageDataNode[];
  storyId: number;
  storyTitle: string;
  rootPageNumber: number;
  setRootPageNumber: (pageNumber: number) => void;
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

const emojiOptions = [
  "🗡️", "🛡️", "🧪", "💎", "📘", "🍖", "🕯️", "🔮", "🪓", "🏹", "🚪",
  "🧥", "👑", "⚗️", "🗺️", "🗝️", "🔑", "🐾", "💰", "🪙", "📿", "🎒",
  "🧵", "🪄", "🔥", "🧊", "🌪️", "☠️", "🌿", "🕸️", "⚔️", "🧭", "🕵️",
  "📜", "🏺", "⛺", "🪖", "🗿", "🎯", "💣", "🛶", "🧙", "🦴", "📦",
];

function PageGraph({ pages, storyId, storyTitle, rootPageNumber, setRootPageNumber }: PageGraphProps) {
  const edges = useMemo(() => buildEdges(pages), [pages]);
  const saveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const updateQueueRef = useRef<Map<number, PageDataNode>>(new Map());
  const [nodes, setNodes, onNodesChange] = useNodesState(getInitialNodes(pages));
  const [edgeState, setEdges, onEdgesChange] = useEdgesState(edges);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [choiceText, setChoiceText] = useState("");
  const [requiresLuckCheck, setRequiresLuckCheck] = useState(false);
  const [choiceRequiredItems, setChoiceRequiredItems] = useState<StoryItem[]>([]);
  const [pendingConnection, setPendingConnection] = useState<Connection | null>(null);
  const [isAddPageDialogOpen, setIsAddPageDialogOpen] = useState(false);
  const [newPageTitle, setNewPageTitle] = useState("");
  const [newPageParagraphs, setNewPageParagraphs] = useState(['']);
  const [newPageChoices, setNewPageChoices] = useState<ChoiceData[]>([]);
  const [newEnemy, setNewEnemy] = useState<Enemy | undefined>(undefined);
  const [newStatModifiers, setNewStatModifiers] = useState<StatModifiers | undefined>(undefined);
  const [showEnemy, setShowEnemy] = useState(false);
  const [showModifiers, setShowModifiers] = useState(false);
  const [newPageItemsGranted, setNewPageItemsGranted] = useState<StoryItem[]>([]);
  const [newPageItemsRemoved, setNewPageItemsRemoved] = useState<StoryItem[]>([]);
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [menuTargetPage, setMenuTargetPage] = useState<PageData | null>(null);
  const [dialogMode, setDialogMode] = useState<"add" | "edit">("add");
  const [editingPageNumber, setEditingPageNumber] = useState<number | null>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { showConfirm } = useConfirmDialog();
  const [isItemDialogOpen, setIsItemDialogOpen] = useState(false);
  const [itemDialogMode, setItemDialogMode] = useState<"add" | "edit">("add");
  const [showItemModifiers, setShowItemModifiers] = useState(false);
  const [isItemListDialogOpen, setIsItemListDialogOpen] = useState(false);
  const [itemListDialogMode, setItemListDialogMode] = useState<"grant" | "remove" | "required" | null>(null);
  const [itemListDialogChoiceIndex, setItemListDialogChoiceIndex] = useState<number | null>(null);
  const [storyItems, setStoryItems] = useState<StoryItem[]>([]);

  const [itemForm, setItemForm] = useState<StoryItem>({
    id: null,
    name: "",
    description: "",
    icon: "",
    statModifiers: undefined,
  });

  useEffect(() => {
    setNodes((prevNodes) =>
      prevNodes.map((node) => ({
        ...node,
        data: {
          ...node.data,
          rootPageNumber,
        },
      }))
    );
  }, [rootPageNumber, setNodes]);

  function handleMenuOpen (event: React.MouseEvent<HTMLElement>, page: PageData) {
    event.stopPropagation();
    event.preventDefault();
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
        rootPageNumber,
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
          dispatch(showSnackbar({ message: "Failed to update page positions.", severity: "error" }));
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
    setNewPageItemsGranted([]);
    setNewPageItemsRemoved([]);
    setShowEnemy(false)
    setShowModifiers(false);
    setNewEnemy(undefined);
    setNewStatModifiers(undefined);
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
        enemy: newEnemy,
        statModifiers: newStatModifiers,
        itemsGranted: newPageItemsGranted,
        itemsRemoved: newPageItemsRemoved,
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
        setNewPageParagraphs([""]);
        setNewPageChoices([]);
        setShowEnemy(false)
        setShowModifiers(false);
        setNewEnemy(undefined);
        setNewStatModifiers(undefined);
        dispatch(showSnackbar({ message: "Page created.", severity: "success" }));
      } catch (err) {
        dispatch(showSnackbar({ message: "Failed to create page.", severity: "error" }));
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
            choices: newPageChoices,
            enemy: newEnemy,
            statModifiers: newStatModifiers,
            itemsGranted: newPageItemsGranted,
            itemsRemoved: newPageItemsRemoved,
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
      setNewPageParagraphs([""]);
      setNewPageChoices([]);
      setShowEnemy(false)
      setShowModifiers(false);
      setNewEnemy(undefined);
      setNewStatModifiers(undefined);
      setNewPageItemsGranted([]);
      setNewPageItemsRemoved([]);
      setEditingPageNumber(null);
      setDialogMode("add");
    }
  };

  const handleConnect: OnConnect = useCallback((params: Connection) => {
    setPendingConnection(params);
    setChoiceText("");
    setRequiresLuckCheck(false);
    setChoiceRequiredItems([]);
    setIsModalOpen(true);
  }, []);

  const copyChoice = (choice: ChoiceData) => {
    return {
      id: choice.id,
      text: choice.text,
      targetPage: choice.targetPage,
      requiresLuckCheck: choice.requiresLuckCheck,
      requiredItems: choice.requiredItems ? [...choice.requiredItems] : [],
    }
  }

  const handleEditPage = async () => {
    if (menuTargetPage) {
      setDialogMode("edit");
      setEditingPageNumber(menuTargetPage.pageNumber);
      setNewPageTitle(menuTargetPage.title);
      setNewPageParagraphs([...menuTargetPage.paragraphs]);
      setNewPageChoices(menuTargetPage.choices.map(choice => copyChoice(choice)));
      setIsAddPageDialogOpen(true);
      setNewEnemy(menuTargetPage.enemy);
      setNewStatModifiers(menuTargetPage.statModifiers);
      setNewPageItemsGranted(menuTargetPage.itemsGranted ?? []);
      setNewPageItemsRemoved(menuTargetPage.itemsRemoved ?? []);
      setShowEnemy(!!menuTargetPage.enemy?.enemyName);
      setShowModifiers(
        !!menuTargetPage.statModifiers &&
        (menuTargetPage.statModifiers.skill !== 0 ||
        menuTargetPage.statModifiers.stamina !== 0 ||
        menuTargetPage.statModifiers.luck !== 0)
      );
    }
    handleMenuClose();
  }

  const handleDeletePage = async () => {
    showConfirm({title: "Delete page", message: "Delete this page permanently?"}, async () => {
      if (!menuTargetPage || !menuTargetPage.id) return;

      const pageIdToDelete = menuTargetPage.pageNumber.toString();
    
      try {
        await deletePage(menuTargetPage.id);
        setNodes((prevNodes) => prevNodes.filter((node) => node.id !== pageIdToDelete));

        setEdges((prevEdges) =>
          prevEdges.filter(
            (edge) => edge.source !== pageIdToDelete && edge.target !== pageIdToDelete
          )
        );
        dispatch(showSnackbar({ message: "Page deleted.", severity: "success" }));
      } catch (error: any) {
        const errorMsg = error?.response?.data?.message || "Failed to delete page.";
        dispatch(showSnackbar({ message: errorMsg, severity: "error" }));
      }

      handleMenuClose();
    });
  }

  const handleSetAsStartPage = async () => {
    if (!menuTargetPage) return;
    try {
      await updateStartPageNumber(storyId, menuTargetPage.pageNumber);
      setRootPageNumber(menuTargetPage.pageNumber);
      dispatch(showSnackbar({ message: "Start page updated.", severity: "success" }));
    } catch (err) {
      dispatch(showSnackbar({ message: "Failed to set start page.", severity: "error" }));
    }

    handleMenuClose();
  };

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
              requiresLuckCheck: requiresLuckCheck,
              requiredItems: choiceRequiredItems,
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

  const openCreateItemDialog = () => {
    setItemForm({
      id: null,
      name: "",
      description: "",
      icon: "",
      statModifiers: {
        skill: 0,
        stamina: 0,
        luck: 0,
      },
    });
    setShowItemModifiers(false);
    setItemDialogMode("add");
    setIsItemDialogOpen(true);
  };

  const openEditItemDialog = (item: StoryItem) => {
    setItemForm({
      id: item.id,
      name: item.name,
      description: item.description,
      icon: item.icon,
      statModifiers: item.statModifiers ? {
        skill: item.statModifiers?.skill ?? 0,
        stamina: item.statModifiers?.stamina ?? 0,
        luck: item.statModifiers?.luck ?? 0,
      } : undefined,
    });
      setShowModifiers(
        !!item.statModifiers &&
        (item.statModifiers.skill !== 0 ||
          item.statModifiers.stamina !== 0 ||
          item.statModifiers.luck !== 0)
      );
    setItemDialogMode("edit");
    setIsItemDialogOpen(true);
  };

  const handleSaveItem = async () => {
    const itemToSave = {
      ...itemForm,
      statModifiers: showItemModifiers ? {
        skill: Number(itemForm.statModifiers?.skill ?? 0),
        stamina: Number(itemForm.statModifiers?.stamina ?? 0),
        luck: Number(itemForm.statModifiers?.luck ?? 0),
      } : undefined,
    };

    try {
      if (itemDialogMode === "add") {
        const createdItem = await createStoryItem(storyId, itemToSave);
        setStoryItems((prev) => [...prev, createdItem]);
      } else {
        if (itemForm.id === null) {
          throw new Error("Id of updated item can not be null.");
        }
        const updatedItem = await updateStoryItem(storyId, itemForm.id, itemToSave);
        setStoryItems((prev) =>
          prev.map((item) => (item.id === updatedItem.id ? updatedItem : item))
        );
      }
    } catch (error) {
      dispatch(showSnackbar({ message: "Failed to create or update item.", severity: "error" }));
    } finally {
      setIsItemDialogOpen(false);
    }
  };

  const openItemsListDialog = async (mode: "grant" | "remove" | "required" | null, choiceIndex: number | null = null) => {
    try {
      const fetchedItems = await fetchStoryItems(storyId);
      setStoryItems(fetchedItems);
      setItemListDialogMode(mode);
      setItemListDialogChoiceIndex(choiceIndex);
      setIsItemListDialogOpen(true);
    } catch (error) {
      dispatch(showSnackbar({ message: "Failed to fetch items for story.", severity: "error" }));
    }
  }

  const handleDeleteItem = async (itemId: string | number | null) => {
    try {
      if (itemId === null) {
        throw Error("Cannot delete item with no id");
      }
      await deleteStoryItem(storyId, itemId);
      setStoryItems((prev) => prev.filter((item) => item.id !== itemId));
    } catch (error) {
      dispatch(showSnackbar({ message: "Failed to delete item", severity: "error" }));
    }
  }

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
        <Typography variant="h4">story: {storyTitle}</Typography>
        <Button variant="outlined" onClick={() => navigate(`/story/${storyId}`)}>View Story</Button>
        <Box sx={{flexGrow: 1}}></Box>
        <Button variant="contained" onClick={handleAddPage}>
          Add Page
        </Button>
        <Button variant = "contained" onClick={openCreateItemDialog}>
          Add Item
        </Button>
        <Button variant="outlined" onClick={() => openItemsListDialog(null)}>
          View Items
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
        <DialogTitle>New Choice</DialogTitle>
        <DialogContent sx={{pb: 0}}>
          <TextField
            fullWidth
            multiline
            label="Choice Text"
            sx={{ mt: 1 }}
            value={choiceText}
            onChange={(e) => setChoiceText(e.target.value)}
          />
          <FormControlLabel
            sx={{float: "right"}}
            control={
              <Checkbox
                checked={requiresLuckCheck}
                onChange={(e) => setRequiresLuckCheck(e.target.checked)}
              />
            }
            label="Test luck"
          />
          <Typography variant="h6" sx={{ mt: 3 }}>Required Items</Typography>
            <Grid container spacing={1}>
              {choiceRequiredItems.map(item => (
                <Grid size={{xs:12, sm:6}} key={item.id}>
                  <Card sx={{ display: 'flex', alignItems: 'center', p: 1 }}>
                    <Avatar 
                      variant="rounded" 
                      sx={(theme) => ({bgcolor: theme.palette.mode === 'light' ? gray[100] : gray[600]})}
                    >
                      {item.icon}
                    </Avatar>
                    <Typography variant="body1" sx={{ flexGrow: 1 }}>{item.name}</Typography>
                    <IconButton
                      size="small"
                      onClick={() => {
                        const updated = choiceRequiredItems.filter(i => i.id !== item.id);
                        setChoiceRequiredItems(updated);
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Card>
                </Grid>
              ))}
            </Grid>
            <Button
              variant="outlined"
              sx={{ mt: 1 }}
              onClick={() => openItemsListDialog("required", null)}
            >
              Add Required Item
            </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleConfirmChoice}>Add Choice</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={isAddPageDialogOpen} onClose={() => setIsAddPageDialogOpen(false)} fullWidth maxWidth="md">
        <DialogTitle>{dialogMode === "add" ? "New Page" : "Edit Page"}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            autoFocus
            label="Page Title"
            value={newPageTitle}
            onChange={(e) => setNewPageTitle(e.target.value)}
            sx={{ mb: 1, mt: 1 }}
          />
          <Typography variant="h6" sx={{mt: 2, mb: 1}}>Paragrahs</Typography>
          {newPageParagraphs.map((p, idx) => (
            <Stack key={idx} direction="row" spacing={1} alignItems="flex-start" sx={{ mb: 1 }}>
              <TextField
                key={idx}
                fullWidth
                multiline
                minRows={4}
                placeholder={`Paragraph ${idx + 1}`}
                value={p}
                onChange={(e) => {
                  const updated = [...newPageParagraphs];
                  updated[idx] = e.target.value;
                  setNewPageParagraphs(updated);
                }}
              />
              <IconButton size="small"
                aria-label="delete paragraph"
                title="delete paragraph"
                onClick={() => {
                  const updated = [...newPageParagraphs];
                  updated.splice(idx, 1);
                  setNewPageParagraphs(updated);
                }}
              >
                <DeleteIcon />
              </IconButton>
            </Stack>
          ))}
          <Button variant="outlined" onClick={() => setNewPageParagraphs([...newPageParagraphs, ''])}>
            Add Paragraph
          </Button>
          <Typography variant="h6" sx={{mt: 2, mb: 1}}>Choices</Typography>
          {newPageChoices.map((choice, idx) => (
            <Stack direction="column" key={idx} sx={{ mb: 2 }}>
            <Stack direction="row" spacing={1} alignItems="flex-start" key={idx} sx={{ mb: 1 }}>
              <TextField
                fullWidth
                label="Choice Text"
                multiline
                value={choice.text}
                onChange={(e) => {
                  const updated = [...newPageChoices];
                  updated[idx].text = e.target.value;
                  setNewPageChoices(updated);
                }}
              />
              <TextField
                label="Target Page"
                value={choice.targetPage}
                type="number"
                onChange={(e) => {
                  const updated = [...newPageChoices];
                  updated[idx].targetPage = e.target.value;
                  setNewPageChoices(updated);
                }}
                sx={{ width: 150 }}
              />
              <FormControlLabel
                sx={{width: 200}}
                control={
                  <Checkbox
                    checked={choice.requiresLuckCheck || false}
                    onChange={(e) => {
                      const updated = [...newPageChoices];
                      updated[idx].requiresLuckCheck = e.target.checked;
                      setNewPageChoices(updated);
                    }}
                  />
                }
                label="Test luck"
              />
              <IconButton size="small"
                aria-label="delete choice"
                title="delete choice"
                onClick={() => {
                  const updated = [...newPageChoices];
                  updated.splice(idx, 1);
                  setNewPageChoices(updated);
                }}
              >
                <DeleteIcon />
              </IconButton>
            </Stack>       
            <Grid container spacing={1} sx={{mb: 1}}>
              {choice.requiredItems?.map((item) => (
                <Grid key={item.id} size={{ xs: 12, sm: 6, md: 4 }}>
                  <Card sx={{ display: 'flex', alignItems: 'center', p: 1 }}>
                    <Avatar 
                      variant="rounded" 
                      sx={(theme) => ({bgcolor: theme.palette.mode === 'light' ? gray[100] : gray[600]})}
                    >
                      {item.icon}
                    </Avatar>
                    <Typography variant="body2" sx={{ flexGrow: 1 }}>
                      {item.name}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() => {
                        const updated = [...newPageChoices];
                        updated[idx].requiredItems = updated[idx].requiredItems.filter(
                          (i) => i.id !== item.id
                        );
                        setNewPageChoices(updated);
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Card>
                </Grid>
              ))}            
              <Button
                variant="outlined"
                sx={{width: "max-content"}}
                onClick={() => openItemsListDialog("required", idx)}
              >
                Add Required Item
              </Button>
            </Grid>
            <Divider></Divider>
          </Stack>
          ))}
          <Button variant="outlined" onClick={() => setNewPageChoices([...newPageChoices, { text: '', targetPage: 0, requiresLuckCheck: false }])}>
            Add Choice
          </Button>
          <Typography variant="h6" sx={{mt: 2, mb: 1}}>Enemy</Typography>
          {showEnemy && (
            <Stack direction="row" spacing={1} alignItems="center">
              <TextField
                label="Enemy Name"
                fullWidth
                value={newEnemy?.enemyName}
                onChange={(e) => setNewEnemy({ ...newEnemy, enemyName: e.target.value })}
              />
              <TextField
                label="Enemy Skill"
                value={newEnemy?.enemySkill}
                type="number"
                onChange={(e) => setNewEnemy({ ...newEnemy, enemySkill: e.target.value })}
                sx={{width: 200 }}
              />
              <TextField
                label="Enemy Stamina"
                value={newEnemy?.enemyStamina}
                type="number"
                onChange={(e) => setNewEnemy({ ...newEnemy, enemyStamina: e.target.value })}
                sx={{width: 200 }}
              />
              <IconButton 
                onClick={() => { setShowEnemy(false); setNewEnemy(undefined); }}
              >
                <DeleteIcon />
              </IconButton>
            </Stack>
          )}
          {!showEnemy && (
            <Button variant="outlined" onClick={() => setShowEnemy(true)}>Add Enemy</Button>
          )}       
          <Typography variant="h6" sx={{mt: 2, mb: 1}}>Stat Modifiers</Typography>
          {showModifiers && (
            <Stack direction="row" spacing={1} alignItems="center">
              <TextField
                label="Skill Modifier"
                fullWidth
                type="number"
                value={newStatModifiers?.skill}
                onChange={(e) => setNewStatModifiers({ ...newStatModifiers, skill: e.target.value })}
              />
              <TextField
                label="Stamina Modifier"
                fullWidth
                type="number"
                value={newStatModifiers?.stamina}
                onChange={(e) => setNewStatModifiers({ ...newStatModifiers, stamina: e.target.value })}
              />
              <TextField
                label="Luck Modifier"
                fullWidth
                type="number"
                value={newStatModifiers?.luck}
                onChange={(e) => setNewStatModifiers({ ...newStatModifiers, luck: e.target.value })}
              />
              <IconButton 
                onClick={() => { setShowModifiers(false); setNewStatModifiers({ skill: 0, stamina: 0, luck: 0 }); }}
              >
                <DeleteIcon />
              </IconButton>
            </Stack>
          )}
          {!showModifiers && (
            <Button variant="outlined" onClick={() => setShowModifiers(true)}>Add Stat Modifiers</Button>
          )}
          <Typography variant="h6" sx={{ mt: 2 }}>Grant Items</Typography>
          <Grid container spacing={2} sx={{ mb: 1 }}>
            {newPageItemsGranted.map(item => (
              <Grid key={item.id} size={{ xs: 12, sm: 6, md: 4 }}>
                <Card sx={{ display: 'flex', alignItems: 'center', p: 1 }}>
                  <Avatar 
                    variant="rounded" 
                    sx={(theme) => ({bgcolor: theme.palette.mode === 'light' ? gray[100] : gray[600]})}
                  >
                    {item.icon}
                  </Avatar>
                  <Typography variant="body1" sx={{ flexGrow: 1 }}>{item.name}</Typography>
                  <IconButton
                    size="small"
                    onClick={() => setNewPageItemsGranted(prev => prev.filter(i => i.id !== item.id))}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Card>
              </Grid>
            ))}
          </Grid>
          <Button variant="outlined" onClick={() => openItemsListDialog("grant")}>
            Add Granted Item
          </Button>
          <Typography variant="h6" sx={{ mt: 2 }}>Remove Items</Typography>
          <Grid container spacing={2} sx={{ mb: 1 }}>
            {newPageItemsRemoved.map(item => (
              <Grid key={item.id} size={{ xs: 12, sm: 6, md: 4 }}>
                <Card sx={{ display: 'flex', alignItems: 'center', p: 1 }}>
                  <Avatar 
                    variant="rounded" 
                    sx={(theme) => ({bgcolor: theme.palette.mode === 'light' ? gray[100] : gray[600]})}
                  >
                    {item.icon}
                  </Avatar>
                  <Typography variant="body1" sx={{ flexGrow: 1 }}>{item.name}</Typography>
                  <IconButton
                    size="small"
                    onClick={() => setNewPageItemsRemoved(prev => prev.filter(i => i.id !== item.id))}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Card>
              </Grid>
            ))}
          </Grid>
          <Button variant="outlined" onClick={() => openItemsListDialog("remove")}>
            Add Removed Item
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsAddPageDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleConfirmAddPage}>
            {dialogMode === "add" ? "Add Page" : "Save Changes"}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={isItemDialogOpen} onClose={() => setIsItemDialogOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>{itemDialogMode === "add" ? "New Item" : "Edit Item"}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Item Name"
            value={itemForm.name}
            onChange={(e) => setItemForm({ ...itemForm, name: e.target.value })}
            sx={{ mb: 2, mt: 1 }}
          />
          <TextField
            fullWidth
            multiline
            minRows={2}
            label="Description"
            value={itemForm.description}
            onChange={(e) => setItemForm({ ...itemForm, description: e.target.value })}
            sx={{ mb: 2 }}
          />
          <Typography variant="subtitle1" sx={{ mb: 1 }}>Choose Icon</Typography>
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 1,
              mb: 2,
              maxHeight: 250,
              overflowY: 'auto',
              border: '1px solid #ccc',
              borderRadius: 1,
              p: 1,
            }}
          >
            {emojiOptions.map((emoji, idx) => (
              <Button
                key={idx}
                variant={itemForm.icon === emoji ? "contained" : "outlined"}
                onClick={() => setItemForm({ ...itemForm, icon: emoji })}
                sx={{
                  minWidth: 40,
                  width: 40,
                  height: 40,
                  p: 0,
                  fontSize: 24,
                }}
              >
                {emoji}
              </Button>
            ))}
          </Box>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>Stat Modifiers</Typography>

          {showItemModifiers && (
            <Stack spacing={2} direction="row" sx={{ mb: 2 }}>
              <TextField
                label="Skill"
                type="number"
                value={itemForm.statModifiers?.skill ?? 0}
                onChange={(e) => setItemForm({ ...itemForm, statModifiers: { ...itemForm.statModifiers, skill: e.target.value } })}
              />
              <TextField
                label="Stamina"
                type="number"
                value={itemForm.statModifiers?.stamina ?? 0}
                onChange={(e) => setItemForm({ ...itemForm, statModifiers: { ...itemForm.statModifiers, stamina: e.target.value } })}
              />
              <TextField
                label="Luck"
                type="number"
                value={itemForm.statModifiers?.luck ?? 0}
                onChange={(e) => setItemForm({ ...itemForm, statModifiers: { ...itemForm.statModifiers, luck: e.target.value } })}
              />
              <IconButton
                onClick={() => {
                  setShowItemModifiers(false);
                  setItemForm({ ...itemForm, statModifiers: undefined});
                }}
                sx={{height: "100%"}}
              >
                <DeleteIcon />
              </IconButton>
            </Stack>
          )}
          {!showItemModifiers && (
            <Button variant="outlined" onClick={() => setShowItemModifiers(true)}>Add Stat Modifiers</Button>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsItemDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveItem}>
            {itemDialogMode === "add" ? "Create" : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={isItemListDialogOpen}
        onClose={() => {
          setIsItemListDialogOpen(false);
          setItemListDialogMode(null);
        }}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>All Items</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {storyItems.map((item) => {
              const isAlreadySelected = (() => {
                if (itemListDialogMode === "grant") {
                  return newPageItemsGranted.some(i => i.id === item.id);
                } else if (itemListDialogMode === "remove") {
                  return newPageItemsRemoved.some(i => i.id === item.id);
                } else if (itemListDialogMode === "required") {
                  if (itemListDialogChoiceIndex !== null) {
                    return newPageChoices[itemListDialogChoiceIndex]?.requiredItems?.some(i => i.id === item.id);
                  } else {
                    return choiceRequiredItems.some(i => i.id === item.id);
                  }
                }
                return false;
              })();

              return (
                <Grid size={{xs:12, sm:6, md:4}} key={item.id}>
                  <Card 
                    sx={{ 
                      height: '100%', 
                      display: 'flex', 
                      flexDirection: 'column',
                      border: isAlreadySelected ? '2px solid' : '1px solid',
                      borderColor: isAlreadySelected ? 'success.main' : 'divider',
                    }}
                  >
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1 }}>
                        <Avatar 
                          variant="rounded" 
                          sx={(theme) => ({bgcolor: theme.palette.mode === 'light' ? gray[100] : gray[600]})}
                        >
                          {item.icon}
                        </Avatar>
                        <Typography variant="h6">{item.name}</Typography>
                      </Stack>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        {item.description}
                      </Typography>
                      {item.statModifiers && 
                        <Typography variant="caption">
                          {!!item.statModifiers.skill && <span><strong>Skill:</strong> {getStatFormatting(item.statModifiers.skill)} &nbsp;</span>}
                          {!!item.statModifiers.skill && <span><strong>Stam:</strong> {getStatFormatting(item.statModifiers.stamina)} &nbsp;</span>}
                          {!!item.statModifiers.skill && <span><strong>Luck:</strong> {getStatFormatting(item.statModifiers.luck)}</span>}
                        </Typography>
                      }
                    </CardContent>
                    <CardActions>
                      {itemListDialogMode === null && (<>
                        <Button size="small" onClick={() => openEditItemDialog(item)}>Edit</Button>
                        <Button size="small" color="error" sx={{marginLeft: "auto!important"}} onClick={() => handleDeleteItem(item.id)}>Delete</Button>
                      </>)}

                      {itemListDialogMode !== null &&
                        (isAlreadySelected ? (
                          <Button
                            color="error"
                            variant="outlined"
                            onClick={() => {
                              if (itemListDialogMode === "grant") {
                                setNewPageItemsGranted(prev => prev.filter(i => i.id !== item.id));
                              } else if (itemListDialogMode === "remove") {
                                setNewPageItemsRemoved(prev => prev.filter(i => i.id !== item.id));
                              } else if (itemListDialogMode === "required") {
                                if (itemListDialogChoiceIndex !== null) {
                                  const updated = [...newPageChoices];
                                  updated[itemListDialogChoiceIndex].requiredItems = updated[itemListDialogChoiceIndex].requiredItems?.filter(i => i.id !== item.id);
                                  setNewPageChoices(updated);
                                } else {
                                  setChoiceRequiredItems(pver => pver.filter(i => i.id !== item.id));
                                }
                              }
                            }}
                          >
                            Clear from list
                          </Button>
                        ) : (
                          <Button
                            variant="contained"
                            onClick={() => {
                              if (itemListDialogMode === "grant") {
                                setNewPageItemsGranted(prev => [...prev, item]);
                              } else if (itemListDialogMode === "remove") {
                                setNewPageItemsRemoved(prev => [...prev, item]);
                              } else if (itemListDialogMode === "required") {
                                if (itemListDialogChoiceIndex !== null) {
                                  const updated = [...newPageChoices];
                                  updated[itemListDialogChoiceIndex].requiredItems = [...(updated[itemListDialogChoiceIndex].requiredItems || []), item];
                                  setNewPageChoices(updated);
                                } else {
                                  setChoiceRequiredItems(prev => [...prev, item]);
                                }
                              }
                            }}
                          >
                            {itemListDialogMode === "grant"
                              ? "Add to granted items"
                              : itemListDialogMode === "remove"
                              ? "Add to removed items"
                              : "Add to required items"}
                          </Button>
                        ))
                      }
                    </CardActions>
                  </Card>
                </Grid>
              )}
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsItemListDialogOpen(false)}>Close</Button>
          {itemListDialogMode === null && <Button variant="contained" onClick={openCreateItemDialog}>Create Item</Button>}
        </DialogActions>
      </Dialog>
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleEditPage}>Edit</MenuItem>
        <MenuItem onClick={handleDeletePage}>Delete</MenuItem>
        {menuTargetPage && menuTargetPage.pageNumber !== rootPageNumber && (
          <MenuItem onClick={handleSetAsStartPage}>Set as Start</MenuItem>
        )}
      </Menu>
    </Box>
  );
}

export default PageGraph;