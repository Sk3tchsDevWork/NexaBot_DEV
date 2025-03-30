const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session'); // Add session management
const { Client } = require('discord.js');
const db = require('./database'); // SQLite database
const OAuth2 = require('discord-oauth2');

const app = express();
const PORT = 3000;

// Discord OAuth2 setup
const oauth = new OAuth2();
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;

// Middleware
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

// Add session middleware
app.use(
  session({
    secret: 'your-secret-key', // Replace with a secure secret key
    resave: false,
    saveUninitialized: false,
  })
);

// Discord bot client
const client = new Client({ intents: [] });

// Authentication middleware
function isAuthenticated(req, res, next) {
  if (!req.session || !req.session.user) {
    return res.redirect('/');
  }
  next();
}

// Home route
app.get('/', (req, res) => {
  res.render('index', { botName: client.user ? client.user.username : 'Bot' });
});

// Settings route (protected by authentication middleware)
app.get('/settings', isAuthenticated, (req, res) => {
  const welcomeChannel = db.prepare('SELECT value FROM settings WHERE key = ?').get('welcomeChannel')?.value || 'Not set';
  const welcomeTitle = db.prepare('SELECT value FROM settings WHERE key = ?').get('welcomeTitle')?.value || 'Welcome!';
  const welcomeDescription = db.prepare('SELECT value FROM settings WHERE key = ?').get('welcomeDescription')?.value || 'Default description';

  res.render('settings', {
    welcomeChannel,
    welcomeTitle,
    welcomeDescription,
  });
});

// Update settings route (protected by authentication middleware)
app.post('/settings', isAuthenticated, (req, res) => {
  const { welcomeChannel, welcomeTitle, welcomeDescription } = req.body;

  db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)').run('welcomeChannel', welcomeChannel);
  db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)').run('welcomeTitle', welcomeTitle);
  db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)').run('welcomeDescription', welcomeDescription);

  res.redirect('/settings');
});

// OAuth2 callback route
app.get('/callback', async (req, res) => {
  const code = req.query.code;

  if (!code) {
    return res.redirect('/');
  }

  try {
    const token = await oauth.tokenRequest({
      clientId: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
      code,
      scope: 'identify guilds',
      grantType: 'authorization_code',
      redirectUri: REDIRECT_URI,
    });

    const user = await oauth.getUser(token.access_token);
    const guilds = await oauth.getUserGuilds(token.access_token);

    // Check if the user is an admin in any of the bot's guilds
    const adminGuilds = guilds.filter(guild => (guild.permissions & 0x8) === 0x8); // 0x8 is the "Administrator" permission

    if (adminGuilds.length === 0) {
      return res.send('You are not an admin in any of the bot\'s servers.');
    }

    // Store user session
    req.session.user = user;
    req.session.adminGuilds = adminGuilds;

    res.redirect('/settings');
  } catch (err) {
    console.error(err);
    res.redirect('/');
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Dashboard is running at http://localhost:${PORT}`);
});

// Login the bot
client.login(process.env.TOKEN);