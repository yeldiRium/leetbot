# Leetbot

A telegram bot for leeting.

Made specifically for a group with friends from uni.

The bot tracks, how many people write "1337" in the time from 13:37 to 13:38
every day and then either reports the count and participants or tells people off
who interrupt the leeting with inappropriate behavior.

Careful: The translation files contain vulgar language.

## Status

| Category         | Status                                                             |
| ---------------- | ------------------------------------------------------------------ |
| Dependencies     | ![David](https://img.shields.io/david/yeldirium/telegram-bots)     |
| Dev dependencies | ![David](https://img.shields.io/david/dev/yeldirium/telegram-bots) |

Deployment can be found [here](https://github.com/yeldiRium/telegram-bots-deployment/).

## Local Setup

```bash
    cp .env.example .env

    # adjust parameters in .env

    docker-compose build bots-prod

    docker-compose up -d bots-prod
```

The bots now connect to the telegram api and all should be good.

## Development Guide

For development use `bots` instead of `bots-prod`. When you make changes to the
code, the bot will be restarted automatically.

If you're just here to expand the leetbot's list of insults, please take a look
at `/leetbot/i18n.js`. There are two arrays under the keys `callout.asshole` and
`callout.timing`. Those can be expanded as wanted in german and english. They
don't have to be synchronous across languages.
Please only suggest insults that you (or I) would write publicly on social media
etc. The point is to be funny, not to be an asshole.

## Contribution Guidelines

- Try to test your application code. It doesn't have to be 100%, but try not to
  lower the overall coverage for the project.
- Follow the linter. Otherwise deployments will fail. We currently unfortunately
  have no automated testing and linter checking integrated with github, but both
  can be looked up on rancher.
