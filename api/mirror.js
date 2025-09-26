import cheerio from "cheerio";

export default async function handler(req, res) {
  const targetUrl = "https://www.crazygames.com/game/crazy-motorcycle";

  try {
    const response = await fetch(targetUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) " +
          "AppleWebKit/537.36 (KHTML, like Gecko) " +
          "Chrome/120.0.0.0 Safari/537.36",
        "Referer": "https://www.crazygames.com/",
        "Origin": "https://www.crazygames.com"
      }
    });

    let html = await response.text();

    // Load into Cheerio for rewriting
    const $ = cheerio.load(html);

    // Rewrite all src/href attributes to go through our proxy
    $("script[src], link[href], img[src], iframe[src]").each((_, el) => {
      const attr = el.name === "link" ? "href" : "src";
      const rawUrl = $(el).attr(attr);
      if (rawUrl) {
        const absUrl = new URL(rawUrl, targetUrl).href;
        $(el).attr(attr, `/api/proxy?url=${encodeURIComponent(absUrl)}`);
      }
    });

    res.setHeader("Content-Type", "text/html");
    res.send($.html());
  } catch (err) {
    res.status(500).send("Mirror error: " + err.message);
  }
}
