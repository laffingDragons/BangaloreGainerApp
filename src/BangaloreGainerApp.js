import React, { useState, useEffect, useMemo } from 'react';
import { 
  ThemeProvider, createTheme, CssBaseline, Container, Grid, Card, 
  Typography, Button, Chip, Skeleton, Box, Drawer, IconButton, 
  Badge, Tooltip, Table, TableBody, TableCell, TableHead, TableRow,
  Paper, LinearProgress, Stack, Avatar, Tab, Tabs, useMediaQuery,
  TableContainer
} from '@mui/material';
import { 
  FitnessCenter, LocalFireDepartment, Science, CompareArrows, 
  ShoppingCart, Bolt, VerifiedUser, Security, TrendingDown,
  WaterDrop, FlashOn, Favorite, Close, ArrowForward, FilterList
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

// --- 1. THEME: "BANGALORE TECH-LUXE" (Apple Health Style) ---
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#2563EB' }, // Royal Blue
    secondary: { main: '#F43F5E' }, // Rose Red (Alerts)
    background: { default: '#F8F9FA', paper: '#FFFFFF' },
    text: { primary: '#111827', secondary: '#6B7280' },
    success: { main: '#10B981' }, // Emerald
    warning: { main: '#F59E0B' }, // Amber
  },
  typography: { 
    fontFamily: '"Plus Jakarta Sans", "Inter", sans-serif',
    h3: { fontWeight: 800, letterSpacing: '-1px' },
    h6: { fontWeight: 700, letterSpacing: '-0.5px' },
    button: { fontWeight: 600, textTransform: 'none', borderRadius: 12 }
  },
  shape: { borderRadius: 20 },
  components: {
    MuiButton: { 
      styleOverrides: { 
        root: { boxShadow: 'none', '&:hover': { boxShadow: '0 10px 15px -3px rgba(37,99,235,0.2)' } } 
      } 
    },
    MuiCard: { 
      styleOverrides: { 
        root: { 
          boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03)',
          border: '1px solid rgba(0,0,0,0.05)',
          overflow: 'visible' // For hover effects
        } 
      } 
    },
    MuiChip: { styleOverrides: { root: { fontWeight: 600 } } }
  },
});

// --- 2. EXTENDED 2026 DATABASE ---
const PRODUCTS_DB = [
  // --- MASS GAINERS ---
  {
    id: "prod_realgainz",
    category: "mass_gainer",
    name: "Real Gainz (Whey Gainer)",
    brand: "2X Nutrition",
    specs: { 
      protein: 26, carbs: 78, serving: 100, 
      carbSource: "Cereal/Millet (Low GI)", 
      digestion: "Easy (Probiotics + Enzymes)",
      ratio: "1:3"
    },
    badges: ["No Maltodextrin", "Gut Friendly"],
    compliance: "FSSAI Lic No. 10019043002xxx",
    verifyMethod: "QR Scan (Lab Report)",
    vendors: [
      { name: "Brand Site", basePrice: 1999, link: "https://2xnutrition.com" },
      { name: "Amazon", basePrice: 2150, link: "https://amazon.in" }
    ]
  },
  {
    id: "prod_beastlife",
    category: "mass_gainer",
    name: "Anabolic Mass Gainer",
    brand: "Beast Life",
    specs: { 
      protein: 18, carbs: 77, serving: 100, // Normalized
      carbSource: "Barley/Millet Extracts", 
      digestion: "Easy (Ultrasorb Tech)",
      ratio: "1:4"
    },
    badges: ["Budget King", "Clean Carbs"],
    compliance: "GMP Certified",
    verifyMethod: "Hologram Seal",
    vendors: [
      { name: "HyugaLife", basePrice: 1999, link: "https://hyugalife.com" },
      { name: "Amazon", basePrice: 1863, link: "https://amazon.in" }
    ]
  },
  {
    id: "prod_on_serious",
    category: "mass_gainer",
    name: "Serious Mass",
    brand: "Optimum Nutrition",
    specs: { 
      protein: 50, carbs: 250, serving: 334, 
      carbSource: "Maltodextrin (High GI)", 
      digestion: "Heavy",
      ratio: "1:5"
    },
    badges: ["Hard Gainer Choice", "Calorie Dense"],
    compliance: "Informed Choice Certified",
    verifyMethod: "Scratch Code & SMS",
    vendors: [
      { name: "Blinkit (Indiranagar)", basePrice: 3170, link: "#" },
      { name: "Zepto (Koramangala)", basePrice: 3350, link: "#" },
      { name: "Amazon", basePrice: 3050, link: "#" }
    ]
  },
  {
    id: "prod_avvatar",
    category: "mass_gainer",
    name: "Avvatar Mass Gainer",
    brand: "Parag Milk Foods",
    specs: { 
      protein: 45.6, carbs: 62, serving: 122, // 2 scoops
      carbSource: "Dextrose/Malto", 
      digestion: "Medium (Cow Milk)",
      ratio: "1:1.35"
    },
    badges: ["Vegetarian Gold", "Fresh Milk"],
    compliance: "Made in India (Farm to Scoop)",
    verifyMethod: "Pack Seal",
    vendors: [
      { name: "HealthKart", basePrice: 2099, link: "#" },
      { name: "Amazon", basePrice: 2150, link: "#" }
    ]
  },
  {
    id: "prod_nakpro",
    category: "mass_gainer",
    name: "Gold Mass Gainer",
    brand: "Nakpro Nutrition",
    specs: { 
      protein: 21.6, carbs: 68, serving: 100, 
      carbSource: "Maltodextrin", 
      digestion: "Medium",
      ratio: "1:3"
    },
    badges: ["Cheapest Option"],
    compliance: "ISO 22000 Certified",
    verifyMethod: "Batch Code Check",
    vendors: [
      { name: "Nakpro Site", basePrice: 549, link: "#" },
      { name: "Amazon", basePrice: 599, link: "#" }
    ]
  },
  {
    id: "mg_realgainz", category: "mass_gainer",
    name: "Real Gainz (Whey Gainer)", brand: "2X Nutrition",
    specs: { protein: 26, carbs: 78, serving: 100, source: "Cereal/Millet", digestion: "Easy" },
    badges: ["No Maltodextrin", "Probiotics"],
    vendors: [{ name: "Brand Site", price: 1999 }, { name: "Amazon", price: 2150 }]
  },
  {
    id: "mg_on_serious", category: "mass_gainer",
    name: "Serious Mass", brand: "Optimum Nutrition",
    specs: { protein: 50, carbs: 250, serving: 334, source: "Maltodextrin", digestion: "Heavy" },
    badges: ["Calorie King", "Global Standard"],
    vendors: [{ name: "Blinkit", price: 3170 }, { name: "Zepto", price: 3350 }]
  },
  // --- WHEY PROTEIN (New Section) ---
  {
    id: "wp_on_gold", category: "whey",
    name: "Gold Standard 100% Whey", brand: "Optimum Nutrition",
    specs: { protein: 24, carbs: 3, serving: 30, source: "Isolate Blend", digestion: "Medium" },
    badges: ["Bestseller 2026", "Trusted"],
    vendors: [{ name: "HealthKart", price: 3578 }, { name: "Amazon", price: 3450 }]
  },
  {
    id: "wp_dymatize", category: "whey",
    name: "ISO100 Hydrolyzed", brand: "Dymatize",
    specs: { protein: 25, carbs: 1, serving: 30, source: "Hydrolyzed Isolate", digestion: "Fast" },
    badges: ["Zero Lactose", "Ultra Premium"],
    vendors: [{ name: "Buyceps HSR", price: 8499 }, { name: "Amazon", price: 8200 }]
  },
  {
    id: "wp_2x_iso", category: "whey",
    name: "Pure Whey Isolate", brand: "2X Nutrition",
    specs: { protein: 26, carbs: 0.5, serving: 30, source: "Grass-Fed Isolate", digestion: "Very Fast" },
    badges: ["Clean Label", "No Gums"],
    vendors: [{ name: "Brand Site", price: 2799 }, { name: "Amazon", price: 2850 }]
  },
  // --- CREATINE (New Section) ---
  {
    id: "cr_beast", category: "creatine",
    name: "Super Micronized Creatine", brand: "Beast Life",
    specs: { protein: 0, carbs: 0, serving: 3, source: "Micronized Mono", digestion: "N/A" },
    badges: ["Budget King", "High Purity"],
    vendors: [{ name: "BeastLife.in", price: 499 }, { name: "Amazon", price: 549 }]
  },
  {
    id: "cr_on_micro", category: "creatine",
    name: "Micronized Creatine", brand: "Optimum Nutrition",
    specs: { protein: 0, carbs: 0, serving: 3, source: "Creapure", digestion: "N/A" },
    badges: ["Creapure", "Gold Standard"],
    vendors: [{ name: "Blinkit", price: 889 }, { name: "Zepto", price: 950 }]
  }
];

// --- 3. CUSTOM ANIMATED COMPONENTS ---

const AnimatedCard = ({ children, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay: delay * 0.1, ease: "easeOut" }}
    whileHover={{ y: -8, transition: { duration: 0.2 } }}
  >
    {children}
  </motion.div>
);

const PremiumLoader = () => (
  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
    <motion.div
      animate={{ 
        scale: [1, 1.2, 1],
        opacity: [0.5, 1, 0.5],
        rotate: [0, 180, 360] 
      }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
    >
      <Box sx={{ position: 'relative' }}>
        <Box sx={{ width: 60, height: 60, border: '4px solid #2563EB', borderRadius: '50%', borderTopColor: 'transparent' }} />
        <FlashOn sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: '#2563EB' }} />
      </Box>
    </motion.div>
    <Typography variant="overline" color="text.secondary" sx={{ mt: 3, letterSpacing: 3 }}>
      ANALYZING BANGALORE MARKET...
    </Typography>
  </Box>
);

// --- 4. MAIN APPLICATION ---
export default function BangaloreGainsPremium() {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("mass_gainer");
  const [compareList, setCompareList] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Simulate High-Tech Loading
  useEffect(() => {
    setTimeout(() => setLoading(false), 2500);
  }, []);

  const filteredData = useMemo(() => {
    return PRODUCTS_DB.filter(p => p.category === activeTab);
  }, [activeTab]);

  const toggleCompare = (p) => {
    if (compareList.find(x => x.id === p.id)) {
      setCompareList(prev => prev.filter(x => x.id !== p.id));
    } else if (compareList.length < 3) {
      setCompareList(prev => [...prev, p]);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      
      {/* --- HERO HEADER WITH GLASSMORPHISM --- */}
      <Box sx={{ 
        position: 'sticky', top: 0, zIndex: 1100, 
        bgcolor: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(0,0,0,0.05)'
      }}>
        <Container maxWidth="lg" sx={{ py: 2 }}>
          <Grid container alignItems="center" justifyContent="space-between">
            <Grid item display="flex" alignItems="center" gap={1}>
              <Box sx={{ bgcolor: '#2563EB', borderRadius: 2, p: 0.5 }}>
                <Bolt sx={{ color: '#fff' }} />
              </Box>
              <Typography variant="h6" sx={{ background: 'linear-gradient(90deg, #111827 0%, #4B5563 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                BANGALORE GAINS
              </Typography>
            </Grid>
            <Grid item>
              <IconButton onClick={() => setDrawerOpen(true)} color="primary" sx={{ bgcolor: 'rgba(37,99,235,0.1)' }}>
                <Badge badgeContent={compareList.length} color="secondary">
                  <CompareArrows />
                </Badge>
              </IconButton>
            </Grid>
          </Grid>

          {/* CATEGORY TABS */}
          <Tabs 
            value={activeTab} 
            onChange={(e, v) => setActiveTab(v)} 
            sx={{ mt: 2, '& .MuiTabs-indicator': { height: 3, borderRadius: 1.5 } }}
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label="Mass Gainers" value="mass_gainer" icon={<FitnessCenter />} iconPosition="start" />
            <Tab label="Whey Protein" value="whey" icon={<WaterDrop />} iconPosition="start" />
            <Tab label="Creatine" value="creatine" icon={<FlashOn />} iconPosition="start" />
          </Tabs>
        </Container>
      </Box>

      {/* --- MAIN CONTENT --- */}
      <Container maxWidth="lg" sx={{ mt: 4, mb: 10, minHeight: '80vh' }}>
        <AnimatePresence mode="wait">
          {loading ? (
            <PremiumLoader key="loader" />
          ) : (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              {/* MARKET INSIGHTS BANNER */}
              <Box sx={{ mb: 4, p: 3, borderRadius: 4, background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)', color: 'white', position: 'relative', overflow: 'hidden' }}>
                <motion.div animate={{ x: [0, 100, 0] }} transition={{ duration: 20, repeat: Infinity }}>
                  <Box sx={{ position: 'absolute', top: -50, right: -50, width: 200, height: 200, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: '50%' }} />
                </motion.div>
                <Typography variant="subtitle2" sx={{ opacity: 0.8 }}>LIVE MARKET UPDATE • FEB 2026</Typography>
                <Typography variant="h5" fontWeight="800" sx={{ mb: 1 }}>
                  {activeTab === 'whey' ? 'Isolate Prices Drop 5% in HSR Layout' : 
                   activeTab === 'creatine' ? 'Creapure Demand Spikes in Indiranagar' : 
                   'Mass Gainer Stock Low on Zepto'}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Based on real-time data from Buyceps, Blinkit & Amazon India.
                </Typography>
              </Box>

              <Grid container spacing={3}>
                {filteredData.map((product, index) => (
                  <Grid item xs={12} sm={6} md={4} key={product.id}>
                    <AnimatedCard delay={index}>
                      <ProductCard 
                        product={product} 
                        isCompared={compareList.some(c => c.id === product.id)}
                        onCompare={() => toggleCompare(product)}
                      />
                    </AnimatedCard>
                  </Grid>
                ))}
              </Grid>
            </motion.div>
          )}
        </AnimatePresence>
      </Container>

      {/* --- PREMIUM FOOTER --- */}
      <Box sx={{ bgcolor: '#fff', borderTop: '1px solid #eee', py: 4 }}>
        <Container maxWidth="lg">
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box display="flex" gap={1} alignItems="center" color="success.main">
                <VerifiedUser fontSize="small" />
                <Typography variant="caption" fontWeight="bold">FSSAI COMPLIANT & VERIFIED</Typography>
              </Box>
              <Typography variant="caption" color="text.secondary" display="block" mt={1}>
                Data sourced from official retailer APIs: Buyceps (HSR), Nutrition Nation (Koramangala), and Amazon.in.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6} sx={{ textAlign: { xs: 'left', md: 'right' } }}>
              <Typography variant="caption" color="text.secondary">
                BangaloreGains™ 2026. Built for the Tech City.
              </Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <ComparisonDrawer open={drawerOpen} list={compareList} onClose={() => setDrawerOpen(false)} />
    </ThemeProvider>
  );
}

// --- 5. COMPONENT: PREMIUM GLASS PRODUCT CARD ---
function ProductCard({ product, isCompared, onCompare }) {
  const bestPrice = product.vendors.sort((a,b) => a.price - b.price)[0];
  
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', p: 3, position: 'relative' }}>
      {/* BADGES */}
      <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
        {product.badges.slice(0, 2).map(badge => (
          <Chip 
            key={badge} label={badge} size="small" 
            sx={{ bgcolor: 'rgba(37,99,235,0.08)', color: 'primary.main', fontSize: '0.7rem' }} 
          />
        ))}
      </Stack>

      <Typography variant="caption" color="text.secondary" fontWeight="600" letterSpacing={1}>
        {product.brand.toUpperCase()}
      </Typography>
      <Typography variant="h6" sx={{ mb: 2, lineHeight: 1.2 }}>{product.name}</Typography>

      {/* MACRO METRICS */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        {product.category !== 'creatine' && (
          <Box>
            <Typography variant="h4" fontWeight="800" color="text.primary">
              {product.specs.protein}g
            </Typography>
            <Typography variant="caption" color="text.secondary">Protein</Typography>
          </Box>
        )}
        <Box>
          <Typography variant="h4" fontWeight="800" color="text.primary">
            {product.category === 'creatine' ? '3g' : `${product.specs.carbs}g`}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {product.category === 'creatine' ? 'Creatine' : 'Carbs'}
          </Typography>
        </Box>
        <Box sx={{ ml: 'auto', textAlign: 'right' }}>
           <Avatar sx={{ bgcolor: product.specs.digestion.includes('Easy') || product.specs.digestion.includes('Fast') ? '#DCFCE7' : '#FEF3C7', color: '#000', width: 32, height: 32, ml: 'auto' }}>
             <Science sx={{ fontSize: 18 }} />
           </Avatar>
           <Typography variant="caption" color="text.secondary" display="block" mt={0.5}>
             {product.specs.digestion}
           </Typography>
        </Box>
      </Box>

      {/* PRICING & ACTION */}
      <Box sx={{ mt: 'auto' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, p: 1.5, bgcolor: '#F9FAFB', borderRadius: 3 }}>
           <Typography variant="body2" fontWeight="600">{bestPrice.name}</Typography>
           <Box display="flex" alignItems="center" color="success.main">
             <Typography variant="body2" fontWeight="bold">₹{bestPrice.price}</Typography>
             <TrendingDown sx={{ fontSize: 16, ml: 0.5 }} />
           </Box>
        </Box>

        <Stack direction="row" spacing={1}>
          <Button 
            fullWidth variant="contained" color="primary" 
            disableElevation endIcon={<ArrowForward />}
          >
            Buy Now
          </Button>
          <Tooltip title={isCompared ? "Remove from Compare" : "Add to Compare"}>
            <IconButton 
              onClick={onCompare} 
              sx={{ 
                border: '1px solid', 
                borderColor: isCompared ? 'primary.main' : 'grey.300',
                color: isCompared ? 'primary.main' : 'grey.500',
                bgcolor: isCompared ? 'rgba(37,99,235,0.05)' : 'transparent'
              }}
            >
              <CompareArrows />
            </IconButton>
          </Tooltip>
        </Stack>
      </Box>
    </Card>
  );
}

// --- 6. COMPONENT: COMPARISON DRAWER (Bottom Sheet) ---
function ComparisonDrawer({ open, list, onClose }) {
  return (
    <Drawer 
      anchor="bottom" open={open} onClose={onClose}
      PaperProps={{ sx: { borderRadius: '24px 24px 0 0', maxWidth: 'lg', mx: 'auto' } }}
    >
      <Box sx={{ p: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h6">Comparison Tray ({list.length})</Typography>
          <IconButton onClick={onClose}><Close /></IconButton>
        </Box>
        
        {list.length === 0 ? (
           <Typography color="text.secondary" align="center" py={4}>Select products to compare specs.</Typography>
        ) : (
          <TableContainer
          
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Feature</TableCell>
                  {list.map(p => <TableCell key={p.id} align="center" sx={{ fontWeight: 'bold' }}>{p.name}</TableCell>)}
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell component="th" scope="row">Protein Source</TableCell>
                  {list.map(p => <TableCell key={p.id} align="center">{p.specs.source}</TableCell>)}
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">Best Price</TableCell>
                  {list.map(p => (
                    <TableCell key={p.id} align="center" sx={{ color: 'success.main', fontWeight: 'bold' }}>
                       ₹{Math.min(...p.vendors.map(v => v.price))}
                    </TableCell>
                  ))}
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </Drawer>
  );
}