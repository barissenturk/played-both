function yearRange(start, end) {
  if (!start && !end) return "yıl bilinmiyor";
  if (start && end) return `${start}–${end}`;
  if (start) return `${start}–`;
  return `–${end}`;
}

export default function PlayerResults({ data, loading, error }) {
  if (loading) {
    return (
      <section className="results" aria-live="polite">
        <p className="results__status">Ortak oyuncular aranıyor…</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="results" aria-live="polite">
        <p className="results__status results__status--error">{error}</p>
      </section>
    );
  }

  if (!data) return null;

  const { team1, team2, players, count } = data;

  return (
    <section className="results" aria-live="polite">
      <header className="results__head">
        <h2>
          <span>{count}</span> ortak oyuncu
        </h2>
        <p>
          {team1.name} ∩ {team2.name}
        </p>
      </header>

      {count === 0 ? (
        <p className="results__status">Bu iki takımda ortak oyuncu bulunamadı.</p>
      ) : (
        <ul className="player-list">
          {players.map((player, index) => (
            <li
              key={player.id}
              className="player-row"
              style={{ "--i": index }}
            >
              {player.imageUrl ? (
                <img
                  src={player.imageUrl}
                  alt=""
                  className="player-row__photo"
                  loading="lazy"
                />
              ) : (
                <span className="player-row__photo player-row__photo--empty">
                  {player.name.slice(0, 1)}
                </span>
              )}

              <div className="player-row__main">
                <h3>{player.name}</h3>
                <div className="player-row__stints">
                  <span>
                    <strong>{team1.name}</strong>
                    <em>{yearRange(player.stints?.team1?.startYear, player.stints?.team1?.endYear)}</em>
                  </span>
                  <span>
                    <strong>{team2.name}</strong>
                    <em>{yearRange(player.stints?.team2?.startYear, player.stints?.team2?.endYear)}</em>
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
