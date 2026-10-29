// Community Watch - API Client with Supabase Cloud & Local Fallback

const SUPABASE_URL = 'https://zlfjzgveqzecaazbsjyu.supabase.co';
const SUPABASE_KEY = 'sb_publishable_5hTuAaZagvfVna3cJb5gfA_6XdmtbmP';

// Built-in fallback database for instant out-of-the-box experience or offline mode
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
      undeliveredCount: 0,
      autocancelledCount: 0,
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

  getSupabaseHeaders() {
    return {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json'
    };
  }

  // Fetch product & reports from Supabase cloud
  async getProductData(pid, variantPid) {
    if (!pid) return null;

    const queryIds = Array.from(new Set([pid, variantPid].filter(Boolean)));
    const filter = queryIds.length > 1
      ? `pid=in.(${queryIds.map(encodeURIComponent).join(',')})`
      : `pid=eq.${encodeURIComponent(pid)}`;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      const res = await fetch(`${SUPABASE_URL}/rest/v1/products?${filter}&select=*,reports(*)`, {
        headers: this.getSupabaseHeaders(),
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const rows = await res.json();
        if (rows && rows.length > 0) {
          const primaryProduct = rows.find(r => r.pid === pid) || rows[0];
          const allRawReports = rows.flatMap(p => p.reports || []);
          const seen = new Set();
          const uniqueReports = [];
          for (const r of allRawReports) {
            if (!seen.has(r.id)) {
              seen.add(r.id);
              uniqueReports.push(this._normalizeReport(r));
            }
          }

          return {
            pid: primaryProduct.pid,
            canonicalPid: pid,
            variantPid: variantPid,
            title: primaryProduct.title || "Flipkart Product",
            category: primaryProduct.category || "General",
            defaultSeller: primaryProduct.default_seller || "Flipkart Seller",
            stats: this._calcStats(uniqueReports),
            reports: uniqueReports.sort((a, b) => (b.helpfulCount || 0) - (a.helpfulCount || 0)),
            source: 'supabase'
          };
        }
      }
    } catch (e) {
      // Network or Supabase offline, fall back to local storage
    }

    // Local Storage / Seed Fallback
    return new Promise((resolve) => {
      chrome.storage.local.get(['custom_reports'], (result) => {
        const custom = (result.custom_reports && (result.custom_reports[pid] || result.custom_reports[variantPid])) || null;
        const seed = FALLBACK_SEEDS[pid] || FALLBACK_SEEDS[variantPid] || null;

        if (!seed && !custom) {
          return resolve({
            pid,
            variantPid,
            title: "",
            stats: this._calcStats([]),
            reports: [],
            source: 'local'
          });
        }

        const base = custom || seed;
        const allReports = [...(custom?.reports || []), ...(seed?.reports || [])];
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
          variantPid,
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

  // Submit report to Supabase
  async submitReport(pid, reportData) {
    const devId = await this.getOrCreateDeviceId();

    // 1. Try cloud submission to Supabase
    try {
      // Upsert product master
      await fetch(`${SUPABASE_URL}/rest/v1/products`, {
        method: 'POST',
        headers: {
          ...this.getSupabaseHeaders(),
          'Prefer': 'resolution=merge-duplicates'
        },
        body: JSON.stringify({
          pid,
          title: reportData.productTitle || "Flipkart Product",
          category: reportData.productCategory || "General",
          default_seller: reportData.sellerName || "Flipkart Seller"
        })
      });

      // Insert report
      const repPayload = {
        pid,
        user_alias: reportData.userAlias || "Anonymous Shopper",
        verdict: reportData.verdict || "dont_buy",
        categories: Array.isArray(reportData.categories) ? reportData.categories : [reportData.categories],
        seller_name: reportData.sellerName || "Unknown Seller",
        order_date: reportData.orderDate || null,
        title: (reportData.title || "").trim(),
        description: (reportData.description || "").trim(),
        flipkart_resolution: reportData.flipkartResolution || "denied",
        verified_purchase: Boolean(reportData.verifiedPurchase)
      };

      const res = await fetch(`${SUPABASE_URL}/rest/v1/reports`, {
        method: 'POST',
        headers: {
          ...this.getSupabaseHeaders(),
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(repPayload)
      });

      if (res.ok) {
        const inserted = await res.json();
        return this._normalizeReport(inserted[0]);
      }
    } catch (e) {
      // Cloud insert failed, fall back to local storage
    }

    // 2. Local fallback
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
          userAlias: reportData.userAlias || "Anonymous Buyer",
          verdict: reportData.verdict || "dont_buy",
          categories: Array.isArray(reportData.categories) ? reportData.categories : [reportData.categories],
          sellerName: reportData.sellerName || "Unknown Seller",
          orderDate: reportData.orderDate || null,
          title: (reportData.title || "").trim(),
          description: (reportData.description || "").trim(),
          flipkartResolution: reportData.flipkartResolution || "denied",
          verifiedPurchase: Boolean(reportData.verifiedPurchase),
          helpfulCount: 0,
          sameIssueCount: 0,
          comments: [],
          timestamp: new Date().toISOString()
        };

        custom[pid].reports.unshift(newReport);
        chrome.storage.local.set({ custom_reports: custom }, () => {
          resolve(newReport);
        });
      });
    });
  }

  // Upvote helpful count
  async voteHelpful(reportId) {
    const alreadyVoted = await new Promise((resolve) => {
      chrome.storage.local.get(['voted_reports'], (res) => {
        const list = res.voted_reports || [];
        resolve(list.includes(reportId));
      });
    });

    if (alreadyVoted) return { alreadyVoted: true };

    try {
      // Fetch current helpful_count
      const fetchRes = await fetch(`${SUPABASE_URL}/rest/v1/reports?id=eq.${encodeURIComponent(reportId)}&select=helpful_count`, {
        headers: this.getSupabaseHeaders()
      });
      if (fetchRes.ok) {
        const rows = await fetchRes.json();
        const currentCount = rows[0]?.helpful_count || 0;
        await fetch(`${SUPABASE_URL}/rest/v1/reports?id=eq.${encodeURIComponent(reportId)}`, {
          method: 'PATCH',
          headers: this.getSupabaseHeaders(),
          body: JSON.stringify({ helpful_count: currentCount + 1 })
        });
      }
    } catch (e) {}

    return new Promise((resolve) => {
      chrome.storage.local.get(['voted_reports'], (res) => {
        const list = res.voted_reports || [];
        list.push(reportId);
        chrome.storage.local.set({ voted_reports: list }, () => resolve({ success: true }));
      });
    });
  }

  // Endorse "Facing same issue"
  async endorseSameIssue(reportId) {
    const alreadyEndorsed = await new Promise((resolve) => {
      chrome.storage.local.get(['same_issue_reports'], (res) => {
        const list = res.same_issue_reports || [];
        resolve(list.includes(reportId));
      });
    });

    if (alreadyEndorsed) return { alreadyEndorsed: true };

    try {
      const fetchRes = await fetch(`${SUPABASE_URL}/rest/v1/reports?id=eq.${encodeURIComponent(reportId)}&select=same_issue_count`, {
        headers: this.getSupabaseHeaders()
      });
      if (fetchRes.ok) {
        const rows = await fetchRes.json();
        const currentCount = rows[0]?.same_issue_count || 0;
        await fetch(`${SUPABASE_URL}/rest/v1/reports?id=eq.${encodeURIComponent(reportId)}`, {
          method: 'PATCH',
          headers: this.getSupabaseHeaders(),
          body: JSON.stringify({ same_issue_count: currentCount + 1 })
        });
      }
    } catch (e) {}

    return new Promise((resolve) => {
      chrome.storage.local.get(['same_issue_reports'], (res) => {
        const list = res.same_issue_reports || [];
        list.push(reportId);
        chrome.storage.local.set({ same_issue_reports: list }, () => resolve({ success: true }));
      });
    });
  }

  // Add comment to report
  async addComment(reportId, text, author) {
    const newComment = {
      id: "cmt-" + Date.now(),
      author: author || "Anonymous Buyer",
      text: (text || "").trim(),
      timestamp: new Date().toISOString()
    };

    try {
      const fetchRes = await fetch(`${SUPABASE_URL}/rest/v1/reports?id=eq.${encodeURIComponent(reportId)}&select=comments`, {
        headers: this.getSupabaseHeaders()
      });
      if (fetchRes.ok) {
        const rows = await fetchRes.json();
        const currentComments = Array.isArray(rows[0]?.comments) ? rows[0].comments : [];
        currentComments.push(newComment);
        await fetch(`${SUPABASE_URL}/rest/v1/reports?id=eq.${encodeURIComponent(reportId)}`, {
          method: 'PATCH',
          headers: this.getSupabaseHeaders(),
          body: JSON.stringify({ comments: currentComments })
        });
        return newComment;
      }
    } catch (e) {}

    return newComment;
  }

  // Get trending products from cloud
  async getTrending() {
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/products?select=*,reports(*)&limit=6`, {
        headers: this.getSupabaseHeaders()
      });
      if (res.ok) {
        const rows = await res.json();
        if (rows && rows.length > 0) {
          return rows.map(p => {
            const normalized = (p.reports || []).map(r => this._normalizeReport(r));
            return {
              pid: p.pid,
              title: p.title,
              stats: this._calcStats(normalized),
              recentReport: normalized[0] || null
            };
          });
        }
      }
    } catch (e) {}

    return Object.values(FALLBACK_SEEDS).map(p => ({
      pid: p.pid,
      title: p.title,
      stats: p.stats,
      recentReport: p.reports[0] || null
    }));
  }

  _normalizeReport(r) {
    return {
      id: r.id,
      pid: r.pid,
      userAlias: r.user_alias || "Anonymous Buyer",
      verdict: r.verdict || "dont_buy",
      categories: r.categories || [],
      sellerName: r.seller_name || "",
      orderDate: r.order_date || null,
      title: r.title || "",
      description: r.description || "",
      flipkartResolution: r.flipkart_resolution || "denied",
      verifiedPurchase: Boolean(r.verified_purchase),
      helpfulCount: r.helpful_count || 0,
      sameIssueCount: r.same_issue_count || 0,
      comments: Array.isArray(r.comments) ? r.comments : [],
      timestamp: r.created_at || new Date().toISOString()
    };
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

if (typeof window !== 'undefined') {
  window.TrustRadarAPI = new TrustRadarAPI();
}
