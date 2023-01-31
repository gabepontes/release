
import { BrowserRouter , Route} from "react-router-dom";
import React, { useState, useEffect } from 'react'

import CHALLENGER from './rankimg/CHALLENGER.png'
import GRANDMASTER from './rankimg/GRANDMASTER.png'
import MASTER from './rankimg/MASTER.png'
import DIAMOND from './rankimg/DIAMOND.png'
import PLATINUM from './rankimg/PLATINUM.png'
import GOLD from './rankimg/GOLD.png'
import SILVER from './rankimg/SILVER.png'
import logo from './rankimg/logo.png'
import BRONZE from './rankimg/BRONZE.png'
import IRON from './rankimg/IRON.png'
import UNRANKED from './rankimg/UNRANKED.png'
import styles from './initial-page.module.css';
import 'bulma/css/bulma.min.css';
import './App.css';

function InitialPage() {
  const [searchQuery, setSearchQuery] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    if (searchQuery) {
      window.location.assign(`/other-page?summonerName=${searchQuery}`);
    }
  }

  return (
    <div style={{ background: 'radial-gradient(circle at center, black, rgba(0, 0, 0, 0.906))', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <img src={logo} alt="Logo" className={styles.logo} />
      <form onSubmit={handleSubmit} className={styles.container}>
        <input type="text" placeholder="" onChange={(e) => setSearchQuery(e.target.value)} className={styles.searchInput} />
        <button type="submit" className={styles.searchButton}></button>
      </form>
    </div>
  );
}

function OtherPage() {
  const [matches, setMatches] = useState({});
  const [playerData, setPlayerData] = useState({});
  const [Flex, setFlex] = useState({});
  const [Main, setMain] = useState({});
  const [summonerName, setSummonerName] = useState('');
  const [top1, setTop1] = useState('');
  const [loading, setLoading] = useState(true);
  const [showExtraContent, setShowExtraContent] = useState(false);
  const [expandedIndexes, setExpandedIndexes] = useState([]);

function handleExpand(index) {
    if (expandedIndexes.includes(index)) {
        setExpandedIndexes(expandedIndexes.filter(i => i !== index));
    } else {
        setExpandedIndexes([...expandedIndexes, index]);
    }
}

const handleButtonClick = (index) => {
    const element = document.getElementsByClassName("rec")[index];
    if(expandedIndexes.includes(index)){
    element.classList.remove("move-down");
    }else{
        element.classList.add("move-down");
    }
}

  
useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  const name = params.get('summonerName');
  if (name && summonerName !== name) {
    setSummonerName(name);
    setLoading(true);
    fetch(`/members/${name}`)
      .then(res => {
        if (!res.ok) {
          throw Error(res.statusText);
        }
        return res.json();
      })
      .then(data => {
        setPlayerData(data.player_data);
        setMain(data.main);
        setMatches(data.matches);
        setFlex(data.flex);
        setTop1(data.top1);
        setLoading(false);
      })
      .catch(error => {
        console.log(error);
        setLoading(false);
        alert("Error fetching data");
      });
  }
}, [summonerName]);


const handleSubmit = (e) => {
  e.preventDefault();
  setLoading(true);
  fetch(`/members/${summonerName}`)
    .then(res => {
      if (!res.ok) {
        throw Error(res.statusText);
      }
      return res.json();
    })
    .then(data => {
      setPlayerData(data.player_data);
      setMain(data.main);
      setMatches(data.matches);
      setFlex(data.flex)
      setTop1(data.top1)
      console.log(matches);
      setLoading(false);
    })
    .catch(error => {
      console.log(error);
      setLoading(false);
      alert("Error fetching data");
    });
};

  

  return (
    <>
    {loading ? (
      <div className="loading-indicator">
        <img class="yuumiLoad" src={`https://media.tenor.com/OZMr10f-fnoAAAAi/yuumi.gif`} alt="yuumi"></img>
        <div class = "load">
        Loading...
        </div>
      </div>
    ) : (
      <>
        {
    <div class="section">
      
     
      <div className="App">
      <div id="top-bar">
  <div id="search-container">
    <form>
    <input type="text" id="search-bar" value={summonerName} onChange={e => setSummonerName(e.target.value)} />
    <button class="button is-info" id="search-button" type="submit" onClick={handleSubmit}></button>
    </form>
  </div>
</div>

        {matches.length > 0 ? (
          <div>
            <section class="hero is-dark">
              <div class="hero-body" style={{backgroundImage:`url('http://ddragon.leagueoflegends.com/cdn/img/champion/splash/${top1}_0.jpg')`}}>
                <div class="columns is-centered">
                  <div class="column is-1">
                    <figure class="image is-128x128">
                      <img class="is-rounded" src={`http://ddragon.leagueoflegends.com/cdn/13.1.1/img/profileicon/${playerData.icon}.png`} alt="Player Icon"></img>
                      <div class="leo">
                      Level {playerData.level}
                    </div>
                    <div class="columnis-11">
                    <h1 class="title">{playerData.summonerName}</h1>
                  </div>
                    </figure>
                   
                    <br></br>
                    
                  </div>
                  
                </div>

              </div>
            </section>

            <p></p>
            <br></br>

            <div class="columns is-centered">

              <div class="column is-one-fourth">

                <div class="box has-background-dark has-text-white has-text-weight-normal">
                  <h1>Ranked Solo</h1>
                  <hr></hr>

                  <div class="section">
                    <div class="columns is-centered">
                      <div class="column is one-fourth">
                        {RenderImage()}
                      </div>
                      <div class="column is-two-fourths">
                        <b>{playerData.tier} {playerData.rank}</b>
                        <br></br>
                        {playerData.leaguePoints} LP
                      </div>
                      <div class="column is-one-fourth">
                        {playerData.wins}W {playerData.losses}L
                        <br></br>
                        Win Rate {playerData.winrate}%
                      </div>
                    </div>
                  </div>
                </div>

                <div class="box has-background-dark has-text-white has-text-weight-normal">
                  <h1>Ranked Flex</h1>
                  {Flex.tier !== "none" && <hr></hr>}
                  {Flex.tier !== "none" &&

                    < div class="section">

                      <div class="columns is-centered">
                        <div class="column is one-fourth">
                          {RenderFlexImage()}
                        </div>
                        <div class="column is-two-fourths">
                          <b>{Flex.tier} {Flex.rank}</b>
                          <br></br>
                          {Flex.leaguePoints} LP
                        </div>
                        <div class="column is-one-fourth">
                          {Flex.wins}W {Flex.losses}L
                          <br></br>
                          Win Rate {Flex.winrate}%
                        </div>
                      </div>
                    </div>
                  }
                </div>

                <div class="box has-background-dark has-text-white has-text-weight-normal">
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
  
  
  <tbody>
   <div className="layout-container">
   {Main.map((match, index) => (
      <tr>
         
         <div onClick={() => {handleButtonClick(index); handleExpand(index)}} className={`rec ${match.win === 1 ? "win" : "loss"} ${showExtraContent ? 'move-down' : ''}`}>
  
            <div className="rec-left">
            <div className="champion-spells-runes-container">
              <div className={`${match.win === 1 ? "victory" : "defeat"}`}></div>
           
   <div className="champion-container">
      <img src={`http://ddragon.leagueoflegends.com/cdn/13.1.1/img/champion/${match.champion_name}.png`} alt="Champion Icon" />
   </div>
   <div className="spells">
      <img src={`${match.spell1}`} alt="Spell 1" />
      <img src={`${match.spell2}`} alt="Spell 2" />
      </div>
      <div className="runes1">
      <img src={`https://ddragon.canisback.com/img/${match.rune0}`} alt="Rune 1" />
      </div>
      <div className="runes2">
      <img src={`https://ddragon.canisback.com/img/${match.rune1}`} alt="Rune 2" />
      
      <img src={`https://ddragon.canisback.com/img/${match.rune2}`} alt="Rune 3" />
      <img src={`https://ddragon.canisback.com/img/${match.rune3}`} alt="Rune 4" />
      </div>
      <div className="runes3">
      <img src={`https://ddragon.canisback.com/img/${match.rune4}`} alt="Rune 5" />
      <img src={`https://ddragon.canisback.com/img/${match.rune5}`} alt="Rune 6" />
   
   </div>
   <div className="items-container">
      {match.item0 !== 0 ? <img src={`http://ddragon.leagueoflegends.com/cdn/13.1.1/img/item/${match.item0}.png`} alt="Item 0" /> : null}
      {match.item1 !== 0 ? <img src={`http://ddragon.leagueoflegends.com/cdn/13.1.1/img/item/${match.item1}.png`} alt="Item 1" /> : null}
      {match.item2 !== 0 ? <img src={`http://ddragon.leagueoflegends.com/cdn/13.1.1/img/item/${match.item2}.png`} alt="Item 2" /> : null}
      {match.item3 !== 0 ? <img src={`http://ddragon.leagueoflegends.com/cdn/13.1.1/img/item/${match.item3}.png`} alt="Item 3" /> : null}
      {match.item4 !== 0 ? <img src={`http://ddragon.leagueoflegends.com/cdn/13.1.1/img/item/${match.item4}.png`} alt="Item 4" /> : null}
      {match.item5 !== 0 ? <img src={`http://ddragon.leagueoflegends.com/cdn/13.1.1/img/item/${match.item5}.png`} alt="Item 5" /> : null}
   </div>
   
            
   <div className="player-info">
    {/* <div className="player-name">{match.summoner_name}</div> */}
    <div className="kda">
      KDA:<span className="kills">{match.kills}</span>/<span className="deaths">{match.deaths}</span>/<span className="assists">{match.assists}</span>
      <br></br>
      CS:<span className="csTotal">{match.total_minions_killed}</span>&#40; <span className="csPM">{match.minions_pm}</span>&#41;

    </div>


    {expandedIndexes.includes(index) ? (
    <div className="expanded-content">
         <tbody>
         <div className="layout-container">
          
       <div className={`xec ${match.win === 1 ? "win" : "loss"}`}>
            <div className="rec-left">
            <tr>
               <td>Gold Earned</td>
               <td>{match.gold_earned}</td>
            </tr>
            <tr>
               <td>Damage Dealt</td>
               <td>{match.damage_dealt}</td>
            </tr>
            <tr>
               <td>Minions Killed</td>
               <td>{match.minions_killed}</td>
            </tr>
            </div>
</div>
</div>
         </tbody>
      
   </div>
) : null}
</div>
</div>
</div>
</div>


         
      </tr>
   ))}
   </div>
   
</tbody>
       

                </div>
              </div>

            </div>

          </div>
        ) : null}
      </div>
  
    </div>
}
      </>
      )}
    </>
  )
  function RenderImage() {
    if (playerData.queueType !== "RANKED_SOLO_5x5") {
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
  function RenderFlexImage() {
    if (Flex.queueType !== "RANKED_FLEX_SR") {
      return <img src={UNRANKED} alt="Rank" />
    }
    switch (Flex.tier) {
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


function App() {
  return (
    <BrowserRouter>
      <Route exact path="/" component={InitialPage} />
      <Route exact path="/other-page" component={OtherPage} />
    </BrowserRouter>
  );
}


export default App;