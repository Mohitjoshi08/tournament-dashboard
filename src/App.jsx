import { useState, useEffect, useMemo, useCallback } from "react";
import Papa from "papaparse";
import {
  Trophy,
  Clock,
  MapPin,
  Search,
  ChevronDown,
  ChevronUp,
  Activity,
  Target,
  Zap,
  Medal,
  Calendar,
  Radio,
  TrendingUp,
  Shield,
  Award,
  X,
  RefreshCw,
  Wifi,
  WifiOff,
  Dribbble,
  Swords,
  Footprints,
  Dumbbell,
  CircleDot,
  Crown,
  Flame,
  Timer,
  Weight,
} from "lucide-react";

// ─────────────────────────────────────────────────────────────
// 🔧 CONFIG
// ─────────────────────────────────────────────────────────────
const IS_DEV = import.meta.env.DEV;
const API_URL = "/api/sheets";

const DEV_SPORT_SHEETS = {
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
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vQxLFCAFvA53uT3CgRdKdnyPki0IVccNqrZEW9CyoEZMo704PM_7XqPzNWZmi7ZT_NLQid4V7WKCBL_/pub?gid=1755361534&single=true&output=csv",
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
const POLL_INTERVAL = 20000;
const TEAMS = ["Year 1", "Year 2", "Year 3", "Year 4"];
const CHAMPIONSHIP_POINTS = { "1st": 10, "2nd": 7, "3rd": 5, "4th": 3 };
const FREEFORM_SCORE_SPORTS = ["cricket"];
const ATHLETICS_EVENT_POINTS = { "1st": 5, "2nd": 3, "3rd": 1 };
const ATHLETICS_SPORTS = ["athletics", "weightlifting"];

// ─────────────────────────────────────────────────────────────
// TEAM COLORS
// ─────────────────────────────────────────────────────────────
const TEAM_COLORS = {
  "Year 1": {
    bg: "from-cyan-500/20 to-cyan-900/20",
    border: "border-cyan-500",
    text: "text-cyan-400",
    glow: "shadow-cyan-500/30",
    ring: "ring-cyan-500/30",
  },
  "Year 2": {
    bg: "from-fuchsia-500/20 to-fuchsia-900/20",
    border: "border-fuchsia-500",
    text: "text-fuchsia-400",
    glow: "shadow-fuchsia-500/30",
    ring: "ring-fuchsia-500/30",
  },
  "Year 3": {
    bg: "from-amber-500/20 to-amber-900/20",
    border: "border-amber-500",
    text: "text-amber-400",
    glow: "shadow-amber-500/30",
    ring: "ring-amber-500/30",
  },
  "Year 4": {
    bg: "from-emerald-500/20 to-emerald-900/20",
    border: "border-emerald-500",
    text: "text-emerald-400",
    glow: "shadow-emerald-500/30",
    ring: "ring-emerald-500/30",
  },
};

const DEFAULT_TC = {
  bg: "from-slate-500/20 to-slate-900/20",
  border: "border-slate-500",
  text: "text-slate-400",
  glow: "shadow-slate-500/30",
  ring: "ring-slate-500/30",
};

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────
function normalizeTeam(raw) {
  if (!raw) return "";
  const t = raw.trim();
  const found = TEAMS.find((team) => team.toLowerCase() === t.toLowerCase());
  if (found) return found;
  if (/^\d+$/.test(t)) {
    const num = parseInt(t, 10);
    const byNum = TEAMS.find((team) => team.includes(String(num)));
    if (byNum) return byNum;
  }
  return t;
}

function getTeamColor(team) {
  return TEAM_COLORS[normalizeTeam(team)] || DEFAULT_TC;
}

function isFreeformSport(sportName) {
  if (!sportName) return false;
  return FREEFORM_SCORE_SPORTS.includes(
    sportName.toLowerCase().replace(/[\s\-_]/g, "")
  );
}

function isAthleticsSport(sportName) {
  if (!sportName) return false;
  return ATHLETICS_SPORTS.includes(
    sportName.toLowerCase().replace(/[\s\-_]/g, "")
  );
}

const SPORT_ICONS = {
  basketball: Dribbble,
  volleyball: Activity,
  chess: Crown,
  tabletennis: Zap,
  lawntennis: CircleDot,
  football: Footprints,
  cricket: Target,
  kabaddi: Swords,
  badminton: Zap,
  athletics: Timer,
  weightlifting: Dumbbell,
};

function getSportIcon(name) {
  if (!name) return Dumbbell;
  return SPORT_ICONS[name.toLowerCase().replace(/[\s\-_]/g, "")] || Dumbbell;
}

// ─────────────────────────────────────────────────────────────
// CSV PARSING
// ─────────────────────────────────────────────────────────────
function parseCSVText(csvText) {
  const result = Papa.parse(csvText, {
    header: false,
    skipEmptyLines: true,
  });
  return result.data;
}

function fetchRawCSV(url) {
  return new Promise((resolve, reject) => {
    Papa.parse(url, {
      download: true,
      header: false,
      skipEmptyLines: true,
      complete: (results) => resolve(results.data),
      error: (err) => reject(err),
    });
  });
}

// ─────────────────────────────────────────────────────────────
// SCORE PARSING (team sports)
// ─────────────────────────────────────────────────────────────
function parseScore(scoreRaw, sportName) {
  if (!scoreRaw || scoreRaw.trim() === "") {
    return { scoreA: null, scoreB: null, displayText: "", hasResult: false };
  }

  const trimmed = scoreRaw.trim();
  const freeform = isFreeformSport(sportName);

  let parts = trimmed.split(/\s+[-–—]\s+/);
  if (parts.length !== 2 && !freeform) {
    parts = trimmed.split(/(?<!\/)[-–—](?!\/)/);
  }
  if (parts.length !== 2) {
    parts = trimmed.split(/\s+vs\.?\s+/i);
  }

  if (parts.length === 2) {
    const a = parts[0].trim();
    const b = parts[1].trim();
    if (a && b) {
      return { scoreA: a, scoreB: b, displayText: trimmed, hasResult: true };
    }
  }

  return {
    scoreA: null,
    scoreB: null,
    displayText: trimmed,
    hasResult: trimmed.length > 0,
  };
}

// ────────────────────���────────────────────────────────────────
// ATHLETICS / WEIGHTLIFTING SHEET PARSER
// Row 0: [emoji, sportName, venue, 0]
// Row 1: headers (Date, Event, Category, 1st Place, 2nd Place, 3rd Place, Performance)
// Row 2+: event data
// Column G (index 6) = Performance (optional) — e.g. "185/170/155 kg" or "11.2s / 11.5s / 11.8s"
// ─────────────────────────────────────────────────────────────
function parseAthleticsSheet(raw, fallbackName) {
  if (!raw || raw.length < 3) {
    console.warn(
      `Athletics sheet "${fallbackName}": not enough rows. Got ${raw?.length || 0}`
    );
    return null;
  }

  const metaRow = raw[0];
  const icon = (metaRow[0] || "🏃").trim();
  const sportName = (metaRow[1] || fallbackName).trim();
  const venue = (metaRow[2] || "TBD").trim();

  const events = [];
  for (let i = 2; i < raw.length; i++) {
    const r = raw[i];
    if (!r || r.length < 4) continue;

    const date = (r[0] || "").trim();
    const eventName = (r[1] || "").trim();
    const category = (r[2] || "").trim();
    const first = normalizeTeam(r[3]);
    const second = normalizeTeam(r[4]);
    const third = normalizeTeam(r[5]);
    const performance = (r[6] || "").trim();

    if (!eventName) continue;

    const hasResult = first !== "" || second !== "" || third !== "";

    // Parse individual performances from "185/170/155 kg" or "11.2s / 11.5s / 11.8s"
    let perf1 = "";
    let perf2 = "";
    let perf3 = "";
    if (performance) {
      // Try splitting by "/" or " / "
      const perfParts = performance.split(/\s*\/\s*/);
      if (perfParts.length >= 3) {
        perf1 = perfParts[0].trim();
        perf2 = perfParts[1].trim();
        perf3 = perfParts[2].trim();
      } else {
        // If can't split, show full text for 1st place
        perf1 = performance;
      }
    }

    events.push({
      date,
      eventName,
      category,
      first,
      second,
      third,
      performance,
      perf1,
      perf2,
      perf3,
      hasResult,
      id: `${sportName}-${eventName}-${category}`,
    });
  }

  const decided = events.filter((e) => e.hasResult).length;
  console.log(
    `✅ ${sportName}: ${events.length} events, ${decided} with results [multi-event]`
  );

  return {
    sportName,
    icon,
    venue,
    duration: 0,
    isFreeform: false,
    isAthletics: true,
    events,
    matches: [],
  };
}

// ─────────────────────────────────────────────────────────────
// TEAM SPORT SHEET PARSER
// ─────────────────────────────────────────────────────────────
function parseSportSheet(raw, fallbackName) {
  if (!raw || raw.length < 3) {
    console.warn(
      `Sheet "${fallbackName}": not enough rows (need ≥3). Got ${raw?.length || 0}`
    );
    return null;
  }

  const metaRow = raw[0];
  const sportName = (metaRow[1] || fallbackName).trim();

  if (isAthleticsSport(sportName)) {
    return parseAthleticsSheet(raw, fallbackName);
  }

  const icon = (metaRow[0] || "🏅").trim();
  const venue = (metaRow[2] || "TBD").trim();
  const duration = parseInt(metaRow[3], 10) || 60;
  const freeform = isFreeformSport(sportName);

  const matches = [];
  for (let i = 2; i < raw.length; i++) {
    const r = raw[i];
    if (!r || r.length < 6) continue;

    const date = (r[0] || "").trim();
    const time = (r[1] || "").trim();
    const stage = (r[2] || "League").trim();
    const matchNo = (r[3] || `${i - 1}`).trim();
    const teamA = normalizeTeam(r[4]);
    const teamB = normalizeTeam(r[5]);
    const scoreRaw = (r[6] || "").trim();
    const winner = normalizeTeam(r[7]);

    if (!teamA && !teamB) continue;

    const score = parseScore(scoreRaw, sportName);
    const hasResult = score.hasResult || winner !== "";

    matches.push({
      sport: sportName,
      sportIcon: icon,
      venue,
      duration,
      isFreeform: freeform,
      date,
      time,
      stage,
      matchNo,
      teamA,
      teamB,
      scoreRaw,
      scoreA: score.scoreA,
      scoreB: score.scoreB,
      displayText: score.displayText,
      winner,
      hasResult,
      id: `${sportName}-M${matchNo}`,
    });
  }

  console.log(
    `✅ ${sportName}: ${matches.length} matches, ` +
      `${matches.filter((m) => m.hasResult).length} with results` +
      (freeform ? " [freeform]" : "")
  );
  return {
    sportName,
    icon,
    venue,
    duration,
    isFreeform: freeform,
    isAthletics: false,
    matches,
  };
}

// ─────────────────────────────────────────────────────────────
// LIVE STATUS (team sports only)
// ─────────────────────────────────────────────────────────────
function parseMatchDateTime(match) {
  if (!match.date || !match.time) return null;
  const dp = match.date.split("-").map(Number);
  const tp = match.time.split(":").map(Number);
  if (dp.length < 3 || tp.length < 2) return null;
  const [y, m, d] = dp;
  const [h, min] = tp;
  if ([y, m, d, h, min].some(isNaN)) return null;
  return new Date(y, m - 1, d, h, min);
}

function getMatchStatus(match, now) {
  if (match.hasResult)
    return { isLive: false, isUpcoming: false, isPast: true };
  const start = parseMatchDateTime(match);
  if (!start) return { isLive: false, isUpcoming: true, isPast: false };
  const end = new Date(start.getTime() + match.duration * 60000);
  if (now >= start && now <= end)
    return { isLive: true, isUpcoming: false, isPast: false };
  if (now < start) return { isLive: false, isUpcoming: true, isPast: false };
  return { isLive: false, isUpcoming: false, isPast: true };
}

// ─────────────────────────────────────────────────────────────
// HEAD-TO-HEAD TIEBREAKER (team sports)
// ─────────────────────────────────────────────────────────────
function getHeadToHeadWinner(teamA, teamB, leagueMatches) {
  const match = leagueMatches.find(
    (m) =>
      (m.teamA === teamA && m.teamB === teamB) ||
      (m.teamA === teamB && m.teamB === teamA)
  );
  if (!match || !match.winner) return null;
  return match.winner;
}

// ─────────────────────────────────────────────────────────────
// LEAGUE POINTS TABLE (team sports)
// ─────────────────────────────────────────────────────────────
function computeSportLeagueTable(sportData) {
  if (!sportData?.matches) return [];

  const table = {};
  TEAMS.forEach((t) => {
    table[t] = {
      team: t,
      played: 0,
      won: 0,
      lost: 0,
      drawn: 0,
      points: 0,
    };
  });

  sportData.matches.forEach((m) => {
    [m.teamA, m.teamB].forEach((t) => {
      if (t && !table[t]) {
        table[t] = {
          team: t,
          played: 0,
          won: 0,
          lost: 0,
          drawn: 0,
          points: 0,
        };
      }
    });
  });

  const league = sportData.matches.filter(
    (m) => m.stage.toLowerCase() === "league" && m.hasResult
  );

  league.forEach((m) => {
    if (table[m.teamA]) table[m.teamA].played++;
    if (table[m.teamB]) table[m.teamB].played++;

    const w = m.winner;
    if (w && w === m.teamA) {
      if (table[m.teamA]) {
        table[m.teamA].won++;
        table[m.teamA].points += 3;
      }
      if (table[m.teamB]) table[m.teamB].lost++;
    } else if (w && w === m.teamB) {
      if (table[m.teamB]) {
        table[m.teamB].won++;
        table[m.teamB].points += 3;
      }
      if (table[m.teamA]) table[m.teamA].lost++;
    } else {
      if (table[m.teamA]) {
        table[m.teamA].drawn++;
        table[m.teamA].points += 1;
      }
      if (table[m.teamB]) {
        table[m.teamB].drawn++;
        table[m.teamB].points += 1;
      }
    }
  });

  const rows = Object.values(table).filter(
    (row) => TEAMS.includes(row.team) || row.played > 0
  );

  rows.sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.won !== a.won) return b.won - a.won;
    const h2h = getHeadToHeadWinner(a.team, b.team, league);
    if (h2h === a.team) return -1;
    if (h2h === b.team) return 1;
    return 0;
  });

  return rows;
}

// ─────────────────────────────────────────────────────────────
// ATHLETICS / WEIGHTLIFTING MEDAL TALLY
// ─────────────────────────────────────────────────────────────
function computeAthleticsTally(sportData) {
  if (!sportData?.events) return [];

  const table = {};
  TEAMS.forEach((t) => {
    table[t] = { team: t, golds: 0, silvers: 0, bronzes: 0, totalPoints: 0 };
  });

  sportData.events
    .filter((e) => e.hasResult)
    .forEach((e) => {
      if (e.first && table[e.first]) {
        table[e.first].golds++;
        table[e.first].totalPoints += ATHLETICS_EVENT_POINTS["1st"];
      }
      if (e.second && table[e.second]) {
        table[e.second].silvers++;
        table[e.second].totalPoints += ATHLETICS_EVENT_POINTS["2nd"];
      }
      if (e.third && table[e.third]) {
        table[e.third].bronzes++;
        table[e.third].totalPoints += ATHLETICS_EVENT_POINTS["3rd"];
      }
    });

  return Object.values(table).sort(
    (a, b) =>
      b.totalPoints - a.totalPoints ||
      b.golds - a.golds ||
      b.silvers - a.silvers
  );
}

// ─────────────────────────────────────────────────────────────
// OVERALL CHAMPIONSHIP — Team sports + Athletics + Weightlifting
// ─────────────────────────────────────────────────────────────
function computeOverallChampionship(allSports) {
  const totals = {};
  TEAMS.forEach((t) => {
    totals[t] = {
      team: t,
      totalPoints: 0,
      golds: 0,
      silvers: 0,
      bronzes: 0,
      sportsDecided: 0,
    };
  });

  allSports.forEach((sportData) => {
    if (!sportData) return;

    if (sportData.isAthletics) {
      const tally = computeAthleticsTally(sportData);
      const decided = sportData.events?.filter((e) => e.hasResult).length || 0;
      if (decided === 0) return;

      const positions = ["1st", "2nd", "3rd", "4th"];
      tally.forEach((row, i) => {
        if (i < 4 && totals[row.team]) {
          const pos = positions[i];
          if (pos) totals[row.team].totalPoints += CHAMPIONSHIP_POINTS[pos] || 0;
          if (i === 0) totals[row.team].golds++;
          if (i === 1) totals[row.team].silvers++;
          if (i === 2) totals[row.team].bronzes++;
          totals[row.team].sportsDecided++;
        }
      });
      return;
    }

    const finalMatch = sportData.matches.find(
      (m) => m.stage.toLowerCase() === "final" && m.hasResult && m.winner
    );
    const thirdMatch = sportData.matches.find(
      (m) =>
        ["3rd place", "3rdplace", "third place", "3rd"].includes(
          m.stage.toLowerCase()
        ) &&
        m.hasResult &&
        m.winner
    );

    if (finalMatch) {
      const first = finalMatch.winner;
      const second =
        first === finalMatch.teamA ? finalMatch.teamB : finalMatch.teamA;
      if (totals[first]) {
        totals[first].totalPoints += CHAMPIONSHIP_POINTS["1st"];
        totals[first].golds++;
        totals[first].sportsDecided++;
      }
      if (totals[second]) {
        totals[second].totalPoints += CHAMPIONSHIP_POINTS["2nd"];
        totals[second].silvers++;
        totals[second].sportsDecided++;
      }
    }

    if (thirdMatch) {
      const third = thirdMatch.winner;
      const fourth =
        third === thirdMatch.teamA ? thirdMatch.teamB : thirdMatch.teamA;
      if (totals[third]) {
        totals[third].totalPoints += CHAMPIONSHIP_POINTS["3rd"];
        totals[third].bronzes++;
        if (!finalMatch) totals[third].sportsDecided++;
      }
      if (totals[fourth]) {
        totals[fourth].totalPoints += CHAMPIONSHIP_POINTS["4th"];
        if (!finalMatch) totals[fourth].sportsDecided++;
      }
    }
  });

  return Object.values(totals).sort(
    (a, b) =>
      b.totalPoints - a.totalPoints ||
      b.golds - a.golds ||
      b.silvers - a.silvers
  );
}

// ─────────────────────────────────────────────────────────────
// UI COMPONENTS
// ─────────────────────────────────────────────────────────────

function FloatingParticles() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {Array.from({ length: 18 }).map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full opacity-10 animate-float"
          style={{
            width: `${Math.random() * 5 + 2}px`,
            height: `${Math.random() * 5 + 2}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            background: ["#06b6d4", "#d946ef", "#f59e0b", "#10b981"][i % 4],
            animationDuration: `${Math.random() * 12 + 10}s`,
            animationDelay: `${Math.random() * 5}s`,
          }}
        />
      ))}
    </div>
  );
}

function LiveBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/20 text-red-400 text-xs font-bold uppercase tracking-wider ring-1 ring-red-500/40 animate-pulse-glow">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
      </span>
      LIVE
    </span>
  );
}

function NewsTicker({ allMatches }) {
  const recent = useMemo(() => {
    return allMatches
      .filter((m) => m.hasResult)
      .sort((a, b) => {
        const da = parseMatchDateTime(a);
        const db = parseMatchDateTime(b);
        if (!da && !db) return 0;
        if (!da) return 1;
        if (!db) return -1;
        return db - da;
      })
      .slice(0, 6);
  }, [allMatches]);

  if (recent.length === 0) return null;

  const items = recent.map((m) => {
    const isDraw = !m.winner;
    if (m.isFreeform) {
      const result = isDraw ? "Match Drawn" : `${m.winner} wins!`;
      return `${m.sportIcon} ${m.sport}: ${m.teamA} vs ${m.teamB} — ${m.displayText || result}`;
    }
    const result = isDraw ? `Draw (${m.scoreRaw})` : `${m.winner} wins!`;
    return `${m.sportIcon} ${m.sport}: ${m.teamA} ${m.scoreA ?? "?"} - ${m.scoreB ?? "?"} ${m.teamB} → ${result}`;
  });

  const repeated = [...items, ...items];

  return (
    <div className="relative bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-cyan-500/30 overflow-hidden">
      <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-slate-900 to-transparent z-10" />
      <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-slate-900 to-transparent z-10" />
      <div className="flex animate-scroll whitespace-nowrap py-2.5">
        {repeated.map((item, i) => (
          <span
            key={i}
            className="mx-8 text-sm font-medium text-cyan-300/90 tracking-wide"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// MATCH CARD (team sports)
// ─────────────────────────────────────��───────────────────────
function MatchCard({ match, status }) {
  const Icon = getSportIcon(match.sport);
  const tcA = getTeamColor(match.teamA);
  const tcB = getTeamColor(match.teamB);

  const start = parseMatchDateTime(match);
  const timeStr = start
    ? start.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : match.time || "TBD";
  const dateStr = start
    ? start.toLocaleDateString([], { month: "short", day: "numeric" })
    : match.date || "";

  const winnerIsA = match.winner && match.winner === match.teamA;
  const winnerIsB = match.winner && match.winner === match.teamB;

  return (
    <div className="group relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 rounded-xl border border-slate-700/50 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10 hover:-translate-y-0.5 overflow-hidden backdrop-blur-sm">
      {status.isLive && (
        <div className="absolute inset-0 rounded-xl border-2 border-red-500/40 animate-pulse-glow pointer-events-none" />
      )}
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-slate-700/50">
              <Icon className="w-4 h-4 text-cyan-400" />
            </div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              {match.sport}
            </span>
            {match.stage.toLowerCase() !== "league" && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 ring-1 ring-amber-500/30 uppercase">
                {match.stage}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-slate-600">
              #{match.matchNo}
            </span>
            {status.isLive && <LiveBadge />}
            {status.isPast && match.hasResult && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-700/50 text-slate-400 font-semibold uppercase">
                FT
              </span>
            )}
            {status.isUpcoming && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 font-semibold uppercase ring-1 ring-cyan-500/20">
                Upcoming
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 my-4">
          <div className="flex-1 text-center">
            <div
              className={`text-sm font-bold ${winnerIsA ? tcA.text : "text-slate-200"}`}
            >
              {match.teamA}
            </div>
            {match.hasResult && match.isFreeform && match.scoreA && (
              <div
                className={`text-[11px] mt-1 font-semibold ${winnerIsA ? tcA.text : "text-slate-400"}`}
              >
                {match.scoreA}
              </div>
            )}
            {winnerIsA && (
              <Trophy className="w-3.5 h-3.5 text-amber-400 mx-auto mt-1" />
            )}
          </div>

          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-950/60 min-w-[90px] justify-center">
            {match.hasResult ? (
              match.isFreeform ? (
                match.scoreA && match.scoreB ? (
                  <span className="text-xs text-slate-500 font-bold">VS</span>
                ) : (
                  <span className="text-[11px] text-cyan-300 font-medium text-center leading-tight max-w-[130px]">
                    {match.displayText}
                  </span>
                )
              ) : (
                <>
                  <span
                    className={`text-xl font-black tabular-nums ${winnerIsA ? tcA.text : "text-slate-400"}`}
                  >
                    {match.scoreA}
                  </span>
                  <span className="text-slate-600 font-light text-lg">–</span>
                  <span
                    className={`text-xl font-black tabular-nums ${winnerIsB ? tcB.text : "text-slate-400"}`}
                  >
                    {match.scoreB}
                  </span>
                </>
              )
            ) : status.isLive ? (
              <span className="text-sm text-red-400 font-bold animate-pulse">
                PLAYING
              </span>
            ) : (
              <span className="text-sm text-slate-500 font-bold">VS</span>
            )}
          </div>

          <div className="flex-1 text-center">
            <div
              className={`text-sm font-bold ${winnerIsB ? tcB.text : "text-slate-200"}`}
            >
              {match.teamB}
            </div>
            {match.hasResult && match.isFreeform && match.scoreB && (
              <div
                className={`text-[11px] mt-1 font-semibold ${winnerIsB ? tcB.text : "text-slate-400"}`}
              >
                {match.scoreB}
              </div>
            )}
            {winnerIsB && (
              <Trophy className="w-3.5 h-3.5 text-amber-400 mx-auto mt-1" />
            )}
          </div>
        </div>

        {match.hasResult &&
          match.isFreeform &&
          match.scoreA &&
          match.scoreB && (
            <div className="text-center mb-2">
              <span className="text-[11px] text-slate-500 italic">
                {match.winner ? `${match.winner} won` : "Match Drawn"}
              </span>
            </div>
          )}

        <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-700/50">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {dateStr}
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {timeStr}
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {match.venue}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// SPORT POINTS TABLE (team sports — # TEAM P W L D PTS)
// ─────────────────────────────────────────────────────────────
function SportPointsTable({ sportData, startExpanded }) {
  const [expanded, setExpanded] = useState(startExpanded);
  const table = useMemo(
    () => computeSportLeagueTable(sportData),
    [sportData]
  );
  const Icon = getSportIcon(sportData.sportName);

  const leagueCount = sportData.matches.filter(
    (m) => m.stage.toLowerCase() === "league" && m.hasResult
  ).length;

  const finalMatch = sportData.matches.find(
    (m) => m.stage.toLowerCase() === "final" && m.hasResult
  );
  const thirdMatch = sportData.matches.find(
    (m) =>
      ["3rd place", "3rdplace", "third place", "3rd"].includes(
        m.stage.toLowerCase()
      ) && m.hasResult
  );

  return (
    <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 rounded-xl border border-slate-700/50 overflow-hidden backdrop-blur-sm">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-700/20 transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <span className="text-lg">{sportData.icon}</span>
          <div className="p-1 rounded-lg bg-cyan-500/10">
            <Icon className="w-4 h-4 text-cyan-400" />
          </div>
          <span className="font-bold text-slate-200 text-sm">
            {sportData.sportName}
          </span>
          <span className="text-[10px] text-slate-500 hidden sm:inline">
            📍 {sportData.venue}
          </span>
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-700/50 text-slate-400">
            {leagueCount}/6 played
          </span>
        </div>
        {expanded ? (
          <ChevronUp className="w-4 h-4 text-slate-400" />
        ) : (
          <ChevronDown className="w-4 h-4 text-slate-400" />
        )}
      </button>

      {expanded && (
        <div className="px-3 pb-3">
          {leagueCount === 0 ? (
            <div className="text-center py-6 text-slate-500 text-sm">
              <p>No league results yet</p>
              <p className="text-xs text-slate-600 mt-1">
                Once matches are played, the points table will be updated here
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="text-slate-500 uppercase tracking-wider border-b border-slate-700/50">
                      <th className="text-left py-2 px-2">#</th>
                      <th className="text-left py-2 px-2">Team</th>
                      <th className="text-center py-2 px-1">P</th>
                      <th className="text-center py-2 px-1">W</th>
                      <th className="text-center py-2 px-1">L</th>
                      <th className="text-center py-2 px-1">D</th>
                      <th className="text-center py-2 px-2 text-cyan-400 font-bold">
                        PTS
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {table.map((row, i) => {
                      const tc = getTeamColor(row.team);
                      return (
                        <tr
                          key={row.team}
                          className={`border-b border-slate-800/50 ${i < 2 ? "bg-cyan-500/5" : ""} hover:bg-slate-700/20 transition-colors`}
                        >
                          <td className="py-2.5 px-2 font-bold text-slate-500">
                            {i + 1}
                          </td>
                          <td
                            className={`py-2.5 px-2 font-semibold ${tc.text}`}
                          >
                            {row.team}
                            {i < 2 && (
                              <span className="ml-1 text-[9px] text-cyan-600">
                                ▲
                              </span>
                            )}
                            {i >= 2 && row.played > 0 && (
                              <span className="ml-1 text-[9px] text-slate-600">
                                ▼
                              </span>
                            )}
                          </td>
                          <td className="text-center py-2.5 px-1 text-slate-300">
                            {row.played}
                          </td>
                          <td className="text-center py-2.5 px-1 text-emerald-400 font-semibold">
                            {row.won}
                          </td>
                          <td className="text-center py-2.5 px-1 text-red-400">
                            {row.lost}
                          </td>
                          <td className="text-center py-2.5 px-1 text-slate-400">
                            {row.drawn}
                          </td>
                          <td className="text-center py-2.5 px-2 font-black text-cyan-400 text-sm">
                            {row.points}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <p className="text-[10px] text-slate-600 mt-2 px-2 mb-2">
                Top 2 → Final • Bottom 2 → 3rd Place • W=3pts D=1pt L=0pts •
                Tiebreaker: Wins → Head-to-head
              </p>

              {(finalMatch || thirdMatch) && (
                <div className="mt-2 pt-2 border-t border-slate-700/30 space-y-1.5 px-1">
                  {thirdMatch && (
                    <div className="flex items-center justify-between text-xs bg-slate-800/40 rounded-lg p-2.5">
                      <span className="text-slate-500 font-semibold uppercase text-[10px] w-20">
                        3rd Place
                      </span>
                      <span className="text-slate-300 flex-1 text-center truncate px-2">
                        {thirdMatch.teamA}
                        <span className="text-slate-500 mx-1">
                          {thirdMatch.isFreeform ? "vs" : thirdMatch.scoreRaw}
                        </span>
                        {thirdMatch.teamB}
                      </span>
                      <span
                        className={`font-bold ${getTeamColor(thirdMatch.winner).text} flex-shrink-0`}
                      >
                        🥉 {thirdMatch.winner}
                      </span>
                    </div>
                  )}
                  {finalMatch && (
                    <div className="flex items-center justify-between text-xs bg-gradient-to-r from-amber-500/10 to-amber-500/5 rounded-lg p-2.5 border border-amber-500/20">
                      <span className="text-amber-500 font-bold uppercase text-[10px] w-20">
                        Final
                      </span>
                      <span className="text-slate-200 font-semibold flex-1 text-center truncate px-2">
                        {finalMatch.teamA}
                        <span className="text-amber-400 mx-1">
                          {finalMatch.isFreeform ? "vs" : finalMatch.scoreRaw}
                        </span>
                        {finalMatch.teamB}
                      </span>
                      <span
                        className={`font-bold ${getTeamColor(finalMatch.winner).text} flex-shrink-0`}
                      >
                        🏆 {finalMatch.winner}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// ATHLETICS / WEIGHTLIFTING TABLE — Medal tally + event results with performance
// ─────────────────────────────────────────────────────────────
function AthleticsTable({ sportData, startExpanded }) {
  const [expanded, setExpanded] = useState(startExpanded);
  const [showEvents, setShowEvents] = useState(false);
  const tally = useMemo(() => computeAthleticsTally(sportData), [sportData]);
  const Icon = getSportIcon(sportData.sportName);

  const totalEvents = sportData.events?.length || 0;
  const decidedEvents =
    sportData.events?.filter((e) => e.hasResult).length || 0;

  const isWeightlifting = sportData.sportName
    .toLowerCase()
    .includes("weightlift");

  const accentColor = isWeightlifting ? "purple" : "orange";
  const accentClasses = {
    orange: {
      border: "border-orange-500/30",
      iconBg: "bg-orange-500/10",
      iconText: "text-orange-400",
      badge: "bg-orange-500/10 text-orange-400 ring-orange-500/20",
      rowHighlight: "bg-orange-500/5",
      pointsText: "text-orange-400",
      crown: "text-orange-500",
      headerGradient: "from-orange-400 to-red-400",
    },
    purple: {
      border: "border-purple-500/30",
      iconBg: "bg-purple-500/10",
      iconText: "text-purple-400",
      badge: "bg-purple-500/10 text-purple-400 ring-purple-500/20",
      rowHighlight: "bg-purple-500/5",
      pointsText: "text-purple-400",
      crown: "text-purple-500",
      headerGradient: "from-purple-400 to-pink-400",
    },
  };
  const ac = accentClasses[accentColor];

  const eventsByCategory = useMemo(() => {
    if (!sportData.events) return {};
    const groups = {};
    sportData.events.forEach((e) => {
      const cat = e.category || "General";
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(e);
    });
    return groups;
  }, [sportData]);

  return (
    <div
      className={`bg-gradient-to-br from-slate-800/60 to-slate-900/60 rounded-xl border ${ac.border} overflow-hidden backdrop-blur-sm`}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-700/20 transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <span className="text-lg">{sportData.icon}</span>
          <div className={`p-1 rounded-lg ${ac.iconBg}`}>
            <Icon className={`w-4 h-4 ${ac.iconText}`} />
          </div>
          <span className="font-bold text-slate-200 text-sm">
            {sportData.sportName}
          </span>
          <span className="text-[10px] text-slate-500 hidden sm:inline">
            📍 {sportData.venue}
          </span>
          <span
            className={`text-[10px] px-1.5 py-0.5 rounded-full ring-1 ${ac.badge}`}
          >
            {decidedEvents}/{totalEvents} events
          </span>
        </div>
        {expanded ? (
          <ChevronUp className="w-4 h-4 text-slate-400" />
        ) : (
          <ChevronDown className="w-4 h-4 text-slate-400" />
        )}
      </button>

      {expanded && (
        <div className="px-3 pb-3">
          {decidedEvents === 0 ? (
            <div className="text-center py-6 text-slate-500 text-sm">
              <p>No event results yet</p>
              <p className="text-xs text-slate-600 mt-1">
                Once events are completed, the medal tally and results will be updated here
              </p>
            </div>
          ) : (
            <>
              {/* Medal Tally */}
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="text-slate-500 uppercase tracking-wider border-b border-slate-700/50">
                      <th className="text-left py-2 px-2">#</th>
                      <th className="text-left py-2 px-2">Team</th>
                      <th className="text-center py-2 px-2">🥇</th>
                      <th className="text-center py-2 px-2">🥈</th>
                      <th className="text-center py-2 px-2">🥉</th>
                      <th
                        className={`text-center py-2 px-2 ${ac.pointsText} font-bold`}
                      >
                        PTS
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {tally.map((row, i) => {
                      const tc = getTeamColor(row.team);
                      return (
                        <tr
                          key={row.team}
                          className={`border-b border-slate-800/50 ${i === 0 ? ac.rowHighlight : ""} hover:bg-slate-700/20 transition-colors`}
                        >
                          <td className="py-2.5 px-2 font-bold text-slate-500">
                            {i + 1}
                          </td>
                          <td
                            className={`py-2.5 px-2 font-semibold ${tc.text}`}
                          >
                            {row.team}
                            {i === 0 && row.totalPoints > 0 && (
                              <span className={`ml-1 text-[9px] ${ac.crown}`}>
                                👑
                              </span>
                            )}
                          </td>
                          <td className="text-center py-2.5 px-2 text-amber-400 font-bold">
                            {row.golds}
                          </td>
                          <td className="text-center py-2.5 px-2 text-slate-300 font-semibold">
                            {row.silvers}
                          </td>
                          <td className="text-center py-2.5 px-2 text-amber-600 font-semibold">
                            {row.bronzes}
                          </td>
                          <td
                            className={`text-center py-2.5 px-2 font-black ${ac.pointsText} text-sm`}
                          >
                            {row.totalPoints}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <p className="text-[10px] text-slate-600 mt-2 px-2 mb-2">
                🥇={ATHLETICS_EVENT_POINTS["1st"]}pts • 🥈=
                {ATHLETICS_EVENT_POINTS["2nd"]}pts • 🥉=
                {ATHLETICS_EVENT_POINTS["3rd"]}pts per event
              </p>

              {/* Toggle Events */}
              <button
                onClick={() => setShowEvents(!showEvents)}
                className="w-full mt-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 transition-colors text-xs text-slate-400 hover:text-slate-200"
              >
                {showEvents ? (
                  <ChevronUp className="w-3 h-3" />
                ) : (
                  <ChevronDown className="w-3 h-3" />
                )}
                {showEvents
                  ? "Hide Event Results"
                  : `Show All ${totalEvents} Event Results`}
              </button>

              {/* Event Results with Performance */}
              {showEvents && (
                <div className="mt-2 space-y-3">
                  {Object.entries(eventsByCategory).map(
                    ([category, events]) => (
                      <div key={category}>
                        <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-2 mb-1.5">
                          {category}
                        </h4>
                        <div className="space-y-1">
                          {events.map((e) => {
                            const firstTC = getTeamColor(e.first);
                            const secondTC = getTeamColor(e.second);
                            const thirdTC = getTeamColor(e.third);
                            const hasPerf =
                              e.perf1 || e.perf2 || e.perf3;

                            return (
                              <div
                                key={e.id}
                                className={`rounded-lg p-2.5 ${
                                  e.hasResult
                                    ? "bg-slate-800/40"
                                    : "bg-slate-900/30 opacity-50"
                                }`}
                              >
                                {/* Event name + date */}
                                <div className="flex items-center justify-between mb-1.5">
                                  <span className="font-semibold text-slate-300 text-[11px]">
                                    {e.eventName}
                                  </span>
                                  {e.date && (
                                    <span className="text-[9px] text-slate-600">
                                      {e.date}
                                    </span>
                                  )}
                                </div>

                                {e.hasResult ? (
                                  <div className="flex items-center gap-3 flex-wrap">
                                    {/* 1st */}
                                    <div className="flex items-center gap-1">
                                      <span className="text-[10px]">🥇</span>
                                      <span
                                        className={`font-bold text-[11px] ${firstTC.text}`}
                                      >
                                        {e.first}
                                      </span>
                                      {hasPerf && e.perf1 && (
                                        <span className="text-[9px] text-slate-500 font-mono ml-0.5">
                                          ({e.perf1})
                                        </span>
                                      )}
                                    </div>

                                    {/* 2nd */}
                                    <div className="flex items-center gap-1">
                                      <span className="text-[10px]">🥈</span>
                                      <span
                                        className={`font-semibold text-[11px] ${secondTC.text}`}
                                      >
                                        {e.second}
                                      </span>
                                      {hasPerf && e.perf2 && (
                                        <span className="text-[9px] text-slate-500 font-mono ml-0.5">
                                          ({e.perf2})
                                        </span>
                                      )}
                                    </div>

                                    {/* 3rd */}
                                    <div className="flex items-center gap-1">
                                      <span className="text-[10px]">🥉</span>
                                      <span
                                        className={`font-medium text-[11px] ${thirdTC.text}`}
                                      >
                                        {e.third}
                                      </span>
                                      {hasPerf && e.perf3 && (
                                        <span className="text-[9px] text-slate-500 font-mono ml-0.5">
                                          ({e.perf3})
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                ) : (
                                  <span className="text-[10px] text-slate-600 italic">
                                    Pending
                                  </span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )
                  )}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// CHAMPIONSHIP TABLE
// ─────────────────────────────────────────────────────────────
function ChampionshipTable({ allSports }) {
  const table = useMemo(
    () => computeOverallChampionship(allSports),
    [allSports]
  );

  const decidedCount = useMemo(() => {
    let count = 0;
    allSports.forEach((s) => {
      if (!s) return;
      if (s.isAthletics) {
        if (s.events?.some((e) => e.hasResult)) count++;
      } else {
        if (
          s.matches?.some(
            (m) =>
              m.stage.toLowerCase() === "final" && m.hasResult && m.winner
          )
        )
          count++;
      }
    });
    return count;
  }, [allSports]);

  const rankStyles = [
    {
      icon: <Trophy className="w-6 h-6 text-amber-400" />,
      ring: "ring-amber-400/30",
    },
    {
      icon: <Medal className="w-6 h-6 text-slate-300" />,
      ring: "ring-slate-400/30",
    },
    {
      icon: <Medal className="w-6 h-6 text-amber-600" />,
      ring: "ring-amber-600/30",
    },
    {
      icon: <Shield className="w-6 h-6 text-slate-600" />,
      ring: "ring-slate-600/30",
    },
  ];

  return (
    <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 rounded-xl border border-amber-500/30 overflow-hidden backdrop-blur-sm shadow-lg shadow-amber-500/5">
      <div className="px-4 py-3 border-b border-slate-700/50 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-amber-500/10">
            <Award className="w-5 h-5 text-amber-400" />
          </div>
          <h2 className="font-black text-lg text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-200 uppercase tracking-wider">
            Overall Championship
          </h2>
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-700/50 text-slate-400">
          {decidedCount}/{allSports.length} decided
        </span>
      </div>

      {decidedCount === 0 ? (
        <div className="p-6 text-center">
          <Trophy className="w-10 h-10 text-slate-700 mx-auto mb-2" />
          <p className="text-slate-500 text-sm">No sports decided yet</p>
          <p className="text-slate-600 text-xs mt-1">
            Points awarded after Finals, 3rd Place & event results
          </p>
          <div className="mt-3 text-[10px] text-slate-600">
            🏆 1st={CHAMPIONSHIP_POINTS["1st"]}pts • 🥈 2nd=
            {CHAMPIONSHIP_POINTS["2nd"]}pts • 🥉 3rd=
            {CHAMPIONSHIP_POINTS["3rd"]}pts • 4th=
            {CHAMPIONSHIP_POINTS["4th"]}pts
          </div>
        </div>
      ) : (
        <div className="p-3 space-y-2">
          {table.map((row, i) => {
            const tc = getTeamColor(row.team);
            const rs = rankStyles[i] || rankStyles[3];
            return (
              <div
                key={row.team}
                className={`flex items-center justify-between p-3 rounded-xl border transition-all hover:scale-[1.01] ${
                  i === 0
                    ? `${tc.border} bg-gradient-to-r ${tc.bg} shadow-md ${tc.glow}`
                    : "border-slate-700/40 bg-slate-800/40"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center bg-slate-900/60 ring-1 ${rs.ring}`}
                  >
                    {rs.icon}
                  </div>
                  <div>
                    <div className={`font-bold ${tc.text} text-sm`}>
                      {row.team}
                    </div>
                    <div className="flex gap-2.5 mt-0.5">
                      <span className="text-[10px] text-amber-400 font-medium">
                        🥇 {row.golds}
                      </span>
                      <span className="text-[10px] text-slate-300 font-medium">
                        🥈 {row.silvers}
                      </span>
                      <span className="text-[10px] text-amber-600 font-medium">
                        🥉 {row.bronzes}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div
                    className={`text-2xl font-black ${tc.text} tabular-nums`}
                  >
                    {row.totalPoints}
                  </div>
                  <div className="text-[10px] text-slate-500 uppercase">
                    Points
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {decidedCount > 0 && (
        <div className="px-4 pb-3">
          <p className="text-[10px] text-slate-600 text-center">
            🏆 1st={CHAMPIONSHIP_POINTS["1st"]} | 🥈 2nd=
            {CHAMPIONSHIP_POINTS["2nd"]} | 🥉 3rd={CHAMPIONSHIP_POINTS["3rd"]}{" "}
            | 4th={CHAMPIONSHIP_POINTS["4th"]} per sport
          </p>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// TABS
// ─────────────────────────────────────────────────────────────
const TAB_CONFIG = [
  { id: "live", label: "Live", icon: Radio, color: "red" },
  { id: "today", label: "Today", icon: Flame, color: "amber" },
  { id: "upcoming", label: "Upcoming", icon: Calendar, color: "cyan" },
  { id: "results", label: "Results", icon: Trophy, color: "emerald" },
  { id: "tables", label: "Standings", icon: TrendingUp, color: "fuchsia" },
];

const TAB_COLORS = {
  red: { active: "bg-red-500/20 border-red-500/50 text-red-400" },
  amber: { active: "bg-amber-500/20 border-amber-500/50 text-amber-400" },
  cyan: { active: "bg-cyan-500/20 border-cyan-500/50 text-cyan-400" },
  emerald: {
    active: "bg-emerald-500/20 border-emerald-500/50 text-emerald-400",
  },
  fuchsia: {
    active: "bg-fuchsia-500/20 border-fuchsia-500/50 text-fuchsia-400",
  },
};

// ─────────────────────────────────────────────────────────────
// MAIN APP
// ─────────────────────────────────────────────────────────────
export default function App() {
  const [allSports, setAllSports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [now, setNow] = useState(new Date());
  const [activeTab, setActiveTab] = useState("tables");
  const [sportFilter, setSportFilter] = useState("");
  const [teamFilter, setTeamFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const iv = setInterval(() => setNow(new Date()), 15000);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    const on = () => setIsOnline(true);
    const off = () => setIsOnline(false);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => {
      window.removeEventListener("online", on);
      window.removeEventListener("offline", off);
    };
  }, []);

  const fetchAll = useCallback(async () => {
    try {
      if (IS_DEV) {
        const entries = Object.entries(DEV_SPORT_SHEETS);
        const results = await Promise.all(
          entries.map(async ([name, url]) => {
            try {
              const raw = await fetchRawCSV(url);
              return parseSportSheet(raw, name);
            } catch (e) {
              console.error(`❌ Error fetching ${name}:`, e);
              return null;
            }
          })
        );
        const valid = results.filter(Boolean);
        setAllSports(valid);
        setLastUpdated(new Date());
        setError(
          valid.length === 0 ? "No sport sheets loaded. Check URLs." : null
        );
      } else {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const allCSV = await response.json();

        const results = Object.entries(allCSV)
          .map(([name, csvText]) => {
            if (!csvText) return null;
            try {
              const raw = parseCSVText(csvText);
              return parseSportSheet(raw, name);
            } catch (e) {
              console.error(`❌ Error parsing ${name}:`, e);
              return null;
            }
          })
          .filter(Boolean);

        setAllSports(results);
        setLastUpdated(new Date());
        setError(results.length === 0 ? "No sport sheets loaded." : null);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to load data. Retrying...");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
    const iv = setInterval(fetchAll, POLL_INTERVAL);
    return () => clearInterval(iv);
  }, [fetchAll]);

  const allMatches = useMemo(
    () => allSports.filter((s) => !s.isAthletics).flatMap((s) => s.matches),
    [allSports]
  );

  const sportNames = useMemo(
    () => allSports.map((s) => s.sportName).sort(),
    [allSports]
  );

  const classified = useMemo(() => {
    const live = [],
      today = [],
      upcoming = [],
      past = [];
    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

    allMatches.forEach((m) => {
      const status = getMatchStatus(m, now);
      const enriched = { ...m, _status: status };
      if (status.isLive) live.push(enriched);
      else if (status.isPast) past.push(enriched);
      else if (status.isUpcoming) {
        if (m.date === todayStr) today.push(enriched);
        else upcoming.push(enriched);
      }
    });

    live.sort(
      (a, b) => (parseMatchDateTime(a) || 0) - (parseMatchDateTime(b) || 0)
    );
    today.sort(
      (a, b) => (parseMatchDateTime(a) || 0) - (parseMatchDateTime(b) || 0)
    );
    upcoming.sort(
      (a, b) => (parseMatchDateTime(a) || 0) - (parseMatchDateTime(b) || 0)
    );
    past.sort(
      (a, b) => (parseMatchDateTime(b) || 0) - (parseMatchDateTime(a) || 0)
    );

    return { live, today, upcoming, past };
  }, [allMatches, now]);

  const filterMatches = useCallback(
    (list) =>
      list.filter((m) => {
        if (
          sportFilter &&
          m.sport?.toLowerCase() !== sportFilter.toLowerCase()
        )
          return false;
        if (teamFilter && m.teamA !== teamFilter && m.teamB !== teamFilter)
          return false;
        if (searchQuery) {
          const q = searchQuery.toLowerCase();
          if (
            !`${m.sport} ${m.teamA} ${m.teamB} ${m.venue} ${m.date} ${m.stage}`
              .toLowerCase()
              .includes(q)
          )
            return false;
        }
        return true;
      }),
    [sportFilter, teamFilter, searchQuery]
  );

  useEffect(() => {
    if (classified.live.length > 0) setActiveTab("live");
  }, [classified.live.length]);

  const teamSports = useMemo(
    () => allSports.filter((s) => !s.isAthletics),
    [allSports]
  );
  const multiEventSports = useMemo(
    () => allSports.filter((s) => s.isAthletics),
    [allSports]
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 rounded-full border-2 border-cyan-500/30 animate-ping" />
            <div className="absolute inset-2 rounded-full border-2 border-t-cyan-400 animate-spin" />
            <Trophy className="absolute inset-4 w-8 h-8 text-cyan-400" />
          </div>
          <p className="text-cyan-400 font-bold animate-pulse text-sm">
            Loading Tournament...
          </p>
        </div>
      </div>
    );
  }

  if (error && allSports.length === 0) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="text-center max-w-md bg-slate-900 rounded-xl p-6 border border-red-500/30">
          <WifiOff className="w-12 h-12 text-red-400 mx-auto mb-3" />
          <h2 className="text-red-400 font-bold text-lg mb-2">
            Connection Error
          </h2>
          <p className="text-slate-400 text-sm mb-4">{error}</p>
          <button
            onClick={fetchAll}
            className="px-4 py-2 bg-cyan-500 text-white rounded-lg text-sm font-bold hover:bg-cyan-400 transition-colors inline-flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" /> Retry
          </button>
        </div>
      </div>
    );
  }

  const currentList = (() => {
    switch (activeTab) {
      case "live":
        return filterMatches(classified.live);
      case "today":
        return filterMatches(classified.today);
      case "upcoming":
        return filterMatches(classified.upcoming);
      case "results":
        return filterMatches(classified.past);
      default:
        return [];
    }
  })();

  const tabCounts = {
    live: classified.live.length,
    today: classified.today.length,
    upcoming: classified.upcoming.length,
    results: classified.past.length,
    tables: null,
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white relative">
      <FloatingParticles />

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0.08; }
          33% { transform: translateY(-25px) translateX(12px); opacity: 0.18; }
          66% { transform: translateY(-12px) translateX(-8px); opacity: 0.12; }
        }
        .animate-float { animation: float 18s infinite ease-in-out; }
        @keyframes scroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .animate-scroll { animation: scroll 35s linear infinite; }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 5px rgba(239,68,68,0.3); }
          50% { box-shadow: 0 0 25px rgba(239,68,68,0.5); }
        }
        .animate-pulse-glow { animation: pulse-glow 2s infinite; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        .tab-enter { animation: fadeUp 0.25s ease-out; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
      `}</style>

      <header className="relative z-10 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-cyan-500/20">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-fuchsia-500 rounded-xl blur opacity-30" />
              <div className="relative p-2 bg-slate-900 rounded-xl">
                <Trophy className="w-6 h-6 text-amber-400" />
              </div>
            </div>
            <div>
              <h1 className="text-base sm:text-xl font-black uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-amber-400">
                Inter Year Sports 2026
              </h1>
              <p className="text-[9px] sm:text-[10px] text-slate-500 uppercase tracking-widest">
                Inter-Year Championship • {sportNames.length} Sports
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-[10px] text-slate-500">
            {isOnline ? (
              <Wifi className="w-3 h-3 text-emerald-400" />
            ) : (
              <WifiOff className="w-3 h-3 text-red-400" />
            )}
            {lastUpdated && (
              <span className="hidden sm:inline">
                {lastUpdated.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            )}
            <button
              onClick={fetchAll}
              className="p-1 rounded hover:bg-slate-700/50 transition-colors"
              title="Refresh"
            >
              <RefreshCw className="w-3.5 h-3.5 text-slate-500 hover:text-cyan-400" />
            </button>
          </div>
        </div>
      </header>

      <NewsTicker allMatches={allMatches} />

      <main className="relative z-10 max-w-7xl mx-auto px-3 sm:px-4 py-4">
        {classified.live.length > 0 && (
          <div className="mb-4 p-3 rounded-xl bg-gradient-to-r from-red-500/10 via-red-500/5 to-red-500/10 border border-red-500/30 flex items-center justify-center gap-2 animate-pulse-glow">
            <Radio className="w-4 h-4 text-red-400 animate-pulse" />
            <span className="text-sm font-bold text-red-400">
              {classified.live.length} Match
              {classified.live.length > 1 ? "es" : ""} Live Now!
            </span>
          </div>
        )}

        <div className="mb-4 space-y-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search matches, sports, teams..."
              className="w-full pl-9 pr-9 py-2.5 bg-slate-900/80 border border-slate-700/50 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/30 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <X className="w-4 h-4 text-slate-500 hover:text-slate-300" />
              </button>
            )}
          </div>
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
            <select
              value={sportFilter}
              onChange={(e) => setSportFilter(e.target.value)}
              className="flex-shrink-0 px-3 py-1.5 bg-slate-900/80 border border-slate-700/50 rounded-lg text-xs text-slate-300 focus:border-cyan-500/50 focus:outline-none"
            >
              <option value="">All Sports</option>
              {sportNames.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <select
              value={teamFilter}
              onChange={(e) => setTeamFilter(e.target.value)}
              className="flex-shrink-0 px-3 py-1.5 bg-slate-900/80 border border-slate-700/50 rounded-lg text-xs text-slate-300 focus:border-cyan-500/50 focus:outline-none"
            >
              <option value="">All Teams</option>
              {TEAMS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            {(sportFilter || teamFilter || searchQuery) && (
              <button
                onClick={() => {
                  setSportFilter("");
                  setTeamFilter("");
                  setSearchQuery("");
                }}
                className="flex-shrink-0 px-3 py-1.5 bg-red-500/10 border border-red-500/30 rounded-lg text-xs text-red-400 hover:bg-red-500/20 transition-colors flex items-center gap-1"
              >
                <X className="w-3 h-3" /> Clear
              </button>
            )}
          </div>
        </div>

        <div className="flex gap-1 mb-5 overflow-x-auto scrollbar-hide pb-1">
          {TAB_CONFIG.map(({ id, label, icon: TabIcon, color }) => {
            const count = tabCounts[id];
            const isActive = activeTab === id;
            return (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all border whitespace-nowrap ${
                  isActive
                    ? TAB_COLORS[color].active
                    : "border-slate-700/30 text-slate-500 hover:text-slate-300 hover:border-slate-600/50"
                }`}
              >
                <TabIcon className="w-3.5 h-3.5" />
                {label}
                {count !== null && count > 0 && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full ${isActive ? "bg-white/10" : "bg-slate-800"}`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="tab-enter" key={activeTab}>
          {activeTab !== "tables" ? (
            currentList.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-800/50 flex items-center justify-center">
                  {activeTab === "live" ? (
                    <Radio className="w-7 h-7 text-slate-600" />
                  ) : (
                    <Calendar className="w-7 h-7 text-slate-600" />
                  )}
                </div>
                <p className="text-slate-500 font-medium text-sm">
                  {activeTab === "live"
                    ? "No matches are live right now"
                    : `No ${activeTab} matches found`}
                </p>
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {currentList.map((m) => (
                  <MatchCard key={m.id} match={m} status={m._status} />
                ))}
              </div>
            )
          ) : (
            <div className="space-y-6">
              <ChampionshipTable allSports={allSports} />

              {teamSports.length > 0 && (
                <div>
                  <div className="flex items-center gap-2.5 mb-4">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-400">
                      <TrendingUp className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="font-black text-lg text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 uppercase tracking-wider">
                      Sport Standings
                    </h2>
                  </div>
                  <div className="space-y-2">
                    {teamSports
                      .filter(
                        (s) =>
                          !sportFilter ||
                          s.sportName.toLowerCase() ===
                            sportFilter.toLowerCase()
                      )
                      .map((s, i) => (
                        <SportPointsTable
                          key={s.sportName}
                          sportData={s}
                          startExpanded={i === 0}
                        />
                      ))}
                  </div>
                </div>
              )}

              {multiEventSports.length > 0 && (
                <div>
                  <div className="flex items-center gap-2.5 mb-4">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-orange-400 to-red-400">
                      <Timer className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="font-black text-lg text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-400 uppercase tracking-wider">
                      Multi-Event Sports
                    </h2>
                  </div>
                  <div className="space-y-2">
                    {multiEventSports
                      .filter(
                        (s) =>
                          !sportFilter ||
                          s.sportName.toLowerCase() ===
                            sportFilter.toLowerCase()
                      )
                      .map((s, i) => (
                        <AthleticsTable
                          key={s.sportName}
                          sportData={s}
                          startExpanded={i === 0}
                        />
                      ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <footer className="relative z-10 border-t border-slate-800/50 mt-8 py-4 text-center text-[10px] text-slate-600">
        Inter Year 2026 • Developed by Mohit • Last updated 
        {now.toLocaleDateString([], {
          weekday: "short",
          month: "short",
          day: "numeric",
        })}{" "}
        {now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
      </footer>
    </div>
  );
}