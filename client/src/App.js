import React, { useState, useEffect } from 'react'

function App() {
  const [player, setPlayer] = useState({});
  const [summonerName, setSummonerName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (summonerName) {
      fetch(`/members/${summonerName}`)
        .then(res => res.json())
        .then(data => {
          if(data.error) {
            alert(`Error: ${data.error}`);
            return;
          }
          setPlayer(data);
        })
    }
  }

  return (
    <div className="App">
      <form>
        <label>
          Summoner Name:
          <input type="text" value={summonerName} onChange={e => setSummonerName(e.target.value)} />
        </label>
        <button type="submit" onClick={handleSubmit}>Get Player Info</button>
      </form>
      {player.name ? (
        <div>
          <p>Name: {player.name}</p>
          <p>Level: {player.level}</p>
          {player.sorted_champion_stats.error ? <p>{player.sorted_champion_stats.error}</p> : 
          <div>
            <h3>Sorted Best Champ List:</h3>
            <ul>
              {Object.entries(player.sorted_champion_stats).map(([champion, stats]) => (
                <li key={champion}>
                  Champion: {champion} | Win rate: {(stats.wins / (stats.wins + stats.losses) * 100).toFixed(2)}% | Games played: {stats.games}
                </li>
              ))}
            </ul>
          </div>
          }
        </div>
      ) : null}
    </div>
  )
}

export default App
