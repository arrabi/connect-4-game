import React, { useState, useCallback } from 'react'
import GameBoard from './components/GameBoard'
import GameStatus from './components/GameStatus'
import ConfirmationModal from './components/ConfirmationModal'
import { checkWinner, checkDraw } from './utils/gameLogic'
import './App.css'

const ROWS = 6
const COLS = 7
const PLAYER1 = 'red'
const PLAYER2 = 'yellow'

function App() {
  const [board, setBoard] = useState(() => 
    Array(ROWS).fill(null).map(() => Array(COLS).fill(null))
  )
  const [currentPlayer, setCurrentPlayer] = useState(PLAYER1)
  const [winner, setWinner] = useState(null)
  const [winningCells, setWinningCells] = useState([])
  const [isDraw, setIsDraw] = useState(false)
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)

  const resetGame = useCallback(() => {
    setBoard(Array(ROWS).fill(null).map(() => Array(COLS).fill(null)))
    setCurrentPlayer(PLAYER1)
    setWinner(null)
    setWinningCells([])
    setIsDraw(false)
  }, [])

  const handleNewGameClick = useCallback(() => {
    setIsConfirmModalOpen(true)
  }, [])

  const handleConfirmReset = useCallback(() => {
    resetGame()
    setIsConfirmModalOpen(false)
  }, [resetGame])

  const handleCancelReset = useCallback(() => {
    setIsConfirmModalOpen(false)
  }, [])

  const makeMove = useCallback((col) => {
    if (winner || isDraw) return false

    // Find the lowest empty row in the column
    let row = -1
    for (let r = ROWS - 1; r >= 0; r--) {
      if (board[r][col] === null) {
        row = r
        break
      }
    }

    if (row === -1) return false // Column is full

    // Create new board with the move
    const newBoard = board.map((boardRow, rowIndex) =>
      boardRow.map((cell, colIndex) =>
        rowIndex === row && colIndex === col ? currentPlayer : cell
      )
    )

    setBoard(newBoard)

    // Check for winner
    const winResult = checkWinner(newBoard, row, col, currentPlayer)
    if (winResult) {
      setWinner(currentPlayer)
      setWinningCells(winResult.cells)
      return true
    }

    // Check for draw
    if (checkDraw(newBoard)) {
      setIsDraw(true)
      return true
    }

    // Switch players
    setCurrentPlayer(currentPlayer === PLAYER1 ? PLAYER2 : PLAYER1)
    return true
  }, [board, currentPlayer, winner, isDraw])

  return (
    <div className="app">
      <div className="game-container">
        <h1 className="game-title">Connect 4</h1>
        
        <div className="top-controls">
          <button 
            className="new-game-button"
            onClick={handleNewGameClick}
            title="Start a new game"
          >
            🔄 New Game
          </button>
        </div>
        
        <GameStatus 
          currentPlayer={currentPlayer}
          winner={winner}
          isDraw={isDraw}
        />
        
        <GameBoard 
          board={board}
          onColumnClick={makeMove}
          winningCells={winningCells}
          currentPlayer={currentPlayer}
          gameOver={winner || isDraw}
        />
        
        <ConfirmationModal 
          isOpen={isConfirmModalOpen}
          onConfirm={handleConfirmReset}
          onCancel={handleCancelReset}
          title="🔄 Start New Game"
          message="Are you sure you want to start a new game? The current game will be lost."
        />
      </div>
    </div>
  )
}

export default App
