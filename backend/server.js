const express = require('express');
const cors = require('cors');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 5050;

app.use(cors());
app.use(express.json());

// In-Memory Rate Limiter & Duplicate Prevention
const rateLimitBuckets = new Map();
const votedPairs = new Set(); // Stores "deviceId:reportId:action"

function rateLimiter({ maxRequests, windowMs, message }) {
  return (req, res, next) => {
    const ip = req.ip || req.connection?.remoteAddress || 'unknown_ip';
    const deviceId = req.headers['x-device-id'] || 'no_device';
    const key = `${ip}:${deviceId}`;
    const now = Date.now();

    if (!rateLimitBuckets.has(key)) {
      rateLimitBuckets.set(key, []);
    }

    const timestamps = rateLimitBuckets.get(key).filter(t => now - t < windowMs);
    timestamps.push(now);
    rateLimitBuckets.set(key, timestamps);

    if (timestamps.length > maxRequests) {
      return res.status(429).json({
        error: message || 'Too many requests. Please slow down.',
        retryAfterMs: Math.max(0, windowMs - (now - timestamps[0]))
      });
    }

    next();
  };
}

// Request logging
app.use((req, res, next) => {
  const devId = req.headers['x-device-id'] ? ` [Dev:${req.headers['x-device-id'].slice(0, 8)}]` : '';
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}${devId}`);
  next();
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'Flipkart Trust Radar API'
  });
});

// Get product details & reports
app.get('/api/products/:pid', (req, res) => {
  const { pid } = req.params;
  if (!pid) {
    return res.status(400).json({ error: 'PID is required' });
  }
  const data = db.getProduct(pid);
  res.json(data);
});

// Submit a new anonymous report (Rate limited: max 5 per 15 mins)
app.post(
  '/api/products/:pid/reports',
  rateLimiter({ maxRequests: 5, windowMs: 15 * 60 * 1000, message: 'Report limit reached (max 5 submissions per 15 minutes).' }),
  (req, res) => {
    const { pid } = req.params;
    const {
      verdict,
      categories,
      sellerName,
      orderDate,
      title,
      description,
      flipkartResolution,
      verifiedPurchase,
      userAlias,
      productTitle,
      productCategory
    } = req.body;

    if (!description || description.trim().length < 5) {
      return res.status(400).json({ error: 'Description must be at least 5 characters' });
    }

    const report = db.addReport(pid, {
      verdict: verdict || 'dont_buy',
      categories: categories || ['quality_defect'],
      sellerName: sellerName || 'Unknown Seller',
      orderDate: orderDate || null,
      title: title || '',
      description,
      flipkartResolution: flipkartResolution || 'denied',
      verifiedPurchase: Boolean(verifiedPurchase),
      userAlias: userAlias || '',
      productTitle,
      productCategory
    });

    const updatedProduct = db.getProduct(pid);

    res.status(201).json({
      message: 'Report submitted anonymously',
      report,
      updatedStats: updatedProduct.stats
    });
  }
);

// Upvote / helpful report (Deduplicated per device & Rate limited)
app.post(
  '/api/reports/:id/vote',
  rateLimiter({ maxRequests: 30, windowMs: 60 * 1000, message: 'Too many votes. Please wait.' }),
  (req, res) => {
    const { id } = req.params;
    const deviceId = req.headers['x-device-id'] || 'no_device';
    const voteKey = `${deviceId}:${id}:vote`;

    if (deviceId !== 'no_device' && votedPairs.has(voteKey)) {
      return res.status(409).json({ error: 'Already upvoted from this device.' });
    }

    const delta = req.body.delta !== undefined ? req.body.delta : 1;
    const report = db.voteReport(id, delta);
    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }

    if (deviceId !== 'no_device') {
      votedPairs.add(voteKey);
    }
    res.json({ success: true, helpfulCount: report.helpfulCount });
  }
);

// Facing same issue endorsement (Deduplicated per device & Rate limited)
app.post(
  '/api/reports/:id/same-issue',
  rateLimiter({ maxRequests: 30, windowMs: 60 * 1000, message: 'Too many endorsements. Please wait.' }),
  (req, res) => {
    const { id } = req.params;
    const deviceId = req.headers['x-device-id'] || 'no_device';
    const sameKey = `${deviceId}:${id}:same`;

    if (deviceId !== 'no_device' && votedPairs.has(sameKey)) {
      return res.status(409).json({ error: 'Already endorsed from this device.' });
    }

    const report = db.sameIssueReport(id);
    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }

    if (deviceId !== 'no_device') {
      votedPairs.add(sameKey);
    }
    res.json({ success: true, sameIssueCount: report.sameIssueCount });
  }
);

// Add comment to report (Rate limited: max 8 comments per 10 mins)
app.post(
  '/api/reports/:id/comments',
  rateLimiter({ maxRequests: 8, windowMs: 10 * 60 * 1000, message: 'Comment limit reached. Please wait before posting again.' }),
  (req, res) => {
    const { id } = req.params;
    const { author, text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ error: 'Comment text is required' });
    }
    const comment = db.addComment(id, { author, text });
    if (!comment) {
      return res.status(404).json({ error: 'Report not found' });
    }
    res.status(201).json({ success: true, comment });
  }
);

// Get trending / heavily reported products
app.get('/api/trending', (req, res) => {
  const trending = db.getTrending(8);
  res.json(trending);
});

// Search products
app.get('/api/search', (req, res) => {
  const { q } = req.query;
  const results = db.search(q);
  res.json(results);
});

app.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(`Flipkart Trust Radar Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
  console.log(`Trending products: http://localhost:${PORT}/api/trending`);
  console.log(`===============================================`);
});
