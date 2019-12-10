# Leetbot

A telegram bot for leeting.

Made specifically for a group with friends from uni.

The bot tracks, how many people write "1337" in the time from 13:37 to 13:38
every day and then either reports the count and participants or tells people off
who interrupt the leeting with inappropriate behavior.

Careful: The translation files contain vulgar language.

## Status

| Category         | Status                                                                                            |
| ---------------- | ------------------------------------------------------------------------------------------------- |
| Dependencies     | ![David](https://img.shields.io/david/yeldirium/telegram-bots)                                    |
| Dev dependencies | ![David](https://img.shields.io/david/dev/yeldirium/telegram-bots)                                |
| Build            | ![GitHub Actions](https://github.com/yeldiRium/leetbot/workflows/Release/badge.svg?branch=master) |
| License          | ![GitHub](https://img.shields.io/github/license/yeldiRium/leetbot)                                |

## Usage

To use the bot, add the telegram bot @YeldirsLeetBot to your group chat or host the bot yourself and add it.

Available commands:

- /start - A greeting from the bot.
- /help - Some help on how to use the bot.
- /info - Get some information about the bot and the current chat. Includes wether the bot is enabled, the current highscore and maybe more.
- /enable - Enable the bot in the current chat.
- /disable - Disable the bot in the current chat. **Careful**: Deletes all data for the chat, including the highscore.
- /setLanguage - Sets the language. Only works if the current chat is enabled, since otherwise no language is persisted.
- /score - Tells a user their current score. (This score is currently always 0, since it is not being used yet.)
- /debug - Dump the bot's entire state into the chat.

## Development

### Project Setup

```bash
  cp .env.example .env

  # Adjust parameters in .env

  # In production
  docker-compose build bots-prod
  docker-compose up -d bots-prod

  # I development
  docker-compose build bots
  docker-compose up -d bots
```

The leetbot now connects to the telegram api and all should be good.

### Development Guide

For development use `bots` instead of `bots-prod`. When you make changes to the
code, the bot will be restarted automatically.

If you're just here to expand the leetbot's list of insults, please take a look
at [`./src/i18n.js`](./src/i18n.js). There are two arrays under the keys `callout.asshole` and
`callout.timing`. Those can be expanded as wanted in german and english. They
don't have to be synchronous across languages.

Please only suggest insults that you (or I) would write publicly on social media
etc. The point is to be funny, not to be edgy or offensive.

### Testing

The leetbot uses the testing framework [jest](https://jestjs.io/)
for its tests and [jest-extended](https://github.com/jest-community/jest-extended)
to have more and more flexible assertions and matchers available.

For resources on jest and jest-extended see my resource collection [here](https://github.com/yeldirium/resources#testing).u

## Contribution Guidelines

- Try to test your application code. It doesn't have to be 100%, but try not to
  lower the overall coverage for the project.
- Follow the linter. Otherwise the tests will fail.
