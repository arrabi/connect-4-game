import React from 'react'
import playerStatsManager from '../utils/playerStats'
import './Leaderboard.css'

const Leaderboard = ({ isOpen, onClose }) => {
  if (!isOpen) return null

  const leaderboard = playerStatsManager.getLeaderboard()
  const activePlayerCount = playerStatsManager.getActivePlayerCount()

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

  const getRankClass = (rank) => {
    switch (rank) {
      case 1: return 'rank-gold'
      case 2: return 'rank-silver'
      case 3: return 'rank-bronze'
      default: return 'rank-default'
    }
  }

  return (
    <div className="leaderboard-overlay" onClick={handleBackdropClick}>
      <div className="leaderboard-modal">
        <div className="leaderboard-header">
          <h2>🏆 Leaderboard</h2>
          <button 
            className="close-button"
            onClick={onClose}
            aria-label="Close leaderboard"
          >
            ✕
          </button>
        </div>

        <div className="leaderboard-content">
          {activePlayerCount === 0 ? (
            <div className="empty-leaderboard">
              <div className="empty-icon">🎮</div>
              <h3>No Players Yet</h3>
              <p>Play some games to see rankings here!</p>
            </div>
          ) : (
            <>
              <div className="leaderboard-stats">
                <span className="total-players">
                  👥 {activePlayerCount} Player{activePlayerCount !== 1 ? 's' : ''}
                </span>
              </div>

              <div className="leaderboard-table">
                <div className="table-header">
                  <div className="col-rank">Rank</div>
                  <div className="col-player">Player</div>
                  <div className="col-games">Games</div>
                  <div className="col-record">W/L/D</div>
                  <div className="col-winrate">Win %</div>
                  <div className="col-besttime">Best Time</div>
                </div>

                <div className="table-body">
                  {leaderboard.map((player) => (
                    <div 
                      key={player.name} 
                      className={`table-row ${getRankClass(player.rank)}`}
                    >
                      <div className="col-rank">
                        <span className="rank-badge">
                          {getRankIcon(player.rank)}
                        </span>
                      </div>
                      <div className="col-player">
                        <span className="player-name">{player.name}</span>
                      </div>
                      <div className="col-games">
                        <span className="games-count">{player.gamesPlayed}</span>
                      </div>
                      <div className="col-record">
                        <span className="wins">{player.wins}</span>
                        <span className="separator">/</span>
                        <span className="losses">{player.losses}</span>
                        <span className="separator">/</span>
                        <span className="draws">{player.draws}</span>
                      </div>
                      <div className="col-winrate">
                        <span className="win-percentage">{player.winRate}</span>
                      </div>
                      <div className="col-besttime">
                        <span className="best-time">{player.bestTimeFormatted}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        <div className="leaderboard-footer">
          <p className="ranking-info">
            Rankings based on win percentage, then total wins
          </p>
        </div>
      </div>
    </div>
  )
}

export default Leaderboard