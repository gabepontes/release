from flask import Flask, jsonify, request
import requests

app = Flask(__name__)

# API key for the league server
api_key = "RGAPI-125473d7-d155-4aee-bbf2-a86b42b70e4a"

# Members API route
@app.route("/members/<summoner_name>")
def members(summoner_name):
    sorted_champion_stats = {}
    region ="NA1"
    headers = {'X-Riot-Token': api_key}
    url = f'https://{region}.api.riotgames.com/lol/summoner/v4/summoners/by-name/{summoner_name}'
    response = requests.get(url, headers=headers)
    if response.status_code != 200:
        return jsonify(error = response.status_code)
    player_info = response.json()
    player_name = player_info["name"]
    player_id = player_info['id']
    player_level = player_info['summonerLevel']
    puu_id = player_info['puuid']
    
    region = 'americas' 
    url = f'https://{region}.api.riotgames.com/lol/match/v5/matches/by-puuid/{puu_id}/ids?type=ranked&start=0&count=10'
    headers = {'X-Riot-Token': api_key}
    match_history_response = requests.get(url, headers=headers)
    if match_history_response.status_code != 200:
        return jsonify(error = match_history_response.status_code)
    match_history = match_history_response.json()
    champion_stats = {}
    if match_history:
        for match in match_history:
            url = f'https://{region}.api.riotgames.com/lol/match/v5/matches/{match}'
            headers = {'X-Riot-Token': api_key}
            response = requests.get(url, headers=headers)
            if response.status_code == 200:
                match_s = response.json()
                for match_single in match_s["info"]["participants"]:
                    champion = match_single['championName']
                    if match_single['summonerId'] == player_id:
                        
                        if champion in champion_stats:
                            champion_stats[champion]['games'] += 1
                            if match_single['win']:
                                champion_stats[champion]['wins'] += 1
                            else:
                                champion_stats[champion]['losses'] += 1
                        else:
                            if match_single['win']:
                                champion_stats[champion] = {'games': 1, 'wins': 1, 'losses': 0}
                            else:
                                champion_stats[champion] = {'games': 1, 'wins': 0, 'losses': 1}
    else:
        champion_stats = {"error":"No match history found"}
   
    sorted_champion_stats = dict(sorted(champion_stats.items(), key=lambda item: (8 * item[1]['wins'] / (item[1]['wins'] + item[1]['losses']) + 2 * item[1]['games']) / 10, reverse=True))

    return jsonify(name=player_name, level=player_level, match_history=match_history, sorted_champion_stats=sorted_champion_stats)

if __name__ == "__main__":
    app.run(debug=True)