import { useState } from "react";
import { getCommonPlayers } from "./api";
import TeamSelect from "./components/TeamSelect";
import PlayerResults from "./components/PlayerResults";

export default function App() {
  const [team1, setTeam1] = useState(null);
  const [team2, setTeam2] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    if (!team1 || !team2) {
      setError("İki takım da seçilmeli.");
      return;
    }

    setLoading(true);
    setError("");
    setData(null);

    try {
      const result = await getCommonPlayers(team1, team2);
      setData(result);
      requestAnimationFrame(() => {
        document.getElementById("results")?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      });
    } catch (err) {
      setError(err.message || "Bir hata oluştu");
    } finally {
      setLoading(false);
    }
  }

  function swapTeams() {
    setTeam1(team2);
    setTeam2(team1);
    setData(null);
    setError("");
  }

  return (
    <div className="page">
      <div className="pitch" aria-hidden="true" />

      <main className="shell">
        <header className="hero">
          <p className="brand">KESİŞİM</p>
          <h1>İki takımda forma giymiş oyuncuları bul.</h1>
          <p className="lede">
            Takımları seç, kariyerleri kesişen futbolcuları listele.
          </p>
        </header>

        <form className="matchup" onSubmit={onSubmit}>
          <div className="matchup__teams">
            <TeamSelect
              label="Takım 1"
              value={team1}
              onChange={(t) => {
                setTeam1(t);
                setData(null);
                setError("");
              }}
              excludeId={team2?.id}
            />

            <button
              type="button"
              className="matchup__swap"
              onClick={swapTeams}
              disabled={!team1 && !team2}
              aria-label="Takımları yer değiştir"
            >
              ⇄
            </button>

            <TeamSelect
              label="Takım 2"
              value={team2}
              onChange={(t) => {
                setTeam2(t);
                setData(null);
                setError("");
              }}
              excludeId={team1?.id}
            />
          </div>

          <button
            type="submit"
            className="matchup__submit"
            disabled={!team1 || !team2 || loading}
          >
            {loading ? "Aranıyor…" : "Ortak oyuncuları getir"}
          </button>
        </form>

        <div id="results">
          <PlayerResults data={data} loading={loading} error={error} />
        </div>
      </main>
    </div>
  );
}
