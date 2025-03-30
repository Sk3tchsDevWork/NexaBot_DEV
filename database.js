const Database = require('better-sqlite3');
const path = require('path');

// Create or open the database file
const db = new Database(path.join(__dirname, 'bot_database.sqlite'));

// Create the users table if it doesn't exist
db.prepare(`
  CREATE TABLE IF NOT EXISTS users (
    userId TEXT PRIMARY KEY,
    lastClaim INTEGER,
    streak INTEGER DEFAULT 0,
    totalRewards INTEGER DEFAULT 0
  )
`).run();

// Create the settings table if it doesn't exist
db.prepare(`
  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT
  )
`).run();

module.exports = db;