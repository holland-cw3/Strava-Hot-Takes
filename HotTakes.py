import random
import requests
import urllib3
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

auth_url = "https://www.strava.com/oauth/token"
activities_url = "https://www.strava.com/api/v3/activities"

def update_joke():
    payload = {
        'client_id': "********",
        'client_secret': '*******',
        'refresh_token': '***********',
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
    existing_description = activity.get('description', '')

    print("Existing Description:", existing_description)

    # Dictionary of strings
    strings = {
  
    }

    # Randomly select an item from the dictionary
    random_key = random.choice(list(strings.keys()))
    random_description = strings[random_key]

    # Update activity description
    activity_data = {
        "description": "🔥 HotTakes.py take of the Day 🔥 \n " + random_description
    }

    update_url = f"{activities_url}/{activity['id']}"
    response = requests.put(update_url, json=activity_data, headers=header)

    if response.status_code == 200:
        print("Activity description updated successfully!")
    else:
        print("Failed to update activity description. Status code:", response.status_code)
        print("Error message:", response.json())

update_joke()
