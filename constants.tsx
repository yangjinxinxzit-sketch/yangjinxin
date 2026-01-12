
import { Piece, PieceColor, PieceType } from './types';

export const BOARD_ROWS = 10;
export const BOARD_COLS = 9;

const createPiece = (type: PieceType, color: PieceColor, row: number, col: number): Piece => ({
  id: `${color}-${type}-${row}-${col}`,
  type,
  color,
  position: [row, col],
});

export const getInitialBoard = (): (Piece | null)[][] => {
  const board: (Piece | null)[][] = Array(BOARD_ROWS).fill(null).map(() => Array(BOARD_COLS).fill(null));

  // Black Pieces (Top)
  board[0][0] = createPiece(PieceType.ROOK, 'BLACK', 0, 0);
  board[0][8] = createPiece(PieceType.ROOK, 'BLACK', 0, 8);
  board[0][1] = createPiece(PieceType.KNIGHT, 'BLACK', 0, 1);
  board[0][7] = createPiece(PieceType.KNIGHT, 'BLACK', 0, 7);
  board[0][2] = createPiece(PieceType.BISHOP, 'BLACK', 0, 2);
  board[0][6] = createPiece(PieceType.BISHOP, 'BLACK', 0, 6);
  board[0][3] = createPiece(PieceType.ADVISOR, 'BLACK', 0, 3);
  board[0][5] = createPiece(PieceType.ADVISOR, 'BLACK', 0, 5);
  board[0][4] = createPiece(PieceType.KING, 'BLACK', 0, 4);
  board[2][1] = createPiece(PieceType.CANNON, 'BLACK', 2, 1);
  board[2][7] = createPiece(PieceType.CANNON, 'BLACK', 2, 7);
  [0, 2, 4, 6, 8].forEach(col => {
    board[3][col] = createPiece(PieceType.PAWN, 'BLACK', 3, col);
  });

  // Red Pieces (Bottom)
  board[9][0] = createPiece(PieceType.ROOK, 'RED', 9, 0);
  board[9][8] = createPiece(PieceType.ROOK, 'RED', 9, 8);
  board[9][1] = createPiece(PieceType.KNIGHT, 'RED', 9, 1);
  board[9][7] = createPiece(PieceType.KNIGHT, 'RED', 9, 7);
  board[9][2] = createPiece(PieceType.BISHOP, 'RED', 9, 2);
  board[9][6] = createPiece(PieceType.BISHOP, 'RED', 9, 6);
  board[9][3] = createPiece(PieceType.ADVISOR, 'RED', 9, 3);
  board[9][5] = createPiece(PieceType.ADVISOR, 'RED', 9, 5);
  board[9][4] = createPiece(PieceType.KING, 'RED', 9, 4);
  board[7][1] = createPiece(PieceType.CANNON, 'RED', 7, 1);
  board[7][7] = createPiece(PieceType.CANNON, 'RED', 7, 7);
  [0, 2, 4, 6, 8].forEach(col => {
    board[6][col] = createPiece(PieceType.PAWN, 'RED', 6, col);
  });

  return board;
};
