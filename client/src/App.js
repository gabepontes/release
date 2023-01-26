import React, { useState, useEffect } from 'react'
import 'bulma/css/bulma.min.css';

function App() {
  const [matches, setMatches] = useState({});
  const [summonerName, setSummonerName] = useState('');

  useEffect(() => {
    console.log(matches);
  }, [matches]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (summonerName) {
      fetch(`/members/${summonerName}`)
        .then(res => {
          if (!res.ok) {
            throw Error(res.statusText);
          }
          return res.json();
        })
        .then(data => {
          setMatches(data);
        })
        .catch(error => {
          console.log(error);
          alert("Error fetching data");
        });
    }
  }

  return (
    <div class="section">
    <div className="App">
      <form>
        <label>
          Summoner Name:
          <input type="text" value={summonerName} onChange={e => setSummonerName(e.target.value)} />
        </label>
        <button class="button is-info" type="submit" onClick={handleSubmit}>Get Player Info</button>
      </form>
      {matches.length > 0 ? (
        <div>
          <h3>Match History:</h3>
          <table class="table is-bordered is-fullwidth is-striped">
  <thead>
    <tr>
      <th>Match ID</th>
      <th>Summoner Name</th>
      <th>Champion Name</th>
      <th>Kills</th>
      <th>Deaths</th>
      <th>Assists</th>
      <th>Total Minions Killed</th>
      <th>Item 0</th>
      <th>Item 1</th>
      <th>Item 2</th>
      <th>Item 3</th>
      <th>Item 4</th>
      <th>Item 5</th>
    </tr>
  </thead>
  <tbody>
  {matches.map((match, index) => (
  <>
    {index !== 0 && <div className="separator"></div>}
    <tr key={match.match_id}>
      <td>{match.match_id}</td>
      <td>{match.summoner_name}</td>
      <td>{match.champion_name}</td>
      <td>{match.kills}</td>
      <td>{match.deaths}</td>
      <td>{match.assists}</td>
      <td>{match.total_minions_killed}</td>
      {match.item0 !==0 ? <td><img src={`http://ddragon.leagueoflegends.com/cdn/13.1.1/img/item/${match.item0}.png`} alt="Item 0" /></td> : <td></td>}
      {match.item1 !==0 ? <td><img src={`http://ddragon.leagueoflegends.com/cdn/13.1.1/img/item/${match.item1}.png`} alt="Item 1" /></td> : <td></td>}
      {match.item2 !==0 ? <td><img src={`http://ddragon.leagueoflegends.com/cdn/13.1.1/img/item/${match.item2}.png`} alt="Item 2" /></td> : <td></td>}
      {match.item3 !==0 ? <td><img src={`http://ddragon.leagueoflegends.com/cdn/13.1.1/img/item/${match.item3}.png`} alt="Item 3" /></td> : <td></td>}
      {match.item4 !==0 ? <td><img src={`http://ddragon.leagueoflegends.com/cdn/13.1.1/img/item/${match.item4}.png`} alt="Item 4" /></td> : <td></td>}
      {match.item5 !==0 ? <td><img src={`http://ddragon.leagueoflegends.com/cdn/13.1.1/img/item/${match.item5}.png`} alt="Item 5" /></td> : <td></td>}  
    </tr>
    <div className="separator"></div>
  </>
))}
    </tbody>
  </table>     
        </div>
      ) : null}
    </div>
    </div>
  )
}
export default App;