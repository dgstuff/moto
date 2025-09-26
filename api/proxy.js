export default async function handler(req, res) {
  const targetUrl = req.query.url;

  if (!targetUrl) {
    res.status(400).send("Missing url param");
    return;
  }

  try {
    const response = await fetch(targetUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) " +
          "AppleWebKit/537.36 (KHTML, like Gecko) " +
          "Chrome/120.0.0.0 Safari/537.36",
        "Referer": "https://www.crazygames.com/game/crazy-motorcycle",
        "Origin": "https://www.crazygames.com"
      }
    });

    const contentType = response.headers.get("content-type");
    res.setHeader("Content-Type", contentType || "text/html");

    const buffer = await response.arrayBuffer();
    res.send(Buffer.from(buffer));
  } catch (err) {
    res.status(500).send("Proxy error: " + err.message);
  }
}
