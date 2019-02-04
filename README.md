Telegram Bots
====

[![codecov](https://codecov.io/gh/yeldiRium/telegram-bots/branch/master/graph/badge.svg)](https://codecov.io/gh/yeldiRium/telegram-bots)
[![greenkeeper](https://badges.greenkeeper.io/yeldiRium/telegram-bots.svg)](https://greenkeeper.io/)

Setup
----

```bash
    cp .env.example .env

    # adjust parameters in .env

    docker-compose build bots-prod

    docker-compose up -d bots-prod
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

For development use `bots` instead of `bots-prod`.

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

If you're just here to expand the leetbot's list of insults, please take a look
at `/leetbot/i18n.js`. There are two arrays under the keys `callout.asshole` and
`callout.timing`. Those can be expanded as wanted in german and english. They
don't have to be synchronous across languages.
Please only suggest insults that you (or I) would write publicly on social media
etc. The point is to be funny, not to be vulgar.

Contribution Guidelines
----

* Try to test your application code. It doesn't have to be 100%, but try not to
lower the overall coverage for the project.
* Follow the linter. Otherwise deployments will fail. We currently unfortunately
have no automated testing and linter checking integrated with github, but both
can be looked up on rancher.
