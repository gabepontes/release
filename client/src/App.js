
import { BrowserRouter, Route } from "react-router-dom";
import React, { useState, useEffect } from 'react'
import axios from 'axios';
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
import 'bulma/css/bulma.min.css';
import './App.css';
import styles from './initial-page.module.css';
import TeamPage from "./teampage";



function InitialPage() {
  const [searchQuery, setSearchQuery] = useState('');
  function handleAboutUs() {
    window.location.assign("/about-us");
  }

  function handleHelp() {
    window.location.assign("/help");
  }
  function handleFeed() {
    window.location.assign("/feed");
  }
  function handleSubmit(e) {
    e.preventDefault();
    if (searchQuery) {
      window.location.assign(`/other-page?summonerName=${searchQuery}`);
    }
  }

  // function handleteamPageSearch(){
  //   window.location.assign("/team-search");
  // }

  return (


    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div className={styles.flashingtext}>
        <h1><span class='one'>U</span><span class='two'>L</span><span class='three'>O</span><span class='four'>L</span> <span class='five'>.</span><span class='six'>G</span><span class='seven'>G</span></h1></div>


      <form onSubmit={handleSubmit} className={styles.container}>
        <input type="text" placeholder="Search summoner" onChange={(e) => setSearchQuery(e.target.value)} className={styles.searchInput} />

      </form>

      <div className={styles.square}>
        <div className={styles.helpAboutContainer}>
          <a href="http://localhost:3000/">
            <button className={styles.hpButton}>Home Page</button>
          </a>
          <button onClick={handleAboutUs} className={styles.helpButton}>About Us</button>
          <button onClick={handleHelp} className={styles.AboutButton}>Help</button>
          <button onClick={handleFeed} className={styles.ScrimButton}>Temp</button>
          {/* <button onClick={handleteamPageSearch} className={styles.TeamSearchButton}>Team Search</button> */}
        </div></div>

    </div>
  );
}
function Homepagesoloandteam() {
  const [searchQuery, setSearchQuery] = useState('');
  function handleAboutUs() {
    window.location.assign("/about-us");
  }

  function handleHelp() {
    window.location.assign("/help");
  }
  function handleFeed() {
    window.location.assign("/feed");
  }
  window.onload = function () {
    // your code here
    document.body.style.backgroundImage = "url('https://wallpaperaccess.com/full/4493382.jpg')";

  };
  return (

    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div className={styles.flashingtext}>
        <h1><span class='one'>U</span><span class='two'>L</span><span class='three'>O</span><span class='four'>L</span> <span class='five'>.</span><span class='six'>G</span><span class='seven'>G</span></h1></div>
      <br></br>


      <div>

        <div className={styles.searchbytext}>
          <h1>Search by...</h1>

          <div className={styles.buttons}>

            <a href="http://localhost:3000/solo-page">
              <button className={styles.buttone} >Solo</button>
            </a>

            <a href="http://localhost:3000/team-search">
              <button className={styles.butttwo} >Team</button>
            </a>

          </div>
        </div>
        <br></br>



      </div>



      <div className={styles.square}>
        <div className={styles.helpAboutContainer}>

          <a href="http://localhost:3000/">
            <button className={styles.hpButton}>Home Page</button>
          </a>

          <button onClick={handleAboutUs} className={styles.helpButton}>About Us</button>
          <button onClick={handleHelp} className={styles.AboutButton}>Help</button>
          <button onClick={handleFeed} className={styles.ScrimButton}>Temp</button>
        </div></div>

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
  const [topChamps, setTopChamps] = useState({});

  function handleExpand(index) {
    if (expandedIndexes.includes(index)) {
      setExpandedIndexes(expandedIndexes.filter(i => i !== index));
    } else {
      setExpandedIndexes([...expandedIndexes, index]);
    }
  }

  const handleButtonClick = (index) => {
    const element = document.getElementsByClassName("rec")[index];
    if (expandedIndexes.includes(index)) {
      element.classList.remove("move-down");
    } else {
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
          setTopChamps(data.bestChamp);
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
          <div class="load">
            Loading...
          </div>
        </div>
      ) : (
        <>
          {
            <div class="section">


              <div className="App">
                <div id="top-bar">

                  <div id="soloteampagebackbutton">

                    <a href="http://localhost:3000/">
                      <button className={styles.homepagebutton}  >HOME PAGE</button>
                    </a>
                  </div>


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
                      <div class="hero-body" style={{ backgroundImage: `url('http://ddragon.leagueoflegends.com/cdn/img/champion/splash/${top1}_0.jpg')` }}>
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
                          <hr></hr>
                          <div class="columns is-centered">

                            <div class="column is-2">
                              <img src={`http://ddragon.leagueoflegends.com/cdn/13.1.1/img/champion/${Object.keys(topChamps)[0]}.png`} alt="Champion Icon" width="42" height="42" />

                              <br></br>
                              <br></br>
                              <img src={`http://ddragon.leagueoflegends.com/cdn/13.1.1/img/champion/${Object.keys(topChamps)[1]}.png`} alt="Champion Icon" width="42" height="42" />

                              <br></br>
                              <br></br>
                              <img src={`http://ddragon.leagueoflegends.com/cdn/13.1.1/img/champion/${Object.keys(topChamps)[2]}.png`} alt="Champion Icon" width="42" height="42" />

                              <br></br>
                              <br></br>
                              <img src={`http://ddragon.leagueoflegends.com/cdn/13.1.1/img/champion/${Object.keys(topChamps)[3]}.png`} alt="Champion Icon" width="42" height="42" />

                              {Object.keys(topChamps).length >= 5 &&
                                <div>
                                  <br></br>
                                  <img src={`http://ddragon.leagueoflegends.com/cdn/13.1.1/img/champion/${Object.keys(topChamps)[4]}.png`} alt="Champion Icon" width="42" height="42" />
                                </div>
                              }

                            </div>

                            <div class="column is-4">

                              {Object.keys(topChamps)[0]}
                              <br></br>
                              CS {Math.round((topChamps[Object.keys(topChamps)[0]]['totalMinionsKilled'] / topChamps[Object.keys(topChamps)[0]]['games']) * 10) / 10}
                              &nbsp;
                              ({Math.round((topChamps[Object.keys(topChamps)[0]]['totalMinionsKilled'] / (topChamps[Object.keys(topChamps)[0]]['time'] / 60)) * 10) / 10})
                              <br></br>

                              <br></br>
                              {Object.keys(topChamps)[1]}
                              <br></br>
                              CS {Math.round((topChamps[Object.keys(topChamps)[1]]['totalMinionsKilled'] / topChamps[Object.keys(topChamps)[1]]['games']) * 10) / 10}
                              &nbsp;
                              ({Math.round((topChamps[Object.keys(topChamps)[1]]['totalMinionsKilled'] / (topChamps[Object.keys(topChamps)[1]]['time'] / 60)) * 10) / 10})
                              <br></br>

                              <br></br>
                              {Object.keys(topChamps)[2]}
                              <br></br>
                              CS {Math.round((topChamps[Object.keys(topChamps)[2]]['totalMinionsKilled'] / topChamps[Object.keys(topChamps)[2]]['games']) * 10) / 10}
                              &nbsp;
                              ({Math.round((topChamps[Object.keys(topChamps)[2]]['totalMinionsKilled'] / (topChamps[Object.keys(topChamps)[2]]['time'] / 60)) * 10) / 10})
                              <br></br>

                              <br></br>
                              {Object.keys(topChamps)[3]}
                              <br></br>
                              CS {Math.round((topChamps[Object.keys(topChamps)[3]]['totalMinionsKilled'] / topChamps[Object.keys(topChamps)[3]]['games']) * 10) / 10}
                              &nbsp;
                              ({Math.round((topChamps[Object.keys(topChamps)[3]]['totalMinionsKilled'] / (topChamps[Object.keys(topChamps)[3]]['time'] / 60)) * 10) / 10})
                              <br></br>

                              {Object.keys(topChamps).length >= 5 &&
                                <div>
                                  <br></br>
                                  {Object.keys(topChamps)[4]}
                                  < br ></br>
                                  CS {Math.round((topChamps[Object.keys(topChamps)[4]]['totalMinionsKilled'] / topChamps[Object.keys(topChamps)[4]]['games']) * 10) / 10}
                                  &nbsp;
                                  ({Math.round((topChamps[Object.keys(topChamps)[4]]['totalMinionsKilled'] / (topChamps[Object.keys(topChamps)[4]]['time'] / 60)) * 10) / 10})
                                  <br></br>
                                </div>

                              }

                            </div>
                            <div class="column is-3">
                              {Math.round(topChamps[Object.keys(topChamps)[0]]['KDA_ratio'] * 100) / 100}:1 KDA
                              <br></br>
                              {Math.round((topChamps[Object.keys(topChamps)[0]]['kills'] / topChamps[Object.keys(topChamps)[0]]['games']) * 10) / 10}   &nbsp;/  &nbsp;
                              {Math.round((topChamps[Object.keys(topChamps)[0]]['deaths'] / topChamps[Object.keys(topChamps)[0]]['games']) * 10) / 10}   &nbsp;/  &nbsp;
                              {Math.round((topChamps[Object.keys(topChamps)[0]]['assists'] / topChamps[Object.keys(topChamps)[0]]['games']) * 10) / 10}
                              <br></br>

                              <br></br>
                              {Math.round(topChamps[Object.keys(topChamps)[1]]['KDA_ratio'] * 100) / 100}:1 KDA
                              <br></br>
                              {Math.round((topChamps[Object.keys(topChamps)[1]]['kills'] / topChamps[Object.keys(topChamps)[1]]['games']) * 10) / 10}   &nbsp;/  &nbsp;
                              {Math.round((topChamps[Object.keys(topChamps)[1]]['deaths'] / topChamps[Object.keys(topChamps)[1]]['games']) * 10) / 10}   &nbsp;/  &nbsp;
                              {Math.round((topChamps[Object.keys(topChamps)[1]]['assists'] / topChamps[Object.keys(topChamps)[1]]['games']) * 10) / 10}
                              <br></br>

                              <br></br>
                              {Math.round(topChamps[Object.keys(topChamps)[2]]['KDA_ratio'] * 100) / 100}:1 KDA
                              <br></br>
                              {Math.round((topChamps[Object.keys(topChamps)[2]]['kills'] / topChamps[Object.keys(topChamps)[2]]['games']) * 10) / 10}  &nbsp; /  &nbsp;
                              {Math.round((topChamps[Object.keys(topChamps)[2]]['deaths'] / topChamps[Object.keys(topChamps)[2]]['games']) * 10) / 10}   &nbsp;/  &nbsp;
                              {Math.round((topChamps[Object.keys(topChamps)[2]]['assists'] / topChamps[Object.keys(topChamps)[2]]['games']) * 10) / 10}
                              <br></br>

                              <br></br>
                              {Math.round(topChamps[Object.keys(topChamps)[3]]['KDA_ratio'] * 100) / 100}:1 KDA
                              <br></br>
                              {Math.round((topChamps[Object.keys(topChamps)[3]]['kills'] / topChamps[Object.keys(topChamps)[3]]['games']) * 10) / 10}   &nbsp;/  &nbsp;
                              {Math.round((topChamps[Object.keys(topChamps)[3]]['deaths'] / topChamps[Object.keys(topChamps)[3]]['games']) * 10) / 10}   &nbsp;/  &nbsp;
                              {Math.round((topChamps[Object.keys(topChamps)[3]]['assists'] / topChamps[Object.keys(topChamps)[3]]['games']) * 10) / 10}
                              <br></br>

                              {Object.keys(topChamps).length >= 5 &&
                                <div>
                                  <br></br>
                                  {Math.round(topChamps[Object.keys(topChamps)[4]]['KDA_ratio'] * 100) / 100}:1 KDA
                                  <br></br>
                                  {Math.round((topChamps[Object.keys(topChamps)[4]]['kills'] / topChamps[Object.keys(topChamps)[4]]['games']) * 10) / 10}  &nbsp; /  &nbsp;
                                  {Math.round((topChamps[Object.keys(topChamps)[4]]['deaths'] / topChamps[Object.keys(topChamps)[4]]['games']) * 10) / 10}   &nbsp;/  &nbsp;
                                  {Math.round((topChamps[Object.keys(topChamps)[4]]['assists'] / topChamps[Object.keys(topChamps)[4]]['games']) * 10) / 10}
                                </div>
                              }
                            </div>
                            <div class="column is-3">
                              {Math.round(topChamps[Object.keys(topChamps)[0]]['win_rate'] * 100)}%
                              <br></br>
                              {topChamps[Object.keys(topChamps)[0]]['games']} Played
                              <br></br>

                              <br></br>
                              {Math.round(topChamps[Object.keys(topChamps)[1]]['win_rate'] * 100)}%
                              <br></br>
                              {topChamps[Object.keys(topChamps)[1]]['games']} Played
                              <br></br>

                              <br></br>
                              {Math.round(topChamps[Object.keys(topChamps)[2]]['win_rate'] * 100)}%
                              <br></br>
                              {topChamps[Object.keys(topChamps)[2]]['games']} Played
                              <br></br>

                              <br></br>
                              {Math.round(topChamps[Object.keys(topChamps)[3]]['win_rate'] * 100)}%
                              <br></br>
                              {topChamps[Object.keys(topChamps)[3]]['games']} Played
                              <br></br>

                              {Object.keys(topChamps).length >= 5 &&
                                <div>
                                  <br></br>
                                  {Math.round(topChamps[Object.keys(topChamps)[4]]['win_rate'] * 100)}%
                                  <br></br>
                                  {topChamps[Object.keys(topChamps)[1]]['games']} Played
                                  <br></br>
                                </div>
                              }
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

                                  <div onClick={() => { handleButtonClick(index); handleExpand(index) }} className={`rec ${match[0].win === 1 ? "win" : "loss"} ${showExtraContent ? 'move-down' : ''}`}>

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
                                                            <td class="champion_picture">
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
                                                            <td class="champion_picture">
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
                                                            <td class="champion_picture">
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
                                                            <td class="champion_picture">
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
                                                            <td class="champion_picture">
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
                                                            <td class="champion_picture">
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
                                                            <td class="champion_picture">
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
                                                            <td class="champion_picture">
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
                                                            <td class="champion_picture">
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
                                                            <td class="champion_picture">
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


function AboutUs() {
  return (
    <div className="aboutUsContainer">
      <h1 className="aboutUsHeading">About Us</h1>
      <p className="aboutUsDescription">We are a team of developers dedicated to providing a platform for summoners to easily find and access their match data.</p>
      <p className="aboutUsDescription">Our goal is to make it easier for players to analyze and track their performance in League of Legends.</p>
      <button className="backButton" onClick={() => window.location.assign('/')}>Back to Initial Page</button>
    </div>
  );
}

function Help() {
  return (
    <div className={styles.helpContainer}>
      <h1 className={styles.title}>Help</h1>
      <p className={styles.text}>If you need assistance with our platform, please contact us at [temp].</p>
      <p className={styles.text}>For general questions, visit our FAQ page [temp].</p>
      <button className={styles.backButton} onClick={() => window.location.assign("/")}>Back to Initial Page</button>
    </div>
  );
}
function NewsPage() {

  const [newsData, setNewsData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const result = await axios.get('need to find one');
      setNewsData(result.data);
    }
    fetchData();
  }, []);

  return (
    <div>
      <h1>Latest News</h1>
      {newsData.map(newsItem => (
        <div key={newsItem.id}>
          <h2>{newsItem.title}</h2>
          <p>{newsItem.content}</p>
        </div>
      ))}
    </div>
  );
}



function TeamPageSearch() {
  function handleAboutUs() {
    window.location.assign("/about-us");
  }

  function handleHelp() {
    window.location.assign("/help");
  }
  function handleFeed() {
    window.location.assign("/feed");
  }

  function handleSoloPage() {
    window.location.assign("/");
  }

  const [ally1, setAlly1] = useState('');
  const [ally2, setAlly2] = useState('');
  const [ally3, setAlly3] = useState('');
  const [ally4, setAlly4] = useState('');
  const [ally5, setAlly5] = useState('');

  const [enemy1, setEnemy1] = useState('');
  const [enemy2, setEnemy2] = useState('');
  const [enemy3, setEnemy3] = useState('');
  const [enemy4, setEnemy4] = useState('');
  const [enemy5, setEnemy5] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    const searchQuery = `${ally1},${ally2},${ally3},${ally4},${ally5},${enemy1},${enemy2},${enemy3},${enemy4},${enemy5}`;
    if (searchQuery) {
      window.location.assign(`/team?summoners=${searchQuery}`);
    }
  }
  return (


    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div className={styles.flashingtext}>
        <h1><span class='one'>U</span><span class='two'>L</span><span class='three'>O</span><span class='four'>L</span> <span class='five'>.</span><span class='six'>G</span><span class='seven'>G</span></h1></div>


      <form onSubmit={handleSubmit} className={styles.container}>
        <div className={styles.team1}>
          <input type="text" placeholder="TOP" onChange={(e) => setAlly1(e.target.value)} className={styles.allybutton1} />
          <input type="text" placeholder="JUNGLE" onChange={(e) => setAlly2(e.target.value)} className={styles.allybutton2} />
          <input type="text" placeholder="MID" onChange={(e) => setAlly3(e.target.value)} className={styles.allybutton3} />
          <input type="text" placeholder="BOT" onChange={(e) => setAlly4(e.target.value)} className={styles.allybutton4} />
          <input type="text" placeholder="SUPPORT" onChange={(e) => setAlly5(e.target.value)} className={styles.allybutton5} />
        </div>

        <div className={styles.team2}>
          <input type="text" placeholder="TOP" onChange={(e) => setEnemy1(e.target.value)} className={styles.enemybutton1} />
          <input type="text" placeholder="JUNGLE" onChange={(e) => setEnemy2(e.target.value)} className={styles.enemybutton2} />
          <input type="text" placeholder="MID" onChange={(e) => setEnemy3(e.target.value)} className={styles.enemybutton3} />
          <input type="text" placeholder="BOT" onChange={(e) => setEnemy4(e.target.value)} className={styles.enemybutton4} />
          <input type="text" placeholder="SUPPORT" onChange={(e) => setEnemy5(e.target.value)} className={styles.enemybutton5} />
        </div>
        <button type="submit">Search</button>
      </form>

      <div className={styles.square}>
        <div className={styles.helpAboutContainer}>
          <button onClick={handleAboutUs} className={styles.helpButton}>About Us</button>
          <button onClick={handleHelp} className={styles.AboutButton}>Help</button>
          {/* <button onClick={handleFeed} className={styles.ScrimButton}>Temp</button> */}
          <button onClick={handleSoloPage} className={styles.ScrimButton}>Home</button>
          {/* <button onClick={handleteamPageSearch} className={styles.TeamSearchButton}>Team Search</button> */}
        </div></div>

    </div>
    // <div className={styles.helpContainer}>
    //   <h1 className={styles.title}>Help</h1>
    //   <p className={styles.text}>If you need assistance with our platform, please contact us at [temp].</p>
    //   <p className={styles.text}>For general questions, visit our FAQ page [temp].</p>
    //   <button className={styles.backButton} onClick={() => window.location.assign("/")}>Back to Initial Page</button>
    // </div>
  );
}



function App() {
  return (
    <BrowserRouter>

      <Route exact path="/" component={Homepagesoloandteam} />
      <Route exact path="/solo-page" component={InitialPage} />
      <Route exact path="/other-page" component={OtherPage} />
      <Route exact path="/about-us" component={AboutUs} />
      <Route exact path="/help" component={Help} />
      <Route exact path="/feed" component={NewsPage} />
      <Route exact path="/team-search" component={TeamPageSearch} />
      <Route exact path="/team" component={TeamPage} />

    </BrowserRouter>
  );
}

export default App;