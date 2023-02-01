import React, { useState, useEffect } from 'react'
<<<<<<< Updated upstream
import 'bulma/css/bulma.min.css';

function App() {
=======
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
import styles from './initial-page.module.css';
import 'bulma/css/bulma.min.css';
import './App.css';

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

  return (
    <div style={{ background: 'radial-gradient(circle at center, black, rgba(0, 0, 0, 0.906))', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <img src={logo} alt="Logo" className={styles.logo} />
      <form onSubmit={handleSubmit} className={styles.container}>
        <input type="text" placeholder="" onChange={(e) => setSearchQuery(e.target.value)} className={styles.searchInput} />
        <button type="submit" className={styles.searchButton}></button>
      </form>
      <div className = {styles.square}> </div>
      <div className={styles.helpAboutContainer}>
        <button onClick={handleAboutUs} className={styles.helpButton}>About Us</button>
        <button onClick={handleHelp} className={styles.AboutButton}>Help</button>
        <button onClick={handleFeed} className={styles.ScrimButton}>scrim</button>
      </div>
    </div>
  );
}

function OtherPage() {
>>>>>>> Stashed changes
  const [matches, setMatches] = useState({});
  const [summonerName, setSummonerName] = useState('');

  useEffect(() => {
    console.log(matches);
  }, [matches]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (summonerName) {
      fetch(`/members/${summonerName}`)
        .then(res => {
          if (!res.ok) {
            throw Error(res.statusText);
          }
          return res.json();
        })
        .then(data => {
          setMatches(data);
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
      {match.item0 !==0 ? <td><img src={`http://ddragon.leagueoflegends.com/cdn/13.1.1/img/item/${match.item0}.png`} alt="Item 0" /></td> : <td></td>}
      {match.item1 !==0 ? <td><img src={`http://ddragon.leagueoflegends.com/cdn/13.1.1/img/item/${match.item1}.png`} alt="Item 1" /></td> : <td></td>}
      {match.item2 !==0 ? <td><img src={`http://ddragon.leagueoflegends.com/cdn/13.1.1/img/item/${match.item2}.png`} alt="Item 2" /></td> : <td></td>}
      {match.item3 !==0 ? <td><img src={`http://ddragon.leagueoflegends.com/cdn/13.1.1/img/item/${match.item3}.png`} alt="Item 3" /></td> : <td></td>}
      {match.item4 !==0 ? <td><img src={`http://ddragon.leagueoflegends.com/cdn/13.1.1/img/item/${match.item4}.png`} alt="Item 4" /></td> : <td></td>}
      {match.item5 !==0 ? <td><img src={`http://ddragon.leagueoflegends.com/cdn/13.1.1/img/item/${match.item5}.png`} alt="Item 5" /></td> : <td></td>}  
    </tr>
    <div className="separator"></div>
  </>
))}
    </tbody>
  </table>     
        </div>
      ) : null}
    </div>
    </div>
  )
}
<<<<<<< Updated upstream
=======
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

  

function App() {
  return (
    <BrowserRouter>
      <Route exact path="/" component={InitialPage} />
      <Route exact path="/other-page" component={OtherPage} />
      <Route exact path="/about-us" component={AboutUs} />
      <Route exact path="/help" component={Help} />
      <Route exact path="/feed" component={NewsPage} />
    </BrowserRouter>
  );
}


>>>>>>> Stashed changes
export default App;