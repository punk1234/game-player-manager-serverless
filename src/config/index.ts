const { env } = process;

export default {
  JWT_TOKEN_SECRET: <string>env.JWT_TOKEN_SECRET,
  JWT_TOKEN_TTL_IN_HOURS: env.JWT_TOKEN_TTL_IN_HOURS || "24",
  USERS_TABLE: process.env.USERS_TABLE || "users",
  GAMES_TABLE: process.env.GAMES_TABLE || "games"
}