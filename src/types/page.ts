export interface ChoiceData {
    text: string;
    targetPage: number;
}

export interface PageData {
    id?: number;
    storyId: number;
    title: string;
    pageNumber: number;
    paragraphs: string[];
    choices: ChoiceData[];
    endPage: boolean;
}