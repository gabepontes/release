from flask import Flask, jsonify, request
import mysql.connector
import requests

app = Flask(__name__)

# API key for the league server
api_key = "RGAPI-8b585c18-b94e-47a8-854e-c7951a8cc3bb"



# Members API route
@app.route("/members/<summoner_name>")
def members(summoner_name):
    # Connect to the MySQL server
    cnx = mysql.connector.connect(user='root', password='Clol1234', host='localhost', database='league_data')
    cursor = cnx.cursor()
    # Create the matches table if it doesn't exist
    table_create = '''CREATE TABLE IF NOT EXISTS matches (
        match_id VARCHAR(255),
        summoner_name VARCHAR(255),
        champion_name VARCHAR(255),
        kills INT,
        deaths INT,
        assists INT,
        total_minions_killed INT,
        item0 INT,
        item1 INT,
        item2 INT,
        item3 INT,
        item4 INT,
        item5 INT
        )'''
        
    cursor.execute(table_create)
    cnx.commit()
    region = "NA1"
    headers = {'X-Riot-Token': api_key}
    url = f'https://{region}.api.riotgames.com/lol/summoner/v4/summoners/by-name/{summoner_name}'
    response = requests.get(url, headers=headers)
    if response.status_code != 200:
        return jsonify(error=response.status_code)
    player_info = response.json()
    player_id = player_info['id']
    puu_id = player_info['puuid']

    region = 'americas'
    url = f'https://{region}.api.riotgames.com/lol/match/v5/matches/by-puuid/{puu_id}/ids?type=ranked&start=0&count=10'
    headers = {'X-Riot-Token': api_key}
    match_history_response = requests.get(url, headers=headers)
    if match_history_response.status_code != 200:
        return jsonify(error=match_history_response.status_code)
    match_history = match_history_response.json()
    if match_history:
        for match in match_history:
            url = f'https://{region}.api.riotgames.com/lol/match/v5/matches/{match}'
            headers = {'X-Riot-Token': api_key}
            response = requests.get(url, headers=headers)
            if response.status_code == 200:
                match_s = response.json()
                for match_single in match_s["info"]["participants"]:
                    summoner_name = match_single['summonerName']
                    champion_name = match_single['championName']
                    kills = match_single['kills']
                    deaths = match_single['deaths']
                    assists = match_single['assists']
                    total_minions_killed = match_single['totalMinionsKilled']
                    item0 = match_single['item0']
                    item1 = match_single['item1']
                    item2 = match_single['item2']
                    item3 = match_single['item3']
                    item4 = match_single['item4']
                    item5 = match_single['item5']
                    if match_single['summonerId'] == player_id:
                        kda = (kills + assists) / deaths if deaths != 0 else (kills + assists)
                        farm = total_minions_killed
                    # Insert the match data into the MySQL table
                    cursor.execute("INSERT INTO matches (match_id, summoner_name, champion_name, kills, deaths, assists, total_minions_killed, item0, item1, item2, item3, item4, item5) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)", (match, summoner_name, champion_name, kills, deaths, assists, total_minions_killed, item0, item1, item2, item3, item4, item5))
      
    # Retrieve match data from the MySQL table
    cursor.execute("SELECT champion_name, SUM(kills), SUM(deaths), SUM(assists), SUM(total_minions_killed) FROM matches WHERE summoner_name = %s GROUP BY champion_name", (summoner_name,))
    
    champion_stats = cursor.fetchall()
    sorted_champion_stats = {}
    for champion in champion_stats:
        kda = (champion[1] + champion[3]) / champion[2] if champion[2] != 0 else (champion[1] + champion[3])
        farm = champion[4]
        sorted_champion_stats[champion[0]] = {'kda': kda, 'farm': farm}
    cursor.execute("SELECT match_id, summoner_name, champion_name, kills, deaths, assists, total_minions_killed, item0, item1, item2, item3, item4, item5 FROM matches")
    matches = cursor.fetchall()
    cursor.close()
    cnx.close()
    return jsonify([{'match_id': match[0], 'summoner_name': match[1], 'champion_name': match[2], 'kills': match[3], 'deaths': match[4], 
        'assists': match[5], 'total_minions_killed': match[6], 'item0': match[7], 'item1': match[8], 'item2': match[9], 'item3': match[10], 
        'item4': match[11], 'item5': match[12]} for match in matches])


if __name__ == "__main__":
    app.run(debug=True)