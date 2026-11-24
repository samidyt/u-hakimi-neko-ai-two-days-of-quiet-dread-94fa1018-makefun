// Two Days of Quiet Dread — entry writer.
//
// The whole job of this program is small on purpose: hold one approved
// review comment, make sure it still fits the bounty gate, and drop it
// into entry.txt for the grader to read. Nothing is fetched, nothing is
// generated at run time, and nothing leaves this process except the file.

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The review comment itself. One sentence of approval, one of quiet dread.
const COMMENT =
  "Approved. The diff is clean and the tests pass. It will all be legacy code eventually, and so will we, but not this week.";

// The gate, as numbers with names instead of magic literals.
//
//   GATE_MIN_CHARS — the entry must not be empty. A file with zero
//     characters is not a comment, and the scorer marks it invalid.
//   GATE_MAX_CHARS — the bounty caps a review comment at 140
//     characters. Anything longer is refused before the judge
//     ever sees it, however funny it might be.
//   The single-line and non-whitespace rules are checked alongside
//     these two numbers in fitsGate() / gateProblems() below: the
//     comment must be exactly one line, and it must contain at
//     least one character that is not whitespace.
const GATE_MIN_CHARS = 1;
const GATE_MAX_CHARS = 140;

// Where the grader looks: /output inside its sandbox. When we run the
// program by hand, MAKEFUN_OUTPUT_DIR points somewhere local instead.
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

function fitsGate(text: string): boolean {
  const lengthOk = text.length >= GATE_MIN_CHARS && text.length <= GATE_MAX_CHARS;
  const oneLine = !text.includes("\n") && !text.includes("\r");
  const hasSubstance = text.trim().length > 0;
  return lengthOk && oneLine && hasSubstance;
}

// A second, independent look at the same rules, phrased as a list of
// reasons instead of one boolean. If anything is wrong we want the
// failure message to say which rule broke, not just that one did.
function gateProblems(text: string): string[] {
  const problems: string[] = [];
  if (text.length < GATE_MIN_CHARS) problems.push("empty entry");
  if (text.length > GATE_MAX_CHARS) problems.push("over 140 characters");
  if (text.includes("\n") || text.includes("\r")) problems.push("more than one line");
  if (text.trim().length === 0) problems.push("whitespace only");
  return problems;
}

function main(): void {
  const problems = gateProblems(COMMENT);
  if (!fitsGate(COMMENT) || problems.length > 0) {
    throw new Error(
      `comment fails the entry gate: ${problems.join("; ")} (length ${COMMENT.length})`,
    );
  }
  mkdirSync(OUTPUT_DIR, { recursive: true });
  writeFileSync(join(OUTPUT_DIR, "entry.txt"), COMMENT, "utf8");
}

main();
