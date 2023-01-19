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
          <div>
            <h3>Match History:</h3>
            <table>
              <thead>
                <tr>
                  <th>Match ID</th>
                  <th>Champion</th>
                  <th>Outcome</th>
                  <th>Kills</th>
                  <th>Deaths</th>
                  <th>Assists</th>
                  <th>KDA</th>
                  <th>Items</th>
                  <th>Farm</th>
                </tr>
              </thead>
              <tbody>
                {player.match_history.map(match => (
                  <tr key={match.matchId}>
                    <td>{match.matchId}</td>
                    <td>{match.champion}</td>
                    <td>{match.win ? 'Win' : 'Loss'}</td>
                    <td>{match.kills}</td>
                    <td>{match.deaths}</td>
                    <td>{match.assists}</td>
                    <td>{match.kda}</td>
                    <td>{match.items}</td>
                    <td>{match.farm}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {player.sorted_champion_stats.error ? <p>{player.sorted_champion_stats.error}</p> : 
          <div>
            <h3>Sorted Best Champ List:</h3>
            <table>
              <thead>
                <tr>
                  <th>Champion</th>
                  <th>Champion</th>
                  <th>Games</th>
                  <th>Wins</th>
                  <th>Losses</th>
                  <th>KDA</th>
                  <th>Items</th>
                  <th>Farm</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(player.sorted_champion_stats).map(([champion, stats]) => (
                  <tr key={champion}>
                    <td>{champion}</td>
                    <td>{stats.games}</td>
                    <td>{stats.wins}</td>
                    <td>{stats.losses}</td>
                    <td>{stats.kda}</td>
                    <td>{stats.items}</td>
                    <td>{stats.farm}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          }
        </div>
      ) : null}
    </div>
  )
}
export default App