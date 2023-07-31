import random
import json


def getHotTake():
    try:
        with open("Takes.json", "r") as file:
            strings = json.load(file)
    except FileNotFoundError:
        strings = {
            1: "Broken",
        }
    
    random_key = random.choice(list(strings.keys()))
    random_description = strings[random_key]

    del strings[random_key]
    
    with open("Takes.json", "w") as file:
        json.dump(strings, file)
    
    print(len(strings))

    return random_description
