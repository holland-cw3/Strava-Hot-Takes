# Strava-Hot-Takes-v2
Makes use of the Strava API and Node.js in order to update my activity descriptions with random hot takes. The code is hosted on Replit, and uses my own webhook to observe when new acitivities are uploaded, which in turn updates the description. Scripting was previously done in Python, and was converted over to JavaScript due to limit. This process is fully automated.

Since the server is hosted on replit, the hosting process is bypassed by the use of an app: UptimeRobot which acts as a stand in for a user on the site, so the server is always running

![image](https://github.com/holland-cw3/Strava-Hot-Takes-v1.7/assets/101285025/c7d983fd-f63d-45fb-94bd-9adb11994c1a)

# Version History
# V1: 
  - Uses python and the Strava API to update my captions, no automation.
# V1.5:
  - Code is hosted on pythonanywhere to update the code at specific intervals (once a day)
# V1.6:
  - Added JSON file readers/writers to ensure takes are never reused
# V1.7: 
  - Bug fix with file writer: would previously delete a take even if the API request to strava didn't execute properly
  - Better automation with windows task scheduler, still suboptimal
# V2.0:
  - Converted from python over to JavaScript (Node.js) due to constraints of replit projects
  - Makes use of my own Node.js webhook, so that the description is updated whenever a new activity is created
  - Using an App: UptimeRobot to keep the server alive, without having to pay for hosting (mouse wiggler for replit servers)
  - The only downside is that I had to remove the uniqueness of each description, so repeats are allowed.
