from flask import Flask, jsonify, request
import mysql.connector
import os
import json
import requests
from datetime import datetime

app = Flask(__name__)

# API key for the league server
api_key = "RGAPI-8e82150b-291f-471b-a831-e789a0009124"

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
        champion_level INT,
        kills INT,
        deaths INT,
        assists INT,
        total_minions_killed INT,
        minions_pm INT,
        gold_earned INT,
        gold_pm INT,
        damage_dealt INT,
        vision_score INT,
        lane VARCHAR(255),
        item0 INT,
        item1 INT,
        item2 INT,
        item3 INT,
        item4 INT,
        item5 INT
        )'''
        
    cursor.execute(table_create)
    cnx.commit()
    runes_file = os.path.join(os.path.dirname(__file__), 'runes.json')
    champion_stats = {}
    with open(runes_file, "r") as file:
      json_data = file.read()
      json_object = json.loads(json_data)
    spells_file = os.path.join(os.path.dirname(__file__), 'spells.json')
    with open(spells_file, "r") as file:
      json_data2 = file.read()
      json_object2 = json.loads(json_data2)
    region = "NA1"
    headers = {'X-Riot-Token': api_key}
    url = f'https://{region}.api.riotgames.com/lol/summoner/v4/summoners/by-name/{summoner_name}'
    response = requests.get(url, headers=headers)
    if response.status_code != 200:
        return jsonify(error=response.status_code)
    player_info = response.json()
    player_id = player_info['id']
    puu_id = player_info['puuid']


    player_data_solo = {"queueType": "none", "tier": "none", "rank": "0",
                        "summonerName": summoner_name, "leaguePoints": 0,
                        "wins": 0, "losses": 0, "veteran": False,
                        "inactive": False, "freshBlood": False, "hotStreak": False, "winrate" : 0, 'icon':player_info["profileIconId"],'level':player_info["summonerLevel"]}
    player_data_flex = {"queueType": "none", "tier": "none", "rank": "0",
                        "leaguePoints": 0,
                        "wins": 0, "losses": 0, "veteran": False,
                        "inactive": False, "freshBlood": False, "hotStreak": False, "winrate" : 0}

    url= f'https://{region}.api.riotgames.com/lol/league/v4/entries/by-summoner/{player_id}'
    headers = {'X-Riot-Token': api_key}
    player_response = requests.get(url, headers=headers)
    if player_response.status_code != 200:
        return jsonify(error=player_response.status_code)
    player = player_response.json()
    counter = 0
    for i in player:
      if ((i["queueType"] == "RANKED_SOLO_5x5") or (i["queueType"] == "RANKED_FLEX_SR")):
        queueType = i['queueType']
        tier = i["tier"]
        rank = i["rank"]
        summonerId = i["summonerId"]
        summonerName = i["summonerName"]
        leaguePoints = i["leaguePoints"]
        wins = i["wins"]
        losses = i["losses"]
        veteran = i["veteran"]
        inactive = i["inactive"]
        freshBlood = i["freshBlood"]
        hotStreak = i["hotStreak"]
        if 0 != i["losses"]:
          winrate = round(((i["wins"]/(i["losses"]+i["wins"])) * 100))
        else:
            winrate = 100
        if(queueType == "RANKED_SOLO_5x5"):    
          player_data_solo = {"queueType": queueType, "tier": tier, "rank": rank,
                       "summonerName": summonerName, "leaguePoints": leaguePoints,
                        "wins": wins, "losses": losses, "veteran": veteran,
                        "inactive": inactive, "freshBlood": freshBlood, "hotStreak": hotStreak, "winrate" : winrate, 'icon':player_info["profileIconId"],'level':player_info["summonerLevel"]}
        elif(queueType == "RANKED_FLEX_SR"):    
          player_data_flex = {"queueType": queueType, "tier": tier, "rank": rank,
                        "leaguePoints": leaguePoints,
                        "wins": wins, "losses": losses, "veteran": veteran,
                        "inactive": inactive, "freshBlood": freshBlood, "hotStreak": hotStreak, "winrate" : winrate}
        counter += 1
    region = 'americas'
    url = f'https://{region}.api.riotgames.com/lol/match/v5/matches/by-puuid/{puu_id}/ids?type=ranked&start=0&count=10'
    headers = {'X-Riot-Token': api_key}
    match_history_response = requests.get(url, headers=headers)
    if match_history_response.status_code != 200:
        return jsonify(error=match_history_response.status_code)
    match_history = match_history_response.json()
    select_match_id = "SELECT match_id FROM matches WHERE match_id = %s"
    match_data = []
    main = []
    game_data=[]
    if match_history:
        for match in match_history:
            cursor.execute(select_match_id, (match,))
            cursor.fetchall()
            match_in_db = cursor.fetchone()
            if match_in_db is None:
                url = f'https://{region}.api.riotgames.com/lol/match/v5/matches/{match}'
                headers = {'X-Riot-Token': api_key}
                response = requests.get(url, headers=headers)
                if response.status_code == 200:
                    match_s = response.json()
                    minutes, seconds = divmod(match_s["info"]["gameDuration"],60)
                    unix_timestamp = match_s["info"]["gameEndTimestamp"]
                    mode = match_s["info"]["gameName"]
                    unix_timestamp = unix_timestamp/1000
                    
                    normal_date = datetime.fromtimestamp(unix_timestamp)
                    game_data.append((normal_date,minutes,seconds,mode))
                 
                    for match_single in match_s["info"]["participants"]:
                        runes = []
                        summoner_name = match_single['summonerName']
                        champion_name = match_single['championName']
                        champion_level = match_single['champLevel']
                        kills = match_single['kills']
                        deaths = match_single['deaths']
                        assists = match_single['assists']
                        total_minions_killed = match_single['totalMinionsKilled']
                        minions_pm = total_minions_killed / (match_single['timePlayed'] // 60)
                        gold_earned = match_single['goldEarned']
                        gold_pm = round(gold_earned / (match_single['timePlayed'] // 60), 2) 
                        damage_dealt = match_single['totalDamageDealtToChampions']
                        vision_score = match_single['visionScore']
                        lane = match_single['lane']
                        items = [match_single['item0'], match_single['item1'], match_single['item2'], match_single['item3'], match_single['item4'], match_single['item5']]
                        if match_single['summonerId'] == player_id:
                          if champion_name in champion_stats:
                              champion_stats[champion_name]['games'] += 1
                              champion_stats[champion_name]['kills'] += match_single['kills']
                              champion_stats[champion_name]['deaths'] += match_single['deaths']
                              champion_stats[champion_name]['time'] += match_single['timePlayed']
                              champion_stats[champion_name]['gold'] += match_single['goldEarned']
                              champion_stats[champion_name]['assists'] += match_single['assists']
                              if match_single['win']:
                                  champion_stats[champion_name]['wins'] += 1
                              else:
                                  champion_stats[champion_name]['losses'] += 1
                              champion_stats[champion_name]['win_rate'] = champion_stats[champion_name]['wins'] / champion_stats[champion_name]['games']
                              champion_stats[champion_name]['KDA_ratio'] = (champion_stats[champion_name]['kills'] + champion_stats[champion_name]['assists']) / champion_stats[champion_name]['deaths']
                          else:
                              if match_single['win']:
                                  champion_stats[champion_name] = {'games': 1, 'wins': 1, 'losses': 0, 'kills': match_single['kills'], 'deaths': match_single['deaths'], 'assists': match_single['assists'],'gold' : match_single['goldEarned'],'time' : match_single['timePlayed'], 'win_rate': 1, 'KDA_ratio': (match_single['kills'] + match_single['assists']) / match_single['deaths'],'name':champion_name}
                              else:
                                  champion_stats[champion_name] = {'games': 1, 'wins': 0, 'losses': 1, 'kills': match_single['kills'], 'deaths': match_single['deaths'], 'assists': match_single['assists'], 'win_rate': 0,'gold' : match_single['goldEarned'],'time' : match_single['timePlayed'], 'KDA_ratio': (match_single['kills'] + match_single['assists']) / match_single['deaths'],"name":champion_name}
                        for i in range(len(items)-1):
                          for j in range(i+1,len(items)):
                            if items[i]<items[j]:
                              items[i],items[j]=items[j],items[i]
                        item0 = items[0]
                        item1 = items[1]
                        item2 = items[2]
                        item3 = items[3]
                        item4 = items[4]
                        item5 = items[5]
                        win = int(match_single['win'])
                        perk = match_single['perks']
                        for i in perk['styles']:
                          for x in i['selections']:
                            runes.append(x['perk'])
                             
                        for rune_info in json_object:
                          for slots in rune_info['slots']:
                            for rune in slots['runes']:
                              if rune['id'] in runes:
                                  index = runes.index(rune['id'])
                                  runes[index] = rune['icon']
                        spell1 = match_single["summoner1Id"]
                        spell2 = match_single["summoner2Id"]
                        for spell in json_object2:
                          if (str)(spell1) == spell['key']:
                            spell1 = spell["icon"]
                          elif (str)(spell2) == spell['key']:
                            spell2 = spell["icon"]
                        if match_single['summonerId'] == player_id:
                            main.append((match, summoner_name, champion_name, kills, deaths, assists, total_minions_killed, item0, item1, item2, item3, item4, item5,runes[0],runes[1],runes[2],runes[3],runes[4],runes[5],spell1,spell2,win, champion_level, minions_pm, gold_earned, gold_pm, damage_dealt, vision_score, lane))
                        # Insert the match data into the MySQL table
                        cursor.execute("INSERT INTO matches (match_id, summoner_name, champion_name, champion_level, kills, deaths, assists, total_minions_killed, minions_pm, gold_earned, gold_pm, damage_dealt, vision_score, lane, item0, item1, item2, item3, item4, item5) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)", (match, summoner_name, champion_name, champion_level, kills, deaths, assists, total_minions_killed, minions_pm, gold_earned, gold_pm, damage_dealt, vision_score, lane, item0, item1, item2, item3, item4, item5))
                        cnx.commit()
                        match_data.append((match, summoner_name, champion_name, kills, deaths, assists, total_minions_killed, item0, item1, item2, item3, item4, item5,runes[0],runes[1],runes[2],runes[3],runes[4],runes[5],spell1,spell2,win, champion_level, minions_pm, gold_earned, gold_pm, damage_dealt, vision_score, lane))
    cursor.close()
    cnx.close()
    Sorted_champion_stats = dict(sorted(champion_stats.items(), key=lambda item: (8 * item[1]['wins'] / (item[1]['wins'] + item[1]['losses']) + 2 * item[1]['games']) / 10, reverse=True))
    return jsonify({"top1":list(Sorted_champion_stats.keys())[0], "bestChamp" : Sorted_champion_stats,"flex":player_data_flex,"player_data":player_data_solo, "matches": [{'match_id': match[0], 'summoner_name': match[1], 'champion_name': match[2], 'kills': match[3], 'deaths': match[4], 
        'assists': match[5], 'total_minions_killed': match[6], 'item0': match[7], 'item1': match[8], 'item2': match[9], 'item3': match[10], 
        'item4': match[11], 'item5': match[12], "rune0" : runes[0],"rune0" : match[13],"rune1" :match[14],"rune2" :match[15],"rune3" :match[16],"rune4" :match[17],"rune5" :match[18],"spell1" :match[19],"spell2" :match[20],"win" :match[21]} for match in match_data],"main": [{'match_id': match[0], 'summoner_name': match[1], 'champion_name': match[2], 'kills': match[3], 'deaths': match[4], 
        'assists': match[5], 'total_minions_killed': match[6], 'item0': match[7], 'item1': match[8], 'item2': match[9], 'item3': match[10], 
        'item4': match[11], 'item5': match[12], "rune0" : match[13],"rune1" :match[14],"rune2" :match[15],"rune3" :match[16],"rune4" :match[17],"rune5" :match[18],"spell1" :match[19],"spell2" :match[20],"win" :match[21], "champion_level": match[22], "minions_pm": match[23], "gold_earned": match[24], "gold_pm": match[25], "damage_dealt": match[26], "vision_score": match[27], "lane": match[28]} for match in main],"gameData": [{'gameWhen': match[0], 'gameMinutes': match[1], 'gameSeconds': match[2], 'gameMod': match[3]} for match in game_data]})

if __name__ == "__main__":
    app.run(debug=True)