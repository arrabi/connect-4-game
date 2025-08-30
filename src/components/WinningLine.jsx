import React, { useEffect, useState } from 'react'
import './WinningLine.css'

const WinningLine = ({ winningCells }) => {
  const [lineStyle, setLineStyle] = useState(null)

  useEffect(() => {
    if (!winningCells || winningCells.length < 2) {
      setLineStyle(null)
      return
    }

    // Calculate line position dynamically based on actual cell positions
    setTimeout(() => {
      const boardGrid = document.querySelector('.board-grid')
      if (!boardGrid) return

      const cells = boardGrid.querySelectorAll('.cell')
      if (!cells.length) return

      const firstCell = winningCells[0]
      const lastCell = winningCells[winningCells.length - 1]
      
      const startIndex = firstCell[0] * 7 + firstCell[1]
      const endIndex = lastCell[0] * 7 + lastCell[1]
      
      const startElement = cells[startIndex]
      const endElement = cells[endIndex]
      
      if (!startElement || !endElement) return

      const boardRect = boardGrid.getBoundingClientRect()
      const startRect = startElement.getBoundingClientRect()
      const endRect = endElement.getBoundingClientRect()
      
      // Calculate centers relative to the board
      const startX = startRect.left - boardRect.left + startRect.width / 2
      const startY = startRect.top - boardRect.top + startRect.height / 2
      const endX = endRect.left - boardRect.left + endRect.width / 2
      const endY = endRect.top - boardRect.top + endRect.height / 2
      
      // Calculate line length and angle
      const length = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2))
      const angle = Math.atan2(endY - startY, endX - startX) * 180 / Math.PI
      
      setLineStyle({
        position: 'absolute',
        left: startX,
        top: startY,
        width: length,
        height: '6px',
        transformOrigin: '0 50%',
        transform: `rotate(${angle}deg)`,
        zIndex: 10,
        pointerEvents: 'none'
      })
    }, 100) // Small delay to ensure DOM is updated
  }, [winningCells])

  if (!lineStyle) {
    return null
  }

  return (
    <div className="winning-line-overlay">
      <div
        className="winning-line"
        style={lineStyle}
      />
    </div>
  )
}

export default WinningLine