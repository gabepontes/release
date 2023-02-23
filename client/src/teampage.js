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


    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const summoners = queryParams.get('summoners').split(",");
        console.log(summoners);
        fetch(`/team/${summoners[0]},${summoners[1]},${summoners[2]},${summoners[3]},${summoners[4]}`)

            .then(res => {
                if (!res.ok) {
                    throw Error(res.statusText);
                }
                return res.json();
            })
            .then(data => {
                setPlayerStats(data);
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