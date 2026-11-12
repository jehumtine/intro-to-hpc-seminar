import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import type { SlideProps } from '../deck/types';
import { Reveal } from './common';
import { Worker } from './s4-Scenes';

/*
 * CUDA (2007): the same job, c[i] = a[i] + b[i], written two ways.
 * CPU: one worker walks the list. CUDA: write what ONE worker does; launch a worker per element.
 *   step 0 code · step 1 CPU runs · step 2 GPU runs · step 3 the punchline
 */

const CELLS = 64;

const CPU_CODE = `// one worker walks the whole list
for (int i = 0; i < 1000000; i++) {
    c[i] = a[i] + b[i];
}`;

const GPU_CODE = `// what ONE worker does
__global__ void add(float *a, float *b, float *c) {
    int i = blockIdx.x * blockDim.x + threadIdx.x;
    c[i] = a[i] + b[i];
}
add<<<4096, 256>>>(a, b, c);   // a million workers`;

function Strip({ done, workers }: { done: boolean[]; workers: number[] }) {
  return (
    <div className="strip">
      {Array.from({ length: CELLS }, (_, i) => (
        <div key={i} className={`strip-cell ${done[i] ? 'done' : ''}`}>
          {workers.includes(i) && (
            <motion.div className="strip-worker" layoutId={workers.length === 1 ? 'cpu-worker' : undefined} transition={{ duration: 0.05 }}>
              <Worker />
            </motion.div>
          )}
        </div>
      ))}
    </div>
  );
}

export function Cuda({ step, active, explore }: SlideProps) {
  const [cpuI, setCpuI] = useState(-1); // index the CPU worker is on (-1 = not started)
  const [gpuDone, setGpuDone] = useState(false);
  const [cpuRun, setCpuRun] = useState(0); // bumps to (re)start
  const [gpuRun, setGpuRun] = useState(0);

  // talk-mode steps drive the runs
  useEffect(() => {
    if (step >= 1) setCpuRun((r) => r + 1);
    else setCpuI(-1);
    if (step >= 2) setGpuRun((r) => r + 1);
    else setGpuDone(false);
  }, [step >= 1, step >= 2]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!cpuRun) return;
    if (!active) {
      setCpuI(CELLS);
      return;
    }
    setCpuI(0);
    let i = 0;
    const t = setInterval(() => {
      i++;
      setCpuI(i);
      if (i >= CELLS) clearInterval(t);
    }, 110);
    return () => clearInterval(t);
  }, [cpuRun, active]);

  useEffect(() => {
    if (!gpuRun) return;
    setGpuDone(false);
    const t = setTimeout(() => setGpuDone(true), active ? 450 : 0);
    return () => clearTimeout(t);
  }, [gpuRun, active]);

  const cpuDone = Array.from({ length: CELLS }, (_, i) => i < cpuI);
  const gpuCells = Array.from({ length: CELLS }, () => gpuDone);
  const showGpuWorkers = gpuRun > 0;

  return (
    <div className="slide cuda">
      <div className="slide-kicker">MMVII · CUDA</div>
      <h2 className="slide-h">Write what one worker does. Hire a million.</h2>
      <div className="cuda-main">
        <div className="cuda-col">
          <div className="cuda-head">
            <span>CPU</span> one worker, down the list
          </div>
          <pre className="cuda-code">{CPU_CODE}</pre>
          <Strip done={cpuDone} workers={cpuI >= 0 && cpuI < CELLS ? [cpuI] : []} />
          <div className="cuda-stat">
            <span className="num">{Math.max(0, Math.min(cpuI, CELLS))}</span> / {CELLS} done
          </div>
          {explore && (
            <button className="btn" data-interactive onClick={() => setCpuRun((r) => r + 1)}>
              Run on CPU
            </button>
          )}
        </div>
        <div className="cuda-col">
          <div className="cuda-head">
            <span>GPU</span> a worker for every element
          </div>
          <pre className="cuda-code">{GPU_CODE}</pre>
          <Strip done={gpuCells} workers={showGpuWorkers ? Array.from({ length: CELLS }, (_, i) => i) : []} />
          <div className="cuda-stat">
            <span className="num">{gpuDone ? CELLS : 0}</span> / {CELLS} done {gpuDone && <em>· all at once</em>}
          </div>
          {explore && (
            <button className="btn" data-interactive onClick={() => setGpuRun((r) => r + 1)}>
              Launch on GPU
            </button>
          )}
        </div>
      </div>
      <Reveal show={step >= 3} className="cuda-punch">
        Normal code, basically C. No disguises. No pretending your equation is a teapot.
      </Reveal>
    </div>
  );
}
