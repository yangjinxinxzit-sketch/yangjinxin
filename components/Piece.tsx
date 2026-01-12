
import React from 'react';
import { Piece as PieceType, PieceColor, PieceType as PType } from '../types';

interface PieceProps {
  piece: PieceType;
  isSelected: boolean;
  isValidMove: boolean;
  onClick: () => void;
}

const Piece: React.FC<PieceProps> = ({ piece, isSelected, isValidMove, onClick }) => {
  const isRed = piece.color === 'RED';
  
  // 映射内部类型到传统的棋子标签
  const getDisplayLabel = (type: PType, color: PieceColor) => {
    if (color === 'RED') {
      switch (type) {
        case PType.KING: return '帅';
        case PType.ADVISOR: return '仕';
        case PType.BISHOP: return '相';
        case PType.KNIGHT: return '傌'; // 修复：红马应为“傌”或“马”
        case PType.ROOK: return '俥';   // 红车通常用“俥”或“車”
        case PType.CANNON: return '炮';
        case PType.PAWN: return '兵';
      }
    } else {
      switch (type) {
        case PType.KING: return '将';
        case PType.ADVISOR: return '士';
        case PType.BISHOP: return '象';
        case PType.KNIGHT: return '马';
        case PType.ROOK: return '车';
        case PType.CANNON: return '砲'; // 黑炮通常用“砲”
        case PType.PAWN: return '卒';
      }
    }
    return piece.type;
  };

  return (
    <div
      onClick={onClick}
      className={`
        relative w-10 h-10 sm:w-14 sm:h-14 rounded-full flex items-center justify-center cursor-pointer
        transition-all duration-200 transform hover:scale-105 z-10
        ${isSelected ? 'ring-4 ring-yellow-400 scale-110' : ''}
        ${isValidMove ? 'ring-2 ring-blue-400' : ''}
        shadow-lg bg-stone-50 border-2
        ${isRed ? 'border-red-600' : 'border-stone-800'}
      `}
    >
      <div className={`
        w-[88%] h-[88%] rounded-full border flex items-center justify-center font-chinese text-2xl sm:text-3xl font-bold
        ${isRed ? 'text-red-600 border-red-200' : 'text-stone-800 border-stone-300'}
      `}>
        {getDisplayLabel(piece.type, piece.color)}
      </div>
      
      {/* 木质纹理效果 */}
      <div className="absolute inset-0 rounded-full opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')]"></div>
    </div>
  );
};

export default Piece;
