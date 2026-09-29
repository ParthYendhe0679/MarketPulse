import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  MapPin, 
  Layers, 
  Download, 
  ArrowRight,
  ShieldCheck,
  Zap,
  Globe2,
  GitCompare
} from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';

export const LandingPage: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  } as const;

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring" as const, stiffness: 100, damping: 15 }
    }
  } as const;

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#111111] overflow-x-hidden">
      {/* Landing Navbar */}
      <header className="border-b-4 border-[#111111] bg-white sticky top-0 z-50 py-4 px-6 md:px-12 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-10 h-10 bg-[#4F7DF9] border-3 border-[#111111] shadow-[2.5px_2.5px_0px_0px_#111111] rounded-xl flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-white stroke-[3]" />
          </div>
          <div>
            <h1 className="text-xl font-bold font-display tracking-tight text-[#111111] m-0 leading-none">
              MarketPulse<span className="text-[#4F7DF9]">AI</span>
            </h1>
            <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest block leading-none mt-1">
              Consumer Market Intelligence
            </span>
          </div>
        </Link>
        <div className="hidden md:flex items-center gap-6">
          <a href="#features" className="text-sm font-bold uppercase tracking-wide hover:text-[#4F7DF9] transition-colors">Features</a>
          <a href="#preview" className="text-sm font-bold uppercase tracking-wide hover:text-[#4F7DF9] transition-colors">Dashboard Preview</a>
          <a href="#why-us" className="text-sm font-bold uppercase tracking-wide hover:text-[#4F7DF9] transition-colors">Why Choose Us</a>
        </div>
        <Link to="/map-selector">
          <Button variant="primary" size="sm">
            Launch Platform <ArrowRight className="w-4 h-4 ml-1.5 stroke-[3]" />
          </Button>
        </Link>
      </header>

      {/* Hero Section */}
      <section className="py-16 md:py-24 px-6 md:px-12 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <motion.div 
          className="lg:col-span-7 space-y-6"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, type: "spring" }}
        >
          <Badge variant="yellow">🚩 FLAGSHIP CONSUMER PLATFORM</Badge>
          
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black font-display uppercase tracking-tight leading-tight text-[#111111]">
            Consumer Consumption <span className="text-[#4F7DF9] underline decoration-[#FF9ECF] decoration-8">Intelligence</span> Across India
          </h2>
          
          <p className="text-lg font-medium text-gray-600 leading-relaxed max-w-xl">
            Analyze, track, and predict consumer product consumption behaviors. Drill down instantly from nation to state, city, category, brand, and SKU. Built for enterprise teams making data-backed distribution choices.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link to="/map-selector">
              <Button variant="yellow" size="lg" className="w-full sm:w-auto">
                Explore India Map <MapPin className="w-5 h-5 ml-2 stroke-[3]" />
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button variant="white" size="lg" className="w-full sm:w-auto">
                Platform Demo <ArrowRight className="w-5 h-5 ml-2 stroke-[3]" />
              </Button>
            </Link>
          </div>

          {/* Social Proof */}
          <div className="pt-8 border-t-3 border-dashed border-gray-300">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">TRUSTED BY INTEL CORE DECISION MAKERS AT</p>
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-black text-gray-400">
              <span>NIELSENIQ</span>
              <span>KANTAR GLOBAL</span>
              <span>AMAZON ANALYTICS</span>
              <span>DELOITTE SAAS</span>
            </div>
          </div>
        </motion.div>

        {/* Hero Interactive Graphics */}
        <motion.div 
          className="lg:col-span-5 relative flex justify-center items-center h-[600px] lg:h-[650px] w-full overflow-visible"
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, type: "spring" }}
        >
          {/* Subtle glowing circles behind the panel */}
          <div className="absolute top-[15%] left-[15%] w-64 h-64 rounded-full bg-[#4F7DF9]/10 blur-3xl pointer-events-none -z-20"></div>
          <div className="absolute bottom-[15%] right-[15%] w-64 h-64 rounded-full bg-[#FF9ECF]/10 blur-3xl pointer-events-none -z-20"></div>
          <div className="absolute top-[40%] right-[25%] w-64 h-64 rounded-full bg-[#FFD54A]/8 blur-3xl pointer-events-none -z-20"></div>

          {/* Animated Connecting Lines Underlay */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none -z-10 hidden md:block" viewBox="0 0 500 650" fill="none" preserveAspectRatio="none">
            {/* Top-Left to Center */}
            <motion.path
              d="M 100 100 L 250 325"
              stroke="#111111"
              strokeWidth="2.5"
              strokeDasharray="5 7"
              animate={{ strokeDashoffset: [0, -24] }}
              transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
            />
            {/* Top-Right to Center */}
            <motion.path
              d="M 400 120 L 250 325"
              stroke="#111111"
              strokeWidth="2.5"
              strokeDasharray="5 7"
              animate={{ strokeDashoffset: [0, -24] }}
              transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
            />
            {/* Bottom-Left to Center */}
            <motion.path
              d="M 80 520 L 250 325"
              stroke="#111111"
              strokeWidth="2.5"
              strokeDasharray="5 7"
              animate={{ strokeDashoffset: [0, 24] }}
              transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
            />
            {/* Mid-Right to Center */}
            <motion.path
              d="M 420 340 L 250 325"
              stroke="#111111"
              strokeWidth="2.5"
              strokeDasharray="5 7"
              animate={{ strokeDashoffset: [0, -24] }}
              transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
            />
            {/* Bottom-Right to Center */}
            <motion.path
              d="M 380 540 L 250 325"
              stroke="#111111"
              strokeWidth="2.5"
              strokeDasharray="5 7"
              animate={{ strokeDashoffset: [0, -24] }}
              transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
            />
          </svg>

          {/* Floating background particles */}
          <motion.div
            className="absolute text-2xl font-black text-[#FF6B6B] select-none pointer-events-none hidden md:block"
            style={{ left: '22%', top: '24%' }}
            animate={{ y: [0, 10, 0], rotate: [0, 360] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          >
            +
          </motion.div>
          <motion.div
            className="absolute text-lg font-black text-[#4F7DF9] select-none pointer-events-none hidden md:block"
            style={{ right: '28%', bottom: '26%' }}
            animate={{ y: [0, -12, 0], rotate: [0, -360] }}
            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
          >
            ▲
          </motion.div>
          <motion.div
            className="absolute w-3.5 h-3.5 rounded-full border-2 border-[#111111] bg-[#FFD54A] pointer-events-none hidden md:block"
            style={{ left: '38%', bottom: '22%' }}
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Core Analytics Card (Centered) */}
          <div className="w-[300px] sm:w-[320px] z-10 relative">
            <Card variant="white" shadowColor="blue" hoverable={false} className="border-4 border-[#111111] p-5 w-full relative">
              <div className="absolute -top-4 -right-4 w-12 h-12 bg-[#FF9ECF] border-3 border-[#111111] rounded-full shadow-[2px_2px_0px_0px_#111111] flex items-center justify-center font-bold font-display rotate-12">
                NEW
              </div>
              
              {/* Mock Chart Visual */}
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b-2 border-[#111111] pb-3">
                  <span className="font-bold text-xs uppercase text-gray-500">CONSUMPTION INDEX</span>
                  <Badge variant="green">+24.8% YoY</Badge>
                </div>

                <div className="h-44 w-full bg-[#111111] rounded-xl border-2 border-[#111111] p-3 flex flex-col justify-between shadow-[3px_3px_0px_0px_#FFD54A]">
                  <div className="flex justify-between items-end h-32 pt-4">
                    <div className="w-4 bg-[#FF9ECF] border border-[#111111] rounded-t-sm" style={{ height: '40%' }}></div>
                    <div className="w-4 bg-[#FFD54A] border border-[#111111] rounded-t-sm" style={{ height: '65%' }}></div>
                    <div className="w-4 bg-[#6EE7B7] border border-[#111111] rounded-t-sm" style={{ height: '50%' }}></div>
                    <div className="w-4 bg-[#4F7DF9] border border-[#111111] rounded-t-sm" style={{ height: '85%' }}></div>
                    <div className="w-4 bg-[#FFB347] border border-[#111111] rounded-t-sm" style={{ height: '95%' }}></div>
                  </div>
                  <div className="flex justify-between text-[9px] font-bold text-gray-400 uppercase">
                    <span>Q1</span><span>Q2</span><span>Q3</span><span>Q4</span><span>2026</span>
                  </div>
                </div>

                {/* KPI Cards Mini */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 border-2 border-[#111111] rounded-xl bg-[#6EE7B7]/10">
                    <span className="text-[9px] font-bold text-gray-500 uppercase block">REVENUE</span>
                    <strong className="text-sm font-black">₹4.2 Cr</strong>
                  </div>
                  <div className="p-3 border-2 border-[#111111] rounded-xl bg-[#4F7DF9]/10">
                    <span className="text-[9px] font-bold text-gray-500 uppercase block">CONSUMERS</span>
                    <strong className="text-sm font-black">1.8 M</strong>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Floating Card 1: Revenue (Top-Left) */}
          <motion.div
            className="hidden md:block absolute top-[6%] left-[4%] z-20"
            animate={{ y: [0, -10, 0], rotate: [-2, 2, -2] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            whileHover={{ scale: 1.05, rotate: 0, zIndex: 30 }}
          >
            <Card variant="white" shadowColor="yellow" hoverable={false} className="border-3 border-[#111111] p-3 shadow-[3px_3px_0px_0px_#111111] w-48">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[8px] font-black text-gray-500 uppercase tracking-wide">ENTERPRISE REVENUE</span>
                <Badge variant="yellow">Active</Badge>
              </div>
              <div className="flex items-baseline gap-1">
                <strong className="text-lg font-black font-display text-[#111111]">₹24.2 Cr</strong>
                <span className="text-[9px] font-black text-[#6EE7B7] bg-[#111111] px-1 rounded inline-block">+18.4%</span>
              </div>
            </Card>
          </motion.div>

          {/* Floating Card 2: Prediction Accuracy (Top-Right) */}
          <motion.div
            className="hidden md:block absolute top-[12%] right-[4%] z-20"
            animate={{ y: [0, -12, 0], rotate: [2, -2, 2] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            whileHover={{ scale: 1.05, rotate: 0, zIndex: 30 }}
          >
            <Card variant="white" shadowColor="pink" hoverable={false} className="border-3 border-[#111111] p-3 shadow-[3px_3px_0px_0px_#111111] w-48">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[8px] font-black text-gray-500 uppercase tracking-wide">AI ACCURACY</span>
                <Badge variant="pink">Model</Badge>
              </div>
              <div className="flex items-baseline gap-1">
                <strong className="text-lg font-black font-display text-[#111111]">96%</strong>
                <span className="text-[9px] font-bold text-gray-500">Prediction Rate</span>
              </div>
            </Card>
          </motion.div>

          {/* Floating Card 3: India Map Mini (Bottom-Left) */}
          <motion.div
            className="hidden md:block absolute bottom-[10%] left-[2%] z-20"
            animate={{ y: [0, 8, 0], rotate: [1.5, -1.5, 1.5] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
            whileHover={{ scale: 1.05, rotate: 0, zIndex: 30 }}
          >
            <Card variant="white" shadowColor="blue" hoverable={false} className="border-3 border-[#111111] p-3 shadow-[3px_3px_0px_0px_#111111] w-44">
              <div className="flex gap-2 items-center">
                <div className="w-9 h-9 flex items-center justify-center bg-gray-50 border-2 border-[#111111] rounded-lg">
                  <svg viewBox="0 0 40 40" className="w-7 h-7">
                    <rect x="5" y="10" width="11" height="11" rx="2.5" fill="#6EE7B7" stroke="#111111" strokeWidth="1.5" />
                    <rect x="18" y="8" width="13" height="9" rx="2.5" fill="#FFD54A" stroke="#111111" strokeWidth="1.5" />
                    <rect x="9" y="23" width="11" height="11" rx="2.5" fill="#4F7DF9" stroke="#111111" strokeWidth="1.5" />
                    <rect x="23" y="19" width="9" height="13" rx="2.5" fill="#FF9ECF" stroke="#111111" strokeWidth="1.5" />
                  </svg>
                </div>
                <div>
                  <span className="text-[8px] font-bold text-gray-500 block leading-none">REGIONS</span>
                  <strong className="text-[10px] font-black uppercase text-[#111111] block leading-none mt-0.5">11 ACTIVE STATES</strong>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Floating Card 4: Category Pie (Mid-Right) */}
          <motion.div
            className="hidden md:block absolute top-[48%] right-[-4%] z-20"
            animate={{ y: [0, 10, 0], rotate: [-2.5, 1, -2.5] }}
            transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
            whileHover={{ scale: 1.05, rotate: 0, zIndex: 30 }}
          >
            <Card variant="white" shadowColor="green" hoverable={false} className="border-3 border-[#111111] p-3 shadow-[3px_3px_0px_0px_#111111] w-44">
              <div className="flex gap-2 items-center">
                <div className="w-9 h-9 flex items-center justify-center bg-gray-50 border-2 border-[#111111] rounded-lg">
                  <svg viewBox="0 0 24 24" className="w-6 h-6">
                    <circle cx="12" cy="12" r="9" fill="none" stroke="#111111" strokeWidth="2.5" />
                    <path d="M12,12 L12,3 A9,9 0 0,1 21,12 Z" fill="#4F7DF9" stroke="#111111" strokeWidth="1.5" />
                    <path d="M12,12 L21,12 A9,9 0 0,1 12,21 Z" fill="#FFD54A" stroke="#111111" strokeWidth="1.5" />
                    <path d="M12,12 L12,21 A9,9 0 0,1 3,12 Z" fill="#FF9ECF" stroke="#111111" strokeWidth="1.5" />
                  </svg>
                </div>
                <div>
                  <span className="text-[8px] font-bold text-gray-500 block leading-none">SECTORS</span>
                  <strong className="text-[10px] font-black uppercase text-[#111111] block leading-none mt-0.5">4 CATEGORIES</strong>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Floating Card 5: Products Tracked (Bottom-Right) */}
          <motion.div
            className="hidden md:block absolute bottom-[8%] right-[8%] z-20"
            animate={{ y: [0, -8, 0], rotate: [1.5, 2.5, 1.5] }}
            transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
            whileHover={{ scale: 1.05, rotate: 0, zIndex: 30 }}
          >
            <Card variant="white" shadowColor="orange" hoverable={false} className="border-3 border-[#111111] p-3 shadow-[3px_3px_0px_0px_#111111] w-44">
              <div className="flex gap-2 items-center">
                <div className="w-9 h-9 flex items-center justify-center bg-gray-50 border-2 border-[#111111] rounded-lg">
                  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none">
                    <path d="M3 18 L7 11 L12 14 L17 7 L21 10" stroke="#FFB347" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="17" cy="7" r="2" fill="#4F7DF9" stroke="#111111" strokeWidth="1.5" />
                  </svg>
                </div>
                <div>
                  <span className="text-[8px] font-bold text-gray-500 block leading-none">DATABASE</span>
                  <strong className="text-[10px] font-black uppercase text-[#111111] block leading-none mt-0.5">450+ SKU Tracked</strong>
                </div>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      </section>

      {/* Feature Blocks Section */}
      <section id="features" className="py-20 bg-white border-y-4 border-[#111111] px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
            <Badge variant="pink">ENTERPRISE ABILITIES</Badge>
            <h2 className="text-3xl sm:text-4xl font-black font-display uppercase tracking-tight text-[#111111]">
              Engineered to Uncover India's Market Secrets
            </h2>
            <p className="font-medium text-gray-500 text-sm">
              We skip generic charts and static dashboards. MarketPulse AI provides real-time, context-driven drilldown models.
            </p>
          </div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <motion.div variants={itemVariants}>
              <Card variant="white" shadowColor="pink" className="h-full flex flex-col justify-between">
                <div className="w-12 h-12 bg-[#FF9ECF] border-2 border-[#111111] shadow-[2.5px_2.5px_0px_0px_#111111] rounded-xl flex items-center justify-center mb-6">
                  <MapPin className="w-6 h-6 stroke-[3]" />
                </div>
                <div>
                  <h3 className="text-lg font-bold font-display uppercase tracking-tight mb-2">Geographic Drilldown</h3>
                  <p className="text-xs font-semibold text-gray-500 leading-relaxed">
                    Select a state, drill into specific tier-1/tier-2 cities, and inspect custom localized demand metrics instantly.
                  </p>
                </div>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card variant="white" shadowColor="yellow" className="h-full flex flex-col justify-between">
                <div className="w-12 h-12 bg-[#FFD54A] border-2 border-[#111111] shadow-[2.5px_2.5px_0px_0px_#111111] rounded-xl flex items-center justify-center mb-6">
                  <Layers className="w-6 h-6 stroke-[3]" />
                </div>
                <div>
                  <h3 className="text-lg font-bold font-display uppercase tracking-tight mb-2">Multi-Tier Filters</h3>
                  <p className="text-xs font-semibold text-gray-500 leading-relaxed">
                    Filter by brand, state, SKU, time segments, and detailed consumer demographics (age, gender) with zero lag.
                  </p>
                </div>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card variant="white" shadowColor="blue" className="h-full flex flex-col justify-between">
                <div className="w-12 h-12 bg-[#4F7DF9] border-2 border-[#111111] shadow-[2.5px_2.5px_0px_0px_#111111] rounded-xl flex items-center justify-center mb-6 text-white">
                  <GitCompare className="w-6 h-6 stroke-[3]" />
                </div>
                <div>
                  <h3 className="text-lg font-bold font-display uppercase tracking-tight mb-2">Granular Comparisons</h3>
                  <p className="text-xs font-semibold text-gray-500 leading-relaxed">
                    Compare city vs city, state vs state, or brand vs brand side-by-side with automatic KPI index mappings.
                  </p>
                </div>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card variant="white" shadowColor="green" className="h-full flex flex-col justify-between">
                <div className="w-12 h-12 bg-[#6EE7B7] border-2 border-[#111111] shadow-[2.5px_2.5px_0px_0px_#111111] rounded-xl flex items-center justify-center mb-6">
                  <Download className="w-6 h-6 stroke-[3]" />
                </div>
                <div>
                  <h3 className="text-lg font-bold font-display uppercase tracking-tight mb-2">Automated Exporters</h3>
                  <p className="text-xs font-semibold text-gray-500 leading-relaxed">
                    Download fully formatted reports instantly in CSV formats, simulated clean Excel sheets, or print-ready PDF charts.
                  </p>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Previews / Analytics & Map Section */}
      <section id="preview" className="py-20 px-6 md:px-12 max-w-7xl mx-auto space-y-20">
        {/* Map Preview section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-6">
            <Badge variant="blue">GEOGRAPHIC NAVIGATOR</Badge>
            <h2 className="text-3xl md:text-4xl font-black font-display uppercase tracking-tight text-[#111111]">
              The Interactive India Drilldown
            </h2>
            <p className="font-medium text-gray-600 text-sm leading-relaxed">
              Experience the custom stylized India map which guides users through states like Maharashtra, Delhi, Karnataka, and cities like Mumbai, Bangalore, and Kochi. Unify disparate consumer points into an intuitive spatial hierarchy.
            </p>
            <div className="pt-2">
              <Link to="/map-selector">
                <Button variant="primary" size="md">
                  Launch Map Selector <MapPin className="w-4 h-4 ml-1.5 stroke-[3]" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Graphic representing map mock */}
          <div className="lg:col-span-7 border-4 border-[#111111] bg-white rounded-2xl p-4 shadow-[6px_6px_0px_0px_#111111]">
            <div className="bg-[#FAFAFA] border-2 border-[#111111] rounded-xl p-4 flex flex-col items-center">
              <div className="w-full flex justify-between border-b-2 border-[#111111] pb-2 mb-4 font-bold text-xs text-gray-500 uppercase">
                <span>SELECT STATE</span>
                <span>MAP WORKSPACE</span>
              </div>
              {/* Graphic elements */}
              <div className="flex gap-4 w-full justify-center">
                <div className="w-32 h-20 bg-[#FF9ECF] border-2 border-[#111111] rounded-xl flex items-center justify-center font-bold text-xs uppercase shadow-[2.5px_2.5px_0px_0px_#111111] cursor-pointer">Maharashtra</div>
                <div className="w-32 h-20 bg-[#6EE7B7] border-2 border-[#111111] rounded-xl flex items-center justify-center font-bold text-xs uppercase shadow-[2.5px_2.5px_0px_0px_#111111] cursor-pointer">Karnataka</div>
                <div className="w-32 h-20 bg-[#FFD54A] border-2 border-[#111111] rounded-xl flex items-center justify-center font-bold text-xs uppercase shadow-[2.5px_2.5px_0px_0px_#111111] cursor-pointer">West Bengal</div>
              </div>
              <div className="w-full h-3 border-b-2 border-dashed border-gray-300 my-4"></div>
              <div className="text-[10px] font-black text-gray-400 uppercase">Interactive nodes react to states and filter dashboard KPIs instantly</div>
            </div>
          </div>
        </div>

        {/* Dashboard Analytics Preview section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 order-2 lg:order-1 border-4 border-[#111111] bg-white rounded-2xl p-6 shadow-[6px_6px_0px_0px_#111111] space-y-4">
            <div className="flex justify-between items-center border-b-3 border-[#111111] pb-3">
              <span className="font-bold text-xs uppercase tracking-wide">Category Market share split</span>
              <span className="bg-[#4F7DF9] text-white px-2 py-0.5 rounded border border-[#111111] text-[10px] font-bold">2026 ACTIVE</span>
            </div>
            
            {/* Visual simulation of dashboard distribution */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 border-2 border-[#111111] rounded-xl bg-[#6EE7B7]/10 flex flex-col justify-between">
                <span className="text-[9px] font-bold text-gray-500 uppercase">F&B</span>
                <strong className="text-base font-black">35.4%</strong>
              </div>
              <div className="p-4 border-2 border-[#111111] rounded-xl bg-[#4F7DF9]/10 flex flex-col justify-between">
                <span className="text-[9px] font-bold text-gray-500 uppercase">Electronics</span>
                <strong className="text-base font-black">28.9%</strong>
              </div>
              <div className="p-4 border-2 border-[#111111] rounded-xl bg-[#FF9ECF]/10 flex flex-col justify-between">
                <span className="text-[9px] font-bold text-gray-500 uppercase">Fashion</span>
                <strong className="text-base font-black">20.1%</strong>
              </div>
              <div className="p-4 border-2 border-[#111111] rounded-xl bg-[#FFB347]/10 flex flex-col justify-between">
                <span className="text-[9px] font-bold text-gray-500 uppercase">Personal Care</span>
                <strong className="text-base font-black">15.6%</strong>
              </div>
            </div>

            <div className="p-4 border-2 border-[#111111] rounded-xl bg-[#FAFAFA]">
              <span className="text-[10px] font-bold text-gray-500 uppercase block mb-1">DEMOGRAPHIC GROWTH MAPPING</span>
              <div className="h-6 w-full bg-gray-200 rounded-full border border-gray-300 overflow-hidden flex">
                <div className="h-full bg-[#FF9ECF]" style={{ width: '48%' }}></div>
                <div className="h-full bg-[#4F7DF9]" style={{ width: '42%' }}></div>
                <div className="h-full bg-[#FFD54A]" style={{ width: '10%' }}></div>
              </div>
              <div className="flex justify-between text-[8px] font-bold text-gray-400 uppercase mt-1">
                <span>FEMALE (48%)</span>
                <span>MALE (42%)</span>
                <span>OTHER (10%)</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-6 order-1 lg:order-2">
            <Badge variant="yellow">DEMOGRAPHIC INSIGHTS</Badge>
            <h2 className="text-3xl md:text-4xl font-black font-display uppercase tracking-tight text-[#111111]">
              Demographics & Category Analysis
            </h2>
            <p className="font-medium text-gray-600 text-sm leading-relaxed">
              Track who consumes your products. Filter down to age group (18-24, 25-34, 35-44, etc.) and gender parameters to check brand affinities, category distribution shares, and growth charts.
            </p>
            <div className="pt-2">
              <Link to="/dashboard">
                <Button variant="yellow" size="md">
                  View Demo Dashboard <ArrowRight className="w-4 h-4 ml-1.5 stroke-[3]" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section id="why-us" className="py-20 bg-white border-y-4 border-[#111111] px-6 md:px-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-6">
            <Badge variant="green">PRODUCT HIGHLIGHTS</Badge>
            <h2 className="text-3xl md:text-4xl font-black font-display uppercase tracking-tight text-[#111111]">
              Why Choose MarketPulse AI
            </h2>
            <p className="font-medium text-gray-600 text-sm leading-relaxed">
              We understand what decision-makers in Fortune 500 companies need. We eliminate complicated codebases and provide instant market intelligence.
            </p>

            <ul className="space-y-4 text-sm font-bold">
              <li className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-[#6EE7B7] border-2 border-[#111111] flex items-center justify-center"><ShieldCheck className="w-4.5 h-4.5" /></div>
                <span>99.8% Seed-Synchronized Deterministic Data accuracy</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-[#FFD54A] border-2 border-[#111111] flex items-center justify-center"><Zap className="w-4.5 h-4.5" /></div>
                <span>Sub-second UI responsiveness with local cache structures</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-[#FF9ECF] border-2 border-[#111111] flex items-center justify-center"><Globe2 className="w-4.5 h-4.5" /></div>
                <span>Covers Tier 1 & Tier 2 cities across India's high-consumption states</span>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Card variant="white" hoverable={false} className="border-3 border-[#111111] p-5">
              <h4 className="text-base font-bold font-display uppercase mb-2">Enterprise Ready</h4>
              <p className="text-xs font-semibold text-gray-500 leading-relaxed">
                Connects seamlessly to a FastAPI/Python backend later. Interfaces are decoupled using services.
              </p>
            </Card>
            <Card variant="white" hoverable={false} className="border-3 border-[#111111] p-5">
              <h4 className="text-base font-bold font-display uppercase mb-2">Stunning Neo-Brutalism</h4>
              <p className="text-xs font-semibold text-gray-500 leading-relaxed">
                Award-winning high-contrast layouts. Bold typography and pixel-perfect rounded offsets.
              </p>
            </Card>
            <Card variant="white" hoverable={false} className="border-3 border-[#111111] p-5">
              <h4 className="text-base font-bold font-display uppercase mb-2">Recharts Integration</h4>
              <p className="text-xs font-semibold text-gray-500 leading-relaxed">
                Responsive customized charts rendering monthly revenue trends, demographic analyses, and market rankings.
              </p>
            </Card>
            <Card variant="white" hoverable={false} className="border-3 border-[#111111] p-5">
              <h4 className="text-base font-bold font-display uppercase mb-2">Side-by-Side Compare</h4>
              <p className="text-xs font-semibold text-gray-500 leading-relaxed">
                Allow comparison indexes: state vs state, city vs city, brand vs brand, category vs category.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action banner */}
      <section className="py-20 px-6 md:px-12 text-center bg-[#4F7DF9] text-white border-b-4 border-[#111111] relative">
        {/* Background visual detail */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-700/30 via-transparent to-transparent pointer-events-none"></div>

        <div className="max-w-4xl mx-auto space-y-6 relative z-10">
          <Badge variant="yellow">READY TO GET INSIGHTS?</Badge>
          <h2 className="text-4xl md:text-5xl font-black font-display uppercase tracking-tight text-white leading-tight">
            Stop Guessing India's Consumption Trends
          </h2>
          <p className="text-base text-blue-100 font-medium max-w-xl mx-auto leading-relaxed">
            Connect to the ultimate consumer intelligence platform. Set up state, category, and demographic parameters to discover target markets.
          </p>
          <div className="pt-4 flex justify-center">
            <Link to="/map-selector">
              <Button variant="yellow" size="lg" className="shadow-[6px_6px_0px_0px_#111111] hover:shadow-[8px_8px_0px_0px_#111111]">
                Get Started Free <ArrowRight className="w-5 h-5 ml-2 stroke-[3]" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-[#111111] text-white px-6 md:px-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 border-b-2 border-gray-800 pb-8 mb-8">
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-[#4F7DF9] border border-white rounded-lg flex items-center justify-center">
                <BarChart3 className="w-4.5 h-4.5 text-white stroke-[3]" />
              </div>
              <h1 className="text-lg font-bold font-display tracking-tight text-white m-0">
                MarketPulse<span className="text-[#4F7DF9]">AI</span>
              </h1>
            </Link>
            <p className="text-xs text-gray-400 font-semibold leading-relaxed">
              Consumer product consumption analytical intelligence platform. Built for Indian business portfolios.
            </p>
          </div>
          <div>
            <h4 className="text-xs font-bold font-display uppercase text-[#FFD54A] mb-4">Core Pages</h4>
            <ul className="space-y-2 text-xs font-semibold text-gray-300">
              <li><Link to="/map-selector" className="hover:underline">Map Selector</Link></li>
              <li><Link to="/dashboard" className="hover:underline">Dashboard</Link></li>
              <li><Link to="/compare" className="hover:underline">Compare</Link></li>
              <li><Link to="/products" className="hover:underline">Products</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-bold font-display uppercase text-[#FFD54A] mb-4">Platform</h4>
            <ul className="space-y-2 text-xs font-semibold text-gray-300">
              <li><Link to="/reports" className="hover:underline">Reports Builder</Link></li>
              <li><Link to="/about" className="hover:underline">About</Link></li>
              <li><Link to="/settings" className="hover:underline">Settings</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-bold font-display uppercase text-[#FFD54A] mb-4">Branding Style</h4>
            <p className="text-xs text-gray-400 leading-relaxed font-semibold">
              Styled in <strong>Premium Neo-Brutalism</strong>. Inspired by Space Grotesk typography, thick borders, solid offsets, and flat high-contrast cards.
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between text-[11px] font-bold text-gray-500 uppercase tracking-widest gap-4">
          <span>&copy; {new Date().getFullYear()} MarketPulse AI. All Rights Reserved.</span>
          <div className="flex gap-4">
            <span className="cursor-pointer hover:text-white">Privacy Policy</span>
            <span className="cursor-pointer hover:text-white">Terms of Use</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
