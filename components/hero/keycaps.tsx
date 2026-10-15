'use client'

import { ContactShadows, Environment, Lightformer, RoundedBox } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import { useTheme } from 'next-themes'
import { useEffect, useEffectEvent, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'
import { EMAIL } from '@/components/contact/contact-button'
import { RESUME_URL } from '@/components/contact/resume-button'

const GITHUB_URL = 'https://github.com/sepehrgr'

// lucide icon paths (24×24 grid)
const ICONS: Record<string, string[]> = {
  moon: ['M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z'],
  sun: ['M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z', 'M12 2v2', 'M12 20v2', 'm4.93 4.93 1.41 1.41', 'm17.66 17.66 1.41 1.41', 'M2 12h2', 'M20 12h2', 'm6.34 17.66-1.41 1.41', 'm19.07 4.93-1.41 1.41'],
  mail: ['M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z', 'm22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7'],
  check: ['M20 6 9 17l-5-5'],
  file: ['M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z', 'M14 2v4a2 2 0 0 0 2 2h4', 'M10 9H8', 'M16 13H8', 'M16 17H8'],
  github: ['M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4', 'M9 18c-4.51 2-5-2-7-2'],
}

type Palette = { dark: boolean; ink: string; paper: string; accent: string; metal: string }
type KeyId = 'theme' | 'email' | 'resume' | 'github'
type KeyDef = { id: KeyId; icon: string; label: string; letter: string; tone: 'ink' | 'paper' | 'accent'; a11y: string }

const KEY = 1.35
const GAP = 0.18
const KEY_H = 0.62

function usePalette(): Palette {
  const dark = useTheme().resolvedTheme === 'dark'
  return dark
    ? { dark, ink: '#f1efea', paper: '#2a2a2e', accent: '#8b7cff', metal: '#3a3a3d' }
    : { dark, ink: '#111111', paper: '#ffffff', accent: '#6c5cf2', metal: '#d9d6cf' }
}

/** A keycap: a rounded box whose top tapers in, like a real cap. */
function keycapGeometry(): THREE.BufferGeometry {
  const g = new RoundedBoxGeometry(KEY, KEY_H, KEY, 5, 0.16)
  const pos = g.attributes.position!
  for (let i = 0; i < pos.count; i++) {
    const y = pos.getY(i)
    if (y > 0) {
      const f = 1 - 0.16 * (y / (KEY_H / 2))
      pos.setX(i, pos.getX(i) * f)
      pos.setZ(i, pos.getZ(i) * f)
    }
  }
  g.computeVertexNormals()
  return g
}

/** The printed top of a key: icon, label, and its keyboard letter in the corner. */
function legendTexture(def: KeyDef, flash: boolean, color: string, font: string): THREE.CanvasTexture {
  const c = document.createElement('canvas')
  c.width = c.height = 256
  const ctx = c.getContext('2d')!
  ctx.strokeStyle = ctx.fillStyle = color
  ctx.lineCap = ctx.lineJoin = 'round'
  ctx.save()
  ctx.translate(128 - 42, 58)
  ctx.scale(3.5, 3.5)
  ctx.lineWidth = 2
  for (const d of ICONS[flash ? 'check' : def.icon] ?? []) ctx.stroke(new Path2D(d))
  ctx.restore()
  ctx.textAlign = 'center'
  ctx.textBaseline = 'alphabetic'
  ctx.font = `600 34px ${font}`
  ctx.fillText(flash ? 'Copied' : def.label, 128, 216)
  // keyboard shortcut chip
  ctx.globalAlpha = 0.55
  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.roundRect(10, 10, 46, 46, 10)
  ctx.stroke()
  ctx.font = `600 26px ${font}`
  ctx.textBaseline = 'middle'
  ctx.fillText(def.letter.toUpperCase(), 33, 35)
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  t.anisotropy = 8
  return t
}

let audio: AudioContext | null = null
/** A short, low "thock": filtered noise with a fast decay. */
function thock(up: boolean): void {
  try {
    audio ??= new AudioContext()
    const ctx = audio
    const len = Math.floor(ctx.sampleRate * 0.05)
    const buf = ctx.createBuffer(1, len, ctx.sampleRate)
    const data = buf.getChannelData(0)
    for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / len) ** 4
    const src = ctx.createBufferSource()
    src.buffer = buf
    const filter = ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.value = up ? 2600 : 1300
    const gain = ctx.createGain()
    gain.gain.value = up ? 0.12 : 0.22
    src.connect(filter).connect(gain).connect(ctx.destination)
    src.start()
  } catch {}
}

/** Soft area lights, no HDR download. */
function Studio(): ReactNode {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[4, 6, 5]} intensity={1.4} />
      <Environment resolution={256}>
        <group rotation={[-Math.PI / 3, 0, 1]}>
          <Lightformer form='circle' intensity={4} rotation-x={Math.PI / 2} position={[0, 5, -9]} scale={2} />
          <Lightformer form='circle' intensity={2} rotation-y={Math.PI / 2} position={[-5, 1, -1]} scale={2} />
          <Lightformer form='circle' intensity={2} rotation-y={Math.PI / 2} position={[-5, -1, -1]} scale={2} />
          <Lightformer form='circle' intensity={2} rotation-y={-Math.PI / 2} position={[10, 1, 0]} scale={8} />
          <Lightformer form='ring' color='#8b7cff' intensity={1.5} onUpdate={self => self.lookAt(0, 0, 0)} position={[10, 10, 0]} scale={10} />
        </group>
      </Environment>
    </>
  )
}

function Key({ def, index, palette, font, pressed, flash, onPress }: { def: KeyDef; index: number; palette: Palette; font: string; pressed: boolean; flash: boolean; onPress: (down: boolean) => void }): ReactNode {
  const cap = useRef<THREE.Group>(null)
  const sim = useRef({ y: 0, v: 0 })
  const geometry = useMemo(() => keycapGeometry(), [])
  const color = palette[def.tone]
  const legendColor = def.tone === 'paper' ? (palette.dark ? '#f1efea' : '#111111') : def.tone === 'ink' ? (palette.dark ? '#111111' : '#f7f6f2') : '#ffffff'
  const legend = useMemo(() => (font ? legendTexture(def, flash, legendColor, font) : null), [def, flash, legendColor, font])
  const x = ((index % 2) - 0.5) * (KEY + GAP)
  const z = (Math.floor(index / 2) - 0.5) * (KEY + GAP)

  useFrame((_, dt) => {
    const s = sim.current
    const step = Math.min(dt, 1 / 30)
    s.v += (-900 * (s.y - (pressed ? -0.17 : 0)) - 32 * s.v) * step
    s.y += s.v * step
    if (cap.current) cap.current.position.y = 0.25 + KEY_H / 2 + s.y
  })

  return (
    <group
      ref={cap}
      position={[x, 0.25 + KEY_H / 2, z]}
      onPointerDown={e => {
        e.stopPropagation()
        ;(e.target as Element).setPointerCapture(e.pointerId)
        onPress(true)
      }}
      onPointerUp={e => {
        ;(e.target as Element).releasePointerCapture(e.pointerId)
        onPress(false)
      }}
      onPointerOver={() => (document.body.style.cursor = 'pointer')}
      onPointerOut={() => (document.body.style.cursor = '')}
    >
      <mesh geometry={geometry}>
        <meshPhysicalMaterial color={color} roughness={0.42} clearcoat={0.5} clearcoatRoughness={0.4} />
      </mesh>
      {legend && (
        <mesh position={[0, KEY_H / 2 + 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[KEY * 0.72, KEY * 0.72]} />
          <meshBasicMaterial map={legend} transparent toneMapped={false} />
        </mesh>
      )}
    </group>
  )
}

function Board({ keys, palette, font, pressed, copied, press }: { keys: KeyDef[]; palette: Palette; font: string; pressed: KeyId | null; copied: boolean; press: (id: KeyId, down: boolean) => void }): ReactNode {
  const board = useRef<THREE.Group>(null)
  // tilt a little toward the cursor; not on touch, where a finger drag means scroll
  const still = useMemo(() => window.matchMedia('(prefers-reduced-motion: reduce), (hover: none)').matches, [])
  useFrame(({ pointer }, dt) => {
    if (!board.current || still) return
    const r = board.current.rotation
    r.x += (pointer.y * 0.12 - r.x) * Math.min(1, dt * 4)
    r.y += (pointer.x * 0.2 - r.y) * Math.min(1, dt * 4)
  })
  const width = 2 * KEY + GAP + 0.5
  return (
    <group ref={board}>
      <RoundedBox args={[width, 0.5, width]} radius={0.24} smoothness={4}>
        <meshPhysicalMaterial color={palette.metal} roughness={0.3} metalness={0.4} clearcoat={0.3} />
      </RoundedBox>
      {keys.map((def, i) => (
        <Key key={def.id} def={def} index={i} palette={palette} font={font} pressed={pressed === def.id} flash={def.id === 'email' && copied} onPress={down => press(def.id, down)} />
      ))}
    </group>
  )
}

/**
 * Four big 3D keycaps that do things: switch theme, copy the email, open the
 * résumé and GitHub. Each also answers to a letter key (T, E, R, G).
 */
export function Keycaps(): ReactNode {
  const palette = usePalette()
  const { setTheme } = useTheme()
  const boxRef = useRef<HTMLDivElement>(null)
  const pressedRef = useRef<KeyId | null>(null)
  const [pressed, setPressed] = useState<KeyId | null>(null)
  const [copied, setCopied] = useState(false)
  const [font, setFont] = useState('')
  const [onScreen, setOnScreen] = useState(true)

  useEffect(() => {
    const family = getComputedStyle(document.body).fontFamily
    document.fonts.load(`600 32px ${family}`).finally(() => setFont(family))
  }, [])

  // render only while visible
  useEffect(() => {
    const el = boxRef.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setOnScreen(!!e?.isIntersecting))
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const keys = useMemo<KeyDef[]>(
    () => [
      palette.dark
        ? { id: 'theme', icon: 'sun', label: 'Light', letter: 't', tone: 'ink', a11y: 'Switch to light theme' }
        : { id: 'theme', icon: 'moon', label: 'Dark', letter: 't', tone: 'ink', a11y: 'Switch to dark theme' },
      { id: 'email', icon: 'mail', label: 'Email', letter: 'e', tone: 'paper', a11y: `Copy ${EMAIL}` },
      { id: 'resume', icon: 'file', label: 'Résumé', letter: 'r', tone: 'accent', a11y: 'Open résumé (PDF, new tab)' },
      { id: 'github', icon: 'github', label: 'GitHub', letter: 'g', tone: 'paper', a11y: 'Open GitHub (new tab)' },
    ],
    [palette.dark]
  )

  const run = (id: KeyId): void => {
    if (id === 'theme') setTheme(palette.dark ? 'light' : 'dark')
    if (id === 'email') {
      navigator.clipboard?.writeText(EMAIL).then(() => {
        setCopied(true)
        window.setTimeout(() => setCopied(false), 1600)
      })
    }
    if (id === 'resume') window.open(RESUME_URL, '_blank', 'noopener,noreferrer')
    if (id === 'github') window.open(GITHUB_URL, '_blank', 'noopener,noreferrer')
  }

  const press = (id: KeyId, down: boolean): void => {
    thock(!down)
    if (down) {
      pressedRef.current = id
      setPressed(id)
    } else if (pressedRef.current === id) {
      pressedRef.current = null
      setPressed(null)
      run(id)
    }
  }

  const release = (): void => {
    pressedRef.current = null
    setPressed(null)
  }

  // the keyboard listener always calls the latest press()
  const pressFromKeyboard = useEffectEvent(press)

  useEffect(() => {
    if (!onScreen) return
    const find = (e: KeyboardEvent): KeyDef | undefined => {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      const t = e.target as HTMLElement | null
      if (t?.closest('input, textarea, select, [contenteditable="true"]')) return
      return keys.find(k => k.letter === e.key.toLowerCase())
    }
    const onDown = (e: KeyboardEvent): void => {
      const k = find(e)
      if (!k || e.repeat) return
      e.preventDefault()
      pressFromKeyboard(k.id, true)
    }
    const onUp = (e: KeyboardEvent): void => {
      const k = find(e)
      if (k) pressFromKeyboard(k.id, false)
    }
    window.addEventListener('keydown', onDown)
    window.addEventListener('keyup', onUp)
    return () => {
      window.removeEventListener('keydown', onDown)
      window.removeEventListener('keyup', onUp)
    }
  }, [keys, onScreen])

  return (
    <div ref={boxRef} className='flex w-full flex-col items-center gap-2'>
      <div
        // vertical swipes scroll the page; a swipe that starts on a key cancels its press
        className='relative aspect-square w-full touch-pan-y'
        onPointerLeave={release}
        onPointerCancel={release}
      >
        <Canvas
          frameloop={onScreen ? 'always' : 'never'}
          // measure layout size: the hero's scale-in would otherwise freeze a too-small canvas
          resize={{ offsetSize: true }}
          camera={{ position: [0, 5.8, 5], fov: 34 }}
          onCreated={({ camera }) => camera.lookAt(0, 0.2, 0)}
          dpr={[1, 2]}
          gl={{ alpha: true, antialias: true }}
          aria-hidden='true'
        >
          <Studio />
          <Board keys={keys} palette={palette} font={font} pressed={pressed} copied={copied} press={press} />
          <ContactShadows position={[0, -0.26, 0]} opacity={palette.dark ? 0.7 : 0.4} scale={7} blur={2.4} far={2} />
        </Canvas>
      </div>

      {/* shortcut hint, only where there's likely a keyboard */}
      <p className='text-foreground/65 relative -mt-[14%] hidden items-center gap-1.5 text-sm [@media(hover:hover)]:flex'>
        Press
        {keys.map(k => (
          <kbd
            key={k.id}
            className='border-foreground/15 bg-background/60 text-foreground inline-flex h-6 min-w-6 items-center justify-center rounded-md border px-1.5 font-sans text-xs font-semibold shadow-[0_1px_0_rgb(0_0_0/0.08)]'
          >
            {k.letter.toUpperCase()}
          </kbd>
        ))}
        or click a key
      </p>

      {/* the same actions for keyboard and screen-reader users; shown once tabbed into */}
      <div className='sr-only focus-within:not-sr-only focus-within:flex focus-within:flex-wrap focus-within:justify-center focus-within:gap-2'>
        {keys.map(k => (
          <button
            key={k.id}
            type='button'
            aria-keyshortcuts={k.letter.toUpperCase()}
            onClick={() => run(k.id)}
            className='focus-ring border-foreground/15 bg-background text-foreground rounded-lg border px-3 py-1.5 text-sm font-medium'
          >
            {k.a11y}
          </button>
        ))}
        <span role='status' className='sr-only'>
          {copied ? 'Email copied' : ''}
        </span>
      </div>
    </div>
  )
}
