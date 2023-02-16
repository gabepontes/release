import React, { useState, useEffect } from 'react'
import 'bulma/css/bulma.min.css';


function TeamPage() {
    const [topStats, setTopStats] = useState({});
    const [playerStats, setPlayerStats] = useState({});
    const [summoner_name_top, setSummonerNameTop] = useState('');
    const [summoner_name_jungle, setSummonerJungle] = useState('');
    const [summoner_name_mid, setSummonerNameMid] = useState('');
    const [summoner_name_bot, setSummonerNameBot] = useState('');
    const [summoner_name_sup, setSummonerNameSup] = useState('');


    useEffect(() => {
        fetch(`/team/${summoner_name_top},${summoner_name_jungle},${summoner_name_mid},${summoner_name_bot},${summoner_name_sup}`).then(data => {
            setTopStats(data.top_stats);
            setPlayerStats(data.players);
        })
    }, []);

    return (

        <div>

            <div class="section">
                <div class="columns ">
                    <div class="column is-1 ">
                        <table class="table is-striped is-fullwidth ">
                            <tr>
                                <th>
                                    &nbsp;
                                </th>

                            </tr>

                            <tr><td>Top</td></tr>
                            <tr><td>&nbsp;</td></tr>
                            <tr>&nbsp;</tr>
                            <tr>&nbsp;</tr>

                            <tr><td>Jungle</td></tr>
                            <tr><td>&nbsp;</td></tr>
                            <tr>&nbsp;</tr>

                            <tr><td>Middle</td></tr>
                            <tr><td>&nbsp;</td></tr>
                            <tr>&nbsp;</tr>

                            <tr><td>Bottom</td></tr>
                            <tr><td>&nbsp;</td></tr>
                            <tr>&nbsp;</tr>

                            <tr><td>Support</td></tr>
                            <tr><td>&nbsp;</td></tr>

                        </table>


                    </div>
                    <div class="column is-2">
                        <table class="table is-striped is-fullwidth ">
                            <tr>
                                <th>
                                    &nbsp;
                                </th>

                            </tr>

                            <tr><td>Avg CS Diff at 15 min</td></tr>
                            <tr><td>Avg KDA at 15 min</td></tr>
                            <tr><td>First Blood Percentage</td></tr>
                            <tr>&nbsp;</tr>

                            <tr><td>Average Herald Time</td></tr>
                            <tr><td>Average Dragon Time</td></tr>
                            <tr>&nbsp;</tr>

                            <tr><td>Kill Participation</td></tr>
                            <tr><td>Gold/Minute</td></tr>
                            <tr>&nbsp;</tr>

                            <tr><td>CS/Minute</td></tr>
                            <tr><td>Gold/Minute</td></tr>
                            <tr>&nbsp;</tr>

                            <tr><td>Vision Score</td></tr>
                            <tr><td>Kill Participation</td></tr>

                        </table>

                    </div>


                    <div class="column is-9">

                        <table class="table is-striped is-fullwidth">
                            <tr>
                                <th>
                                    Team 1
                                </th>
                                <th>
                                    Team 2
                                </th>
                            </tr>

                            <tr><td>x {playerStats}</td>
                                <td>y</td></tr>
                            <tr><td>x</td>
                                <td>y</td></tr>
                            <tr>&nbsp;</tr>

                            <tr><td>x</td>
                                <td>y</td></tr>
                            <tr><td>x</td>
                                <td>y</td></tr>
                            <tr>&nbsp;</tr>

                            <tr><td>x</td>
                                <td>y</td></tr>
                            <tr><td>x</td>
                                <td>y</td></tr>
                            <tr>&nbsp;</tr>

                            <tr><td>x</td>
                                <td>y</td></tr>
                            <tr><td>x</td>
                                <td>y</td></tr>
                            <tr>&nbsp;</tr>

                            <tr><td>x</td>
                                <td>y</td></tr>
                            <tr><td>x</td>
                                <td>y</td></tr>



                        </table>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default TeamPage;