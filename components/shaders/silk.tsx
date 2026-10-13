'use client'

import { Mesh, Program, Renderer, Transform, Triangle } from 'ogl'
import { useEffect, useRef, type ReactNode } from 'react'

import { createRenderLoop } from '@/lib/render-loop'

const hexToNormalizedRGB = (hex: string): [number, number, number] => {
  const clean = hex.replace('#', '')
  const r = parseInt(clean.slice(0, 2), 16) / 255
  const g = parseInt(clean.slice(2, 4), 16) / 255
  const b = parseInt(clean.slice(4, 6), 16) / 255
  return [r, g, b]
}

const vertexShader = `
attribute vec2 position;
varying vec2 vUv;

void main() {
  vUv = position * 0.5 + 0.5;
  gl_Position = vec4(position, 0.0, 1.0);
}
`

const fragmentShader = `
precision highp float;

varying vec2 vUv;

uniform float uTime;
uniform vec3  uColor;
uniform float uSpeed;
uniform float uScale;
uniform float uRotation;
uniform float uNoiseIntensity;

const float e = 2.71828182845904523536;

float noise(vec2 texCoord) {
  float G = e;
  vec2  r = (G * sin(G * texCoord));
  return fract(r.x * r.y * (1.0 + texCoord.x));
}

vec2 rotateUvs(vec2 uv, float angle) {
  float c = cos(angle);
  float s = sin(angle);
  mat2  rot = mat2(c, -s, s, c);
  return rot * uv;
}

void main() {
  float rnd        = noise(gl_FragCoord.xy);
  vec2  uv         = rotateUvs(vUv * uScale, uRotation);
  vec2  tex        = uv * uScale;
  float tOffset    = uSpeed * uTime;

  tex.y += 0.03 * sin(8.0 * tex.x - tOffset);

  float pattern = 0.6 +
                  0.4 * sin(5.0 * (tex.x + tex.y +
                                   cos(3.0 * tex.x + 5.0 * tex.y) +
                                   0.02 * tOffset) +
                           sin(20.0 * (tex.x + tex.y - 0.1 * tOffset)));

  vec4 col = vec4(uColor, 1.0) * vec4(pattern) - rnd / 15.0 * uNoiseIntensity;
  col.a = 1.0;
  gl_FragColor = col;
}
`

export interface SilkProps {
  speed?: number
  scale?: number
  color?: string
  noiseIntensity?: number
  rotation?: number
}

export default function Silk({
  speed = 5,
  scale = 1,
  color = '#7B7481',
  noiseIntensity = 1.5,
  rotation = 0
}: SilkProps): ReactNode {
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // DPR up to 2 keeps the per-pixel grain as fine as before on retina screens
    const renderer = new Renderer({
      dpr: Math.min(window.devicePixelRatio || 1, 2),
      alpha: false,
      antialias: false
    })
    const gl = renderer.gl
    gl.canvas.style.display = 'block'
    el.appendChild(gl.canvas)

    const program = new Program(gl, {
      vertex: vertexShader,
      fragment: fragmentShader,
      uniforms: {
        uSpeed: { value: speed },
        uScale: { value: scale },
        uNoiseIntensity: { value: noiseIntensity },
        uColor: { value: hexToNormalizedRGB(color) },
        uRotation: { value: rotation },
        uTime: { value: 0 }
      }
    })
    const scene = new Transform()
    new Mesh(gl, { geometry: new Triangle(gl), program }).setParent(scene)

    const loop = createRenderLoop(el, seconds => {
      // Matches the old r3f timing: uTime advanced by 0.1 * delta per frame
      program.uniforms.uTime.value = 0.1 * seconds
      renderer.render({ scene })
    })

    const resize = (): void => {
      renderer.setSize(el.clientWidth, el.clientHeight)
      loop.invalidate()
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(el)

    return () => {
      loop.destroy()
      ro.disconnect()
      if (gl.canvas.parentElement === el) el.removeChild(gl.canvas)
      gl.getExtension('WEBGL_lose_context')?.loseContext()
    }
  }, [speed, scale, color, noiseIntensity, rotation])

  return <div ref={ref} aria-hidden='true' className='h-full w-full' />
}
