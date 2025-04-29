"use strict";
import express from "express";
import bodyParser from "body-parser";
import { GoogleGenAI } from "@google/genai";
import https from "https";
import takes from "./takes.js";

const app = express().use(bodyParser.json());
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_TOKEN });

const auth_url = "https://www.strava.com/oauth/token";
const activities_url = "https://www.strava.com/api/v3/activities";

app.listen(80, () => console.log("webhook is listening"));

/* ------- Endpoints ------- */
app.post("/webhook", (req, res) => {
  console.log("webhook event received!", req.query, req.body);
  res.status(200).send("EVENT_RECEIVED");
  if (
    req.body.aspect_type === "create" &&
    req.body.object_type === "activity"
  ) {
    console.log("New activity!");
    updateTake();
  }
});

app.get("/webhook", (req, res) => {
  const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
  let mode = req.query["hub.mode"];
  let token = req.query["hub.verify_token"];
  let challenge = req.query["hub.challenge"];
  if (mode && token) {
    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      console.log("WEBHOOK_VERIFIED");
      res.json({ "hub.challenge": challenge });
    } else {
      res.sendStatus(403);
    }
  }
});

/* ------- Getting Takes ------- */

async function updateTake() {
  const payload = {
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    refresh_token: process.env.REFRESH_TOKEN,
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
    agent: new https.Agent({ rejectUnauthorized: false }),
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
        .then(async (activity_list) => {
          const activity = activity_list[0];

          const hotTake = await getHotTake();
          const activity_data = {
            description: `🔥 HotTakesAI take of the Day 🔥 \n${hotTake}\nBy HotTakesAI`,
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

// Return either a random personalized hot take or an ai generated one
async function getHotTake() {
  const keys = Object.keys(takes);
  const randomKey = keys[Math.floor(Math.random() * Object.keys(takes).length)];

  return Math.random() >= 0.5 ? await AITake() : takes[randomKey];
}

const HT1 =
 "Costco pizza is the best you will find, Tim's Take: purple line is worth the delays, Batman isn't a superhero., Taco Bell needs to bring back the Quesarito, Lillian's Take: Lillian - Peppermint in hot chocolate is bad. Any fruity ice cream is just sorbet. Cranberry juice isn't that good, it's just bitter. Gatorade makes for good Smoothies. Bags of chips are just 90% air. Marvel movies aren't that good anymore. Pizza is better upside down. Ben's Take: Marathoning isn't hard. Lillian's Take: Peanut butter bad. Air hockey is weirdly difficult. Lunchables used to be amazing. Ok but fr fr, Harvard John's Mac and Fish is amazing. Taco John's releasing the trademark on Taco Tuesdays is insane. Boneless Chicken Wings are just chicken nuggets. Harvard John's Take: - Putting ice in milk is the move. I don't quite understand the pizzas with no pizza sauce. Vainavi's Take: Food is important for survival. Superman is too overpowered of a superhero, they literally add new powers every year. Melted butter on top of frosted cinnamon rolls = yummy. Don't listen to Spot Holes 2 (the spot theme from across the spideverse) on a 4am run. Most of today's animated movies don't hold up to the classics, such as cars (should've won the bracket). Strawberries are improperly named. Did you know that cashews come from a fruit? I always get tom and jerry mixed up. Was supercalifragilisticexpialadocius a word before Mary Poppins? This one comes from Tim: urban roads are kind of wacky. Brian's Programming Jokes in Joke.py are very funny. McDonald's happy meal toys used to be so much better. Golf is a mid sport, I wish there was pro mini golf. LinkedIn is the new instagram(connect with me pls). Ben's take: Running a mile in over an hour is impossible. C Holland: Challenge Accepted. Jessies's Take: Bark bark bark, bark baaark. Vainavi's Take: Iced drinks shouldn't have ice. Avocado toast is kind of an odd thing.  Vainavi's Take: Cheesecake isn't good. Ok but why doesn't coffee cake have coffee in it? Vainavi's Take: Milk before cereal ALWAYS. Star Wars prequels are underrated. Gingerbread houses are not structurally feasible to live in. Potato chips are mid, potato chips with ripples however are S-tier. Vainavi's Take: Chipotle is overrated. The best part of a muffin is the crispy top. Sprinkles are useless. Vainavi's Take: Frosting is useless. Smooth peanut butter is far superior to crunchy peanut butter.";
const HT2 =
 "Tim's Take: milk before cereal is trash, Pumpkin spice-flavored everything has gone too far, Vainavi's Take: All candy sucks, Vainavi's Take: Android > apple, Ben's Take: Eren Jaeger was right, Vainavi's Take: Drake, nicki minaj, and cardi b are very overrated, Tim's Take:  self driving cars and EVs are a distraction from the real issue of underfunding, Tim's Take: Sparkling water is great, Vainavi's Take: South campus is the worst dining hall, Vainavi's Take: Raw tomatoes aren't tasty, Vainavi's Take: Sweet and savory food combos don't work, Breakfast for dinner is S-tier, Vainavi's Take: Boba is overhyped, Don't use peanut butter in place of eggs in pancakes, I don't watch many scary movies, but FNAF was legendary, Mustard does not belong on hot dogs, Mr Game and Watch is the best SSB character, Vainavi's Take: French is the least romantic language, Legend of Zelda > Mario, Vainavi's Take: Pasta is better than rice, Vainavi's Take: Blueberries > blackberries, Has anyone seen Beast Wars: Transformers? Just curious. If so, is Optimus Primal the cooler optimus prime?, Vainavi's Take: chicken wing flats are better than drumettes, Spongebob is annoying. If it weren't for Patrick the show would be mid, Leftover pizza for breakfast is a breakfast of champions, Runs should be longer than shorts, Jeans are comfy to run in, Crocs \'t comfortable, but the customization is admirable, JavaScript is better than Python, Camping is fun until the bugs invade, More of a question: what were transformers before they were cars? CaptainSparklez minecraft vids hit different, Applejack is the best pony, Advice: never believe that wasabi is green chicken (don\'t ask plz), Tim\'s Take: ice cream is not that good, Hot sauce is very refreshing, Salt your chocolate milk (or hot cocoa), Apple Cider > Apple juice, both aren\'t very good tho, Anyone remember Webkins? My character was a parrot called tweety perry, Water doesn\'t have a flavor, sparkling water on the other hand does, The licorice jelly beans are absolutely gross, Thick of it by KSI is a legendary song, New Disney movies are just lazy"

const HotTakes = HT1 + HT2;


async function AITake() {
  const offLimits =
    "math, calculator, grammar, binary code, oxford comma, grammar";

  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: `Given the following hot takes, create a super duper silly one of your own that follows the pattern 'AI's Take: <Hot Take>' Refrain from the following topics${offLimits}. Here are the takes: ${HotTakes}`,
  });

  const aiTake = response.candidates[0].content.parts[0].text;
  const regex = "AI's Take: .*.";
  const found = aiTake.match(regex);

  let result = found[0].replaceAll("\n", "");
  return result;
}
