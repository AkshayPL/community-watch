# Community Watch - Shopper Review Overlay

An open-source Chrome Extension (Manifest V3) with a native Side Panel that allows online shoppers to anonymously share and view real community feedback on e-commerce product listings, including undelivered orders, auto-cancellations, delivery problems, counterfeit items, and return/refund denials, as well as verified positive experiences.

---

## Features

1. **Native Chrome Side Panel**: Docks neatly alongside product pages for easy viewing without covering product images or buy buttons.
2. **Community Verdict**:
   - **Avoid**: Flags high rates of non-delivery, fakes, or rejected refunds.
   - **Caution**: Notes frequent replacement delays, defects, or delivery friction.
   - **Positive**: Highlights verified genuine units and smooth fulfillment.
3. **Issue Breakdown**: Categorized tracking for:
   - Return / Refund Denied
   - Undelivered / Marked Delivered Fraud
   - Auto-cancelled by Seller / Platform
   - Fake or Counterfeit Items
   - Wrong Item Delivered
   - Defective or Damaged Units
   - Open Box / Delivery Inspection Refusal
4. **Community Endorsement & Discussion**:
   - Upvote helpful reports.
   - "Facing same issue" one-click endorsement.
   - Inline threaded comments to share resolution updates.
5. **Anonymous Reporting**:
   - Dynamic form switching between problem reporting and positive feedback.
   - Optional order date calendar picker.
   - No personal credentials or user tracking required.
6. **In-Page Indicator**: Minimal floating badge on product pages showing live listing status and opening the side panel on click.

---

## Installation

### Option 1: Download Pre-built Release (Recommended)

1. Download the latest `community-watch-extension.zip` from [Releases](https://github.com/AkshayPL/community-watch/releases).
2. Extract the zip file to any folder on your computer.
3. Open Google Chrome and navigate to:
   ```text
   chrome://extensions
   ```
4. Enable **Developer mode** using the toggle switch in the top-right corner.
5. Click the **Load unpacked** button in the top-left corner.
6. Select the extracted folder.

### Option 2: From Source / Git Clone

1. Clone or download this repository:
   ```bash
   git clone https://github.com/AkshayPL/community-watch.git
   ```
2. Open Google Chrome and navigate to `chrome://extensions`.
3. Enable **Developer mode** in the top-right corner.
4. Click **Load unpacked** and select the `extension` folder inside the repository.

---

## How to Use

1. Navigate to any supported e-commerce product listing.
2. Click the **Community Watch** icon in the Chrome toolbar, or click the floating badge in the bottom-right corner of the page.
3. The native side panel will open on the right side of the screen displaying real community experiences, issue breakdowns, and the report submission form.

---

## Legal Disclaimer

Community Watch is an independent, community-driven consumer review tool. It is not affiliated with, endorsed by, or sponsored by Flipkart Internet Private Limited or any other marketplace. All brand names, product titles, and trademarks are the property of their respective owners.

---

## License

This project is open-source and licensed under the [MIT License](LICENSE).
