
import React, { useState, useEffect, useCallback } from 'react';
import { GameState, Piece, PieceColor, PieceType } from './types';
import { getInitialBoard } from './constants';
import { isValidMove, getValidMoves, isKingInCheck } from './logic/gameRules';
import { getAIMove } from './services/geminiService';
import Board from './components/Board';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    board: getInitialBoard(),
    turn: 'RED',
    selectedPos: null,
    validMoves: [],
    history: [],
    status: 'PLAYING',
    mode: 'PVE',
    difficulty: 'MEDIUM',
  });

  const [isThinking, setIsThinking] = useState(false);

  const resetGame = () => {
    setGameState({
      board: getInitialBoard(),
      turn: 'RED',
      selectedPos: null,
      validMoves: [],
      history: [],
      status: 'PLAYING',
      mode: gameState.mode,
      difficulty: gameState.difficulty,
    });
  };

  const handleSquareClick = useCallback((r: number, c: number) => {
    if (gameState.status !== 'PLAYING' && gameState.status !== 'CHECK') return;
    if (isThinking) return;

    const { board, turn, selectedPos, validMoves } = gameState;
    const clickedPiece = board[r][c];

    // Select piece
    if (clickedPiece && clickedPiece.color === turn) {
      setGameState(prev => ({
        ...prev,
        selectedPos: [r, c],
        validMoves: getValidMoves(board, [r, c])
      }));
      return;
    }

    // Move piece
    if (selectedPos && validMoves.some(m => m[0] === r && m[1] === c)) {
      const [sr, sc] = selectedPos;
      const piece = board[sr][sc]!;
      const targetPiece = board[r][c];

      const newBoard = board.map(row => [...row]);
      newBoard[r][c] = { ...piece, position: [r, c] };
      newBoard[sr][sc] = null;

      // Check win condition (King capture)
      let newStatus: GameState['status'] = 'PLAYING';
      if (targetPiece?.type === PieceType.KING) {
        newStatus = turn === 'RED' ? 'WIN_RED' : 'WIN_BLACK';
      } else if (isKingInCheck(newBoard, turn === 'RED' ? 'BLACK' : 'RED')) {
        newStatus = 'CHECK';
      }

      setGameState(prev => ({
        ...prev,
        board: newBoard,
        turn: turn === 'RED' ? 'BLACK' : 'RED',
        selectedPos: null,
        validMoves: [],
        status: newStatus,
        history: [...prev.history, `${piece.type}: (${sr},${sc}) -> (${r},${c})`]
      }));
    } else {
      // Deselect
      setGameState(prev => ({ ...prev, selectedPos: null, validMoves: [] }));
    }
  }, [gameState, isThinking]);

  // AI Turn Logic
  useEffect(() => {
    if (gameState.mode === 'PVE' && gameState.turn === 'BLACK' && gameState.status === 'PLAYING') {
      const timer = setTimeout(async () => {
        setIsThinking(true);
        const aiMove = await getAIMove(gameState.board, 'BLACK', gameState.difficulty);
        setIsThinking(false);
        if (aiMove) {
          handleSquareClick(aiMove.from[0], aiMove.from[1]); // Select
          setTimeout(() => {
            handleSquareClick(aiMove.to[0], aiMove.to[1]); // Move
          }, 300);
        }
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [gameState.turn, gameState.mode, gameState.status, handleSquareClick]);

  return (
    <div className="min-h-screen flex flex-col items-center py-8 px-4 font-sans bg-stone-100">
      <header className="mb-8 text-center">
        <h1 className="text-5xl font-chinese text-stone-800 mb-2">禅意中国象棋</h1>
        <p className="text-stone-500 italic">Zen Xiangqi - 智慧与博弈的艺术</p>
      </header>

      <div className="flex flex-col lg:flex-row gap-8 items-start max-w-6xl w-full">
        {/* Game Stats & Info */}
        <div className="flex-1 w-full bg-white p-6 rounded-xl shadow-md border border-stone-200">
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-4 border-b pb-2">游戏状态</h2>
            <div className="flex items-center justify-between mb-4">
              <span className="text-stone-600">当前回合:</span>
              <span className={`px-4 py-1 rounded-full font-bold ${gameState.turn === 'RED' ? 'bg-red-100 text-red-700' : 'bg-stone-200 text-stone-800'}`}>
                {gameState.turn === 'RED' ? '红方 (先手)' : '黑方'}
              </span>
            </div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-stone-600">对战模式:</span>
              <div className="flex gap-2">
                <button 
                  onClick={() => setGameState(p => ({...p, mode: 'PVP'}))}
                  className={`px-3 py-1 rounded text-sm transition-colors ${gameState.mode === 'PVP' ? 'bg-stone-800 text-white' : 'bg-stone-100 text-stone-600'}`}
                >
                  人人对战
                </button>
                <button 
                  onClick={() => setGameState(p => ({...p, mode: 'PVE'}))}
                  className={`px-3 py-1 rounded text-sm transition-colors ${gameState.mode === 'PVE' ? 'bg-stone-800 text-white' : 'bg-stone-100 text-stone-600'}`}
                >
                  人机对战
                </button>
              </div>
            </div>
            
            {gameState.status.startsWith('WIN') && (
              <div className="mt-4 p-4 bg-yellow-100 border border-yellow-300 rounded-lg text-center">
                <p className="text-xl font-bold text-yellow-800">
                  🎉 {gameState.status === 'WIN_RED' ? '红方获胜！' : '黑方获胜！'}
                </p>
              </div>
            )}

            {isThinking && (
              <div className="mt-4 flex items-center gap-2 text-stone-500 text-sm animate-pulse">
                <div className="w-2 h-2 bg-stone-400 rounded-full"></div>
                Gemini 正在思考最佳棋步...
              </div>
            )}
          </div>

          <div className="space-y-4">
            <button 
              onClick={resetGame}
              className="w-full bg-stone-800 text-white py-3 rounded-lg font-bold hover:bg-stone-700 transition-colors shadow-lg"
            >
              重新开始
            </button>
          </div>
        </div>

        {/* Board Component */}
        <div className="flex-none">
          <Board
            board={gameState.board}
            selectedPos={gameState.selectedPos}
            validMoves={gameState.validMoves}
            onSquareClick={handleSquareClick}
          />
        </div>

        {/* Move History */}
        <div className="flex-1 w-full bg-white p-6 rounded-xl shadow-md border border-stone-200 h-[640px] flex flex-col">
          <h2 className="text-xl font-bold mb-4 border-b pb-2">棋谱记录</h2>
          <div className="flex-1 overflow-y-auto space-y-1 font-mono text-sm text-stone-600">
            {gameState.history.length === 0 ? (
              <p className="text-stone-400 italic">暂无记录</p>
            ) : (
              gameState.history.map((move, i) => (
                <div key={i} className="p-2 border-b border-stone-50 flex justify-between">
                  <span className="font-bold text-stone-400">#{(i + 1).toString().padStart(2, '0')}</span>
                  <span>{move}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <footer className="mt-12 text-stone-400 text-sm">
        <p>© 2024 ZenXiangqi - Powered by Gemini AI</p>
      </footer>
    </div>
  );
};

export default App;
