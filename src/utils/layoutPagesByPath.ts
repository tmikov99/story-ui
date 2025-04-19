import { PageData } from "../types/page";

type PositionedNode = {
    id: string;
    type: string;
    position: { x: number; y: number };
    data: { page: PageData };
  };
  
  type Edge = {
    id: string;
    source: string;
    target: string;
  };
  
  export function layoutPagesByPath(
    pages: PageData[],
    rootPageNumber: number,
    nodeWidth = 300,
    nodeHeight = 180,
    horizontalSpacing = 50,
    verticalSpacing = 100
  ): { nodes: PositionedNode[]; edges: Edge[] } {
    const pageMap = new Map<number, PageData>();
    pages.forEach((p) => pageMap.set(p.pageNumber, p));
  
    const visited = new Set<number>();
    const positionsByLevel: Map<number, PageData[]> = new Map();
  
    const queue: Array<{ page: PageData; level: number }> = [];
    const edges: Edge[] = [];
  
    const rootPage = pageMap.get(rootPageNumber);
    if (!rootPage) throw new Error("Root page not found");
  
    queue.push({ page: rootPage, level: 0 });
  
    while (queue.length > 0) {
      const { page, level } = queue.shift()!;
      if (visited.has(page.pageNumber)) continue;
  
      visited.add(page.pageNumber);
  
      if (!positionsByLevel.has(level)) {
        positionsByLevel.set(level, []);
      }
      positionsByLevel.get(level)!.push(page);
  
      for (const choice of page.choices) {
        const target = pageMap.get(choice.targetPage);
        if (target && !visited.has(target.pageNumber)) {
          queue.push({ page: target, level: level + 1 });
  
          edges.push({
            id: `${page.pageNumber}-${target.pageNumber}`,
            source: page.pageNumber.toString(),
            target: target.pageNumber.toString(),
          });
        }
      }
    }
  
    const nodes: PositionedNode[] = [];
  
    for (const [level, levelPages] of positionsByLevel.entries()) {
      levelPages.forEach((page, index) => {
        nodes.push({
          id: page.pageNumber.toString(),
          type: 'pageNode',
          position: {
            x: index * (nodeWidth + horizontalSpacing),
            y: level * (nodeHeight + verticalSpacing),
          },
          data: { page },
        });
      });
    }
  
    return { nodes, edges };
  }