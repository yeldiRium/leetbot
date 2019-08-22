const moment = require("moment-timezone");

const parseHours = (hours, timezone) =>
  moment()
    .tz(timezone)
    .hour(hours)
    .utc()
    .hour();

const parseMinutes = (minutes, timezone) =>
  moment()
    .tz(timezone)
    .minute(minutes)
    .utc()
    .minute();

const formatHours = (hours, timezone) =>
  moment()
    .utc()
    .hour(hours)
    .tz(timezone)
    .hour();

const formatMinutes = (minutes, timezone) =>
  moment()
    .utc()
    .minute(minutes)
    .tz(timezone)
    .minute();

module.exports = {
  parseHours,
  parseMinutes,
  formatHours,
  formatMinutes
};
