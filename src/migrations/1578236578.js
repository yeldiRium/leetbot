/**
 * Rename multiChatLeetCounter to chats.
 */
module.exports = {
  id: "1578236578",
  migrate: state => ({
    chats: state.multiChatLeetCounter,
    userScores: state.userScores
  })
};
