# TylsaaApp

# Are you bored? Need something to do? TylsaaApp can help! 

TylsaaApp is a react-native (with javascript) app for looking up different activities to do! 
There's no need to login to look up activities to do, or for getting points for buying rewards. 

TylsaaApp has been published to expo at https://expo.dev/@iidar/tylsaa-app

# Homepage 

<img src="https://github.com/Pistaasi/TylsaaApp/blob/main/Images/Homepage.jpg" alt="Homepage" width="250"/>

The user can look up activities from https://www.boredapi.com/api/activity to do. 
If the user likes an activity by pressing the heart icon (Ionicons), the heart icon gets a glow animation made with @pistaasi/react-native-glow, which is an npm package made by me. The glow animation is made using react-spring for react native. Liked activities are saved to an SQlite database. 
If the user dislikes a suggested activity, they can press the trashcan (Ionicons) to blacklist it and save it to the database. If a banned activity comes up, activities are auto refreshed until a non banned activity shows up. 
The middle refresh icon refreshes the activity. This gives the user a new activity. 

Pressing the done button (using react-native-elements and react-native-touchable-scale) gives the user 10 points, and gets a new activity. Normal activities give 10 points, and daily activitites give 20 points for double the points. Points are saved to the database.
Daily activities are displayed at the bottom of the page in a Flatlist. There are three daily activities, randomly fetched, which give double points. Dailies refresh at midnight. 

At the top of the page are the parameters, which use Picker from react-native-picker and Checkbox from react-native-elements. Activities can be limited by type, participants and price. This does not affect dailies. 

# Points 

<img src="https://github.com/Pistaasi/TylsaaApp/blob/main/Images/Points.jpg" alt="Homepage" width="250"/>

Points page let's the user use their earned points from doing activities. 
There are two rewards, jokes and cat facts, fetched from their API's, https://catfact.ninja/fact and https://v2.jokeapi.dev/joke/any?safe-mode

Points are refreshed every 5 seconds with a set interval, which fetches points from the database. Rewards cost 10 points. 
The rewards text uses a react-spring animation, which gives a fade in pop up kind of effect by changing text size and opacity. 

# Favorites 

<img src="https://github.com/Pistaasi/TylsaaApp/blob/main/Images/Favorites.jpg" alt="Homepage" width="250"/>

Favorites display favorited activities in the database. Activities in the list can be deleted by pressing the trashcan icon. 
