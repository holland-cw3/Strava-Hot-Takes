'use strict';

const keep_alive = require('./keep_alive.js')
const fetch = require('node-fetch');

process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

const auth_url = "https://www.strava.com/oauth/token";
const activities_url = "https://www.strava.com/api/v3/activities";

const
    express = require('express'),
    bodyParser = require('body-parser'),
    app = express().use(bodyParser.json());

app.listen(process.env.PORT || /*PORT_NUMBER*/, () => console.log('webhook is listening'));

app.post('/webhook', (req, res) => {
    console.log('Webhook event received!', req.body);

    if (req.body.aspect_type === 'create' && req.body.object_type === 'activity') {
        console.log('New activity!');
        updateTake();
    }

    res.status(200).send('EVENT_RECEIVED');
});

app.get('/webhook', (req, res) => {
    const VERIFY_TOKEN = "SOME_STRING";
    let mode = req.query['hub.mode'];
    let token = req.query['hub.verify_token'];
    let challenge = req.query['hub.challenge'];
    if (mode && token) {
        if (mode === 'subscribe' && token === VERIFY_TOKEN) {
            console.log('WEBHOOK_VERIFIED');
            res.json({ "hub.challenge": challenge });
        } else {
            res.sendStatus(403);
        }
    }
});

function updateTake() {
    const payload = {
        client_id: "*****",
        client_secret: '*********',
        refresh_token: '*********',
        grant_type: "refresh_token",
        scope: 'read,write',
        f: 'json'
    };

    console.log("Requesting Token...\n");
    fetch(auth_url, {
        method: 'POST',
        body: new URLSearchParams(payload),
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        agent: new (require('https')).Agent({ rejectUnauthorized: false }),
    })
        .then((response) => response.json())
        .then((data) => {
            const access_token = data.access_token;
            console.log("Access Token =", access_token, "\n");

            const header = { 'Authorization': 'Bearer ' + access_token };
            const param = { 'per_page': 1, 'page': 1 };
            fetch(`${activities_url}?per_page=1&page=1`, {
                headers: header
            })
                .then((activitiesResponse) => activitiesResponse.json())
                .then((activity_list) => {
                    const activity = activity_list[0];
                    console.log(activity.id);

                    const activity_data = {
                        description: "🔥 HotTakes.js take of the Day 🔥 \n " + getHotTake() + "\nBy HotTakes.js"
                    };

                    const update_url = `${activities_url}/${activity.id}`;
                    fetch(update_url, {
                        method: 'PUT',
                        body: JSON.stringify(activity_data),
                        headers: {
                            'Content-Type': 'application/json',
                            ...header,
                        }
                    })
                        .then((response) => {
                            if (response.status === 200) {
                                console.log("Activity description updated successfully!");
                            } else {
                                console.log("Failed to update activity description. Status code:", response.status);
                                response.json()
                                    .then((errorMessage) => {
                                        console.log("Error message:", errorMessage);
                                    });
                            }
                        });
                });
        })
        .catch((error) => {
            console.error("Error while fetching data:", error);
        });
}

function getHotTake() {
    const myDict = {
        "1": "Costco pizza is the best you will find",
        "2": "Taco Bell needs to bring back the Quesarito",
        "3": "Green Lantern isn't that bad of a movie",
        "4": "I'm going to get a lot of hate for this one: Stranger Things got worse after season 1",
        "5": "Andrew's Take: Popeye's Chicken Sandwiches are better than Chick-fil-a's",
        "6": "Any fruity ice cream is just sorbet (exception of strawberry)",
        "7": "Cranberry juice isn't that good, it's just bitter",
        "8": "Gatorade makes for good Smoothies",
        "9": "More of a disappointing glare towards chips, but I remember the good ol' days when the bag was 90% chips. Now they're just 90% air",
        "10": "Transformers is a lot better than people give it credit for",
        "11": "Pizza is better upside down",
        "12": "Pineapple pizza is ok, don't add ham",
        "12": "Indy's Take: Coming up with Hot Takes is easy. C Holland: wait till my greatest creation comes out",
        "13": "Air hockey is weirdly difficult",
        "14": "Lunchables used to be amazing",
        "15": "Kool-Aid is just powdered gatorade",
        "16": "Taco John's releasing the trademark on Taco Tuesdays is insane",
        "17": "Boneless Chicken Wings are just chicken nuggets",
        "18": "Cold Showers > Hot Showers",
        "19": "I don't quite understand the pizzas with no pizza sauce",
        "20": "Baking > Cooking",
        "22": "Superman is too overpowered of a superhero.",
        "23": "Indy's Take: Vanilla is better than any other flavor. C Holland Opinion: BRUH",
        "24": "Waffle fries > regular",
        "25": "Most of today's animated movies don't hold up to the classics, such as cars (should've won the bracket)",
        "26": "Are strawberries berries?",
        "27": "Did you know that cashews come from a fruit?",
        "28": "I always get tom and jerry mixed up",
        "29": "Was supercalifragilisticexpialadocius a word before Mary Poppins?",
        "30": "This one comes from Tim: urban roads are kind of wacky",
        "31": "Brian's Programming Jokes in Joke.py are very good",
        "32": "McDonald's happy meal toys used to be so much better",
        "33": "Golf is an odd sport, I wish there was pro mini golf",
        "34": "Egg fried rice yum",
        "35": "Strava is the #1 social media platform",
        "36": "Vainavi's Take: Fries without ketchup please",
        "37": "Vainavi's Take: Oreo filling isn't good",
        "38": "Avocado toast is kind of an odd thing",
        "39": "Vainavi's Take: Cheesecake isn't good",
        "40": "The best way to eat Oreos is to eat all the cookies first, and then the frosting",
        "41": "Vainavi's Take: Milk before cereal ALWAYS",
        "42": "Star Wars prequels are underrated",
        "43": "Vainavi's Take: mint and chocolate bad combo",
        "44": "Candy corn is the worst Halloween candy",
        "45": "Vainavi's Take: Peaches should be as hard as possible",
        "46": "Vainavi's Take: Mexican food is very overrated",
        "47": "Pepsi > coke",
        "48": "Vainavi's Take: Chipotle is overrated",
        "49": "The best part of a muffin is the crispy top",
        "50": "Sprinkles are useless",
        "51": "Vainavi's Take: Frosting is useless",
        "52": "Smooth peanut butter is far superior to crunchy peanut butter.",
        "53": "Vainavi's Take: M&Ms suck, but if we have to choose, the brown M&Ma are best",
        "54": "Pumpkin spice-flavored everything has gone too far",
        "55": "Vainavi's Take: All candy sucks",
        "56": "Vainavi's Take: Popcorn doesn't add to the movie experience",
        "57": "Vainavi's Take: Android > apple",
        "58": "Vainavi's Take: I dislike most rap music",
        "59": "Vainavi's Take: Drake, nicki minaj, and cardi b are very overrated",
        "60": "Vainavi's Take: Sushi isn't tasty",
        "61": "Pasta > rice",
        "62": "Sparkling water is just weird, sorry Tim",
        "63": "Vainavi's Take: South campus is the worst dining hall",
        "64": "Vainavi's Take: Milk chocolate > dark > white",
        "65": "Vainavi's Take: Raw tomatoes aren't tasty",
        "66": "Vainavi's Take: Sweet and savory food combos don't work",
        "67": "Breakfast for dinner is S-tier",
        "68": "Vainavi's Take: Boba is overhyped",
        "69": "Pancakes are superior to waffles in every way",
        "70": "Horror movies are scary",
        "71": "Mustard does not belong on hot dogs",
        "72": "Cereal is the best all around snack",
        "73": "Vainavi's Take: there is nothing romantic about the French language",
        "74": "Mint-flavored desserts taste like toothpaste",
        "75": "Vainavi's Take: Dogs > cats",
        "76": "Vainavi's Take: Blueberries > blackberries",
        "77": "Doritos are mid",
        "78": "Vainavi's Take: chicken wing flats are better than drumsticks",
        "79": "Vainavi's Take: churros > cinnamon roles",
        "80": "Vainavi's Take: Legally Blonde > Mean Girls. C Holland: I have to agree with this. Mean girls basically had two good lines, Legally blonde was just a masterpiece",
        "81": "Spongebob is annoying. If it weren't for Patrick the show would be mid",
        "82": "Leftover pizza for breakfast is a breakfast of champions.",
        "83": "Short Shorts are fashionable",
        "84": "Vans aren't comfortable shoes",
        "85": "Crocs aren't comfortable",
        "86": "Brooks > any other running shoe",
        "87": "Savory soft pretzels > sweet",
        "88": "Camping is fun until the bugs invade",
        "89": "Time travel movies always end up with plot holes; it's just a paradox. They only work when it isn't taken seriously",
        "90": "More of a question: what were transformers before they were cars?",
        "91": "CaptainSparklez minecraft vids hit different",
        "92": "Applejack is the best pony",
        "93": "Advice: never believe that wasabi is green chicken (don't ask plz)",
        "94": "Jazz is not good",
        "95": "Procrastination is an art form; I'll master it someday, just not today.",
        "96": "Salt your chocolate milk (or hot cocoa)",
        "97": "Water slides > diving board",
        "98": "Socks are easy to lose, in fact once I lost both of them during a run",
        "99": "Water doesn't have a flavor",
        "100": "The licorice jelly beans are absolutely gross",
    };

    const randomKey = Object.keys(myDict)[Math.floor(Math.random() * Object.keys(myDict).length)];
    const randomDescription = myDict[randomKey];

    return randomDescription;
}


