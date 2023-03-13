from flask import Flask, jsonify, request
import mysql.connector
import os
import json
import requests
import threading
from datetime import datetime


app = Flask(__name__)


# API key for the league server
api_key = "RGAPI-f1ff5f15-ae7a-46aa-a21b-a4af04797a6d"
api_key_two = "RGAPI-eddefad1-05be-4cde-aa06-7ae44d67e49d"

def summoner_lookup(summoner_name, api_key):
  region = "NA1"
  headers = {'X-Riot-Token': api_key}
  url = f'https://{region}.api.riotgames.com/lol/summoner/v4/summoners/by-name/{summoner_name}'
  response = requests.get(url, headers=headers)
  if response.status_code != 200:
    return response.status_code
  return response.json()
  
def lookup_queue(player_id, api_key):
  region = "NA1"
  url= f'https://{region}.api.riotgames.com/lol/league/v4/entries/by-summoner/{player_id}'
  headers = {'X-Riot-Token': api_key}
  player_response = requests.get(url, headers=headers)
  if player_response.status_code != 200:
    return player_response.status_code
  return player_response.json()

def last_ten_games(puuid, api_key):
  region = 'americas'
  url = f'https://{region}.api.riotgames.com/lol/match/v5/matches/by-puuid/{puuid}/ids?type=ranked&start=0&count=10'
  headers = {'X-Riot-Token': api_key}
  match_history_response = requests.get(url, headers=headers)
  if match_history_response.status_code != 200:
    return match_history_response.status_code
  return match_history_response.json()

def match_lookup(matchId, puuid, api_key):
  cnx = mysql.connector.connect(user='root', password='Clol1234', host='localhost', database='league_data')
  cursor = cnx.cursor()
  select_match_id = "SELECT match_id FROM teammatches WHERE match_id = %s AND puuid = %s"
  cursor.execute(select_match_id, (matchId, puuid,))
  match_in_db = cursor.fetchall()
  match_response = None
  if not match_in_db:
    region = 'americas'
    url = f'https://{region}.api.riotgames.com/lol/match/v5/matches/{matchId}'
    headers = {'X-Riot-Token': api_key}
    response = requests.get(url, headers=headers)
    if response.status_code != 200:
      match_response = response.status_code
    else:
      match_response = response.json()
  else:
    cursor.execute("SELECT * FROM teammatches WHERE match_id = %s AND puuid = %s", (matchId, puuid,))
    match_response = cursor.fetchall()
  cursor.close()
  cnx.close()
  return match_response

def timeline_lookup(matchId, puuid, api_key):
  cnx = mysql.connector.connect(user='root', password='Clol1234', host='localhost', database='league_data')
  cursor = cnx.cursor()
  select_match_id = "SELECT match_id FROM teamtimeline WHERE match_id = %s AND puuid = %s"
  cursor.execute(select_match_id, (matchId, puuid,))
  match_in_db = cursor.fetchall()
  match_response = None
  if not match_in_db:
    region = 'americas'
    headers = {'X-Riot-Token': api_key}
    timeline_url = f'https://{region}.api.riotgames.com/lol/match/v5/matches/{matchId}/timeline'
    match_timeline_response = requests.get(timeline_url, headers=headers)
    if match_timeline_response.status_code != 200:
      match_response =  match_timeline_response.status_code
    else:
      match_response = match_timeline_response.json()
  else:
    cursor.execute("SELECT * FROM teamtimeline WHERE match_id = %s AND puuid = %s", (matchId, puuid,))
    match_response = cursor.fetchall()
  cursor.close()
  cnx.close()
  return match_response
  
def laner_analysis(list_of_matches, puuid, lane, api_key):
  cnx = mysql.connector.connect(user='root', password='Clol1234', host='localhost', database='league_data')
  cursor = cnx.cursor()
  cs_diff_at_15 = []
  kda = []
  first_blood = 0
  for matchId in list_of_matches:
    match = match_lookup(matchId, puuid, api_key)
    part_id = -1
    enemy_laner_id = -1
    first_blood_participation = 0
    if type(match) == int:
      continue
    elif type(match) == dict:
      for participant in match["info"]["participants"]:
        if participant["puuid"] == puuid:
          part_id = participant["participantId"]
          if participant["firstBloodKill"] or participant["firstBloodAssist"]:
            first_blood += 1
            first_blood_participation = 1
        if participant["teamPosition"] == lane and participant["puuid"] != puuid:    
          enemy_laner_id = participant["participantId"]
      cursor.execute("INSERT INTO teammatches (match_id, puuid, participant_id, enemy_laner_id, vision_score, first_blood, team_id, control_wards) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)", (matchId, puuid, part_id, enemy_laner_id, "0", first_blood_participation, "0", "0"))
      cnx.commit()
    elif type(match) == list:
      part_id = match[0][2]
      enemy_laner_id = match[0][3]
      first_blood += match[0][5]
    
    timeline = timeline_lookup(matchId, puuid, api_key)
    if type(timeline) == int:
      continue
    elif type(timeline) == dict:
      kills_and_assists = 0
      deaths = 0
      max_minutes = 15
      if len(timeline["info"]["frames"]) < 15:
        max_minutes = len(timeline["info"]["frames"]) - 1
      for minute in range(0, max_minutes):
        for event in timeline["info"]["frames"][minute]["events"]:
          if event["type"] == "CHAMPION_KILL":
            if "assistingParticipantIds" in event.keys():
              if part_id in event["assistingParticipantIds"] or part_id == event["killerId"]:
                kills_and_assists += 1
            elif event["victimId"] == part_id:
              deaths += 1
      if deaths == 0:
        kda.append(kills_and_assists)
      else:
        kda.append(kills_and_assists / deaths)
      part_cs = timeline["info"]["frames"][max_minutes-1]["participantFrames"][str(part_id)]["minionsKilled"]
      enemy_cs = timeline["info"]["frames"][max_minutes-1]["participantFrames"][str(enemy_laner_id)]["minionsKilled"]
      cs_diff_at_15.append(part_cs - enemy_cs)
      cursor.execute("INSERT INTO teamtimeline (match_id, puuid, kills_and_assists, deaths, dragon_timer, herald_timer, minions_killed, enemy_laner_minions_killed) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)", (matchId, puuid, kills_and_assists, deaths, "0", "0", part_cs, enemy_cs))
      cnx.commit()
    elif type(timeline) == list:
      cs_diff_at_15.append(timeline[0][6] - timeline[0][7])
      if timeline[0][3] == 0:
        kda.append(timeline[0][2])
      else:
        kda.append(timeline[0][2] / timeline[0][3])
  
  top_stats = {}
  top_stats["average_cs_diff_at_15"] = round(sum(cs_diff_at_15)/len(cs_diff_at_15), 1)
  top_stats["average_kda_at_15"] = round(sum(kda)/len(kda), 2)
  top_stats["firstblood_participation"] = (first_blood / 10) * 100
  cursor.close()
  cnx.close()
  return top_stats

def jungle_analysis(list_of_matches, puuid, api_key):
  cnx = mysql.connector.connect(user='root', password='Clol1234', host='localhost', database='league_data')
  cursor = cnx.cursor()
  first_dragon_timers = []
  first_herald_timers = []
  kda = []
  for matchId in list_of_matches:
    match = match_lookup(matchId, puuid, api_key)
    part_id = -1
    team_id = -1
    if type(match) == int:
      continue
    elif type(match) == dict:
      for participant in match["info"]["participants"]:
        if participant["puuid"] == puuid:
          part_id = participant["participantId"]
          team_id = participant["teamId"]
      cursor.execute("INSERT INTO teammatches (match_id, puuid, participant_id, enemy_laner_id, vision_score, first_blood, team_id, control_wards) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)", (matchId, puuid, part_id, "0", "0", "0", team_id, "0"))
      cnx.commit()
    elif type(match) == list:
      part_id = match[0][2]
      team_id = match[0][6]
    
    timeline = timeline_lookup(matchId, puuid, api_key)
    if type(timeline) == int:
      continue
    elif type(timeline) == dict:
      kills_and_assists = 0
      deaths = 0
      drake_taken = False
      first_drake = 0
      herald_taken = False
      first_herald = 0
      max_minutes = 15
      if len(timeline["info"]["frames"]) < 15:
        max_minutes = len(timeline["info"]["frames"]) - 1
      for minute in range(0, max_minutes):
        for event in timeline["info"]["frames"][minute]["events"]:
          if event["type"] == "CHAMPION_KILL":
            if "assistingParticipantIds" in event.keys():
              if part_id in event["assistingParticipantIds"] or part_id == event["killerId"]:
                kills_and_assists += 1
            elif event["victimId"] == part_id:
              deaths += 1
          if event["type"] == "ELITE_MONSTER_KILL":
            if event["monsterType"] == "DRAGON" and event["killerTeamId"] == team_id and not drake_taken:
              first_dragon_timers.append(event["timestamp"])
              first_drake = event["timestamp"]
              drake_taken = True
            if event["monsterType"] == "RIFTHERALD" and event["killerTeamId"] == team_id and not herald_taken:
              first_herald_timers.append(event["timestamp"])
              first_herald = event["timestamp"]
              herald_taken = True
      if deaths == 0:
        kda.append(kills_and_assists)
      else:
        kda.append(kills_and_assists / deaths)
      cursor.execute("INSERT INTO teamtimeline (match_id, puuid, kills_and_assists, deaths, dragon_timer, herald_timer, minions_killed, enemy_laner_minions_killed) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)", (matchId, puuid, kills_and_assists, deaths, first_drake, first_herald, "0", "0"))
      cnx.commit()
    elif type(timeline) == list:
      if timeline[0][3] == 0:
        kda.append(timeline[0][2])
      else:
        kda.append(timeline[0][2] / timeline[0][3])
      if timeline[0][4] != 0:
        first_dragon_timers.append(timeline[0][4])
      if timeline[0][5] != 0:
        first_herald_timers.append(timeline[0][5])
  
  jungle_stats = {}
  if len(first_dragon_timers) > 0:
    jungle_stats["average_first_dragon_timer"] = round(((sum(first_dragon_timers)/len(first_dragon_timers))/60000), 2)
  else:
    jungle_stats["average_first_dragon_timer"] = 0
  if len(first_herald_timers) > 0:
    jungle_stats["average_first_herald_timer"] = round(((sum(first_herald_timers)/len(first_herald_timers))/60000), 2)
  else:
    jungle_stats["average_first_herald_timer"] = 0
  if len(kda) > 0:
    jungle_stats["average_kda_at_15"] = round(sum(kda)/len(kda), 2)
  else:
    jungle_stats["average_kda_at_15"] = 0
  cursor.close()
  cnx.close()
  return jungle_stats

def sup_analysis(list_of_matches, puuid, api_key):
  cnx = mysql.connector.connect(user='root', password='Clol1234', host='localhost', database='league_data')
  cursor = cnx.cursor()
  kda = []
  vision_scores = []
  control_wards = []
  for matchId in list_of_matches:
    match = match_lookup(matchId, puuid, api_key)
    part_id = -1
    if type(match) == int:
      continue
    elif type(match) == dict:
      for participant in match["info"]["participants"]:
        if participant["puuid"] == puuid:
          part_id = participant["participantId"]
          vision_scores.append(participant["visionScore"])
          control_wards.append(participant["detectorWardsPlaced"])
          cursor.execute("INSERT INTO teammatches (match_id, puuid, participant_id, enemy_laner_id, vision_score, first_blood, team_id, control_wards) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)", (matchId, puuid, part_id, "0", participant["visionScore"], "0", "0", participant["detectorWardsPlaced"]))
          cnx.commit()
    elif type(match) == list:
      part_id = match[0][2]
      vision_scores.append(match[0][4])
      control_wards.append(match[0][7])
    
    timeline = timeline_lookup(matchId, puuid, api_key)
    if type(timeline) == int:
      continue
    elif type(timeline) == dict:
      kills_and_assists = 0
      deaths = 0
      max_minutes = 15
      if len(timeline["info"]["frames"]) < 15:
        max_minutes = len(timeline["info"]["frames"]) - 1
      for minute in range(0, max_minutes):
        for event in timeline["info"]["frames"][minute]["events"]:
          if event["type"] == "CHAMPION_KILL":
            if "assistingParticipantIds" in event.keys():
              if part_id in event["assistingParticipantIds"] or part_id == event["killerId"]:
                kills_and_assists += 1
            elif event["victimId"] == part_id:
              deaths += 1
      if deaths == 0:
        kda.append(kills_and_assists)
      else:
        kda.append(kills_and_assists / deaths)
      cursor.execute("INSERT INTO teamtimeline (match_id, puuid, kills_and_assists, deaths, dragon_timer, herald_timer, minions_killed, enemy_laner_minions_killed) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)", (matchId, puuid, kills_and_assists, deaths, "0", "0", "0", "0"))
      cnx.commit()
    elif type(timeline) == list:
      if timeline[0][3] == 0:
        kda.append(timeline[0][2])
      else:
        kda.append(timeline[0][2] / timeline[0][3])
        
  sup_stats = {}
  sup_stats["average_kda_at_15"] = round(sum(kda)/len(kda), 2)
  sup_stats["average_vision_score"] = round(sum(vision_scores)/len(vision_scores), 2)
  sup_stats["average_control_wards"] = round(sum(control_wards)/len(control_wards), 2)
  cursor.close()
  cnx.close()
  return sup_stats

def laner(summoner_name, lane, players, api_key):
  laner_info = summoner_lookup(summoner_name, api_key)
  laner_queue_info = lookup_queue(laner_info["id"], api_key)
  laner_games = last_ten_games(laner_info["puuid"], api_key)
  laner_stats = laner_analysis(laner_games, laner_info["puuid"], lane, api_key)
  player = {}
  for i in laner_queue_info:
    if i['queueType'] == "RANKED_SOLO_5x5":
      i['icon'] = laner_info['profileIconId']
      i.update(laner_stats)
      player = i
  players[lane] = player

def jungler(summoner_name, players, api_key):
  jungle_info = summoner_lookup(summoner_name, api_key)
  jungle_queue_info = lookup_queue(jungle_info["id"], api_key)
  jungle_games = last_ten_games(jungle_info["puuid"], api_key)
  jungle_stats = jungle_analysis(jungle_games, jungle_info["puuid"], api_key)
  player = {}
  for i in jungle_queue_info:
    if i['queueType'] == "RANKED_SOLO_5x5":
      i['icon'] = jungle_info['profileIconId']
      i.update(jungle_stats)
      player = i
  players["JUNGLE"] = player
      
def support(summoner_name, players, api_key):
  sup_info = summoner_lookup(summoner_name, api_key)
  sup_queue_info = lookup_queue(sup_info["id"], api_key)
  sup_games = last_ten_games(sup_info["puuid"], api_key)
  sup_stats = sup_analysis(sup_games, sup_info["puuid"], api_key)
  player = {}
  for i in sup_queue_info:
    if i['queueType'] == "RANKED_SOLO_5x5":
      i['icon'] = sup_info['profileIconId']
      i.update(sup_stats)
      player = i
  players["SUPPORT"] = player 

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
    minions_pm FLOAT,
    gold_earned INT,
    gold_pm FLOAT,
    damage_dealt INT,
    vision_score INT,
    lane VARCHAR(255),
    item0 INT,
    item1 INT,
    item2 INT,
    item3 INT,
    item4 INT,
    item5 INT,
    runes0 VARCHAR(255),
    runes1 VARCHAR(255),
    runes2 VARCHAR(255),
    runes3 VARCHAR(255),
    runes4 VARCHAR(255),
    runes5 VARCHAR(255),
    spell1 VARCHAR(255),
    spell2 VARCHAR(255),
    win BOOLEAN,
    normal_date TIMESTAMP(6),
    minutes INT,
    seconds INT,
    mode VARCHAR(255),
    time INT
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
            match_in_db = cursor.fetchall()
           
            if not match_in_db:
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
                    game = []
                    for match_single in match_s["info"]["participants"]:
                        runes = []
                        summoner_name = match_single['summonerName']
                        champion_name = match_single['championName']
                        champion_level = match_single['champLevel']
                        kills = match_single['kills']
                        deaths = match_single['deaths']
                        assists = match_single['assists']
                        total_minions_killed = match_single['totalMinionsKilled']
                        minions_pm = round(total_minions_killed / (match_single['timePlayed'] // 60), 2)
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
                              champion_stats[champion_name]['totalMinionsKilled'] += match_single['totalMinionsKilled']
                              if match_single['win']:
                                  champion_stats[champion_name]['wins'] += 1
                              else:
                                  champion_stats[champion_name]['losses'] += 1
                              champion_stats[champion_name]['win_rate'] = champion_stats[champion_name]['wins'] / champion_stats[champion_name]['games']
                              if champion_stats[champion_name]['deaths'] == 0:
                                champion_stats[champion_name]['KDA_ratio'] = (champion_stats[champion_name]['kills'] + champion_stats[champion_name]['assists'])
                              else:
                                champion_stats[champion_name]['KDA_ratio'] = (champion_stats[champion_name]['kills'] + champion_stats[champion_name]['assists']) / champion_stats[champion_name]['deaths']
                          else:
                              kda = 0
                              if match_single['deaths'] == 0:
                                kda = (match_single['kills'] + match_single['assists'])
                              else:
                                kda = (match_single['kills'] + match_single['assists']) / match_single['deaths']
                              if match_single['win']: 
                                champion_stats[champion_name] = {'games': 1, 'wins': 1, 'losses': 0, 'kills': match_single['kills'], 'deaths': match_single['deaths'], 'assists': match_single['assists'],'gold' : match_single['goldEarned'],'time' : match_single['timePlayed'], 'win_rate': 1, 'KDA_ratio': kda,'name':champion_name, 'totalMinionsKilled': match_single['totalMinionsKilled']}
                              else:
                                champion_stats[champion_name] = {'games': 1, 'wins': 0, 'losses': 1, 'kills': match_single['kills'], 'deaths': match_single['deaths'], 'assists': match_single['assists'], 'win_rate': 0,'gold' : match_single['goldEarned'],'time' : match_single['timePlayed'], 'KDA_ratio': kda,"name":champion_name, 'totalMinionsKilled': match_single['totalMinionsKilled']}
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
                            game.insert(0, (match, summoner_name, champion_name, kills, deaths, assists, total_minions_killed, item0, item1, item2, item3, item4, item5,runes[0],runes[1],runes[2],runes[3],runes[4],runes[5],spell1,spell2,win, champion_level, minions_pm, gold_earned, gold_pm, damage_dealt, vision_score, lane))
                        # Insert the match data into the MySQL table
                        cursor.execute("INSERT INTO matches (match_id, summoner_name, champion_name, champion_level, kills, deaths, assists, total_minions_killed, minions_pm, gold_earned, gold_pm, damage_dealt, vision_score, lane, item0, item1, item2, item3, item4, item5, runes0, runes1, runes2, runes3, runes4, runes5,spell1,spell2,win,normal_date,minutes,seconds,mode,time) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)", (match, summoner_name, champion_name, champion_level, kills, deaths, assists, total_minions_killed, minions_pm, gold_earned, gold_pm, damage_dealt, vision_score, lane, item0, item1, item2, item3, item4, item5, runes[0], runes[1], runes[2], runes[3], runes[4], runes[5], spell1, spell2, win, normal_date, minutes, seconds, mode, match_single['timePlayed']))
                        cnx.commit()
                        game.append((match, summoner_name, champion_name, kills, deaths, assists, total_minions_killed, item0, item1, item2, item3, item4, item5,runes[0],runes[1],runes[2],runes[3],runes[4],runes[5],spell1,spell2,win, champion_level, minions_pm, gold_earned, gold_pm, damage_dealt, vision_score, lane))
                    match_data.append(game)
                       
            else:
              cat = []
              # code to fetch data from MySQL table and append to a list
              cursor.execute("SELECT * FROM matches WHERE match_id = %s", (match,))
              temp = cursor.fetchall()
              for temp2 in temp:
                cat.append([temp2[0], temp2[1], temp2[2], temp2[4], temp2[5], temp2[6], temp2[7], temp2[14], temp2[15], temp2[16], temp2[17], temp2[18], temp2[19],temp2[20],temp2[21],temp2[22],temp2[23],temp2[24],temp2[25],temp2[26],temp2[27],temp2[28], temp2[3], temp2[8], temp2[9], temp2[10], temp2[11], temp2[12], temp2[13]])
              
              cursor.execute("SELECT * FROM matches WHERE match_id = %s AND summoner_name = %s", (match, summoner_name))
              temp2 = cursor.fetchone()
              main.append([temp2[0], temp2[1], temp2[2], temp2[4], temp2[5], temp2[6], temp2[7], temp2[14], temp2[15], temp2[16], temp2[17], temp2[18], temp2[19],temp2[20],temp2[21],temp2[22],temp2[23],temp2[24],temp2[25],temp2[26],temp2[27],temp2[28], temp2[3], temp2[8], temp2[9], temp2[10], temp2[11], temp2[12], temp2[13]])
              main2 = temp2
              cat.insert(0,(temp2[0], temp2[1], temp2[2], temp2[4], temp2[5], temp2[6], temp2[7], temp2[14], temp2[15], temp2[16], temp2[17], temp2[18], temp2[19],temp2[20],temp2[21],temp2[22],temp2[23],temp2[24],temp2[25],temp2[26],temp2[27],temp2[28], temp2[3], temp2[8], temp2[9], temp2[10], temp2[11], temp2[12], temp2[13]))
              match_data.append(cat)
              game_data.append((main2[29],main2[30],main2[31],main2[32]))
              champion_name = main2[2]
              if main2[2] in champion_stats:
                champion_stats[champion_name]['games'] += 1
                champion_stats[champion_name]['kills'] += main2[4]
                champion_stats[champion_name]['deaths'] += main2[5]
                champion_stats[champion_name]['time'] += main2[33]
                champion_stats[champion_name]['gold'] += main2[9]
                champion_stats[champion_name]['assists'] += main2[6]
                champion_stats[champion_name]['totalMinionsKilled'] += main2[7]
                if main2[28]:
                    champion_stats[champion_name]['wins'] += 1
                else:
                    champion_stats[champion_name]['losses'] += 1
                champion_stats[champion_name]['win_rate'] = champion_stats[champion_name]['wins'] / champion_stats[champion_name]['games']
                if champion_stats[champion_name]['deaths'] == 0:
                  champion_stats[champion_name]['KDA_ratio'] = (champion_stats[champion_name]['kills'] + champion_stats[champion_name]['assists'])
                else:
                  champion_stats[champion_name]['KDA_ratio'] = (champion_stats[champion_name]['kills'] + champion_stats[champion_name]['assists']) / champion_stats[champion_name]['deaths']
              else:
                  kda = 0
                  if main2[5] == 0:
                    kda = (main2[4] + main2[6])
                  else:
                    kda = (main2[4] + main2[6]) / main2[5]
                  if main2[28]:
                      champion_stats[champion_name] = {'games': 1, 'wins': 1, 'losses': 0, 'kills': main2[4], 'deaths': main2[5], 'assists': main2[6],'gold' : main2[9],'time' : main2[33], 'win_rate': 1, 'KDA_ratio': kda,'name':main2[2], 'totalMinionsKilled': main2[7]}
                  else:
                      champion_stats[champion_name] = {'games': 1, 'wins': 0, 'losses': 1, 'kills': main2[4], 'deaths': main2[5], 'assists': main2[6], 'win_rate': 0,'gold' : main2[9],'time' : main2[33], 'KDA_ratio': kda,"name":main2[2], 'totalMinionsKilled': main2[7]}


         


    cursor.close()
    cnx.close()
    Sorted_champion_stats = dict(sorted(champion_stats.items(), key=lambda item: (8 * item[1]['wins'] / (item[1]['wins'] + item[1]['losses']) + 2 * item[1]['games']) / 10, reverse=True))
   
    #return jsonify({"top1":list(Sorted_champion_stats.keys())[0], "bestChamp" : Sorted_champion_stats,"flex":player_data_flex,"player_data":player_data_solo, "matches": [{'match_id': match[0], 'summoner_name': match[1], 'champion_name': match[2], 'kills': match[3], 'deaths': match[4],
    #    'assists': match[5], 'total_minions_killed': match[6], 'item0': match[7], 'item1': match[8], 'item2': match[9], 'item3': match[10],
    #    'item4': match[11], 'item5': match[12], "rune0" : runes[0],"rune0" : match[13],"rune1" :match[14],"rune2" :match[15],"rune3" :match[16],"rune4" :match[17],"rune5" :match[18],"spell1" :match[19],"spell2" :match[20],"win" :match[21], "champion_level": match[22], "minions_pm": match[23], "gold_earned": match[24], "gold_pm": match[25], "damage_dealt": match[26], "vision_score": match[27], "lane": match[28]} for match in match_data],"main": [{'match_id': match[0], 'summoner_name': match[1], 'champion_name': match[2], 'kills': match[3], 'deaths': match[4],
    #    'assists': match[5], 'total_minions_killed': match[6], 'item0': match[7], 'item1': match[8], 'item2': match[9], 'item3': match[10],
    #    'item4': match[11], 'item5': match[12], "rune0" : match[13],"rune1" :match[14],"rune2" :match[15],"rune3" :match[16],"rune4" :match[17],"rune5" :match[18],"spell1" :match[19],"spell2" :match[20],"win" :match[21], "champion_level": match[22], "minions_pm": match[23], "gold_earned": match[24], "gold_pm": match[25], "damage_dealt": match[26], "vision_score": match[27], "lane": match[28]} for match in main],"gameData": [{'gameWhen': match[0], 'gameMinutes': match[1], 'gameSeconds': match[2], 'gameMod': match[3]} for match in game_data]})
    return jsonify({"top1":list(Sorted_champion_stats.keys())[0], "bestChamp" : Sorted_champion_stats,"flex":player_data_flex,"player_data":player_data_solo,
                  # "matches": [[{"sum" + str(player): {'match_id': match[player][0], 'summoner_name': match[player][1], 'champion_name': match[player][2], 'kills': match[player][3], 'deaths': match[player][4], 'assists': match[player][5], 'total_minions_killed': match[player][6], 'item0': match[player][7], 'item1': match[player][8], 'item2': match[player][9], 'item3': match[player][10], 'item4': match[player][11], 'item5': match[player][12], "rune0": match[player][13], "rune1": match[player][14], "rune2": match[player][15], "rune3": match[player][16], "rune4": match[player][17], "rune5": match[player][18], "spell1": match[player][19], "spell2": match[player][20], "win":match[player][21], "champion_level": match[player][22], "minions_pm": match[player][23], "gold_earned": match[player][24], "gold_pm": match[player][25], "damage_dealt": match[player][26], "vision_score": match[player][27], "lane": match[player][28]}
                  #             }for player in range(len(match))] for match in match_data],
                  "matches": [[{'match_id': match[player][0], 'summoner_name': match[player][1], 'champion_name': match[player][2], 'kills': match[player][3], 'deaths': match[player][4], 'assists': match[player][5], 'total_minions_killed': match[player][6], 'item0': match[player][7], 'item1': match[player][8], 'item2': match[player][9], 'item3': match[player][10], 'item4': match[player][11], 'item5': match[player][12], "rune0": match[player][13], "rune1": match[player][14], "rune2": match[player][15], "rune3": match[player][16], "rune4": match[player][17], "rune5": match[player][18], "spell1": match[player][19], "spell2": match[player][20], "win":match[player][21], "champion_level": match[player][22], "minions_pm": match[player][23], "gold_earned": match[player][24], "gold_pm": match[player][25], "damage_dealt": match[player][26], "vision_score": match[player][27], "lane": match[player][28]}
                              for player in range(len(match))] for match in match_data],
                  "main": [{'match_id': match[0], 'summoner_name': match[1], 'champion_name': match[2], 'kills': match[3], 'deaths': match[4],
                          'assists': match[5], 'total_minions_killed': match[6], 'item0': match[7], 'item1': match[8], 'item2': match[9], 'item3': match[10],
                          'item4': match[11], 'item5': match[12], "rune0" : match[13],"rune1" :match[14],"rune2" :match[15],"rune3" :match[16],"rune4" :match[17],"rune5" :match[18],"spell1" :match[19],"spell2" :match[20],"win" :match[21], "champion_level": match[22], "minions_pm": match[23], "gold_earned": match[24], "gold_pm": match[25], "damage_dealt": match[26], "vision_score": match[27], "lane": match[28]} for match in main],"gameData": [{'gameWhen': match[0], 'gameMinutes': match[1], 'gameSeconds': match[2], 'gameMod': match[3]} for match in game_data]
                  })

@app.route("/team/<summoner_name_top1>,<summoner_name_jungle1>,<summoner_name_mid1>,<summoner_name_bot1>,<summoner_name_sup1>,<summoner_name_top2>,<summoner_name_jungle2>,<summoner_name_mid2>,<summoner_name_bot2>,<summoner_name_sup2>")
def team_analysis(summoner_name_top1, summoner_name_jungle1, summoner_name_mid1, summoner_name_bot1, summoner_name_sup1,
                  summoner_name_top2, summoner_name_jungle2, summoner_name_mid2, summoner_name_bot2, summoner_name_sup2):
  
    # Connect to the MySQL server
    cnx = mysql.connector.connect(user='root', password='Clol1234', host='localhost', database='league_data')
    cursor = cnx.cursor()
    # Create the teammatches table if it doesn't exist
    table_create = '''CREATE TABLE IF NOT EXISTS teammatches (
    match_id VARCHAR(255),
    puuid VARCHAR(255),
    participant_id INT,
    enemy_laner_id INT,
    vision_score INT,
    first_blood INT,
    team_id INT,
    control_wards INT
    )'''
    cursor.execute(table_create)
    cnx.commit()
    
    # Create the teamtimeline table if it doesn't exist
    table_create = '''CREATE TABLE IF NOT EXISTS teamtimeline (
    match_id VARCHAR(255),
    puuid VARCHAR(255),
    kills_and_assists INT,
    deaths INT,
    dragon_timer INT,
    herald_timer INT,
    minions_killed INT,
    enemy_laner_minions_killed INT
    )'''
       
    cursor.execute(table_create)
    cnx.commit()
    cursor.close()
    cnx.close()
  
    team1 = {}
    team2 = {}
    players = {}
    #players["team_1"] = team(summoner_name_top1, summoner_name_jungle1, summoner_name_mid1, summoner_name_bot1, summoner_name_sup1)
    #players["team_2"] = team(summoner_name_top2, summoner_name_jungle2, summoner_name_mid2, summoner_name_bot2, summoner_name_sup2)
    t1 = threading.Thread(target=laner, args=(summoner_name_top1,"TOP",team1,api_key,))
    t2 = threading.Thread(target=jungler, args=(summoner_name_jungle1,team1,api_key,))
    t3 = threading.Thread(target=laner, args=(summoner_name_mid1,"MIDDLE",team1,api_key,))
    t4 = threading.Thread(target=laner, args=(summoner_name_bot1,"BOTTOM",team1,api_key,))
    t5 = threading.Thread(target=support, args=(summoner_name_sup1,team1,api_key,))

    t6 = threading.Thread(target=laner, args=(summoner_name_top2,"TOP",team2,api_key_two,))
    t7 = threading.Thread(target=jungler, args=(summoner_name_jungle2,team2,api_key_two,))
    t8 = threading.Thread(target=laner, args=(summoner_name_mid2,"MIDDLE",team2,api_key_two,))
    t9 = threading.Thread(target=laner, args=(summoner_name_bot2,"BOTTOM",team2,api_key_two,))
    t10 = threading.Thread(target=support, args=(summoner_name_sup2,team2,api_key_two,))
    
    t1.start()
    t2.start()
    t3.start()
    t4.start()
    t5.start()
    t6.start()
    t7.start()
    t8.start()
    t9.start()
    t10.start()
 
    t1.join()
    t2.join()
    t3.join()
    t4.join()
    t5.join()
    t6.join()
    t7.join()
    t8.join()
    t9.join()
    t10.join()
    players["team1"] = team1
    players["team2"] = team2
    return players
   
if __name__ == "__main__":
    app.run(debug=True)