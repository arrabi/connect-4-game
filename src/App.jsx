import React, { useState, useCallback, useEffect } from 'react'
import GameBoard from './components/GameBoard'
import GameStatus from './components/GameStatus'
import GameModeSelector from './components/GameModeSelector'
import SoundControls from './components/SoundControls'
import ConfirmationModal from './components/ConfirmationModal'
import PlayerSetup from './components/PlayerSetup'
import { checkWinner, checkDraw } from './utils/gameLogic'
import { getAIMove } from './utils/aiLogic'
import soundManager from './utils/soundManager'
import playerStatsManager from './utils/playerStats'
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
  
  // Player management states
  const [player1Name, setPlayer1Name] = useState('')
  const [player2Name, setPlayer2Name] = useState('')
  const [isPlayerSetupOpen, setIsPlayerSetupOpen] = useState(false)
  const [setupPlayer, setSetupPlayer] = useState(null) // 'red' or 'yellow'
  
  // Game timing states
  const [gameStartTime, setGameStartTime] = useState(null)
  const [gameEndTime, setGameEndTime] = useState(null)
  const [gameDuration, setGameDuration] = useState(0)

  const resetGame = useCallback(() => {
    setBoard(Array(ROWS).fill(null).map(() => Array(COLS).fill(null)))
    setCurrentPlayer(PLAYER1)
    setWinner(null)
    setWinningCells([])
    setIsDraw(false)
    setIsAIThinking(false)
    setGameStartTime(Date.now())
    setGameEndTime(null)
    setGameDuration(0)
  }, [])

  // Start new game with player setup
  const startNewGame = useCallback(() => {
    // For vs-ai mode, only setup player 1
    if (gameMode === 'vs-ai') {
      setSetupPlayer('red')
      setIsPlayerSetupOpen(true)
    } else {
      // For 2-player mode, setup both players
      setSetupPlayer('red')
      setIsPlayerSetupOpen(true)
    }
  }, [gameMode])

  // Initialize player setup on first load
  useEffect(() => {
    if (!player1Name && !gameStartTime) {
      startNewGame()
    }
  }, [startNewGame, player1Name, gameStartTime])

  // Handle player setup completion
  const handlePlayerSetup = useCallback((playerName) => {
    if (setupPlayer === 'red') {
      setPlayer1Name(playerName)
      
      if (gameMode === '2-player') {
        // Setup player 2 next
        setSetupPlayer('yellow')
        // Keep modal open for player 2
      } else {
        // vs-ai mode, only player 1 needed
        setPlayer2Name('') // AI has no name
        setSetupPlayer(null)
        setIsPlayerSetupOpen(false)
        resetGame()
      }
    } else if (setupPlayer === 'yellow') {
      setPlayer2Name(playerName)
      setSetupPlayer(null)
      setIsPlayerSetupOpen(false)
      resetGame()
    }
  }, [setupPlayer, gameMode, resetGame])

  const handleNewGameClick = useCallback(() => {
    if (gameStartTime) {
      // Game in progress, show confirmation
      setIsConfirmModalOpen(true)
    } else {
      // No game in progress, start player setup
      startNewGame()
    }
  }, [gameStartTime, startNewGame])

  const handleConfirmReset = useCallback(() => {
    setIsConfirmModalOpen(false)
    startNewGame()
  }, [startNewGame])

  const handleCancelReset = useCallback(() => {
    setIsConfirmModalOpen(false)
  }, [])

  const handleGameModeChange = useCallback((mode) => {
    setGameMode(mode)
    // Clear player names when switching modes
    setPlayer1Name('')
    setPlayer2Name('')
    setGameStartTime(null)
    setGameEndTime(null)
    setGameDuration(0)
    startNewGame()
  }, [startNewGame])

  const handleAIDifficultyChange = useCallback((difficulty) => {
    setAIDifficulty(difficulty)
    if (gameStartTime) {
      resetGame()
    }
  }, [resetGame, gameStartTime])

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
      
      // Calculate game duration
      const endTime = Date.now()
      setGameEndTime(endTime)
      const duration = gameStartTime ? Math.round((endTime - gameStartTime) / 1000) : 0
      setGameDuration(duration)
      
      // Record stats for named players
      if (gameMode === 'vs-ai' && player1Name) {
        const result = currentPlayer === PLAYER1 ? 'win' : 'loss'
        playerStatsManager.recordGame(player1Name, result, duration, gameMode)
      } else if (gameMode === '2-player') {
        if (currentPlayer === PLAYER1 && player1Name) {
          playerStatsManager.recordGame(player1Name, 'win', duration, gameMode)
        }
        if (currentPlayer === PLAYER2 && player2Name) {
          playerStatsManager.recordGame(player2Name, 'win', duration, gameMode)
        }
        // Record loss for the other player
        if (currentPlayer === PLAYER1 && player2Name) {
          playerStatsManager.recordGame(player2Name, 'loss', duration, gameMode)
        }
        if (currentPlayer === PLAYER2 && player1Name) {
          playerStatsManager.recordGame(player1Name, 'loss', duration, gameMode)
        }
      }
      
      // Play win/lose sounds
      setTimeout(() => {
        soundManager.playSound('win')
      }, 300) // Slight delay for drop sound to finish
      return true
    }

    // Check for draw
    if (checkDraw(newBoard)) {
      setIsDraw(true)
      
      // Calculate game duration
      const endTime = Date.now()
      setGameEndTime(endTime)
      const duration = gameStartTime ? Math.round((endTime - gameStartTime) / 1000) : 0
      setGameDuration(duration)
      
      // Record draw for named players
      if (gameMode === 'vs-ai' && player1Name) {
        playerStatsManager.recordGame(player1Name, 'draw', duration, gameMode)
      } else if (gameMode === '2-player') {
        if (player1Name) {
          playerStatsManager.recordGame(player1Name, 'draw', duration, gameMode)
        }
        if (player2Name) {
          playerStatsManager.recordGame(player2Name, 'draw', duration, gameMode)
        }
      }
      
      // Play draw sound
      setTimeout(() => {
        soundManager.playSound('draw')
      }, 300)
      return true
    }

    // Switch players
    setCurrentPlayer(currentPlayer === PLAYER1 ? PLAYER2 : PLAYER1)
    return true
  }, [board, currentPlayer, winner, isDraw, isAIThinking, gameMode, gameStartTime, player1Name, player2Name])

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
              
              // Calculate game duration
              const endTime = Date.now()
              setGameEndTime(endTime)
              const duration = gameStartTime ? Math.round((endTime - gameStartTime) / 1000) : 0
              setGameDuration(duration)
              
              // Record loss for player 1 (AI wins)
              if (player1Name) {
                playerStatsManager.recordGame(player1Name, 'loss', duration, gameMode)
              }
              
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
              
              // Calculate game duration
              const endTime = Date.now()
              setGameEndTime(endTime)
              const duration = gameStartTime ? Math.round((endTime - gameStartTime) / 1000) : 0
              setGameDuration(duration)
              
              // Record draw for player 1
              if (player1Name) {
                playerStatsManager.recordGame(player1Name, 'draw', duration, gameMode)
              }
              
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
  }, [board, currentPlayer, winner, isDraw, gameMode, aiDifficulty, isAIThinking, gameStartTime, player1Name])

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
          player1Name={player1Name}
          player2Name={player2Name}
          gameDuration={gameDuration}
          gameStartTime={gameStartTime}
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
        
        <PlayerSetup
          isOpen={isPlayerSetupOpen}
          onClose={() => setIsPlayerSetupOpen(false)}
          onPlayerSetup={handlePlayerSetup}
          currentPlayer={setupPlayer}
        />
      </div>
    </div>
  )
}

export default App
