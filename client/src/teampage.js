import React, { useState, useEffect } from 'react'
import 'bulma/css/bulma.min.css';
import './App.css';
import BACKGROUND from './rankimg/background.mp4'
import styles from './initial-page.module.css';
import { useLocation } from 'react-router-dom';


function TeamPage() {

    const [summoners, setSummoners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [team1Top, setTeam1Top] = useState({});
    const [team1Jgl, setTeam1Jgl] = useState({});
    const [team1Mid, setTeam1Mid] = useState({});
    const [team1Bot, setTeam1Bot] = useState({});
    const [team1Sup, setTeam1Sup] = useState({});
    const [team2Top, setTeam2Top] = useState({});
    const [team2Jgl, setTeam2Jgl] = useState({});
    const [team2Mid, setTeam2Mid] = useState({});
    const [team2Bot, setTeam2Bot] = useState({});
    const [team2Sup, setTeam2Sup] = useState({});


        function handleAboutUs() {
        window.location.assign("/about-us");
      }
    
      function handleHelp() {
        window.location.assign("/help");
      }
    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const summoners = queryParams.get('summoners').split(",");
        console.log(summoners);
        fetch(`/team/${summoners[0]},${summoners[1]},${summoners[2]},${summoners[3]},${summoners[4]},${summoners[5]},${summoners[6]},${summoners[7]},${summoners[8]},${summoners[9]}`)

            .then(res => {
                if (!res.ok) {
                    throw Error(res.statusText);
                }
                return res.json();
            })
            .then(data => {
                setTeam1Top(data.team1.TOP);
                setTeam1Jgl(data.team1.JUNGLE);
                setTeam1Mid(data.team1.MIDDLE);
                setTeam1Bot(data.team1.BOTTOM);
                setTeam1Sup(data.team1.SUPPORT);
                setTeam2Top(data.team2.TOP);
                setTeam2Jgl(data.team2.JUNGLE);
                setTeam2Mid(data.team2.MIDDLE);
                setTeam2Bot(data.team2.BOTTOM);
                setTeam2Sup(data.team2.SUPPORT);
                setLoading(false);
            })
            .catch(error => {
                console.log(error);
                alert("Error fetching data");
            });
    }, [summoners]);
    if (loading) { 
        return (
            <div className="loading-screen">
                    <div className="loading-screen">
      <div className="loading-box">
        <div className="loading-text">Loading</div>
        <div className="vs-container">
          <div className="vs">
            <span>V</span>
            <span>S</span>
          </div>
        </div>
      </div>
    </div>
            </div>
        )
    }

    return (
        <div>
           
            <div>
            <div className={styles.overlay}></div>
      <video autoPlay muted loop id="background-video" style={{ position: 'fixed', minWidth: '100%', minHeight: '100%', top: 0, left: 0, zIndex: '-1' }}>
        <source src={BACKGROUND} type="video/mp4" />
      </video>
                
                    {/* <!-- Team 1 Section --> */}
                    {/* <div class="columns">
                        <div class="column is-2"> */}
                    {/* <!-- Top Player --> */}
                    <a href={`http://localhost:3000/other-page?summonerName=${team1Top.summonerName}`}>
                    <div class={styles.caixa1}>
                        <p class={styles.teamtitle}>Top</p>
                        <figure class="image is-128x128">
                        <img  class="is-rounded2" src={`http://ddragon.leagueoflegends.com/cdn/13.1.1/img/profileicon/${team1Top.icon}.png`} alt="Player Icon"></img>
                        </figure>
                        
                        <p class={styles.teamsumname}>{team1Top.summonerName}</p>
                        <hr></hr>
                        <p class={styles.second}>{team1Top.average_cs_diff_at_15} CS Avg CS DIFF in 15m</p>
                        <p class={styles.third}>{team1Top.average_kda_at_15} KDA</p>
                        <p class={styles.forth}>{team1Top.firstblood_participation}% First Blood Participation </p>
                    </div>
                    </a>
                    {/* <!-- Jungle Player --> */}
                    <a href={`http://localhost:3000/other-page?summonerName=${team1Jgl.summonerName}`}>
                    <div class={styles.caixa1}>
                        <p class={styles.teamtitle}>Jungle</p>
                        <figure class="image is-128x128">
                        <img  class="is-rounded2" src={`http://ddragon.leagueoflegends.com/cdn/13.1.1/img/profileicon/${team1Jgl.icon}.png`} alt="Player Icon"></img>
                        </figure>
                        
                        <p class={styles.teamsumname}>{team1Jgl.summonerName}</p>
                        <hr></hr>
                        <p class={styles.second}>{team1Jgl.average_first_dragon_timer} minutes avg first drangon</p>
                        <p class={styles.third}>{team1Jgl.average_kda_at_15} KDA</p>
                        <p class={styles.forth}>{team1Jgl.average_first_herald_timer} minutes avg first herald</p>
                    </div>
                    </a>
                    {/* <!-- Middle Player --> */}
                    <a href={`http://localhost:3000/other-page?summonerName=${team1Mid.summonerName}`}>
                    <div class={styles.caixa1}>
                        <p class={styles.teamtitle}>Middle</p>
                        <figure class="image is-128x128">
                        <img  class="is-rounded2"  src={`http://ddragon.leagueoflegends.com/cdn/13.1.1/img/profileicon/${team1Mid.icon}.png`} alt="Player Icon"></img>
                        </figure>
                        
                        <p class={styles.teamsumname}>{team1Mid.summonerName}</p>
                        <hr></hr>
                        <p class={styles.second}>{team1Mid.average_cs_diff_at_15} CS Avg CS DIFF in 15m</p>
                        <p class={styles.third}>{team1Mid.average_kda_at_15} KDA</p>
                        <p class={styles.forth}>{team1Mid.firstblood_participation}% First Blood Participation </p>
                    </div>
                    </a>
                    {/* <!-- Bottom Player --> */}
                    <a href={`http://localhost:3000/other-page?summonerName=${team1Bot.summonerName}`}>
                    <div class={styles.caixa1}>
                        <p class={styles.teamtitle}>Bottom</p>
                        <figure class="image is-128x128">
                        <img  class="is-rounded2" src={`http://ddragon.leagueoflegends.com/cdn/13.1.1/img/profileicon/${team1Bot.icon}.png`} alt="Player Icon"></img>
                        </figure>
                        
                        <p class={styles.teamsumname}>{team1Bot.summonerName}</p>
                        <hr></hr>
                        <p class={styles.second}>{team1Bot.average_cs_diff_at_15} CS Avg CS DIFF in 15m</p>
                        <p class={styles.third}>{team1Bot.average_kda_at_15} KDA</p>
                        <p class={styles.forth}>{team1Bot.firstblood_participation}% First Blood Participation </p>
                    </div>
                    </a>
                    {/* <-- Support Player --> */}
                    <a href={`http://localhost:3000/other-page?summonerName=${team1Sup.summonerName}`}>
                    <div class={styles.caixa1}>
                        <p class={styles.teamtitle}>Support</p>
                        <figure class="image is-128x128">
                        <img   class="is-rounded2" src={`http://ddragon.leagueoflegends.com/cdn/13.1.1/img/profileicon/${team1Sup.icon}.png`} alt="Player Icon"></img>
                        </figure>
                        
                        <p class={styles.teamsumname}>{team1Sup.summonerName}</p>
                        <hr></hr>
                        <p class={styles.second}>{team1Sup.average_vision_score} Vision Score</p>
                        <p class={styles.third}>{team1Sup.average_kda_at_15} KDA</p>
                        {/* <p class={styles.teamtitle}>{team1Bot.firstblood_participation}% First Blood Participation </p> */}
                        <p class={styles.forth}>{team1Sup.average_control_wards} Control Wards</p>

                    </div>
                    </a>
                    {/* </div>
                    </div> */}
              
            </div>

                

                    {/* <!-- Team 2 Section --> */}
                    {/* <div class="columns">
                    <div class="column is-2"> */}
                    {/* <!-- Top Player --> */}
                    <a href={`http://localhost:3000/other-page?summonerName=${team2Top.summonerName}`}>
                    <div class={styles.caixa1}>
                        <p class={styles.teamtitle}>Top</p>
                        <figure class="image is-128x128">
                        <img   class="is-rounded2" src={`http://ddragon.leagueoflegends.com/cdn/13.1.1/img/profileicon/${team2Top.icon}.png`} alt="Player Icon"></img>
                        </figure>
                        
                        <p class={styles.teamsumname}>{team2Top.summonerName}</p>
                        <hr></hr>
                        <p class={styles.second}>{team2Top.average_cs_diff_at_15} CS Avg CS DIFF in 15m</p>
                        <p class={styles.third}>{team2Top.average_kda_at_15} KDA</p>
                        <p class={styles.forth}>{team2Top.firstblood_participation}% First Blood Participation </p>
                    </div>
                    </a>
                    {/* <!-- Jungle Player --> */}
                    <a href={`http://localhost:3000/other-page?summonerName=${team2Jgl.summonerName}`}>
                    <div class={styles.caixa1}>
                        <p class={styles.teamtitle}>Jungle</p>
                        <figure class="image is-128x128">
                        <img   class="is-rounded2" src={`http://ddragon.leagueoflegends.com/cdn/13.1.1/img/profileicon/${team2Jgl.icon}.png`} alt="Player Icon"></img>
                        </figure>
                        
                        <p class={styles.teamsumname}>{team2Jgl.summonerName}</p>
                        <hr></hr>
                        <p class={styles.second}>{team2Jgl.average_first_dragon_timer} avg first drangon</p>
                        <p class={styles.third}>{team2Jgl.average_kda_at_15} KDA</p>
                        <p class={styles.forth}>{team2Jgl.average_first_herald_timer} avg first herald</p>
                    </div>
                    </a>
                    {/* <!-- Middle Player --> */}
                    <a href={`http://localhost:3000/other-page?summonerName=${team1Mid.summonerName}`}>
                    <div class={styles.caixa1}>
                        <p class={styles.teamtitle}>Middle</p>
                        <figure class="image is-128x128">
                        <img   class="is-rounded2" src={`http://ddragon.leagueoflegends.com/cdn/13.1.1/img/profileicon/${team2Mid.icon}.png`} alt="Player Icon"></img>
                        </figure>
                        
                        <p class={styles.teamsumname}>{team2Mid.summonerName}</p>
                        <hr></hr>
                        <p class={styles.second}>{team2Mid.average_cs_diff_at_15} CS Avg CS DIFF in 15m</p>
                        <p class={styles.third}>{team2Mid.average_kda_at_15} KDA</p>
                        <p class={styles.forth}>{team2Mid.firstblood_participation}% First Blood Participation </p>
                    </div>
                    </a>
                    {/* <!-- Bottom Player --> */}
                    <a href={`http://localhost:3000/other-page?summonerName=${team1Bot.summonerName}`}>
                    <div class={styles.caixa1}>
                        <p class={styles.teamtitle}>Bottom</p>
                        <figure class="image is-128x128">
                        <img  class="is-rounded2" src={`http://ddragon.leagueoflegends.com/cdn/13.1.1/img/profileicon/${team2Bot.icon}.png`} alt="Player Icon"></img>
                        </figure>
                        
                        <p class={styles.teamsumname}>{team2Bot.summonerName}</p>
                        <hr></hr>
                        <p class={styles.second}>{team2Bot.average_cs_diff_at_15} CS Avg CS DIFF in 15m</p>
                        <p class={styles.third}>{team2Bot.average_kda_at_15} KDA</p>
                        <p class={styles.forth}>{team2Bot.firstblood_participation}% First Blood Participation  </p>
                    </div>
                    </a>
                    {/* <-- Support Player --> */}
                    <a href={`http://localhost:3000/other-page?summonerName=${team2Sup.summonerName}`}>
                    <div class={styles.caixa1}>
                        <p class={styles.teamtitle}>Support</p>
                        <figure class="image is-128x128">
                        <img  class="is-rounded2"  src={`http://ddragon.leagueoflegends.com/cdn/13.1.1/img/profileicon/${team2Sup.icon}.png`} alt="Player Icon"></img>
                        </figure>
                        
                        <p class={styles.teamsumname}>{team2Sup.summonerName}</p>
                        <hr></hr>
                        <p class={styles.second}>{team2Sup.average_vision_score} Vision Score</p>
                        <p class={styles.third}>{team2Sup.average_kda_at_15} KDA</p>
                        {/* <p class={styles.teamtitle}>{team2Bot.firstblood_participation}% First Blood Participation </p> */}
                        <p class={styles.forth}>{team2Sup.average_control_wards} Control Wards</p>
                    </div>
                    </a>
                    {/* </div> */}
                    {/* </div> */}
                
                    <div className={styles.square}>

                        <a href="http://localhost:3000/">
                        <button className={styles.hpButton}>Home Page</button>
                        </a>
                        <button onClick={handleAboutUs} className={styles.helpButton}>About Us</button>
                        <button onClick={handleHelp} className={styles.About2Button}>Help</button>
                        {/* <button onClick={handleteamPageSearch} className={styles.TeamSearchButton}>Team Search</button> */}
                    </div>
            </div>
     



    );
}

export default TeamPage;