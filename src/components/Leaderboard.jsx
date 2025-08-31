import React, { useState, useEffect } from 'react'
import playerStatsManager from '../utils/playerStats'
import './Leaderboard.css'

const Leaderboard = ({ isOpen, onClose }) => {
  const [players, setPlayers] = useState([])
  const [sortBy, setSortBy] = useState('winRate')
  const [totalPlayers, setTotalPlayers] = useState(0)
  const [totalGames, setTotalGames] = useState(0)

  useEffect(() => {
    if (isOpen) {
      refreshLeaderboard()
    }
  }, [isOpen, sortBy])

  const refreshLeaderboard = () => {
    const leaderboardData = playerStatsManager.getLeaderboardData(sortBy)
    setPlayers(leaderboardData)
    setTotalPlayers(playerStatsManager.getTotalPlayers())
    setTotalGames(playerStatsManager.getTotalGamesPlayed())
  }

  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy)
  }

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1: return '🥇'
      case 2: return '🥈'
      case 3: return '🥉'
      default: return `#${rank}`
    }
  }

  const getSortButtonClass = (criteria) => {
    return `sort-button ${sortBy === criteria ? 'active' : ''}`
  }

  if (!isOpen) return null

  return (
    <div className="leaderboard-backdrop" onClick={handleBackdropClick}>
      <div className="leaderboard-modal">
        <div className="leaderboard-header">
          <h2>🏆 Leaderboard</h2>
          <button 
            className="close-button"
            onClick={onClose}
            aria-label="Close leaderboard"
          >
            ×
          </button>
        </div>
        
        <div className="leaderboard-content">
          {/* Summary Stats */}
          <div className="summary-stats">
            <div className="stat-item">
              <span className="stat-label">Total Players:</span>
              <span className="stat-value">{totalPlayers}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Total Games:</span>
              <span className="stat-value">{totalGames}</span>
            </div>
          </div>

          {/* Sort Controls */}
          <div className="sort-controls">
            <span className="sort-label">Sort by:</span>
            <div className="sort-buttons">
              <button 
                className={getSortButtonClass('winRate')}
                onClick={() => handleSortChange('winRate')}
              >
                Win Rate
              </button>
              <button 
                className={getSortButtonClass('wins')}
                onClick={() => handleSortChange('wins')}
              >
                Wins
              </button>
              <button 
                className={getSortButtonClass('gamesPlayed')}
                onClick={() => handleSortChange('gamesPlayed')}
              >
                Games
              </button>
              <button 
                className={getSortButtonClass('lastPlayed')}
                onClick={() => handleSortChange('lastPlayed')}
              >
                Activity
              </button>
            </div>
          </div>

          {/* Player List */}
          <div className="players-list">
            {players.length > 0 ? (
              <div className="players-table">
                <div className="table-header">
                  <div className="rank-col">Rank</div>
                  <div className="name-col">Player</div>
                  <div className="stats-col">W-L-D</div>
                  <div className="rate-col">Win %</div>
                  <div className="games-col">Games</div>
                  <div className="time-col">Best Time</div>
                </div>
                
                {players.map((player, index) => (
                  <div key={player.name} className="player-row">
                    <div className="rank-col">
                      <span className="rank-badge">
                        {getRankIcon(index + 1)}
                      </span>
                    </div>
                    <div className="name-col">
                      <span className="player-name">{player.name}</span>
                      <span className="last-played">
                        Last: {player.lastPlayedFormatted}
                      </span>
                    </div>
                    <div className="stats-col">
                      <span className="win-loss-record">
                        {player.wins}-{player.losses}-{player.draws}
                      </span>
                    </div>
                    <div className="rate-col">
                      <span className={`win-rate ${player.winRateNumber >= 60 ? 'high' : player.winRateNumber >= 40 ? 'medium' : 'low'}`}>
                        {player.winRateFormatted}
                      </span>
                    </div>
                    <div className="games-col">
                      <span className="games-played">{player.gamesPlayed}</span>
                    </div>
                    <div className="time-col">
                      <span className="best-time">
                        {player.bestTimeFormatted}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-leaderboard">
                <div className="empty-icon">🎮</div>
                <h3>No Players Yet!</h3>
                <p>Start playing games with named players to see them appear on the leaderboard.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Leaderboard