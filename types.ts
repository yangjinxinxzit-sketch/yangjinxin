
export type PieceColor = 'RED' | 'BLACK';

export enum PieceType {
  KING = '帅',      // 帅/将
  ADVISOR = '仕',   // 仕/士
  BISHOP = '相',    // 相/象
  KNIGHT = '马',    // 俥
  ROOK = '车',      // 傌
  CANNON = '炮',    // 炮/砲
  PAWN = '兵'       // 兵/卒
}

export interface Piece {
  id: string;
  type: PieceType;
  color: PieceColor;
  position: [number, number]; // [row, col] (0-9, 0-8)
}

export interface GameState {
  board: (Piece | null)[][];
  turn: PieceColor;
  selectedPos: [number, number] | null;
  validMoves: [number, number][];
  history: string[];
  status: 'PLAYING' | 'CHECK' | 'WIN_RED' | 'WIN_BLACK';
  mode: 'PVP' | 'PVE';
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
}

export type Move = {
  from: [number, number];
  to: [number, number];
};
