import React, { useState, useCallback, useRef } from 'react'
import Cell from './Cell'
import './GameBoard.css'

const GameBoard = ({ board, onColumnClick, winningCells, currentPlayer, gameOver }) => {
  // State for drag/touch interaction
  const [isDragging, setIsDragging] = useState(false)
  const [dragColumn, setDragColumn] = useState(null)
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 })
  const [showFloatingCoin, setShowFloatingCoin] = useState(false)
  const boardRef = useRef(null)

  const isWinningCell = (row, col) => {
    return winningCells.some(([winRow, winCol]) => winRow === row && winCol === col)
  }

  const handleColumnClick = (col) => {
    if (gameOver) return
  onColumnClick(col)
  }

  const getColumnPreview = (col) => {
    if (gameOver) return null
    
    // Find the next available row in this column
    for (let row = board.length - 1; row >= 0; row--) {
      if (board[row][col] === null) {
        return row
      }
    }
    return null // Column is full
  }

  // Get column from pointer position
  const getColumnFromPosition = useCallback((clientX) => {
    if (!boardRef.current) return null
    
    const rect = boardRef.current.getBoundingClientRect()
    const boardGrid = boardRef.current.querySelector('.board-grid')
    if (!boardGrid) return null
    
    const gridRect = boardGrid.getBoundingClientRect()
    const relativeX = clientX - gridRect.left
    
    if (relativeX < 0 || relativeX > gridRect.width) {
      return null // Outside board
    }
    
    const columnWidth = gridRect.width / 7
    const column = Math.floor(relativeX / columnWidth)
    
    return column >= 0 && column < 7 ? column : null
  }, [])

  // Handle pointer start (mouse down or touch start)
  const handlePointerStart = useCallback((e) => {
    if (gameOver) return

    // Only prevent default for touch events to avoid blocking mouse clicks on desktop
    const isTouchEvent = !!(e.touches && e.touches.length)
    if (isTouchEvent) e.preventDefault()

    const clientX = e.clientX || (e.touches && e.touches[0]?.clientX)
    if (!clientX) return

  const column = getColumnFromPosition(clientX)
    if (column !== null && getColumnPreview(column) !== null) {
      setIsDragging(true)
      setDragColumn(column)
      setShowFloatingCoin(true)
      setDragPosition({ x: clientX, y: e.clientY || (e.touches && e.touches[0]?.clientY) || 0 })
    }
  }, [gameOver, getColumnFromPosition, getColumnPreview])

  // Handle pointer move
  const handlePointerMove = useCallback((e) => {
    if (!isDragging) return

    // Only prevent default for touch moves
    const isTouchEvent = !!(e.touches && e.touches.length)
    if (isTouchEvent) e.preventDefault()

    const clientX = e.clientX || (e.touches && e.touches[0]?.clientX)
    const clientY = e.clientY || (e.touches && e.touches[0]?.clientY)

    if (!clientX || !clientY) return

    const column = getColumnFromPosition(clientX)

  if (column !== null && getColumnPreview(column) !== null) {
      setDragColumn(column)
      setShowFloatingCoin(true)
    } else {
      setDragColumn(null)
      setShowFloatingCoin(false)
    }
    

    setDragPosition({ x: clientX, y: clientY })
  }, [isDragging, getColumnFromPosition, getColumnPreview])

  // Handle pointer end (mouse up or touch end)
  const handlePointerEnd = useCallback((e) => {
    if (!isDragging) return

    // Only prevent default for touch end
    const isTouchEvent = !!(e.changedTouches && e.changedTouches.length)
    if (isTouchEvent) e.preventDefault()

    if (dragColumn !== null && getColumnPreview(dragColumn) !== null) {
      onColumnClick(dragColumn)
    }

    setIsDragging(false)
    setDragColumn(null)
    setShowFloatingCoin(false)
    setDragPosition({ x: 0, y: 0 })
  }, [isDragging, dragColumn, getColumnPreview, onColumnClick])

  return (
    <div 
      className="game-board" 
      ref={boardRef}
      onMouseDown={handlePointerStart}
      onMouseMove={handlePointerMove}
      onMouseUp={handlePointerEnd}
      onTouchStart={handlePointerStart}
      onTouchMove={handlePointerMove}
      onTouchEnd={handlePointerEnd}
      style={{ position: 'relative' }}
    >
      {/* Floating coin during drag */}
      {showFloatingCoin && (
        <div 
          className={`floating-coin ${currentPlayer}`}
          style={{
            position: 'fixed',
            left: dragPosition.x - 20,
            top: dragPosition.y - 20,
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            pointerEvents: 'none',
            zIndex: 1000,
            transform: 'translate(-50%, -50%)',
            opacity: 0.8
          }}
        />
      )}

      {/* Column headers for clicking */}
      <div className="column-headers" role="grid" aria-label="Connect 4 game board">
        {Array(7).fill().map((_, col) => (
          <button
            key={col}
            className={`column-header ${gameOver ? 'disabled' : ''} ${getColumnPreview(col) !== null ? 'available' : 'full'} ${dragColumn === col ? 'highlighted' : ''}`}
            onClick={() => handleColumnClick(col)}
            disabled={gameOver || getColumnPreview(col) === null}
            aria-label={`Drop disc in column ${col + 1}`}
            title={`Click to drop ${currentPlayer} disc in column ${col + 1}`}
          >
            <div className={`preview-disc ${currentPlayer}`} aria-hidden="true" />
          </button>
        ))}
      </div>
      
      {/* Game grid */}
      <div className="board-grid">
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <Cell
              key={`${rowIndex}-${colIndex}`}
              value={cell}
              isWinning={isWinningCell(rowIndex, colIndex)}
              row={rowIndex}
              col={colIndex}
            />
          ))
        )}
      </div>
    </div>
  )
}

export default GameBoard
