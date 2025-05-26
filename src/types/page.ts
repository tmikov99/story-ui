export interface ChoiceData {
    id?: number;
    text: string;
    targetPage: number;
    requiresLuckCheck: boolean;
}

export interface PageData {
    id?: number;
    storyId: number;
    title: string;
    pageNumber: number;
    paragraphs: string[];
    choices: ChoiceData[];
    endPage: boolean;
    luckRequired: boolean;
}

export interface PageDataNode extends PageData {
    positionX: number;
    positionY: number;
}