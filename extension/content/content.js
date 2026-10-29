// Flipkart Community Watch - Injected Content Script

(function () {
  let lastUrl = location.href;
  let floatingBadge = null;
  let activePid = null;

  function extractProductInfo() {
    const url = location.href;
    let slug = null;
    let itmId = null;
    let variantPid = null;

    try {
      const parsedUrl = new URL(url);
      const slugMatch = parsedUrl.pathname.match(/^\/([^/]+)\/p\//);
      if (slugMatch && slugMatch[1] && slugMatch[1] !== 'p') {
        slug = slugMatch[1];
      }

      const itmMatch = parsedUrl.pathname.match(/\/p\/(itm[a-zA-Z0-9]+)/);
      if (itmMatch && itmMatch[1]) {
        itmId = itmMatch[1];
      }

      variantPid = parsedUrl.searchParams.get('pid');
    } catch (e) {}

    // Canonical identifier: slug (stable across all colors & sizes) > itmId > variantPid
    const canonicalPid = slug || itmId || variantPid;
    if (!canonicalPid) return null;

    const allIds = Array.from(new Set([slug, itmId, variantPid].filter(Boolean)));

    let title = "";
    const titleEl = document.querySelector('h1 span.VU-ZEz') || 
                    document.querySelector('h1 span.B_NuCI') || 
                    document.querySelector('h1') ||
                    document.querySelector('.x-product-title');
    if (titleEl) {
      title = titleEl.textContent.trim();
    } else {
      title = document.title.replace(/\s*:\s*Buy.*Flipkart\.com.*$/i, '').trim();
    }

    let seller = "";
    const sellerEl = document.querySelector('#sellerName span span') ||
                     document.querySelector('#sellerName') ||
                     document.querySelector('div.mLEQxG') ||
                     document.querySelector('div._1RLviY');
    if (sellerEl) {
      seller = sellerEl.textContent.replace(/^Seller:\s*/i, '').trim();
    }

    return { 
      pid: canonicalPid, 
      canonicalPid, 
      slug, 
      itmId, 
      variantPid, 
      allIds, 
      title, 
      seller 
    };
  }

  async function updateBadge() {
    const info = extractProductInfo();
    if (!info) {
      if (floatingBadge) {
        floatingBadge.remove();
        floatingBadge = null;
      }
      activePid = null;
      return;
    }

    if (activePid === info.pid && floatingBadge) {
      return;
    }
    activePid = info.pid;

    if (floatingBadge) {
      floatingBadge.remove();
      floatingBadge = null;
    }

    floatingBadge = document.createElement('div');
    floatingBadge.id = 'fk-community-watch-dock';
    floatingBadge.innerHTML = `
      <div class="cw-badge" title="Open Community Reports Side Panel">
        <span class="cw-dot" id="cwDot"></span>
        <span class="cw-text" id="cwText">Community Watch</span>
        <span class="cw-count" id="cwCount"></span>
        <span class="cw-arrow">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </span>
      </div>
    `;

    document.body.appendChild(floatingBadge);

    floatingBadge.addEventListener('click', () => {
      chrome.runtime.sendMessage({ action: 'open_side_panel' });
    });

    try {
      if (window.TrustRadarAPI) {
        const data = await window.TrustRadarAPI.getProductData(info.pid, info.allIds);
        applyStatus(data?.stats);
      }
    } catch (e) {}
  }

  function applyStatus(stats) {
    if (!floatingBadge) return;
    const dot = floatingBadge.querySelector('#cwDot');
    const text = floatingBadge.querySelector('#cwText');
    const count = floatingBadge.querySelector('#cwCount');

    if (!stats || stats.totalReports === 0) {
      dot.className = 'cw-dot safe';
      text.textContent = 'Community Watch';
      count.textContent = '• 0 reports';
      return;
    }

    if (stats.verdict === 'dont_buy') {
      dot.className = 'cw-dot danger';
      text.textContent = 'High Risk Listing';
      count.textContent = `• ${stats.totalReports} reports`;
    } else if (stats.verdict === 'caution') {
      dot.className = 'cw-dot caution';
      text.textContent = 'Caution';
      count.textContent = `• ${stats.totalReports} reports`;
    } else {
      dot.className = 'cw-dot safe';
      text.textContent = 'Favorable';
      count.textContent = `• ${stats.totalReports} reports`;
    }
  }

  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'get_product_meta') {
      sendResponse(extractProductInfo());
      return true;
    }
  });

  function checkUrlChange() {
    if (location.href !== lastUrl) {
      lastUrl = location.href;
      setTimeout(updateBadge, 400);
    }
  }

  setInterval(checkUrlChange, 1000);

  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(updateBadge, 600);
  } else {
    window.addEventListener('DOMContentLoaded', () => setTimeout(updateBadge, 600));
  }
})();
