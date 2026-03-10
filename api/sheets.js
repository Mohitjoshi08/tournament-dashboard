const SPORT_SHEETS = {
  Basketball:
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vQxLFCAFvA53uT3CgRdKdnyPki0IVccNqrZEW9CyoEZMo704PM_7XqPzNWZmi7ZT_NLQid4V7WKCBL_/pub?gid=0&single=true&output=csv",
  Volleyball:
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vQxLFCAFvA53uT3CgRdKdnyPki0IVccNqrZEW9CyoEZMo704PM_7XqPzNWZmi7ZT_NLQid4V7WKCBL_/pub?gid=146945318&single=true&output=csv",
  Chess:
    "https://docs.google.com/spreadsheets/d/e/YOUR_ID/pub?gid=222222&single=true&output=csv",
  TableTennis:
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vQxLFCAFvA53uT3CgRdKdnyPki0IVccNqrZEW9CyoEZMo704PM_7XqPzNWZmi7ZT_NLQid4V7WKCBL_/pub?gid=2007754929&single=true&output=csv",
  LawnTennis:
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vQxLFCAFvA53uT3CgRdKdnyPki0IVccNqrZEW9CyoEZMo704PM_7XqPzNWZmi7ZT_NLQid4V7WKCBL_/pub?gid=1960281307&single=true&output=csv",
  Football:
    "hhttps://docs.google.com/spreadsheets/d/e/2PACX-1vQxLFCAFvA53uT3CgRdKdnyPki0IVccNqrZEW9CyoEZMo704PM_7XqPzNWZmi7ZT_NLQid4V7WKCBL_/pub?gid=1755361534&single=true&output=csv",
  Cricket:
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vQxLFCAFvA53uT3CgRdKdnyPki0IVccNqrZEW9CyoEZMo704PM_7XqPzNWZmi7ZT_NLQid4V7WKCBL_/pub?gid=77627037&single=true&output=csv",
  Athletics:
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vQxLFCAFvA53uT3CgRdKdnyPki0IVccNqrZEW9CyoEZMo704PM_7XqPzNWZmi7ZT_NLQid4V7WKCBL_/pub?gid=1303414032&single=true&output=csv",
  Weightlifting:
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vQxLFCAFvA53uT3CgRdKdnyPki0IVccNqrZEW9CyoEZMo704PM_7XqPzNWZmi7ZT_NLQid4V7WKCBL_/pub?gid=1439853032&single=true&output=csv",
  Badminton:
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vQxLFCAFvA53uT3CgRdKdnyPki0IVccNqrZEW9CyoEZMo704PM_7XqPzNWZmi7ZT_NLQid4V7WKCBL_/pub?gid=1907988583&single=true&output=csv",
  Squash:
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vQxLFCAFvA53uT3CgRdKdnyPki0IVccNqrZEW9CyoEZMo704PM_7XqPzNWZmi7ZT_NLQid4V7WKCBL_/pub?gid=930988273&single=true&output=csv",
  Chess:
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vQxLFCAFvA53uT3CgRdKdnyPki0IVccNqrZEW9CyoEZMo704PM_7XqPzNWZmi7ZT_NLQid4V7WKCBL_/pub?gid=2025264677&single=true&output=csv"

};

let cache = { data: null, timestamp: 0 };
const CACHE_DURATION = 30000;

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");

  const now = Date.now();

  if (cache.data && now - cache.timestamp < CACHE_DURATION) {
    res.setHeader("X-Cache", "HIT");
    res.setHeader(
      "Cache-Control",
      "public, s-maxage=30, stale-while-revalidate=60"
    );
    return res.status(200).json(cache.data);
  }

  try {
    const entries = Object.entries(SPORT_SHEETS);
    const results = {};

    await Promise.all(
      entries.map(async ([name, url]) => {
        try {
          const response = await fetch(url);
          if (!response.ok) throw new Error(`HTTP ${response.status}`);
          const csvText = await response.text();
          results[name] = csvText;
        } catch (err) {
          console.error(`Failed to fetch ${name}:`, err.message);
          results[name] = null;
        }
      })
    );

    cache = { data: results, timestamp: now };

    res.setHeader("X-Cache", "MISS");
    res.setHeader(
      "Cache-Control",
      "public, s-maxage=30, stale-while-revalidate=60"
    );
    return res.status(200).json(results);
  } catch (error) {
    console.error("Proxy error:", error);

    if (cache.data) {
      res.setHeader("X-Cache", "STALE");
      return res.status(200).json(cache.data);
    }

    return res.status(500).json({ error: "Failed to fetch data" });
  }
}