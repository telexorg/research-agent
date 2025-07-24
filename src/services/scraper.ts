import fetch from "node-fetch";
import * as cheerio from "cheerio";

export async function fetchPageContent(url: string): Promise<{ title: string, content: string }> {
  const response = await fetch(url);
  const html = await response.text();
  const $ = cheerio.load(html);

  const title = $("h1").first().text();
  const paragraphs = $("p")
    .map((_, el) => $(el).text())
    .get()
    .filter(p => p.length > 50)
    .slice(0, 10)
    .join("\n\n");

  return { title, content: paragraphs };
}
