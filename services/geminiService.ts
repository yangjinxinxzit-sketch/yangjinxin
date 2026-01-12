
import { GoogleGenAI, Type } from "@google/genai";
import { Piece, PieceColor, Move, PieceType } from "../types";

export const getAIMove = async (
  board: (Piece | null)[][],
  aiColor: PieceColor,
  difficulty: string
): Promise<Move | null> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // Convert board to a simplified readable format for AI
  const boardStr = board.map((row, r) => 
    row.map((p, c) => p ? `${p.color[0]}${p.type}` : '__').join(' ')
  ).join('\n');

  const systemInstruction = `
    You are a professional Chinese Chess (Xiangqi) grandmaster. 
    The current board is represented below (R=Red, B=Black, __=Empty).
    Rows: 0-9, Cols: 0-8. 
    Red is at rows 5-9, Black is at rows 0-4.
    
    Rules Summary:
    - King (帅/将): 1 step in palace (3x3 area).
    - Advisor (仕/士): 1 step diagonally in palace.
    - Bishop (相/象): 2 steps diagonally, no crossing river.
    - Knight (马): L-shape, blocked by pieces at adjacent straight step.
    - Rook (车): Straight lines.
    - Cannon (炮): Straight lines; captures by jumping over exactly one piece.
    - Pawn (兵/卒): 1 step forward; after crossing river can also move 1 step sideways.
    
    Your goal is to suggest the absolute best move for ${aiColor} based on ${difficulty} level.
    Return the move as a JSON object with 'from' and 'to' as [row, col].
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Current Board:\n${boardStr}\n\nSuggest the best move for ${aiColor}.`,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            from: {
              type: Type.ARRAY,
              items: { type: Type.INTEGER },
              description: "Starting position [row, col]"
            },
            to: {
              type: Type.ARRAY,
              items: { type: Type.INTEGER },
              description: "Target position [row, col]"
            },
            reasoning: {
              type: Type.STRING,
              description: "Brief explanation of the move"
            }
          },
          required: ["from", "to"]
        }
      }
    });

    const result = JSON.parse(response.text);
    return {
      from: [result.from[0], result.from[1]],
      to: [result.to[0], result.to[1]]
    };
  } catch (error) {
    console.error("AI Move error:", error);
    return null;
  }
};
