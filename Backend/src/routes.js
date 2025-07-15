const express = require('express');
const router = express.Router();
const { URL, Click } = require('./models');
const { logEvent } = require('./logger');
const { Op } = require('sequelize');


function generateShortcode(length = 6) {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}


router.post('/shorturls', async (req, res) => {
  const { url, validity, shortcode } = req.body;
  if (!url) {
    await logEvent('backend', 'warn', 'route', 'Missing url in POST /shorturls');
    return res.status(400).json({ error: 'url is required' });
  }
  let code = shortcode || generateShortcode();
  let expiry = new Date(Date.now() + 1000 * 60 * (validity || 30));
  try {
   
    if (await URL.findOne({ where: { shortcode: code } })) {
      await logEvent('backend', 'warn', 'route', `Shortcode conflict: ${code}`);
      return res.status(409).json({ error: 'Shortcode already exists' });
    }
    const urlObj = await URL.create({ original_url: url, shortcode: code, expiry });
    await logEvent('backend', 'info', 'route', `Short URL created: ${code}`);
    res.json({ shortLink: `${req.protocol}://${req.get('host')}/${code}`, expiry });
  } catch (err) {
    await logEvent('backend', 'error', 'route', `Error creating short URL: ${err.message}`);
    res.status(500).json({ error: 'Internal server error' });
  }
});


router.get('/shorturls/:shortcode', async (req, res) => {
  const { shortcode } = req.params;
  try {
    const urlObj = await URL.findOne({ where: { shortcode }, include: Click });
    if (!urlObj) {
      await logEvent('backend', 'warn', 'route', `Shortcode not found: ${shortcode}`);
      return res.status(404).json({ error: 'Shortcode not found' });
    }
    const clickHistory = urlObj.Clicks.map(click => ({
      timestamp: click.timestamp,
      referrer: click.referrer,
      location: click.location,
    }));
    await logEvent('backend', 'info', 'route', `Stats retrieved for shortcode: ${shortcode}`);
    res.json({
      original_url: urlObj.original_url,
      created_at: urlObj.created_at,
      expires_at: urlObj.expiry,
      click_count: urlObj.Clicks.length,
      click_history: clickHistory,
    });
  } catch (err) {
    await logEvent('backend', 'error', 'route', `Error getting stats: ${err.message}`);
    res.status(500).json({ error: 'Internal server error' });
  }
});


router.get('/:shortcode', async (req, res) => {
  const { shortcode } = req.params;
  try {
    const urlObj = await URL.findOne({ where: { shortcode } });
    if (!urlObj) {
      await logEvent('backend', 'warn', 'route', `Shortcode not found for redirect: ${shortcode}`);
      return res.status(404).json({ error: 'Shortcode not found' });
    }
    if (new Date() > urlObj.expiry) {
      await logEvent('backend', 'warn', 'route', `Shortcode expired: ${shortcode}`);
      return res.status(410).json({ error: 'Shortcode expired' });
    }

    await Click.create({
      urlId: urlObj.id,
      referrer: req.get('referer') || '',
      location: 'India',
    });
    await logEvent('backend', 'info', 'route', `Redirected: ${shortcode}`);
    res.redirect(urlObj.original_url);
  } catch (err) {
    await logEvent('backend', 'error', 'route', `Error on redirect: ${err.message}`);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router; 