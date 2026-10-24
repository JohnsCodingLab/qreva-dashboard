// Bank names come back from SafeHaven's bank list in full legal form
// ("MONIEPOINT MICROFINANCE BANK", "OPAY DIGITAL SERVICES LIMITED"), which is
// far too long for a table cell that also has to show the account holder's
// name. These shorten to what people actually call the bank.

// Names that can't be derived by stripping suffixes - "FIRST BANK OF NIGERIA"
// would become "FIRST OF NIGERIA" and "GUARANTY TRUST BANK" would lose the
// initialism everyone actually uses.
const BANK_NAME_ALIASES = {
  "FIRST BANK OF NIGERIA": "First Bank",
  "GUARANTY TRUST BANK": "GTBank",
  "UNITED BANK FOR AFRICA": "UBA",
  "FIRST CITY MONUMENT BANK": "FCMB",
  "STANDARD CHARTERED BANK": "Standard Chartered",
  "STANBIC IBTC BANK": "Stanbic IBTC",
  "PREMIUM TRUST BANK": "PremiumTrust",
  "SUNTRUST BANK": "SunTrust",
  "PAYCOM (OPAY)": "OPay",
  "OPAY DIGITAL SERVICES": "OPay",
  "KUDA MICROFINANCE BANK": "Kuda",
};

// Stripped only when they trail the name, so "FIRST BANK OF NIGERIA" keeps its
// middle "BANK" while "ZENITH BANK" correctly becomes "ZENITH".
const TRAILING_NOISE = [
  "MICROFINANCE BANK",
  "MICROFINANCE",
  "DIGITAL SERVICES",
  "COMMERCIAL BANK",
  "MERCHANT BANK",
  "MFB",
  "PLC",
  "LIMITED",
  "LTD",
  "NIGERIA",
  "BANK",
];

export const abbreviateBankName = (name) => {
  if (!name || typeof name !== "string") return name || "";

  let result = name.trim().replace(/\s+/g, " ");
  const alias = BANK_NAME_ALIASES[result.toUpperCase()];
  if (alias) return alias;

  // Repeat so stacked suffixes collapse: "OPAY DIGITAL SERVICES LIMITED"
  // drops LIMITED, then DIGITAL SERVICES.
  let changed = true;
  while (changed) {
    changed = false;
    for (const suffix of TRAILING_NOISE) {
      const pattern = new RegExp(`\\s+${suffix}$`, "i");
      // Never strip down to nothing - a bank literally named "Bank" or a
      // one-word name should survive intact.
      if (pattern.test(result) && result.replace(pattern, "").trim()) {
        result = result.replace(pattern, "").trim();
        changed = true;
      }
    }
    const aliasAfterStrip = BANK_NAME_ALIASES[result.toUpperCase()];
    if (aliasAfterStrip) return aliasAfterStrip;
  }

  return result;
};
