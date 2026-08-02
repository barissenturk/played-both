import { useEffect, useId, useRef, useState } from "react";
import { searchTeams } from "../api";

export default function TeamSelect({ label, value, onChange, excludeId }) {
  const listId = useId();
  const rootRef = useRef(null);
  const [query, setQuery] = useState("");
  const [options, setOptions] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (value) setQuery(value.name);
  }, [value]);

  useEffect(() => {
    function onDocClick(e) {
      if (!rootRef.current?.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  useEffect(() => {
    if (!open) return undefined;

    const handle = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await searchTeams(query.trim(), {
          seeded: !query.trim(),
          limit: 10,
        });
        setOptions(
          (data.teams || []).filter((t) => t.id !== excludeId)
        );
      } catch {
        setOptions([]);
      } finally {
        setLoading(false);
      }
    }, query.trim() ? 220 : 0);

    return () => clearTimeout(handle);
  }, [query, open, excludeId]);

  function selectTeam(team) {
    onChange(team);
    setQuery(team.name);
    setOpen(false);
  }

  function clear() {
    onChange(null);
    setQuery("");
    setOpen(true);
  }

  return (
    <div className="team-select" ref={rootRef}>
      <span className="team-select__label">{label}</span>

      {value ? (
        <button
          type="button"
          className="team-select__chosen"
          onClick={clear}
          aria-label={`${value.name} seçimini kaldır`}
        >
          {value.logoUrl ? (
            <img src={value.logoUrl} alt="" className="team-select__logo" />
          ) : (
            <span className="team-select__logo team-select__logo--empty" />
          )}
          <span className="team-select__chosen-name">{value.name}</span>
          <span className="team-select__change">değiştir</span>
        </button>
      ) : (
        <div className="team-select__field">
          <input
            type="search"
            value={query}
            placeholder="Takım ara…"
            autoComplete="off"
            aria-autocomplete="list"
            aria-controls={listId}
            aria-expanded={open}
            onFocus={() => setOpen(true)}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
            }}
          />
        </div>
      )}

      {open && !value && (
        <ul id={listId} className="team-select__menu" role="listbox">
          {loading && <li className="team-select__hint">Aranıyor…</li>}
          {!loading && options.length === 0 && (
            <li className="team-select__hint">Sonuç yok</li>
          )}
          {!loading &&
            options.map((team) => (
              <li key={team.id}>
                <button
                  type="button"
                  role="option"
                  onClick={() => selectTeam(team)}
                >
                  {team.logoUrl ? (
                    <img src={team.logoUrl} alt="" />
                  ) : (
                    <span className="team-select__logo team-select__logo--empty" />
                  )}
                  <span>
                    <strong>{team.name}</strong>
                    {team.league && <small>{team.league}</small>}
                  </span>
                </button>
              </li>
            ))}
        </ul>
      )}
    </div>
  );
}
