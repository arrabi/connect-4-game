import React from 'react'
import './GameModeSelector.css'

const GameModeSelector = ({ gameMode, aiDifficulty, onGameModeChange, onAIDifficultyChange }) => {
  return (
    <div className="game-mode-selector">
      <div className="mode-selection">
        <h3>🎮 Game Mode</h3>
        <div className="mode-buttons">
          <button 
            className={`mode-button ${gameMode === '2-player' ? 'active' : ''}`}
            onClick={() => onGameModeChange('2-player')}
          >
            👥 2 Players
          </button>
          <button 
            className={`mode-button ${gameMode === 'vs-ai' ? 'active' : ''}`}
            onClick={() => onGameModeChange('vs-ai')}
          >
            🤖 vs AI
          </button>
        </div>
      </div>

      {gameMode === 'vs-ai' && (
        <div className="ai-difficulty-selection">
          <h4>🎯 AI Difficulty</h4>
          <div className="difficulty-buttons">
            <button 
              className={`difficulty-button easy ${aiDifficulty === 'easy' ? 'active' : ''}`}
              onClick={() => onAIDifficultyChange('easy')}
              title="Random moves - Great for beginners"
            >
              😊 Easy
            </button>
            <button 
              className={`difficulty-button medium ${aiDifficulty === 'medium' ? 'active' : ''}`}
              onClick={() => onAIDifficultyChange('medium')}
              title="Blocks your wins and tries to win - Good challenge"
            >
              😐 Medium
            </button>
            <button 
              className={`difficulty-button hard ${aiDifficulty === 'hard' ? 'active' : ''}`}
              onClick={() => onAIDifficultyChange('hard')}
              title="Advanced strategy - Maximum challenge"
            >
              😈 Hard
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default GameModeSelector