import pkg from "pg";
import dotenv from "dotenv";
dotenv.config({ path: "././.env" });

const { Pool } = pkg;
const pool = new Pool({
  host: process.env.PGHOST,
  user: process.env.PGUSER,
  password: "Doni123456",
  database: process.env.PGDATABASE,
  port: process.env.PGPORT,
  ssl: {
    rejectUnauthorized: false, // required for Azure PostgreSQL
  },
});

export { pool };
