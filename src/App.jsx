import React, { useState, useCallback, useEffect } from 'react'
import GameBoard from './components/GameBoard'
import GameStatus from './components/GameStatus'
import GameModeSelector from './components/GameModeSelector'
import SoundControls from './components/SoundControls'
import ConfirmationModal from './components/ConfirmationModal'
import { checkWinner, checkDraw } from './utils/gameLogic'
import { getAIMove, getAIMoveWithDepth } from './utils/aiLogic'
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
  const [gameMode, setGameMode] = useState('2-player') // '2-player', 'vs-ai', or 'ai-vs-ai'
  const [aiDifficulty, setAIDifficulty] = useState('medium')
  const [isAIThinking, setIsAIThinking] = useState(false)
  
  // AI vs AI mode state
  const [ai1Depth, setAI1Depth] = useState(4)
  const [ai2Depth, setAI2Depth] = useState(6)
  const [ai1Thinking, setAI1Thinking] = useState(false)
  const [ai2Thinking, setAI2Thinking] = useState(false)
  const [waitingForNextMove, setWaitingForNextMove] = useState(false)

  const resetGame = useCallback(() => {
    setBoard(Array(ROWS).fill(null).map(() => Array(COLS).fill(null)))
    setCurrentPlayer(PLAYER1)
    setWinner(null)
    setWinningCells([])
    setIsDraw(false)
    setIsAIThinking(false)
    setAI1Thinking(false)
    setAI2Thinking(false)
    setWaitingForNextMove(false)
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

  const handleAI1DepthChange = useCallback((depth) => {
    setAI1Depth(depth)
    resetGame()
  }, [resetGame])

  const handleAI2DepthChange = useCallback((depth) => {
    setAI2Depth(depth)
    resetGame()
  }, [resetGame])

  const handleNextMove = useCallback(() => {
    if (gameMode === 'ai-vs-ai' && waitingForNextMove && !winner && !isDraw) {
      setWaitingForNextMove(false)
    }
  }, [gameMode, waitingForNextMove, winner, isDraw])

  const makeMove = useCallback((col) => {
    if (winner || isDraw || isAIThinking || ai1Thinking || ai2Thinking) return false
    
    // In AI mode, only allow human player (PLAYER1) moves
    if (gameMode === 'vs-ai' && currentPlayer !== PLAYER1) return false
    
    // In AI vs AI mode, don't allow manual moves
    if (gameMode === 'ai-vs-ai') return false

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
  }, [board, currentPlayer, winner, isDraw, isAIThinking, ai1Thinking, ai2Thinking, gameMode])

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

  // AI vs AI move effect - triggers when it's an AI's turn in AI vs AI mode
  useEffect(() => {
    if (gameMode === 'ai-vs-ai' && !winner && !isDraw && !ai1Thinking && !ai2Thinking && !waitingForNextMove) {
      setWaitingForNextMove(true)
      
      // Determine which AI is thinking
      const isPlayer1Turn = currentPlayer === PLAYER1
      const aiDepth = isPlayer1Turn ? ai1Depth : ai2Depth
      
      if (isPlayer1Turn) {
        setAI1Thinking(true)
      } else {
        setAI2Thinking(true)
      }
      
      // Add a delay based on AI depth to make thinking feel realistic
      const thinkingDelay = Math.max(500, aiDepth * 300)
      
      setTimeout(() => {
        const aiCol = getAIMoveWithDepth(board, currentPlayer, aiDepth)
        
        if (aiCol !== null) {
          // Execute AI move
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
              }, 300)
              setAI1Thinking(false)
              setAI2Thinking(false)
              setWaitingForNextMove(false)
              return true
            }

            // Check for draw
            if (checkDraw(newBoard)) {
              setIsDraw(true)
              // Play draw sound
              setTimeout(() => {
                soundManager.playSound('draw')
              }, 300)
              setAI1Thinking(false)
              setAI2Thinking(false)
              setWaitingForNextMove(false)
              return true
            }

            // Switch to the other AI player
            setCurrentPlayer(currentPlayer === PLAYER1 ? PLAYER2 : PLAYER1)
            setAI1Thinking(false)
            setAI2Thinking(false)
            // Keep waitingForNextMove as true for the next AI move
            return true
          }
          
          aiMakeMove(aiCol)
        } else {
          setAI1Thinking(false)
          setAI2Thinking(false)
          setWaitingForNextMove(false)
        }
      }, thinkingDelay)
    }
  }, [board, currentPlayer, winner, isDraw, gameMode, ai1Depth, ai2Depth, ai1Thinking, ai2Thinking, waitingForNextMove])

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
          ai1Depth={ai1Depth}
          ai2Depth={ai2Depth}
          onGameModeChange={handleGameModeChange}
          onAIDifficultyChange={handleAIDifficultyChange}
          onAI1DepthChange={handleAI1DepthChange}
          onAI2DepthChange={handleAI2DepthChange}
        />
        
        {gameMode === 'ai-vs-ai' && waitingForNextMove && !winner && !isDraw && (
          <div className="next-move-container">
            <button 
              className="next-move-button"
              onClick={handleNextMove}
              title="Click to proceed with the next AI move"
            >
              ⏭️ Next Move
            </button>
          </div>
        )}
        
        <GameStatus 
          currentPlayer={currentPlayer}
          winner={winner}
          isDraw={isDraw}
          gameMode={gameMode}
          isAIThinking={isAIThinking}
          ai1Thinking={ai1Thinking}
          ai2Thinking={ai2Thinking}
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
