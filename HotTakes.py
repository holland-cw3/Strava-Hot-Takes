import random
import requests
import urllib3
import GetTakes
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

auth_url = "https://www.strava.com/oauth/token"
activities_url = "https://www.strava.com/api/v3/activities"

def update_joke():
    payload = {
        'client_id': "*****",
        'client_secret': '*************',
        'refresh_token': '**************',
        'grant_type': "refresh_token",
        'scope': 'read,write',
        'f': 'json'
    }

    print("Requesting Token...\n")
    res = requests.post(auth_url, data=payload, verify=False)
    access_token = res.json()['access_token']
    print("Access Token = {}\n".format(access_token))

    header = {'Authorization': 'Bearer ' + access_token}
    param = {'per_page': 1, 'page': 1}
    activity_list = requests.get(activities_url, headers=header, params=param).json()

    activity = activity_list[0]
   


    activity_data = {
        "description": "🔥 HotTakes.py take of the Day 🔥 \n " + GetTakes.getHotTake() + "\nBy HotTakes.py v1.6"
    }

    update_url = f"{activities_url}/{activity['id']}"
    response = requests.put(update_url, json=activity_data, headers=header)

    if response.status_code == 200:
        print("Activity description updated successfully!")
    else:
        print("Failed to update activity description. Status code:", response.status_code)
        print("Error message:", response.json())

update_joke()
