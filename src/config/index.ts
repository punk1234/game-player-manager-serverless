const { env } = process;

export default {
  JWT_TOKEN_SECRET: <string>env.JWT_TOKEN_SECRET,
  JWT_TOKEN_TTL_IN_HOURS: env.JWT_TOKEN_TTL_IN_HOURS || "24",
  USERS_TABLE: env.USERS_TABLE || "users",
  GAMES_TABLE: env.GAMES_TABLE || "games",
  USER_GAME_HIGHSCORES_TABLE: env.USER_GAME_HIGHSCORES_TABLE || "user_game_highscores"
}