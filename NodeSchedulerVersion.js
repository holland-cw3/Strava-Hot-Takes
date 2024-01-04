"use strict";

const keep_alive = require('./keep_alive.js');


const auth_url = "https://www.strava.com/oauth/token";
const activities_url = "https://www.strava.com/api/v3/activities";

let lastUpdateTime = null;
let activityId = null;

function updateJoke() {
  const currentTime = new Date();

  if (lastUpdateTime && currentTime - lastUpdateTime < 24 * 60 * 60 * 1000) {
    console.log("Skipping update. Not enough time has passed since the last update.");
    return;
  }
  const payload = {
    client_id: "*****",
    client_secret: ""*****",",
    refresh_token: ""*****",",
    grant_type: "refresh_token",
    scope: "read,write",
    f: "json",
  };

  console.log("Requesting Token...\n");
  fetch(auth_url, {
    method: "POST",
    body: new URLSearchParams(payload),
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    agent: new (require("https").Agent)({ rejectUnauthorized: false }),
  })
    .then((response) => response.json())
    .then((data) => {
      const access_token = data.access_token;
      console.log("Access Token =", access_token, "\n");

      const header = { Authorization: "Bearer " + access_token };
      fetch(`${activities_url}?per_page=1&page=1`, {
        headers: header,
      })
        .then((activitiesResponse) => activitiesResponse.json())
        .then((activity_list) => {
          const activity = activity_list[0];
          console.log(activity.id);
          if (activityId === activity.id) {
            console.log("Skipping update. No new activity.");
            return;
          }

          const activity_data = {
            description:
              "🥶 ColdTakes.js take of the Day 🥶 \n " +
              getHotTake() +
              "\nBy ColdTakes.js",
          };

          const update_url = `${activities_url}/${activity.id}`;
          fetch(update_url, {
            method: "PUT",
            body: JSON.stringify(activity_data),
            headers: {
              "Content-Type": "application/json",
              ...header,
            },
          }).then((response) => {
            if (response.status === 200) {
              console.log("Activity description updated!");
              activityId = activity.id;
              lastUpdateTime = currentTime;
            } else {
              console.log("Update Failed. Status code:", response.status);
              response.json().then((errorMessage) => {
                console.log("Error message:", errorMessage);
              });
            }
          });
        });
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}

function getHotTake() {
  const myDict = {
    1: "Costco pizza is the best you will find",
    2: "Cap's Take: The js should be replaced with .py(I finally read the complaint form)",
    3: "Batman isn't a superhero.",
    4: "Taco Bell needs to bring back the Quesarito",
    5: "Lillian's Take: Lillian - Peppermint in hot chocolate is bad",
    6: "Any fruity ice cream is just sorbet",
    7: "Cranberry juice isn't that good, it's just bitter",
    8: "Gatorade makes for good Smoothies",
    9: "Bags of chips are just 90% air",
    10: "Marvel movies aren't that good anymore",
    11: "Pizza is better upside down",
    12: "Ben's Take: Marathoning isn't hard",
    101: "Lillian's Take: Peanut butter bad",
    13: "Air hockey is weirdly difficult",
    14: "Lunchables used to be amazing",
    15: "Ok but fr fr, Harvard John's Mac and Fish is amazing",
    16: "Taco John's releasing the trademark on Taco Tuesdays is insane",
    17: "Boneless Chicken Wings are just chicken nuggets",
    18: "Harvard John's Take: - Putting ice in milk is the move",
    19: "I don't quite understand the pizzas with no pizza sauce",
    20: "Vainavi's Take: Food is important for survival",
    22: "Superman is too overpowered of a superhero, they literally add new powers every year.",
    23: "Melted butter on top of frosted cinnamon rolls = yummy",
    24: "Don't listen to Spot Holes 2 (the spot theme from across the spideverse) on a 4am run",
    25: "Most of today's animated movies don't hold up to the classics, such as cars (should've won the bracket)",
    26: "Are strawberries berries?",
    27: "Did you know that cashews come from a fruit?",
    28: "I always get tom and jerry mixed up",
    29: "Was supercalifragilisticexpialadocius a word before Mary Poppins?",
    30: "This one comes from Tim: urban roads are kind of wacky",
    31: "Brian's Programming Jokes in Joke.py are very funny",
    32: "McDonald's happy meal toys used to be so much better",
    33: "Golf is a mid sport, I wish there was pro mini golf",
    34: "LinkedIn is the new instagram(connect with me pls)",
    35: "Ben's take: Running a mile in over an hour is impossible. C Holland: Challenge Accepted",
    36: "Jessies's Take: Bark bark bark, bark baaark",
    37: "Vainavi's Take: Iced drinks shouldn't have ice",
    38: "Avocado toast is kind of an odd thing",
    39: "Vainavi's Take: Cheesecake isn't good",
    40: "Ok but why doesn't coffee cake have coffee in it?",
    41: "Vainavi's Take: Milk before cereal ALWAYS",
    42: "Star Wars prequels are underrated",
    43: "Vainavi's Take: Thinking of new ones",
    44: "Gingerbread houses are not structurally feasible to live in",
    47: "Potato chips are mid, potato chips with ripples however are S-tier",
    48: "Vainavi's Take: Chipotle is overrated",
    49: "The best part of a muffin is the crispy top",
    50: "Sprinkles are useless",
    51: "Vainavi's Take: Frosting is useless",
    52: "Smooth peanut butter is far superior to crunchy peanut butter.",
    53: "Vainavi's Take:  Thinking of new ones",
    54: "Pumpkin spice-flavored everything has gone too far",
    55: "Vainavi's Take: All candy sucks",
    57: "Vainavi's Take: Android > apple",
    58: "Vainavi's Take:  Thinking of new ones LOL",
    59: "Vainavi's Take: Drake, nicki minaj, and cardi b are very overrated",
    60: "Vainavi's Take:  Thinking of new ones",
    61: "Ok I got lazy, there is no take today.",
    62: "Sparkling water is just weird, sorry Tim",
    63: "Vainavi's Take: South campus is the worst dining hall",
    65: "Vainavi's Take: Raw tomatoes aren't tasty",
    66: "Vainavi's Take: Sweet and savory food combos don't work",
    67: "Breakfast for dinner is S-tier",
    68: "Vainavi's Take: Boba is overhyped",
    69: "Don't use peanut butter in place of eggs in pancakes",
    70: "I don't watch many scary movies, but FNAF was legendary",
    71: "Mustard does not belong on hot dogs",
    72: "Mr Game and Watch is the best SSB character",
    73: "Vainavi's Take: French is the least romantic language",
    74: "Legend of Zelda > Mario",
    75: "Vainavi's Take: Pasta is better than rice",
    76: "Vainavi's Take: Blueberries > blackberries",
    77: "Has anyone seen Beast Wars: Transformers? Just curious. If so, is Optimus Primal the coolest or what?",
    78: "Vainavi's Take: chicken wing flats are better than drumettes",
    81: "Spongebob is annoying. If it weren't for Patrick the show would be mid",
    82: "Leftover pizza for breakfast is a breakfast of champions.",
    83: "Runs should be longer than shorts",
    84: "Jeans are comfy to run in",
    85: "Crocs aren't comfortable, but the customization is admirable",
    87: "JavaScript is better than Python",
    88: "Camping is fun until the bugs invade",
    89: "Time travel movies always end up with plot holes; it's just a paradox. They only work when it isn't taken seriously",
    90: "More of a question: what were transformers before they were cars?",
    91: "CaptainSparklez minecraft vids hit different",
    92: "Applejack is the best pony",
    93: "Advice: never believe that wasabi is green chicken (don't ask plz)",
    94: "Python's requirement for indentation hurts me",
    95: "Hot sauce is very refreshing",
    96: "Salt your chocolate milk (or hot cocoa)",
    97: "Apple Cider > Apple juice, both aren't very good tho",
    98: "Anyone remember Webkins? My character was a parrot called tweety perry.",
    99: "Water doesn't have a flavor, sparkling water on the other hand does.",
    100: "The licorice jelly beans are absolutely gross",
  };

  const randomKey =
    Object.keys(myDict)[Math.floor(Math.random() * Object.keys(myDict).length)];
  const randomDescription = myDict[randomKey];
  return randomDescription;
}


const sch = require('node-schedule');
sch.scheduleJob('0 */5 * * * *', () => {
  updateJoke()
});
