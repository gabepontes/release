import React, { useState, useEffect } from 'react'
import 'bulma/css/bulma.min.css';
import './App.css';
import styles from './initial-page.module.css';
import { useLocation } from 'react-router-dom';


function TeamPage() {

    const [summoners, setSummoners] = useState([]);

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

            })
            .catch(error => {
                console.log(error);
                alert("Error fetching data");
            });
    }, [summoners]);


    return (

        <div>

            <div class="section">
                <div class="columns ">
                    <div class="column is-2 ">
                        <table class="table is-borderless is-fullwidth has-background-dark has-text-white">
                            <tr>
                                <th>
                                    &nbsp;
                                </th>

                            </tr>

                            <tr><td>Top</td></tr>
                            <tr><td>Team 1 - {team1Top.summonerName}</td></tr>
                            <tr><td>Team 2 - {team2Top.summonerName}</td></tr>
                            <tr>&nbsp;</tr>

                            <tr><td>Jungle</td></tr>
                            <tr><td>Team 1 - {team1Jgl.summonerName}</td></tr>
                            <tr><td>Team 2 - {team2Jgl.summonerName}</td></tr>
                            <tr>&nbsp;</tr>

                            <tr><td>Middle</td></tr>
                            <tr><td>Team 1 - {team1Mid.summonerName}</td></tr>
                            <tr><td>Team 2 - {team2Mid.summonerName}</td></tr>
                            <tr>&nbsp;</tr>

                            <tr><td>Bottom</td></tr>
                            <tr><td>Team 1 - {team1Bot.summonerName}</td></tr>
                            <tr><td>Team 2 - {team2Bot.summonerName}</td></tr>
                            <tr>&nbsp;</tr>

                            <tr><td>Support</td></tr>
                            <tr><td>Team 1 - {team1Sup.summonerName}</td></tr>
                            <tr><td>Team 2 - {team2Sup.summonerName}</td></tr>

                        </table>

                    </div>



                    <div class="column is-2">
                        <table class="table is-striped is-fullwidth has-background-dark has-text-white">
                            <tr>
                                <th>
                                    &nbsp;
                                </th>

                            </tr>

                            <tr><td>Avg CS Difference at 15 minutes</td></tr>
                            <tr><td>Average KDA at 15 minutes</td></tr>
                            <tr><td>First Blood Participation Percentage</td></tr>
                            <tr>&nbsp;</tr>

                            <tr><td>Average First Dragon Timer</td></tr>
                            <tr><td>Average KDA at 15 minutes</td></tr>
                            <tr><td>Average First Herald Timer</td></tr>
                            <tr>&nbsp;</tr>

                            <tr><td>Avg CS Difference at 15 minutes</td></tr>
                            <tr><td>Average KDA at 15 minutes</td></tr>
                            <tr><td>First Blood Participation Percentage</td></tr>
                            <tr>&nbsp;</tr>

                            <tr><td>Avg CS Difference at 15 minutes</td></tr>
                            <tr><td>Average KDA at 15 minutes</td></tr>
                            <tr><td>First Blood Participation Percentage</td></tr>
                            <tr>&nbsp;</tr>

                            <tr><td>Average Vision Score</td></tr>
                            <tr><td>Average KDA at 15 minutes</td></tr>
                            <tr><td>&nbsp;</td></tr>

                        </table>

                    </div>



                    <div class="column is-8">

                        <table class="table is-striped is-fullwidth has-background-dark has-text-white">
                            <tr>
                                <th class="th has-text-white">
                                    Team 1
                                </th>
                                <th class="th has-text-white">
                                    Team 2
                                </th>
                            </tr>



                            <tr><td>{team1Top.average_cs_diff_at_15} CS</td>
                                <td>{team2Top.average_cs_diff_at_15} CS</td></tr>

                            <tr><td>{team1Top.average_kda_at_15} KDA</td>
                                <td>{team2Top.average_kda_at_15} KDA</td></tr>

                            <tr><td>{team1Top.firstblood_participation}%</td>
                                <td>{team2Top.firstblood_participation}%</td></tr>
                            <tr>&nbsp;</tr>



                            <tr><td>{team1Jgl.average_first_dragon_timer} minutes</td>
                                <td>{team2Jgl.average_first_dragon_timer} minutes</td></tr>

                            <tr><td>{team1Jgl.average_kda_at_15} KDA</td>
                                <td>{team2Jgl.average_kda_at_15} KDA</td></tr>

                            <tr><td>{team1Jgl.average_first_herald_timer} minutes</td>
                                <td>{team2Jgl.average_first_herald_timer} minutes</td></tr>
                            <tr>&nbsp;</tr>



                            <tr><td>{team1Mid.average_cs_diff_at_15} CS</td>
                                <td>{team2Mid.average_cs_diff_at_15} CS</td></tr>

                            <tr><td>{team1Mid.average_kda_at_15} KDA</td>
                                <td>{team2Mid.average_kda_at_15} KDA</td></tr>

                            <tr><td>{team1Mid.firstblood_participation}%</td>
                                <td>{team2Mid.firstblood_participation}%</td></tr>
                            <tr>&nbsp;</tr>



                            <tr><td>{team1Bot.average_cs_diff_at_15} CS</td>
                                <td>{team2Bot.average_cs_diff_at_15} CS</td></tr>

                            <tr><td>{team1Bot.average_kda_at_15} KDA</td>
                                <td>{team2Bot.average_kda_at_15} KDA</td></tr>

                            <tr><td>{team1Bot.firstblood_participation}%</td>
                                <td>{team2Bot.firstblood_participation}%</td></tr>
                            <tr>&nbsp;</tr>



                            <tr><td>{team1Sup.average_vision_score} Vision Score</td>
                                <td>{team2Sup.average_vision_score} Vision Score</td></tr>

                            <tr><td>{team1Sup.average_kda_at_15} KDA</td>
                                <td>{team2Sup.average_kda_at_15} KDA</td></tr>
                            <tr><td>&nbsp;</td>
                                <td></td></tr>

                        </table>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default TeamPage;