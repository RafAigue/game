# React games

## Single player and local network multi player games

This project consists of two games built with React and WebSockets.
For multi player game, only one local host server is needed.

Install dependencies:
**Node.js is required.**

Download the Git repository:

```bash
git clone https://github.com/RafAigue/game.git
```

Download and install the dependencies:

```bash
cd game
npm install
```

Run the game and host it:

```bash
npm run dev --host
```

Copy the IP address of the host:
**192.168.X.X**

Open the files ***src/constants.js*** and ***src/games/multi-player/Server.js*** and change the IP address to the one of the host to the **WS_HOST** constant.

In the host machine, open a terminal and run the server for multi player game:

```bash
cd src/games/multi-player
node Server.js
```

Open the game in your browser:
**__WS_HOST__:5173**

**ENJOY!**