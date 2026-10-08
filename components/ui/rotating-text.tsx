import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import {
  motion,
  AnimatePresence,
  Transition,
  type VariantLabels,
  type Target,
  type TargetAndTransition,
} from 'motion/react'

function cn(...classes: (string | undefined | null | boolean)[]): string {
  return classes.filter(Boolean).join(' ')
}

function splitText(
  text: string,
  splitBy: string
): { characters: string[]; needsSpace: boolean }[] {
  if (!text) return []

  const splitIntoCharacters = (value: string): string[] => {
    if (typeof Intl !== 'undefined' && Intl.Segmenter) {
      const segmenter = new Intl.Segmenter('en', { granularity: 'grapheme' })
      return Array.from(segmenter.segment(value), segment => segment.segment)
    }
    return Array.from(value)
  }

  if (splitBy === 'characters') {
    const words = text.split(' ')
    return words.map((word, i) => ({
      characters: splitIntoCharacters(word),
      needsSpace: i !== words.length - 1,
    }))
  }
  if (splitBy === 'words') {
    return text.split(' ').map((word, i, arr) => ({
      characters: [word],
      needsSpace: i !== arr.length - 1,
    }))
  }
  if (splitBy === 'lines') {
    return text.split('\n').map((line, i, arr) => ({
      characters: [line],
      needsSpace: i !== arr.length - 1,
    }))
  }

  return text.split(splitBy).map((part, i, arr) => ({
    characters: [part],
    needsSpace: i !== arr.length - 1,
  }))
}

export interface RotatingTextRef {
  next: () => void
  previous: () => void
  jumpTo: (index: number) => void
  reset: () => void
}

export interface RotatingTextProps extends Omit<
  React.ComponentPropsWithoutRef<typeof motion.span>,
  'children' | 'transition' | 'initial' | 'animate' | 'exit'
> {
  texts: string[]
  transition?: Transition
  initial?: boolean | Target | VariantLabels
  animate?: boolean | VariantLabels | TargetAndTransition
  exit?: Target | VariantLabels
  animatePresenceMode?: 'sync' | 'wait'
  animatePresenceInitial?: boolean
  rotationInterval?: number
  /** Pause (ms) after exit finishes, while the container resizes, before the next text enters. */
  resizeDelay?: number
  staggerDuration?: number
  staggerFrom?: 'first' | 'last' | 'center' | 'random' | number
  loop?: boolean
  auto?: boolean
  splitBy?: string
  onNext?: (index: number) => void
  mainClassName?: string
  splitLevelClassName?: string
  elementLevelClassName?: string
}

const RotatingText = forwardRef<RotatingTextRef, RotatingTextProps>(
  (
    {
      texts,
      transition = { type: 'spring', damping: 25, stiffness: 300 },
      initial = { y: '100%', opacity: 0 },
      animate = { y: 0, opacity: 1 },
      exit = { y: '-120%', opacity: 0 },
      animatePresenceMode = 'wait',
      animatePresenceInitial = false,
      rotationInterval = 2000,
      resizeDelay = 280,
      staggerDuration = 0,
      staggerFrom = 'first',
      loop = true,
      auto = true,
      splitBy = 'characters',
      onNext,
      mainClassName,
      splitLevelClassName,
      elementLevelClassName,
      ...rest
    },
    ref
  ) => {
    // Index of the phrase currently shown (or last shown while exiting).
    const [displayIndex, setDisplayIndex] = useState(0)
    // Index used to measure/animate container width — lags until after exit.
    const [widthIndex, setWidthIndex] = useState(0)
    // Controls AnimatePresence presence so enter can wait for resize.
    const [isTextVisible, setIsTextVisible] = useState(true)

    const containerRef = useRef<HTMLSpanElement>(null)
    // Unconstrained sizer — never affected by the animated container width.
    const sizerRef = useRef<HTMLSpanElement>(null)
    const pendingIndexRef = useRef(0)
    const isTransitioningRef = useRef(false)
    const resizeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    const targetWidthRef = useRef<number | null>(null)

    const [width, setWidth] = useState<number | 'auto'>('auto')
    // minHeight (not fixed height) — tracks responsive metrics, holds space mid-swap.
    const [minHeight, setMinHeight] = useState<number | undefined>(undefined)

    const displayElements = useMemo(
      () => splitText(texts[displayIndex] ?? '', splitBy),
      [texts, displayIndex, splitBy]
    )

    const widthElements = useMemo(
      () => splitText(texts[widthIndex] ?? '', splitBy),
      [texts, widthIndex, splitBy]
    )

    const getStaggerDelay = useCallback(
      (index: number, totalChars: number): number => {
        const total = totalChars
        if (staggerFrom === 'first') return index * staggerDuration
        if (staggerFrom === 'last') return (total - 1 - index) * staggerDuration
        if (staggerFrom === 'center') {
          const center = Math.floor(total / 2)
          return Math.abs(center - index) * staggerDuration
        }
        if (staggerFrom === 'random') {
          const randomIndex = Math.floor(Math.random() * total)
          return Math.abs(randomIndex - index) * staggerDuration
        }
        return Math.abs((staggerFrom as number) - index) * staggerDuration
      },
      [staggerFrom, staggerDuration]
    )

    const resolveIndex = useCallback(
      (index: number) => {
        if (texts.length === 0) return 0
        return Math.max(0, Math.min(index, texts.length - 1))
      },
      [texts.length]
    )

    const beginTransitionTo = useCallback(
      (newIndex: number) => {
        if (texts.length === 0) return
        const target = resolveIndex(newIndex)
        if (target === displayIndex && isTextVisible) return
        if (isTransitioningRef.current) return

        isTransitioningRef.current = true
        pendingIndexRef.current = target
        // Exit current text first; keep width at the old size until exit finishes.
        setIsTextVisible(false)
      },
      [texts.length, resolveIndex, displayIndex, isTextVisible]
    )

    const next = useCallback(() => {
      if (texts.length === 0) return
      const nextIndex =
        displayIndex === texts.length - 1
          ? loop
            ? 0
            : displayIndex
          : displayIndex + 1
      if (nextIndex !== displayIndex) {
        beginTransitionTo(nextIndex)
      }
    }, [displayIndex, texts.length, loop, beginTransitionTo])

    const previous = useCallback(() => {
      if (texts.length === 0) return
      const prevIndex =
        displayIndex === 0
          ? loop
            ? texts.length - 1
            : displayIndex
          : displayIndex - 1
      if (prevIndex !== displayIndex) {
        beginTransitionTo(prevIndex)
      }
    }, [displayIndex, texts.length, loop, beginTransitionTo])

    const jumpTo = useCallback(
      (index: number) => {
        beginTransitionTo(index)
      },
      [beginTransitionTo]
    )

    const reset = useCallback(() => {
      beginTransitionTo(0)
    }, [beginTransitionTo])

    // Clamp during render when texts shrinks
    if (texts.length > 0 && displayIndex >= texts.length) {
      setDisplayIndex(texts.length - 1)
      setWidthIndex(texts.length - 1)
    }

    useImperativeHandle(
      ref,
      () => ({
        next,
        previous,
        jumpTo,
        reset,
      }),
      [next, previous, jumpTo, reset]
    )

    useEffect(() => {
      if (!auto || texts.length === 0) return
      const intervalId = setInterval(next, rotationInterval)
      return () => clearInterval(intervalId)
    }, [next, rotationInterval, auto, texts.length])

    useEffect(() => {
      return () => {
        if (resizeTimeoutRef.current) {
          clearTimeout(resizeTimeoutRef.current)
        }
      }
    }, [])

    // Measure from an unconstrained off-flow sizer so animated container width
    // never feeds back into the measurement (which breaks the spring).
    useLayoutEffect(() => {
      const sizer = sizerRef.current
      const container = containerRef.current
      if (!sizer || !container) return

      const measure = () => {
        const styles = getComputedStyle(container)
        const horizontalPadding =
          (parseFloat(styles.paddingLeft) || 0) +
          (parseFloat(styles.paddingRight) || 0)
        const verticalPadding =
          (parseFloat(styles.paddingTop) || 0) +
          (parseFloat(styles.paddingBottom) || 0)
        const horizontalBorder =
          (parseFloat(styles.borderLeftWidth) || 0) +
          (parseFloat(styles.borderRightWidth) || 0)
        const verticalBorder =
          (parseFloat(styles.borderTopWidth) || 0) +
          (parseFloat(styles.borderBottomWidth) || 0)

        const contentWidth = Math.max(sizer.scrollWidth, sizer.offsetWidth)
        const contentHeight = Math.max(sizer.scrollHeight, sizer.offsetHeight)
        const nextWidth = contentWidth + horizontalPadding + horizontalBorder
        const nextMinHeight = contentHeight + verticalPadding + verticalBorder

        setMinHeight(nextMinHeight)

        // Only commit a new width target when it actually changes — avoids
        // ResizeObserver / layout thrash restarting the spring mid-animation.
        if (
          targetWidthRef.current === null ||
          Math.abs(targetWidthRef.current - nextWidth) > 0.5
        ) {
          targetWidthRef.current = nextWidth
          setWidth(nextWidth)
        }
      }

      measure()

      if (typeof ResizeObserver === 'undefined') {
        window.addEventListener('resize', measure)
        return () => window.removeEventListener('resize', measure)
      }

      // Observe only the unconstrained sizer — never the animating container.
      const observer = new ResizeObserver(measure)
      observer.observe(sizer)
      return () => observer.disconnect()
    }, [widthIndex, widthElements])

    const handleExitComplete = useCallback(() => {
      const target = pendingIndexRef.current
      setDisplayIndex(target)
      // Start container resize only after the previous word has fully left.
      setWidthIndex(target)
      onNext?.(target)

      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current)
      }

      // Hold empty while the pill resizes, then bring the next word in.
      resizeTimeoutRef.current = setTimeout(() => {
        setIsTextVisible(true)
        isTransitioningRef.current = false
        resizeTimeoutRef.current = null
      }, resizeDelay)
    }, [onNext, resizeDelay])

    const totalChars = useMemo(
      () =>
        displayElements.reduce((sum, word) => sum + word.characters.length, 0),
      [displayElements]
    )

    const renderStaticWords = (
      elements: { characters: string[]; needsSpace: boolean }[],
      keyPrefix: string
    ): React.ReactNode =>
      elements.map((wordObj, wordIndex) => (
        <span
          key={`${keyPrefix}-word-${wordIndex}`}
          className={cn('inline-flex', splitLevelClassName)}
        >
          {wordObj.characters.map((char, charIndex) => (
            <span
              key={`${keyPrefix}-char-${charIndex}`}
              className={cn('inline-block', elementLevelClassName)}
            >
              {char}
            </span>
          ))}
          {wordObj.needsSpace && <span className='whitespace-pre'> </span>}
        </span>
      ))

    return (
      <motion.span
        ref={containerRef}
        className={cn(
          // align-top: avoid baseline jumps when content exits.
          'relative inline-flex max-w-full flex-nowrap items-center align-top whitespace-nowrap',
          mainClassName
        )}
        {...rest}
        initial={false}
        style={{
          ...(typeof rest.style === 'object' && rest.style ? rest.style : {}),
          // minHeight (not height) keeps space mid-swap and still follows
          // responsive font/padding when remeasured.
          minHeight,
        }}
        animate={{ width }}
        transition={transition}
      >
        <span className='sr-only'>{texts[displayIndex] ?? ''}</span>

        {/*
          Unconstrained measure layer: absolute + w-max so parent width
          animation cannot clip/feed back into scrollWidth.
        */}
        <span
          ref={sizerRef}
          aria-hidden='true'
          className={cn(
            'pointer-events-none invisible absolute top-0 left-0 w-max',
            splitBy === 'lines'
              ? 'flex flex-col'
              : 'inline-flex flex-nowrap whitespace-nowrap'
          )}
        >
          {renderStaticWords(widthElements, 'sizer')}
        </span>

        <AnimatePresence
          mode={animatePresenceMode}
          initial={animatePresenceInitial}
          onExitComplete={handleExitComplete}
        >
          {isTextVisible && (
            <motion.span
              key={displayIndex}
              className={cn(
                splitBy === 'lines'
                  ? 'flex w-full flex-col'
                  : 'relative inline-flex flex-nowrap whitespace-nowrap'
              )}
              aria-hidden='true'
            >
              {displayElements.map((wordObj, wordIndex) => {
                const previousCharsCount = displayElements
                  .slice(0, wordIndex)
                  .reduce((sum, word) => sum + word.characters.length, 0)

                return (
                  <span
                    key={wordIndex}
                    className={cn('inline-flex', splitLevelClassName)}
                  >
                    {wordObj.characters.map((char, charIndex) => (
                      <motion.span
                        key={charIndex}
                        initial={initial}
                        animate={animate}
                        exit={exit}
                        transition={{
                          ...transition,
                          delay: getStaggerDelay(
                            previousCharsCount + charIndex,
                            totalChars
                          ),
                        }}
                        className={cn('inline-block', elementLevelClassName)}
                      >
                        {char}
                      </motion.span>
                    ))}
                    {wordObj.needsSpace && (
                      <span className='whitespace-pre'> </span>
                    )}
                  </span>
                )
              })}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.span>
    )
  }
)

RotatingText.displayName = 'RotatingText'
export default RotatingText
