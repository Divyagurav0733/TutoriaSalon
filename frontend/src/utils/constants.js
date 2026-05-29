// ── Brand Colors — New Palette ────────────────────────────────────────────────
export const C = {
  dark:    "#1a1423",   // deep dark plum — darkest bg, footers
  deep:    "#372549",   // rich eggplant — primary brand color
  mauve:   "#774c60",   // dusty mauve — secondary / accents
  rose:    "#b75d69",   // warm rose — CTAs, highlights
  blush:   "#eacdc2",   // soft blush — light bg / cream
  // aliases used widely across existing code
  cream:   "#eacdc2",
  lavender:"#e2cdd8",   // derived light mauve tint
  pink:    "#b75d69",
  purple:  "#372549",
  navy:    "#1a1423",
};

// ── Services ──────────────────────────────────────────────────────────────────
export const SERVICES = {
  female: [
    { id: "f1", name: "Hair Cut & Styling",  price: 650,  duration: 60  },
    { id: "f2", name: "Hair Colour (Full)",  price: 2500, duration: 120 },
    { id: "f3", name: "Keratin Treatment",   price: 4500, duration: 180},
    { id: "f4", name: "Facial & Cleanup",    price: 800,  duration: 60 },
    { id: "f5", name: "Bridal Makeup",       price: 8000, duration: 180 },
    { id: "c1", name: "Head Massage",        price: 400,  duration: 30 },
    { id: "c2", name: "Manicure",            price: 350,  duration: 45 },
    { id: "c3", name: "Pedicure",            price: 450,  duration: 60 },
  ],
  male: [
    { id: "m1", name: "Hair Cut",            price: 250,  duration: 30 },
    { id: "m2", name: "Beard Trim & Shape",  price: 200,  duration: 30 },
    { id: "m3", name: "Hair Colour",         price: 800,  duration: 60 },
    { id: "m4", name: "D-Tan & Cleanup",     price: 600,  duration: 60 },
    { id: "c1", name: "Head Massage",        price: 400,  duration: 30 },
    { id: "c2", name: "Manicure",            price: 350,  duration: 45 },
    { id: "c3", name: "Pedicure",            price: 450,  duration: 60 },
  ],
};

export const COMMON_SERVICE_IDS = ["c1", "c2", "c3"];

export const SERVICE_MAP = {};
[...SERVICES.female, ...SERVICES.male].forEach((s) => {
  SERVICE_MAP[s.id] = s;
});

export const DAY_NAMES   = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
export const MONTH_NAMES = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
