import React, { useState, useEffect } from 'react'
import CHALLENGER from './rankimg/CHALLENGER.png'
import GRANDMASTER from './rankimg/GRANDMASTER.png'
import MASTER from './rankimg/MASTER.png'
import DIAMOND from './rankimg/DIAMOND.png'
import PLATINUM from './rankimg/PLATINUM.png'
import GOLD from './rankimg/GOLD.png'
import SILVER from './rankimg/SILVER.png'
import BRONZE from './rankimg/BRONZE.png'
import IRON from './rankimg/IRON.png'
import UNRANKED from './rankimg/UNRANKED.png'
import 'bulma/css/bulma.min.css';

function App() {
  const [matches, setMatches] = useState({});
  const [playerData, setPlayerData] = useState({});
  const [Flex, setFlex] = useState({});
  const [summonerName, setSummonerName] = useState('');

  useEffect(() => {
    console.log(matches);
  }, [matches]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (summonerName) {
      fetch(`/members/${summonerName}`)
        .then(res => {
          if(!res.ok) {
            throw Error(res.statusText);
          }
          return res.json();
        })
        .then(data => {
          setPlayerData(data.player_data);
          setMatches(data.matches);
          setFlex(data.flex)
          console.log(matches);
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
            <div class="section">
              <div class="columns is-centered">
                <div class="column is-1">
                  <img src={`http://ddragon.leagueoflegends.com/cdn/13.1.1/img/profileicon/${playerData.icon}.png`} alt="Player Icon"></img>
                  <br></br>
                  Level {playerData.level}
                </div>
                <div class="column is-11">
                  {summonerName}
                </div>
              </div>
            </div>

            <div class="columns is-centered">

              <div class="column is-one-fourth">

                <div class="box has-background-link has-text-white has-text-weight-normal">
                <h1>Ranked Solo</h1>
                  <div class="section">
                    <div class="columns is-centered">
                      <div class="column is one-fourth">
                      {RenderImage()}
                      </div>
                      <div class="column is-two-fourths">
                        {playerData.soloRank}
                        <br></br>
                        {playerData.leaguePoints} LP
                      </div>
                      <div class="column is-one-fourth">
                        {playerData.wins}W {playerData.losses}L
                        <br></br>
                        {playerData.winrate}% Win Rate 
                      </div>
                    </div>
                  </div>
                </div>

                <div class="box has-background-link has-text-white has-text-weight-normal">
                  <h1>Ranked Flex</h1>
                </div>

                <div class="box has-background-link has-text-white has-text-weight-normal">
                  Top 5 Champions
                  <div class="columns is-centered">
                    <div class="column is-one-third">
                      Champion Name<br></br>
                      CS
                    </div>
                    <div class="column is-one-third">
                      : KDA<br></br>
                      Kills / Deaths / Assists
                    </div>
                    <div class="column is-one-third">
                      Win rate%<br></br>
                      NumGames Played
                    </div>
                  </div>
                </div>
              </div>

              <div class="column is-two-thirds">
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
                            {match.item0 !== 0 ? <td><img src={`http://ddragon.leagueoflegends.com/cdn/13.1.1/img/item/${match.item0}.png`} alt="Item 0" /></td> : <td></td>}
                            {match.item1 !== 0 ? <td><img src={`http://ddragon.leagueoflegends.com/cdn/13.1.1/img/item/${match.item1}.png`} alt="Item 1" /></td> : <td></td>}
                            {match.item2 !== 0 ? <td><img src={`http://ddragon.leagueoflegends.com/cdn/13.1.1/img/item/${match.item2}.png`} alt="Item 2" /></td> : <td></td>}
                            {match.item3 !== 0 ? <td><img src={`http://ddragon.leagueoflegends.com/cdn/13.1.1/img/item/${match.item3}.png`} alt="Item 3" /></td> : <td></td>}
                            {match.item4 !== 0 ? <td><img src={`http://ddragon.leagueoflegends.com/cdn/13.1.1/img/item/${match.item4}.png`} alt="Item 4" /></td> : <td></td>}
                            {match.item5 !== 0 ? <td><img src={`http://ddragon.leagueoflegends.com/cdn/13.1.1/img/item/${match.item5}.png`} alt="Item 5" /></td> : <td></td>}
                          </tr>
                          <div className="separator"></div>
                        </>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>

          </div>
        ) : null}
      </div>
    </div>
  )
  function RenderImage() {
    if(playerData.queueType != "RANKED_SOLO_5x5"){
      return <img src={UNRANKED} alt="Rank" />
    }
    switch (playerData.tier) {
      case 'CHALLENGER':
        return <img src={CHALLENGER} alt="Rank" />
      case 'GRANDMASTER':
        return <img src={GRANDMASTER} alt="Rank" />
      case 'MASTER':
        return <img src={MASTER} alt="Rank" />
      case 'DIAMOND':
        return <img src={DIAMOND} alt="Rank" />
      case 'PLATINUM':
        return <img src={PLATINUM} alt="Rank" />
      case 'GOLD':
        return <img src={GOLD} alt="Rank" />
      case 'SILVER':
        return <img src={SILVER} alt="Rank" />
      case 'BRONZE':
        return <img src={BRONZE} alt="Rank" />
      case 'IRON':
        return <img src={IRON} alt="Rank" />
      default:
        return <img src={UNRANKED} alt="Rank" />
    }
  }
}

export default App;