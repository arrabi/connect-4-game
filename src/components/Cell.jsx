import React, { useEffect, useState } from 'react'
import './Cell.css'

const Cell = ({ value, isWinning, row, col }) => {
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (value) {
      setIsAnimating(true)
      const timer = setTimeout(() => setIsAnimating(false), 600)
      return () => clearTimeout(timer)
    }
  }, [value])

  return (
    <div className="cell">
      <div 
        className={`disc ${value || ''} ${isWinning ? 'winning' : ''} ${isAnimating ? 'dropping' : ''}`}
        style={{
          animationDelay: `${row * 0.1}s`
        }}
      />
    </div>
  )
}

export default Cell
