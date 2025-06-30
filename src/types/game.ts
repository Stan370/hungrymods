export interface GameObject {
  id: string;
  x: number;
  y: number;
  type: 'good-comment' | 'bad-comment' | 'repost' | 'gold-award' | 'mod-warning' | 'cake-day' | 'rickroll' | 'helpful-comment' | 'spam-bot';
  speed: number;
  points: number;
  username: string;
  text?: string;
}

export interface GameState {
  score: number;
  combo: number;
  timeLeft: number;
  gameObjects: GameObject[];
  powerUps: {
    modProtection: boolean;
    cakeDay: number;
  };
  gameStatus: 'waiting' | 'playing' | 'ended';
  highScore: number;
  postKarma: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  unlocked: boolean;
  icon: string;
}