The content below is an example project proposal / requirements document. Replace the text below the lines marked "__TODO__" with details specific to your project. Remove the "TODO" lines.

(__TODO__: your project name)

# One Piece Jeopardy! 

## Overview

*One Piece Jeopardy!* is a jeopardy-style game based off of One Piece. Users will register onto the site to create an account, and then be able to access the game. The game itself is a inquisition of three topics:
* Arcs
* Characters
* Abilities (Haki, Devil Fruit, etc.)

A user would have to pick one of the three categories and answer three questions (randomly selected from stored .json files on backend). Then, a user answers each question to their best of ability (Three tries per question. If you miss it, that's tragic!). After the user completes the game, they have the option to save it to their profile, which they can access anytime to view past games.

By the nature of this game randomly selecting things, functionality will need to be implemented to randomly select three questions from each .json. I'm thinking to implement a cron job at [pythonanywhere](pythonanywhere.com) and run a Python script to use the GitHub API to grab my GitHub credentials and select three questions to use once a day at 12:00 AM UCT. 

## Data Model

The application will store Users and Past Games 

* Users will have the ability to view their past games by a relation
* Past games can be accessed by user via an `id` parameter.
An Example User:

```javascript
{
  username: "NarutoIsTheWorstOfTheBigThree",
  passwordHash: "BorutoIsMid!!!" // a password hash, example hash provided
  pastGames: // an array of references to past games
}
```

An Example of a Past Game:

```typescript
{
  user: // a reference to a User object
  timestamp: Date: // only store day, we don't care about exact time
  score: 6 // each try you lose a point, you get it wrong, no points!
  attempt: {
    // example category, can be abilities, characters, or arcs
    category: "GreenGreenWhatsYourProblemGreenWhatIsYourProblemMeSayAloneRampMeSayAloneRamp"
    questions: [
      {
        question: "This game sucks",
        responses: [ // stores user responses
          "CS2"
        ],
        answer: "CS2",
        points: 3
      },
      {
        question: "This game sucks more",
        responses: [ 
          "Valorant"
        ],
        answer: "VALORANT", // case insensitive detection
        points: 3
      },
        question: "This game is the best of all time",
        responses: [ 
          "COD MW2",
          "Pokemon Legends Arceus",
          "JoJo's Bizzare Adventure: Eyes of Heaven"
        ],
        answer: "Team Fortress 2",
        points: 0
    ]
  }
}
```


## [Link to Commented First Draft Schema](backend/db.ts) 

## Wireframes

(__TODO__: wireframes for all of the pages on your site; they can be as simple as photos of drawings or you can use a tool like Balsamiq, Omnigraffle, etc.)

/list/create - page for creating a new shopping list

![list create](documentation/list-create.png)

/list - page for showing all shopping lists

![list](documentation/list.png)

/list/slug - page for showing specific shopping list

![list](documentation/list-slug.png)

## Site map

(__TODO__: draw out a site map that shows how pages are related to each other)

Here's a [complex example from wikipedia](https://upload.wikimedia.org/wikipedia/commons/2/20/Sitemap_google.jpg), but you can create one without the screenshots, drop shadows, etc. ... just names of pages and where they flow to.

## User Stories or Use Cases

(__TODO__: write out how your application will be used through [user stories](http://en.wikipedia.org/wiki/User_story#Format) and / or [use cases](https://en.wikipedia.org/wiki/Use_case))

1. as non-registered user, I can register a new account with the site
2. as a user, I can log in to the site
3. as a user, I can create a new grocery list
4. as a user, I can view all of the grocery lists I've created in a single list
5. as a user, I can add items to an existing grocery list
6. as a user, I can cross off items in an existing grocery list

## Research Topics

(__TODO__: the research topics that you're planning on working on along with their point values... and the total points of research topics listed)

* (5 points) Integrate user authentication
    * I'm going to be using passport for user authentication
    * And account has been made for testing; I'll email you the password
    * see <code>cs.nyu.edu/~jversoza/ait-final/register</code> for register page
    * see <code>cs.nyu.edu/~jversoza/ait-final/login</code> for login page
* (4 points) Perform client side form validation using a JavaScript library
    * see <code>cs.nyu.edu/~jversoza/ait-final/my-form</code>
    * if you put in a number that's greater than 5, an error message will appear in the dom
* (2 points) React
    * I will use React for my frontend. I have experience, so I won't have to learn anything. Because of the overhead added, I'll assign it two points.

10 points total out of 8 required points (___TODO__: addtional points will __not__ count for extra credit)


## [Link to Initial Main Project File](app.mjs) 

(__TODO__: create a skeleton Express application with a package.json, app.mjs, views folder, etc. ... and link to your initial app.mjs)

## Annotations / References Used

(__TODO__: list any tutorials/references/etc. that you've based your code off of)

1. [passport.js authentication docs](http://passportjs.org/docs) - (add link to source code that was based on this)
2. [tutorial on vue.js](https://vuejs.org/v2/guide/) - (add link to source code that was based on this)

