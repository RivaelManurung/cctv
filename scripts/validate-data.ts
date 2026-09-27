/**
 * Static data integrity check.
 *
 *   npm run validate:data
 *
 * Exits non-zero when any error-level issue is found, so it can gate a build.
 * Warnings (e.g. a province with no cameras yet) do not fail the run.
 *
 * Uses relative imports rather than the `@/` alias so it can run under plain
 * `tsx` without a path-mapping resolver.
 */
import { categories } from "../src/data/categories";
import { cctvData } from "../src/data/cctv";
import { cities } from "../src/data/cities";
import { provinces } from "../src/data/provinces";
import { sources } from "../src/data/sources";
import { validateDataset } from "../src/lib/validation";
import { getStats } from "../src/lib/stats";

const issues = validateDataset({
  cameras: cctvData,
  provinces,
  cities,
  sources,
  categories,
});

const errors = issues.filter((issue) => issue.level === "error");
const warnings = issues.filter((issue) => issue.level === "warning");

const stats = getStats();

console.log("CCTV Indonesia — data integrity report");
console.log("──────────────────────────────────────");
console.log(`  cameras    ${stats.cameras}`);
console.log(`  cities     ${stats.cities}`);
console.log(`  provinces  ${stats.provinces}`);
console.log(`  regions    ${stats.regions}`);
console.log(`  sources    ${stats.sources}`);
console.log(`  online     ${stats.online}`);
console.log(`  offline    ${stats.offline}`);
console.log(`  unknown    ${stats.unknown}`);
console.log("");

if (warnings.length > 0) {
  console.log(`⚠  ${warnings.length} warning(s):`);
  for (const warning of warnings) {
    console.log(`   [${warning.code}] ${warning.message}`);
  }
  console.log("");
}

if (errors.length > 0) {
  console.error(`✖  ${errors.length} error(s):`);
  for (const error of errors) {
    console.error(`   [${error.code}] ${error.message}`);
  }
  process.exit(1);
}

console.log("✔  No data integrity errors.");
