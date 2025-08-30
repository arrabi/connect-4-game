import { checkWinner, checkDraw } from './gameLogic.js'

const ROWS = 6
const COLS = 7
const PLAYER1 = 'red'    // Human player
const PLAYER2 = 'yellow' // AI player

// Get all valid columns (not full)
export function getValidColumns(board) {
  const validColumns = []
  for (let col = 0; col < COLS; col++) {
    if (board[0][col] === null) {
      validColumns.push(col)
    }
  }
  return validColumns
}

// Simulate dropping a piece in a column and return the resulting board and row
export function simulateMove(board, col, player) {
  // Find the lowest empty row in the column
  let row = -1
  for (let r = ROWS - 1; r >= 0; r--) {
    if (board[r][col] === null) {
      row = r
      break
    }
  }

  if (row === -1) return null // Column is full

  // Create new board with the move
  const newBoard = board.map((boardRow, rowIndex) =>
    boardRow.map((cell, colIndex) =>
      rowIndex === row && colIndex === col ? player : cell
    )
  )

  return { board: newBoard, row }
}

// Easy AI: Random move from available columns
export function getEasyAIMove(board) {
  const validColumns = getValidColumns(board)
  if (validColumns.length === 0) return null
  
  const randomIndex = Math.floor(Math.random() * validColumns.length)
  return validColumns[randomIndex]
}

// Medium AI: Block opponent wins, try to win, otherwise random
export function getMediumAIMove(board) {
  const validColumns = getValidColumns(board)
  if (validColumns.length === 0) return null

  // First, check if AI can win in this move
  for (const col of validColumns) {
    const result = simulateMove(board, col, PLAYER2)
    if (result && checkWinner(result.board, result.row, col, PLAYER2)) {
      return col
    }
  }

  // Second, check if we need to block human player from winning
  for (const col of validColumns) {
    const result = simulateMove(board, col, PLAYER1)
    if (result && checkWinner(result.board, result.row, col, PLAYER1)) {
      return col // Block the human player
    }
  }

  // Otherwise, make a random move
  return getEasyAIMove(board)
}

// Hard AI: Minimax with Alpha-Beta pruning
export function getHardAIMove(board) {
  const validColumns = getValidColumns(board)
  if (validColumns.length === 0) return null

  const depth = 6 // Look ahead 6 moves
  let bestCol = validColumns[0]
  let bestScore = -Infinity

  for (const col of validColumns) {
    const result = simulateMove(board, col, PLAYER2)
    if (result) {
      const score = minimax(result.board, depth - 1, -Infinity, Infinity, false)
      if (score > bestScore) {
        bestScore = score
        bestCol = col
      }
    }
  }

  return bestCol
}

// Minimax algorithm with Alpha-Beta pruning
function minimax(board, depth, alpha, beta, isMaximizing) {
  // Check if game is over
  const winner = getWinnerFromBoard(board)
  if (winner === PLAYER2) return 1000 + depth // AI wins (prefer quicker wins)
  if (winner === PLAYER1) return -1000 - depth // Human wins (prefer later losses)
  if (checkDraw(board) || depth === 0) return evaluateBoard(board)

  const validColumns = getValidColumns(board)
  
  if (isMaximizing) {
    let maxScore = -Infinity
    for (const col of validColumns) {
      const result = simulateMove(board, col, PLAYER2)
      if (result) {
        const score = minimax(result.board, depth - 1, alpha, beta, false)
        maxScore = Math.max(maxScore, score)
        alpha = Math.max(alpha, score)
        if (beta <= alpha) break // Alpha-Beta pruning
      }
    }
    return maxScore
  } else {
    let minScore = Infinity
    for (const col of validColumns) {
      const result = simulateMove(board, col, PLAYER1)
      if (result) {
        const score = minimax(result.board, depth - 1, alpha, beta, true)
        minScore = Math.min(minScore, score)
        beta = Math.min(beta, score)
        if (beta <= alpha) break // Alpha-Beta pruning
      }
    }
    return minScore
  }
}

// Check if there's a winner on the board (without needing last move position)
function getWinnerFromBoard(board) {
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const player = board[row][col]
      if (player && checkWinner(board, row, col, player)) {
        return player
      }
    }
  }
  return null
}

// Evaluate board position for minimax (heuristic scoring)
function evaluateBoard(board) {
  let score = 0
  
  // Score center column preference
  const centerCol = Math.floor(COLS / 2)
  for (let row = 0; row < ROWS; row++) {
    if (board[row][centerCol] === PLAYER2) score += 3
    if (board[row][centerCol] === PLAYER1) score -= 3
  }

  // Score all windows of 4
  score += evaluateWindows(board, PLAYER2) - evaluateWindows(board, PLAYER1)
  
  return score
}

// Evaluate all possible 4-in-a-row windows
function evaluateWindows(board, player) {
  let score = 0
  
  // Horizontal windows
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS - 3; col++) {
      const window = [board[row][col], board[row][col+1], board[row][col+2], board[row][col+3]]
      score += evaluateWindow(window, player)
    }
  }

  // Vertical windows
  for (let row = 0; row < ROWS - 3; row++) {
    for (let col = 0; col < COLS; col++) {
      const window = [board[row][col], board[row+1][col], board[row+2][col], board[row+3][col]]
      score += evaluateWindow(window, player)
    }
  }

  // Positive diagonal windows
  for (let row = 0; row < ROWS - 3; row++) {
    for (let col = 0; col < COLS - 3; col++) {
      const window = [board[row][col], board[row+1][col+1], board[row+2][col+2], board[row+3][col+3]]
      score += evaluateWindow(window, player)
    }
  }

  // Negative diagonal windows
  for (let row = 3; row < ROWS; row++) {
    for (let col = 0; col < COLS - 3; col++) {
      const window = [board[row][col], board[row-1][col+1], board[row-2][col+2], board[row-3][col+3]]
      score += evaluateWindow(window, player)
    }
  }

  return score
}

// Evaluate a single window of 4 positions
function evaluateWindow(window, player) {
  let score = 0
  const opponent = player === PLAYER1 ? PLAYER2 : PLAYER1
  
  const playerCount = window.filter(cell => cell === player).length
  const opponentCount = window.filter(cell => cell === opponent).length
  const emptyCount = window.filter(cell => cell === null).length

  if (playerCount === 4) score += 100
  else if (playerCount === 3 && emptyCount === 1) score += 10
  else if (playerCount === 2 && emptyCount === 2) score += 2

  if (opponentCount === 3 && emptyCount === 1) score -= 80

  return score
}

// Get AI move based on difficulty
export function getAIMove(board, difficulty) {
  switch (difficulty) {
    case 'easy':
      return getEasyAIMove(board)
    case 'medium':
      return getMediumAIMove(board)
    case 'hard':
      return getHardAIMove(board)
    default:
      return getEasyAIMove(board)
  }
}