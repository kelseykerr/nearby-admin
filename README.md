# Nearby Admin
![ScreenShot](https://user-images.githubusercontent.com/6576998/29345067-313144c0-820a-11e7-9760-cf6e5fc9750d.png)

![ScreenShot](https://user-images.githubusercontent.com/6576998/29345073-3744d5d4-820a-11e7-9d83-e388fb11cd9b.png)

A tool for internal Iuxta use where we can easily view Nearby data such as users, requests, responses, & transactions. Uses filters so you can make searches like: users that signed up in the past day, users within 10 miles of x location, requests within 10 miles of x

## Getting Started
**This should be updated/reviewed next time someone does a fresh install of this app!


### Prerequisites

You will need Node & NPM installed. Make sure you have homebrew installed so you can install other things :)

```
brew install node
```

To make sure the installation worked, check the versions:

```
npm -v
```

```
node -v
```

### Installing

Clone the repo, cd into the nearby-admin directory, then install the dependencies by running:

```
npm install
```

To run the app locally, run:

```
npm run start
```

The app should be up and running at: localhost:9000


## Built With

* Node
* Angular

Other tools/frameworks/libraries:

* Babel - for transpiling ES6 to ECMAScript 5 since some browsers don't support ES6 yet (server side)
* Nodemon - used in development to watch for changes on the server and automatically rebuild so you don't have to manually do so (serve side)
* Mongoose - tool for Node/JS to talk to our mongo database (server side)
* Express - web application framework for Node, api path mapping for http requests (server side)


