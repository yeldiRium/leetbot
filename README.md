Telegram Bots
====

[![codecov](https://codecov.io/gh/yeldiRium/leetbot/branch/master/graph/badge.svg)](https://codecov.io/gh/yeldiRium/leetbot)
[![greenkeeper](https://badges.greenkeeper.io/yeldiRium/leetbot.svg)](https://greenkeeper.io/)

Setup
----

```bash
    cp .env.example .env

    # adjust parameters in .env

    docker-compose build

    docker-compose up -d
```

The bots now connect to the telegram api and all should be good.

Leetbot
----

Made specifically for a group with friends from uni.

The bot tracks, how many people write "1337" in the time from 13:37 to 13:38
every day and then either reports the count and participants or tells people off
who interrupt the leeting with inappropriate behavior.

Careful: The translation files contain vulgar language.

Development Guide
----

Further bots can be added relatively easily. There is an examplebot to showcase
how to do that.

Each bot has its own directory (e.g. `/leetbot` and `/examplebot`) and each bot
has their own configuration section. See the `config.js` file and the 
corresponding `.env.example`. To add a new bot, its token and name have to be
configured and an entrypoint has to be created. For the bot to actually start
though, it has to be added to the list of registered bots in `/index.js`.

Don't worry if there are bots in there for which you don't have tokens - if a 
bot is missing a token it just won't start. So add a token for the examplebot, 
add it to the list and start it up to see it go.

To configure the bot for deployment, you have to add its environment variables
to the `/deploy/deployment.yml` file. This is the kubernetes resource that is
deployed on rancher.

Contribution Guidelines
----

* Try to test your application code. It doesn't have to be 100%, but try not to
lower the overall coverage for the project.
* Follow the linter. Otherwise deployments will fail. We currently unfortunately
have no automated testing and linter checking integrated with github, but both
can be looked up on rancher.
