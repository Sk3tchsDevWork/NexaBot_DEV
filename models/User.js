const db = require('../database'); // Adjust the path as needed

class User {
  constructor(userId) {
    this.userId = userId;
    const userRecord = db.prepare('SELECT * FROM users WHERE userId = ?').get(userId);
    if (userRecord) {
      this.lastClaim = userRecord.lastClaim;
      this.streak = userRecord.streak;
      this.totalRewards = userRecord.totalRewards;
    } else {
      // Default values if user not found
      this.lastClaim = 0;
      this.streak = 0;
      this.totalRewards = 0;
    }
  }

  save() {
    // Check if user exists
    const existingUser = db.prepare('SELECT * FROM users WHERE userId = ?').get(this.userId);

    if (existingUser) {
      // Update user if exists
      db.prepare('UPDATE users SET lastClaim = ?, streak = ?, totalRewards = ? WHERE userId = ?')
        .run(this.lastClaim, this.streak, this.totalRewards, this.userId);
    } else {
      // Insert new user
      db.prepare('INSERT INTO users (userId, lastClaim, streak, totalRewards) VALUES (?, ?, ?, ?)')
        .run(this.userId, this.lastClaim, this.streak, this.totalRewards);
    }
  }

  // Other user-related functions can be added here
}

module.exports = User;