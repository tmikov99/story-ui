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
    liked?: boolean;
    favorite?: boolean;
    likes?: number;
    favorites?: number;
}

export interface StoryFormData {
    title: string;
    genres: string[];
    tags: string[];
    description: string;
    status: string;
  }

export interface StoryCommentData {
    id: number;
    username: string;
    text: string;
    createdAt: string;
}

export interface LikesResponse {
    result: boolean;
    likes: number;
}