import React, { useState, useEffect } from 'react'
import 'bulma/css/bulma.min.css';
import './App.css';
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
           
            <div class="section">
                <nav class="level">
                    {/* <!-- Team 1 Section --> */}
                    {/* <div class="columns">
                        <div class="column is-2"> */}
                    {/* <!-- Top Player --> */}
                    <div class="box boxTeam has-background-dark has-text-white">
                        <p class="has-text-white">Top</p>
                        <figure class="image is-128x128">
                        <img  class="is-rounded2" src={`http://ddragon.leagueoflegends.com/cdn/13.1.1/img/profileicon/${team1Top.icon}.png`} alt="Player Icon"></img>
                        </figure>
                        <hr></hr>
                        <p class="has-text-white">{team1Top.summonerName}</p>
                        <p class="has-text-white">{team1Top.average_cs_diff_at_15} CS</p>
                        <p class="has-text-white">{team1Top.average_kda_at_15} KDA</p>
                        <p class="has-text-white">{team1Top.firstblood_participation}%</p>
                    </div>

                    {/* <!-- Jungle Player --> */}
                    <div class="box boxTeam has-background-dark has-text-white">
                        <p class="has-text-white">Jungle</p>
                        <figure class="image is-128x128">
                        <img  class="is-rounded2" src={`http://ddragon.leagueoflegends.com/cdn/13.1.1/img/profileicon/${team1Jgl.icon}.png`} alt="Player Icon"></img>
                        </figure>
                        <hr></hr>
                        <p class="has-text-white">{team1Jgl.summonerName}</p>
                        <p class="has-text-white">{team1Jgl.average_first_dragon_timer} minutes</p>
                        <p class="has-text-white">{team1Jgl.average_kda_at_15} KDA</p>
                        <p class="has-text-white">{team1Jgl.average_first_herald_timer} minutes</p>
                    </div>

                    {/* <!-- Middle Player --> */}
                    <div class="box boxTeam has-background-dark has-text-white">
                        <p class="has-text-white">Middle</p>
                        <figure class="image is-128x128">
                        <img  class="is-rounded2"  src={`http://ddragon.leagueoflegends.com/cdn/13.1.1/img/profileicon/${team1Mid.icon}.png`} alt="Player Icon"></img>
                        </figure>
                        <hr></hr>
                        <p class="has-text-white">{team1Mid.summonerName}</p>
                        <p class="has-text-white">{team1Mid.average_cs_diff_at_15} CS</p>
                        <p class="has-text-white">{team1Mid.average_kda_at_15} KDA</p>
                        <p class="has-text-white">{team1Mid.firstblood_participation}%</p>
                    </div>

                    {/* <!-- Bottom Player --> */}
                    <div class="box boxTeam has-background-dark has-text-white">
                        <p class="has-text-white">Bottom</p>
                        <figure class="image is-128x128">
                        <img  class="is-rounded2" src={`http://ddragon.leagueoflegends.com/cdn/13.1.1/img/profileicon/${team1Bot.icon}.png`} alt="Player Icon"></img>
                        </figure>
                        <hr></hr>
                        <p class="has-text-white">{team1Bot.summonerName}</p>
                        <p class="has-text-white">{team1Bot.average_cs_diff_at_15} CS</p>
                        <p class="has-text-white">{team1Bot.average_kda_at_15} KDA</p>
                        <p class="has-text-white">{team1Bot.firstblood_participation}%</p>
                    </div>

                    {/* <-- Support Player --> */}
                    <div class="move-it-up">
                    <div class="box boxTeam has-background-dark has-text-white">
                        <p class="has-text-white">Support</p>
                        <figure class="image is-128x128">
                        <img   class="is-rounded2" src={`http://ddragon.leagueoflegends.com/cdn/13.1.1/img/profileicon/${team1Sup.icon}.png`} alt="Player Icon"></img>
                        </figure>
                        <hr></hr>
                        <p class="has-text-white">{team1Sup.summonerName}</p>
                        <p class="has-text-white">{team1Sup.average_vision_score} Vision Score</p>
                        <p class="has-text-white">{team1Sup.average_kda_at_15} KDA</p>
                        {/* <p class="has-text-white">{team1Bot.firstblood_participation}%</p> */}
                        <p class="has-text-white">{team1Sup.average_control_wards} Control Wards</p>
                    </div>
                    </div>
                    {/* </div>
                    </div> */}
                </nav>
            </div>
            <div class="section">
                <nav class="level">

                    {/* <!-- Team 2 Section --> */}
                    {/* <div class="columns">
                    <div class="column is-2"> */}
                    {/* <!-- Top Player --> */}
                    <div class="box boxTeam has-background-dark has-text-white">
                        <p class="has-text-white">Top</p>
                        <figure class="image is-128x128">
                        <img   class="is-rounded2" src={`http://ddragon.leagueoflegends.com/cdn/13.1.1/img/profileicon/${team2Top.icon}.png`} alt="Player Icon"></img>
                        </figure>
                        <hr></hr>
                        <p class="has-text-white">{team2Top.summonerName}</p>
                        <p class="has-text-white">{team2Top.average_cs_diff_at_15} CS</p>
                        <p class="has-text-white">{team2Top.average_kda_at_15} KDA</p>
                        <p class="has-text-white">{team2Top.firstblood_participation}%</p>
                    </div>

                    {/* <!-- Jungle Player --> */}
                    <div class="box boxTeam has-background-dark has-text-white">
                        <p class="has-text-white">Jungle</p>
                        <figure class="image is-128x128">
                        <img   class="is-rounded2" src={`http://ddragon.leagueoflegends.com/cdn/13.1.1/img/profileicon/${team2Jgl.icon}.png`} alt="Player Icon"></img>
                        </figure>
                        <hr></hr>
                        <p class="has-text-white">{team2Jgl.summonerName}</p>
                        <p class="has-text-white">{team2Jgl.average_first_dragon_timer} minutes</p>
                        <p class="has-text-white">{team2Jgl.average_kda_at_15} KDA</p>
                        <p class="has-text-white">{team2Jgl.average_first_herald_timer} minutes</p>
                    </div>

                    {/* <!-- Middle Player --> */}
                    <div class="box boxTeam has-background-dark has-text-white">
                        <p class="has-text-white">Middle</p>
                        <figure class="image is-128x128">
                        <img   class="is-rounded2" src={`http://ddragon.leagueoflegends.com/cdn/13.1.1/img/profileicon/${team2Mid.icon}.png`} alt="Player Icon"></img>
                        </figure>
                        <hr></hr>
                        <p class="has-text-white">{team2Mid.summonerName}</p>
                        <p class="has-text-white">{team2Mid.average_cs_diff_at_15} CS</p>
                        <p class="has-text-white">{team2Mid.average_kda_at_15} KDA</p>
                        <p class="has-text-white">{team2Mid.firstblood_participation}%</p>
                    </div>

                    {/* <!-- Bottom Player --> */}
                    <div class="box boxTeam has-background-dark has-text-white">
                        <p class="has-text-white">Bottom</p>
                        <figure class="image is-128x128">
                        <img  class="is-rounded2"   src={`http://ddragon.leagueoflegends.com/cdn/13.1.1/img/profileicon/${team2Bot.icon}.png`} alt="Player Icon"></img>
                        </figure>
                        <hr></hr>
                        <p class="has-text-white">{team2Bot.summonerName}</p>
                        <p class="has-text-white">{team2Bot.average_cs_diff_at_15} CS</p>
                        <p class="has-text-white">{team2Bot.average_kda_at_15} KDA</p>
                        <p class="has-text-white">{team2Bot.firstblood_participation}%</p>
                    </div>

                    {/* <-- Support Player --> */}
                    <div class="move-it-up">
                    <div class="box boxTeam has-background-dark has-text-white">
                        <p class="has-text-white">Support</p>
                        <figure class="image is-128x128">
                        <img  class="is-rounded2"  src={`http://ddragon.leagueoflegends.com/cdn/13.1.1/img/profileicon/${team2Sup.icon}.png`} alt="Player Icon"></img>
                        </figure>
                        <hr></hr>
                        <p class="has-text-white">{team2Sup.summonerName}</p>
                        <p class="has-text-white">{team2Sup.average_vision_score} Vision Score</p>
                        <p class="has-text-white">{team2Sup.average_kda_at_15} KDA</p>
                        {/* <p class="has-text-white">{team2Bot.firstblood_participation}%</p> */}
                        <p class="has-text-white">{team2Sup.average_control_wards} Control Wards</p>
                    </div>
                    </div>
                    {/* </div> */}
                    {/* </div> */}
                </nav>

            </div>
        </div>



    );
}

export default TeamPage;