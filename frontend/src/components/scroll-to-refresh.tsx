import React, { useState, useRef, RefObject } from 'react'
import { Loader } from './loader'

interface ScrollToRefreshProps {
  children: React.ReactElement
  onScroll: () => Promise<void>
}

export const ScrollToRefresh: React.FC<ScrollToRefreshProps> = ({
  children,
  onScroll,
}: ScrollToRefreshProps) => {
  const [isPulling, setIsPulling] = useState(false)
  const containerRef: RefObject<HTMLDivElement | null> =
    useRef<HTMLDivElement | null>(null)
  const startY: RefObject<number | null> = useRef<number | null>(null)
  const threshold: number = 50

  const handleTouchStart = (e: React.TouchEvent): void => {
    if (containerRef.current && containerRef.current.scrollTop === 0) {
      startY.current = e.touches[0].clientY
    }
  }

  const handleTouchMove = (e: React.TouchEvent): void => {
    if (startY.current !== null) {
      const diff = e.touches[0].clientY - startY.current
      if (diff > threshold) {
        setIsPulling(true)
      }
    }
  }

  const handleTouchEnd = (): void => {
    if (isPulling) {
      onScroll().finally(() => {
        setIsPulling(false)
        startY.current = null
      })
    } else {
      startY.current = null
    }
  }

  return (
    <>
      <div style={{ display: isPulling ? 'block' : 'none' }}>
        <Loader size="small" />
      </div>
      <div
        ref={containerRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {children}
      </div>
    </>
  )
}
