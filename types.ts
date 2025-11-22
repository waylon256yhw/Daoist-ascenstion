
export type GameView = 'WELCOME' | 'CREATE_CHARACTER' | 'GAME_LOOP' | 'SAVES';

export enum AttributeGrade {
  MORTAL = '凡品',
  SPIRIT = '灵品',
  EARTH = '地品',
  HEAVEN = '天品',
  DIVINE = '神品',
}

export interface AttributeRoll {
  name: string;
  description: string;
  grade: AttributeGrade;
  bonuses?: Record<string, string>; // Descriptive bonuses instead of stats
}

export interface Character {
  id: string;
  name: string;
  
  // Immutable Identity
  appearance: string;
  gender: '男' | '女' | '无相';
  race: string;
  path: string; // Tao/Path
  
  // Rolled Attributes (Static Traits)
  rootBone: AttributeRoll; // Physique
  talent: AttributeRoll;   // Comprehension
  spiritTreasure: AttributeRoll; // Starting Item
  
  // The Variable System (Mutable State)
  // Includes: 寿元, 境界, 名望, 宗门, 状态, etc.
  variables: Record<string, string | number>;
  
  inventory: string[];
  
  // Meta
  location: string;
  currentDate: {
    year: number;
    month: number;
    day: number;
  };
}

export interface ChatMessage {
  id: string;
  sender: 'SYSTEM' | 'PLAYER' | 'NPC';
  senderName?: string;
  content: string;
  type: 'NARRATIVE' | 'DIALOGUE' | 'ACTION' | 'INFO';
  timestamp: number;
}

export interface SaveFile {
  id: string;
  character: Character;
  messages: ChatMessage[];
  timestamp: number;
  summary: string;
}
