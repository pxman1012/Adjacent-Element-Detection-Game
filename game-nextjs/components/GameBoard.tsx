import React from 'react';

interface GameBoardProps {
  size: number;
  onClickCell: (row: number, col: number) => void;
  board: number[][];
}

const GameBoard: React.FC<GameBoardProps> = ({ size, onClickCell, board }) => {
  // Kích thước cố định của bảng
  const boardSize = 400; // Đặt kích thước cố định cho toàn bảng
  const cellSize = boardSize / size; // Tính kích thước của từng ô dựa trên số lượng ô

  return (
    <div
      className="grid"
      style={{
        gridTemplateColumns: `repeat(${size}, 1fr)`, // Đảm bảo bảng là hình vuông với các cột và hàng
        width: `${boardSize}px`, // Chiều rộng cố định
        height: `${boardSize}px`, // Chiều cao cố định
      }}
    >
      {board.map((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <div
            key={`${rowIndex}-${colIndex}`}
            onClick={() => onClickCell(rowIndex, colIndex)}
            className="flex items-center justify-center border border-gray-400 bg-gray-200 cursor-pointer"
            style={{
              width: `${cellSize}px`, // Kích thước động của từng ô
              height: `${cellSize}px`, // Kích thước động của từng ô
            }}
          >
            {cell !== 0 && <span>{cell}</span>}
          </div>
        ))
      )}
    </div>
  );
};

export default GameBoard;
