// Player Statistics Management for Connect-4 Game
// Handles localStorage operations for persistent player data

const STORAGE_KEY = 'connect4_player_stats'

class PlayerStatsManager {
  constructor() {
    this.stats = this.loadStats()
  }

  // Load stats from localStorage
  loadStats() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored) : {}
    } catch (error) {
      console.warn('Failed to load player stats:', error)
      return {}
    }
  }

  // Save stats to localStorage
  saveStats() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.stats))
    } catch (error) {
      console.warn('Failed to save player stats:', error)
    }
  }

  // Get or create player stats
  getPlayerStats(playerName) {
    if (!playerName || playerName.trim() === '') return null
    
    const key = playerName.toLowerCase().trim()
    if (!this.stats[key]) {
      this.stats[key] = {
        name: playerName.trim(),
        wins: 0,
        losses: 0,
        draws: 0,
        gamesPlayed: 0,
        totalGameTime: 0, // in seconds
        bestTime: null, // fastest win time in seconds
        lastPlayed: null
      }
    }
    return this.stats[key]
  }

  // Record a game result
  recordGame(playerName, result, gameTime = 0, gameMode = '2-player') {
    if (!playerName || playerName.trim() === '') return
    
    const playerStats = this.getPlayerStats(playerName)
    if (!playerStats) return

    playerStats.gamesPlayed++
    playerStats.lastPlayed = new Date().toISOString()
    
    if (gameTime > 0) {
      playerStats.totalGameTime += gameTime
    }

    switch (result) {
      case 'win':
        playerStats.wins++
        // Track best time for wins in vs AI mode
        if (gameMode === 'vs-ai' && gameTime > 0) {
          if (!playerStats.bestTime || gameTime < playerStats.bestTime) {
            playerStats.bestTime = gameTime
          }
        }
        break
      case 'loss':
        playerStats.losses++
        break
      case 'draw':
        playerStats.draws++
        break
    }

    this.saveStats()
    return playerStats
  }

  // Get all player names
  getAllPlayerNames() {
    return Object.values(this.stats).map(player => player.name)
  }

  // Get formatted stats for display
  getFormattedStats(playerName) {
    const stats = this.getPlayerStats(playerName)
    if (!stats) return null

    const winRate = stats.gamesPlayed > 0 ? ((stats.wins / stats.gamesPlayed) * 100).toFixed(1) : '0.0'
    const avgGameTime = stats.gamesPlayed > 0 ? Math.round(stats.totalGameTime / stats.gamesPlayed) : 0

    return {
      ...stats,
      winRate: `${winRate}%`,
      avgGameTime: this.formatTime(avgGameTime),
      bestTimeFormatted: stats.bestTime ? this.formatTime(stats.bestTime) : 'N/A'
    }
  }

  // Format time in seconds to MM:SS format
  formatTime(seconds) {
    if (!seconds || seconds <= 0) return '0:00'
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // Clear all stats (for testing or reset purposes)
  clearAllStats() {
    this.stats = {}
    this.saveStats()
  }

  // Export stats for backup
  exportStats() {
    return JSON.stringify(this.stats, null, 2)
  }

  // Import stats from backup
  importStats(statsJson) {
    try {
      const imported = JSON.parse(statsJson)
      this.stats = imported
      this.saveStats()
      return true
    } catch (error) {
      console.warn('Failed to import stats:', error)
      return false
    }
  }

  // Get all players for leaderboard, sorted by criteria
  getLeaderboardData(sortBy = 'winRate') {
    const players = Object.values(this.stats)
    if (players.length === 0) return []

    // Calculate additional stats for each player
    const playersWithStats = players.map(player => {
      const winRate = player.gamesPlayed > 0 ? (player.wins / player.gamesPlayed) * 100 : 0
      const avgGameTime = player.gamesPlayed > 0 ? player.totalGameTime / player.gamesPlayed : 0
      
      return {
        ...player,
        winRateNumber: winRate,
        winRateFormatted: `${winRate.toFixed(1)}%`,
        avgGameTimeFormatted: this.formatTime(Math.round(avgGameTime)),
        bestTimeFormatted: player.bestTime ? this.formatTime(player.bestTime) : 'N/A',
        lastPlayedFormatted: player.lastPlayed ? new Date(player.lastPlayed).toLocaleDateString() : 'Never'
      }
    })

    // Sort players based on criteria
    return playersWithStats.sort((a, b) => {
      switch (sortBy) {
        case 'winRate':
          // Sort by win rate (higher is better), then by games played
          if (a.winRateNumber !== b.winRateNumber) {
            return b.winRateNumber - a.winRateNumber
          }
          return b.gamesPlayed - a.gamesPlayed
        case 'wins':
          return b.wins - a.wins
        case 'gamesPlayed':
          return b.gamesPlayed - a.gamesPlayed
        case 'lastPlayed':
          // Sort by last played date (most recent first)
          if (!a.lastPlayed) return 1
          if (!b.lastPlayed) return -1
          return new Date(b.lastPlayed) - new Date(a.lastPlayed)
        default:
          return b.winRateNumber - a.winRateNumber
      }
    })
  }

  // Get total number of players
  getTotalPlayers() {
    return Object.keys(this.stats).length
  }

  // Get total games played across all players
  getTotalGamesPlayed() {
    return Object.values(this.stats).reduce((total, player) => total + player.gamesPlayed, 0)
  }
}

// Create a singleton instance
const playerStatsManager = new PlayerStatsManager()

export default playerStatsManager