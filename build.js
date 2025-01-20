import { ensureDir } from "https://deno.land/std@0.148.0/fs/mod.ts";
import { markdownToHtml } from "https://deno.land/x/markdown/mod.ts";

await ensureDir("_site");

for await (const entry of Deno.readDir(".")) {
  if (entry.isFile && entry.name.endsWith(".md")) {
    const markdownContent = await Deno.readTextFile(entry.name);
    const htmlContent = markdownToHtml(markdownContent);
    const title = markdownContent.match(/^# (.+)$/m)?.[1] || "Document";
    const outputHtml = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<style>
body { font-family: Arial, sans-serif; line-height: 1.6; margin: 20px; }
</style>
</head>
<body>
${htmlContent}
</body>
</html>`;

    const outputFileName = entry.name === "README.md" ? "index.html" : entry.name.replace(/\.md$/, ".html");
    await Deno.writeTextFile(`_site/${outputFileName}`, outputHtml);
  }
}

console.log("Conversion complete!");
