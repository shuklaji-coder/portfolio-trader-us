export interface CityPin {
  id: string;
  name: string;
  country: string;
  lat: number;
  lng: number;
  marketSession: string;
  note: string;
  photoUrl?: string;
}

export interface MarketContract {
  ticker: string;
  name: string;
  category: string;
  description: string;
  specs: {
    tickValue: string;
    pointValue: string;
    volatility: string;
    tradingHours: string;
  };
  sampleChartData: number[];
}

export interface PlanStep {
  step: string;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  patternName: string;
  patternType: "fvg" | "orderblock" | "bos" | "liquidity";
}

export interface PropPartner {
  name: string;
  slug: string;
  discountCode: string;
  offerBadge: string;
  description: string;
  features: string[];
  referralUrl: string;
  affiliateNotice: string;
  gradient: string;
}

export interface StatItem {
  label: string;
  value: number;
  suffix: string;
  subtext: string;
}

export const siteConfig = {
  name: "WayTrades",
  legalName: "Waylon Skinner",
  handle: "@way_trades",
  tagline: "I look at candlesticks and travel the world.",
  subHeadline: "ES • NQ • Futures • Options",
  bio: "Full-time independent futures trader specializing in CME equity index contracts (E-mini & Micro S&P 500, Nasdaq 100). Blending institutional liquidity concepts, algorithmic execution windows, and a location-independent lifestyle.",
  extendedBio: "Trading shouldn't lock you to a dark room with twelve monitors. By focusing on high-conviction NY morning session liquidity setups, I execute with pinpoint precision, manage risk relentlessly, and spend the rest of my days exploring the globe.",
  avatarUrl: "/images/trader-avatar.jpg",
  
  seo: {
    title: "WayTrades | Waylon Skinner — Futures Trader & Digital Nomad",
    description: "Premium personal portfolio of Waylon Skinner (WayTrades). Trading S&P 500 & Nasdaq futures, building community, and exploring the globe.",
    keywords: [
      "WayTrades",
      "Waylon Skinner",
      "Futures Trading",
      "S&P 500 Futures",
      "ES",
      "MES",
      "NQ",
      "MNQ",
      "Nasdaq Trader",
      "Trading Community",
      "Digital Nomad Trader"
    ],
    url: "https://waytrades.com",
    ogImage: "/images/og-image.jpg"
  },

  colors: {
    background: "#040609",
    profit: "#00E5A0",
    loss: "#FF4D5E",
    gold: "#D4AF37",
    cyan: "#D4AF37",
    cardBg: "rgba(13, 17, 24, 0.8)",
    border: "rgba(212, 175, 55, 0.12)",
  },

  stats: [
    {
      label: "Instagram Community",
      value: 8600,
      suffix: "+",
      subtext: "Active daily traders & followers"
    },
    {
      label: "Countries Traded From",
      value: 24,
      suffix: "+",
      subtext: "From Bali cliffs to Tokyo highrises"
    },
    {
      label: "Discord Members",
      value: 3200,
      suffix: "+",
      subtext: "Free community sharing chart analysis"
    },
    {
      label: "Risk Discipline Focus",
      value: 100,
      suffix: "%",
      subtext: "Strict pre-calculated R:R on every trade"
    }
  ] as StatItem[],

  tickerTape: [
    { symbol: "ES", name: "E-mini S&P 500", price: 5886.25, change: 18.50, percent: 0.32, isUp: true },
    { symbol: "NQ", name: "E-mini Nasdaq 100", price: 20645.75, change: -42.25, percent: -0.20, isUp: false },
    { symbol: "MES", name: "Micro E-mini S&P", price: 5886.50, change: 18.25, percent: 0.31, isUp: true },
    { symbol: "MNQ", name: "Micro E-mini Nasdaq", price: 20646.00, change: -41.75, percent: -0.20, isUp: false },
    { symbol: "VIX", name: "Volatility Index", price: 15.12, change: -0.68, percent: -4.30, isUp: false },
    { symbol: "DXY", name: "US Dollar Index", price: 104.28, change: 0.14, percent: 0.13, isUp: true },
    { symbol: "GC", name: "Gold Futures", price: 2742.60, change: 9.80, percent: 0.36, isUp: true },
    { symbol: "CL", name: "Crude Oil Futures", price: 71.45, change: -0.85, percent: -1.18, isUp: false },
  ],

  markets: [
    {
      ticker: "S&P 500 (ES / MES)",
      name: "E-mini & Micro S&P 500",
      category: "Equities Benchmark",
      description: "The gold standard of world financial liquidity. Institutional order books, respected technical support/resistance, and smooth intraday price delivery for structured trading.",
      specs: {
        tickValue: "$12.50 (ES) / $1.25 (MES)",
        pointValue: "$50 (ES) / $5 (MES)",
        volatility: "Moderate & Methodical",
        tradingHours: "23 Hours / Day (CME Globex)"
      },
      sampleChartData: [5810, 5824, 5818, 5835, 5829, 5850, 5842, 5870, 5865, 5886]
    },
    {
      ticker: "Nasdaq 100 (NQ / MNQ)",
      name: "E-mini & Micro Nasdaq 100",
      category: "Tech Momentum Powerhouse",
      description: "High-beta powerhouse driven by global technology giants. Rapid expansion moves, surgical liquidity sweeps around the NY bell (9:30 AM EST), and superior trend velocity.",
      specs: {
        tickValue: "$5.00 (NQ) / $0.50 (MNQ)",
        pointValue: "$20 (NQ) / $2 (MNQ)",
        volatility: "High Velocity & Expansion",
        tradingHours: "23 Hours / Day (CME Globex)"
      },
      sampleChartData: [20320, 20450, 20380, 20580, 20490, 20710, 20620, 20800, 20680, 20645]
    }
  ] as MarketContract[],

  processSteps: [
    {
      step: "01",
      title: "Plan",
      subtitle: "Pre-Market Preparation",
      description: "Map key high-timeframe liquidity pools, mark session highs/lows, and align macro bias prior to the 9:30 AM New York opening bell. No guessing when candles print.",
      icon: "Compass",
      patternName: "Liquidity Map & Key POIs",
      patternType: "liquidity"
    },
    {
      step: "02",
      title: "Execute",
      subtitle: "Precision Entry & R:R",
      description: "Wait for the liquidity sweep, structure displacement, and entry confirmation in the Fair Value Gap (FVG) or Order Block. Fixed risk, pre-set target.",
      icon: "Crosshair",
      patternName: "Fair Value Gap (FVG) Trigger",
      patternType: "fvg"
    },
    {
      step: "03",
      title: "Review",
      subtitle: "Journal & Data Logging",
      description: "Capture the setup screenshot, evaluate trade execution versus the plan, log psychological discipline, and track statistical edge in the trading journal.",
      icon: "BookOpenCheck",
      patternName: "Post-Trade Analytics",
      patternType: "orderblock"
    },
    {
      step: "04",
      title: "Repeat",
      subtitle: "Unwavering Consistency",
      description: "Repeat the systematic routine every trading day. Walk away when your target is achieved or the day's risk limit is reached. Trade to live, not live to trade.",
      icon: "RefreshCw",
      patternName: "Compound Execution Discipline",
      patternType: "bos"
    }
  ] as PlanStep[],

  kremvo: {
    tagline: "Trade with a plan. Not emotions.",
    url: "https://www.kremvo.com/?utm_source=instagram&utm_medium=linktree",
    badge: "Recommended Journaling Tool"
  },

  cities: [
    {
      id: "bali",
      name: "Bali (Uluwatu)",
      country: "Indonesia",
      lat: -8.8150,
      lng: 115.0884,
      marketSession: "Asia Evening / NY Open (9:30 PM local)",
      note: "Scalping the 9:30 AM NY open from a cliffside villa overlooking the Indian Ocean swell."
    },
    {
      id: "tokyo",
      name: "Tokyo (Shibuya)",
      country: "Japan",
      lat: 35.6580,
      lng: 139.7016,
      marketSession: "London Session / Asia Close",
      note: "ES London breakout setups over iced matcha. High-speed fiber with neon cityscape views."
    },
    {
      id: "dubai",
      name: "Dubai (Downtown)",
      country: "United Arab Emirates",
      lat: 25.1972,
      lng: 55.2744,
      marketSession: "NY Afternoon / Europe Evening",
      note: "Dual monitor portable setup with Burj Khalifa backdrop. Perfect timezone for afternoon NY momentum."
    },
    {
      id: "london",
      name: "London (Mayfair)",
      country: "United Kingdom",
      lat: 51.5074,
      lng: -0.1278,
      marketSession: "London Open (8:00 AM GMT)",
      note: "Pre-NY liquidity grabs and morning macro news prints right by the financial capital."
    },
    {
      id: "new-york",
      name: "New York (Manhattan)",
      country: "United States",
      lat: 40.7128,
      lng: -74.0060,
      marketSession: "NY Open Primary (9:30 AM EST)",
      note: "Zero-latency connection direct to CME servers. The epicenter of global equity volume."
    },
    {
      id: "miami",
      name: "Miami (Brickell)",
      country: "United States",
      lat: 25.7617,
      lng: -80.1918,
      marketSession: "NY Open Primary (9:30 AM EST)",
      note: "Trading from the balcony over Biscayne Bay. Same timezone as Wall Street with ocean breeze."
    },
    {
      id: "lisbon",
      name: "Lisbon (Alfama)",
      country: "Portugal",
      lat: 38.7223,
      lng: -9.1393,
      marketSession: "Europe Mid-Session / US Open",
      note: "Pastel de nata and afternoon ES/NQ trends over terracotta rooftops."
    },
    {
      id: "singapore",
      name: "Singapore (Marina Bay)",
      country: "Singapore",
      lat: 1.2868,
      lng: 103.8545,
      marketSession: "Asia Morning / Overnight Futures",
      note: "Analyzing Globex overnight session depth from the tech hub of Southeast Asia."
    }
  ] as CityPin[],

  propPartners: [
    {
      name: "Alpha Futures",
      slug: "alpha-futures",
      discountCode: "WAY",
      offerBadge: "Exclusive Partner Offer",
      description: "Direct prop firm funding for disciplined futures traders. Scale up to $300,000 in funded buying power without putting your personal savings at risk.",
      features: [
        "Trading on ES, NQ, MES & MNQ contracts",
        "Fast payout processing & reliable platform support",
        "No hidden activation surprises",
        "Full support for NinjaTrader, Tradovate & TradingView"
      ],
      referralUrl: "https://app.alpha-futures.com/signup/WAY/",
      affiliateNotice: "Official Partner • Affiliate Link",
      gradient: "from-emerald-500/20 via-teal-500/10 to-transparent"
    },
    {
      name: "Tradeify",
      slug: "tradeify",
      discountCode: "WAY",
      offerBadge: "Official Partner Code",
      description: "Designed by traders for traders. Clean evaluation rules, zero minimum trading days on select plans, and transparent drawdown parameters.",
      features: [
        "Straightforward rules with trader-first guidelines",
        "Instant account delivery after evaluation",
        "Full CME futures data integration",
        "Consistent payout structures & dedicated support"
      ],
      referralUrl: "https://tradeify.co/?ref=way",
      affiliateNotice: "Official Partner • Affiliate Link",
      gradient: "from-cyan-500/20 via-blue-500/10 to-transparent"
    }
  ] as PropPartner[],

  community: {
    title: "Way Trades – Trading Community",
    subTitle: "Options + Futures • Free to join",
    description: "Join hundreds of ambitious traders who trade ES, NQ, and options daily. Live market commentary, chart breakdowns, risk management discussions, and real-time community engagement.",
    discordUrl: "https://discord.gg/HRm9eQuMed",
    highlights: [
      "Daily pre-market key levels & bias breakdown",
      "Live session voice chat & trade commentary",
      "Education channels on price action & risk control",
      "Supportive community with zero spam or ego"
    ]
  },

  socials: [
    {
      name: "Instagram",
      handle: "@way_trades",
      url: "https://www.instagram.com/way_trades",
      description: "Daily chart analysis, travel lifestyle & setup breakdowns"
    },
    {
      name: "YouTube",
      handle: "@waytrades",
      url: "https://www.youtube.com/@waytrades",
      description: "In-depth trading recaps, live trade executions & tutorials"
    },
    {
      name: "X (Twitter)",
      handle: "@way__trades",
      url: "https://x.com/way__trades",
      description: "Real-time thoughts, market sentiment & instant commentary"
    },
    {
      name: "Discord",
      handle: "WayTrades Community",
      url: "https://discord.gg/HRm9eQuMed",
      description: "Free trading community for futures & options"
    }
  ],

  extraLinks: [
    {
      name: "Celsius Affiliate",
      url: "https://club.co/@waylon_skinner/celsius/affiliate",
      description: "Fuel for high-intensity market opens and globe-trotting sessions"
    }
  ],

  disclaimer: "Trading futures, options, and foreign exchange involves substantial risk of loss and is not suitable for every investor. An investor could potentially lose all or more than the initial investment. Risk capital is money that can be lost without jeopardizing financial security or lifestyle. Content provided across all platforms is strictly for educational and entertainment purposes and must not be construed as financial or investment advice. Affiliate links may earn a commission at no additional cost to you."
};

