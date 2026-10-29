// Flipkart Community Watch - Clean Native Side Panel Logic

let currentPid = null;
let currentProductData = null;
let currentFilter = 'all';
let currentTabId = null;

// DOM Elements
const loadingState = document.getElementById('loadingState');
const emptyState = document.getElementById('emptyState');
const productView = document.getElementById('productView');
const trendingList = document.getElementById('trendingList');

const productPidEl = document.getElementById('productPid');
const productSellerEl = document.getElementById('productSeller');
const productTitleEl = document.getElementById('productTitle');

const statusDot = document.getElementById('statusDot');
const verdictText = document.getElementById('verdictText');
const scorePercentEl = document.getElementById('scorePercent');
const trustSummaryEl = document.getElementById('trustSummary');

const segmentDanger = document.getElementById('segmentDanger');
const segmentWarning = document.getElementById('segmentWarning');
const segmentSafe = document.getElementById('segmentSafe');

const chipRefund = document.getElementById('chipRefund');
const chipUndelivered = document.getElementById('chipUndelivered');
const chipAutocancelled = document.getElementById('chipAutocancelled');
const chipFake = document.getElementById('chipFake');
const chipWrong = document.getElementById('chipWrong');
const chipDelivery = document.getElementById('chipDelivery');

const reportsListEl = document.getElementById('reportsList');
const refreshBtn = document.getElementById('refreshBtn');
const searchToggleBtn = document.getElementById('searchToggleBtn');
const searchBar = document.getElementById('searchBar');
const searchInput = document.getElementById('searchInput');
const searchSubmitBtn = document.getElementById('searchSubmitBtn');

const openReportFormBtn = document.getElementById('openReportFormBtn');
const reportModal = document.getElementById('reportModal');
const closeModalBtn = document.getElementById('closeModalBtn');
const cancelFormBtn = document.getElementById('cancelFormBtn');
const newReportForm = document.getElementById('newReportForm');
const formSellerInput = document.getElementById('formSeller');
const formAliasInput = document.getElementById('formAlias');

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
  setupEventListeners();
  await loadCurrentTabProduct();
});

function setupEventListeners() {
  refreshBtn.addEventListener('click', () => {
    if (currentPid) {
      loadProductData(currentPid, true);
    } else {
      loadCurrentTabProduct();
    }
  });

  searchToggleBtn.addEventListener('click', () => {
    searchBar.classList.toggle('hidden');
    if (!searchBar.classList.contains('hidden')) {
      searchInput.focus();
    }
  });

  searchSubmitBtn.addEventListener('click', handleManualSearch);
  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleManualSearch();
  });

  // Filter chips
  document.querySelectorAll('.filter-chip').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.filter-chip').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentFilter = tab.dataset.filter;
      renderReportsList();
    });
  });

  // Modal open/close using native <dialog>
  openReportFormBtn.addEventListener('click', () => {
    const orderDateEl = document.getElementById('formOrderDate');
    if (orderDateEl) {
      orderDateEl.max = new Date().toISOString().split('T')[0];
    }
    if (currentProductData?.defaultSeller) {
      formSellerInput.value = currentProductData.defaultSeller;
    }
    if (!formAliasInput.value) {
      formAliasInput.value = "Anonymous Buyer #" + Math.floor(100 + Math.random() * 900);
    }
    handleVerdictChange();
    if (typeof reportModal.showModal === 'function') {
      reportModal.showModal();
    } else {
      reportModal.classList.remove('hidden');
    }
  });

  // Dynamic category and status switcher based on verdict
  document.querySelectorAll('input[name="formVerdict"]').forEach(radio => {
    radio.addEventListener('change', handleVerdictChange);
  });

  closeModalBtn.addEventListener('click', () => {
    if (typeof reportModal.close === 'function') reportModal.close();
    else reportModal.classList.add('hidden');
  });

  cancelFormBtn.addEventListener('click', () => {
    if (typeof reportModal.close === 'function') reportModal.close();
    else reportModal.classList.add('hidden');
  });

  // Light dismiss for dialog backdrop clicks (Modern Web Guidance)
  reportModal.addEventListener('click', (e) => {
    const rect = reportModal.getBoundingClientRect();
    const isInDialog = (
      rect.top <= e.clientY &&
      e.clientY <= rect.top + rect.height &&
      rect.left <= e.clientX &&
      e.clientX <= rect.left + rect.width
    );
    if (!isInDialog && typeof reportModal.close === 'function') {
      reportModal.close();
    }
  });

  newReportForm.addEventListener('submit', handleReportSubmit);

  chrome.runtime.onMessage.addListener((message) => {
    if (message.action === 'tab_changed') {
      loadCurrentTabProduct();
    }
  });
}

function handleVerdictChange() {
  const selectedVerdict = document.querySelector('input[name="formVerdict"]:checked')?.value;
  const negGroup = document.getElementById('negativeCategoriesGroup');
  const posGroup = document.getElementById('positiveCategoriesGroup');
  const catLabel = document.getElementById('categoriesLabel');
  const resGroup = document.getElementById('resolutionFieldGroup');
  const titleInput = document.getElementById('formTitle');
  const descInput = document.getElementById('formDesc');

  if (selectedVerdict === 'positive') {
    if (negGroup) {
      negGroup.classList.add('hidden');
      negGroup.style.display = 'none';
      negGroup.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
    }
    if (posGroup) {
      posGroup.classList.remove('hidden');
      posGroup.style.display = 'flex';
    }
    if (catLabel) {
      catLabel.textContent = "What went well? (select all that apply)";
    }
    if (resGroup) {
      resGroup.classList.add('hidden');
      resGroup.style.display = 'none';
    }
    if (titleInput) {
      titleInput.placeholder = "e.g. 100% Genuine product, fast delivery";
    }
    if (descInput) {
      descInput.placeholder = "Describe your positive experience (packaging quality, product authenticity, delivery speed)...";
    }
  } else {
    if (posGroup) {
      posGroup.classList.add('hidden');
      posGroup.style.display = 'none';
      posGroup.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
    }
    if (negGroup) {
      negGroup.classList.remove('hidden');
      negGroup.style.display = 'flex';
    }
    if (catLabel) {
      catLabel.textContent = "What problems occurred? (select all that apply)";
    }
    if (resGroup) {
      resGroup.classList.remove('hidden');
      resGroup.style.display = 'flex';
    }
    if (titleInput) {
      titleInput.placeholder = "Brief summary of the issue";
    }
    if (descInput) {
      descInput.placeholder = "Describe what happened, support response, and timeline...";
    }
  }
}

function extractPidFromUrl(urlStr) {
  if (!urlStr || !urlStr.includes('flipkart.com')) return null;

  try {
    const url = new URL(urlStr);
    const pidParam = url.searchParams.get('pid');
    if (pidParam) return pidParam;

    const match = url.pathname.match(/\/p\/(itm[a-zA-Z0-9]+)/);
    if (match && match[1]) {
      return match[1];
    }
  } catch (e) {}
  return null;
}

async function loadCurrentTabProduct() {
  showLoading();
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab || !tab.url) {
      showEmptyState();
      return;
    }
    currentTabId = tab.id;

    const pid = extractPidFromUrl(tab.url);
    if (!pid) {
      showEmptyState();
      return;
    }

    let liveMeta = null;
    try {
      liveMeta = await chrome.tabs.sendMessage(tab.id, { action: 'get_product_meta' });
    } catch (e) {}

    await loadProductData(pid, false, liveMeta);
  } catch (err) {
    showEmptyState();
  }
}

async function loadProductData(pid, forceRefresh = false, liveMeta = null) {
  showLoading();
  currentPid = pid;

  try {
    const data = await window.TrustRadarAPI.getProductData(pid);

    if (liveMeta && liveMeta.title && (!data.title || data.title === "Flipkart Product")) {
      data.title = liveMeta.title;
    }
    if (liveMeta && liveMeta.seller && (!data.defaultSeller || data.defaultSeller === "Flipkart Seller")) {
      data.defaultSeller = liveMeta.seller;
    }

    currentProductData = data;
    renderProductView(data);
  } catch (err) {
    showEmptyState();
  }
}

function renderProductView(data) {
  loadingState.classList.add('hidden');
  emptyState.classList.add('hidden');
  productView.classList.remove('hidden');

  productPidEl.textContent = `Listing ID: ${data.pid}`;
  productSellerEl.textContent = `Seller: ${data.defaultSeller || 'Direct/Unknown'}`;
  productTitleEl.textContent = data.title || "Flipkart Product Listing";

  const stats = data.stats;
  const reports = data.reports || [];

  // Update tab badge
  if (currentTabId) {
    chrome.runtime.sendMessage({
      action: "product_detected",
      stats
    }).catch(() => {});
  }

  // Segmented Bar Calculation
  const total = stats.totalReports || 0;
  let dP = 0, cP = 0, sP = 0;
  if (total > 0) {
    dP = Math.round((stats.dontBuyVotes / total) * 100);
    cP = Math.round((stats.cautionVotes / total) * 100);
    sP = Math.max(0, 100 - dP - cP);
  } else {
    sP = 100;
  }

  segmentDanger.style.width = `${dP}%`;
  segmentWarning.style.width = `${cP}%`;
  segmentSafe.style.width = `${sP}%`;

  // Status dot & Title
  statusDot.className = 'status-dot';
  verdictText.className = 'status-title';

  if (stats.verdict === 'dont_buy') {
    statusDot.classList.add('danger');
    verdictText.classList.add('danger');
    verdictText.textContent = "High Risk Listing";
    scorePercentEl.textContent = `${stats.dontBuyPercent || 75}% flag issues`;
    trustSummaryEl.textContent = `${stats.refundDeniedCount} buyers reported refund refusal, and ${stats.scamCount} noted counterfeit or non-genuine items.`;
  } else if (stats.verdict === 'caution') {
    statusDot.classList.add('caution');
    verdictText.classList.add('caution');
    verdictText.textContent = "Mixed Feedback";
    scorePercentEl.textContent = `${stats.cautionPercent + stats.dontBuyPercent}% flagged`;
    trustSummaryEl.textContent = `Several buyers noted delivery or replacement friction. Check open-box contents before confirming OTP.`;
  } else {
    statusDot.classList.add('safe');
    verdictText.classList.add('safe');
    verdictText.textContent = reports.length > 0 ? "Favorable" : "No Reports Recorded";
    scorePercentEl.textContent = reports.length > 0 ? `${stats.buyPercent}% satisfied` : "0 Reports";
    trustSummaryEl.textContent = reports.length > 0
      ? `Community reports reflect regular fulfillment and issue resolution.`
      : `No scams, fakes, or refund denials recorded for this identifier yet.`;
  }

  // Update Category Pills
  updateIssuePill(chipRefund, stats.refundDeniedCount, 'refund denied');
  updateIssuePill(chipUndelivered, stats.undeliveredCount, 'undelivered');
  updateIssuePill(chipAutocancelled, stats.autocancelledCount, 'auto-cancelled');
  updateIssuePill(chipFake, stats.scamCount, 'counterfeit');
  updateIssuePill(chipWrong, stats.wrongItemCount, 'wrong item');
  updateIssuePill(chipDelivery, stats.deliveryCount, 'delivery issue');

  // Counts on Filter Buttons
  document.getElementById('countAll').textContent = reports.length;
  if (document.getElementById('countPositive')) {
    document.getElementById('countPositive').textContent = stats.buyVotes || 0;
  }
  document.getElementById('countRefund').textContent = stats.refundDeniedCount || 0;
  if (document.getElementById('countUndelivered')) {
    document.getElementById('countUndelivered').textContent = stats.undeliveredCount || 0;
  }
  if (document.getElementById('countAutocancelled')) {
    document.getElementById('countAutocancelled').textContent = stats.autocancelledCount || 0;
  }
  document.getElementById('countFake').textContent = stats.scamCount || 0;
  document.getElementById('countWrong').textContent = stats.wrongItemCount || 0;
  document.getElementById('countDefect').textContent = stats.qualityCount || 0;
  document.getElementById('countDelivery').textContent = stats.deliveryCount || 0;

  const chipPositive = document.getElementById('chipPositive');
  if (chipPositive) {
    updateIssuePill(chipPositive, stats.buyVotes, 'positive');
    if (stats.buyVotes > 0) {
      chipPositive.style.background = '#f0fdf4';
      chipPositive.style.color = '#166534';
      chipPositive.style.borderColor = '#bbf7d0';
    }
  }

  renderReportsList();
}

function updateIssuePill(el, count, label) {
  el.textContent = `${count} ${label}`;
  if (count > 0) {
    el.classList.add('has-issues');
  } else {
    el.classList.remove('has-issues');
  }
}

function renderReportsList() {
  const reports = currentProductData?.reports || [];
  reportsListEl.innerHTML = '';

  let filtered = reports;
  if (currentFilter !== 'all') {
    if (currentFilter === 'positive') {
      filtered = reports.filter(r => r.verdict === 'positive' || r.verdict === 'buy');
    } else {
      filtered = reports.filter(r => (r.categories || []).includes(currentFilter));
    }
  }

  if (filtered.length === 0) {
    reportsListEl.innerHTML = `
      <div class="empty-reports">
        No community submissions in this category.
      </div>
    `;
    return;
  }

  filtered.forEach(rep => {
    reportsListEl.appendChild(createReportCard(rep));
  });
}

function createReportCard(rep) {
  const card = document.createElement('div');
  card.className = 'report-item';

  const timeAgo = formatTimeAgo(rep.timestamp);

  let verdictLabel = '';
  if (rep.verdict === 'dont_buy') {
    verdictLabel = `<span class="report-verdict-label dont_buy">Avoid</span>`;
  } else if (rep.verdict === 'caution') {
    verdictLabel = `<span class="report-verdict-label caution">Caution</span>`;
  } else {
    verdictLabel = `<span class="report-verdict-label buy">Positive</span>`;
  }

  let resHtml = '';
  if (rep.flipkartResolution === 'denied') {
    resHtml = `<span class="res-pill res-denied">Support: Refund Denied</span>`;
  } else if (rep.flipkartResolution === 'pending') {
    resHtml = `<span class="res-pill res-pending">Support: Under Review</span>`;
  } else if (rep.flipkartResolution === 'resolved') {
    resHtml = `<span class="res-pill res-resolved">Support: Replaced / Refunded</span>`;
  }

  card.innerHTML = `
    <div class="report-header">
      <div class="report-byline">
        <span class="report-author-name">${escapeHtml(rep.userAlias || 'Anonymous')}</span>
        ${rep.verifiedPurchase ? '<span class="badge-verified-purchase">Verified</span>' : ''}
        <span class="report-date">• ${timeAgo}</span>
        ${rep.orderDate ? `<span class="report-order-date">• Ordered: ${escapeHtml(rep.orderDate)}</span>` : ''}
      </div>
      ${verdictLabel}
    </div>

    ${rep.sellerName ? `<div class="report-seller-info">Seller: <span>${escapeHtml(rep.sellerName)}</span></div>` : ''}

    <div class="report-heading">${escapeHtml(rep.title || 'Report')}</div>
    <div class="report-body-text">${escapeHtml(rep.description)}</div>

    <div class="resolution-row">${resHtml}</div>

    <div class="report-actions">
      <div class="action-buttons-group">
        <button class="btn-vote" data-id="${rep.id}">
          <span>Helpful</span>
          <span class="vote-count">${rep.helpfulCount || 0}</span>
        </button>
        <button class="btn-same-issue" data-id="${rep.id}">
          <span>Facing same issue</span>
          <span class="same-count">${rep.sameIssueCount || 0}</span>
        </button>
        <button class="btn-toggle-comments" data-id="${rep.id}">
          <span>Comments</span>
          <span class="comment-count">${(rep.comments || []).length}</span>
        </button>
      </div>
      <button class="btn-flag" data-id="${rep.id}" title="Report inaccuracy or abuse">Report</button>
    </div>

    <div class="comments-thread hidden" id="commentsThread-${rep.id}">
      <div class="comments-list" id="commentsList-${rep.id}">
        ${renderCommentsHtml(rep.comments || [])}
      </div>
      <form class="comment-form-inline" data-id="${rep.id}">
        <input type="text" class="comment-input" placeholder="Add an update or share your experience..." required maxlength="300" />
        <button type="submit" class="comment-submit-btn">Post</button>
      </form>
    </div>
  `;

  // Upvote listener
  const voteBtn = card.querySelector('.btn-vote');
  voteBtn.addEventListener('click', async () => {
    const res = await window.TrustRadarAPI.voteHelpful(rep.id);
    if (res && res.success) {
      rep.helpfulCount = (rep.helpfulCount || 0) + 1;
      card.querySelector('.vote-count').textContent = rep.helpfulCount;
      voteBtn.classList.add('voted');
    }
  });

  // Facing same issue listener
  const sameBtn = card.querySelector('.btn-same-issue');
  sameBtn.addEventListener('click', async () => {
    const res = await window.TrustRadarAPI.endorseSameIssue(rep.id);
    if (res && res.success) {
      rep.sameIssueCount = (rep.sameIssueCount || 0) + 1;
      card.querySelector('.same-count').textContent = rep.sameIssueCount;
      sameBtn.classList.add('voted');
    }
  });

  // Comments accordion toggle
  const toggleCommentsBtn = card.querySelector('.btn-toggle-comments');
  const threadEl = card.querySelector(`#commentsThread-${rep.id}`);
  toggleCommentsBtn.addEventListener('click', () => {
    threadEl.classList.toggle('hidden');
    if (!threadEl.classList.contains('hidden')) {
      threadEl.querySelector('.comment-input')?.focus();
    }
  });

  // Comment submission form
  const commentForm = card.querySelector(`.comment-form-inline`);
  commentForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const input = commentForm.querySelector('.comment-input');
    const text = input.value.trim();
    if (!text) return;

    const author = "Buyer #" + Math.floor(100 + Math.random() * 900);
    const newComment = await window.TrustRadarAPI.addComment(rep.id, text, author);
    if (newComment) {
      if (!rep.comments) rep.comments = [];
      rep.comments.push(newComment);
      
      const listEl = card.querySelector(`#commentsList-${rep.id}`);
      listEl.innerHTML = renderCommentsHtml(rep.comments);
      card.querySelector('.comment-count').textContent = rep.comments.length;
      input.value = '';
    }
  });

  const flagBtn = card.querySelector('.btn-flag');
  flagBtn.addEventListener('click', () => {
    if (confirm("Flag this report as inaccurate, defamatory, or competitor spam?")) {
      flagBtn.textContent = "Flagged";
      flagBtn.disabled = true;
      alert("Report submitted for moderation review. Thank you for keeping the community fair.");
    }
  });

  return card;
}

function renderCommentsHtml(comments) {
  if (!comments || comments.length === 0) {
    return `<div class="no-comments-yet">No comments yet. Be the first to share an update.</div>`;
  }
  return comments.map(c => `
    <div class="comment-item">
      <div class="comment-meta">
        <span class="comment-author">${escapeHtml(c.author || 'Anonymous')}</span>
        <span class="comment-time">${formatTimeAgo(c.timestamp)}</span>
      </div>
      <div class="comment-text">${escapeHtml(c.text)}</div>
    </div>
  `).join('');
}

async function handleManualSearch() {
  const query = searchInput.value.trim();
  if (!query) return;

  const pid = extractPidFromUrl(query) || query;
  searchBar.classList.add('hidden');
  await loadProductData(pid, true);
}

async function handleReportSubmit(e) {
  e.preventDefault();

  const verdict = document.querySelector('input[name="formVerdict"]:checked')?.value || 'dont_buy';
  const activeGroup = verdict === 'positive' 
    ? document.getElementById('positiveCategoriesGroup') 
    : document.getElementById('negativeCategoriesGroup');
  const checkedBoxes = Array.from(activeGroup.querySelectorAll('input[name="categories"]:checked')).map(cb => cb.value);
  const title = document.getElementById('formTitle').value.trim();
  const description = document.getElementById('formDesc').value.trim();
  const sellerName = formSellerInput.value.trim() || currentProductData?.defaultSeller || 'Flipkart Seller';
  const orderDate = document.getElementById('formOrderDate')?.value || '';
  const flipkartResolution = verdict === 'positive' ? 'fulfilled' : document.getElementById('formResolution').value;
  const verifiedPurchase = document.getElementById('formVerified').checked;
  const userAlias = formAliasInput.value.trim() || 'Anonymous Buyer';

  if (!description) return;

  const submitBtn = document.getElementById('submitReportBtn');
  submitBtn.disabled = true;
  submitBtn.textContent = 'Saving...';

  const reportPayload = {
    verdict,
    categories: checkedBoxes.length > 0 ? checkedBoxes : (verdict === 'positive' ? ['genuine_verified'] : ['quality_defect']),
    sellerName,
    orderDate,
    title,
    description,
    flipkartResolution,
    verifiedPurchase,
    userAlias,
    productTitle: currentProductData?.title || 'Flipkart Product',
    productCategory: currentProductData?.category || 'General'
  };

  try {
    await window.TrustRadarAPI.submitReport(currentPid, reportPayload);
    await loadProductData(currentPid, true);
    if (typeof reportModal.close === 'function') reportModal.close();
    else reportModal.classList.add('hidden');
    newReportForm.reset();
  } catch (err) {
    alert("Could not submit: " + err.message);
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Submit report';
  }
}

function showLoading() {
  loadingState.classList.remove('hidden');
  emptyState.classList.add('hidden');
  productView.classList.add('hidden');
}

async function showEmptyState() {
  loadingState.classList.add('hidden');
  productView.classList.add('hidden');
  emptyState.classList.remove('hidden');

  try {
    const list = await window.TrustRadarAPI.getTrending();
    trendingList.innerHTML = '';
    list.slice(0, 4).forEach(item => {
      const row = document.createElement('div');
      row.className = 'trending-row';
      row.innerHTML = `
        <div class="trending-row-title">${escapeHtml(item.title || item.pid)}</div>
        <div class="trending-row-meta">
          <span class="trending-flag-text">${item.stats.dontBuyPercent || 80}% issues reported</span>
          <span>${item.stats.totalReports} reports</span>
        </div>
      `;
      row.addEventListener('click', () => loadProductData(item.pid, true));
      trendingList.appendChild(row);
    });
  } catch (e) {}
}

function formatTimeAgo(isoString) {
  if (!isoString) return 'recently';
  const diff = Date.now() - new Date(isoString).getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days <= 0) return 'today';
  if (days === 1) return '1d ago';
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
