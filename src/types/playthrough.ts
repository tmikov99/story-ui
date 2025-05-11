export interface PlaythroughData {
    id: number;
    storyId: number;
    currentPage: number;
    path: number[];        
    lastVisited: string;
    startedAt: string;
    completed?: boolean;
    active?: boolean;
}