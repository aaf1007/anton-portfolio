// Writes public/favicon.svg from the mark in src/lib/mark.ts.
// Run from frontend/: node scripts/make-favicon.ts
import { writeFileSync } from "node:fs";
import { markSvg } from "../src/lib/mark.ts";

writeFileSync(new URL("../public/favicon.svg", import.meta.url), markSvg());
console.log("wrote public/favicon.svg");
