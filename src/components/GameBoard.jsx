import React from 'react'
import Cell from './Cell'
import './GameBoard.css'

const GameBoard = ({ board, onColumnClick, winningCells, currentPlayer, gameOver }) => {
  const isWinningCell = (row, col) => {
    return winningCells.some(([winRow, winCol]) => winRow === row && winCol === col)
  }

  const handleColumnClick = (col) => {
    if (gameOver) return
    onColumnClick(col)
  }

  const getColumnPreview = (col) => {
    if (gameOver) return null
    
    // Find the next available row in this column
    for (let row = board.length - 1; row >= 0; row--) {
      if (board[row][col] === null) {
        return row
      }
    }
    return null // Column is full
  }

  return (
    <div className="game-board">
      {/* Column headers for clicking */}
      <div className="column-headers">
        {Array(7).fill().map((_, col) => (
          <div
            key={col}
            className={`column-header ${gameOver ? 'disabled' : ''} ${getColumnPreview(col) !== null ? 'available' : 'full'}`}
            onClick={() => handleColumnClick(col)}
          >
            <div className={`preview-disc ${currentPlayer}`} />
          </div>
        ))}
      </div>
      
      {/* Game grid */}
      <div className="board-grid">
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <Cell
              key={`${rowIndex}-${colIndex}`}
              value={cell}
              isWinning={isWinningCell(rowIndex, colIndex)}
              row={rowIndex}
              col={colIndex}
            />
          ))
        )}
      </div>
    </div>
  )
}

export default GameBoard
