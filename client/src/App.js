
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
import Fiddlesticks from './rankimg/Fiddlesticks.png'

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

   {matches.map((match, index) => (
      <tr>
         
         <div onClick={() => {handleButtonClick(index); handleExpand(index)}} className={`rec ${match[0].win === 1 ? "win" : "loss"} ${showExtraContent ? 'move-down' : ''}`}>
  
            <div className="rec-left">
            <div className="champion-spells-runes-container">
              <div className={`${match[0].win === 1 ? "victory" : "defeat"}`}></div>

    {/* <img src={`http://ddragon.leagueoflegends.com/cdn/13.1.1/img/champion/${match[0].champion_name}.png`} alt="Champion Icon" />               */}

  <div className="players_container">
    <div className="row1">
      <table>
        <tr>
            <img src={`http://ddragon.leagueoflegends.com/cdn/13.1.1/img/champion/${match[1].champion_name}.png`} alt="Champion Icon" /> {match[1].summoner_name}
        </tr> 
        <tr>
            <img src={`http://ddragon.leagueoflegends.com/cdn/13.1.1/img/champion/${match[2].champion_name}.png`} alt="Champion Icon" /> {match[2].summoner_name}
        </tr>
        <tr>
            <img src={`http://ddragon.leagueoflegends.com/cdn/13.1.1/img/champion/${match[3].champion_name}.png`} alt="Champion Icon" /> {match[3].summoner_name}
        </tr>
        <tr>
            <img src={`http://ddragon.leagueoflegends.com/cdn/13.1.1/img/champion/${match[4].champion_name}.png`} alt="Champion Icon" /> {match[4].summoner_name}
        </tr>
        <tr>
            <img src={`http://ddragon.leagueoflegends.com/cdn/13.1.1/img/champion/${match[5].champion_name}.png`} alt="Champion Icon" /> {match[5].summoner_name}
        </tr>
      </table>
    </div>
    <div className="row2">
      <table>
        <tr>
            <img src={`http://ddragon.leagueoflegends.com/cdn/13.1.1/img/champion/${match[6].champion_name}.png`} alt="Champion Icon" /> {match[6].summoner_name}
        </tr> 
        <tr>
            <img src={`http://ddragon.leagueoflegends.com/cdn/13.1.1/img/champion/${match[7].champion_name}.png`} alt="Champion Icon" /> {match[7].summoner_name}
        </tr>
        <tr>
            <img src={`http://ddragon.leagueoflegends.com/cdn/13.1.1/img/champion/${match[8].champion_name}.png`} alt="Champion Icon" /> {match[8].summoner_name}
        </tr>
        <tr>
            <img src={`http://ddragon.leagueoflegends.com/cdn/13.1.1/img/champion/${match[9].champion_name}.png`} alt="Champion Icon" /> {match[9].summoner_name}
        </tr>
        <tr>
            <img src={`http://ddragon.leagueoflegends.com/cdn/13.1.1/img/champion/${match[10].champion_name}.png`} alt="Champion Icon" /> {match[10].summoner_name}
        </tr>
      </table>
    </div>
  </div>

           
   <div className="champion-container">
      <img src={`http://ddragon.leagueoflegends.com/cdn/13.1.1/img/champion/${match[0].champion_name}.png`} alt="Champion Icon" />
   </div>
   <div className="spells">
      <img src={`${match[0].spell1}`} alt="Spell 1" />
      <img src={`${match[0].spell2}`} alt="Spell 2" />
      </div>
      <div className="runes1">
      <img src={`https://ddragon.canisback.com/img/${match[0].rune0}`} alt="Rune 1" />
      </div>
      <div className="runes2">
      <img src={`https://ddragon.canisback.com/img/${match[0].rune1}`} alt="Rune 2" />
      
      <img src={`https://ddragon.canisback.com/img/${match[0].rune2}`} alt="Rune 3" />
      <img src={`https://ddragon.canisback.com/img/${match[0].rune3}`} alt="Rune 4" />
      </div>
      <div className="runes3">
      <img src={`https://ddragon.canisback.com/img/${match[0].rune4}`} alt="Rune 5" />
      <img src={`https://ddragon.canisback.com/img/${match[0].rune5}`} alt="Rune 6" />
   
   </div>
   <div className="items-container">
      {match[0].item0 !== 0 ? <img src={`http://ddragon.leagueoflegends.com/cdn/13.1.1/img/item/${match[0].item0}.png`} alt="Item 0" /> : null}
      {match[0].item1 !== 0 ? <img src={`http://ddragon.leagueoflegends.com/cdn/13.1.1/img/item/${match[0].item1}.png`} alt="Item 1" /> : null}
      {match[0].item2 !== 0 ? <img src={`http://ddragon.leagueoflegends.com/cdn/13.1.1/img/item/${match[0].item2}.png`} alt="Item 2" /> : null}
      {match[0].item3 !== 0 ? <img src={`http://ddragon.leagueoflegends.com/cdn/13.1.1/img/item/${match[0].item3}.png`} alt="Item 3" /> : null}
      {match[0].item4 !== 0 ? <img src={`http://ddragon.leagueoflegends.com/cdn/13.1.1/img/item/${match[0].item4}.png`} alt="Item 4" /> : null}
      {match[0].item5 !== 0 ? <img src={`http://ddragon.leagueoflegends.com/cdn/13.1.1/img/item/${match[0].item5}.png`} alt="Item 5" /> : null}
   </div>
    
    
            
   <div className="player-info">
    {/* <div className="player-name">{match.summoner_name}</div> */}
    <div className="kda">
      KDA:<span className="kills">{match[0].kills}</span>/<span className="deaths">{match[0].deaths}</span>/<span className="assists">{match[0].assists}</span>
      <br></br>
      CS:<span className="csTotal">{match[0].total_minions_killed}</span>&#40; <span className="csPM">{match[0].minions_pm}</span>&#41;
      <br></br>
      Vision:<span className="vision">{match[0].vision_score}</span>

    </div>


    {expandedIndexes.includes(index) ? (
    <div className="expanded-content">
         <tbody>
         <div className="layout-container">
          
       <div className={`xec ${match[0].win === 1 ? "win" : "loss"}`}>
            {/* <div className="rec-left">
            <tr>
               <td>Gold Earned</td>
               <td>{match[0].gold_earned}</td>
            </tr>
            <tr>
               <td>Damage Dealt</td>
               <td>{match[0].damage_dealt}</td>
            </tr>
            <tr>
               <td>Minions Killed</td>
               <td>{match[0].minions_killed}</td>
            </tr>
            </div> */}

            <div className="data_table">
              <table class="test1">
                <thead>
                  <tr>
                    <th class="team">Team</th>
                    <th></th>
                    <th></th>
                    <th>KDA</th>
                    <th>Damage</th>
                    <th>Vision Scores</th>
                    <th>CS</th>
                    <th>Items</th>
                  </tr>
                </thead>
                <tbody class="mainbody">
                  <tr>
                    <td class= "champion_picture"> 
                       <img src={`http://ddragon.leagueoflegends.com/cdn/13.1.1/img/champion/${match[1].champion_name}.png`} alt="Champion Icon" /> 
                    </td>

                    <td class="spellbox">
                      <div class="spellsex">
                          <img src={`${match[1].spell1}`} alt="Spell 1" />
                      </div>
                      <div class="spellsex">
                          <img src={`${match[1].spell2}`} alt="Spell 2" />
                      </div> 
                    </td>

                    <td class="runesex">
                      <div class="rune1ex">
                        <img src={`https://ddragon.canisback.com/img/${match[0].rune0}`} alt="Rune 1" />
                      </div>
                      <div class="rune2ex">
                          <img src={`https://ddragon.canisback.com/img/${match[0].rune1}`} alt="Rune 1" />
                      </div>
                    </td>
                    
                    <td class="kdaex">
                    KDA:<span className="kills">{match[0].kills}</span>/<span className="deaths">{match[0].deaths}</span>/<span className="assists">{match[0].assists}</span>
                    </td>

                    <td class="damageDealt">
                      Damage dealt: {match[0].damage_dealt}
                    </td>

                    <td class="vsex">
                      Vision Score: {match[0].vision_score}
                    </td>

                    <td class="cs">
                      CS: {match[0].total_minions_killed}
                    </td>

                    <td class="itemsList">
                      {match[0].item0 !== 0 ? <img src={`http://ddragon.leagueoflegends.com/cdn/13.1.1/img/item/${match[0].item0}.png`} alt="Item 0" /> : null}
                      {match[0].item1 !== 0 ? <img src={`http://ddragon.leagueoflegends.com/cdn/13.1.1/img/item/${match[0].item1}.png`} alt="Item 1" /> : null}
                      {match[0].item2 !== 0 ? <img src={`http://ddragon.leagueoflegends.com/cdn/13.1.1/img/item/${match[0].item2}.png`} alt="Item 2" /> : null}
                      {match[0].item3 !== 0 ? <img src={`http://ddragon.leagueoflegends.com/cdn/13.1.1/img/item/${match[0].item3}.png`} alt="Item 3" /> : null}
                      {match[0].item4 !== 0 ? <img src={`http://ddragon.leagueoflegends.com/cdn/13.1.1/img/item/${match[0].item4}.png`} alt="Item 4" /> : null}
                      {match[0].item5 !== 0 ? <img src={`http://ddragon.leagueoflegends.com/cdn/13.1.1/img/item/${match[0].item5}.png`} alt="Item 5" /> : null}
                    </td>
                  </tr>

                  <tr>
                    <td class= "champion_picture"> 
                       <img src={`http://ddragon.leagueoflegends.com/cdn/13.1.1/img/champion/${match[2].champion_name}.png`} alt="Champion Icon" /> 
                    </td>

                    <td class="spellbox">
                      <div class="spellsex">
                          <img src={`${match[2].spell1}`} alt="Spell 1" />
                      </div>
                      <div class="spellsex">
                          <img src={`${match[2].spell2}`} alt="Spell 2" />
                      </div> 
                    </td>

                    <td class="runesex">
                      <div class="rune1ex">
                        <img src={`https://ddragon.canisback.com/img/${match[2].rune0}`} alt="Rune 1" />
                      </div>
                      <div class="rune2ex">
                          <img src={`https://ddragon.canisback.com/img/${match[2].rune1}`} alt="Rune 1" />
                      </div>
                    </td>
                    
                    <td class="kdaex">
                    KDA:<span className="kills">{match[2].kills}</span>/<span className="deaths">{match[2].deaths}</span>/<span className="assists">{match[2].assists}</span>
                    </td>

                    <td class="damageDealt">
                      Damage dealt: {match[2].damage_dealt}
                    </td>

                    <td class="vsex">
                      Vision Score: {match[2].vision_score}
                    </td>

                    <td class="cs">
                      CS: {match[2].total_minions_killed}
                    </td>

                    <td class="itemsList">
                      {match[2].item0 !== 0 ? <img src={`http://ddragon.leagueoflegends.com/cdn/13.1.1/img/item/${match[2].item0}.png`} alt="Item 0" /> : null}
                      {match[2].item1 !== 0 ? <img src={`http://ddragon.leagueoflegends.com/cdn/13.1.1/img/item/${match[2].item1}.png`} alt="Item 1" /> : null}
                      {match[2].item2 !== 0 ? <img src={`http://ddragon.leagueoflegends.com/cdn/13.1.1/img/item/${match[2].item2}.png`} alt="Item 2" /> : null}
                      {match[2].item3 !== 0 ? <img src={`http://ddragon.leagueoflegends.com/cdn/13.1.1/img/item/${match[2].item3}.png`} alt="Item 3" /> : null}
                      {match[2].item4 !== 0 ? <img src={`http://ddragon.leagueoflegends.com/cdn/13.1.1/img/item/${match[2].item4}.png`} alt="Item 4" /> : null}
                      {match[2].item5 !== 0 ? <img src={`http://ddragon.leagueoflegends.com/cdn/13.1.1/img/item/${match[2].item5}.png`} alt="Item 5" /> : null}
                    </td>
                  </tr>

                  <tr>
                    <td class= "champion_picture"> 
                       <img src={`http://ddragon.leagueoflegends.com/cdn/13.1.1/img/champion/${match[3].champion_name}.png`} alt="Champion Icon" /> 
                    </td>

                    <td class="spellbox">
                      <div class="spellsex">
                          <img src={`${match[3].spell1}`} alt="Spell 1" />
                      </div>
                      <div class="spellsex">
                          <img src={`${match[3].spell2}`} alt="Spell 2" />
                      </div> 
                    </td>

                    <td class="runesex">
                      <div class="rune1ex">
                        <img src={`https://ddragon.canisback.com/img/${match[3].rune0}`} alt="Rune 1" />
                      </div>
                      <div class="rune2ex">
                          <img src={`https://ddragon.canisback.com/img/${match[3].rune1}`} alt="Rune 1" />
                      </div>
                    </td>
                    
                    <td class="kdaex">
                    KDA:<span className="kills">{match[3].kills}</span>/<span className="deaths">{match[3].deaths}</span>/<span className="assists">{match[3].assists}</span>
                    </td>

                    <td class="damageDealt">
                      Damage dealt: {match[3].damage_dealt}
                    </td>

                    <td class="vsex">
                      Vision Score: {match[3].vision_score}
                    </td>

                    <td class="cs">
                      CS: {match[3].total_minions_killed}
                    </td>

                    <td class="itemsList">
                      {match[3].item0 !== 0 ? <img src={`http://ddragon.leagueoflegends.com/cdn/13.1.1/img/item/${match[3].item0}.png`} alt="Item 0" /> : null}
                      {match[3].item1 !== 0 ? <img src={`http://ddragon.leagueoflegends.com/cdn/13.1.1/img/item/${match[3].item1}.png`} alt="Item 1" /> : null}
                      {match[3].item2 !== 0 ? <img src={`http://ddragon.leagueoflegends.com/cdn/13.1.1/img/item/${match[3].item2}.png`} alt="Item 2" /> : null}
                      {match[3].item3 !== 0 ? <img src={`http://ddragon.leagueoflegends.com/cdn/13.1.1/img/item/${match[3].item3}.png`} alt="Item 3" /> : null}
                      {match[3].item4 !== 0 ? <img src={`http://ddragon.leagueoflegends.com/cdn/13.1.1/img/item/${match[3].item4}.png`} alt="Item 4" /> : null}
                      {match[3].item5 !== 0 ? <img src={`http://ddragon.leagueoflegends.com/cdn/13.1.1/img/item/${match[3].item5}.png`} alt="Item 5" /> : null}
                    </td>
                  </tr>

                  <tr>
                    <td class= "champion_picture"> 
                       <img src={`http://ddragon.leagueoflegends.com/cdn/13.1.1/img/champion/${match[4].champion_name}.png`} alt="Champion Icon" /> 
                    </td>

                    <td class="spellbox">
                      <div class="spellsex">
                          <img src={`${match[4].spell1}`} alt="Spell 1" />
                      </div>
                      <div class="spellsex">
                          <img src={`${match[4].spell2}`} alt="Spell 2" />
                      </div> 
                    </td>

                    <td class="runesex">
                      <div class="rune1ex">
                        <img src={`https://ddragon.canisback.com/img/${match[4].rune0}`} alt="Rune 1" />
                      </div>
                      <div class="rune2ex">
                          <img src={`https://ddragon.canisback.com/img/${match[4].rune1}`} alt="Rune 1" />
                      </div>
                    </td>
                    
                    <td class="kdaex">
                    KDA:<span className="kills">{match[4].kills}</span>/<span className="deaths">{match[4].deaths}</span>/<span className="assists">{match[4].assists}</span>
                    </td>

                    <td class="damageDealt">
                      Damage dealt: {match[4].damage_dealt}
                    </td>

                    <td class="vsex">
                      Vision Score: {match[4].vision_score}
                    </td>

                    <td class="cs">
                      CS: {match[4].total_minions_killed}
                    </td>

                    <td class="itemsList">
                      {match[4].item0 !== 0 ? <img src={`http://ddragon.leagueoflegends.com/cdn/13.1.1/img/item/${match[4].item0}.png`} alt="Item 0" /> : null}
                      {match[4].item1 !== 0 ? <img src={`http://ddragon.leagueoflegends.com/cdn/13.1.1/img/item/${match[4].item1}.png`} alt="Item 1" /> : null}
                      {match[4].item2 !== 0 ? <img src={`http://ddragon.leagueoflegends.com/cdn/13.1.1/img/item/${match[4].item2}.png`} alt="Item 2" /> : null}
                      {match[4].item3 !== 0 ? <img src={`http://ddragon.leagueoflegends.com/cdn/13.1.1/img/item/${match[4].item3}.png`} alt="Item 3" /> : null}
                      {match[4].item4 !== 0 ? <img src={`http://ddragon.leagueoflegends.com/cdn/13.1.1/img/item/${match[4].item4}.png`} alt="Item 4" /> : null}
                      {match[4].item5 !== 0 ? <img src={`http://ddragon.leagueoflegends.com/cdn/13.1.1/img/item/${match[4].item5}.png`} alt="Item 5" /> : null}
                    </td>
                  </tr>

                  <tr>
                    <td class= "champion_picture"> 
                       <img src={`http://ddragon.leagueoflegends.com/cdn/13.1.1/img/champion/${match[5].champion_name}.png`} alt="Champion Icon" /> 
                    </td>

                    <td class="spellbox">
                      <div class="spellsex">
                          <img src={`${match[5].spell1}`} alt="Spell 1" />
                      </div>
                      <div class="spellsex">
                          <img src={`${match[5].spell2}`} alt="Spell 2" />
                      </div> 
                    </td>

                    <td class="runesex">
                      <div class="rune1ex">
                        <img src={`https://ddragon.canisback.com/img/${match[5].rune0}`} alt="Rune 1" />
                      </div>
                      <div class="rune2ex">
                          <img src={`https://ddragon.canisback.com/img/${match[5].rune1}`} alt="Rune 1" />
                      </div>
                    </td>
                    
                    <td class="kdaex">
                    KDA:<span className="kills">{match[5].kills}</span>/<span className="deaths">{match[5].deaths}</span>/<span className="assists">{match[5].assists}</span>
                    </td>

                    <td class="damageDealt">
                      Damage dealt: {match[5].damage_dealt}
                    </td>

                    <td class="vsex">
                      Vision Score: {match[5].vision_score}
                    </td>

                    <td class="cs">
                      CS: {match[5].total_minions_killed}
                    </td>

                    <td class="itemsList">
                      {match[5].item0 !== 0 ? <img src={`http://ddragon.leagueoflegends.com/cdn/13.1.1/img/item/${match[5].item0}.png`} alt="Item 0" /> : null}
                      {match[5].item1 !== 0 ? <img src={`http://ddragon.leagueoflegends.com/cdn/13.1.1/img/item/${match[5].item1}.png`} alt="Item 1" /> : null}
                      {match[5].item2 !== 0 ? <img src={`http://ddragon.leagueoflegends.com/cdn/13.1.1/img/item/${match[5].item2}.png`} alt="Item 2" /> : null}
                      {match[5].item3 !== 0 ? <img src={`http://ddragon.leagueoflegends.com/cdn/13.1.1/img/item/${match[5].item3}.png`} alt="Item 3" /> : null}
                      {match[5].item4 !== 0 ? <img src={`http://ddragon.leagueoflegends.com/cdn/13.1.1/img/item/${match[5].item4}.png`} alt="Item 4" /> : null}
                      {match[5].item5 !== 0 ? <img src={`http://ddragon.leagueoflegends.com/cdn/13.1.1/img/item/${match[5].item5}.png`} alt="Item 5" /> : null}
                    </td>
                  </tr>

                </tbody>
              </table>
              <table class="test1">
                <thead>
                  <tr>
                    <th class="team">Team</th>
                    <th></th>
                    <th></th>
                    <th>KDA</th>
                    <th>Damage</th>
                    <th>Vision Scores</th>
                    <th>CS</th>
                    <th>Items</th>
                  </tr>
                </thead>
                <tbody class="mainbody">
                  <tr>
                    <td class= "champion_picture"> 
                       <img src={`http://ddragon.leagueoflegends.com/cdn/13.1.1/img/champion/${match[6].champion_name}.png`} alt="Champion Icon" /> 
                    </td>

                    <td class="spellbox">
                      <div class="spellsex">
                          <img src={`${match[6].spell1}`} alt="Spell 1" />
                      </div>
                      <div class="spellsex">
                          <img src={`${match[6].spell2}`} alt="Spell 2" />
                      </div> 
                    </td>

                    <td class="runesex">
                      <div class="rune1ex">
                        <img src={`https://ddragon.canisback.com/img/${match[6].rune0}`} alt="Rune 1" />
                      </div>
                      <div class="rune2ex">
                          <img src={`https://ddragon.canisback.com/img/${match[6].rune1}`} alt="Rune 1" />
                      </div>
                    </td>
                    
                    <td class="kdaex">
                    KDA:<span className="kills">{match[6].kills}</span>/<span className="deaths">{match[6].deaths}</span>/<span className="assists">{match[6].assists}</span>
                    </td>

                    <td class="damageDealt">
                      Damage dealt: {match[6].damage_dealt}
                    </td>

                    <td class="vsex">
                      Vision Score: {match[6].vision_score}
                    </td>

                    <td class="cs">
                      CS: {match[6].total_minions_killed}
                    </td>

                    <td class="itemsList">
                      {match[6].item0 !== 0 ? <img src={`http://ddragon.leagueoflegends.com/cdn/13.1.1/img/item/${match[6].item0}.png`} alt="Item 0" /> : null}
                      {match[6].item1 !== 0 ? <img src={`http://ddragon.leagueoflegends.com/cdn/13.1.1/img/item/${match[6].item1}.png`} alt="Item 1" /> : null}
                      {match[6].item2 !== 0 ? <img src={`http://ddragon.leagueoflegends.com/cdn/13.1.1/img/item/${match[6].item2}.png`} alt="Item 2" /> : null}
                      {match[6].item3 !== 0 ? <img src={`http://ddragon.leagueoflegends.com/cdn/13.1.1/img/item/${match[6].item3}.png`} alt="Item 3" /> : null}
                      {match[6].item4 !== 0 ? <img src={`http://ddragon.leagueoflegends.com/cdn/13.1.1/img/item/${match[6].item4}.png`} alt="Item 4" /> : null}
                      {match[6].item5 !== 0 ? <img src={`http://ddragon.leagueoflegends.com/cdn/13.1.1/img/item/${match[6].item5}.png`} alt="Item 5" /> : null}
                    </td>
                  </tr>

                  <tr>
                    <td class= "champion_picture"> 
                       <img src={`http://ddragon.leagueoflegends.com/cdn/13.1.1/img/champion/${match[7].champion_name}.png`} alt="Champion Icon" /> 
                    </td>

                    <td class="spellbox">
                      <div class="spellsex">
                          <img src={`${match[7].spell1}`} alt="Spell 1" />
                      </div>
                      <div class="spellsex">
                          <img src={`${match[7].spell2}`} alt="Spell 2" />
                      </div> 
                    </td>

                    <td class="runesex">
                      <div class="rune1ex">
                        <img src={`https://ddragon.canisback.com/img/${match[7].rune0}`} alt="Rune 1" />
                      </div>
                      <div class="rune2ex">
                          <img src={`https://ddragon.canisback.com/img/${match[7].rune1}`} alt="Rune 1" />
                      </div>
                    </td>
                    
                    <td class="kdaex">
                    KDA:<span className="kills">{match[7].kills}</span>/<span className="deaths">{match[7].deaths}</span>/<span className="assists">{match[7].assists}</span>
                    </td>

                    <td class="damageDealt">
                      Damage dealt: {match[7].damage_dealt}
                    </td>

                    <td class="vsex">
                      Vision Score: {match[7].vision_score}
                    </td>

                    <td class="cs">
                      CS: {match[7].total_minions_killed}
                    </td>

                    <td class="itemsList">
                      {match[7].item0 !== 0 ? <img src={`http://ddragon.leagueoflegends.com/cdn/13.1.1/img/item/${match[7].item0}.png`} alt="Item 0" /> : null}
                      {match[7].item1 !== 0 ? <img src={`http://ddragon.leagueoflegends.com/cdn/13.1.1/img/item/${match[7].item1}.png`} alt="Item 1" /> : null}
                      {match[7].item2 !== 0 ? <img src={`http://ddragon.leagueoflegends.com/cdn/13.1.1/img/item/${match[7].item2}.png`} alt="Item 2" /> : null}
                      {match[7].item3 !== 0 ? <img src={`http://ddragon.leagueoflegends.com/cdn/13.1.1/img/item/${match[7].item3}.png`} alt="Item 3" /> : null}
                      {match[7].item4 !== 0 ? <img src={`http://ddragon.leagueoflegends.com/cdn/13.1.1/img/item/${match[7].item4}.png`} alt="Item 4" /> : null}
                      {match[7].item5 !== 0 ? <img src={`http://ddragon.leagueoflegends.com/cdn/13.1.1/img/item/${match[7].item5}.png`} alt="Item 5" /> : null}
                    </td>
                  </tr>

                  <tr>
                    <td class= "champion_picture"> 
                       <img src={`http://ddragon.leagueoflegends.com/cdn/13.1.1/img/champion/${match[8].champion_name}.png`} alt="Champion Icon" /> 
                    </td>

                    <td class="spellbox">
                      <div class="spellsex">
                          <img src={`${match[8].spell1}`} alt="Spell 1" />
                      </div>
                      <div class="spellsex">
                          <img src={`${match[8].spell2}`} alt="Spell 2" />
                      </div> 
                    </td>

                    <td class="runesex">
                      <div class="rune1ex">
                        <img src={`https://ddragon.canisback.com/img/${match[8].rune0}`} alt="Rune 1" />
                      </div>
                      <div class="rune2ex">
                          <img src={`https://ddragon.canisback.com/img/${match[8].rune1}`} alt="Rune 1" />
                      </div>
                    </td>
                    
                    <td class="kdaex">
                    KDA:<span className="kills">{match[8].kills}</span>/<span className="deaths">{match[8].deaths}</span>/<span className="assists">{match[8].assists}</span>
                    </td>

                    <td class="damageDealt">
                      Damage dealt: {match[8].damage_dealt}
                    </td>

                    <td class="vsex">
                      Vision Score: {match[8].vision_score}
                    </td>

                    <td class="cs">
                      CS: {match[8].total_minions_killed}
                    </td>

                    <td class="itemsList">
                      {match[8].item0 !== 0 ? <img src={`http://ddragon.leagueoflegends.com/cdn/13.1.1/img/item/${match[8].item0}.png`} alt="Item 0" /> : null}
                      {match[8].item1 !== 0 ? <img src={`http://ddragon.leagueoflegends.com/cdn/13.1.1/img/item/${match[8].item1}.png`} alt="Item 1" /> : null}
                      {match[8].item2 !== 0 ? <img src={`http://ddragon.leagueoflegends.com/cdn/13.1.1/img/item/${match[8].item2}.png`} alt="Item 2" /> : null}
                      {match[8].item3 !== 0 ? <img src={`http://ddragon.leagueoflegends.com/cdn/13.1.1/img/item/${match[8].item3}.png`} alt="Item 3" /> : null}
                      {match[8].item4 !== 0 ? <img src={`http://ddragon.leagueoflegends.com/cdn/13.1.1/img/item/${match[8].item4}.png`} alt="Item 4" /> : null}
                      {match[8].item5 !== 0 ? <img src={`http://ddragon.leagueoflegends.com/cdn/13.1.1/img/item/${match[8].item5}.png`} alt="Item 5" /> : null}
                    </td>
                  </tr>

                  <tr>
                    <td class= "champion_picture"> 
                       <img src={`http://ddragon.leagueoflegends.com/cdn/13.1.1/img/champion/${match[9].champion_name}.png`} alt="Champion Icon" /> 
                    </td>

                    <td class="spellbox">
                      <div class="spellsex">
                          <img src={`${match[9].spell1}`} alt="Spell 1" />
                      </div>
                      <div class="spellsex">
                          <img src={`${match[9].spell2}`} alt="Spell 2" />
                      </div> 
                    </td>

                    <td class="runesex">
                      <div class="rune1ex">
                        <img src={`https://ddragon.canisback.com/img/${match[9].rune0}`} alt="Rune 1" />
                      </div>
                      <div class="rune2ex">
                          <img src={`https://ddragon.canisback.com/img/${match[9].rune1}`} alt="Rune 1" />
                      </div>
                    </td>
                    
                    <td class="kdaex">
                    KDA:<span className="kills">{match[9].kills}</span>/<span className="deaths">{match[9].deaths}</span>/<span className="assists">{match[9].assists}</span>
                    </td>

                    <td class="damageDealt">
                      Damage dealt: {match[9].damage_dealt}
                    </td>

                    <td class="vsex">
                      Vision Score: {match[9].vision_score}
                    </td>

                    <td class="cs">
                      CS: {match[9].total_minions_killed}
                    </td>

                    <td class="itemsList">
                      {match[9].item0 !== 0 ? <img src={`http://ddragon.leagueoflegends.com/cdn/13.1.1/img/item/${match[9].item0}.png`} alt="Item 0" /> : null}
                      {match[9].item1 !== 0 ? <img src={`http://ddragon.leagueoflegends.com/cdn/13.1.1/img/item/${match[9].item1}.png`} alt="Item 1" /> : null}
                      {match[9].item2 !== 0 ? <img src={`http://ddragon.leagueoflegends.com/cdn/13.1.1/img/item/${match[9].item2}.png`} alt="Item 2" /> : null}
                      {match[9].item3 !== 0 ? <img src={`http://ddragon.leagueoflegends.com/cdn/13.1.1/img/item/${match[9].item3}.png`} alt="Item 3" /> : null}
                      {match[9].item4 !== 0 ? <img src={`http://ddragon.leagueoflegends.com/cdn/13.1.1/img/item/${match[9].item4}.png`} alt="Item 4" /> : null}
                      {match[9].item5 !== 0 ? <img src={`http://ddragon.leagueoflegends.com/cdn/13.1.1/img/item/${match[9].item5}.png`} alt="Item 5" /> : null}
                    </td>
                  </tr>

                  <tr>
                    <td class= "champion_picture"> 
                       <img src={`http://ddragon.leagueoflegends.com/cdn/13.1.1/img/champion/${match[10].champion_name}.png`} alt="Champion Icon" /> 
                    </td>

                    <td class="spellbox">
                      <div class="spellsex">
                          <img src={`${match[10].spell1}`} alt="Spell 1" />
                      </div>
                      <div class="spellsex">
                          <img src={`${match[10].spell2}`} alt="Spell 2" />
                      </div> 
                    </td>

                    <td class="runesex">
                      <div class="rune1ex">
                        <img src={`https://ddragon.canisback.com/img/${match[10].rune0}`} alt="Rune 1" />
                      </div>
                      <div class="rune2ex">
                          <img src={`https://ddragon.canisback.com/img/${match[10].rune1}`} alt="Rune 1" />
                      </div>
                    </td>
                    
                    <td class="kdaex">
                    KDA:<span className="kills">{match[10].kills}</span>/<span className="deaths">{match[10].deaths}</span>/<span className="assists">{match[10].assists}</span>
                    </td>

                    <td class="damageDealt">
                      Damage dealt: {match[10].damage_dealt}
                    </td>

                    <td class="vsex">
                      Vision Score: {match[10].vision_score}
                    </td>

                    <td class="cs">
                      CS: {match[10].total_minions_killed}
                    </td>

                    <td class="itemsList">
                      {match[10].item0 !== 0 ? <img src={`http://ddragon.leagueoflegends.com/cdn/13.1.1/img/item/${match[10].item0}.png`} alt="Item 0" /> : null}
                      {match[10].item1 !== 0 ? <img src={`http://ddragon.leagueoflegends.com/cdn/13.1.1/img/item/${match[10].item1}.png`} alt="Item 1" /> : null}
                      {match[10].item2 !== 0 ? <img src={`http://ddragon.leagueoflegends.com/cdn/13.1.1/img/item/${match[10].item2}.png`} alt="Item 2" /> : null}
                      {match[10].item3 !== 0 ? <img src={`http://ddragon.leagueoflegends.com/cdn/13.1.1/img/item/${match[10].item3}.png`} alt="Item 3" /> : null}
                      {match[10].item4 !== 0 ? <img src={`http://ddragon.leagueoflegends.com/cdn/13.1.1/img/item/${match[10].item4}.png`} alt="Item 4" /> : null}
                      {match[10].item5 !== 0 ? <img src={`http://ddragon.leagueoflegends.com/cdn/13.1.1/img/item/${match[10].item5}.png`} alt="Item 5" /> : null}
                    </td>
                  </tr>

                </tbody>
              </table>

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