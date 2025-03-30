# NexaBot

NexaBot is a powerful, feature-rich Discord bot designed to enhance server engagement, moderation, and utility. It combines advanced AI-powered toxicity detection, gamification, and moderation tools to create the ultimate "one-stop shop" for Discord servers.

---

## 🚀 Features

### **1. Gamification and Engagement**
- **Customizable XP System**:
  - Server admins can configure XP gain rates for positive and negative actions.
  - Users level up based on XP, with customizable level-up messages.
- **Achievements and Badges**:
  - Tracks user milestones (e.g., sending 100 messages).
  - Awards badges for achievements.
- **Leaderboards**:
  - Displays the top 10 users by XP in the server.
- **Daily Challenges**:
  - Encourages engagement with daily tasks (e.g., send 10 messages).
  - Rewards users with XP for completing challenges.

### **2. Advanced Moderation**
- **Toxicity Detection**:
  - Uses AI (`unitary/toxic-bert`) to detect toxic messages.
  - Sends warnings to users and logs offenses in a mod-log channel.
  - Auto-mutes users after repeated offenses.
- **Spam Detection**:
  - Detects and auto-mutes users who send too many messages in a short time.
- **Link Moderation**:
  - Limits the number of links a user can send in a single message.
  - Warns users and logs offenses for excessive links.
- **Admin Commands**:
  - Mute, kick, ban, and warn users with slash commands.
  - Set toxicity thresholds and warning messages.

### **3. Event Management**
- **Create Event**:
  - Command: `/create_event`
  - Admins can create events by specifying a name, date, time, and optional description.
  - Events are stored in a dictionary (`events`) for each guild.
- **List Events**:
  - Command: `/list_events`
  - Displays all upcoming events for the server in a formatted list.
- **Delete Event**:
  - Command: `/delete_event`
  - Admins can delete an event by specifying its number from the event list.
- **Send Reminder**:
  - Command: `/remind_event`
  - Sends a reminder message for a specific event to the current channel.

### **4. Utility**
- **Latency Check**:
  - Slash command to check the bot's latency (`/ping`).
- **XP Management**:
  - Admins can set a user's XP manually (`/set_xp`).
- **Level Check**:
  - Users can check their current level and XP (`/level`).

---

## 📖 Commands

### **General Commands**
| Command            | Description                          |
|--------------------|--------------------------------------|
| `/ping`           | Check the bot's latency.            |
| `/level`          | Check a user's level and XP.        |
| `/leaderboard`    | View the XP leaderboard.            |
| `/daily_challenge` | View and complete daily challenges. |
| `/list_events`    | View all upcoming events.           |

### **Admin Commands**
| Command         | Description                          |
|-----------------|--------------------------------------|
| `/set_xp`       | Set a user's XP manually.           |
| `/set_xp_rates` | Set XP gain rates for actions.      |
| `/set_threshold`| Set the toxicity detection threshold.|
| `/set_warning`  | Set the warning message for toxicity.|
| `/mute`         | Mute a user for a specified duration.|
| `/kick`         | Kick a user from the server.        |
| `/ban`          | Ban a user from the server.         |
| `/warn`         | Warn a user and log their offense.  |
| `/create_event` | Create a new event.                 |
| `/delete_event` | Delete an event by its number.      |
| `/remind_event` | Send a reminder for an event.       |

---

## 🛠️ Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/NexaBot.git
   cd NexaBot
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Set up your `.env` file:
   - Create a `.env` file in the root directory.
   - Add your Discord bot token:
     ```
     DISCORD_TOKEN=your-bot-token
     ```

4. Run the bot:
   ```bash
   python bot.py
   ```

---

## 🧠 How It Works

### **Toxicity Detection**
- The bot uses the `unitary/toxic-bert` model to analyze messages for toxicity.
- If a message exceeds the configured toxicity threshold:
  - The user is warned with a customizable message.
  - Offenses are logged, and repeated offenses result in auto-muting.

### **XP and Leveling**
- Users earn XP for positive actions and lose XP for negative actions.
- Leveling up is based on XP, with customizable level-up messages.
- Admins can manually adjust XP and configure XP gain rates.

### **Achievements and Challenges**
- Tracks user activity and awards badges for milestones.
- Daily challenges encourage engagement and reward users with XP.

### **Event Management**
- Admins can create, list, delete, and send reminders for events.
- Events are stored per guild and displayed in a formatted list.

---

## 🛡️ Moderation Tools
- Auto-moderation for spam, links, and toxic messages.
- Admin commands for muting, kicking, banning, and warning users.
- Customizable thresholds and warning messages for toxicity d
