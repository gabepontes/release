import React, { useState, useEffect } from 'react'
import 'bulma/css/bulma.min.css';
import { useLocation } from 'react-router-dom';


function TeamPage() {

    const [playerStats, setPlayerStats] = useState({});
    const [summonerNameTop, setSummonerNameTop] = useState('');
    const [summonerNameJungle, setSummonerNameJungle] = useState('');
    const [summonerNameMid, setSummonerNameMid] = useState('');
    const [summonerNameBot, setSummonerNameBot] = useState('');
    const [summonerNameSup, setSummonerNameSup] = useState('');
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
                // setPlayerStats(data);
                setTeam1Top(data.team1.TOP);
                setTeam1Jgl(data.team1.JUNGLE);
                setTeam1Mid(data.team1.MID);
                setTeam1Bot(data.team1.BOTTOM);
                setTeam1Sup(data.team1.SUPPORT);
                setTeam2Top(data.team2.TOP);
                setTeam2Jgl(data.team2.JUNGLE);
                setTeam2Mid(data.team2.MID);
                setTeam2Bot(data.team2.BOTTOM);
                setTeam2Sup(data.team2.SUPPORT);

            })
            .catch(error => {
                console.log(error);
                alert("Error fetching data");
            });
    }, [summoners]);

    // const handleSubmit = (e) => {
    //     e.preventDefault();
    //     // if (summoners) {
    //     // fetch(`/members/${summonerName}`)
    //     fetch(`/team/${summoners[0]},${summoners[1]},${summoners[2]},${summoners[3]},${summoners[4]}`)

    //         .then(res => {
    //             if (!res.ok) {
    //                 throw Error(res.statusText);
    //             }
    //             return res.json();
    //         })
    //         .then(data => {
    //             // setMatches(data);
    //             setPlayerStats(data);
    //         })
    //         .catch(error => {
    //             console.log(error);
    //             alert("Error fetching data");
    //         });
    //     // }
    // }

    // function TeamPage() {
    //     const [topInfo, setTopInfo] = useState({});
    //     const [playerStats, setPlayerStats] = useState({});
    //     const [summonerNameTop, setSummonerNameTop] = useState('');
    //     const [summonerNameJungle, setSummonerNameJungle] = useState('');
    //     const [summonerNameMid, setSummonerNameMid] = useState('');
    //     const [summonerNameBot, setSummonerNameBot] = useState('');
    //     const [summonerNameSup, setSummonerNameSup] = useState('');

    //     // const location = useLocation();
    //     useEffect(() => {
    //         const queryParams = new URLSearchParams(window.location.search);
    //         const summoners = queryParams.get('summoners').split(",");
    //         // const summoners = queryParams.get('summoners');

    //         console.log(summoners);
    //         // setSummonerNameTop(summoners[0]);
    //         // setSummonerNameJungle(summoners[1]);
    //         // setSummonerNameMid(summoners[2]);
    //         // setSummonerNameBot(summoners[3]);
    //         // setSummonerNameSup(summoners[4]);

    //         fetch(`/team/${summoners[0]},${summoners[1]},${summoners[2]},${summoners[3]},${summoners[4]}`)
    //             // fetch(`/team/${summoners[0], summoners[1], summoners[2], summoners[3], summoners[4]}`)

    //             .then(res => {
    //                 if (!res.ok) {
    //                     throw Error(res.statusText);
    //                 }
    //                 return res.json();
    //             })
    //             .then(data => {
    //                 // setTopInfo(data.top_info);
    //                 // setPlayerStats(data.players);

    //                 // setPlayerStats(data);
    //             })
    //             .catch(error => {
    //                 console.log(error);
    //                 alert("Error fetching data");
    //             });
    //     }, []
    //         // [summonerNameTop, summonerNameJungle, summonerNameMid, summonerNameBot, summonerNameSup]
    //     );

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
                            <tr><td>&nbsp;</td></tr>
                            <tr>&nbsp;</tr>

                            <tr><td>Jungle</td></tr>
                            <tr><td>&nbsp;</td></tr>
                            <tr><td>&nbsp;</td></tr>
                            <tr>&nbsp;</tr>

                            <tr><td>Middle</td></tr>
                            <tr><td>&nbsp;</td></tr>
                            <tr><td>&nbsp;</td></tr>
                            <tr>&nbsp;</tr>

                            <tr><td>Bottom</td></tr>
                            <tr><td>&nbsp;</td></tr>
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
                            <tr><td>First Blood Participation</td></tr>
                            <tr>&nbsp;</tr>

                            <tr><td>Average First Dragon Timer</td></tr>
                            <tr><td>Average First Herald Timer</td></tr>
                            <tr><td>Average KDA at 15 min</td></tr>
                            <tr>&nbsp;</tr>

                            <tr><td>Avg CS Diff at 15 min</td></tr>
                            <tr><td>Avg KDA at 15 min</td></tr>
                            <tr><td>First Blood Participation</td></tr>
                            <tr>&nbsp;</tr>

                            <tr><td>Avg CS Diff at 15 min</td></tr>
                            <tr><td>Avg KDA at 15 min</td></tr>
                            <tr><td>First Blood Participation</td></tr>
                            <tr>&nbsp;</tr>

                            <tr><td>Average KDA at 15 min</td></tr>
                            <tr><td>Vision Score</td></tr>

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

                            {/* <tr><td>x {topStats.top_stats.average_cs_diff_at_15}</td>
                            <td>y</td></tr> */}

                            { <tr><td>{team1Top.average_cs_diff_at_15}</td>
                                <td>y</td></tr> }


                            <tr><td>x</td>
                                <td>y</td></tr>
                            <tr><td>x</td>
                                <td>y</td></tr>
                            <tr><td>x</td>
                                <td>y</td></tr>
                            <tr>&nbsp;</tr>

                            <tr><td>x</td>
                                <td>y</td></tr>
                            <tr><td>x</td>
                                <td>y</td></tr>
                            <tr><td>x</td>
                                <td>y</td></tr>
                            <tr>&nbsp;</tr>

                            <tr><td>x</td>
                                <td>y</td></tr>
                            <tr><td>x</td>
                                <td>y</td></tr>
                            <tr><td>x</td>
                                <td>y</td></tr>
                            <tr>&nbsp;</tr>

                            <tr><td>x</td>
                                <td>y</td></tr>
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