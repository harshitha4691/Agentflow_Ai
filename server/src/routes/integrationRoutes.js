import express from 'express';
const router = express.Router();

// ==========================================
// 🔌 SLACK OAUTH ROUTES
// ==========================================

// 🚀 Slack Authorization Entry Endpoint
router.get('/oauth/slack', (req, res) => {
  console.log("🔗 Initiating live Slack OAuth redirect handshake loop...");

  const SLACK_CLIENT_ID = process.env.SLACK_CLIENT_ID || "YOUR_MOCK_OR_REAL_CLIENT_ID";
  const REDIRECT_URI = encodeURIComponent("http://localhost:8080/api/integrations/oauth/slack/callback");
  const scopes = "chat:write,channels:read,incoming-webhook";

  const slackAuthUrl = `https://slack.com/oauth/v2/authorize?client_id=${SLACK_CLIENT_ID}&scope=${scopes}&redirect_uri=${REDIRECT_URI}`;
  res.redirect(slackAuthUrl);
});

// Slack Callback Handler
router.get('/oauth/slack/callback', async (req, res) => {
  const { code } = req.query;
  console.log(`📥 Received authorization code callback from Slack: ${code}`);
  
  res.redirect('http://localhost:3000/integrations?status=success');
});


// ==========================================
// 🐙 GITHUB OAUTH ROUTES
// ==========================================

// 🚀 GitHub Authorization Entry Endpoint
router.get('/oauth/github', (req, res) => {
  console.log("🔗 Initiating live GitHub OAuth redirect handshake loop...");

  const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID || "YOUR_MOCK_OR_REAL_GITHUB_CLIENT_ID";
  const REDIRECT_URI = encodeURIComponent("http://localhost:8080/api/integrations/oauth/github/callback");
  const scopes = "repo,user,workflow"; 

  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=${scopes}`;
  res.redirect(githubAuthUrl);
});

// GitHub Callback Handler
router.get('/oauth/github/callback', async (req, res) => {
  const { code } = req.query;
  console.log(`📥 Received authorization code callback from GitHub: ${code}`);
  
  res.redirect('http://localhost:3000/integrations?status=success');
});


// ==========================================
// 🔮 DISCORD OAUTH ROUTES
// ==========================================

// 🚀 Discord Authorization Entry Endpoint
router.get('/oauth/discord', (req, res) => {
  console.log("🔗 Initiating live Discord OAuth redirect handshake loop...");

  const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID || "YOUR_MOCK_OR_REAL_DISCORD_CLIENT_ID";
  const REDIRECT_URI = encodeURIComponent("http://localhost:8080/api/integrations/oauth/discord/callback");
  const scopes = "identify guilds bot webhook.incoming"; 

  const discordAuthUrl = `https://discord.com/api/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=${scopes}`;
  
  res.redirect(discordAuthUrl);
});

// Discord Callback Handler
router.get('/oauth/discord/callback', async (req, res) => {
  const { code } = req.query;
  console.log(`📥 Received authorization code callback from Discord: ${code}`);
  
  res.redirect('http://localhost:3000/integrations?status=success');
});

export default router;