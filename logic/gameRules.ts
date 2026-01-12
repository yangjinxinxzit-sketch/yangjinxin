

import { Piece, PieceType, PieceColor } from '../types';
import { BOARD_ROWS, BOARD_COLS } from '../constants';

export const isValidMove = (
  board: (Piece | null)[][],
  from: [number, number],
  to: [number, number]
): boolean => {
  const [r1, c1] = from;
  const [r2, c2] = to;
  const piece = board[r1][c1];
  const target = board[r2][c2];

  if (!piece) return false;
  if (target && target.color === piece.color) return false;

  const dr = r2 - r1;
  const dc = c2 - c1;
  const absDr = Math.abs(dr);
  const absDc = Math.abs(dc);

  switch (piece.type) {
    case PieceType.KING:
      // King moves 1 step inside palace
      if (absDr + absDc !== 1) return false;
      if (c2 < 3 || c2 > 5) return false;
      if (piece.color === 'BLACK' && r2 > 2) return false;
      if (piece.color === 'RED' && r2 < 7) return false;
      break;

    case PieceType.ADVISOR:
      // Advisor moves 1 step diagonally inside palace
      if (absDr !== 1 || absDc !== 1) return false;
      if (c2 < 3 || c2 > 5) return false;
      if (piece.color === 'BLACK' && r2 > 2) return false;
      if (piece.color === 'RED' && r2 < 7) return false;
      break;

    case PieceType.BISHOP:
      // Bishop moves 2 steps diagonally, cannot cross river
      if (absDr !== 2 || absDc !== 2) return false;
      if (piece.color === 'BLACK' && r2 > 4) return false;
      if (piece.color === 'RED' && r2 < 5) return false;
      // Check for blocked elephant eye
      if (board[r1 + dr / 2][c1 + dc / 2]) return false;
      break;

    case PieceType.KNIGHT:
      // Knight moves in L shape, check for blocked leg
      if (!((absDr === 2 && absDc === 1) || (absDr === 1 && absDc === 2))) return false;
      if (absDr === 2) {
        if (board[r1 + dr / 2][c1]) return false;
      } else {
        if (board[r1][c1 + dc / 2]) return false;
      }
      break;

    case PieceType.ROOK:
      // Rook moves straight lines
      if (r1 !== r2 && c1 !== c2) return false;
      if (r1 === r2) {
        const step = dc > 0 ? 1 : -1;
        for (let c = c1 + step; c !== c2; c += step) {
          if (board[r1][c]) return false;
        }
      } else {
        const step = dr > 0 ? 1 : -1;
        for (let r = r1 + step; r !== r2; r += step) {
          if (board[r][c1]) return false;
        }
      }
      break;

    case PieceType.CANNON:
      // Cannon moves straight, captures by jumping
      if (r1 !== r2 && c1 !== c2) return false;
      let count = 0;
      if (r1 === r2) {
        const step = dc > 0 ? 1 : -1;
        for (let c = c1 + step; c !== c2; c += step) {
          if (board[r1][c]) count++;
        }
      } else {
        const step = dr > 0 ? 1 : -1;
        for (let r = r1 + step; r !== r2; r += step) {
          if (board[r][c1]) count++;
        }
      }
      if (!target) return count === 0;
      return count === 1;

    case PieceType.PAWN:
      // Pawn moves 1 step forward, can move sideways after crossing river
      const isCrossed = piece.color === 'BLACK' ? r1 > 4 : r1 < 5;
      const forward = piece.color === 'BLACK' ? 1 : -1;
      if (dr === forward && dc === 0) return true;
      if (isCrossed && dr === 0 && absDc === 1) return true;
      return false;
  }

  // Flying General Rule: Kings cannot face each other without a piece in between
  if (piece.type === PieceType.KING || (target && target.type === PieceType.KING)) {
    // This is a complex check usually done after move execution, 
    // but for simplicity we'll check it in the general validity if moving king or capturing king
  }

  return true;
};

export const getValidMoves = (board: (Piece | null)[][], pos: [number, number]): [number, number][] => {
  const moves: [number, number][] = [];
  for (let r = 0; r < BOARD_ROWS; r++) {
    for (let c = 0; c < BOARD_COLS; c++) {
      if (isValidMove(board, pos, [r, c])) {
        moves.push([r, c]);
      }
    }
  }
  return moves;
};

export const isKingInCheck = (board: (Piece | null)[][], color: PieceColor): boolean => {
  let kingPos: [number, number] | null = null;
  for (let r = 0; r < BOARD_ROWS; r++) {
    for (let c = 0; c < BOARD_COLS; c++) {
      const p = board[r][c];
      if (p && p.type === PieceType.KING && p.color === color) {
        kingPos = [r, c];
        break;
      }
    }
  }

  if (!kingPos) return false;

  const opponentColor = color === 'RED' ? 'BLACK' : 'RED';
  for (let r = 0; r < BOARD_ROWS; r++) {
    for (let c = 0; c < BOARD_COLS; c++) {
      const p = board[r][c];
      if (p && p.color === opponentColor) {
        if (isValidMove(board, [r, c], kingPos)) return true;
      }
    }
  }

  // Flying General rule check
  let otherKingPos: [number, number] | null = null;
  const otherColor = color === 'RED' ? 'BLACK' : 'RED';
  for (let r = 0; r < BOARD_ROWS; r++) {
    for (let c = 0; c < BOARD_COLS; c++) {
      const p = board[r][c];
      if (p && p.type === PieceType.KING && p.color === otherColor) {
        otherKingPos = [r, c];
        break;
      }
    }
  }
  if (kingPos && otherKingPos && kingPos[1] === otherKingPos[1]) {
    let piecesBetween = 0;
    const start = Math.min(kingPos[0], otherKingPos[0]);
    const end = Math.max(kingPos[0], otherKingPos[0]);
    for (let r = start + 1; r < end; r++) {
      if (board[r][kingPos[1]]) piecesBetween++;
    }
    if (piecesBetween === 0) return true;
  }

  return false;
};
