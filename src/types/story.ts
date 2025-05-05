export interface UserData {
    username: string;
    imageUrl?: string;
}

export interface PaginatedResponse<T> {
    content: T[];
    totalPages: number;
    totalElements: number;
    number: number;
    size: number;
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
    reads?: number;
    coverImageUrl?: string;
}

export interface StoryFormData {
    title: string;
    genres: string[];
    tags: string[];
    description: string;
    status: string;
    coverImageUrl?: string;
  }

export interface StoryCommentData {
    id: number;
    username: string;
    imageUrl?: string;
    text: string;
    createdAt: string;
    story?: StoryData;
}

export interface LikesResponse {
    result: boolean;
    likes: number;
}