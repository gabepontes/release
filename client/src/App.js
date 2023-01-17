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
        </div>
      ) : (
        <p>Enter a summoner name to get player info</p>
      )}
    </div>
  )
}

export default App
