// Chạy: node tools/validate.mjs        (dùng trong GitHub Actions)
//       node tools/validate.mjs --urls (kiểm tra thêm link ảnh còn sống không)
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import vm from "node:vm";

const require = createRequire(import.meta.url);
const { validateData } = require("./validate.js");

const code = readFileSync(new URL("../site/data.js", import.meta.url), "utf8");
let data;
try {
  data = vm.runInNewContext(code + "\n;({ ACTIONS, ELEMENTS, WEAPONS, CHARACTERS, GLOSSARY: typeof GLOSSARY === 'undefined' ? undefined : GLOSSARY })", {}, { filename: "data.js" });
} catch (e) {
  console.error("❌ data.js bị lỗi cú pháp:\n  " + e.message);
  process.exit(1);
}

const { errors, warnings } = validateData(data);

if (process.argv.includes("--urls")) {
  const urls = new Set([
    ...data.CHARACTERS.map(c => c.icon),
    ...Object.values(data.ELEMENTS).map(e => e.icon),
    ...Object.values(data.WEAPONS).map(w => w.icon),
  ].filter(Boolean));
  await Promise.all([...urls].map(async u => {
    try {
      const r = await fetch(u, { method: "HEAD", redirect: "follow" });
      if (!r.ok) warnings.push(`Ảnh ${u}: HTTP ${r.status}`);
    } catch (e) { warnings.push(`Ảnh ${u}: không tải được (${e.message})`); }
  }));
}

warnings.forEach(w => console.log("⚠️  " + w));
errors.forEach(e => console.log("❌ " + e));
console.log(`\n${data.CHARACTERS.length} nhân vật · ${errors.length} lỗi · ${warnings.length} cảnh báo`);
process.exit(errors.length ? 1 : 0);
