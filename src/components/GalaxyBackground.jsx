import React, { useEffect, useRef } from 'react';
import './GalaxyBackground.css';

const GalaxyBackground = () => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const glRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    // Tuned up from the reference demo's values: measured against the finished
    // page, the demo settings lit only ~1% of pixels at an average brightness of
    // 0.8/765, which read as a black screen behind the panel scrim.
    let opts = {
      focal: [0.5, 0.5],
      rotation: [1, 0],
      starSpeed: 0.5,
      density: 1.1,
      hueShift: 140,
      speed: 1,
      glowIntensity: 0.34,
      saturation: 0.4,
      repulsionStrength: 1.6,
      twinkleIntensity: 0.3,
      rotationSpeed: 0.08,
      autoCenterRepulsion: 0,
    };

    let gl =
      canvas.getContext('webgl', {
        alpha: true,
        antialias: false,
        premultipliedAlpha: false,
      }) ||
      canvas.getContext('experimental-webgl', {
        alpha: true,
        antialias: false,
        premultipliedAlpha: false,
      });

    // A lost context is not null — every call on it just fails silently. Guard
    // explicitly so the failure is visible instead of a blank background.
    if (!gl) return;
    if (gl.isContextLost?.()) {
      console.warn('[GalaxyBackground] WebGL context is lost; skipping init.');
      return;
    }
    glRef.current = gl;

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.clearColor(0, 0, 0, 0);

    const vertexSrc = `
attribute vec2 uv;
attribute vec2 position;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

    const fragmentSrc = `
precision mediump float;

uniform float uTime;
uniform vec3 uResolution;
uniform vec2 uFocal;
uniform vec2 uRotation;
uniform float uStarSpeed;
uniform float uDensity;
uniform float uHueShift;
uniform float uSpeed;
uniform vec2 uMouse;
uniform float uGlowIntensity;
uniform float uSaturation;
uniform bool uMouseRepulsion;
uniform float uTwinkleIntensity;
uniform float uRotationSpeed;
uniform float uRepulsionStrength;
uniform float uMouseActiveFactor;
uniform float uAutoCenterRepulsion;
uniform bool uTransparent;

varying vec2 vUv;

#define NUM_LAYER 2.0
#define STAR_COLOR_CUTOFF 0.2
#define MAT45 mat2(0.7071, -0.7071, 0.7071, 0.7071)
#define PERIOD 3.0

float Hash21(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float tri(float x) {
  return abs(fract(x) * 2.0 - 1.0);
}

float tris(float x) {
  float t = fract(x);
  return 1.0 - smoothstep(0.0, 1.0, abs(2.0 * t - 1.0));
}

float trisn(float x) {
  float t = fract(x);
  return 2.0 * (1.0 - smoothstep(0.0, 1.0, abs(2.0 * t - 1.0))) - 1.0;
}

vec3 hsv2rgb(vec3 c) {
  vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

float Star(vec2 uv, float flare) {
  float d = length(uv);
  float m = (0.05 * uGlowIntensity) / max(d, 1e-4);
  float rays = smoothstep(0.0, 1.0, 1.0 - abs(uv.x * uv.y * 800.0));
  m += rays * flare * uGlowIntensity;
  uv *= MAT45;
  rays = smoothstep(0.0, 1.0, 1.0 - abs(uv.x * uv.y * 800.0));
  m += rays * 0.25 * flare * uGlowIntensity;
  m *= smoothstep(1.0, 0.2, d);
  return m;
}

vec3 StarLayer(vec2 uv) {
  vec3 col = vec3(0.0);

  vec2 gv = fract(uv) - 0.5;
  vec2 id = floor(uv);

  for (int y = -1; y <= 1; y++) {
    for (int x = -1; x <= 1; x++) {
      vec2 offset = vec2(float(x), float(y));
      vec2 si = id + vec2(float(x), float(y));
      float seed = Hash21(si);
      float size = fract(seed * 345.32);
      float glossLocal = tri(uStarSpeed / (PERIOD * seed + 1.0));
      float flareSize = smoothstep(0.9, 1.0, size) * glossLocal;

      float red = smoothstep(STAR_COLOR_CUTOFF, 1.0, Hash21(si + 1.0)) + STAR_COLOR_CUTOFF;
      float blu = smoothstep(STAR_COLOR_CUTOFF, 1.0, Hash21(si + 3.0)) + STAR_COLOR_CUTOFF;
      float grn = min(red, blu) * seed;
      vec3 base = vec3(red, grn, blu);

      float hue = atan(base.g - base.r, base.b - base.r) / (2.0 * 3.14159) + 0.5;
      hue = fract(hue + uHueShift / 360.0);
      float sat = length(base - vec3(dot(base, vec3(0.299, 0.587, 0.114)))) * uSaturation;
      float val = max(max(base.r, base.g), base.b);
      base = hsv2rgb(vec3(hue, sat, val));

      vec2 pad = vec2(tris(seed * 34.0 + uTime * uSpeed / 10.0), tris(seed * 38.0 + uTime * uSpeed / 30.0)) - 0.5;

      float star = Star(gv - offset - pad, flareSize);
      vec3 color = base;

      float twinkle = trisn(uTime * uSpeed + seed * 6.2831) * 0.5 + 1.0;
      twinkle = mix(1.0, twinkle, uTwinkleIntensity);
      star *= twinkle;

      col += star * size * color;
    }
  }

  return col;
}

void main() {
  vec2 focalPx = uFocal * uResolution.xy;
  vec2 uv = (vUv * uResolution.xy - focalPx) / uResolution.y;

  vec2 mouseNorm = uMouse - vec2(0.5);

  if (uAutoCenterRepulsion > 0.0) {
    vec2 centerUV = vec2(0.0, 0.0);
    float centerDist = length(uv - centerUV);
    vec2 repulsion = normalize(uv - centerUV) * (uAutoCenterRepulsion / (centerDist + 0.1));
    uv += repulsion * 0.05;
  } else if (uMouseRepulsion) {
    vec2 mousePosUV = (uMouse * uResolution.xy - focalPx) / uResolution.y;
    float mouseDist = length(uv - mousePosUV);
    vec2 repulsion = normalize(uv - mousePosUV) * (uRepulsionStrength / (mouseDist + 0.1));
    uv += repulsion * 0.05 * uMouseActiveFactor;
  } else {
    vec2 mouseOffset = mouseNorm * 0.1 * uMouseActiveFactor;
    uv += mouseOffset;
  }

  float autoRotAngle = uTime * uRotationSpeed;
  mat2 autoRot = mat2(cos(autoRotAngle), -sin(autoRotAngle), sin(autoRotAngle), cos(autoRotAngle));
  uv = autoRot * uv;

  uv = mat2(uRotation.x, -uRotation.y, uRotation.y, uRotation.x) * uv;

  vec3 col = vec3(0.0);

  for (float i = 0.0; i < 1.0; i += 1.0 / NUM_LAYER) {
    float depth = fract(i + uStarSpeed * uSpeed);
    float scale = mix(20.0 * uDensity, 0.5 * uDensity, depth);
    float fade = depth * smoothstep(1.0, 0.9, depth);
    col += StarLayer(uv * scale + i * 453.32) * fade;
  }

  if (uTransparent) {
    float alpha = length(col);
    alpha = smoothstep(0.0, 0.3, alpha);
    alpha = min(alpha, 1.0);
    gl_FragColor = vec4(col, alpha);
  } else {
    gl_FragColor = vec4(col, 1.0);
  }
}
`;

    function compile(type, src) {
      let sh = gl.createShader(type);
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
        // Never fail silently here: a dead context makes every compile fail,
        // and without this the background just goes blank with no explanation.
        console.warn('[GalaxyBackground] shader failed:', gl.getShaderInfoLog(sh));
        gl.deleteShader(sh);
        return null;
      }
      return sh;
    }

    function link(vs2, fs2) {
      let p = gl.createProgram();
      gl.attachShader(p, vs2);
      gl.attachShader(p, fs2);
      gl.linkProgram(p);
      if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
        console.warn('[GalaxyBackground] program link failed:', gl.getProgramInfoLog(p));
        gl.deleteProgram(p);
        return null;
      }
      return p;
    }

    let vs = compile(gl.VERTEX_SHADER, vertexSrc);
    let fs = compile(gl.FRAGMENT_SHADER, fragmentSrc);
    if (!vs || !fs) return;

    let program = link(vs, fs);
    if (!program) return;

    gl.useProgram(program);

    let posLoc = gl.getAttribLocation(program, 'position');
    let uvLoc = gl.getAttribLocation(program, 'uv');

    let uTimeLoc = gl.getUniformLocation(program, 'uTime');
    let uResolutionLoc = gl.getUniformLocation(program, 'uResolution');
    let uFocalLoc = gl.getUniformLocation(program, 'uFocal');
    let uRotationLoc = gl.getUniformLocation(program, 'uRotation');
    let uStarSpeedLoc = gl.getUniformLocation(program, 'uStarSpeed');
    let uDensityLoc = gl.getUniformLocation(program, 'uDensity');
    let uHueShiftLoc = gl.getUniformLocation(program, 'uHueShift');
    let uSpeedLoc = gl.getUniformLocation(program, 'uSpeed');
    let uMouseLoc = gl.getUniformLocation(program, 'uMouse');
    let uGlowIntensityLoc = gl.getUniformLocation(program, 'uGlowIntensity');
    let uSaturationLoc = gl.getUniformLocation(program, 'uSaturation');
    let uMouseRepulsionLoc = gl.getUniformLocation(program, 'uMouseRepulsion');
    let uTwinkleIntensityLoc = gl.getUniformLocation(program, 'uTwinkleIntensity');
    let uRotationSpeedLoc = gl.getUniformLocation(program, 'uRotationSpeed');
    let uRepulsionStrengthLoc = gl.getUniformLocation(program, 'uRepulsionStrength');
    let uMouseActiveFactorLoc = gl.getUniformLocation(program, 'uMouseActiveFactor');
    let uAutoCenterRepulsionLoc = gl.getUniformLocation(program, 'uAutoCenterRepulsion');
    let uTransparentLoc = gl.getUniformLocation(program, 'uTransparent');

    let posBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW,
    );
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    let uvBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([0, 0, 2, 0, 0, 2]),
      gl.STATIC_DRAW,
    );
    gl.enableVertexAttribArray(uvLoc);
    gl.vertexAttribPointer(uvLoc, 2, gl.FLOAT, false, 0, 0);

    let targetMouse = { x: 0.5, y: 0.5 };
    let smoothMouse = { x: 0.5, y: 0.5 };
    let targetActive = 0;
    let smoothActive = 0;
    let lastT = 0;

    let reqId;

    function resize() {
      let rect = container.getBoundingClientRect();
      // The reference demo renders at dpr 1 — the star field is scale-dependent,
      // so rendering at dpr 2 makes the stars finer and much dimmer than intended.
      let dpr = 1;
      let w = Math.max(1, Math.floor(rect.width * dpr));
      let h = Math.max(1, Math.floor(rect.height * dpr));
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
      gl.uniform3fv(uResolutionLoc, new Float32Array([w, h, w / h]));
    }

    function setUniformsOnce() {
      gl.uniform2fv(uFocalLoc, new Float32Array(opts.focal));
      gl.uniform2fv(uRotationLoc, new Float32Array(opts.rotation));
      gl.uniform1f(uStarSpeedLoc, opts.starSpeed);
      gl.uniform1f(uDensityLoc, opts.density);
      gl.uniform1f(uHueShiftLoc, opts.hueShift);
      gl.uniform1f(uSpeedLoc, opts.speed);
      gl.uniform1f(uGlowIntensityLoc, opts.glowIntensity);
      gl.uniform1f(uSaturationLoc, opts.saturation);
      gl.uniform1i(uMouseRepulsionLoc, 1);
      gl.uniform1f(uTwinkleIntensityLoc, opts.twinkleIntensity);
      gl.uniform1f(uRotationSpeedLoc, opts.rotationSpeed);
      gl.uniform1f(uRepulsionStrengthLoc, opts.repulsionStrength);
      gl.uniform1f(uAutoCenterRepulsionLoc, opts.autoCenterRepulsion);
      gl.uniform1i(uTransparentLoc, 1);
    }

    function handleMouseMove(e) {
      targetMouse.x = e.clientX / window.innerWidth;
      targetMouse.y = 1 - (e.clientY / window.innerHeight);
      targetActive = 1;
    }

    function handleMouseLeave() {
      targetActive = 0;
    }

    // preventDefault here is what makes a lost context restorable at all.
    function handleContextLost(e) {
      e.preventDefault();
      cancelAnimationFrame(reqId);
    }

    resize();
    setUniformsOnce();

    window.addEventListener('resize', resize, false);
    window.addEventListener('mousemove', handleMouseMove);
    // mouseleave does not bubble, so a window listener never sees the pointer
    // leaving the page — document is the element that actually gets the event.
    document.addEventListener('mouseleave', handleMouseLeave);
    canvas.addEventListener('webglcontextlost', handleContextLost, false);

    function loop(t) {
      reqId = requestAnimationFrame(loop);
      if (t - lastT < 42) return;
      lastT = t;
      if (document.hidden) return;

      gl.uniform1f(uTimeLoc, t * 1e-3);
      gl.uniform1f(uStarSpeedLoc, (t * 1e-3 * opts.starSpeed) / 10);

      let k = 0.05;
      smoothMouse.x += (targetMouse.x - smoothMouse.x) * k;
      smoothMouse.y += (targetMouse.y - smoothMouse.y) * k;
      smoothActive += (targetActive - smoothActive) * k;

      gl.uniform2fv(uMouseLoc, new Float32Array([smoothMouse.x, smoothMouse.y]));
      gl.uniform1f(uMouseActiveFactorLoc, smoothActive);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }

    reqId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(reqId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      canvas.removeEventListener('webglcontextlost', handleContextLost);

      // Release the GL objects but leave the context itself alive. Calling
      // WEBGL_lose_context.loseContext() here poisons the canvas: StrictMode
      // remounts, getContext() hands back the same still-lost context, every
      // shader compile fails, and the background never renders again.
      gl.deleteBuffer(posBuffer);
      gl.deleteBuffer(uvBuffer);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    };
  }, []);

  return (
    <div className="galaxy-wrap" ref={containerRef}>
      <canvas className="galaxy-canvas" ref={canvasRef} />
    </div>
  );
};

export default GalaxyBackground;
