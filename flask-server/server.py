from flask import Flask, jsonify, request
import requests

app = Flask(__name__)

# API key for the league server
api_key = "RGAPI-2f70e221-e7c5-4d56-af24-081a184a2f3a"

# Members API route
@app.route("/members/<summoner_name>")
def members(summoner_name):
    region ="NA1"
    headers = {'X-Riot-Token': api_key}
    url = f'https://{region}.api.riotgames.com/lol/summoner/v4/summoners/by-name/{summoner_name}'
    response = requests.get(url, headers=headers)
    if response.status_code != 200:
        return jsonify(error = response.status_code)
    player_info = response.json()
    player_name = player_info["name"]
    player_level = player_info['summonerLevel']

    # Return the player's name and level as a JSON response
    return jsonify(name=player_name, level=player_level)

if __name__ == "__main__":
    app.run(debug=True)
