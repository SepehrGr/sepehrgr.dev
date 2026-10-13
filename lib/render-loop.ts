const FRAME_MS = 1000 / 30

export type RenderLoop = {
  /** Force a redraw on the next frame (after resize, theme or uniform changes). */
  invalidate: () => void
  destroy: () => void
}

/**
 * Drives an ambient WebGL effect at ~30fps, only while `el` is near the
 * viewport and the tab is visible. Under prefers-reduced-motion it draws a
 * single still frame (time = 0) and only redraws when invalidated.
 */
export function createRenderLoop(
  el: Element,
  render: (seconds: number) => void
): RenderLoop {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
  const t0 = performance.now()
  let raf = 0
  let last = -Infinity
  let visible = document.visibilityState === 'visible'
  let onScreen = false

  const tick = (now: number): void => {
    raf = 0
    if (!visible || !onScreen) return
    // 1ms slack so 60/120Hz vsync lands on every 2nd/4th frame instead of drifting to 20fps
    if (now - last >= FRAME_MS - 1) {
      last = now
      render(reducedMotion.matches ? 0 : (now - t0) / 1000)
    }
    if (!reducedMotion.matches) raf = requestAnimationFrame(tick)
  }

  const start = (): void => {
    if (!raf) raf = requestAnimationFrame(tick)
  }

  const invalidate = (): void => {
    last = -Infinity
    start()
  }

  const onVisibility = (): void => {
    visible = document.visibilityState === 'visible'
    start()
  }

  const io = new IntersectionObserver(
    entries => {
      for (const e of entries) onScreen = e.isIntersecting
      start()
    },
    { rootMargin: '100px' }
  )
  io.observe(el)
  document.addEventListener('visibilitychange', onVisibility)
  reducedMotion.addEventListener('change', invalidate)

  return {
    invalidate,
    destroy: () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
      reducedMotion.removeEventListener('change', invalidate)
    }
  }
}
