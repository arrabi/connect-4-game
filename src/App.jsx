import React, { useState, useCallback, useEffect } from 'react'
import GameBoard from './components/GameBoard'
import GameStatus from './components/GameStatus'
import GameModeSelector from './components/GameModeSelector'
import SoundControls from './components/SoundControls'
import ConfirmationModal from './components/ConfirmationModal'
import { checkWinner, checkDraw } from './utils/gameLogic'
import { getAIMove } from './utils/aiLogic'
import soundManager from './utils/soundManager'
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
  const [gameMode, setGameMode] = useState('2-player') // '2-player' or 'vs-ai'
  const [aiDifficulty, setAIDifficulty] = useState('medium')
  const [isAIThinking, setIsAIThinking] = useState(false)

  const resetGame = useCallback(() => {
    setBoard(Array(ROWS).fill(null).map(() => Array(COLS).fill(null)))
    setCurrentPlayer(PLAYER1)
    setWinner(null)
    setWinningCells([])
    setIsDraw(false)
    setIsAIThinking(false)
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

  const handleGameModeChange = useCallback((mode) => {
    setGameMode(mode)
    resetGame()
  }, [resetGame])

  const handleAIDifficultyChange = useCallback((difficulty) => {
    setAIDifficulty(difficulty)
    resetGame()
  }, [resetGame])

  const makeMove = useCallback((col) => {
    if (winner || isDraw || isAIThinking) return false
    
    // In AI mode, only allow human player (PLAYER1) moves
    if (gameMode === 'vs-ai' && currentPlayer !== PLAYER1) return false

    // Find the lowest empty row in the column
    let row = -1
    for (let r = ROWS - 1; r >= 0; r--) {
      if (board[r][col] === null) {
        row = r
        break
      }
    }

    if (row === -1) return false // Column is full

    // Play drop sound
    soundManager.playSound('drop')

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
      // Play win/lose sounds
      setTimeout(() => {
        soundManager.playSound('win')
      }, 300) // Slight delay for drop sound to finish
      return true
    }

    // Check for draw
    if (checkDraw(newBoard)) {
      setIsDraw(true)
      // Play draw sound
      setTimeout(() => {
        soundManager.playSound('draw')
      }, 300)
      return true
    }

    // Switch players
    setCurrentPlayer(currentPlayer === PLAYER1 ? PLAYER2 : PLAYER1)
    return true
  }, [board, currentPlayer, winner, isDraw, isAIThinking, gameMode])

  // AI move effect - triggers when it's AI's turn in AI mode
  useEffect(() => {
    if (gameMode === 'vs-ai' && currentPlayer === PLAYER2 && !winner && !isDraw && !isAIThinking) {
      setIsAIThinking(true)
      
      // Add a slight delay to make AI moves feel more natural
      const aiMoveDelay = aiDifficulty === 'hard' ? 1500 : aiDifficulty === 'medium' ? 1000 : 500
      
      setTimeout(() => {
        const aiCol = getAIMove(board, aiDifficulty)
        if (aiCol !== null) {
          // Simulate AI move by calling makeMove directly with AI logic
          const aiMakeMove = (col) => {
            // Find the lowest empty row in the column
            let row = -1
            for (let r = ROWS - 1; r >= 0; r--) {
              if (board[r][col] === null) {
                row = r
                break
              }
            }

            if (row === -1) return false // Column is full

            // Play drop sound
            soundManager.playSound('drop')

            // Create new board with the move
            const newBoard = board.map((boardRow, rowIndex) =>
              boardRow.map((cell, colIndex) =>
                rowIndex === row && colIndex === col ? PLAYER2 : cell
              )
            )

            setBoard(newBoard)

            // Check for winner
            const winResult = checkWinner(newBoard, row, col, PLAYER2)
            if (winResult) {
              setWinner(PLAYER2)
              setWinningCells(winResult.cells)
              // Play win/lose sounds
              setTimeout(() => {
                soundManager.playSound('win')
              }, 300)
              setIsAIThinking(false)
              return true
            }

            // Check for draw
            if (checkDraw(newBoard)) {
              setIsDraw(true)
              // Play draw sound
              setTimeout(() => {
                soundManager.playSound('draw')
              }, 300)
              setIsAIThinking(false)
              return true
            }

            // Switch back to human player
            setCurrentPlayer(PLAYER1)
            setIsAIThinking(false)
            return true
          }
          
          aiMakeMove(aiCol)
        } else {
          setIsAIThinking(false)
        }
      }, aiMoveDelay)
    }
  }, [board, currentPlayer, winner, isDraw, gameMode, aiDifficulty, isAIThinking])

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
          
          <SoundControls />
        </div>
        
        <GameModeSelector
          gameMode={gameMode}
          aiDifficulty={aiDifficulty}
          onGameModeChange={handleGameModeChange}
          onAIDifficultyChange={handleAIDifficultyChange}
        />
        
        <GameStatus 
          currentPlayer={currentPlayer}
          winner={winner}
          isDraw={isDraw}
          gameMode={gameMode}
          isAIThinking={isAIThinking}
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
