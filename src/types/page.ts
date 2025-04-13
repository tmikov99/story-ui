export interface ChoiceData {
    text: string;
    targetPage: number;
}

export interface PageData {
    id: number;
    pageNumber: number;
    paragraphs: string[];
    choices: ChoiceData[];
    endPage: boolean;
}