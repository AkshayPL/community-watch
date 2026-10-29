// Flipkart Trust Radar - API Client with Hybrid Offline / Local / Remote Backend Support

const API_BASE_URL = 'http://localhost:5050/api';

// Built-in fallback database for instant out-of-the-box experience without running server
const FALLBACK_SEEDS = {
  "itm87ffbf2a0bf08": {
    pid: "itm87ffbf2a0bf08",
    title: "OnePlus Nord Buds 3r TWS Earbud, 10min charge for 8hr Music, 3D Audio",
    category: "True Wireless",
    defaultSeller: "RetailNet",
    stats: {
      totalReports: 3,
      verdict: "dont_buy",
      dontBuyVotes: 2,
      cautionVotes: 1,
      buyVotes: 0,
      dontBuyPercent: 67,
      cautionPercent: 33,
      buyPercent: 0,
      refundDeniedCount: 2,
      scamCount: 1,
      wrongItemCount: 0,
      qualityCount: 1,
      deliveryCount: 1,
      categoryBreakdown: {
        refund_denied: 2,
        scam_fake: 1,
        quality_defect: 1,
        delivery_issue: 1
      }
    },
    reports: [
      {
        id: "rep-oneplus-01",
        pid: "itm87ffbf2a0bf08",
        userAlias: "Audiophile_Delhi",
        verdict: "dont_buy",
        categories: ["refund_denied", "quality_defect"],
        sellerName: "RetailNet",
        title: "Left earbud stopped charging after 2 days - Flipkart refused replacement",
        description: "Left earbud completely dead after second charge. Raised replacement request on day 3. Technician cancelled pickup without visiting, marking 'customer not reachable'. Flipkart customer care closed the replacement window and told me to visit OnePlus service center 45 km away!",
        flipkartResolution: "denied",
        verifiedPurchase: true,
        helpfulCount: 58,
        sameIssueCount: 23,
        comments: [
          {
            id: "cmt-1",
            author: "Rahul S.",
            text: "Same thing happened with RetailNet last week. After 4 calls to escalation desk, they finally scheduled a brand technician inspection.",
            timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
          }
        ],
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: "rep-oneplus-02",
        pid: "itm87ffbf2a0bf08",
        userAlias: "Anonymous Buyer #604",
        verdict: "dont_buy",
        categories: ["scam_fake", "refund_denied"],
        sellerName: "TrueAudioDeals",
        title: "Received opened box with serial number scratched out",
        description: "Box seal was tampered with and re-taped. OnePlus app 'HeyMelody' refused to pair or recognize the earbuds, indicating they are either duplicate replicas or stolen refurbished units. Flipkart customer support refused refund stating 'Customer received outer package in intact condition'.",
        flipkartResolution: "denied",
        verifiedPurchase: true,
        helpfulCount: 42,
        timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: "rep-oneplus-03",
        pid: "itm87ffbf2a0bf08",
        userAlias: "Gamer_Naveen",
        verdict: "caution",
        categories: ["delivery_issue"],
        sellerName: "RetailNet",
        title: "Delivery guy insisted on OTP before opening box",
        description: "Open Box Delivery was promised on Flipkart, but delivery agent refused to let me open the box without giving the delivery OTP first. Thankfully the buds worked inside, but don't fall for OTP pressure before seeing inside!",
        flipkartResolution: "resolved",
        verifiedPurchase: false,
        helpfulCount: 31,
        timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
      }
    ]
  },
  "MOBFWBYZ8GU7HH78": {
    pid: "MOBFWBYZ8GU7HH78",
    title: "Apple iPhone 14 (Midnight, 128 GB)",
    category: "Mobiles",
    defaultSeller: "RetailNetSuperDeal",
    stats: {
      totalReports: 3,
      verdict: "dont_buy",
      dontBuyVotes: 2,
      cautionVotes: 1,
      buyVotes: 0,
      dontBuyPercent: 67,
      cautionPercent: 33,
      buyPercent: 0,
      refundDeniedCount: 2,
      scamCount: 1,
      wrongItemCount: 1,
      qualityCount: 0,
      deliveryCount: 1,
      categoryBreakdown: {
        wrong_item: 1,
        refund_denied: 2,
        scam_fake: 1,
        delivery_issue: 1
      }
    },
    reports: [
      {
        id: "rep-001",
        pid: "MOBFWBYZ8GU7HH78",
        userAlias: "Anonymous Buyer (Bengaluru)",
        verdict: "dont_buy",
        categories: ["wrong_item", "refund_denied"],
        sellerName: "SuperComNet Sellers",
        title: "Delivered counterfeit handset & Flipkart rejected refund",
        description: "Opted for open box delivery. The delivery person forced me to share the OTP first before opening. When we opened the box, there was an old damaged Android phone instead of iPhone 14. Delivery guy ran away. Flipkart refused replacement claiming OTP was shared voluntarily!",
        flipkartResolution: "denied",
        verifiedPurchase: true,
        helpfulCount: 47,
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: "rep-002",
        pid: "MOBFWBYZ8GU7HH78",
        userAlias: "Disappointed Shopper #104",
        verdict: "dont_buy",
        categories: ["scam_fake", "refund_denied"],
        sellerName: "RetailNetSuperDeal",
        title: "Refurbished unit sold as brand new, warranty void",
        description: "Phone had micro-scratches on the lens and Apple warranty status showed it was activated 6 months prior. Flipkart denied return saying technical verification failed.",
        flipkartResolution: "denied",
        verifiedPurchase: true,
        helpfulCount: 32,
        timestamp: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString()
      }
    ]
  },
  "PENF62H5Q8J9Z7A1": {
    pid: "PENF62H5Q8J9Z7A1",
    title: "SanDisk Ultra 128 GB MicroSDXC Class 10 Memory Card",
    category: "Storage",
    defaultSeller: "TechGadgetsStore",
    stats: {
      totalReports: 2,
      verdict: "dont_buy",
      dontBuyVotes: 2,
      cautionVotes: 0,
      buyVotes: 0,
      dontBuyPercent: 100,
      cautionPercent: 0,
      buyPercent: 0,
      refundDeniedCount: 1,
      scamCount: 2,
      wrongItemCount: 0,
      qualityCount: 1,
      deliveryCount: 0,
      categoryBreakdown: { scam_fake: 2, refund_denied: 1, quality_defect: 1 }
    },
    reports: [
      {
        id: "rep-101",
        pid: "PENF62H5Q8J9Z7A1",
        userAlias: "TechieShopper #31",
        verdict: "dont_buy",
        categories: ["scam_fake", "refund_denied"],
        sellerName: "TechGadgetsStore",
        title: "100% Counterfeit: Only 16GB actual capacity spoofed firmware",
        description: "Ran H2testw on this card. It is a hacked 16GB micro SD card programmed to display 128GB. After 16GB, all files become permanently corrupted! Flipkart customer support refused refund saying memory cards are replacement only.",
        flipkartResolution: "denied",
        verifiedPurchase: true,
        helpfulCount: 89,
        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
      }
    ]
  }
};

class TrustRadarAPI {
  async getOrCreateDeviceId() {
    return new Promise((resolve) => {
      chrome.storage.local.get(['client_device_id'], (res) => {
        if (res.client_device_id) {
          resolve(res.client_device_id);
        } else {
          const newId = (typeof crypto !== 'undefined' && crypto.randomUUID) 
            ? crypto.randomUUID() 
            : 'dev-' + Date.now() + '-' + Math.random().toString(36).substring(2, 9);
          chrome.storage.local.set({ client_device_id: newId }, () => resolve(newId));
        }
      });
    });
  }

  getHardwareFingerprint() {
    try {
      const gl = document.createElement('canvas').getContext('webgl');
      const debugInfo = gl?.getExtension('WEBGL_debug_renderer_info');
      const gpu = debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : 'default_gpu';
      const screenInfo = `${screen.width}x${screen.height}x${screen.colorDepth}`;
      const cores = navigator.hardwareConcurrency || 4;
      return btoa(`${gpu}|${screenInfo}|${cores}`).substring(0, 32);
    } catch (e) {
      return 'generic_fingerprint';
    }
  }

  async getRequestHeaders() {
    const deviceId = await this.getOrCreateDeviceId();
    const fp = this.getHardwareFingerprint();
    return {
      'Content-Type': 'application/json',
      'X-Device-Id': deviceId,
      'X-Hardware-Fingerprint': fp
    };
  }

  async initStorage() {
    return new Promise((resolve) => {
      chrome.storage.local.get(['custom_reports', 'voted_reports'], (result) => {
        if (!result.custom_reports) {
          chrome.storage.local.set({ custom_reports: {}, voted_reports: [] }, resolve);
        } else {
          resolve();
        }
      });
    });
  }

  async getProductData(pid) {
    if (!pid) return null;

    // Try live backend first
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1200);
      const res = await fetch(`${API_BASE_URL}/products/${encodeURIComponent(pid)}`, {
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      if (res.ok) {
        const data = await res.json();
        if (data && (data.reports.length > 0 || data.title)) {
          return { ...data, source: 'backend' };
        }
      }
    } catch (e) {
      // Backend not running, fallback to local storage
    }

    // Check local Chrome storage + Fallback seeds
    return new Promise((resolve) => {
      chrome.storage.local.get(['custom_reports'], (result) => {
        const custom = (result.custom_reports && result.custom_reports[pid]) || null;
        const seed = FALLBACK_SEEDS[pid] || null;

        if (!seed && !custom) {
          return resolve({
            pid,
            title: "",
            stats: {
              totalReports: 0,
              verdict: "safe",
              dontBuyVotes: 0,
              cautionVotes: 0,
              buyVotes: 0,
              dontBuyPercent: 0,
              cautionPercent: 0,
              buyPercent: 0,
              refundDeniedCount: 0,
              scamCount: 0,
              wrongItemCount: 0,
              qualityCount: 0,
              deliveryCount: 0,
              categoryBreakdown: {}
            },
            reports: [],
            source: 'local'
          });
        }

        const base = custom || seed;
        const allReports = [...(custom?.reports || []), ...(seed?.reports || [])];
        
        // Deduplicate reports by id
        const uniqueReports = [];
        const seenIds = new Set();
        for (const r of allReports) {
          if (!seenIds.has(r.id)) {
            seenIds.add(r.id);
            uniqueReports.push(r);
          }
        }

        resolve({
          pid,
          title: base.title || "Flipkart Product",
          category: base.category || "General",
          defaultSeller: base.defaultSeller || "Flipkart Seller",
          stats: this._calcStats(uniqueReports),
          reports: uniqueReports.sort((a, b) => (b.helpfulCount || 0) - (a.helpfulCount || 0)),
          source: 'local'
        });
      });
    });
  }

  async submitReport(pid, reportData) {
    // 1. Try sending to backend
    try {
      const headers = await this.getRequestHeaders();
      const res = await fetch(`${API_BASE_URL}/products/${encodeURIComponent(pid)}/reports`, {
        method: 'POST',
        headers,
        body: JSON.stringify(reportData)
      });
      if (res.ok) {
        const json = await res.json();
        return json.report;
      }
    } catch (e) {
      // Backend offline, save to local storage
    }

    // 2. Save locally into chrome.storage.local
    return new Promise((resolve) => {
      chrome.storage.local.get(['custom_reports'], (result) => {
        const custom = result.custom_reports || {};
        if (!custom[pid]) {
          custom[pid] = {
            pid,
            title: reportData.productTitle || "Flipkart Product",
            category: reportData.productCategory || "General",
            defaultSeller: reportData.sellerName || "Flipkart Seller",
            reports: []
          };
        }

        const newReport = {
          id: "rep-local-" + Date.now(),
          pid,
          userAlias: reportData.userAlias || "Anonymous Shopper #" + Math.floor(100 + Math.random() * 900),
          verdict: reportData.verdict || "dont_buy",
          categories: Array.isArray(reportData.categories) ? reportData.categories : [reportData.categories],
          sellerName: reportData.sellerName || "Unknown Seller",
          title: (reportData.title || "").trim(),
          description: (reportData.description || "").trim(),
          flipkartResolution: reportData.flipkartResolution || "denied",
          verifiedPurchase: Boolean(reportData.verifiedPurchase),
          helpfulCount: 0,
          timestamp: new Date().toISOString()
        };

        custom[pid].reports.unshift(newReport);
        chrome.storage.local.set({ custom_reports: custom }, () => {
          resolve(newReport);
        });
      });
    });
  }

  async voteHelpful(reportId) {
    // Check if already voted
    const voted = await new Promise((resolve) => {
      chrome.storage.local.get(['voted_reports'], (res) => {
        const list = res.voted_reports || [];
        resolve(list.includes(reportId));
      });
    });

    if (voted) return { alreadyVoted: true };

    try {
      const headers = await this.getRequestHeaders();
      await fetch(`${API_BASE_URL}/reports/${encodeURIComponent(reportId)}/vote`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ delta: 1 })
      });
    } catch (e) {
      // Ignore
    }

    // Mark as voted in local storage
    return new Promise((resolve) => {
      chrome.storage.local.get(['voted_reports'], (res) => {
        const list = res.voted_reports || [];
        list.push(reportId);
        chrome.storage.local.set({ voted_reports: list }, () => {
          resolve({ success: true });
        });
      });
    });
  }

  async endorseSameIssue(reportId) {
    const alreadyEndorsed = await new Promise((resolve) => {
      chrome.storage.local.get(['same_issue_reports'], (res) => {
        const list = res.same_issue_reports || [];
        resolve(list.includes(reportId));
      });
    });

    if (alreadyEndorsed) return { alreadyEndorsed: true };

    try {
      const headers = await this.getRequestHeaders();
      await fetch(`${API_BASE_URL}/reports/${encodeURIComponent(reportId)}/same-issue`, {
        method: 'POST',
        headers
      });
    } catch (e) {}

    return new Promise((resolve) => {
      chrome.storage.local.get(['same_issue_reports', 'custom_reports'], (res) => {
        const list = res.same_issue_reports || [];
        list.push(reportId);
        
        // Update local report count if cached
        const custom = res.custom_reports || {};
        for (const pid in custom) {
          const rep = custom[pid].reports?.find(r => r.id === reportId);
          if (rep) {
            rep.sameIssueCount = (rep.sameIssueCount || 0) + 1;
          }
        }

        chrome.storage.local.set({ same_issue_reports: list, custom_reports: custom }, () => {
          resolve({ success: true });
        });
      });
    });
  }

  async addComment(reportId, text, author) {
    const commentPayload = {
      author: author || "Anonymous Shopper",
      text: (text || "").trim()
    };

    try {
      const headers = await this.getRequestHeaders();
      const res = await fetch(`${API_BASE_URL}/reports/${encodeURIComponent(reportId)}/comments`, {
        method: 'POST',
        headers,
        body: JSON.stringify(commentPayload)
      });
      if (res.ok) {
        const json = await res.json();
        return json.comment;
      }
    } catch (e) {}

    // Fallback: save to chrome.storage.local
    return new Promise((resolve) => {
      chrome.storage.local.get(['custom_reports'], (res) => {
        const custom = res.custom_reports || {};
        const newComment = {
          id: "cmt-" + Date.now(),
          author: commentPayload.author,
          text: commentPayload.text,
          timestamp: new Date().toISOString()
        };

        for (const pid in custom) {
          const rep = custom[pid].reports?.find(r => r.id === reportId);
          if (rep) {
            if (!rep.comments) rep.comments = [];
            rep.comments.push(newComment);
          }
        }

        chrome.storage.local.set({ custom_reports: custom }, () => {
          resolve(newComment);
        });
      });
    });
  }

  async getTrending() {
    try {
      const res = await fetch(`${API_BASE_URL}/trending`);
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {}

    // Fallback list
    return Object.values(FALLBACK_SEEDS).map(p => ({
      pid: p.pid,
      title: p.title,
      stats: p.stats,
      recentReport: p.reports[0] || null
    }));
  }

  _calcStats(reports) {
    const total = reports.length;
    if (total === 0) {
      return {
        totalReports: 0,
        verdict: "safe",
        dontBuyVotes: 0,
        cautionVotes: 0,
        buyVotes: 0,
        dontBuyPercent: 0,
        cautionPercent: 0,
        buyPercent: 0,
        refundDeniedCount: 0,
        undeliveredCount: 0,
        autocancelledCount: 0,
        scamCount: 0,
        wrongItemCount: 0,
        qualityCount: 0,
        deliveryCount: 0,
        categoryBreakdown: {}
      };
    }

    let dontBuyVotes = 0;
    let cautionVotes = 0;
    let buyVotes = 0;
    let refundDeniedCount = 0;
    let undeliveredCount = 0;
    let autocancelledCount = 0;
    let scamCount = 0;
    let wrongItemCount = 0;
    let qualityCount = 0;
    let deliveryCount = 0;
    const categoryBreakdown = {};

    reports.forEach(r => {
      if (r.verdict === 'dont_buy') dontBuyVotes++;
      else if (r.verdict === 'caution') cautionVotes++;
      else buyVotes++;

      (r.categories || []).forEach(cat => {
        categoryBreakdown[cat] = (categoryBreakdown[cat] || 0) + 1;
        if (cat === 'refund_denied') refundDeniedCount++;
        if (cat === 'undelivered') undeliveredCount++;
        if (cat === 'autocancelled') autocancelledCount++;
        if (cat === 'scam_fake') scamCount++;
        if (cat === 'wrong_item') wrongItemCount++;
        if (cat === 'quality_defect') qualityCount++;
        if (cat === 'delivery_issue') deliveryCount++;
      });
    });

    const dontBuyPercent = Math.round((dontBuyVotes / total) * 100);
    const cautionPercent = Math.round((cautionVotes / total) * 100);
    const buyPercent = Math.round((buyVotes / total) * 100);

    let verdict = "safe";
    if (dontBuyPercent >= 50 || (scamCount + refundDeniedCount + undeliveredCount >= 2)) {
      verdict = "dont_buy";
    } else if (dontBuyPercent >= 25 || cautionPercent >= 35 || total > 0) {
      verdict = "caution";
    }

    return {
      totalReports: total,
      verdict,
      dontBuyVotes,
      cautionVotes,
      buyVotes,
      dontBuyPercent,
      cautionPercent,
      buyPercent,
      refundDeniedCount,
      undeliveredCount,
      autocancelledCount,
      scamCount,
      wrongItemCount,
      qualityCount,
      deliveryCount,
      categoryBreakdown
    };
  }
}

// Export for extension scripts
if (typeof window !== 'undefined') {
  window.TrustRadarAPI = new TrustRadarAPI();
}
