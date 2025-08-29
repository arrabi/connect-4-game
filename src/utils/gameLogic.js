// Check if there's a winner starting from the given position
export function checkWinner(board, row, col, player) {
  const directions = [
    [0, 1],   // horizontal
    [1, 0],   // vertical
    [1, 1],   // diagonal /
    [1, -1],  // diagonal \
  ]

  for (const [deltaRow, deltaCol] of directions) {
    let count = 1 // Count the current piece
    const cells = [[row, col]]
    
    // Check in positive direction
    for (let i = 1; i < 4; i++) {
      const newRow = row + i * deltaRow
      const newCol = col + i * deltaCol
      
      if (
        newRow >= 0 && 
        newRow < board.length && 
        newCol >= 0 && 
        newCol < board[0].length &&
        board[newRow][newCol] === player
      ) {
        count++
        cells.push([newRow, newCol])
      } else {
        break
      }
    }
    
    // Check in negative direction
    for (let i = 1; i < 4; i++) {
      const newRow = row - i * deltaRow
      const newCol = col - i * deltaCol
      
      if (
        newRow >= 0 && 
        newRow < board.length && 
        newCol >= 0 && 
        newCol < board[0].length &&
        board[newRow][newCol] === player
      ) {
        count++
        cells.unshift([newRow, newCol])
      } else {
        break
      }
    }
    
    // If we have 4 or more in a row, we found a winner
    if (count >= 4) {
      return { winner: player, cells: cells.slice(0, 4) }
    }
  }
  
  return null
}

// Check if the game is a draw (board is full)
export function checkDraw(board) {
  return board[0].every(cell => cell !== null)
}
