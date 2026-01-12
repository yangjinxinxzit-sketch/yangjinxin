

import React from 'react';
import { Piece as PieceType } from '../types';
import { BOARD_ROWS, BOARD_COLS } from '../constants';
import Piece from './Piece';

interface BoardProps {
  board: (PieceType | null)[][];
  selectedPos: [number, number] | null;
  validMoves: [number, number][];
  onSquareClick: (row: number, col: number) => void;
}

const Board: React.FC<BoardProps> = ({ board, selectedPos, validMoves, onSquareClick }) => {
  const isSelected = (r: number, c: number) => selectedPos?.[0] === r && selectedPos?.[1] === c;
  const isValidTarget = (r: number, c: number) => validMoves.some(m => m[0] === r && m[1] === c);

  return (
    <div className="relative bg-[#f3d9a9] p-2 sm:p-4 rounded shadow-2xl border-8 border-[#8b4513] select-none mx-auto w-fit">
      {/* Board Lines */}
      <div className="relative grid grid-cols-8 grid-rows-9 w-[320px] h-[360px] sm:w-[540px] sm:h-[600px] border border-stone-800">
        {/* River */}
        <div className="absolute top-[44.4%] left-0 right-0 h-[11.1%] bg-[#e6c17a] border-y border-stone-800 flex items-center justify-around px-8 sm:px-16 text-stone-800 font-chinese text-lg sm:text-2xl font-bold italic">
          <span>楚河</span>
          <span>汉界</span>
        </div>

        {/* Palace Crosses (Black Top) */}
        <svg className="absolute top-0 left-[37.5%] w-[25%] h-[22.2%] pointer-events-none opacity-40">
          <line x1="0" y1="0" x2="100%" y2="100%" stroke="black" strokeWidth="1" />
          <line x1="100%" y1="0" x2="0" y2="100%" stroke="black" strokeWidth="1" />
        </svg>

        {/* Palace Crosses (Red Bottom) */}
        <svg className="absolute bottom-0 left-[37.5%] w-[25%] h-[22.2%] pointer-events-none opacity-40">
          <line x1="0" y1="0" x2="100%" y2="100%" stroke="black" strokeWidth="1" />
          <line x1="100%" y1="0" x2="0" y2="100%" stroke="black" strokeWidth="1" />
        </svg>

        {/* Grid Cells for background lines */}
        {Array.from({ length: 8 * 9 }).map((_, i) => (
          <div key={i} className="border-r border-b border-stone-800/40 last:border-r-0"></div>
        ))}

        {/* Interaction Layer */}
        <div className="absolute inset-[-20px] sm:inset-[-28px] grid grid-cols-9 grid-rows-10">
          {Array.from({ length: BOARD_ROWS }).map((_, r) => (
            Array.from({ length: BOARD_COLS }).map((_, c) => {
              const piece = board[r][c];
              const valid = isValidTarget(r, c);
              return (
                <div 
                  key={`${r}-${c}`}
                  className="flex items-center justify-center relative cursor-pointer group"
                  onClick={() => onSquareClick(r, c)}
                >
                  {/* Empty Dot for valid moves */}
                  {valid && !piece && (
                    <div className="w-3 h-3 sm:w-4 sm:h-4 bg-blue-500/50 rounded-full animate-pulse"></div>
                  )}
                  {/* Piece */}
                  {piece && (
                    <Piece
                      piece={piece}
                      isSelected={isSelected(r, c)}
                      isValidMove={valid}
                      onClick={() => onSquareClick(r, c)}
                    />
                  )}
                </div>
              );
            })
          ))}
        </div>
      </div>
    </div>
  );
};

export default Board;
