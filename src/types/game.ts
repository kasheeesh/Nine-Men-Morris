export interface Position {
  x: number;
  y: number;
}

export interface GameObject extends Position {
  width: number;
  height: number;
}

export interface Spaceship extends GameObject {
  health: number;
  lives: number;
  powerups: {
    shield: boolean;
    multishot: boolean;
  };
}

export interface Bullet extends GameObject {
  active: boolean;
}

export interface Meteorite extends GameObject {
  active: boolean;
  speed: number;
}

export interface PowerUp extends GameObject {
  type: 'shield' | 'bolt';
  active: boolean;
}