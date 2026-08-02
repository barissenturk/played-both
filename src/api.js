const BASE = (import.meta.env.VITE_API_URL || "/api").replace(/\/$/, "");

async function request(path) {
  const res = await fetch(`${BASE}${path}`);
  if (!res.ok) {
    let message = "İstek başarısız";
    try {
      const body = await res.json();
      message = body.error || message;
    } catch {
      /* ignore */
    }
    throw new Error(message);
  }
  return res.json();
}

export function searchTeams(q, { seeded = false, limit = 12 } = {}) {
  const params = new URLSearchParams({ limit: String(limit) });
  if (q) params.set("q", q);
  if (seeded) params.set("seeded", "1");
  return request(`/teams?${params}`);
}

export function getCommonPlayers(team1, team2) {
  const params = new URLSearchParams({
    team1: team1.id || team1,
    team2: team2.id || team2,
  });
  return request(`/common-players?${params}`);
}
