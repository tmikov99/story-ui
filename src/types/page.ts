export interface ChoiceData {
    id?: number;
    text: string;
    targetPage: number;
    requiresLuckCheck: boolean;
    requiredItems?: StoryItem[];
}

export interface StatModifiers {
  skill: number;
  stamina: number;
  luck: number;
};

export interface StoryItem {
    id: number | null;
    name: string;
    description: string;
    icon: string;
    statModifiers?: StatModifiers;
}

export interface Enemy {
    enemyName: string;
    enemySkill: number;
    enemyStamina: number;
}

export interface PageData {
    id?: number;
    storyId: number;
    title: string;
    pageNumber: number;
    paragraphs: string[];
    choices: ChoiceData[];
    enemy?: Enemy;
    statModifiers?: StatModifiers;
    itemsGranted?: StoryItem[];
    itemsRemoved?: StoryItem[];
    endPage: boolean;
    luckRequired?: boolean;
}

export interface PageDataNode extends PageData {
    positionX: number;
    positionY: number;
}