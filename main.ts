// Two Days of Quiet Dread — make.fun entry (program/v1).
//
// The harness runs `node /bot/main.ts` (Node 22, standard library only, no
// network). The program writes one funny line to /output/entry.txt.
// Outside the grader's container, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
//
// Gate (from RULES.txt): /output/entry.txt must be UTF-8 text of 1–140
// characters, not only whitespace. This program enforces the gate on its
// own output and fails loudly instead of handing in a bad entry.
//
// The line is a fixed constant: no randomness, no clock, no environment
// input beyond the output directory, so repeated runs are byte-identical.
// The file is written with no trailing newline, so the gate counts exactly
// the line itself and nothing else.
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const LINE =
  'Approved. The diff is clean and the tests pass. It will all be legacy code eventually, and so will we, but not this week.';

const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// Gate self-check: 1–140 chars, not only whitespace, exactly one line.
const chars = [...LINE].length;
if (chars < 1 || chars > 140) throw new Error(`entry is ${chars} chars, gate needs 1–140`);
if (!/\S/.test(LINE)) throw new Error('entry is only whitespace');
if (LINE.includes('\n')) throw new Error('entry must be a single line');

mkdirSync(out, { recursive: true });
writeFileSync(join(out, 'entry.txt'), LINE, 'utf8');
console.log(`wrote entry.txt (${chars} chars)`);
