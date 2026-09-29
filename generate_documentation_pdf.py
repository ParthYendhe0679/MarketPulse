import os
import sys
from xml.sax.saxutils import escape

from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)
from reportlab.pdfgen import canvas

# Define Palette
COLOR_PRIMARY = colors.HexColor("#1E3A8A")     # Deep Navy Blue
COLOR_ACCENT = colors.HexColor("#4F7DF9")      # Brand Blue
COLOR_DARK = colors.HexColor("#111111")        # Charcoal / Neo Black
COLOR_MUTED = colors.HexColor("#4B5563")       # Slate Gray
COLOR_BG_LIGHT = colors.HexColor("#F8FAFC")    # Clean Card BG
COLOR_BORDER = colors.HexColor("#E2E8F0")      # Border Gray
COLOR_YELLOW = colors.HexColor("#F59E0B")      # Amber Accent
COLOR_GREEN = colors.HexColor("#059669")       # Emerald Green
COLOR_RED = colors.HexColor("#DC2626")         # Crimson Red

class NumberedCanvas(canvas.Canvas):
    """
    Two-pass canvas to dynamically compute and print 'Page X of Y' 
    and standard running header on all pages except the first.
    """
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super().showPage()
        super().save()

    def draw_page_decorations(self, page_count):
        if self._pageNumber == 1:
            # First page is cover/header, skip running header
            return

        self.saveState()
        self.setFont("Helvetica-Bold", 8)
        self.setFillColor(colors.HexColor("#64748B"))

        # Running Header
        self.drawString(36, A4[1] - 25, "MARKETPULSE AI — COMPLETE PROJECT ANALYSIS & TECHNICAL REPORT")
        self.setFont("Helvetica", 8)
        self.drawRightString(A4[0] - 36, A4[1] - 25, "COMPREHENSIVE CODEBASE AUDIT")
        self.setStrokeColor(colors.HexColor("#CBD5E1"))
        self.setLineWidth(0.75)
        self.line(36, A4[1] - 30, A4[0] - 36, A4[1] - 30)

        # Running Footer
        self.line(36, 32, A4[0] - 36, 32)
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#64748B"))
        self.drawString(36, 20, "Confidential Academic & Technical Documentation  •  Author: Development Team")
        page_str = f"Page {self._pageNumber} of {page_count}"
        self.drawRightString(A4[0] - 36, 20, page_str)

        self.restoreState()


def create_pdf(output_path):
    # Printable width: 595.27 - 72 = 523.27
    doc = SimpleDocTemplate(
        output_path,
        pagesize=A4,
        leftMargin=36,
        rightMargin=36,
        topMargin=40,
        bottomMargin=42
    )

    styles = getSampleStyleSheet()

    # Custom styles
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=24,
        leading=28,
        textColor=COLOR_PRIMARY,
        spaceAfter=4
    )

    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=11,
        leading=15,
        textColor=COLOR_MUTED,
        spaceAfter=14
    )

    meta_style = ParagraphStyle(
        'MetaStyle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=12,
        textColor=COLOR_DARK
    )

    h1_style = ParagraphStyle(
        'Heading1_Custom',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=13,
        leading=16,
        textColor=COLOR_PRIMARY,
        spaceBefore=12,
        spaceAfter=6,
        keepWithNext=True
    )

    h2_style = ParagraphStyle(
        'Heading2_Custom',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=10.5,
        leading=14,
        textColor=COLOR_DARK,
        spaceBefore=8,
        spaceAfter=4,
        keepWithNext=True
    )

    body_style = ParagraphStyle(
        'Body_Custom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=12,
        textColor=COLOR_DARK,
        spaceAfter=5
    )

    bullet_style = ParagraphStyle(
        'Bullet_Custom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=12,
        textColor=COLOR_DARK,
        leftIndent=14,
        spaceAfter=3
    )

    table_header_style = ParagraphStyle(
        'TH_Custom',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8,
        leading=10,
        textColor=colors.white
    )

    table_cell_style = ParagraphStyle(
        'TC_Custom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=7.5,
        leading=10,
        textColor=COLOR_DARK
    )

    table_cell_bold = ParagraphStyle(
        'TC_Bold',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=7.5,
        leading=10,
        textColor=COLOR_DARK
    )

    callout_style = ParagraphStyle(
        'CalloutText',
        parent=styles['Normal'],
        fontName='Helvetica-Oblique',
        fontSize=8.5,
        leading=12.5,
        textColor=COLOR_DARK
    )

    viva_q_style = ParagraphStyle(
        'VivaQuestion',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8.5,
        leading=11.5,
        textColor=COLOR_PRIMARY,
        spaceBefore=4,
        spaceAfter=2,
        keepWithNext=True
    )

    viva_a_style = ParagraphStyle(
        'VivaAnswer',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8,
        leading=11,
        textColor=COLOR_DARK,
        leftIndent=10,
        spaceAfter=4
    )

    code_style = ParagraphStyle(
        'CodeStyle',
        parent=styles['Normal'],
        fontName='Courier',
        fontSize=7,
        leading=9,
        textColor=COLOR_DARK
    )

    story = []

    def p(text, style=body_style):
        return Paragraph(text, style)

    def callout_box(text, title="EXECUTIVE SUMMARY"):
        content = [
            Paragraph(f"<b>{title}</b>", ParagraphStyle('CT', fontName='Helvetica-Bold', fontSize=8.5, leading=11, textColor=COLOR_PRIMARY, spaceAfter=3)),
            Paragraph(text, callout_style)
        ]
        t = Table([[content]], colWidths=[520])
        t.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#EFF6FF")),
            ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#BFDBFE")),
            ('LINELEFT', (0,0), (0,0), 4, COLOR_ACCENT),
            ('TOPPADDING', (0,0), (-1,-1), 6),
            ('BOTTOMPADDING', (0,0), (-1,-1), 6),
            ('LEFTPADDING', (0,0), (-1,-1), 10),
            ('RIGHTPADDING', (0,0), (-1,-1), 10),
        ]))
        return t

    # -------------------------------------------------------------
    # COVER / TITLE HEADER BLOCK
    # -------------------------------------------------------------
    header_table_data = [
        [
            Paragraph("<b>PROJECT DOCUMENTATION & TECHNICAL AUDIT REPORT</b>", 
                      ParagraphStyle('HPre', fontName='Helvetica-Bold', fontSize=9, leading=11, textColor=COLOR_ACCENT)),
            Paragraph("<b>VERSION 1.0.0-BETA</b>", 
                      ParagraphStyle('HVer', fontName='Helvetica-Bold', fontSize=8, leading=11, textColor=COLOR_MUTED, alignment=2))
        ]
    ]
    ht = Table(header_table_data, colWidths=[360, 160])
    ht.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('BOTTOMPADDING', (0,0), (-1,-1), 0),
        ('TOPPADDING', (0,0), (-1,-1), 0),
        ('LEFTPADDING', (0,0), (-1,-1), 0),
        ('RIGHTPADDING', (0,0), (-1,-1), 0),
    ]))
    story.append(ht)
    story.append(Spacer(1, 4))

    story.append(Paragraph("MarketPulse AI", title_style))
    story.append(Paragraph("Consumer Consumption Intelligence &amp; Spatial Analytics Platform for Indian Regional Markets", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=1.5, color=COLOR_DARK, spaceBefore=0, spaceAfter=8))

    # Meta banner table
    meta_data = [
        [
            Paragraph("<b>Domain:</b> FMCG &amp; Retail Analytics", meta_style),
            Paragraph("<b>Core Stack:</b> React 19 • TypeScript • Vite", meta_style),
            Paragraph("<b>Design:</b> Neo-Brutalist System", meta_style),
            Paragraph("<b>Audience:</b> Academic / Viva / Technical Review", meta_style)
        ]
    ]
    mt = Table(meta_data, colWidths=[130, 150, 120, 120])
    mt.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), COLOR_BG_LIGHT),
        ('BOX', (0,0), (-1,-1), 0.75, COLOR_BORDER),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(mt)
    story.append(Spacer(1, 10))

    # -------------------------------------------------------------
    # 1. PROJECT TITLE
    # -------------------------------------------------------------
    story.append(Paragraph("1. Project Title", h1_style))
    story.append(Paragraph("<b>Verified System Name:</b> MarketPulse AI (derived from <code>package.json</code>, <code>design.md</code>, <code>index.html</code>, and <code>Navbar.tsx</code>).", body_style))
    story.append(Paragraph("<b>Recommended Academic Title:</b> MarketPulse AI — Consumer Consumption Intelligence &amp; Spatial Analytics Platform for Indian Regional Markets.", body_style))
    story.append(Spacer(1, 4))

    # -------------------------------------------------------------
    # 2. PROJECT IN ONE PARAGRAPH
    # -------------------------------------------------------------
    story.append(Paragraph("2. Project in One Paragraph", h1_style))
    summary_text = (
        "<b>MarketPulse AI</b> is an interactive, web-based market intelligence and consumer analytics platform designed to analyze, "
        "visualize, and benchmark regional consumer product consumption behaviors across India. In fast-moving consumer goods (FMCG), "
        "electronics, apparel, and personal care, decision-makers often struggle to understand hyper-local market dynamics because aggregate "
        "national data masks state- and city-level differences. Built for market research analysts, brand managers, and retail strategists, "
        "this application lets users drill down geographically from an all-India view into 11 specific states and 44 major cities through "
        "interactive SVG and geospatial Leaflet maps. Users can slice and dice data across 4 core retail categories, 16 brands, and 64 product SKUs, "
        "apply multi-tier demographic filters (age groups, gender, seasonal quarters, and years), run side-by-side comparative analyses between "
        "competing regions or brands, inspect detailed SKU profiles in modals, and export audit-ready reports in CSV, Excel-compatible sheets, or print-ready PDFs. "
        "The primary purpose is to provide business analysts with sub-second, multi-dimensional market visibility through an engaging, high-contrast Neo-Brutalist dashboard."
    )
    story.append(callout_box(summary_text, "EXECUTIVE BRIEF FOR TEACHER / EVALUATOR"))
    story.append(Spacer(1, 6))

    # -------------------------------------------------------------
    # 3. PROBLEM STATEMENT
    # -------------------------------------------------------------
    story.append(Paragraph("3. Problem Statement", h1_style))
    story.append(Paragraph("<b>Existing Problem:</b> Consumer demand across India is extraordinarily diverse. Purchasing power, seasonal demand velocity, and demographic affinities vary sharply between tier-1 and tier-2 cities. National aggregate sales metrics hide localized demand dips and festive spikes (e.g., Diwali in Q4).", body_style))
    story.append(Paragraph("<b>Why the Problem Matters:</b> Brands, distributors, and supply-chain planners risk misallocating warehouse inventories, overspending on ineffective regional marketing, and losing shelf market-share when lacking localized intelligence.", body_style))
    story.append(Paragraph("<b>Limitations of Traditional Approaches:</b> Static PDF decks, disconnected spreadsheets, and legacy BI suites are sluggish, lack intuitive spatial context, and require laborious pivot table re-queries to extract multi-dimensional demographic answers.", body_style))
    story.append(Paragraph("<b>How MarketPulse AI Solves This:</b> Combines high-speed client-side aggregations with a tactile Neo-Brutalist visual interface, multi-tier cascading dropdown filters, an interactive India SVG map, geospatial Leaflet markers, and side-by-side benchmarking to deliver sub-second market visibility.", body_style))
    story.append(Spacer(1, 4))

    # -------------------------------------------------------------
    # 4. OBJECTIVE
    # -------------------------------------------------------------
    story.append(Paragraph("4. Objectives", h1_style))
    story.append(Paragraph("1. <b>To deliver interactive geographic drilldown:</b> Enable seamless spatial exploration from an all-India view into 11 states and 44 metropolitan cities.", bullet_style))
    story.append(Paragraph("2. <b>To compute executive business KPIs:</b> Provide instant calculations for Total Revenue (Cr/Lakhs), Unit Sales, Mean Market Share %, Consumer Footfall, and YoY Growth Rate.", bullet_style))
    story.append(Paragraph("3. <b>To enable multi-dimensional filtering:</b> Allow simultaneous segmentation across State, City, Category, Brand, SKU, Year (2024–2026), Quarter, Month, Age Cohort, and Gender.", bullet_style))
    story.append(Paragraph("4. <b>To facilitate head-to-head competitive benchmarking:</b> Deliver side-by-side comparisons between states, cities, categories, brands, or products with automated margin delta indices.", bullet_style))
    story.append(Paragraph("5. <b>To provide SKU-level product catalog intelligence:</b> Surface detailed product cards with drilldown modals highlighting top-5 contributing states and cities.", bullet_style))
    story.append(Paragraph("6. <b>To support audit-ready multi-format data export:</b> Equip enterprise analysts with client-side CSV downloads, Excel-compatible (.xls) files, and print-ready styled PDFs.", bullet_style))
    story.append(Paragraph("7. <b>To implement a bespoke Neo-Brutalist design language:</b> Combine high-contrast solid borders, flat offset box shadows, Google typography, and Framer Motion micro-interactions.", bullet_style))
    story.append(Spacer(1, 4))

    # -------------------------------------------------------------
    # 5. WHAT I HAVE ACTUALLY BUILT
    # -------------------------------------------------------------
    story.append(Paragraph("5. What Has Actually Been Built (Implementation Audit)", h1_style))
    story.append(Paragraph("A rigorous inspection of the physical repository reveals the following concrete implementation status across all technical layers:", body_style))

    impl_data = [
        [Paragraph("<b>Component / Layer</b>", table_header_style), 
         Paragraph("<b>Status</b>", table_header_style), 
         Paragraph("<b>Implementation Details in Codebase</b>", table_header_style)],
        
        [Paragraph("<b>Landing Page</b>", table_cell_bold),
         Paragraph("<font color='#059669'><b>Implemented</b></font>", table_cell_style),
         Paragraph("Hero section, animated SVG connection paths, feature showcases, preview panels, and responsive navigation in <code>LandingPage.tsx</code>.", table_cell_style)],
        
        [Paragraph("<b>Layout &amp; Navigation</b>", table_cell_bold),
         Paragraph("<font color='#059669'><b>Implemented</b></font>", table_cell_style),
         Paragraph("Sticky top navbar, mobile drawer, desktop sidebar menu, and active link routing in <code>MainLayout.tsx</code>, <code>Navbar.tsx</code>, <code>Sidebar.tsx</code>.", table_cell_style)],

        [Paragraph("<b>Geographic Drilldown</b>", table_cell_bold),
         Paragraph("<font color='#059669'><b>Implemented</b></font>", table_cell_style),
         Paragraph("Interactive SVG vector map of India with custom state hitboxes, hover cards, and 4-step wizard navigation in <code>HomeMapPage.tsx</code> &amp; <code>IndiaSvgMap.tsx</code>.", table_cell_style)],

        [Paragraph("<b>Geospatial Leaflet Map</b>", table_cell_bold),
         Paragraph("<font color='#059669'><b>Implemented</b></font>", table_cell_style),
         Paragraph("Leaflet + React-Leaflet integration with custom DivIcon circle markers for 44 city coordinates, revenue popups, and zoom levels in <code>LeafletMap.tsx</code>.", table_cell_style)],

        [Paragraph("<b>Analytics Dashboard</b>", table_cell_bold),
         Paragraph("<font color='#059669'><b>Implemented</b></font>", table_cell_style),
         Paragraph("Real-time KPI summaries, 10-parameter filter matrix, Recharts area/bar/pie charts, SKU revenue rankings, and sub-second simulated query lag in <code>DashboardPage.tsx</code>.", table_cell_style)],

        [Paragraph("<b>Comparison Engine</b>", table_cell_bold),
         Paragraph("<font color='#059669'><b>Implemented</b></font>", table_cell_style),
         Paragraph("Multi-type comparison selector, automated delta margin calculation, dual-line historical revenue charts, and side-by-side SKU rankings in <code>ComparePage.tsx</code>.", table_cell_style)],

        [Paragraph("<b>Products Catalog</b>", table_cell_bold),
         Paragraph("<font color='#059669'><b>Implemented</b></font>", table_cell_style),
         Paragraph("Searchable product cards with category-themed badges, YoY growth indicators, and drilldown detail modal dialogs in <code>ProductsPage.tsx</code>.", table_cell_style)],

        [Paragraph("<b>Reports &amp; Exporters</b>", table_cell_bold),
         Paragraph("<font color='#059669'><b>Implemented</b></font>", table_cell_style),
         Paragraph("Paginated table with multi-column sorting, search filters, client-side CSV generator, Excel .xls MIME-type export, and print media CSS in <code>ReportsPage.tsx</code> &amp; <code>Table.tsx</code>.", table_cell_style)],

        [Paragraph("<b>Deterministic Data Engine</b>", table_cell_bold),
         Paragraph("<font color='#059669'><b>Implemented</b></font>", table_cell_style),
         Paragraph("Seeded pseudo-random generator producing ~2,500+ structured records factoring in seasonality, state weights, and category multipliers in <code>mockDataGenerator.ts</code>.", table_cell_style)],

        [Paragraph("<b>Analytical Query Service</b>", table_cell_bold),
         Paragraph("<font color='#059669'><b>Implemented</b></font>", table_cell_style),
         Paragraph("In-memory filtering, KPI mathematical reductions, trend grouping, ranking, and distribution logic in <code>dataService.ts</code>.", table_cell_style)],

        [Paragraph("<b>Neo-Brutalist System</b>", table_cell_bold),
         Paragraph("<font color='#059669'><b>Implemented</b></font>", table_cell_style),
         Paragraph("Atomic components (Button, Card, Badge, Input, Dropdown, Modal, EmptyState, LoadingSkeleton) with @theme tokens and offset drop-shadow utilities in <code>index.css</code>.", table_cell_style)],

        [Paragraph("<b>User Profile Settings</b>", table_cell_bold),
         Paragraph("<font color='#D97706'><b>Partial</b></font>", table_cell_style),
         Paragraph("Editable profile form in <code>SettingsPage.tsx</code> saves to component state with simulated success alert; API endpoint dropdown is locked to 'mock'.", table_cell_style)],

        [Paragraph("<b>Authentication / RBAC</b>", table_cell_bold),
         Paragraph("<font color='#DC2626'><b>Not Implemented</b></font>", table_cell_style),
         Paragraph("No user login, registration, JWT handling, session management, or route guards exist. All pages are publicly accessible.", table_cell_style)],

        [Paragraph("<b>Backend Web Server</b>", table_cell_bold),
         Paragraph("<font color='#DC2626'><b>Not Implemented</b></font>", table_cell_style),
         Paragraph("No live backend server exists in code. SettingsPage.tsx explicitly notes: 'Switch Environment to dev once FastAPI backend container is operational.'", table_cell_style)],

        [Paragraph("<b>Physical Database</b>", table_cell_bold),
         Paragraph("<font color='#DC2626'><b>Not Implemented</b></font>", table_cell_style),
         Paragraph("No relational (PostgreSQL/MySQL) or NoSQL (MongoDB) database is connected. All records exist in client-side memory cache.", table_cell_style)],

        [Paragraph("<b>AI / ML Model Service</b>", table_cell_bold),
         Paragraph("<font color='#DC2626'><b>Not Implemented</b></font>", table_cell_style),
         Paragraph("No machine learning pipelines or LLM inference scripts exist. 'AI' is branding; metrics use deterministic mathematical formulas.", table_cell_style)]
    ]

    t_impl = Table(impl_data, colWidths=[120, 80, 320])
    t_impl.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), COLOR_PRIMARY),
        ('BOX', (0,0), (-1,-1), 1, COLOR_DARK),
        ('INNERGRID', (0,0), (-1,-1), 0.5, COLOR_BORDER),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 5),
        ('RIGHTPADDING', (0,0), (-1,-1), 5),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, COLOR_BG_LIGHT]),
    ]))
    story.append(t_impl)
    story.append(Spacer(1, 6))

    # -------------------------------------------------------------
    # 6. FEATURES
    # -------------------------------------------------------------
    story.append(Paragraph("6. Key Features Implemented", h1_style))

    features_list = [
        ("1. Interactive Geographic Drilldown Portal",
         "Provides a visual vector map of India with 11 commercial states. Hovering displays quick KPI previews; clicking selects the state and loads available cities for focused drilldown.",
         "Implemented in <code>IndiaSvgMap.tsx</code> using interactive SVG coordinate hitboxes, Framer Motion animations, and real-time state KPI reductions.",
         "Gives non-technical users an engaging spatial entry point rather than tedious text dropdowns."),

        ("2. Geospatial City Hotspots via Leaflet",
         "Visualizes city-level consumption hotspots across real geographical latitude/longitude coordinates with interactive pan/zoom controls.",
         "Implemented in <code>LeafletMap.tsx</code> with <code>react-leaflet</code>, OpenStreetMap raster tiles, custom <code>L.DivIcon</code> HTML markers, and revenue popups for 44 cities.",
         "Enables regional distribution managers to immediately spot spatial demand clusters and supply gaps."),

        ("3. Multi-Tier Enterprise Filter Matrix",
         "Allows concurrent filtering across 10 dimensions: State, City, Category, Brand, SKU, Year (2024–2026), Quarter, Month, Age Group, and Gender.",
         "Implemented in <code>DashboardPage.tsx</code> and <code>dataService.ts</code> with cascading resets (e.g. changing category resets brand and SKU; changing state resets city).",
         "Allows analysts to drill into granular target segments (e.g. 'Apple iPhone in Mumbai during Q4 2025 among 25–34 year olds')."),

        ("4. Real-Time Executive KPI Metric Cards",
         "Computes and displays 5 top-line metrics: Total Revenue (Cr/Lakhs), Total Units Sold, Mean Market Share %, Consumer Footfall Count, and YoY Growth Rate.",
         "Calculated via single-pass mathematical reduction in <code>calculateKPIs()</code> inside <code>dataService.ts</code>.",
         "Delivers an immediate executive health check under any active filter combination."),

        ("5. Neo-Brutalist Visual Analytics Suite",
         "Displays 4 responsive charts: Monthly Revenue Area Chart, Category Sector Split Donut, Top-10 Brands Bar Chart, and Demographic Age/Gender Splits.",
         "Custom-styled wrappers around <code>recharts</code> primitives with thick borders (#111111), Space Grotesk fonts, and custom tooltip components.",
         "Translates multi-thousand record tables into high-impact visual trends."),

        ("6. Head-to-Head Comparison Intelligence Engine",
         "Enables direct side-by-side benchmarking across 5 entity types: State vs. State, City vs. City, Brand vs. Brand, Category vs. Category, or Product vs. Product.",
         "Implemented in <code>ComparePage.tsx</code> and <code>getComparisonData()</code>. Calculates percentage delta margins and merges chronological series for dual-line graphs.",
         "Eliminates manual spreadsheet cross-referencing when comparing rival brands or geographic hubs."),

        ("7. Product Catalog with SKU Drilldown Modal",
         "Lists all products in the database with search and category filters. Clicking 'View Drilldown' opens an animated modal showing volume, market share, and top-5 contributing states and cities.",
         "Implemented in <code>ProductsPage.tsx</code> using Framer Motion modal dialogs and regional revenue group-by algorithms.",
         "Allows SKU product managers to identify regional strongholds for individual products."),

        ("8. Enterprise Reports Ledger &amp; Multi-Format Exporters",
         "Searchable, sortable table of consumption records with one-click export to CSV, simulated tab-delimited Excel (.xls), or print-styled PDF.",
         "Implemented in <code>ReportsPage.tsx</code> and <code>Table.tsx</code> using client-side data URIs and print media CSS (@media print).",
         "Enables analysts to extract clean data for stakeholder presentations or offline auditing.")
    ]

    for fname, fwhat, fhow, fbenefit in features_list:
        story.append(Paragraph(f"<b>{fname}</b>", h2_style))
        story.append(Paragraph(f"• <b>What it does:</b> {fwhat}", bullet_style))
        story.append(Paragraph(f"• <b>How it works:</b> {fhow}", bullet_style))
        story.append(Paragraph(f"• <b>User benefit:</b> {fbenefit}", bullet_style))
        story.append(Spacer(1, 2))

    # -------------------------------------------------------------
    # 7. TECHNOLOGY STACK
    # -------------------------------------------------------------
    story.append(Paragraph("7. Technology Stack", h1_style))
    tech_data = [
        [Paragraph("<b>Category</b>", table_header_style), 
         Paragraph("<b>Technology</b>", table_header_style), 
         Paragraph("<b>Purpose in Project</b>", table_header_style)],
        
        [Paragraph("Frontend Framework", table_cell_bold), Paragraph("React 19.2.8", table_cell_style), Paragraph("Component-based reactive user interface architecture", table_cell_style)],
        [Paragraph("Programming Language", table_cell_bold), Paragraph("TypeScript 6.0.2", table_cell_style), Paragraph("Compile-time type safety across models, props, and analytical services", table_cell_style)],
        [Paragraph("Build Tool / Bundler", table_cell_bold), Paragraph("Vite 8.2.0", table_cell_style), Paragraph("Fast ESM development server and production bundler", table_cell_style)],
        [Paragraph("CSS Framework", table_cell_bold), Paragraph("Tailwind CSS 4.3.3", table_cell_style), Paragraph("Utility styling, design system tokens via @theme", table_cell_style)],
        [Paragraph("Design Philosophy", table_cell_bold), Paragraph("Neo-Brutalism", table_cell_style), Paragraph("High-contrast #111111 borders, flat offset shadows, bright card fills", table_cell_style)],
        [Paragraph("Typography", table_cell_bold), Paragraph("Space Grotesk &amp; Poppins", table_cell_style), Paragraph("Display heading and UI body fonts loaded via Google Fonts CDN", table_cell_style)],
        [Paragraph("Routing", table_cell_bold), Paragraph("React Router DOM 7.18.2", table_cell_style), Paragraph("Client-side SPA route navigation and search param sync", table_cell_style)],
        [Paragraph("Charting Engine", table_cell_bold), Paragraph("Recharts 3.10.1", table_cell_style), Paragraph("Area, Bar, Pie, and Line charts wrapped in Neo-Brutalist styles", table_cell_style)],
        [Paragraph("Geospatial Maps", table_cell_bold), Paragraph("Leaflet 1.9.4 / React-Leaflet 5.0.0", table_cell_style), Paragraph("Interactive tile map plotting 44 Indian city coordinates", table_cell_style)],
        [Paragraph("Vector Map", table_cell_bold), Paragraph("SVG + React DOM", table_cell_style), Paragraph("Interactive stylized vector map of India with state boundaries", table_cell_style)],
        [Paragraph("Animations", table_cell_bold), Paragraph("Framer Motion 12.43.0", table_cell_style), Paragraph("Staggered entrances, floating hero graphics, animated SVG paths, modals", table_cell_style)],
        [Paragraph("Icon Library", table_cell_bold), Paragraph("Lucide React 1.28.0", table_cell_style), Paragraph("Vector iconography styled at stroke-[2.5] and stroke-[3]", table_cell_style)],
        [Paragraph("Linter", table_cell_bold), Paragraph("Oxlint 1.75.0", table_cell_style), Paragraph("High-performance Rust-based linter enforcing clean React code", table_cell_style)],
        [Paragraph("Data Storage", table_cell_bold), Paragraph("Client In-Memory Cache", table_cell_style), Paragraph("Deterministic generator producing ~2,500+ structured consumer records", table_cell_style)],
        [Paragraph("Backend / API", table_cell_bold), Paragraph("Decoupled Mock Service", table_cell_style), Paragraph("Architecture prepared for future FastAPI container integration", table_cell_style)]
    ]
    t_tech = Table(tech_data, colWidths=[120, 140, 260])
    t_tech.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), COLOR_PRIMARY),
        ('BOX', (0,0), (-1,-1), 1, COLOR_DARK),
        ('INNERGRID', (0,0), (-1,-1), 0.5, COLOR_BORDER),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
        ('LEFTPADDING', (0,0), (-1,-1), 5),
        ('RIGHTPADDING', (0,0), (-1,-1), 5),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, COLOR_BG_LIGHT]),
    ]))
    story.append(t_tech)
    story.append(Spacer(1, 6))

    # -------------------------------------------------------------
    # 8. SYSTEM ARCHITECTURE
    # -------------------------------------------------------------
    story.append(Paragraph("8. System Architecture", h1_style))
    story.append(Paragraph("MarketPulse AI follows a <b>Client-Side Single Page Application (SPA)</b> architecture using a <b>Decoupled Service Pattern</b>. All business, filtering, and mathematical logic is isolated inside <code>dataService.ts</code>, completely separating presentation components from the underlying data layer.", body_style))

    ascii_diagram = (
        "+-------------------------------------------------------------------------+\n"
        "|                        CLIENT BROWSER (React 19)                        |\n"
        "+-------------------------------------------------------------------------+\n"
        "                                     │\n"
        "              [ User Interactions: Map Clicks / Filters ]\n"
        "                                     ▼\n"
        "+-------------------------------------------------------------------------+\n"
        "|                          ROUTING & VIEW LAYER                           |\n"
        "|   • LandingPage (/)               • HomeMapPage (/map-selector)        |\n"
        "|   • DashboardPage (/dashboard)    • ComparePage (/compare)              |\n"
        "|   • ProductsPage (/products)      • ReportsPage (/reports)              |\n"
        "+-------------------------------------------------------------------------+\n"
        "                                     │\n"
        "                     [ In-Memory Queries & Filters ]\n"
        "                                     ▼\n"
        "+-------------------------------------------------------------------------+\n"
        "|                     DECOUPLED SERVICE LAYER (TypeScript)                |\n"
        "|   • getFilteredData()             • calculateKPIs()                     |\n"
        "|   • getMonthlyTrend()             • getComparisonData()                 |\n"
        "|   • getProductRanking()           • getProductDetails()                 |\n"
        "+-------------------------------------------------------------------------+\n"
        "                                     │\n"
        "                                     ▼\n"
        "+-------------------------------------------------------------------------+\n"
        "|                       DETERMINISTIC DATA STORE                          |\n"
        "|   • mockDataGenerator.ts (Seeded LCG, Seed=42, ~2,500+ records)         |\n"
        "|   • databaseCache (In-memory array storing ConsumerRecord items)        |\n"
        "+-------------------------------------------------------------------------+\n"
        "                                     │ (Future Phase)\n"
        "                                     ▼\n"
        "+ - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - +\n"
        "|         [PLANNED] FastAPI Backend Container & PostgreSQL Database       |\n"
        "+ - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - +"
    )
    t_diag = Table([[Paragraph(f"<pre>{escape(ascii_diagram)}</pre>", code_style)]], colWidths=[520])
    t_diag.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#0F172A")),
        ('BOX', (0,0), (-1,-1), 1, COLOR_DARK),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(t_diag)
    story.append(Spacer(1, 6))

    # -------------------------------------------------------------
    # 9. PROJECT WORKFLOW
    # -------------------------------------------------------------
    story.append(Paragraph("9. Complete Project Workflow", h1_style))
    workflow_steps = [
        "1. <b>User opens application:</b> User lands on the public Landing Page (<code>/</code>), reviewing value propositions, live previews, and feature highlights.",
        "2. <b>User initiates geographic discovery:</b> Clicks 'Explore India Map', navigating to the 4-step Map Portal (<code>/map-selector</code>).",
        "3. <b>User selects state on SVG map:</b> Hovering previews state metrics; clicking selects an active state (e.g. <i>Maharashtra</i>).",
        "4. <b>User selects city:</b> The portal reveals available metropolitan hubs (e.g. <i>Mumbai</i>). User locks selection and clicks 'Launch Intelligence Dashboard'.",
        "5. <b>System synchronizes parameters:</b> App redirects to <code>/dashboard?state=Maharashtra&amp;city=Mumbai</code>. The dashboard reads URL search parameters to initialize the filter state.",
        "6. <b>Dashboard calculates metrics:</b> The decoupled service filters records in memory, rendering 5 top KPI cards, monthly revenue area charts, sector pie charts, brand rankings, and Leaflet city pins.",
        "7. <b>User applies multi-tier filters:</b> User changes category, brand, year, or demographic cohort. A simulated 300ms query lag renders skeleton cards, followed by instant recalculation.",
        "8. <b>User runs side-by-side comparison:</b> User navigates to <code>/compare</code>, selects 'City vs City' (e.g. <i>Mumbai</i> vs. <i>Bangalore</i>), and reviews margin differentials and dual timeline curves.",
        "9. <b>User inspects product catalog:</b> User navigates to <code>/products</code>, searches for an SKU (e.g. <i>'iPhone 15'</i>), and clicks 'View Drilldown' to open a modal with top-5 regional breakdowns.",
        "10. <b>User exports reports:</b> User navigates to <code>/reports</code>, filters raw records, and clicks 'Excel' to download a spreadsheet or 'Print/PDF' to trigger a formatted PDF document."
    ]
    for step in workflow_steps:
        story.append(Paragraph(step, bullet_style))
    story.append(Spacer(1, 6))

    # -------------------------------------------------------------
    # 10. DATABASE ANALYSIS
    # -------------------------------------------------------------
    story.append(Paragraph("10. Database Analysis", h1_style))
    story.append(Paragraph("<b>Database Technology:</b> In-Memory Client-Side Simulated Database. No physical SQL or NoSQL database engine exists in the current build.", body_style))
    story.append(Paragraph("<b>Primary Data Schema:</b> <code>ConsumerRecord</code> interface defined in <code>src/types/index.ts</code>.", body_style))

    schema_data = [
        [Paragraph("<b>Field</b>", table_header_style), Paragraph("<b>Type</b>", table_header_style), Paragraph("<b>Description</b>", table_header_style), Paragraph("<b>Example Value</b>", table_header_style)],
        [Paragraph("id", table_cell_bold), Paragraph("string", table_cell_style), Paragraph("Unique record identifier", table_cell_style), Paragraph("'MP-1042'", table_cell_style)],
        [Paragraph("state / city", table_cell_bold), Paragraph("string", table_cell_style), Paragraph("Geographic hierarchy", table_cell_style), Paragraph("'Maharashtra' / 'Mumbai'", table_cell_style)],
        [Paragraph("brand / category", table_cell_bold), Paragraph("string", table_cell_style), Paragraph("Commercial hierarchy", table_cell_style), Paragraph("'Apple' / 'Electronics'", table_cell_style)],
        [Paragraph("product", table_cell_bold), Paragraph("string", table_cell_style), Paragraph("SKU name", table_cell_style), Paragraph("'iPhone 15'", table_cell_style)],
        [Paragraph("revenue / sales", table_cell_bold), Paragraph("number", table_cell_style), Paragraph("Total revenue (INR) and units sold", table_cell_style), Paragraph("1,250,000 / 28", table_cell_style)],
        [Paragraph("consumerCount", table_cell_bold), Paragraph("number", table_cell_style), Paragraph("Count of purchasing consumers", table_cell_style), Paragraph("25", table_cell_style)],
        [Paragraph("marketShare / growth", table_cell_bold), Paragraph("number", table_cell_style), Paragraph("Category share % and YoY growth %", table_cell_style), Paragraph("18.4 / 14.2", table_cell_style)],
        [Paragraph("date / month / year", table_cell_bold), Paragraph("string / number", table_cell_style), Paragraph("Calendar temporal attributes", table_cell_style), Paragraph("'2025-10-15' / 'October' / 2025", table_cell_style)],
        [Paragraph("quarter", table_cell_bold), Paragraph("string", table_cell_style), Paragraph("Financial quarter", table_cell_style), Paragraph("'Q4'", table_cell_style)],
        [Paragraph("ageGroup / gender", table_cell_bold), Paragraph("enum", table_cell_style), Paragraph("Target shopper demographics", table_cell_style), Paragraph("'25-34' / 'Female'", table_cell_style)]
    ]
    t_schema = Table(schema_data, colWidths=[90, 70, 240, 120])
    t_schema.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), COLOR_PRIMARY),
        ('BOX', (0,0), (-1,-1), 1, COLOR_DARK),
        ('INNERGRID', (0,0), (-1,-1), 0.5, COLOR_BORDER),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
        ('LEFTPADDING', (0,0), (-1,-1), 5),
        ('RIGHTPADDING', (0,0), (-1,-1), 5),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, COLOR_BG_LIGHT]),
    ]))
    story.append(t_schema)
    story.append(Spacer(1, 6))

    # -------------------------------------------------------------
    # 11. API ANALYSIS
    # -------------------------------------------------------------
    story.append(Paragraph("11. API Analysis", h1_style))
    story.append(Paragraph("<b>Backend REST APIs:</b> Currently unattached. <code>SettingsPage.tsx</code> contains a simulated connection panel pointing to <code>http://localhost:8000/api/v1</code> with environment locked to 'mock'.", body_style))
    story.append(Paragraph("<b>Planned Endpoints:</b> <code>GET /api/v1/records</code> (filtering), <code>GET /api/v1/kpis</code> (KPI reductions), <code>GET /api/v1/compare</code> (benchmarking), and <code>GET /api/v1/products/:name</code> (SKU drilldowns).", body_style))
    story.append(Paragraph("<b>External Web Services Used:</b>", body_style))
    story.append(Paragraph("• <b>OpenStreetMap Tile Server:</b> <code>https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png</code> provides geographic map tiles to Leaflet without authentication.", bullet_style))
    story.append(Paragraph("• <b>Google Fonts CDN:</b> Serves the Space Grotesk and Poppins fonts declared in <code>index.html</code>.", bullet_style))
    story.append(Spacer(1, 4))

    # -------------------------------------------------------------
    # 12. AI / ML ANALYSIS
    # -------------------------------------------------------------
    story.append(Paragraph("12. AI / ML Analysis", h1_style))
    story.append(Paragraph("<b>Implementation Status:</b> Not implemented in code. The term 'AI' in 'MarketPulse AI' is platform branding.", body_style))
    story.append(Paragraph("<b>Honest Technical Details:</b> The repository does not contain machine learning models, training scripts, or LLM API calls. Growth metrics and market share predictions are calculated deterministically using mathematical weights (e.g. Diwali festive multiplier of 1.45x in Oct/Nov; metro city multipliers of 1.4x) inside <code>mockDataGenerator.ts</code>. A production machine learning forecasting pipeline (such as ARIMA or Prophet) is planned for future backend development.", body_style))
    story.append(Spacer(1, 4))

    # -------------------------------------------------------------
    # 13. FOLDER STRUCTURE
    # -------------------------------------------------------------
    story.append(Paragraph("13. Folder Structure", h1_style))
    story.append(Paragraph("The project follows a clean, modular React + TypeScript architecture:", body_style))
    story.append(Paragraph("• <code>src/charts/</code>: Recharts wrapper components styled with Neo-Brutalist design tokens (NeoAreaChart, NeoBarChart, NeoPieChart, NeoLineChart, CustomTooltip).", bullet_style))
    story.append(Paragraph("• <code>src/components/</code>: Reusable UI library (Button, Card, Badge, Input, Dropdown, Modal, EmptyState, LoadingSkeleton, Table, Navbar, Sidebar).", bullet_style))
    story.append(Paragraph("• <code>src/constants/</code>: Domain constants (STATES_AND_CITIES, CATEGORIES_BRANDS_PRODUCTS, YEARS, QUARTERS, MONTHS).", bullet_style))
    story.append(Paragraph("• <code>src/layouts/</code>: MainLayout shell coordinating top navbar, sidebar drawer, and dynamic outlet content.", bullet_style))
    story.append(Paragraph("• <code>src/maps/</code>: Geographic components (IndiaSvgMap for vector drilldowns; LeafletMap for geospatial city coordinates).", bullet_style))
    story.append(Paragraph("• <code>src/pages/</code>: High-level page views (LandingPage, HomeMapPage, DashboardPage, ComparePage, ProductsPage, ReportsPage, AboutPage, SettingsPage).", bullet_style))
    story.append(Paragraph("• <code>src/routes/</code>: React Router configuration routing URLs to page components.", bullet_style))
    story.append(Paragraph("• <code>src/services/</code>: Isolated business logic layer (dataService.ts) containing filtering and mathematical aggregation algorithms.", bullet_style))
    story.append(Paragraph("• <code>src/types/</code>: Central TypeScript contracts and data models.", bullet_style))
    story.append(Paragraph("• <code>src/utils/</code>: Synthetic seeded data generation engine (mockDataGenerator.ts).", bullet_style))
    story.append(Spacer(1, 4))

    # -------------------------------------------------------------
    # 14. IMPORTANT CODE MODULES
    # -------------------------------------------------------------
    story.append(Paragraph("14. Important Code Modules", h1_style))
    modules = [
        ("dataService.ts", "Analytical brain of the system. Contains all filtering algorithms, KPI mathematical reductions, and comparison group-by processors. Completely decouples logic from UI."),
        ("mockDataGenerator.ts", "Deterministic data generation engine. Uses a seeded LCG (seed=42) and economic/seasonal multipliers to generate ~2,500+ realistic transaction records."),
        ("DashboardPage.tsx", "Primary operational view. Coordinates 10-parameter filter drawer, 5 KPI cards, 4 Recharts visual components, and the Leaflet spatial map."),
        ("ComparePage.tsx", "Side-by-side benchmarking engine. Computes percentage delta differentials between competing entities and merges timeline series onto a shared multi-line chart."),
        ("IndiaSvgMap.tsx", "Custom interactive SVG map of India. Features interactive state hitboxes, real-time KPI card hover previews, and Framer Motion micro-interactions."),
        ("LeafletMap.tsx", "Geospatial mapping component. Maps 44 Indian cities to geographical coordinates using OpenStreetMap tiles and custom HTML circle markers."),
        ("Table.tsx", "Enterprise generic table component (Table<T>). Implements multi-key searching, column sorting, pagination, and client-side CSV downloads.")
    ]
    for mname, mdesc in modules:
        story.append(Paragraph(f"• <b><code>{mname}</code>:</b> {mdesc}", bullet_style))
    story.append(Spacer(1, 4))

    # -------------------------------------------------------------
    # 15. SECURITY
    # -------------------------------------------------------------
    story.append(Paragraph("15. Security Assessment", h1_style))
    story.append(Paragraph("• <b>Authentication &amp; Authorization:</b> None implemented. All routes are public.", bullet_style))
    story.append(Paragraph("• <b>Password &amp; Token Handling:</b> None required as there are no user accounts or JWT sessions.", bullet_style))
    story.append(Paragraph("• <b>Secrets &amp; Credentials:</b> Clean. No private API keys or tokens are stored in source code.", bullet_style))
    story.append(Paragraph("• <b>Identified Security Weaknesses for Production:</b> Client-side data exposure (all ~2,500 records reside in browser RAM), lack of route guards, and lack of backend rate limiting. Full enterprise security (JWT, RBAC) must be added when binding to the FastAPI backend.", bullet_style))
    story.append(Spacer(1, 4))

    # -------------------------------------------------------------
    # 16. ERROR HANDLING & VALIDATION
    # -------------------------------------------------------------
    story.append(Paragraph("16. Error Handling &amp; Validation", h1_style))
    story.append(Paragraph("• <b>Empty State Handling:</b> Implemented via <code>EmptyState.tsx</code>. Displays an alert card with 'Reset All Filters' if zero records match queries.", bullet_style))
    story.append(Paragraph("• <b>Loading Skeletons:</b> Implemented via <code>LoadingSkeleton.tsx</code>. Displays animated pulse cards during simulated 300ms query transitions.", bullet_style))
    story.append(Paragraph("• <b>Cascading Filter Resets:</b> Selecting a new Category resets Brand and SKU; changing State resets City to prevent invalid queries.", bullet_style))
    story.append(Paragraph("• <b>Type Safety:</b> Strict TypeScript types and optional chaining prevent runtime null pointer exceptions.", bullet_style))
    story.append(Spacer(1, 4))

    # -------------------------------------------------------------
    # 17. TESTING
    # -------------------------------------------------------------
    story.append(Paragraph("17. Testing", h1_style))
    story.append(Paragraph("• <b>Automated Tests:</b> No automated test files (Jest/Vitest/Playwright) are currently present.", bullet_style))
    story.append(Paragraph("• <b>Static Quality:</b> Oxlint (<code>.oxlintrc.json</code>) and TypeScript strict type checking (<code>tsc -b</code>) enforce clean syntax and type adherence.", bullet_style))
    story.append(Paragraph("• <b>Manual Testing:</b> Verified functional behavior across all 8 routes, filter combinations, map markers, modals, and file exports.", bullet_style))
    story.append(Spacer(1, 4))

    # -------------------------------------------------------------
    # 18. CURRENT PROJECT STATUS
    # -------------------------------------------------------------
    story.append(Paragraph("18. Current Project Status: Functional Application / High-Fidelity MVP", h1_style))
    story.append(Paragraph("The project is a fully functional, interactive frontend Single Page Application. It is not merely a static mockup; all navigation, filters, maps, charts, mathematical aggregations, and file exports are operating smoothly with in-memory data. It is ready for backend integration.", body_style))
    story.append(Spacer(1, 4))

    # -------------------------------------------------------------
    # 19. STRENGTHS & 20. LIMITATIONS
    # -------------------------------------------------------------
    story.append(Paragraph("19. Technical Strengths", h1_style))
    story.append(Paragraph("• <b>Striking Neo-Brutalist UI:</b> Distinctive design with solid 3px borders, flat offset shadows, and Framer Motion micro-animations.", bullet_style))
    story.append(Paragraph("• <b>Decoupled Architecture:</b> Clean separation of business logic in <code>dataService.ts</code> allows rapid backend binding.", bullet_style))
    story.append(Paragraph("• <b>Dual-Mapping Strategy:</b> Combines an artistic SVG India map with a precision Leaflet geospatial map.", bullet_style))
    story.append(Paragraph("• <b>Sub-Second Query Velocity:</b> Fast in-memory array filtering and memoization eliminate UI latency.", bullet_style))
    story.append(Paragraph("• <b>Zero-Dependency Multi-Format Exporters:</b> Native CSV downloads, Excel .xls sheets, and print-ready PDF styling.", bullet_style))

    story.append(Paragraph("20. Realistic Limitations", h1_style))
    story.append(Paragraph("• <b>Client-Side RAM Bounds:</b> In-memory storage cannot scale to millions of transaction rows without server-side pagination.", bullet_style))
    story.append(Paragraph("• <b>Synthetic Data:</b> Lacks live integrations with real retail POS or e-commerce webhooks.", bullet_style))
    story.append(Paragraph("• <b>No Machine Learning:</b> Growth metrics are generated mathematically rather than via trained predictive ML models.", bullet_style))
    story.append(Paragraph("• <b>Lack of Session Persistence:</b> Settings changes reset on page reload.", bullet_style))
    story.append(Spacer(1, 4))

    # -------------------------------------------------------------
    # 21. FUTURE SCOPE
    # -------------------------------------------------------------
    story.append(Paragraph("21. Future Scope", h1_style))
    story.append(Paragraph("• <b>Short-Term:</b> Add <code>localStorage</code> persistence for user preferences, add Vitest unit test suites for <code>dataService.ts</code>, and expand dataset to all 28 Indian states.", bullet_style))
    story.append(Paragraph("• <b>Advanced:</b> Build the planned FastAPI Python backend with PostgreSQL database and integrate JWT authentication with role-based permissions.", bullet_style))
    story.append(Paragraph("• <b>Production:</b> Connect true ML forecasting models (ARIMA / Prophet) in Python to predict future seasonal consumption and containerize with Docker.", bullet_style))
    story.append(Spacer(1, 4))

    # -------------------------------------------------------------
    # 22. TEACHER EXPLANATION SCRIPT
    # -------------------------------------------------------------
    story.append(Paragraph("22. Teacher Explanation (1–2 Minute Spoken Script)", h1_style))
    script_text = (
        "\"Good morning/afternoon, Sir/Ma'am. Today I am presenting <b>MarketPulse AI</b>, a consumer market intelligence and spatial analytics platform focused on regional Indian markets.<br/><br/>"
        "<b>The Problem:</b> In India's retail and FMCG sectors, consumer behavior varies drastically between states and cities. National sales averages often hide important local trends—such as festive Diwali sales peaks in northern states or distinct category preferences in southern metros. Traditional reports are static and slow to filter.<br/><br/>"
        "<b>What I Built:</b> I built a fully interactive analytics platform using React 19, TypeScript, Vite, and Tailwind CSS, styled with a modern Neo-Brutalist design language. The application features a 4-step geographic drilldown portal using an interactive SVG map of India and an interactive Leaflet geospatial map plotting 44 major cities.<br/><br/>"
        "<b>How It Works:</b> In the dashboard, users can filter data across 10 dimensions—including states, cities, categories, brands, SKUs, years, quarters, age groups, and genders. My decoupled service layer processes these queries in memory to instantly calculate top-level KPIs, monthly revenue trends, category splits, and brand rankings using Recharts.<br/><br/>"
        "<b>Key Features:</b> Beyond the dashboard, I built a side-by-side comparison engine that calculates performance margin deltas between competing cities or brands, a product catalog with SKU detail modals, and an export center that generates CSV files, Excel spreadsheets, and print-ready PDF reports.<br/><br/>"
        "<b>Architecture:</b> The frontend is completely decoupled from the data layer. While the current version runs on a deterministic in-memory data engine with over 2,500 records, the service architecture is specifically designed to connect directly to a FastAPI backend in future phases. Thank you!\""
    )
    story.append(callout_box(script_text, "DIRECT VIVA SCRIPT (SPEAK TO TEACHER)"))
    story.append(Spacer(1, 6))

    # -------------------------------------------------------------
    # 23. TECHNICAL VIVA QUESTIONS
    # -------------------------------------------------------------
    story.append(Paragraph("23. Technical Viva Questions &amp; Answers", h1_style))
    viva_qas = [
        ("Q1: What is the primary purpose of MarketPulse AI?",
         "It is an interactive market intelligence dashboard designed to analyze and visualize regional consumer product consumption across 11 Indian states and 44 cities, breaking down trends by demographic cohorts, product SKUs, and seasonal quarters."),
        
        ("Q2: What frontend technology stack did you use, and why?",
         "I used React 19 with TypeScript and Vite. React provides a reactive component model; TypeScript guarantees compile-time type safety; and Vite offers ultra-fast build times and Hot Module Replacement (HMR)."),
        
        ("Q3: What is Neo-Brutalism in the context of your UI?",
         "Neo-Brutalism is a modern design aesthetic characterized by high contrast, thick solid #111111 borders, flat offset drop shadows (without blur), vibrant accent colors, bold uppercase typography (Space Grotesk), and tactile button-press micro-animations."),
        
        ("Q4: Does this project have a live backend server?",
         "Not in the current version. The application runs as a client-side SPA with a decoupled service layer (dataService.ts) querying an in-memory cache. It is architected to easily connect to a FastAPI REST backend in the future."),
        
        ("Q5: Does the project connect to a physical database?",
         "No. Data is generated dynamically using a seeded pseudo-random generator (mockDataGenerator.ts) and cached in memory."),
        
        ("Q6: How does the deterministic data generator work?",
         "It uses a Linear Congruential Generator with a fixed seed of 42. This ensures that every time the app runs, it produces the exact same realistic dataset (~2,500+ records) with consistent seasonal spikes (e.g., Diwali in Q4) and state economic weights."),
        
        ("Q7: What libraries did you use for charting and data visualization?",
         "I used Recharts to build Area, Bar, Pie, and Line charts, customized with Neo-Brutalist borders, custom tooltips, and Rupee currency formatters."),
        
        ("Q8: How do the two mapping components differ?",
         "IndiaSvgMap is a custom, lightweight SVG-based vector map used for rapid state-level selection. LeafletMap is a real geospatial mapping component using OpenStreetMap tiles and geographical latitude/longitude coordinates to plot 44 specific city markers."),
        
        ("Q9: How are dependent dropdown filters handled?",
         "In DashboardPage.tsx, state changes trigger cascading updates. If the user changes State, City is reset. If Category changes, Brand and Product are reset to ensure queries never reference invalid combinations."),
        
        ("Q10: How do you achieve sub-second filtering performance without a database index?",
         "The dataset of ~2,500 records is stored in browser RAM. Using React's useMemo hook, single-pass array filter and reduce operations execute in just a few milliseconds."),
        
        ("Q11: How does the Side-by-Side Comparison feature calculate deltas?",
         "It queries Entity A and Entity B separately using shared filters, computes the percentage difference using ((valB - valA) / valA) * 100, and merges their timeline series chronologically onto a shared multi-line Recharts graph."),
        
        ("Q12: How is the Excel export implemented without a backend?",
         "In ReportsPage.tsx, columns and rows are converted into tab-delimited text and formatted as a data:application/vnd.ms-excel data URI, which the browser downloads natively as an .xls file."),
        
        ("Q13: How does the print-ready PDF export work?",
         "It triggers window.print() and uses Tailwind's print: media queries (e.g., print:hidden on navbar, sidebar, and filter inputs) so the browser prints only the official, timestamped report ledger."),
        
        ("Q14: Is there any real Artificial Intelligence or Machine Learning in the project?",
         "No. The term 'AI' is part of the platform's branding. Growth percentages and seasonal demand shifts are computed using mathematical weighting algorithms rather than machine learning models."),
        
        ("Q15: Why is Axios present in package.json if it isn't used?",
         "Axios was installed during initial scaffolding to prepare for connecting to the planned FastAPI backend. In the current build, all data is served internally via dataService.ts."),
        
        ("Q16: How is routing handled?",
         "Routing is managed by react-router-dom (version 7) using a root BrowserRouter. Page views are organized under a shared MainLayout, with wildcards redirecting back to /."),
        
        ("Q17: What security mechanisms are currently implemented?",
         "The current client-side build does not implement authentication, password hashing, or route guards. No private API keys are exposed. Full enterprise security (JWT, RBAC) is planned for the backend integration phase."),
        
        ("Q18: What happens if a user applies filters that match zero records?",
         "The UI renders an EmptyState component displaying a warning card with an alert icon and a 'Reset All Filters' button."),
        
        ("Q19: What is Oxlint?",
         "Oxlint is an ultra-fast, Rust-based JavaScript/TypeScript linter configured in .oxlintrc.json to enforce clean code and catch syntax errors."),
        
        ("Q20: What is the primary limitation of the current architecture?",
         "Scalability. Because all records are held in browser memory, the application cannot handle millions of rows without a dedicated backend server and database."),
        
        ("Q21: What would be your immediate next step to take this project to production?",
         "Develop the FastAPI backend with a PostgreSQL database, replace dataService.ts calls with real Axios API requests, and add JWT-based user authentication.")
    ]

    for q, a in viva_qas:
        story.append(Paragraph(f"<b>{q}</b>", viva_q_style))
        story.append(Paragraph(f"<b>Answer:</b> {a}", viva_a_style))

    story.append(Spacer(1, 6))

    # -------------------------------------------------------------
    # 24. QUICK PROJECT CHEAT SHEET
    # -------------------------------------------------------------
    story.append(Paragraph("24. Quick Project Cheat Sheet", h1_style))

    cheat_data = [
        [Paragraph("<b>Parameter</b>", table_header_style), Paragraph("<b>Summary Details</b>", table_header_style)],
        [Paragraph("Project Name", table_cell_bold), Paragraph("MarketPulse AI", table_cell_style)],
        [Paragraph("Problem Solved", table_cell_bold), Paragraph("Fragmented Indian regional consumer demand; national aggregates mask localized trends.", table_cell_style)],
        [Paragraph("Solution", table_cell_bold), Paragraph("Interactive spatial and demographic analytics dashboard with multi-tier drilldowns and benchmarking.", table_cell_style)],
        [Paragraph("Frontend Stack", table_cell_bold), Paragraph("React 19, TypeScript, Vite, Tailwind CSS v4, Framer Motion, Lucide React.", table_cell_style)],
        [Paragraph("Backend Stack", table_cell_bold), Paragraph("Decoupled client architecture ready for FastAPI integration (none in active code).", table_cell_style)],
        [Paragraph("Database", table_cell_bold), Paragraph("In-memory cached array of ~2,500+ records generated deterministically (seed=42).", table_cell_style)],
        [Paragraph("AI / ML Status", table_cell_bold), Paragraph("Branding only; metrics calculated via mathematical seasonality and state economic multipliers.", table_cell_style)],
        [Paragraph("APIs Used", table_cell_bold), Paragraph("OpenStreetMap tile server (Leaflet) and Google Fonts CDN. No live backend REST endpoints.", table_cell_style)],
        [Paragraph("Authentication", table_cell_bold), Paragraph("None (publicly accessible frontend MVP).", table_cell_style)],
        [Paragraph("Main Features", table_cell_bold), Paragraph("Dual maps (SVG + Leaflet), 10-tier filter matrix, real-time KPIs, Recharts analytics, side-by-side compare, SKU modals, CSV/Excel/PDF export.", table_cell_style)],
        [Paragraph("Architecture", table_cell_bold), Paragraph("Client-Side SPA with an isolated Decoupled Service Layer pattern.", table_cell_style)],
        [Paragraph("Current Status", table_cell_bold), Paragraph("Functional Application / High-Fidelity MVP.", table_cell_style)],
        [Paragraph("Key Technical Highlight", table_cell_bold), Paragraph("Sub-second multi-dimensional analytical queries on ~2,500+ records with zero-dependency multi-format exports in Neo-Brutalism styling.", table_cell_style)]
    ]

    t_cheat = Table(cheat_data, colWidths=[140, 380])
    t_cheat.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), COLOR_PRIMARY),
        ('BOX', (0,0), (-1,-1), 1, COLOR_DARK),
        ('INNERGRID', (0,0), (-1,-1), 0.5, COLOR_BORDER),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, COLOR_BG_LIGHT]),
    ]))
    story.append(t_cheat)

    # Build the document
    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"[SUCCESS] PDF generated at: {output_path}")

if __name__ == '__main__':
    out_file = sys.argv[1] if len(sys.argv) > 1 else "MarketPulse_AI_Complete_Project_Documentation.pdf"
    create_pdf(out_file)
