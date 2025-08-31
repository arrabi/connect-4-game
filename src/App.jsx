import React, { useState, useCallback, useEffect } from 'react'
import GameBoard from './components/GameBoard'
import GameStatus from './components/GameStatus'
import GameModeSelector from './components/GameModeSelector'
import SoundControls from './components/SoundControls'
import ConfirmationModal from './components/ConfirmationModal'
import PlayerSetup from './components/PlayerSetup'
import Leaderboard from './components/Leaderboard'
import { checkWinner, checkDraw } from './utils/gameLogic'
import { getAIMove, getAIMoveWithDepth } from './utils/aiLogic'
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
  const [gameMode, setGameMode] = useState('2-player') // '2-player', 'vs-ai', or 'ai-vs-ai'
  const [aiDifficulty, setAIDifficulty] = useState('medium')
  const [isAIThinking, setIsAIThinking] = useState(false)
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false)
  const [isControlsVisible, setIsControlsVisible] = useState(true)
  
  // AI vs AI mode state
  const [ai1Depth, setAI1Depth] = useState(4)
  const [ai2Depth, setAI2Depth] = useState(6)
  const [aiDepth, setAIDepth] = useState(6) // For vs-AI hard mode
  const [ai1Thinking, setAI1Thinking] = useState(false)
  const [ai2Thinking, setAI2Thinking] = useState(false)
  const [waitingForNextMove, setWaitingForNextMove] = useState(false)
  
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
    setAI1Thinking(false)
    setAI2Thinking(false)
    setWaitingForNextMove(false)
    setGameStartTime(Date.now())
    setGameEndTime(null)
    setGameDuration(0)
  }, [])

  // Start new game with player setup
  const startNewGame = useCallback(() => {
    if (gameMode === 'ai-vs-ai') {
      // For AI vs AI mode, skip player setup entirely
      setPlayer1Name('') // No human players
      setPlayer2Name('')
      setSetupPlayer(null)
      setIsPlayerSetupOpen(false)
      resetGame()
    } else if (gameMode === 'vs-ai') {
      // For vs-ai mode, only setup player 1
      setSetupPlayer('red')
      setIsPlayerSetupOpen(true)
    } else {
      // For 2-player mode, setup both players
      setSetupPlayer('red')
      setIsPlayerSetupOpen(true)
    }
  }, [gameMode, resetGame])

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
      } else if (gameMode === 'vs-ai') {
        // vs-ai mode, only player 1 needed
        setPlayer2Name('') // AI has no name
        setSetupPlayer(null)
        setIsPlayerSetupOpen(false)
        resetGame()
      }
      // Note: ai-vs-ai mode should never reach here as it skips player setup entirely
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

  const handleLeaderboardOpen = useCallback(() => {
    setIsLeaderboardOpen(true)
  }, [])

  const handleLeaderboardClose = useCallback(() => {
    setIsLeaderboardOpen(false)
  }, [])

  const toggleControlsVisibility = useCallback(() => {
    setIsControlsVisible(prev => !prev)
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

  const handleAI1DepthChange = useCallback((depth) => {
    setAI1Depth(depth)
  }, [])

  const handleAI2DepthChange = useCallback((depth) => {
    setAI2Depth(depth)
  }, [])

  const handleAIDepthChange = useCallback((depth) => {
    setAIDepth(depth)
  }, [])

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
  }, [board, currentPlayer, winner, isDraw, isAIThinking, ai1Thinking, ai2Thinking, gameMode, gameStartTime, player1Name, player2Name])

  // AI move effect - triggers when it's AI's turn in AI mode
  useEffect(() => {
    if (gameMode === 'vs-ai' && currentPlayer === PLAYER2 && !winner && !isDraw && !isAIThinking) {
      setIsAIThinking(true)
      
      // Add a slight delay to make AI moves feel more natural
      const aiMoveDelay = aiDifficulty === 'hard' ? 1500 : aiDifficulty === 'medium' ? 1000 : 500
      
      setTimeout(() => {
        let aiCol
        if (aiDifficulty === 'hard') {
          // Use custom depth for hard AI
          aiCol = getAIMoveWithDepth(board, PLAYER2, aiDepth)
        } else {
          // Use standard difficulty logic for easy and medium
          aiCol = getAIMove(board, aiDifficulty)
        }
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
  }, [board, currentPlayer, winner, isDraw, gameMode, aiDifficulty, aiDepth, isAIThinking, gameStartTime, player1Name])

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
              
              // Calculate game duration
              const endTime = Date.now()
              setGameEndTime(endTime)
              const duration = gameStartTime ? Math.round((endTime - gameStartTime) / 1000) : 0
              setGameDuration(duration)
              
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
              
              // Calculate game duration
              const endTime = Date.now()
              setGameEndTime(endTime)
              const duration = gameStartTime ? Math.round((endTime - gameStartTime) / 1000) : 0
              setGameDuration(duration)
              
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
  }, [board, currentPlayer, winner, isDraw, gameMode, ai1Depth, ai2Depth, ai1Thinking, ai2Thinking, waitingForNextMove, gameStartTime])

  return (
    <div className="app">
      <div className="game-container">
        <h1 className="game-title">Connect 4</h1>
        
        <div className="controls-section">
          <button 
            className="controls-toggle"
            onClick={toggleControlsVisibility}
            title={isControlsVisible ? "Hide controls" : "Show controls"}
          >
            {isControlsVisible ? "🔽 Hide Controls" : "🔼 Show Controls"}
          </button>
          
          <div className={`top-controls ${isControlsVisible ? 'visible' : 'hidden'}`}>
            <button 
              className="new-game-button"
              onClick={handleNewGameClick}
              title="Start a new game"
            >
              🔄 New Game
            </button>
            
            <button 
              className="leaderboard-button"
              onClick={handleLeaderboardOpen}
              title="View leaderboard"
            >
              🏆 Leaderboard
            </button>
            
            <SoundControls />
          </div>
        </div>
        
        <GameModeSelector
          gameMode={gameMode}
          aiDifficulty={aiDifficulty}
          ai1Depth={ai1Depth}
          ai2Depth={ai2Depth}
          aiDepth={aiDepth}
          onGameModeChange={handleGameModeChange}
          onAIDifficultyChange={handleAIDifficultyChange}
          onAI1DepthChange={handleAI1DepthChange}
          onAI2DepthChange={handleAI2DepthChange}
          onAIDepthChange={handleAIDepthChange}
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

        <Leaderboard
          isOpen={isLeaderboardOpen}
          onClose={handleLeaderboardClose}
        />
      </div>
    </div>
  )
}

export default App
