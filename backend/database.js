const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, 'data.json');

const INITIAL_DATA = {
  products: {
    "itm87ffbf2a0bf08": {
      pid: "itm87ffbf2a0bf08",
      title: "OnePlus Nord Buds 3r TWS Earbud, 10min charge for 8hr Music, 3D Audio",
      category: "True Wireless",
      defaultSeller: "RetailNet",
      reports: [
        {
          id: "rep-oneplus-01",
          pid: "itm87ffbf2a0bf08",
          userAlias: "Audiophile_Delhi",
          verdict: "dont_buy",
          categories: ["refund_denied", "quality_defect"],
          sellerName: "RetailNet",
          title: "Left earbud stopped charging after 2 days - Flipkart refused replacement",
          description: "Left earbud completely dead after second charge. Raised replacement request on day 3. Technician called and cancelled pickup without visiting, marking 'customer not reachable'. Flipkart customer care closed the replacement window and told me to visit OnePlus service center 45 km away!",
          flipkartResolution: "denied",
          verifiedPurchase: true,
          helpfulCount: 58,
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
      reports: [
        {
          id: "rep-001",
          pid: "MOBFWBYZ8GU7HH78",
          userAlias: "Anonymous Buyer (Bengaluru)",
          verdict: "dont_buy", // dont_buy | caution | buy
          categories: ["wrong_item", "refund_denied"],
          sellerName: "SuperComNet Sellers",
          title: "Delivered counterfeit handset & Flipkart rejected refund",
          description: "Opted for open box delivery. The delivery person forced me to share the OTP first before opening. When we opened the box, there was an old damaged Android phone instead of iPhone 14. Delivery guy ran away. Flipkart refused replacement claiming OTP was shared voluntarily!",
          flipkartResolution: "denied", // denied | pending | resolved
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
          description: "Phone had micro-scratches on the lens and Apple warranty status on checkcoverage.apple.com showed it was activated 6 months prior in Dubai! Flipkart denied return saying technical verification failed. Had to file in National Consumer Helpline.",
          flipkartResolution: "denied",
          verifiedPurchase: true,
          helpfulCount: 32,
          timestamp: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: "rep-003",
          pid: "MOBFWBYZ8GU7HH78",
          userAlias: "Anonymous #892",
          verdict: "caution",
          categories: ["delivery_issue"],
          sellerName: "TrueComRetail",
          title: "Fake delivery attempt SMS; delivered 5 days late",
          description: "Got message 'Customer was not available' while I was sitting at home waiting all day. Took 5 days and multiple escalations on Twitter/X to finally get it.",
          flipkartResolution: "resolved",
          verifiedPurchase: false,
          helpfulCount: 14,
          timestamp: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()
        }
      ]
    },
    "PENF62H5Q8J9Z7A1": {
      pid: "PENF62H5Q8J9Z7A1",
      title: "SanDisk Ultra 128 GB MicroSDXC Class 10 Memory Card",
      category: "Storage",
      defaultSeller: "TechGadgetsStore",
      reports: [
        {
          id: "rep-101",
          pid: "PENF62H5Q8J9Z7A1",
          userAlias: "TechieShopper #31",
          verdict: "dont_buy",
          categories: ["scam_fake", "refund_denied"],
          sellerName: "TechGadgetsStore",
          title: "100% Counterfeit: Only 16GB actual capacity spoofed firmware",
          description: "Ran H2testw on this card. It is a hacked 16GB micro SD card programmed to display 128GB. After 16GB, all files become permanently corrupted! Flipkart customer support refused refund saying memory cards are replacement only, but replacement was also fake!",
          flipkartResolution: "denied",
          verifiedPurchase: true,
          helpfulCount: 89,
          timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: "rep-102",
          pid: "PENF62H5Q8J9Z7A1",
          userAlias: "Camera Guy Delhi",
          verdict: "dont_buy",
          categories: ["scam_fake", "quality_defect"],
          sellerName: "DigitalIndiaDeals",
          title: "Corrupted 4K drone footage. Avoid this seller completely.",
          description: "Packaging printing was blurry, hologram missing. Lost important video files because the card stopped being recognized after two days. DO NOT BUY.",
          flipkartResolution: "denied",
          verifiedPurchase: true,
          helpfulCount: 51,
          timestamp: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString()
        }
      ]
    },
    "SHOFH5G7YQ9H7JKA": {
      pid: "SHOFH5G7YQ9H7JKA",
      title: "Nike Revolution 6 Next Nature Running Shoes For Men",
      category: "Footwear",
      defaultSeller: "FootwearGalaxy",
      reports: [
        {
          id: "rep-201",
          pid: "SHOFH5G7YQ9H7JKA",
          userAlias: "Runner24",
          verdict: "dont_buy",
          categories: ["scam_fake", "quality_defect", "refund_denied"],
          sellerName: "FootwearGalaxy",
          title: "Cheapest first-copy replica. Strong chemical glue odor.",
          description: "Laces were cheap polyester, swoosh was misaligned, and Nike tag had spelling errors. Delivery pickup person rejected the return saying 'box is not in original condition' even though it came in that exact plastic bag! Total scam.",
          flipkartResolution: "denied",
          verifiedPurchase: true,
          helpfulCount: 63,
          timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
        }
      ]
    },
    "WATFG89P0123KJHQ": {
      pid: "WATFG89P0123KJHQ",
      title: "boAt Wave Call Smartwatch with Bluetooth Calling",
      category: "Wearables",
      defaultSeller: "Corpnest",
      reports: [
        {
          id: "rep-301",
          pid: "WATFG89P0123KJHQ",
          userAlias: "GadgetFanatic",
          verdict: "caution",
          categories: ["quality_defect"],
          sellerName: "Corpnest",
          title: "Battery drains in 4 hours on bluetooth call",
          description: "Good features for the price, but build quality is flimsy. Flipkart replacement took 10 days because courier delayed pickup.",
          flipkartResolution: "resolved",
          verifiedPurchase: true,
          helpfulCount: 19,
          timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
        }
      ]
    }
  }
};

class Database {
  constructor() {
    this.data = this.loadData();
  }

  loadData() {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf8');
        return JSON.parse(raw);
      }
    } catch (err) {
      console.warn("Could not read data.json, falling back to initial data:", err.message);
    }
    this.saveData(INITIAL_DATA);
    return JSON.parse(JSON.stringify(INITIAL_DATA));
  }

  saveData(data = this.data) {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
    } catch (err) {
      console.error("Failed to write data.json:", err.message);
    }
  }

  calculateStats(reports = []) {
    const total = reports.length;
    if (total === 0) {
      return {
        totalReports: 0,
        verdict: "unknown",
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
      verdict = "dont_buy"; // High risk
    } else if (dontBuyPercent >= 25 || cautionPercent >= 35 || reports.length > 0) {
      verdict = "caution"; // Moderate risk
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

  getProduct(pid) {
    const prod = this.data.products[pid];
    if (!prod) {
      return {
        pid,
        title: "",
        stats: this.calculateStats([]),
        reports: []
      };
    }
    return {
      pid: prod.pid,
      title: prod.title,
      category: prod.category,
      defaultSeller: prod.defaultSeller,
      stats: this.calculateStats(prod.reports),
      reports: [...prod.reports].sort((a, b) => (b.helpfulCount || 0) - (a.helpfulCount || 0))
    };
  }

  addReport(pid, reportData) {
    if (!this.data.products[pid]) {
      this.data.products[pid] = {
        pid,
        title: reportData.productTitle || "Flipkart Product",
        category: reportData.productCategory || "General",
        defaultSeller: reportData.sellerName || "Flipkart Seller",
        reports: []
      };
    }

    const newReport = {
      id: "rep-" + Date.now() + "-" + Math.floor(Math.random() * 1000),
      pid,
      userAlias: reportData.userAlias || "Anonymous Shopper #" + Math.floor(100 + Math.random() * 900),
      verdict: reportData.verdict || "dont_buy",
      categories: Array.isArray(reportData.categories) ? reportData.categories : [reportData.categories || "quality_defect"],
      sellerName: reportData.sellerName || "Unknown Seller",
      orderDate: reportData.orderDate || null,
      title: (reportData.title || "").trim(),
      description: (reportData.description || "").trim(),
      flipkartResolution: reportData.flipkartResolution || "denied",
      verifiedPurchase: Boolean(reportData.verifiedPurchase),
      helpfulCount: 0,
      timestamp: new Date().toISOString()
    };

    this.data.products[pid].reports.unshift(newReport);
    if (reportData.productTitle && !this.data.products[pid].title) {
      this.data.products[pid].title = reportData.productTitle;
    }
    this.saveData();
    return newReport;
  }

  voteReport(reportId, delta = 1) {
    for (const pid in this.data.products) {
      const report = this.data.products[pid].reports.find(r => r.id === reportId);
      if (report) {
        report.helpfulCount = Math.max(0, (report.helpfulCount || 0) + delta);
        this.saveData();
        return report;
      }
    }
    return null;
  }

  sameIssueReport(reportId) {
    for (const pid in this.data.products) {
      const report = this.data.products[pid].reports.find(r => r.id === reportId);
      if (report) {
        report.sameIssueCount = (report.sameIssueCount || 0) + 1;
        this.saveData();
        return report;
      }
    }
    return null;
  }

  addComment(reportId, commentData) {
    for (const pid in this.data.products) {
      const report = this.data.products[pid].reports.find(r => r.id === reportId);
      if (report) {
        if (!report.comments) report.comments = [];
        const newComment = {
          id: "cmt-" + Date.now() + "-" + Math.floor(Math.random() * 1000),
          author: commentData.author || "Anonymous Shopper",
          text: (commentData.text || "").trim(),
          timestamp: new Date().toISOString()
        };
        report.comments.push(newComment);
        this.saveData();
        return newComment;
      }
    }
    return null;
  }

  getTrending(limit = 6) {
    const list = Object.values(this.data.products).map(p => {
      const stats = this.calculateStats(p.reports);
      return {
        pid: p.pid,
        title: p.title,
        stats,
        recentReport: p.reports[0] || null
      };
    });

    // Sort by high risk / most reports
    list.sort((a, b) => {
      return (b.stats.dontBuyVotes * 2 + b.stats.totalReports) - (a.stats.dontBuyVotes * 2 + a.stats.totalReports);
    });

    return list.slice(0, limit);
  }

  search(q) {
    const term = (q || "").toLowerCase().trim();
    if (!term) return [];
    return Object.values(this.data.products)
      .filter(p => p.pid.toLowerCase().includes(term) || (p.title && p.title.toLowerCase().includes(term)))
      .map(p => ({
        pid: p.pid,
        title: p.title,
        stats: this.calculateStats(p.reports)
      }));
  }
}

module.exports = new Database();
