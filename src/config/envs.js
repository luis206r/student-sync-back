require('dotenv').config();

//calling .env settings
module.exports = {
  NAME: "student-collab-db",
  USERNAME: "tmdb_users_user",
  PASSWORD: "UPxvAqzJC7IBc43AD9QSe8AZ5flEVPzs",
  PORT: 3001,
  DB_HOST: "dpg-cn5tc57sc6pc73c78ss0-a",
  SECRET: process.env.SECRET,
  TMDB_API_KEY: process.env.API_KEY,
  TMDB_API_TOKEN: process.env.API_TOKEN,
  CORS_ORIGIN: process.env.CORS_ORIGIN
};