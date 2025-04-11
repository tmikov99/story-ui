export interface UserData {
    username: string;
}

export interface StoryData {
    id: number;
    title: string;
    user: UserData;
    genres: string[];        
    tags: string[];
    description: string;
    pageCount: number;
    status: string;
    createdAt: string;
    updatedAt: string;
}