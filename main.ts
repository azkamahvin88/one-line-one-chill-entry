// One Line, One Chill — a make.fun entry (Node 22+,
// standard library only, no network, no model calls, fully
// deterministic: the same line every run).
//
// The entry is a single sentence of horror, under 200 characters.
// The line itself is the whole entry: one sentence, one breath, no
// setup and no second chance. It is written to /output/entry.txt.
//
// The line: a routine dental visit turns wrong in the last clause.
// The dentist pulls the narrator's tooth, holds it up, and asks why
// the narrator has somebody else's tooth in his mouth — so the scare
// is not the tooth, it is what it implies: something was put inside
// the narrator's body, or the narrator is not who he thinks he is.
// No gore, no ghost, no mirror, no doll, no basement; the dread is
// earned by the final phrase, "in my mouth", which lands the blow
// inside the reader's own body. At 94 characters it is also short,
// and a shorter text wins an exact tie on Judge win rate.
//
// The program validates the line, writes it, then reads the file
// back and checks it round-trips byte for byte, so a bad write fails
// loudly here instead of shipping an entry the gate refuses.
//
// Outside the grader's container, MAKEFUN_OUTPUT_DIR stands in for
// /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const LINE =
  "The dentist pulled my tooth, held it up, and asked why I had someone else's tooth in my mouth.";

// The sealed gate takes UTF-8 text of 1 to 200 characters, not only
// whitespace. Count code points with the spread operator: String
// .length counts UTF-16 units, so an astral character would be
// counted twice and a line at the limit could slip past the check.
function charCount(text) {
  return [...text].length;
}

function validateLine(text) {
  const chars = charCount(text);
  if (chars < 1 || chars > 200) {
    throw new Error(`entry is ${chars} characters; the gate needs 1-200`);
  }
  if (text.trim().length === 0) {
    throw new Error('entry is only whitespace; the gate needs real text');
  }
  return chars;
}

const chars = validateLine(LINE);

const outDir = process.env.MAKEFUN_OUTPUT_DIR?.trim()
  ? process.env.MAKEFUN_OUTPUT_DIR
  : '/output';

const outPath = join(outDir, 'entry.txt');
mkdirSync(outDir, { recursive: true });
writeFileSync(outPath, LINE + '\n', 'utf8');

// Read the file back and confirm it holds exactly the line plus one
// trailing newline — nothing added, nothing lost.
const written = readFileSync(outPath, 'utf8');
if (written !== LINE + '\n') {
  throw new Error('entry.txt does not round-trip: written bytes differ from the line');
}

console.log(`wrote entry.txt (${chars} characters + newline)`);
