import React from 'react'
import './GameModeSelector.css'

const GameModeSelector = ({ 
  gameMode, 
  aiDifficulty, 
  ai1Depth, 
  ai2Depth, 
  onGameModeChange, 
  onAIDifficultyChange, 
  onAI1DepthChange, 
  onAI2DepthChange 
}) => {
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
          <button 
            className={`mode-button ${gameMode === 'ai-vs-ai' ? 'active' : ''}`}
            onClick={() => onGameModeChange('ai-vs-ai')}
          >
            🤖⚔️🤖 AI vs AI
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

      {gameMode === 'ai-vs-ai' && (
        <div className="ai-vs-ai-config">
          <div className="ai-config-section">
            <h4>🔴 AI Player 1 (Red) - Thinking Depth</h4>
            <div className="depth-controls">
              <input 
                type="range" 
                min="1" 
                max="8" 
                value={ai1Depth} 
                onChange={(e) => onAI1DepthChange(parseInt(e.target.value))}
                className="depth-slider"
              />
              <span className="depth-value">Depth: {ai1Depth}</span>
            </div>
            <div className="depth-description">
              {ai1Depth === 1 ? "Random moves" : 
               ai1Depth <= 3 ? "Basic strategy" : 
               ai1Depth <= 5 ? "Good strategy" : "Advanced strategy"}
            </div>
          </div>
          
          <div className="ai-config-section">
            <h4>🟡 AI Player 2 (Yellow) - Thinking Depth</h4>
            <div className="depth-controls">
              <input 
                type="range" 
                min="1" 
                max="8" 
                value={ai2Depth} 
                onChange={(e) => onAI2DepthChange(parseInt(e.target.value))}
                className="depth-slider"
              />
              <span className="depth-value">Depth: {ai2Depth}</span>
            </div>
            <div className="depth-description">
              {ai2Depth === 1 ? "Random moves" : 
               ai2Depth <= 3 ? "Basic strategy" : 
               ai2Depth <= 5 ? "Good strategy" : "Advanced strategy"}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default GameModeSelector