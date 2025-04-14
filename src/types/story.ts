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
    startPage: number;
    status: string;
    createdAt: string;
    updatedAt: string;
}

export interface StoryFormData {
    title: string;
    genres: string[];
    tags: string[];
    description: string;
  }