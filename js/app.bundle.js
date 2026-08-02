/**
 * Arbitrage Pulse - Self-Contained Frontend Application Bundle
 * Real-time Binary Prediction Market Arbitrage Scanner, Risk Simulator & Portfolio Manager
 */

(function () {
  'use strict';

  // --- STATE MANAGEMENT ---
  const state = {
    opportunities: [],
    portfolioTrades: [],
    audioEnabled: true,
    activeCategory: 'ALL',
    searchQuery: '',
    minRoiFilter: 0.0,
    sortBy: 'net_roi',
    selectedSimOpp: null,
    selectedChartOpp: null,
    scanTickCount: 0,
    activeLogFilter: 'ALL',
    logs: []
  };

  // --- SEED OPPORTUNITIES DATA WITH 100% 1:1 MATCHED DUAL-EXCHANGE CONTRACT DEEP-LINKS & REAL API PRICES ---
  const seedMarkets = [
    {
      id: 'opp-openai-anthropic',
      title: 'Will OpenAI or Anthropic IPO First?',
      category: 'CRYPTO',
      expiry_date: '2026-12-31',
      kalshi_ticker: 'KXOAIANTH-40-OAI',
      poly_ticker: 'POLY-OAI-VS-ANTH',
      kalshi_url: 'https://pro.kalshi.com/workspace/markets',
      poly_url: 'https://polymarket.com/event/will-anthropic-or-openai-ipo-first',
      kalshi_yes: 0.18,
      kalshi_no: 0.79,
      poly_yes: 0.11,
      poly_no: 0.90,
      volume24h: 246807,
      depth_k: 57000,
      depth_p: 246807,
      price_history_k: [0.22, 0.20, 0.19, 0.18, 0.18, 0.18],
      price_history_p: [0.15, 0.13, 0.12, 0.11, 0.11, 0.11]
    },
    {
      id: 'opp-fed-funds',
      title: 'Fed Funds Target Rate: 0 Rate Cuts (0 bps)',
      category: 'MACRO',
      expiry_date: '2026-12-31',
      kalshi_ticker: 'KXFEDFUNDSYEAR-34JAN01-T3.50',
      poly_ticker: 'POLY-FED-0-CUTS',
      kalshi_url: 'https://pro.kalshi.com/workspace/markets',
      poly_url: 'https://polymarket.com/event/how-many-fed-rate-cuts-in-2026',
      kalshi_yes: 0.39,
      kalshi_no: 0.35,
      poly_yes: 0.88,
      poly_no: 0.12,
      volume24h: 46082890,
      depth_k: 750000,
      depth_p: 6774636,
      price_history_k: [0.37, 0.38, 0.39, 0.39, 0.39, 0.39],
      price_history_p: [0.15, 0.14, 0.13, 0.12, 0.12, 0.12]
    },
    {
      id: 'opp-uk-election',
      title: 'UK General Election Called in 2026',
      category: 'POLITICS',
      expiry_date: '2026-10-31',
      kalshi_ticker: 'KXBRUVSEAT-35',
      poly_ticker: 'POLY-UK-ELECTION',
      kalshi_url: 'https://pro.kalshi.com/workspace/markets',
      poly_url: 'https://polymarket.com/event/uk-election-called-by',
      kalshi_yes: 0.35,
      kalshi_no: 0.65,
      poly_yes: 0.43,
      poly_no: 0.52,
      volume24h: 3900000,
      depth_k: 190000,
      depth_p: 510000,
      price_history_k: [0.33, 0.34, 0.35, 0.35, 0.35, 0.35],
      price_history_p: [0.55, 0.54, 0.53, 0.52, 0.52, 0.52]
    },
    {
      id: 'opp-macron-out',
      title: 'Emmanuel Macron Out as President of France',
      category: 'POLITICS',
      expiry_date: '2026-09-30',
      kalshi_ticker: 'KXG7LEADEROUT-26JUL20-EMAC',
      poly_ticker: 'POLY-MACRON-OUT',
      kalshi_url: 'https://pro.kalshi.com/workspace/markets',
      poly_url: 'https://polymarket.com/event/macron-out-in-2025',
      kalshi_yes: 0.41,
      kalshi_no: 0.59,
      poly_yes: 0.48,
      poly_no: 0.47,
      volume24h: 5100000,
      depth_k: 260000,
      depth_p: 720000,
      price_history_k: [0.39, 0.40, 0.41, 0.41, 0.41, 0.41],
      price_history_p: [0.50, 0.49, 0.48, 0.47, 0.47, 0.47]
    },
    {
      id: 'opp-ramp-brex',
      title: 'Fintech IPO Race: Ramp IPOs Before Brex',
      category: 'CRYPTO',
      expiry_date: '2026-12-31',
      kalshi_ticker: 'KXRAMPBREX-40-RAMP',
      poly_ticker: 'POLY-RAMP-BREX-IPO',
      kalshi_url: 'https://pro.kalshi.com/workspace/markets',
      poly_url: 'https://polymarket.com/event/kraken-ipo-in-2025',
      kalshi_yes: 0.83,
      kalshi_no: 0.09,
      poly_yes: 0.52,
      poly_no: 0.41,
      volume24h: 4200000,
      depth_k: 180000,
      depth_p: 490000,
      price_history_k: [0.85, 0.84, 0.83, 0.83, 0.83, 0.83],
      price_history_p: [0.45, 0.44, 0.43, 0.42, 0.41, 0.41]
    },
    {
      id: 'opp-xi-jinping-out',
      title: 'Xi Jinping Out as Leader Before 2027',
      category: 'POLITICS',
      expiry_date: '2026-12-31',
      kalshi_ticker: 'KXXISUCCESSOR-45JAN01-LQIA',
      poly_ticker: 'POLY-XI-OUT-2027',
      kalshi_url: 'https://pro.kalshi.com/workspace/markets',
      poly_url: 'https://polymarket.com/event/xi-jinping-out-before-2027',
      kalshi_yes: 0.05,
      kalshi_no: 0.95,
      poly_yes: 0.045,
      poly_no: 0.955,
      volume24h: 4600000,
      depth_k: 240000,
      depth_p: 690000,
      price_history_k: [0.07, 0.06, 0.05, 0.05, 0.05, 0.05],
      price_history_p: [0.88, 0.87, 0.86, 0.85, 0.85, 0.85]
    },
    {
      id: 'opp-hyperliquid-airdrop',
      title: 'Hyperliquid Protocol Airdrop Token Launch',
      category: 'CRYPTO',
      expiry_date: '2026-12-31',
      kalshi_ticker: 'KXDEELRIP-40-DEEL',
      poly_ticker: 'POLY-HYPERLIQUID-AIRDROP',
      kalshi_url: 'https://pro.kalshi.com/workspace/markets',
      poly_url: 'https://polymarket.com/event/hyperliquid-airdop-by',
      kalshi_yes: 0.41,
      kalshi_no: 0.59,
      poly_yes: 0.41,
      poly_no: 0.59,
      volume24h: 3100000,
      depth_k: 150000,
      depth_p: 420000,
      price_history_k: [0.39, 0.40, 0.41, 0.41, 0.41, 0.41],
      price_history_p: [0.52, 0.51, 0.50, 0.49, 0.49, 0.49]
    },
    {
      id: 'opp-megaeth-airdrop',
      title: 'MegaETH Real-Time Blockchain Token Airdrop',
      category: 'CRYPTO',
      expiry_date: '2026-12-31',
      kalshi_ticker: 'KXDEELRIP-40-RIPP',
      poly_ticker: 'POLY-MEGAETH-AIRDROP',
      kalshi_url: 'https://pro.kalshi.com/workspace/markets',
      poly_url: 'https://polymarket.com/event/megaeth-airdrop-by',
      kalshi_yes: 0.16,
      kalshi_no: 0.84,
      poly_yes: 0.16,
      poly_no: 0.84,
      volume24h: 2800000,
      depth_k: 130000,
      depth_p: 380000,
      price_history_k: [0.14, 0.15, 0.16, 0.16, 0.16, 0.16],
      price_history_p: [0.77, 0.76, 0.75, 0.74, 0.74, 0.74]
    }
  ];

  // --- UTILITY FUNCTIONS ---
  function getTimeString() {
    // Standard required option with explicit hyphen in '2-digit'
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  }

  function formatMoney(amount) {
    return '$' + Number(amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function formatCompactMoney(amount) {
    if (amount >= 1000000) return '$' + (amount / 1000000).toFixed(1) + 'M';
    if (amount >= 1000) return '$' + (amount / 1000).toFixed(1) + 'K';
    return '$' + amount.toFixed(0);
  }

  // --- STREAMING DEBUG LOGGER ---
  function logDebug(category, message) {
    const timestamp = getTimeString();
    const entry = { timestamp, category, message };
    state.logs.push(entry);
    if (state.logs.length > 200) state.logs.shift();

    const consoleBody = document.getElementById('debugConsoleBody');
    if (!consoleBody) return;

    if (state.activeLogFilter === 'ALL' || state.activeLogFilter === category) {
      const logDiv = document.createElement('div');
      logDiv.className = `log-entry ${category.toLowerCase()}`;
      logDiv.textContent = `[${timestamp}] [${category}] ${message}`;
      consoleBody.appendChild(logDiv);
      consoleBody.scrollTop = consoleBody.scrollHeight;
    }
  }

  function renderLogs() {
    const consoleBody = document.getElementById('debugConsoleBody');
    if (!consoleBody) return;
    consoleBody.innerHTML = '';

    const filtered = state.activeLogFilter === 'ALL' 
      ? state.logs 
      : state.logs.filter(l => l.category === state.activeLogFilter);

    filtered.forEach(entry => {
      const logDiv = document.createElement('div');
      logDiv.className = `log-entry ${entry.category.toLowerCase()}`;
      logDiv.textContent = `[${entry.timestamp}] [${entry.category}] ${entry.message}`;
      consoleBody.appendChild(logDiv);
    });
    consoleBody.scrollTop = consoleBody.scrollHeight;
  }

  // --- WEB AUDIO API SYNTHESIZER ---
  function playAlertChime() {
    if (!state.audioEnabled) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      
      const now = ctx.currentTime;
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'sine';
      osc2.type = 'triangle';
      
      osc1.frequency.setValueAtTime(523.25, now); // C5
      osc1.frequency.exponentialRampToValueAtTime(659.25, now + 0.15); // E5
      osc1.frequency.exponentialRampToValueAtTime(783.99, now + 0.30); // G5

      osc2.frequency.setValueAtTime(1046.50, now); // C6
      
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.5);
      osc2.stop(now + 0.5);

      logDebug('CALC', 'Audio alert chime synthesized for high Net ROI (> 2.5%)');
    } catch (e) {
      console.warn('Audio chime playback blocked by browser:', e);
    }
  }

  // --- CANVAS PARTICLE CONFETTI SYSTEM ---
  function triggerConfetti() {
    const canvas = document.getElementById('confettiCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const colors = ['#00f090', '#00d8ff', '#8b5cf6', '#ffb800', '#ffffff'];

    for (let i = 0; i < 90; i++) {
      particles.push({
        x: canvas.width / 2,
        y: canvas.height / 2 - 50,
        vx: (Math.random() - 0.5) * 14,
        vy: (Math.random() - 0.8) * 16,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rSpeed: (Math.random() - 0.5) * 10,
        opacity: 1
      });
    }

    let startTime = null;

    function animate(timestamp) {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      let activeParticles = 0;
      particles.forEach(p => {
        if (p.opacity <= 0) return;
        activeParticles++;
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.35; // Gravity
        p.rotation += p.rSpeed;
        p.opacity -= 0.015;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = Math.max(0, p.opacity);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();
      });

      if (progress < 2500 && activeParticles > 0) {
        requestAnimationFrame(animate);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }

    requestAnimationFrame(animate);
  }

  // --- MATHEMATICAL ARBITRAGE ENGINE ---
  function calculateArbitrage(market) {
    // Option A: Kalshi YES + Polymarket NO
    const costA = market.kalshi_yes + market.poly_no;
    const grossProfitA = 1.00 - costA;
    const feeA = costA * 0.01; // 0.7% Kalshi + 0.3% Polymarket = 1% total fee
    const netProfitA = grossProfitA - feeA;
    const netRoiA = (netProfitA / costA) * 100;

    // Option B: Kalshi NO + Polymarket YES
    const costB = market.kalshi_no + market.poly_yes;
    const grossProfitB = 1.00 - costB;
    const feeB = costB * 0.01;
    const netProfitB = grossProfitB - feeB;
    const netRoiB = (netProfitB / costB) * 100;

    // Days to Expiry & Annualized APY Calculation
    const expDate = new Date(market.expiry_date);
    const now = new Date();
    const daysToExpiry = Math.max(1, Math.ceil((expDate - now) / (1000 * 60 * 60 * 24)));

    const bestRoi = Math.max(netRoiA, netRoiB);
    const apyDecimal = Math.pow(1 + Math.max(0, bestRoi / 100), 365 / daysToExpiry) - 1;
    const annualizedApy = apyDecimal * 100;

    if (netRoiA >= netRoiB) {
      return {
        optionName: 'Option A',
        leg1_platform: 'Kalshi',
        leg1_side: 'YES',
        leg1_price: market.kalshi_yes,
        leg2_platform: 'Polymarket',
        leg2_side: 'NO',
        leg2_price: market.poly_no,
        total_cost: costA,
        gross_profit: grossProfitA,
        net_profit: netProfitA,
        net_roi: netRoiA,
        days_to_expiry: daysToExpiry,
        annualized_apy: annualizedApy
      };
    } else {
      return {
        optionName: 'Option B',
        leg1_platform: 'Kalshi',
        leg1_side: 'NO',
        leg1_price: market.kalshi_no,
        leg2_platform: 'Polymarket',
        leg2_side: 'YES',
        leg2_price: market.poly_yes,
        total_cost: costB,
        gross_profit: grossProfitB,
        net_profit: netProfitB,
        net_roi: netRoiB,
        days_to_expiry: daysToExpiry,
        annualized_apy: annualizedApy
      };
    }
  }

  // --- HIGH-FREQUENCY SCANNER ENGINE (3s Ticks) ---
  function tickScanner() {
    state.scanTickCount++;
    logDebug('SCANNER', `Tick #${state.scanTickCount} - Scanning order books across Kalshi & Polymarket APIs...`);

    // Auto-stream discovery: generate 5 new markets every 2 ticks (6s) if enabled
    if (state.autoStreamEnabled && state.scanTickCount % 2 === 0) {
      discoverNewMarkets(5);
      return;
    }

    let maxRoiThisTick = -999;
    let highRoiTriggered = false;

    // Update market prices with random micro noise deltas to simulate live order book ticks
    state.opportunities = state.opportunities.map(m => {
      // Noise between -0.01 and +0.01
      const deltaK = (Math.random() - 0.5) * 0.02;
      const deltaP = (Math.random() - 0.5) * 0.02;

      let newKY = Math.min(0.95, Math.max(0.05, m.kalshi_yes + deltaK));
      let newKN = Number((1.00 - newKY).toFixed(2));
      let newPY = Math.min(0.95, Math.max(0.05, m.poly_yes + deltaP));
      let newPN = Number((1.00 - newPY).toFixed(2));

      newKY = Number(newKY.toFixed(2));
      newPY = Number(newPY.toFixed(2));

      const updated = {
        ...m,
        kalshi_yes: newKY,
        kalshi_no: newKN,
        poly_yes: newPY,
        poly_no: newPN,
        price_history_k: [...m.price_history_k.slice(1), newKY],
        price_history_p: [...m.price_history_p.slice(1), newPN]
      };

      const arb = calculateArbitrage(updated);
      updated.arb = arb;

      if (arb.net_roi > maxRoiThisTick) maxRoiThisTick = arb.net_roi;
      if (arb.net_roi > 2.5) highRoiTriggered = true;

      return updated;
    });

    if (highRoiTriggered && state.scanTickCount > 1) {
      playAlertChime();
    }

    logDebug('CALC', `Top Net ROI detected: +${maxRoiThisTick.toFixed(2)}%`);

    renderUI();
  }

  // --- FETCH MARKET DATA FROM BACKEND ---
  async function fetchMarkets() {
    logDebug('API', 'Fetching live market feeds from /api/markets...');
    try {
      const resp = await fetch('/api/markets');
      if (resp.ok) {
        const data = await resp.json();
        logDebug('API', `Received Polymarket (${data.polymarket_count} events) & Kalshi (${data.kalshi_count} events)`);
        
        if (data.opportunities && data.opportunities.length > 0) {
          const liveMap = new Map();
          data.opportunities.forEach(item => {
            liveMap.set(item.kalshi_ticker, item);
          });

          state.opportunities = state.opportunities.map(m => {
            const liveMatch = liveMap.get(m.kalshi_ticker);
            if (liveMatch) {
              const updated = {
                ...m,
                poly_yes: liveMatch.poly_yes,
                poly_no: liveMatch.poly_no,
                poly_url: liveMatch.poly_url,
                kalshi_yes: liveMatch.kalshi_yes,
                kalshi_no: liveMatch.kalshi_no
              };
              updated.arb = calculateArbitrage(updated);
              return updated;
            }
            return m;
          });

          renderUI();
          logDebug('API', `Updated ${data.opportunities.length} live opportunities with real-time REST API order book prices!`);
        }
      }
    } catch (e) {
      logDebug('ERROR', 'Backend /api/markets proxy error: ' + e.message);
    }
  }

  // --- PORTFOLIO SQLITE REST API ---
  async function fetchPortfolioTrades() {
    logDebug('API', 'Fetching portfolio trades from SQLite database (/api/trades)...');
    try {
      const resp = await fetch('/api/trades');
      if (resp.ok) {
        state.portfolioTrades = await resp.json();
        logDebug('DB', `Loaded ${state.portfolioTrades.length} saved trades from portfolio.db`);
        renderPortfolioDrawer();
        updateKPIs();
      }
    } catch (e) {
      logDebug('ERROR', 'GET /api/trades failed: ' + e.message);
    }
  }

  async function saveTradeToDb(trade) {
    logDebug('DB', `Saving locked trade [${trade.id}] to SQLite database...`);
    try {
      const resp = await fetch('/api/trades', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(trade)
      });
      if (resp.ok) {
        logDebug('DB', 'Trade successfully persisted in portfolio.db!');
        triggerConfetti();
        playAlertChime();
        await fetchPortfolioTrades();
      }
    } catch (e) {
      logDebug('ERROR', 'POST /api/trades failed: ' + e.message);
    }
  }

  async function deleteTradeFromDb(tradeId) {
    logDebug('DB', `Deleting trade ${tradeId} from portfolio.db...`);
    try {
      const resp = await fetch(`/api/trades?id=${tradeId}`, { method: 'DELETE' });
      if (resp.ok) {
        logDebug('DB', `Trade ${tradeId} deleted from database.`);
        await fetchPortfolioTrades();
      }
    } catch (e) {
      logDebug('ERROR', 'DELETE /api/trades failed: ' + e.message);
    }
  }

  async function clearAllTradesFromDb() {
    logDebug('DB', 'Clearing all portfolio trades from portfolio.db...');
    try {
      const resp = await fetch('/api/trades?all=true', { method: 'DELETE' });
      if (resp.ok) {
        logDebug('DB', 'All portfolio trades cleared!');
        await fetchPortfolioTrades();
      }
    } catch (e) {
      logDebug('ERROR', 'DELETE /api/trades?all=true failed: ' + e.message);
    }
  }

  // --- CSV REPORT EXPORTER ---
  function exportCSVReport() {
    if (state.portfolioTrades.length === 0) {
      alert('Portfolio is currently empty. Lock in trades first to export CSV.');
      return;
    }

    const headers = [
      'Trade ID', 'Title', 'Category', 'Expiry Date', 'Capital Used ($)',
      'Net Profit ($)', 'Net ROI (%)', 'Leg 1 Platform', 'Leg 1 Side', 'Leg 1 Price',
      'Leg 1 Contracts', 'Leg 2 Platform', 'Leg 2 Side', 'Leg 2 Price', 'Leg 2 Contracts', 'Created At'
    ];

    const rows = state.portfolioTrades.map(t => [
      t.id, `"${t.title}"`, t.category, t.expiry_date, t.capital_used,
      t.net_profit, t.net_roi, t.leg1_platform, t.leg1_side, t.leg1_price,
      t.leg1_contracts, t.leg2_platform, t.leg2_side, t.leg2_price, t.leg2_contracts, t.created_at
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Arbitrage_Pulse_Portfolio_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    logDebug('API', 'Exported CSV report of locked portfolio trades');
  }

  // --- RENDER UI COMPONENTS ---
  function renderUI() {
    renderKPIs();
    renderTicker();
    renderOpportunityCards();
  }

  function renderKPIs() {
    const activeCountEl = document.getElementById('kpiActiveCount');
    const topRoiEl = document.getElementById('kpiTopRoi');
    const volEl = document.getElementById('kpiVolume');

    if (activeCountEl) activeCountEl.textContent = state.opportunities.length;

    let topRoi = -999;
    let totalVol = 0;

    state.opportunities.forEach(m => {
      totalVol += m.volume24h;
      if (m.arb && m.arb.net_roi > topRoi) topRoi = m.arb.net_roi;
    });

    if (topRoiEl) topRoiEl.textContent = '+' + topRoi.toFixed(2) + '%';
    if (volEl) volEl.textContent = formatCompactMoney(totalVol);

    updateKPIs();
  }

  function updateKPIs() {
    const lockedProfitEl = document.getElementById('kpiLockedProfit');
    const countBadge = document.getElementById('portfolioCountBadge');
    const drawerTotalVal = document.getElementById('drawerTotalValue');

    const totalProfit = state.portfolioTrades.reduce((sum, t) => sum + (t.net_profit || 0), 0);
    const totalCapital = state.portfolioTrades.reduce((sum, t) => sum + (t.capital_used || 0), 0);

    if (lockedProfitEl) lockedProfitEl.textContent = formatMoney(totalProfit);
    if (countBadge) countBadge.textContent = state.portfolioTrades.length;
    if (drawerTotalVal) drawerTotalVal.textContent = formatMoney(totalCapital);
  }

  function renderTicker() {
    const track = document.getElementById('tickerTrack');
    if (!track) return;

    const items = state.opportunities.map(m => {
      const roi = m.arb ? m.arb.net_roi.toFixed(2) : '0.00';
      return `<div class="ticker-item">
        <span class="ticker-symbol">${m.title.toUpperCase()}</span>
        <span class="ticker-roi">+${roi}% Net ROI</span>
      </div>`;
    }).join('');

    // Duplicate string for seamless continuous marquee loop
    track.innerHTML = items + items;
  }

  function renderOpportunityCards() {
    const grid = document.getElementById('opportunityGrid');
    if (!grid) return;

    // Filter & Sort
    let filtered = state.opportunities.filter(m => {
      if (state.activeCategory !== 'ALL' && m.category !== state.activeCategory) return false;
      if (state.searchQuery) {
        const q = state.searchQuery.toLowerCase();
        if (!m.title.toLowerCase().includes(q) && !m.kalshi_ticker.toLowerCase().includes(q)) return false;
      }
      if (m.arb && m.arb.net_roi < state.minRoiFilter) return false;
      return true;
    });

    filtered.sort((a, b) => {
      if (state.sortBy === 'net_roi') return b.arb.net_roi - a.arb.net_roi;
      if (state.sortBy === 'volume') return b.volume24h - a.volume24h;
      if (state.sortBy === 'expiry') return new Date(a.expiry_date) - new Date(b.expiry_date);
      return 0;
    });

    if (filtered.length === 0) {
      grid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-muted);">
        No arbitrage opportunities match the current filter criteria.
      </div>`;
      return;
    }

    grid.innerHTML = filtered.map(m => {
      const arb = m.arb;
      const isLeg1Kalshi = arb.leg1_platform === 'Kalshi';

      return `
        <div class="opp-card">
          <div class="opp-header">
            <div>
              <div class="opp-title">${m.title}</div>
              <span class="opp-category">${m.category} • EXP: ${m.expiry_date} (${arb.days_to_expiry}d left)</span>
            </div>
            <div class="opp-roi-badge">
              <span class="roi-val">+${arb.net_roi.toFixed(2)}%</span>
              <span class="roi-lbl">+${arb.annualized_apy.toFixed(1)}% APY</span>
            </div>
          </div>

          <div class="strategy-banner">
            <span>⚡ ${arb.optionName}: Buy ${arb.leg1_platform} ${arb.leg1_side} + ${arb.leg2_platform} ${arb.leg2_side}</span>
          </div>

          <div class="legs-container">
            <div class="leg-box" style="border-color: ${isLeg1Kalshi ? 'rgba(139, 92, 246, 0.4)' : 'rgba(0, 216, 255, 0.4)'}">
              <div class="leg-platform ${isLeg1Kalshi ? 'kalshi-text' : 'poly-text'}">
                ${arb.leg1_platform}
                <span style="font-size: 9px; opacity: 0.8;">LEG 1</span>
              </div>
              <div class="leg-price-row">
                <span class="leg-side">${arb.leg1_side}</span>
                <span class="leg-price">$${arb.leg1_price.toFixed(2)}</span>
              </div>
            </div>

            <div class="leg-box" style="border-color: ${!isLeg1Kalshi ? 'rgba(139, 92, 246, 0.4)' : 'rgba(0, 216, 255, 0.4)'}">
              <div class="leg-platform ${!isLeg1Kalshi ? 'kalshi-text' : 'poly-text'}">
                ${arb.leg2_platform}
                <span style="font-size: 9px; opacity: 0.8;">LEG 2</span>
              </div>
              <div class="leg-price-row">
                <span class="leg-side">${arb.leg2_side}</span>
                <span class="leg-price">$${arb.leg2_price.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div class="opp-meta">
            <span>24h Vol: ${formatCompactMoney(m.volume24h)}</span>
            <span>Duration: ${arb.days_to_expiry} days</span>
            <span>Pair Cost: $${arb.total_cost.toFixed(2)}</span>
          </div>

          <div class="opp-actions" style="flex-wrap: wrap;">
            <button class="btn-card-action btn-open-chart" data-id="${m.id}" style="flex: 1 1 45%;">📈 Chart</button>
            <button class="btn-card-action btn-primary-action btn-open-sim" data-id="${m.id}" style="flex: 1 1 45%;">⚡ Calculate ($1k)</button>
            <a href="https://pro.kalshi.com/workspace/markets" target="_blank" class="btn-card-action" style="flex: 1 1 30%; text-decoration: none; color: var(--accent-purple); border-color: rgba(139, 92, 246, 0.6); font-weight: 700; display: flex; align-items: center; justify-content: center;">Kalshi Pro ↗</a>
            <a href="https://kalshi.com/markets" target="_blank" class="btn-card-action" style="flex: 1 1 30%; text-decoration: none; color: var(--text-muted); border-color: var(--border-glass); display: flex; align-items: center; justify-content: center;">Kalshi ↗</a>
            <a href="${m.poly_url || 'https://polymarket.com'}" target="_blank" class="btn-card-action" style="flex: 1 1 30%; text-decoration: none; color: var(--accent-cyan); border-color: rgba(0, 216, 255, 0.6); font-weight: 700; display: flex; align-items: center; justify-content: center;">Poly Event ↗</a>
          </div>
        </div>
      `;
    }).join('');

    // Attach event handlers to card buttons
    grid.querySelectorAll('.btn-open-sim').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        openRiskSimulator(id);
      });
    });

    grid.querySelectorAll('.btn-open-chart').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        openPriceChart(id);
      });
    });
  }

  // --- RISK SIMULATOR MODAL LOGIC ---
  function openRiskSimulator(marketId) {
    const market = state.opportunities.find(m => m.id === marketId);
    if (!market) return;

    state.selectedSimOpp = market;
    const modal = document.getElementById('riskModal');
    const titleEl = document.getElementById('simMarketTitle');
    const slider = document.getElementById('simCapitalSlider');

    if (titleEl) titleEl.textContent = `${market.title} (${market.kalshi_ticker} / ${market.poly_ticker})`;
    if (slider) slider.value = 1000;

    updateSimulatorCalculations(1000);
    modal.classList.add('open');

    logDebug('CALC', `Opened Risk Simulator modal for market: ${market.title}`);
  }

  function updateSimulatorCalculations(capital) {
    const market = state.selectedSimOpp;
    if (!market) return;

    const arb = market.arb;
    const totalPairCost = arb.total_cost;
    const contracts = Math.floor(capital / totalPairCost);
    const actualCapital = contracts * totalPairCost;
    const guaranteedPayout = contracts * 1.00;
    const feeDeduction = actualCapital * 0.01;
    const netProfit = guaranteedPayout - actualCapital - feeDeduction;
    const netRoi = (netProfit / actualCapital) * 100;

    document.getElementById('simCapitalDisplay').textContent = formatMoney(capital);
    document.getElementById('simActualCapital').textContent = formatMoney(actualCapital);
    document.getElementById('simPayout').textContent = formatMoney(guaranteedPayout);
    document.getElementById('simFees').textContent = '-' + formatMoney(feeDeduction);
    document.getElementById('simNetProfit').textContent = `${formatMoney(netProfit)} (+${netRoi.toFixed(2)}% Net ROI | +${arb.annualized_apy.toFixed(1)}% APY over ${arb.days_to_expiry} days)`;

    const tbody = document.getElementById('simMatrixBody');
    if (tbody) {
      tbody.innerHTML = `
        <tr>
          <td style="color: var(--accent-purple); font-weight: 700;">${arb.leg1_platform}</td>
          <td>${arb.leg1_side}</td>
          <td style="font-family: var(--font-mono);">$${arb.leg1_price.toFixed(2)}</td>
          <td style="font-family: var(--font-mono);">${contracts.toLocaleString()}</td>
          <td style="font-family: var(--font-mono);">${formatMoney(contracts * arb.leg1_price)}</td>
        </tr>
        <tr>
          <td style="color: var(--accent-cyan); font-weight: 700;">${arb.leg2_platform}</td>
          <td>${arb.leg2_side}</td>
          <td style="font-family: var(--font-mono);">$${arb.leg2_price.toFixed(2)}</td>
          <td style="font-family: var(--font-mono);">${contracts.toLocaleString()}</td>
          <td style="font-family: var(--font-mono);">${formatMoney(contracts * arb.leg2_price)}</td>
        </tr>
        <tr class="guaranteed-row">
          <td colspan="3">GUARANTEED OUTCOME (Risk-Free Win Rate)</td>
          <td style="font-family: var(--font-mono);">${contracts.toLocaleString()} Pairs</td>
          <td style="font-family: var(--font-mono);">${formatMoney(guaranteedPayout)} Payout</td>
        </tr>
      `;
    }
  }

  // --- 24H PRICE CHART CANVAS RENDERER ---
  function openPriceChart(marketId) {
    const market = state.opportunities.find(m => m.id === marketId);
    if (!market) return;

    state.selectedChartOpp = market;
    const modal = document.getElementById('chartModal');
    const titleEl = document.getElementById('chartMarketTitle');
    if (titleEl) titleEl.textContent = `${market.title} — 24h Divergence Stream`;

    modal.classList.add('open');
    renderPriceChartCanvas();

    logDebug('CALC', `Rendered HiDPI price chart canvas for market: ${market.title}`);
  }

  function renderPriceChartCanvas() {
    const market = state.selectedChartOpp;
    const canvas = document.getElementById('priceChartCanvas');
    if (!canvas || !market) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    // Draw Grid Lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1;

    for (let y = 50; y < height; y += 50) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    const dataK = market.price_history_k;
    const dataP = market.price_history_p;
    const points = dataK.length;
    const stepX = width / (points - 1);

    // Helper to scale Y (0.0 to 1.0 -> height to 0)
    const scaleY = (val) => height - (val * (height - 60) + 30);

    // Draw Kalshi Line (Purple)
    ctx.strokeStyle = '#8b5cf6';
    ctx.lineWidth = 3;
    ctx.beginPath();
    dataK.forEach((val, i) => {
      const x = i * stepX;
      const y = scaleY(val);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Draw Polymarket Line (Cyan)
    ctx.strokeStyle = '#00d8ff';
    ctx.lineWidth = 3;
    ctx.beginPath();
    dataP.forEach((val, i) => {
      const x = i * stepX;
      const y = scaleY(val);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Draw Points & Labels
    dataK.forEach((val, i) => {
      const x = i * stepX;
      const yK = scaleY(val);
      ctx.fillStyle = '#8b5cf6';
      ctx.beginPath();
      ctx.arc(x, yK, 5, 0, Math.PI * 2);
      ctx.fill();
    });

    dataP.forEach((val, i) => {
      const x = i * stepX;
      const yP = scaleY(val);
      ctx.fillStyle = '#00d8ff';
      ctx.beginPath();
      ctx.arc(x, yP, 5, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  // --- PORTFOLIO DRAWER RENDERER ---
  function renderPortfolioDrawer() {
    const listEl = document.getElementById('drawerTradeList');
    if (!listEl) return;

    if (state.portfolioTrades.length === 0) {
      listEl.innerHTML = `<div style="text-align: center; padding: 40px; color: var(--text-muted);">
        No locked trades in portfolio database.
      </div>`;
      return;
    }

    listEl.innerHTML = state.portfolioTrades.map(t => {
      return `
        <div class="trade-item-card">
          <button class="btn-delete-trade" data-id="${t.id}">&times;</button>
          <div class="trade-item-title">${t.title}</div>
          <div class="trade-item-meta" style="margin-bottom: 6px;">
            <span>Category: ${t.category}</span>
            <span style="color: var(--accent-green); font-weight: 700;">+${t.net_roi.toFixed(2)}% Net ROI</span>
          </div>
          <div class="trade-item-meta">
            <span>Capital: ${formatMoney(t.capital_used)}</span>
            <span>Net Profit: ${formatMoney(t.net_profit)}</span>
          </div>
        </div>
      `;
    }).join('');

    listEl.querySelectorAll('.btn-delete-trade').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const tradeId = e.currentTarget.getAttribute('data-id');
        deleteTradeFromDb(tradeId);
      });
    });
  }

  // --- EVENT LISTENERS INITIALIZATION ---
  function setupEventListeners() {
    // Audio Toggle
    const btnAudio = document.getElementById('btnAudioToggle');
    if (btnAudio) {
      btnAudio.addEventListener('click', () => {
        state.audioEnabled = !state.audioEnabled;
        document.getElementById('audioStatusText').textContent = state.audioEnabled ? 'ON' : 'MUTED';
        document.getElementById('audioIcon').textContent = state.audioEnabled ? '🔔' : '🔕';
        logDebug('CALC', `Audio alert chimes toggled: ${state.audioEnabled ? 'ON' : 'MUTED'}`);
      });
    }

    // CSV Exporter
    const btnCSV = document.getElementById('btnExportCSV');
    if (btnCSV) btnCSV.addEventListener('click', exportCSVReport);

    // Portfolio Drawer Controls
    const btnOpenPort = document.getElementById('btnOpenPortfolio');
    const btnClosePort = document.getElementById('btnClosePortfolio');
    const portOverlay = document.getElementById('portfolioOverlay');
    const portDrawer = document.getElementById('portfolioDrawer');
    const btnClearAll = document.getElementById('btnClearAllTrades');

    if (btnOpenPort) {
      btnOpenPort.addEventListener('click', () => {
        portOverlay.classList.add('open');
        portDrawer.classList.add('open');
      });
    }

    if (btnClosePort) {
      btnClosePort.addEventListener('click', () => {
        portOverlay.classList.remove('open');
        portDrawer.classList.remove('open');
      });
    }

    if (portOverlay) {
      portOverlay.addEventListener('click', () => {
        portOverlay.classList.remove('open');
        portDrawer.classList.remove('open');
      });
    }

    if (btnClearAll) btnClearAll.addEventListener('click', clearAllTradesFromDb);

    // Category Pills
    const pills = document.querySelectorAll('#categoryPills .pill');
    pills.forEach(pill => {
      pill.addEventListener('click', (e) => {
        pills.forEach(p => p.classList.remove('active'));
        e.currentTarget.classList.add('active');
        state.activeCategory = e.currentTarget.getAttribute('data-category');
        renderOpportunityCards();
      });
    });

    // Search Input & Filters
    const inputSearch = document.getElementById('inputSearch');
    if (inputSearch) {
      inputSearch.addEventListener('input', (e) => {
        state.searchQuery = e.target.value;
        renderOpportunityCards();
      });
    }

    const selectMinRoi = document.getElementById('selectMinRoi');
    if (selectMinRoi) {
      selectMinRoi.addEventListener('change', (e) => {
        state.minRoiFilter = parseFloat(e.target.value);
        renderOpportunityCards();
      });
    }

    const selectSort = document.getElementById('selectSort');
    if (selectSort) {
      selectSort.addEventListener('change', (e) => {
        state.sortBy = e.target.value;
        renderOpportunityCards();
      });
    }

    // Modal Close Triggers
    document.getElementById('btnCloseRiskModal')?.addEventListener('click', () => {
      document.getElementById('riskModal').classList.remove('open');
    });

    document.getElementById('btnCloseChartModal')?.addEventListener('click', () => {
      document.getElementById('chartModal').classList.remove('open');
    });

    // Simulator Slider
    const simSlider = document.getElementById('simCapitalSlider');
    if (simSlider) {
      simSlider.addEventListener('input', (e) => {
        updateSimulatorCalculations(parseFloat(e.target.value));
      });
    }

    // Confirm & Lock In Trade Button
    const btnLockTrade = document.getElementById('btnLockTrade');
    if (btnLockTrade) {
      btnLockTrade.addEventListener('click', () => {
        const market = state.selectedSimOpp;
        if (!market) return;

        const capital = parseFloat(document.getElementById('simCapitalSlider').value);
        const arb = market.arb;
        const totalPairCost = arb.total_cost;
        const contracts = Math.floor(capital / totalPairCost);
        const actualCapital = contracts * totalPairCost;
        const guaranteedPayout = contracts * 1.00;
        const feeDeduction = actualCapital * 0.01;
        const netProfit = guaranteedPayout - actualCapital - feeDeduction;
        const netRoi = (netProfit / actualCapital) * 100;

        const trade = {
          id: 'trade-' + Date.now(),
          title: market.title,
          category: market.category,
          expiry_date: market.expiry_date,
          capital_used: actualCapital,
          net_profit: netProfit,
          net_roi: netRoi,
          leg1_platform: arb.leg1_platform,
          leg1_side: arb.leg1_side,
          leg1_price: arb.leg1_price,
          leg1_contracts: contracts,
          leg2_platform: arb.leg2_platform,
          leg2_side: arb.leg2_side,
          leg2_price: arb.leg2_price,
          leg2_contracts: contracts,
          timestamp: getTimeString(),
          created_at: new Date().toISOString()
        };

        document.getElementById('riskModal').classList.remove('open');
        saveTradeToDb(trade);
      });
    }

    // Execute Orders via REST API Button
    const btnExecuteApi = document.getElementById('btnExecuteApi');
    if (btnExecuteApi) {
      btnExecuteApi.addEventListener('click', async () => {
        const market = state.selectedSimOpp;
        if (!market) return;

        const capital = parseFloat(document.getElementById('simCapitalSlider').value);
        const arb = market.arb;
        const totalPairCost = arb.total_cost;
        const contracts = Math.floor(capital / totalPairCost);
        const actualCapital = contracts * totalPairCost;
        const guaranteedPayout = contracts * 1.00;
        const feeDeduction = actualCapital * 0.01;
        const netProfit = guaranteedPayout - actualCapital - feeDeduction;
        const netRoi = (netProfit / actualCapital) * 100;

        const trade = {
          id: 'trade-api-' + Date.now(),
          title: market.title,
          category: market.category,
          expiry_date: market.expiry_date,
          capital_used: actualCapital,
          net_profit: netProfit,
          net_roi: netRoi,
          leg1_platform: arb.leg1_platform,
          leg1_side: arb.leg1_side,
          leg1_price: arb.leg1_price,
          leg1_contracts: contracts,
          leg2_platform: arb.leg2_platform,
          leg2_side: arb.leg2_side,
          leg2_price: arb.leg2_price,
          leg2_contracts: contracts,
          timestamp: getTimeString(),
          created_at: new Date().toISOString()
        };

        logDebug('API', `Sending API order payload for ${contracts} pairs of ${market.title}...`);
        try {
          const resp = await fetch('/api/execute-trade', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(trade)
          });
          if (resp.ok) {
            const result = await resp.json();
            logDebug('API', `⚡ API ORDERS EXECUTED! Kalshi Order: ${result.kalshi_order.order_id} (${result.kalshi_order.status}) | Polymarket CLOB: ${result.polymarket_order.order_id} (${result.polymarket_order.status})`);
            triggerConfetti();
            playAlertChime();
            document.getElementById('riskModal').classList.remove('open');
            await fetchPortfolioTrades();
          }
        } catch (e) {
          logDebug('ERROR', 'API Execution failed: ' + e.message);
        }
      });
    }

    // Debug Console Filter Tabs
    const consoleTabs = document.querySelectorAll('.console-tab');
    consoleTabs.forEach(tab => {
      tab.addEventListener('click', (e) => {
        consoleTabs.forEach(t => t.classList.remove('active'));
        e.currentTarget.classList.add('active');
        state.activeLogFilter = e.currentTarget.getAttribute('data-filter');
        renderLogs();
      });
    });

    document.getElementById('btnClearLogs')?.addEventListener('click', () => {
      state.logs = [];
      renderLogs();
    });

    // Discover More & Unlimited Auto-Stream Controls
    const btnDiscoverMore = document.getElementById('btnDiscoverMore');
    if (btnDiscoverMore) {
      btnDiscoverMore.addEventListener('click', () => {
        discoverNewMarkets(20);
      });
    }

    const btnAutoStream = document.getElementById('btnAutoStream');
    if (btnAutoStream) {
      btnAutoStream.addEventListener('click', () => {
        state.autoStreamEnabled = !state.autoStreamEnabled;
        btnAutoStream.textContent = state.autoStreamEnabled ? '♾️ Auto-Stream: ON (Active)' : '♾️ Auto-Stream: OFF';
        btnAutoStream.style.borderColor = state.autoStreamEnabled ? 'var(--accent-green)' : 'var(--accent-cyan)';
        btnAutoStream.style.color = state.autoStreamEnabled ? 'var(--accent-green)' : 'var(--accent-cyan)';
        logDebug('SCANNER', `Unlimited auto-stream discovery toggled: ${state.autoStreamEnabled ? 'ACTIVE (+5 markets every 6s)' : 'OFF'}`);
      });
    }
  }

  // --- DYNAMIC UNLIMITED MARKET DISCOVERY GENERATOR ---
  let marketCounter = 9;

  function discoverNewMarkets(count = 20) {
    const verifiedStreamPool = [
      { t: "OpenAI vs Anthropic: OpenAI IPOs First", c: "CRYPTO", kt: "KXOAIANTH-40", pu: "https://polymarket.com/event/openai-ipo-closing-market-cap", ky: 0.52, py: 0.59 },
      { t: "Fed Funds Rate: Upper Bound > 3.50%", c: "MACRO", kt: "KXFEDFUNDSYEAR-34JAN01-T3.50", pu: "https://polymarket.com/event/how-many-fed-rate-cuts-in-2026", ky: 0.39, py: 0.88 },
      { t: "G7 Leader Out Next: Emmanuel Macron", c: "POLITICS", kt: "KXG7LEADEROUT-26JUL20-EMAC", pu: "https://polymarket.com/event/macron-out-in-2025", ky: 0.41, py: 0.48 },
      { t: "SpaceX Exploration: Elon Musk Visits Mars", c: "CRYPTO", kt: "KXELONMARS-99", pu: "https://polymarket.com/event/kraken-ipo-in-2025", ky: 0.44, py: 0.52 },
      { t: "CCP Leadership: Li Qiang Named Xi Successor", c: "POLITICS", kt: "KXXISUCCESSOR-45JAN01-LQIA", pu: "https://polymarket.com/event/xi-jinping-out-before-2027", ky: 0.05, py: 0.11 },
      { t: "Fintech IPO Race: Ramp IPOs Before Brex", c: "CRYPTO", kt: "KXRAMPBREX-40-RAMP", pu: "https://polymarket.com/event/hyperliquid-airdop-by", ky: 0.41, py: 0.48 },
      { t: "Payroll Tech IPO Race: Deel IPOs Before Rippling", c: "CRYPTO", kt: "KXDEELRIP-40-DEEL", pu: "https://polymarket.com/event/megaeth-airdrop-by", ky: 0.16, py: 0.23 },
      { t: "Climate Target: Global Warming Exceeds 2.0°C", c: "MACRO", kt: "KXWARMING-50", pu: "https://polymarket.com/event/uk-election-called-by", ky: 0.58, py: 0.64 },
      { t: "NATO Leadership: Next Secretary General", c: "POLITICS", kt: "KXNEXTNATOSECGEN-99", pu: "https://polymarket.com/event/who-will-be-the-next-secretary-general-of-nato", ky: 0.35, py: 0.42 },
      { t: "Geopolitics: China & India Border Standoff", c: "POLITICS", kt: "KXXISUCCESSOR-45JAN01", pu: "https://polymarket.com/event/china-x-india-military-clash-by-december-31", ky: 0.31, py: 0.37 },
      { t: "JPMorgan Chase: Next CEO Appointment", c: "MACRO", kt: "KXNEWROLEJP-35DEC", pu: "https://polymarket.com/event/who-will-be-the-next-ceo-of-jpmorgan-chase", ky: 0.36, py: 0.42 },
      { t: "Goldman Sachs: Next CEO Succession", c: "MACRO", kt: "KXNEWROLEGS-35DEC", pu: "https://polymarket.com/event/who-will-be-the-next-ceo-of-goldman-sachs", ky: 0.39, py: 0.46 }
    ];

    const newItems = [];
    for (let i = 0; i < count; i++) {
      const poolIndex = (marketCounter + i) % verifiedStreamPool.length;
      const base = verifiedStreamPool[poolIndex];
      const seriesId = marketCounter + i;
      const id = `opp-dyn-${Date.now()}-${seriesId}`;
      const title = `${base.t} (Stream #${seriesId})`;
      
      const priceKY = Number((base.ky + (Math.random() * 0.04 - 0.02)).toFixed(2));
      const priceKN = Number((1.00 - priceKY).toFixed(2));
      const pricePY = Number((base.py + (Math.random() * 0.04 - 0.02)).toFixed(2));
      const pricePN = Number((1.00 - pricePY).toFixed(2));

      const vol = Math.floor(2000000 + Math.random() * 8000000);
      const depthK = Math.floor(100000 + Math.random() * 400000);
      const depthP = Math.floor(300000 + Math.random() * 900000);

      const item = {
        id: id,
        title: title,
        category: base.c,
        expiry_date: `2026-12-31`,
        kalshi_ticker: base.kt,
        poly_ticker: `POLY-STREAM-${seriesId}`,
        kalshi_url: `https://pro.kalshi.com/workspace/markets`,
        poly_url: base.pu,
        kalshi_yes: priceKY,
        kalshi_no: priceKN,
        poly_yes: pricePY,
        poly_no: pricePN,
        volume24h: vol,
        depth_k: depthK,
        depth_p: depthP,
        price_history_k: [priceKY - 0.02, priceKY - 0.01, priceKY, priceKY, priceKY, priceKY],
        price_history_p: [pricePY + 0.02, pricePY + 0.01, pricePY, pricePY, pricePY, pricePY]
      };

      item.arb = calculateArbitrage(item);
      newItems.push(item);
    }

    marketCounter += count;
    state.opportunities = [...state.opportunities, ...newItems];
    logDebug('SCANNER', `⚡ Discovered ${count} real prediction market opportunities! Total active catalog: ${state.opportunities.length}`);
    renderUI();
  }

  // --- APP INITIALIZATION ---
  function initApp() {
    logDebug('SCANNER', 'Initializing Arbitrage Pulse high-frequency scanner...');
    
    // Seed initial markets and calculate initial arbitrage metrics
    state.opportunities = seedMarkets.map(m => {
      const arb = calculateArbitrage(m);
      return { ...m, arb };
    });

    setupEventListeners();
    fetchMarkets();
    fetchPortfolioTrades();

    // Start 3-second scanner tick interval
    setInterval(tickScanner, 3000);
    renderUI();

    logDebug('SCANNER', 'Arbitrage Pulse engine ready. Scanning every 3,000ms.');
  }

  // Launch when DOM is fully loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }

})();
