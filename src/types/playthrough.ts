import { PageData, StoryItem } from "./page";

export interface Stats {
    skill: number;
    stamina: number;
    luck: number;
    initialSkill: number;
    initialStamina: number;
    initialLuck: number;
}

export interface Battle {
    id: number,
    enemyName: string,
    enemySkill: number,
    enemyStamina: number,
    playerSkill: number,
    playerStamina: number,
    playerLuck: number,
    lastPlayerRoll: number,
    lastEnemyRoll: number,
    pendingDamageTarget: string,
    pendingDamageAmount: number,
    roundFinalized: boolean,
    battleLog: string,
    lastRoundLuckUsed: boolean,
    completed: boolean,
    playerWon: boolean
}

export interface PlaythroughData {
    id: number;
    storyId: number;
    currentPage: number;
    path: number[];        
    lastVisited: string;
    startedAt: string;
    completed?: boolean;
    active?: boolean;
    page: PageData;
    stats: Stats;
    inventory: StoryItem[];
    luckRequired: boolean;
    luckPassed: boolean;
    battlePending: boolean;
    battle?: Battle; 
}
