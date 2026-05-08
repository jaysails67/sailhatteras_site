--
-- PostgreSQL database dump
--

\restrict Jpr0hT74ZgSULkJOnzgCQnneAvmpI5LcAX3iMj40dtyFg1U91nMwmvNDr92AzYh

-- Dumped from database version 16.10
-- Dumped by pg_dump version 16.10

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: contact_submissions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.contact_submissions (
    id integer NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    message text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.contact_submissions OWNER TO postgres;

--
-- Name: contact_submissions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.contact_submissions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.contact_submissions_id_seq OWNER TO postgres;

--
-- Name: contact_submissions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.contact_submissions_id_seq OWNED BY public.contact_submissions.id;


--
-- Name: content_pages; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.content_pages (
    id integer NOT NULL,
    slug text NOT NULL,
    title text NOT NULL,
    content text NOT NULL,
    meta_data jsonb,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.content_pages OWNER TO postgres;

--
-- Name: content_pages_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.content_pages_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.content_pages_id_seq OWNER TO postgres;

--
-- Name: content_pages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.content_pages_id_seq OWNED BY public.content_pages.id;


--
-- Name: investor_applications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.investor_applications (
    id integer NOT NULL,
    user_id integer NOT NULL,
    status text DEFAULT 'pending'::text NOT NULL,
    nda_accepted_at timestamp with time zone,
    notes text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.investor_applications OWNER TO postgres;

--
-- Name: investor_applications_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.investor_applications_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.investor_applications_id_seq OWNER TO postgres;

--
-- Name: investor_applications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.investor_applications_id_seq OWNED BY public.investor_applications.id;


--
-- Name: posts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.posts (
    id integer NOT NULL,
    title text NOT NULL,
    excerpt text NOT NULL,
    content text NOT NULL,
    type text NOT NULL,
    media_url text,
    featured boolean DEFAULT false NOT NULL,
    published_at timestamp with time zone DEFAULT now() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.posts OWNER TO postgres;

--
-- Name: posts_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.posts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.posts_id_seq OWNER TO postgres;

--
-- Name: posts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.posts_id_seq OWNED BY public.posts.id;


--
-- Name: sh_availability; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sh_availability (
    id integer NOT NULL,
    trip_id integer NOT NULL,
    date date NOT NULL,
    available_slots integer DEFAULT 1 NOT NULL,
    is_blocked boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.sh_availability OWNER TO postgres;

--
-- Name: sh_availability_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.sh_availability_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.sh_availability_id_seq OWNER TO postgres;

--
-- Name: sh_availability_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.sh_availability_id_seq OWNED BY public.sh_availability.id;


--
-- Name: sh_bookings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sh_bookings (
    id integer NOT NULL,
    trip_id integer NOT NULL,
    customer_name text NOT NULL,
    customer_email text NOT NULL,
    customer_phone text NOT NULL,
    booking_date date NOT NULL,
    passengers integer NOT NULL,
    total_cents integer NOT NULL,
    status text DEFAULT 'pending'::text NOT NULL,
    special_requests text,
    stripe_session_id text,
    stripe_payment_intent_id text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    vessel_id integer,
    vessel_name text,
    vacation_start date,
    vacation_end date
);


ALTER TABLE public.sh_bookings OWNER TO postgres;

--
-- Name: sh_bookings_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.sh_bookings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.sh_bookings_id_seq OWNER TO postgres;

--
-- Name: sh_bookings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.sh_bookings_id_seq OWNED BY public.sh_bookings.id;


--
-- Name: sh_contacts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sh_contacts (
    id integer NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    phone text,
    message text NOT NULL,
    trip_interest text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.sh_contacts OWNER TO postgres;

--
-- Name: sh_contacts_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.sh_contacts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.sh_contacts_id_seq OWNER TO postgres;

--
-- Name: sh_contacts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.sh_contacts_id_seq OWNED BY public.sh_contacts.id;


--
-- Name: sh_trip_vessels; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sh_trip_vessels (
    id integer NOT NULL,
    trip_id integer NOT NULL,
    vessel_id integer NOT NULL,
    price_override_cents integer,
    active boolean DEFAULT true NOT NULL
);


ALTER TABLE public.sh_trip_vessels OWNER TO postgres;

--
-- Name: sh_trip_vessels_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.sh_trip_vessels_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.sh_trip_vessels_id_seq OWNER TO postgres;

--
-- Name: sh_trip_vessels_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.sh_trip_vessels_id_seq OWNED BY public.sh_trip_vessels.id;


--
-- Name: sh_trips; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sh_trips (
    id integer NOT NULL,
    slug text NOT NULL,
    name text NOT NULL,
    category text NOT NULL,
    type text NOT NULL,
    short_description text NOT NULL,
    description text NOT NULL,
    duration text NOT NULL,
    price_min integer NOT NULL,
    price_display text NOT NULL,
    pricing_note text,
    max_passengers integer NOT NULL,
    boat text NOT NULL,
    highlights jsonb DEFAULT '[]'::jsonb NOT NULL,
    image_url text,
    active boolean DEFAULT true NOT NULL,
    sort_order integer DEFAULT 0 NOT NULL,
    stripe_price_id text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    pricing_model text DEFAULT 'per_person'::text NOT NULL,
    coming_soon boolean DEFAULT false NOT NULL
);


ALTER TABLE public.sh_trips OWNER TO postgres;

--
-- Name: sh_trips_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.sh_trips_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.sh_trips_id_seq OWNER TO postgres;

--
-- Name: sh_trips_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.sh_trips_id_seq OWNED BY public.sh_trips.id;


--
-- Name: sh_vessels; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sh_vessels (
    id integer NOT NULL,
    name text NOT NULL,
    description text DEFAULT ''::text NOT NULL,
    capacity integer DEFAULT 6 NOT NULL,
    price_cents integer NOT NULL,
    price_display text NOT NULL,
    image_url text,
    active boolean DEFAULT true NOT NULL,
    sort_order integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.sh_vessels OWNER TO postgres;

--
-- Name: sh_vessels_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.sh_vessels_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.sh_vessels_id_seq OWNER TO postgres;

--
-- Name: sh_vessels_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.sh_vessels_id_seq OWNED BY public.sh_vessels.id;


--
-- Name: team_members; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.team_members (
    id integer NOT NULL,
    name text NOT NULL,
    title text NOT NULL,
    bio text NOT NULL,
    headshot_url text,
    display_order integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.team_members OWNER TO postgres;

--
-- Name: team_members_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.team_members_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.team_members_id_seq OWNER TO postgres;

--
-- Name: team_members_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.team_members_id_seq OWNED BY public.team_members.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    phone text NOT NULL,
    password_hash text NOT NULL,
    role text DEFAULT 'investor'::text NOT NULL,
    approval_status text DEFAULT 'pending'::text NOT NULL,
    nda_accepted boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: waitlist; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.waitlist (
    id integer NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    phone text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.waitlist OWNER TO postgres;

--
-- Name: waitlist_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.waitlist_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.waitlist_id_seq OWNER TO postgres;

--
-- Name: waitlist_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.waitlist_id_seq OWNED BY public.waitlist.id;


--
-- Name: contact_submissions id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contact_submissions ALTER COLUMN id SET DEFAULT nextval('public.contact_submissions_id_seq'::regclass);


--
-- Name: content_pages id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.content_pages ALTER COLUMN id SET DEFAULT nextval('public.content_pages_id_seq'::regclass);


--
-- Name: investor_applications id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.investor_applications ALTER COLUMN id SET DEFAULT nextval('public.investor_applications_id_seq'::regclass);


--
-- Name: posts id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.posts ALTER COLUMN id SET DEFAULT nextval('public.posts_id_seq'::regclass);


--
-- Name: sh_availability id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sh_availability ALTER COLUMN id SET DEFAULT nextval('public.sh_availability_id_seq'::regclass);


--
-- Name: sh_bookings id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sh_bookings ALTER COLUMN id SET DEFAULT nextval('public.sh_bookings_id_seq'::regclass);


--
-- Name: sh_contacts id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sh_contacts ALTER COLUMN id SET DEFAULT nextval('public.sh_contacts_id_seq'::regclass);


--
-- Name: sh_trip_vessels id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sh_trip_vessels ALTER COLUMN id SET DEFAULT nextval('public.sh_trip_vessels_id_seq'::regclass);


--
-- Name: sh_trips id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sh_trips ALTER COLUMN id SET DEFAULT nextval('public.sh_trips_id_seq'::regclass);


--
-- Name: sh_vessels id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sh_vessels ALTER COLUMN id SET DEFAULT nextval('public.sh_vessels_id_seq'::regclass);


--
-- Name: team_members id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.team_members ALTER COLUMN id SET DEFAULT nextval('public.team_members_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: waitlist id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.waitlist ALTER COLUMN id SET DEFAULT nextval('public.waitlist_id_seq'::regclass);


--
-- Data for Name: contact_submissions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.contact_submissions (id, name, email, message, created_at) FROM stdin;
1	Jane Doe	jane@example.com	I am interested in learning more about your electric boats.	2026-04-30 01:47:32.682115+00
\.


--
-- Data for Name: content_pages; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.content_pages (id, slug, title, content, meta_data, updated_at) FROM stdin;
7	hero	Hero Section	Fly Above the Water. Zero Emissions. Pure Speed.	\N	2026-04-30 01:41:36.409182+00
8	about	About PamliEcoConnect	PamliEcoConnect manufactures cutting-edge electric foiling boats that hover above the water surface using advanced hydrofoil technology. We serve passenger transport operators, military and enforcement agencies, and recreational boating enthusiasts.	\N	2026-04-30 01:41:40.591355+00
9	home	PamliEcoConnect Home	PamliEcoConnect engineers cutting-edge electric foiling boats. Aerospace precision meets maritime craft for a silent, zero-emission, high-speed experience.	{"heroTitle": "Airborne above the water's surface.", "introText": "We are revolutionizing marine mobility. By lifting the hull out of the water, our advanced hydrofoil technology reduces drag by up to 80%, enabling unprecedented range and speed on battery power alone.", "heroTagline": "The Future of Waterborne Transport", "introHeading": "Silent. Fast. Precision-Engineered."}	2026-04-30 02:16:27.248301+00
2	products	Vessel & Technology Platform	<h1>5. Vessel &amp; Technology Platform</h1>\n\n<h2>5.1 Vessel Family</h2>\n<p>PamliEcoConnect anticipates a family of vessels optimized for Pamlico Sound conditions and passenger demand:</p>\n\n<p><strong>Flagship Class</strong></p>\n<ul>\n  <li>~40–50 passengers</li>\n  <li>Electric or hybrid-electric propulsion</li>\n  <li>Hydrofoil or foil-assisted hull to reduce drag and wake</li>\n  <li>USCG-certified passenger standards</li>\n  <li>Designed for Pamlico Sound depths, fetch, and weather</li>\n</ul>\n\n<p><strong>Secondary / Feeder Classes</strong></p>\n<ul>\n  <li>12–24 passenger craft</li>\n  <li>Used for feeder routes, charters, training, research, and special services</li>\n</ul>\n\n<h2>5.2 Technology &amp; Design Principles</h2>\n<ul>\n  <li><strong>Electric or hybrid-electric drive</strong> with shore-based charging at primary terminals.</li>\n  <li><strong>Foil assistance</strong> to:\n    <ul>\n      <li>Reduce drag and energy use,</li>\n      <li>Lower wake and shoreline impact,</li>\n      <li>Improve passenger comfort in chop.</li>\n    </ul>\n  </li>\n  <li><strong>Shallow-draft and low-wake geometry</strong> tuned to Pamlico Sound constraints.</li>\n  <li><strong>Safety and redundancy:</strong>\n    <ul>\n      <li>Operation in displacement mode at reduced speed if needed,</li>\n      <li>Redundant propulsion and control systems,</li>\n      <li>Conservative operating envelopes for weather and sea state.</li>\n    </ul>\n  </li>\n</ul>\n\n<h2>5.3 Manufacturer &amp; Partner Strategy</h2>\n<p>PamliEcoConnect will seek one or more strategic partners for:</p>\n<ul>\n  <li>Detailed design and engineering,</li>\n  <li>Vessel construction and lifecycle support,</li>\n  <li>Potential financing or lease-purchase structures,</li>\n  <li>A common platform approach that could serve both Pamlico and Chesapeake corridors.</li>\n</ul>	\N	2026-04-30 15:05:16.582+00
1	exec-summary	Executive Summary	<h1>Executive Summary</h1>\n  <p><em>"Fly Above the Water. Zero Emissions. Pure Speed."</em></p>\n\n  <h2>The Opportunity &amp; Vision</h2>\n  <p>PamliEcoConnect is a pioneering clean-technology transportation initiative designed to bring high-speed, zero-emission electric foiling passenger vessels to North Carolina's Pamlico Sound. By replacing long, indirect highway routes and slow, car-optimized ferries with quiet, low-wake electric fast-ferries, this project creates a critical "water highway" linking Inner Banks (IBX) and Outer Banks (OBX) communities.</p>\n  <p>For a North Carolina or Research Triangle Park investor, PamliEcoConnect represents an opportunity to fund a highly visible, locally grounded flagship project that blends cutting-edge maritime technology, strong regional economic impact, and highly attractive unit economics.</p>\n\n  <h2>The Market Gap &amp; Technological Advantage</h2>\n  <ul>\n    <li><strong>Uncontested Market Niche:</strong> There is currently no electric or hydrofoil-based passenger service on Pamlico Sound. Existing water mobility relies on vehicle ferries and a patchwork of small tour boats.</li>\n    <li><strong>Advanced Platform:</strong> Vessels will use electric or hybrid-electric propulsion combined with hydrofoil/foil-assist technology to drastically reduce drag, energy use, and shoreline wake.</li>\n    <li><strong>Dual-Layered Business Model:</strong> The initiative is uniquely structured with both a commercial operating arm (for-profit) and a mission-aligned partner layer (non-profit/foundation) to capture both commercial revenues and philanthropic/grant capital for decarbonization and research.</li>\n  </ul>\n\n  <h2>Highly Attractive Financial &amp; Operational Model</h2>\n  <p>The initial rollout utilizes a 12–24 passenger R&amp;D class of vessels to prove the concept before scaling to a 50-passenger flagship class. The Year 1 base model provides extremely compelling economics:</p>\n  <ul>\n    <li><strong>Strong Year 1 Profitability:</strong> A Year 1 scenario modeling an inaugural route (Vandemere–Ocracoke–Buxton) with a 20-passenger R&amp;D fleet projects approximately <strong>$6.28 million in ticket revenue</strong> and <strong>$3.48 million in operating profit (EBITDA)</strong>.</li>\n    <li><strong>Optimized Asset Utilization:</strong> A planned winter relocation of the vessels to a southern market smooths out seasonal demand, improving asset utilization and significantly boosting annual revenue.</li>\n    <li><strong>Fast Breakeven:</strong> Commercial breakeven is targeted within 3 to 5 years after launch.</li>\n    <li><strong>Lower Long-Run Costs:</strong> Electrical energy costs combined with foiling efficiencies are expected to be stable and lower per passenger-mile than conventional diesel workboats.</li>\n  </ul>\n\n  <h2>Scalability &amp; Strategic Expansion</h2>\n  <ul>\n    <li><strong>A Repeatable Platform:</strong> PamliEcoConnect is designed to scale. Once proven in North Carolina, the exact same technology and operating model can be exported to comparable U.S. coastal corridors.</li>\n    <li><strong>Ready-to-Go Expansion Market:</strong> Regional partners in the Chesapeake Bay have already validated demand — forecasting 50,000 annual passengers and $11M in economic impact — for similar 50-passenger hybrid-electric ferries, positioning PamliEcoConnect perfectly for sister deployments.</li>\n  </ul>\n\n  <h2>Non-Dilutive Funding &amp; Public-Private Partnerships (P3)</h2>\n  <ul>\n    <li><strong>Grant Readiness:</strong> The company is aggressively positioned to capture significant non-dilutive federal and state capital, including NSF SBIR/STTR grants, DOE/ARPA-E maritime electrification funds, and MARAD Small Shipyard grants. Small business waivers also allow for a 50% cost-share waiver on U.S. Navy/NSRP projects.</li>\n    <li><strong>Strategic P3 Alignment:</strong> The plan anticipates strong collaboration with the NCDOT Ferry Division, Visit NC, and local governments to share infrastructure planning, terminal costs, and marketing efforts.</li>\n  </ul>\n\n  <h2>The Offering: Early Investor Opportunity</h2>\n  <ul>\n    <li><strong>Target Raise:</strong> $1,000,000 (Seed / Series Seed).</li>\n    <li><strong>Use of Proceeds:</strong> Finalizing design, USCG approval, and deploying the initial 20-passenger R&amp;D fleet on Pamlico routes to demonstrate safety, economics, and demand — paving the way for the larger $20M Series A 50-passenger rollout.</li>\n    <li><strong>Favorable Timing &amp; Valuation:</strong> Investors are entering before the commercialization of the 20-passenger platform and before contracted deployments of the 50-passenger fleet, offering strategic exit potential to large acquirers in transportation, energy, or defense.</li>\n  </ul>	{"section": "investor"}	2026-05-01 00:28:32.11899+00
177	company-overview	Company Overview	<h1>Company Overview</h1>\n\n<h2>Mission</h2>\n<p>To provide fast, clean, and locally appropriate water-based transportation that:</p>\n<ul>\n  <li>Connects Inner Banks and Outer Banks communities,</li>\n  <li>Reduces emissions and wake impacts across Pamlico Sound, and</li>\n  <li>Creates tangible economic and educational opportunities in coastal North Carolina.</li>\n</ul>\n\n<h2>Business Structure</h2>\n<p>PamliEcoConnect is being developed as a <strong>platform</strong>, not just a single boat, structured in two complementary layers:</p>\n\n<h3>For-Profit Operating Entity</h3>\n<p>Responsible for the day-to-day business of running passenger ferry service:</p>\n<ul>\n  <li>Vessel operations and crewing</li>\n  <li>Ticketing, revenue management, and customer service</li>\n  <li>Scheduling, route optimization, and charter operations</li>\n  <li>Day-to-day safety, maintenance coordination, and regulatory compliance</li>\n</ul>\n\n<h3>Mission-Driven Partner Layer</h3>\n<p>A non-profit or foundation alignment focused on impact and long-term sustainability:</p>\n<ul>\n  <li>Research and demonstration projects (electric propulsion, hydrofoil wake and shoreline studies)</li>\n  <li>Educational programs, youth engagement, and workforce development</li>\n  <li>Community access, grants, and philanthropic support</li>\n</ul>\n<p>This dual structure allows PamliEcoConnect to speak to both <strong>commercial investors</strong> and <strong>mission-aligned funders</strong> simultaneously.</p>\n\n<h2>Strategic Positioning</h2>\n<p>PamliEcoConnect sits at the intersection of three converging trends:</p>\n<ul>\n  <li><strong>Clean transportation and decarbonization</strong> &mdash; Electric and foil-assisted ferries as a visible, high-impact climate project for coastal waters.</li>\n  <li><strong>Regional mobility and tourism</strong> &mdash; Faster, more enjoyable water links between Pamlico communities, designed to complement &mdash; not compete with &mdash; existing NCDOT ferries.</li>\n  <li><strong>Local expertise and national relevance</strong> &mdash; A project rooted in Hatteras Island and Pamlico Sound, but part of a broader class of electric fast-ferry initiatives along the U.S. East Coast.</li>\n</ul>\n\n<h3>Key Advantages</h3>\n<ul>\n  <li>First-mover potential for electric / foil passenger service on Pamlico Sound</li>\n  <li>Alignment with North Carolina tourism, coastal resilience, and decarbonization goals</li>\n  <li>A family of vessels serving multiple market segments:\n    <ul>\n      <li>50-passenger flagship class for primary routes</li>\n      <li>12&ndash;24 passenger R&amp;D class for feeder routes, training, charters, and lower-demand services</li>\n    </ul>\n  </li>\n</ul>\n\n<h2>Chesapeake Bay Connection</h2>\n<p>In parallel, regional partners on Chesapeake Bay have advanced a concept for 50-passenger hybrid-electric ferries linking Annapolis, Chesapeake Beach, Solomons Island, Crisfield, and Smith Island.</p>\n<p>A five-county tourism consortium (Anne Arundel, Calvert, Queen Anne&rsquo;s, Somerset, St. Mary&rsquo;s) has:</p>\n<ul>\n  <li>Completed a U.S. Department of Commerce&ndash;funded feasibility study</li>\n  <li>Found the project feasible and is targeting launch before 2030</li>\n  <li>Forecast roughly 50,000 annual passengers and approximately $11 million in annual economic benefit from visitor spending alone</li>\n</ul>\n<p>PamliEcoConnect is aligned with this emerging Chesapeake model &mdash; both use fast, low-emission passenger ferries to unlock water-based mobility and economic activity, and both seek federal and state support for clean ferry infrastructure. PamliEcoConnect on Pamlico Sound is positioned as a flagship, locally grounded deployment and as a <strong>sister opportunity</strong> to Chesapeake should a common vessel platform be adopted.</p>\n\n<h2>Founding &amp; Local Roots</h2>\n<p>PamliEcoConnect builds on the work of <strong>Phillips Boatworks</strong> (Hatteras Island) and local partners who:</p>\n<ul>\n  <li>Have decades of experience designing, building, and operating sail and power vessels in the Outer Banks and Pamlico Sound</li>\n  <li>Understand the weather, depths, routes, and working-waterfront culture of the region</li>\n  <li>Are already engaged in youth sailing, training, and community-based maritime programs</li>\n</ul>\n<p>This local foundation is critical: PamliEcoConnect is not an abstract inland concept. It is a project conceived and developed on the water, by operators who live with Pamlico Sound every day.</p>	{"section": "investor"}	2026-04-30 14:51:17.441587+00
185	market-analysis	Market Analysis	<h1>3. Market Analysis</h1>\n\n<h2>3.1 Regional Context – Pamlico Sound</h2>\n<p>Pamlico Sound is one of the largest estuarine systems in the United States, separating the Outer Banks barrier islands from the Inner Banks mainland. It connects:</p>\n<ul>\n  <li>Working waterfront communities,</li>\n  <li>Established tourism hubs, and</li>\n  <li>Environmentally sensitive shorelines and fisheries.</li>\n</ul>\n<p>Despite this natural "water highway," mobility is dominated by:</p>\n<ul>\n  <li>Long, indirect highway trips, and</li>\n  <li>Vehicle ferries optimized for cars and trucks rather than foot passengers.</li>\n</ul>\n<p>The geography is ideal for fast, clean passenger service that shortens travel times, provides a better visitor experience, and reduces congestion and emissions.</p>\n\n<h2>3.2 Tourism &amp; Local Demand</h2>\n<p>The Pamlico / OBX / IBX region attracts hundreds of thousands of visitors each year, with strong seasonality from spring through fall. Key market segments include:</p>\n<ul>\n  <li><strong>Family and vacation tourists</strong> – Outer Banks, Hatteras Island, Ocracoke.</li>\n  <li><strong>Eco-tourism and adventure travelers</strong> – kayaking, sailing, fishing, wildlife.</li>\n  <li><strong>Residents and workers</strong> – moving between mainland towns and island communities.</li>\n  <li><strong>Educational and research travelers</strong> – universities, field programs, nonprofits.</li>\n</ul>\n<p>The same pattern seen in Chesapeake—strong seasonal tourism, congested road corridors, underused water routes—exists in Pamlico Sound, but with even fewer existing passenger options.</p>\n\n<h2>3.3 Transportation Gap</h2>\n<p>Today, waterborne mobility across Pamlico Sound is:</p>\n<ul>\n  <li>Primarily vehicle ferry services operated by NCDOT,</li>\n  <li>A patchwork of small tour boats, charters, and fishing vessels,</li>\n  <li>Not optimized for intercity or inter-community passenger movement.</li>\n</ul>\n<p>There is no electric fast-ferry or hydrofoil-based passenger service linking IBX and OBX communities. Travelers face long drive times, bridge and ferry bottlenecks, and limited options that turn "getting there" into part of the tourist experience.</p>\n<p>PamliEcoConnect is designed to occupy this <strong>uncontested clean-fast-passenger niche</strong>.</p>\n\n<h2>3.4 Competitive Landscape</h2>\n<ul>\n  <li><strong>NCDOT Ferries</strong> – Non-competing; potential partner. Slow, vehicle-oriented, with fare structures and schedules optimized for cars and trucks rather than high-value passenger trips.</li>\n  <li><strong>Local tour operators</strong> – Offer short scenic trips and charters, but not consistent intercity transit.</li>\n  <li><strong>Charter and private operators</strong> – Serve private groups; not scalable public mobility.</li>\n</ul>\n<p>PamliEcoConnect complements rather than displaces existing services, offering:</p>\n<ul>\n  <li>Faster, cleaner, passenger-focused links,</li>\n  <li>New eco-tourism and experiential travel products,</li>\n  <li>A platform for public-private collaboration and research.</li>\n</ul>	\N	2026-04-30 15:00:41.120682+00
4	marketing-plan	Public-Private Partnership (P3) Structure	<h1>6. Public‑Private Partnership (P3) Structure</h1>\n<h2>6.1 State &amp; Public Partners (Targeted)</h2>\n<p><strong>NCDOT Ferry Division</strong></p>\n<ul><li>Dock and terminal coordination,</li><li>Shared infrastructure planning,</li><li>Safety and regulatory alignment,</li><li>Integration into broader state mobility strategy.</li></ul>\n<p><strong>Visit NC / Regional Tourism Authorities</strong></p>\n<ul><li>Co-branded marketing and digital promotion,</li><li>Inclusion in statewide itineraries,</li><li>Support for eco-tourism and experiential travel campaigns.</li></ul>\n<p><strong>Local Governments &amp; Counties (Pamlico-adjacent)</strong></p>\n<ul><li>Site access and permitting,</li><li>Local economic development alignment,</li><li>Potential in-kind contributions around terminals and access.</li></ul>\n<h2>6.2 Private Operator Responsibilities</h2>\n<p>PamliEcoConnect’s operating company will be responsible for:</p>\n<ul><li>Vessel operations, crewing, and scheduling.</li><li>Ticketing, pricing, and revenue management.</li><li>Customer service and on-board experience.</li><li>Maintenance coordination, winter layup, and lifecycle planning.</li><li>Insurance, regulatory compliance, and safety management.</li></ul>	\N	2026-04-30 15:10:56.056+00
193	operations	Operations Plan	<h1>7. Operations Plan</h1>\n<h2>7.1 Staffing</h2>\n<p>Per flagship vessel:</p>\n<ul><li>1 Captain + 2 Deckhands (per sailing day), with relief crew as needed.</li><li>Dock agents or shared staff at key terminals.</li><li>Central operations manager and modest administrative support.</li></ul>\n<p>As the fleet scales, staffing scales in proportion to route count and frequency.</p>\n<h2>7.2 Maintenance</h2>\n<ul><li>Preventive maintenance built into the schedule.</li><li>For electric/foil systems, adherence to manufacturer service intervals.</li><li>Winter layup for deeper maintenance and upgrades.</li></ul>\n<h2>7.3 Safety &amp; Compliance</h2>\n<ul><li>USCG compliance for passenger ferries.</li><li>Standardized safety training and onboard drills for crew.</li><li>Weather monitoring protocols and conservative go/no-go policies.</li><li>Clear emergency procedures for both foil and displacement operation.</li></ul>	\N	2026-04-30 15:10:56.459045+00
194	economic-impact	Economic Impact	<h1>9. Economic Impact</h1>\n<p>PamliEcoConnect is expected to deliver:</p>\n<ul><li><strong>Increased visitor spending</strong> in waterfront communities (lodging, dining, retail, recreation).</li><li><strong>New jobs</strong> in vessel operations, dock staffing, maintenance, hospitality, and supporting services.</li><li><strong>Reduced roadway congestion</strong> and associated emissions on key corridors.</li><li><strong>Enhanced regional mobility,</strong> especially for workers and residents without easy access to cars.</li><li>A visible clean-transportation <strong>“flagship project”</strong> that can anchor broader coastal resilience and decarbonization narratives for North Carolina.</li></ul>\n<p>Experience from comparable projects (e.g., the Chesapeake Bay ferry study) suggests that even relatively modest ridership—on the order of tens of thousands of passengers per year—can translate into multi-million-dollar annual economic impacts in visitor spending alone. PamliEcoConnect is designed to channel those benefits into Pamlico Sound communities while also serving as a technology and skills catalyst for the region’s maritime sector.</p>	\N	2026-04-30 15:11:50.773601+00
195	risk-analysis	Risk Analysis & Mitigation	<h1>10. Risk Analysis &amp; Mitigation</h1>\n<div style="overflow-x:auto">\n<table style="width:100%;border-collapse:collapse;font-size:0.9em">\n  <thead>\n    <tr style="background:rgba(255,255,255,0.05)">\n      <th style="padding:12px 16px;text-align:left;border-bottom:1px solid rgba(255,255,255,0.1);font-weight:600">Risk Category</th>\n      <th style="padding:12px 16px;text-align:left;border-bottom:1px solid rgba(255,255,255,0.1);font-weight:600">Description</th>\n      <th style="padding:12px 16px;text-align:left;border-bottom:1px solid rgba(255,255,255,0.1);font-weight:600">Mitigation Strategies</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr><td style="padding:12px 16px;border-bottom:1px solid rgba(255,255,255,0.06);font-weight:600">Technology (electric/foils)</td><td style="padding:12px 16px;border-bottom:1px solid rgba(255,255,255,0.06)">Performance, reliability, and integration of electric + foil systems.</td><td style="padding:12px 16px;border-bottom:1px solid rgba(255,255,255,0.06)">Use proven components, conservative operating envelopes, redundancy, phased rollout.</td></tr>\n    <tr><td style="padding:12px 16px;border-bottom:1px solid rgba(255,255,255,0.06);font-weight:600">Regulatory &amp; Permitting</td><td style="padding:12px 16px;border-bottom:1px solid rgba(255,255,255,0.06)">Approvals for terminals, routes, and new vessel types.</td><td style="padding:12px 16px;border-bottom:1px solid rgba(255,255,255,0.06)">Early, ongoing engagement with USCG, NCDOT, local authorities; leverage precedents.</td></tr>\n    <tr><td style="padding:12px 16px;border-bottom:1px solid rgba(255,255,255,0.06);font-weight:600">Weather &amp; Sea Conditions</td><td style="padding:12px 16px;border-bottom:1px solid rgba(255,255,255,0.06)">Wind, storms, and sea state affecting reliability.</td><td style="padding:12px 16px;border-bottom:1px solid rgba(255,255,255,0.06)">Conservative go/no-go rules, route design with options, clear passenger policies.</td></tr>\n    <tr><td style="padding:12px 16px;border-bottom:1px solid rgba(255,255,255,0.06);font-weight:600">Capital Cost &amp; Financing</td><td style="padding:12px 16px;border-bottom:1px solid rgba(255,255,255,0.06)">Higher CapEx vs. conventional diesel; availability of suitable capital.</td><td style="padding:12px 16px;border-bottom:1px solid rgba(255,255,255,0.06)">Blend private equity, infrastructure funds, grants, and mission-aligned capital.</td></tr>\n    <tr><td style="padding:12px 16px;border-bottom:1px solid rgba(255,255,255,0.06);font-weight:600">Demand Seasonality</td><td style="padding:12px 16px;border-bottom:1px solid rgba(255,255,255,0.06)">Seasonal peaks and troughs in ridership.</td><td style="padding:12px 16px;border-bottom:1px solid rgba(255,255,255,0.06)">Dynamic pricing, bundled tourism offers, charter and event services to smooth demand.</td></tr>\n    <tr><td style="padding:12px 16px;border-bottom:1px solid rgba(255,255,255,0.06);font-weight:600">Energy &amp; Grid Constraints</td><td style="padding:12px 16px;border-bottom:1px solid rgba(255,255,255,0.06)">Shore-power availability and grid capacity at terminals.</td><td style="padding:12px 16px;border-bottom:1px solid rgba(255,255,255,0.06)">Staged charging infrastructure, utility partnerships, hybrid options as bridge.</td></tr>\n    <tr><td style="padding:12px 16px;font-weight:600">Talent &amp; Operations</td><td style="padding:12px 16px">Recruiting and retaining qualified crew and technicians.</td><td style="padding:12px 16px">Competitive wages, training partnerships, integration with local maritime programs.</td></tr>\n  </tbody>\n</table>\n</div>	\N	2026-04-30 15:11:51.056612+00
3	services	Service Model	<h1>4. Service Model</h1>\n\n<h2>4.1 Proposed Core Routes (Illustrative)</h2>\n<p>Exact routes will be finalized through stakeholder and technical work, but initial focus is on:</p>\n<p><strong>Flagship Pamlico crossing route(s)</strong> (e.g. Inner Banks town ↔ Outer Banks / Hatteras / Ocracoke area) where:</p>\n<ul>\n  <li>Water distance offers a meaningful time advantage vs. road routes,</li>\n  <li>Terminals can support safe passenger handling and, over time, shore power.</li>\n</ul>\n<p><strong>Potential supporting routes:</strong></p>\n<ul>\n  <li>Shorter 12–24 pax feeder services connecting nearby towns, marinas, or attractions to the main hub(s).</li>\n  <li>Eco-tour loops emphasizing wildlife, ecology, and maritime culture.</li>\n  <li>Event services tied to regattas, festivals, and waterfront events.</li>\n</ul>\n\n<h2>4.2 Seasonal &amp; Operating Profile</h2>\n<ul>\n  <li><strong>Operating season:</strong> Initially 8–10 months (spring–fall), with potential for year-round service as demand and infrastructure mature.</li>\n  <li><strong>Frequency:</strong> 2–4 round trips per day on core routes, with additional frequencies on peak days or for events.</li>\n  <li><strong>Special services:</strong>\n    <ul>\n      <li>Festival and regatta specials,</li>\n      <li>Educational and research charters,</li>\n      <li>Private group charters within the same platform.</li>\n    </ul>\n  </li>\n</ul>\n\n<h2>4.3 Ticketing &amp; Pricing</h2>\n<ul>\n  <li><strong>Ticket range:</strong> Targeting a band equivalent to regional high-value excursions, with pricing tuned after route design (conceptually similar to $25–$45/pax for comparable distances).</li>\n  <li><strong>Dynamic pricing:</strong> Higher rates on peak days and times.</li>\n  <li><strong>Bundling:</strong> Integration with:\n    <ul>\n      <li>Lodging and marina partners,</li>\n      <li>Eco-tour and activity providers,</li>\n      <li>Regional tourism boards (Visit NC, local CVBs).</li>\n    </ul>\n  </li>\n  <li><strong>Distribution:</strong> Online booking, mobile and QR-code boarding, integration with tourism websites and packages.</li>\n</ul>\n\n<h2>4.4 Customer Experience</h2>\n<ul>\n  <li>Comfortable, climate-controlled cabins with good sightlines.</li>\n  <li>Quiet operation compared to diesel craft; emphasis on <em>"the trip is part of the experience."</em></li>\n  <li>Provision for bikes and small gear on some routes.</li>\n  <li>Accessibility considerations (ADA-aligned design where feasible).</li>\n</ul>\n\n<h2>4.5 Route Case Study: Vandemere – Ocracoke – Buxton</h2>\n<p>This Year 1 scenario models the inaugural Pamlico Sound route — a 20-passenger R&amp;D ferry fleet linking <strong>Vandemere</strong> (Inner Banks), <strong>Ocracoke (Silver Lake)</strong>, and <strong>Buxton</strong> (Cape Hatteras). The service is designed to prove out an electrified, environmentally conscious ferry model while providing reliable regional transportation, with a winter relocation strategy to a southern market improving year-round asset utilization.</p>\n\n<h3>Key Operating Assumptions</h3>\n<div style="overflow-x:auto;margin:1rem 0">\n<table style="width:100%;border-collapse:collapse;font-size:0.9em">\n  <thead>\n    <tr style="background:rgba(255,255,255,0.06)">\n      <th style="padding:10px 16px;text-align:left;border-bottom:1px solid rgba(255,255,255,0.1);font-weight:600">Parameter</th>\n      <th style="padding:10px 16px;text-align:center;border-bottom:1px solid rgba(255,255,255,0.1);font-weight:600">Summer</th>\n      <th style="padding:10px 16px;text-align:center;border-bottom:1px solid rgba(255,255,255,0.1);font-weight:600">Shoulder</th>\n      <th style="padding:10px 16px;text-align:center;border-bottom:1px solid rgba(255,255,255,0.1);font-weight:600">Off-Season (NC)</th>\n      <th style="padding:10px 16px;text-align:center;border-bottom:1px solid rgba(255,255,255,0.1);font-weight:600">Off-Season (South)</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr><td style="padding:10px 16px;border-bottom:1px solid rgba(255,255,255,0.06)">Season length</td><td style="padding:10px 16px;border-bottom:1px solid rgba(255,255,255,0.06);text-align:center">120 days</td><td style="padding:10px 16px;border-bottom:1px solid rgba(255,255,255,0.06);text-align:center">120 days</td><td style="padding:10px 16px;border-bottom:1px solid rgba(255,255,255,0.06);text-align:center">120 days</td><td style="padding:10px 16px;border-bottom:1px solid rgba(255,255,255,0.06);text-align:center">120 days</td></tr>\n    <tr><td style="padding:10px 16px;border-bottom:1px solid rgba(255,255,255,0.06)">Boats in service</td><td style="padding:10px 16px;border-bottom:1px solid rgba(255,255,255,0.06);text-align:center">4</td><td style="padding:10px 16px;border-bottom:1px solid rgba(255,255,255,0.06);text-align:center">3</td><td style="padding:10px 16px;border-bottom:1px solid rgba(255,255,255,0.06);text-align:center">2</td><td style="padding:10px 16px;border-bottom:1px solid rgba(255,255,255,0.06);text-align:center">4</td></tr>\n    <tr><td style="padding:10px 16px;border-bottom:1px solid rgba(255,255,255,0.06)">Trips per day (per boat)</td><td style="padding:10px 16px;border-bottom:1px solid rgba(255,255,255,0.06);text-align:center">8</td><td style="padding:10px 16px;border-bottom:1px solid rgba(255,255,255,0.06);text-align:center">6</td><td style="padding:10px 16px;border-bottom:1px solid rgba(255,255,255,0.06);text-align:center">4</td><td style="padding:10px 16px;border-bottom:1px solid rgba(255,255,255,0.06);text-align:center">8</td></tr>\n    <tr><td style="padding:10px 16px;border-bottom:1px solid rgba(255,255,255,0.06)">Capacity per boat</td><td style="padding:10px 16px;border-bottom:1px solid rgba(255,255,255,0.06);text-align:center">20 pax</td><td style="padding:10px 16px;border-bottom:1px solid rgba(255,255,255,0.06);text-align:center">20 pax</td><td style="padding:10px 16px;border-bottom:1px solid rgba(255,255,255,0.06);text-align:center">20 pax</td><td style="padding:10px 16px;border-bottom:1px solid rgba(255,255,255,0.06);text-align:center">20 pax</td></tr>\n    <tr><td style="padding:10px 16px;border-bottom:1px solid rgba(255,255,255,0.06)">Ticket price</td><td style="padding:10px 16px;border-bottom:1px solid rgba(255,255,255,0.06);text-align:center">$35</td><td style="padding:10px 16px;border-bottom:1px solid rgba(255,255,255,0.06);text-align:center">$35</td><td style="padding:10px 16px;border-bottom:1px solid rgba(255,255,255,0.06);text-align:center">$35</td><td style="padding:10px 16px;border-bottom:1px solid rgba(255,255,255,0.06);text-align:center">$35</td></tr>\n    <tr><td style="padding:10px 16px">Occupancy rate</td><td style="padding:10px 16px;text-align:center">90%</td><td style="padding:10px 16px;text-align:center">75%</td><td style="padding:10px 16px;text-align:center">75%</td><td style="padding:10px 16px;text-align:center">75%</td></tr>\n  </tbody>\n</table>\n</div>\n\n<h3>Year 1 Demand &amp; Revenue</h3>\n<ul>\n  <li><strong>Base NC model:</strong> ~110,000 seats sold</li>\n  <li><strong>With winter relocation:</strong> ~177,000–196,000 seats sold (weather/occupancy dependent)</li>\n  <li><strong>Total Year 1 ticket revenue: $6,284,964</strong></li>\n</ul>\n<p>No material revenue is assumed from advertising or concessions in Year 1; upside from those channels is incremental to the base case.</p>\n\n<h3>Variable Operating Costs (Per Trip, Per Boat)</h3>\n<div style="overflow-x:auto;margin:1rem 0">\n<table style="width:100%;border-collapse:collapse;font-size:0.9em">\n  <thead>\n    <tr style="background:rgba(255,255,255,0.06)">\n      <th style="padding:10px 16px;text-align:left;border-bottom:1px solid rgba(255,255,255,0.1);font-weight:600">Cost Item</th>\n      <th style="padding:10px 16px;text-align:right;border-bottom:1px solid rgba(255,255,255,0.1);font-weight:600">Cost per Trip</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr><td style="padding:10px 16px;border-bottom:1px solid rgba(255,255,255,0.06)">Captain</td><td style="padding:10px 16px;border-bottom:1px solid rgba(255,255,255,0.06);text-align:right">$300</td></tr>\n    <tr><td style="padding:10px 16px;border-bottom:1px solid rgba(255,255,255,0.06)">Crew</td><td style="padding:10px 16px;border-bottom:1px solid rgba(255,255,255,0.06);text-align:right">$160</td></tr>\n    <tr><td style="padding:10px 16px;border-bottom:1px solid rgba(255,255,255,0.06)">Fuel (generator)</td><td style="padding:10px 16px;border-bottom:1px solid rgba(255,255,255,0.06);text-align:right">$100</td></tr>\n    <tr><td style="padding:10px 16px;border-bottom:1px solid rgba(255,255,255,0.06)">Dockage fees</td><td style="padding:10px 16px;border-bottom:1px solid rgba(255,255,255,0.06);text-align:right">$150</td></tr>\n    <tr><td style="padding:10px 16px;border-bottom:1px solid rgba(255,255,255,0.06)">Electric</td><td style="padding:10px 16px;border-bottom:1px solid rgba(255,255,255,0.06);text-align:right">$50</td></tr>\n    <tr><td style="padding:10px 16px;border-bottom:1px solid rgba(255,255,255,0.06)">Water &amp; cleaning</td><td style="padding:10px 16px;border-bottom:1px solid rgba(255,255,255,0.06);text-align:right">$100</td></tr>\n    <tr style="background:rgba(255,255,255,0.04)"><td style="padding:10px 16px;font-weight:700">Total per trip</td><td style="padding:10px 16px;text-align:right;font-weight:700">$860</td></tr>\n  </tbody>\n</table>\n</div>\n\n<h3>Fixed &amp; Overhead Costs (Annual)</h3>\n<div style="overflow-x:auto;margin:1rem 0">\n<table style="width:100%;border-collapse:collapse;font-size:0.9em">\n  <thead>\n    <tr style="background:rgba(255,255,255,0.06)">\n      <th style="padding:10px 16px;text-align:left;border-bottom:1px solid rgba(255,255,255,0.1);font-weight:600">Item</th>\n      <th style="padding:10px 16px;text-align:right;border-bottom:1px solid rgba(255,255,255,0.1);font-weight:600">Annual Cost</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr><td style="padding:10px 16px;border-bottom:1px solid rgba(255,255,255,0.06)">Insurance</td><td style="padding:10px 16px;border-bottom:1px solid rgba(255,255,255,0.06);text-align:right">$40,000</td></tr>\n    <tr><td style="padding:10px 16px;border-bottom:1px solid rgba(255,255,255,0.06)">USCG COI inspections</td><td style="padding:10px 16px;border-bottom:1px solid rgba(255,255,255,0.06);text-align:right">$5,000</td></tr>\n    <tr><td style="padding:10px 16px;border-bottom:1px solid rgba(255,255,255,0.06)">Safety gear refresh</td><td style="padding:10px 16px;border-bottom:1px solid rgba(255,255,255,0.06);text-align:right">$5,000</td></tr>\n    <tr><td style="padding:10px 16px;border-bottom:1px solid rgba(255,255,255,0.06)">Dockage</td><td style="padding:10px 16px;border-bottom:1px solid rgba(255,255,255,0.06);text-align:right">$6,000</td></tr>\n    <tr><td style="padding:10px 16px;border-bottom:1px solid rgba(255,255,255,0.06)">Dockage electric &amp; water</td><td style="padding:10px 16px;border-bottom:1px solid rgba(255,255,255,0.06);text-align:right">$4,800</td></tr>\n    <tr><td style="padding:10px 16px;border-bottom:1px solid rgba(255,255,255,0.06)">Maintenance reserve</td><td style="padding:10px 16px;border-bottom:1px solid rgba(255,255,255,0.06);text-align:right">$200,000</td></tr>\n    <tr><td style="padding:10px 16px;border-bottom:1px solid rgba(255,255,255,0.06)">Professional services (legal, accounting, web)</td><td style="padding:10px 16px;border-bottom:1px solid rgba(255,255,255,0.06);text-align:right">$36,000</td></tr>\n    <tr><td style="padding:10px 16px;border-bottom:1px solid rgba(255,255,255,0.06)">Marketing, sales &amp; advertising</td><td style="padding:10px 16px;border-bottom:1px solid rgba(255,255,255,0.06);text-align:right">$60,000</td></tr>\n    <tr><td style="padding:10px 16px;border-bottom:1px solid rgba(255,255,255,0.06)">Office management</td><td style="padding:10px 16px;border-bottom:1px solid rgba(255,255,255,0.06);text-align:right">$60,000</td></tr>\n    <tr><td style="padding:10px 16px;border-bottom:1px solid rgba(255,255,255,0.06)">Operations manager</td><td style="padding:10px 16px;border-bottom:1px solid rgba(255,255,255,0.06);text-align:right">$84,000</td></tr>\n    <tr><td style="padding:10px 16px">Miscellaneous overhead</td><td style="padding:10px 16px;text-align:right">$60,000</td></tr>\n  </tbody>\n</table>\n</div>\n\n<h3>Year 1 Profitability Summary</h3>\n<div style="overflow-x:auto;margin:1rem 0">\n<table style="width:100%;border-collapse:collapse;font-size:0.95em">\n  <tbody>\n    <tr style="background:rgba(255,255,255,0.04)"><td style="padding:12px 16px;border-bottom:1px solid rgba(255,255,255,0.08)">Total ticket revenue</td><td style="padding:12px 16px;border-bottom:1px solid rgba(255,255,255,0.08);text-align:right">$6,284,964</td></tr>\n    <tr><td style="padding:12px 16px;border-bottom:1px solid rgba(255,255,255,0.08)">Total operating disbursements</td><td style="padding:12px 16px;border-bottom:1px solid rgba(255,255,255,0.08);text-align:right">($2,808,672)</td></tr>\n    <tr style="background:rgba(34,197,94,0.12)"><td style="padding:14px 16px;font-weight:700;font-size:1.05em">Year 1 Operating Profit (EBITDA)</td><td style="padding:14px 16px;text-align:right;font-weight:700;font-size:1.05em;color:#4ade80">$3,476,292</td></tr>\n  </tbody>\n</table>\n</div>\n<p><em>EBITDA-like figure; interest, taxes, and depreciation/amortization are not broken out separately in the Year 1 model.</em></p>\n\n<h3>Strategic Implications</h3>\n<ul>\n  <li>A small fleet of 20-passenger R&amp;D ferries can generate <strong>multi-million-dollar annual revenue</strong> with robust operating margins.</li>\n  <li><strong>Winter relocation</strong> to a southern market smooths seasonality, improves asset utilization, and significantly increases annual tickets sold and revenue — from ~110k to ~177k–196k seats.</li>\n  <li>Strong Year 1 cash flow provides capacity to:\n    <ul>\n      <li>Reinvest in additional vessels,</li>\n      <li>Upgrade charging and dock infrastructure, and</li>\n      <li>Expand marketing and partnership programs.</li>\n    </ul>\n  </li>\n</ul>	\N	2026-04-30 18:46:03.925+00
196	timeline	Implementation Timeline	<h1>11. Implementation Timeline</h1>\n<h2>Phase 1 — Months 0–3: Concept Validation &amp; Partner Alignment</h2>\n<ul><li>Refine route shortlist and preliminary operating profiles.</li><li>Engage with key stakeholders (NCDOT Ferry, local governments, Visit NC, utilities).</li><li>Initiate discussions with candidate vessel designers/manufacturers.</li><li>Map out priority grant and funding programs (federal, state, philanthropic).</li></ul>\n<h2>Phase 2 — Months 4–12: Design, Agreements, &amp; Early Infrastructure</h2>\n<ul><li>Preliminary vessel design work and indicative pricing with chosen partner(s).</li><li>Site selection and conceptual design for terminals and charging infrastructure.</li><li>Advance P3 framework with interested public partners.</li><li>Apply for relevant grants and infrastructure programs (e.g., MARAD ferry grants, state resilience funds).</li><li>Begin environmental and permitting processes where required.</li></ul>\n<h2>Phase 3 — Months 12–24+: Build, Equip, and Launch</h2>\n<ul><li>Final vessel design, contract, and build.</li><li>Terminal and infrastructure construction/upgrade, including shore power where feasible.</li><li>Develop and deploy ticketing, CRM, and operations systems.</li><li>Hire and train crew and operations staff.</li><li>Marketing launch, sea trials, and initial service launch on the first route.</li><li>Post-launch monitoring, data collection, and refinement of service patterns.</li></ul>	\N	2026-04-30 15:11:51.219988+00
6	conclusion	Potential Investors, Partners, and Funding Sources	<h1>12. Potential Investors, Partners, &amp; Funding Sources</h1>\n<h2>12.1 Private Equity / Growth Capital (NC &amp; Regional)</h2>\n<p>These firms are relevant for a scalable, infrastructure-adjacent service operator with strong regional roots:</p>\n<ul><li><strong>Pamlico Capital</strong> – Charlotte, NC</li><li><strong>Ridgemont Equity Partners</strong> – Charlotte, NC</li><li><strong>Barings Private Equity</strong> – Charlotte, NC</li><li><strong>Summit Park</strong> – Charlotte, NC</li><li><strong>Carousel Capital</strong> – Charlotte, NC</li><li><strong>Five Points Capital</strong> – Winston-Salem, NC</li><li><strong>Gaston Capital Partners</strong> – Belmont, NC</li><li><strong>Watchtower Capital</strong> – Charlotte, NC</li></ul>\n<p>These groups primarily target lower-middle market to mid-market platforms with clear revenue paths and room for regional expansion (e.g., additional routes, Chesapeake deployment).</p>\n<h2>12.2 Infrastructure-Aligned Investors</h2>\n<ul><li><strong>Imperial Capital / Northridge Infrastructure Solutions</strong> – infrastructure and essential-services focus, with NC presence.</li><li>Other infrastructure and energy transition funds interested in real-asset, decarbonizing transport projects.</li></ul>\n<h2>12.3 Public-Sector &amp; Quasi-Public Funding (Grants / Non-Equity)</h2>\n<p>These are not equity investors but are critical for P3 structures and de-risking CapEx:</p>\n<ul><li><strong>NCDOT Ferry Division</strong> – docks, terminals, integration, and potential cost-sharing.</li><li><strong>Visit NC / EDPNC</strong> – tourism promotion, co-marketing, potential grant pathways.</li><li><strong>Golden LEAF Foundation</strong> – rural economic development and infrastructure.</li><li><strong>NC Department of Commerce – Rural Infrastructure Authority</strong> – funding for community infrastructure.</li><li><strong>Appalachian Regional Commission (ARC)</strong> – where county eligibility applies.</li><li><strong>US DOT Maritime Administration (MARAD)</strong> – ferry grants, vessel financing, port infrastructure.</li><li>Federal resilience and decarbonization programs focused on ports and transportation (to be tracked as policy evolves).</li></ul>\n<h2>12.4 Regional Family Offices &amp; High-Net-Worth Investors</h2>\n<ul><li>Coastal NC family offices (New Bern, Morehead City, Wilmington) with interest in maritime, tourism, or real-asset projects.</li><li>Triangle and Charlotte-area family offices with portfolios in real estate, logistics, and hospitality.</li><li>Individuals interested in impact-oriented, place-based investments tying together tourism, clean energy, and community development.</li></ul>	\N	2026-04-30 15:11:51.444+00
5	financial-plan	Financial Plan	<h1>8. Financial Plan</h1>\n<p><em>Illustrative; order-of-magnitude figures, to be refined with detailed engineering and route studies. A detailed Year 1 operating scenario for the Vandemere – Ocracoke – Buxton route is included in the <strong>Service Model</strong> section.</em></p>\n\n<h2>8.1 Capital Expenditures (Per Flagship Vessel + Core Terminals)</h2>\n<ul>\n  <li><strong>Flagship electric/foil vessel:</strong> Order-of-magnitude in the mid-single-digit millions per boat, depending on spec and series size.</li>\n  <li><strong>Dock and terminal upgrades:</strong> Low- to mid-six figures per terminal, with higher costs if significant shore-power infrastructure is required.</li>\n  <li><strong>Ticketing and digital platforms:</strong> Relatively modest (tens to low hundreds of thousands).</li>\n  <li><strong>Working capital:</strong> To cover initial operations ramp, crew training, and marketing.</li>\n</ul>\n\n<h2>8.2 Operating Expenses (Annual – Flagship Level)</h2>\n<p>Line items conceptually include:</p>\n<ul>\n  <li>Crew wages and benefits.</li>\n  <li>Energy (electricity and/or hybrid fuel).</li>\n  <li>Insurance (hull, P&amp;I, liability).</li>\n  <li>Maintenance and parts.</li>\n  <li>Terminal fees and services.</li>\n  <li>Marketing, admin, and overhead.</li>\n</ul>\n<p>Electrical energy costs are expected to be more stable and potentially lower per passenger-mile than diesel, especially when combined with foiling efficiencies.</p>\n\n<h2>8.3 Revenue Projections (Conceptual)</h2>\n<p>Assumptions to be refined per route:</p>\n<ul>\n  <li>Flagship vessel in 40–50 pax range.</li>\n  <li>Target load factors building toward 50–60% average over the season.</li>\n  <li>Ticket pricing tuned to be competitive with other high-value coastal experiences.</li>\n  <li>8–10 month operating season with 2–4 daily round trips.</li>\n</ul>\n<p>The Vandemere – Ocracoke – Buxton Year 1 scenario (see Service Model) demonstrates that a 20-passenger R&amp;D fleet running $35/ticket can generate <strong>$6.28M in ticket revenue</strong> with <strong>$3.48M in operating profit (EBITDA)</strong>, validating the business model at the smaller fleet scale before flagship deployment.</p>\n\n<h2>8.4 Breakeven &amp; Upside</h2>\n<p>Commercial breakeven targeted within <strong>3–5 years after launch</strong>, depending on:</p>\n<ul>\n  <li>Final CapEx and financing structure,</li>\n  <li>Route mix and realized load factors,</li>\n  <li>Success in obtaining infrastructure grants and mission-aligned funding.</li>\n</ul>\n<p><strong>Upside opportunities:</strong></p>\n<ul>\n  <li>Additional Pamlico routes,</li>\n  <li>Charter and eco-tour services,</li>\n  <li>Sister deployments on Chesapeake Bay and other East Coast corridors using the same platform.</li>\n</ul>	\N	2026-04-30 18:46:22.668+00
301	grants	Grant Opportunities	<h2>Grant Opportunities</h2>\n<p>PamliEcoConnect is positioned to pursue significant federal and state grant funding across clean maritime technology, shipbuilding, workforce development, and port electrification. This section covers our readiness checklist, prioritized action plan, and a curated list of currently active and upcoming funding programs.</p>\n<p class="text-xs text-muted-foreground mt-1">Prepared by Jay Phillips / Phillips Boat Works — April 27, 2026</p>\n\n<hr class="my-8 border-border"/>\n\n<h2>Part 1 — Grant Readiness &amp; Action Plan</h2>\n\n<h3>1. Readiness Checklist</h3>\n\n<h4>Category 1: Registrations &amp; Identifiers</h4>\n<ul>\n  <li><strong>SAM.gov &amp; UEI:</strong> An active SAM registration and Unique Entity Identifier (UEI) is required to receive any federal funds. Requires sharing business bank account information. <em>Note: SAM.gov is currently experiencing significant processing backlogs — begin immediately.</em></li>\n  <li><strong>Research.gov &amp; SBIR Company Registry:</strong> Required specifically for NSF SBIR/STTR proposals.</li>\n  <li><strong>ARPA-E eXCHANGE:</strong> Required to apply for DOE maritime battery and electrification grants such as PROPEL-1K.</li>\n</ul>\n\n<h4>Category 2: Compliance &amp; Documentation</h4>\n<ul>\n  <li><strong>Foreign Risk &amp; Security Screening:</strong> Documented, transparent records of ownership structure, capital sources, key personnel affiliations, and cybersecurity safeguards are required to pass mandatory SBIR/STTR due diligence reviews.</li>\n  <li><strong>DCAA/FAR Compliant Accounting:</strong> Phase II awards (up to $2M) require pre-award accounting surveys verifying financial systems meet Federal Acquisition Regulation (FAR) and Defense Contract Audit Agency (DCAA) standards.</li>\n  <li><strong>Core Proposal Boilerplate:</strong> Prepare standard documents including budget justifications, organizational capability statements, and key personnel CVs.</li>\n  <li><strong>Benefit-Cost Analyses:</strong> Many maritime infrastructure grants require a formal benefit-cost analysis comparing no-build versus build scenarios over a 25–50 year lifecycle.</li>\n</ul>\n\n<h4>Category 3: Partnerships</h4>\n<ul>\n  <li><strong>U.S. Shipyards:</strong> Participation by at least one U.S. shipyard is a strict requirement for all National Shipbuilding Research Program (NSRP) projects.</li>\n  <li><strong>Universities &amp; Research Institutions:</strong> Required for STTR grants (minimum 30% of work by the institution), and strongly encouraged for NSF SBIR and workforce development (ATE) programs.</li>\n  <li><strong>Local Stakeholders:</strong> Official letters of support from federal, state, and local policymakers or port authorities are required to secure infrastructure and transit grants.</li>\n</ul>\n\n<h4>Category 4: Technical &amp; Commercial Materials</h4>\n<ul>\n  <li><strong>Project Pitches / White Papers:</strong> Required to assess technical fit before being invited to submit full proposals for NSF and NSRP programs.</li>\n  <li><strong>Commercialization Plan:</strong> Reviewers look for early market validation signals including customer discovery, acquisition pathways, and IP strategy (provisional patents, freedom-to-operate analyses).</li>\n  <li><strong>Technology Readiness Level (TRL) Roadmaps:</strong> Must identify starting TRL and map a path to TRL 9 in a shipbuilding or operational environment.</li>\n</ul>\n\n<h4>Category 5: Financials &amp; Match</h4>\n<ul>\n  <li><strong>Accessible Cost-Share:</strong> Most discretionary federal grants (FTA ferry grants, Port Infrastructure Development Program) require a 20% local match documented as "ready and accessible."</li>\n  <li><strong>Strategic Match Capital:</strong> Strategic Breakthrough Phase II awards require 100% matching from private capital, commercial revenue, or non-SBIR defense contracts.</li>\n  <li><strong>Cost-Share Waivers:</strong> As a small business, PamliEcoConnect can claim waivers for the standard 50% cost-share requirement on NSRP Research Announcement projects.</li>\n</ul>\n\n<h4>Category 6: Repeated Evaluation Themes</h4>\n<ul>\n  <li><strong>Innovation &amp; Commercial Potential:</strong> Projects must prove scientific/technical merit and clear commercial viability.</li>\n  <li><strong>Emissions &amp; Climate Benefits:</strong> Strong emphasis on reducing greenhouse gases, port electrification, and zero-emission technology deployment.</li>\n  <li><strong>Workforce Development:</strong> Priority given to projects that train the next generation of maritime workers, support apprenticeships, and partner with educational institutions.</li>\n</ul>\n\n<hr class="my-8 border-border"/>\n\n<h3>2. Prioritized Actions</h3>\n\n<h4>Do These First — Next 30–60 Days</h4>\n<ol>\n  <li><strong>Register for SAM.gov</strong> to initiate UEI assignment immediately due to current processing backlogs.</li>\n  <li><strong>Register for Research.gov and the SBA SBIR Company Registry</strong> to be legally ready to submit NSF proposals.</li>\n  <li><strong>Register for ARPA-E eXCHANGE</strong> to access and review the active PROPEL-1K FOA for maritime battery systems.</li>\n  <li><strong>Draft a 2-page Project Pitch</strong> for the NSF SBIR program (targeting the "Mobility" topic) and submit to receive an official invitation for a full proposal.</li>\n  <li><strong>Audit ownership structure</strong> and foreign investment connections to prepare compliance documentation for mandatory SBIR security due diligence rules.</li>\n  <li><strong>Identify a U.S. Shipyard partner</strong> and request a letter of commitment to satisfy the mandatory eligibility requirement for upcoming NSRP solicitations.</li>\n</ol>\n\n<h4>6–12 Month Roadmap</h4>\n<ul>\n  <li><strong>Months 3–4 (Partnerships &amp; Concept Refinement):</strong> Deepen relationships with university partners (NC State, UNC) to open STTR grant pathways and collaborate on engineering and battery challenges. Begin drafting NSRP White Papers ahead of spring/summer solicitation cycles.</li>\n  <li><strong>Months 5–6 (Boilerplate &amp; Advocacy):</strong> Prepare boilerplate sections for technical narratives, commercialization plans, and budget justifications. Request letters of support from NC stakeholders (EDPNC, local economic development boards) to demonstrate community backing.</li>\n  <li><strong>Months 7–9 (Financial Match Readiness):</strong> Line up and document non-federal cost-share sources. Ensure these funds are formally marked as "ready and accessible" for transit and manufacturing grant applications.</li>\n  <li><strong>Months 10–12 (Phase II Readiness):</strong> Begin upgrading internal financial and accounting systems to meet DCAA and FAR standards — a critical hurdle to clear for Phase II funding (up to $2M) and future Strategic Breakthrough awards.</li>\n</ul>\n\n<hr class="my-8 border-border"/>\n\n<h3>3. Gaps Requiring External Research</h3>\n<ul>\n  <li><strong>Exact NOFO Dates:</strong> Several major grants (MARAD Small Shipyard, EPA Clean Ports, FTA Electric Ferry Pilot) are listed as "Annual" but exact 2026 Notice of Funding Opportunity release dates and deadlines require verification.</li>\n  <li><strong>NC State-Level Vendor Registrations:</strong> State support via NC Commerce and EDPNC is available, but specific state-level procurement portals and vendor registration steps needed for state matching funds or local contracts require confirmation.</li>\n  <li><strong>Maritime Prosperity Zone Boundaries:</strong> Up to 100 Maritime Prosperity Zones (MPZs) were to be defined by July 8, 2025. The final map and geographic boundaries for North Carolina — and specifically whether Pamlico County qualifies — must be confirmed with the Department of Commerce.</li>\n</ul>\n\n<hr class="my-8 border-border"/>\n\n<h2>Part 2 — Current &amp; Active Grant Programs</h2>\n<p>Programs currently open or clearly active/recurring that align with PamliEcoConnect's profile in electric foiling ferries and maritime deep-tech.</p>\n\n<div class="overflow-x-auto mt-6">\n<table class="w-full text-sm border-collapse">\n  <thead>\n    <tr class="border-b border-border">\n      <th class="text-left py-3 pr-4 font-semibold text-foreground">Program</th>\n      <th class="text-left py-3 pr-4 font-semibold text-foreground">Agency</th>\n      <th class="text-left py-3 pr-4 font-semibold text-foreground">Award Size</th>\n      <th class="text-left py-3 pr-4 font-semibold text-foreground">Match</th>\n      <th class="text-left py-3 font-semibold text-foreground">Status / Window</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr class="border-b border-border/50">\n      <td class="py-3 pr-4 font-medium text-foreground">PROPEL-1K<br/><span class="font-normal text-muted-foreground text-xs">Pioneering Railroad, Oceanic, and Plane Electrification</span></td>\n      <td class="py-3 pr-4 text-muted-foreground">DOE / ARPA-E</td>\n      <td class="py-3 pr-4 text-muted-foreground">~15 awards expected</td>\n      <td class="py-3 pr-4 text-muted-foreground">None required</td>\n      <td class="py-3 text-muted-foreground">Active (DE-FOA-0003163)</td>\n    </tr>\n    <tr class="border-b border-border/50">\n      <td class="py-3 pr-4 font-medium text-foreground">NSF SBIR Phase I<br/><span class="font-normal text-muted-foreground text-xs">Mobility Topic — America's Seed Fund</span></td>\n      <td class="py-3 pr-4 text-muted-foreground">NSF</td>\n      <td class="py-3 pr-4 text-muted-foreground">Up to $275K–$305K</td>\n      <td class="py-3 pr-4 text-muted-foreground">0% (no equity)</td>\n      <td class="py-3 text-muted-foreground">Rolling (closes Feb 28, May 31, Aug 31, Nov 30)</td>\n    </tr>\n    <tr class="border-b border-border/50">\n      <td class="py-3 pr-4 font-medium text-foreground">NSRP Research Announcement<br/><span class="font-normal text-muted-foreground text-xs">National Shipbuilding Research Program</span></td>\n      <td class="py-3 pr-4 text-muted-foreground">NSRP / U.S. Navy</td>\n      <td class="py-3 pr-4 text-muted-foreground">Varies (multi-million total pool)</td>\n      <td class="py-3 pr-4 text-muted-foreground">50% — waived for small biz</td>\n      <td class="py-3 text-muted-foreground">Annual (spring/summer cycle)</td>\n    </tr>\n    <tr class="border-b border-border/50">\n      <td class="py-3 pr-4 font-medium text-foreground">Assistance to Small Shipyards<br/><span class="font-normal text-muted-foreground text-xs">MARAD Small Shipyard Grant Program</span></td>\n      <td class="py-3 pr-4 text-muted-foreground">MARAD / DOT</td>\n      <td class="py-3 pr-4 text-muted-foreground">$105M total FY27, ~20 awards</td>\n      <td class="py-3 pr-4 text-muted-foreground">&gt;25% preferred</td>\n      <td class="py-3 text-muted-foreground">Annual (exact 2026 dates TBD)</td>\n    </tr>\n    <tr class="border-b border-border/50">\n      <td class="py-3 pr-4 font-medium text-foreground">Title XI — Federal Ship Financing<br/><span class="font-normal text-muted-foreground text-xs">Federal Ship Financing Program</span></td>\n      <td class="py-3 pr-4 text-muted-foreground">MARAD / DOT</td>\n      <td class="py-3 pr-4 text-muted-foreground">$1.8B loan approval capacity</td>\n      <td class="py-3 pr-4 text-muted-foreground">N/A (loan guarantee)</td>\n      <td class="py-3 text-muted-foreground">Rolling / recurring</td>\n    </tr>\n    <tr class="border-b border-border/50">\n      <td class="py-3 pr-4 font-medium text-foreground">Electric or Low-Emitting Ferry Pilot<br/><span class="font-normal text-muted-foreground text-xs">FTA Electric Ferry Pilot Program</span></td>\n      <td class="py-3 pr-4 text-muted-foreground">FTA</td>\n      <td class="py-3 pr-4 text-muted-foreground">$50M available per year</td>\n      <td class="py-3 pr-4 text-muted-foreground">20% match</td>\n      <td class="py-3 text-muted-foreground">Annual (exact 2026 dates TBD)</td>\n    </tr>\n    <tr>\n      <td class="py-3 pr-4 font-medium text-foreground">DoD SBIR / STTR<br/><span class="font-normal text-muted-foreground text-xs">Department of Defense across all components</span></td>\n      <td class="py-3 pr-4 text-muted-foreground">DoD (Navy, DARPA, etc.)</td>\n      <td class="py-3 pr-4 text-muted-foreground">Standard Phase I/II amounts</td>\n      <td class="py-3 pr-4 text-muted-foreground">0% match</td>\n      <td class="py-3 text-muted-foreground">Multiple per year (Feb, Apr, May closings)</td>\n    </tr>\n  </tbody>\n</table>\n</div>\n\n<hr class="my-8 border-border"/>\n\n<h2>Part 3 — Future &amp; Upcoming Programs (6–18 Months)</h2>\n<p>Recurring or likely opportunities not necessarily open today, targeted for the next 6–18 months of our pipeline.</p>\n\n<div class="overflow-x-auto mt-6">\n<table class="w-full text-sm border-collapse">\n  <thead>\n    <tr class="border-b border-border">\n      <th class="text-left py-3 pr-4 font-semibold text-foreground">Program</th>\n      <th class="text-left py-3 pr-4 font-semibold text-foreground">Agency</th>\n      <th class="text-left py-3 pr-4 font-semibold text-foreground">Typical Award</th>\n      <th class="text-left py-3 pr-4 font-semibold text-foreground">Match</th>\n      <th class="text-left py-3 font-semibold text-foreground">Timing</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr class="border-b border-border/50">\n      <td class="py-3 pr-4 font-medium text-foreground">DOT SBIR Phase I<br/><span class="font-normal text-muted-foreground text-xs">Transportation R&amp;D — Mobility</span></td>\n      <td class="py-3 pr-4 text-muted-foreground">DOT</td>\n      <td class="py-3 pr-4 text-muted-foreground">Standard Phase I (0% equity)</td>\n      <td class="py-3 pr-4 text-muted-foreground">0%</td>\n      <td class="py-3 text-muted-foreground">Annual Q1 (historically closes early March)</td>\n    </tr>\n    <tr class="border-b border-border/50">\n      <td class="py-3 pr-4 font-medium text-foreground">Strategic Breakthrough Phase II<br/><span class="font-normal text-muted-foreground text-xs">Deep Tech Scaling — Bridge Valley of Death</span></td>\n      <td class="py-3 pr-4 text-muted-foreground">DoD / NSF</td>\n      <td class="py-3 pr-4 text-muted-foreground">Up to $30M over 4 years</td>\n      <td class="py-3 pr-4 text-muted-foreground">100% private match required</td>\n      <td class="py-3 text-muted-foreground">First solicitations expected Q4 2026</td>\n    </tr>\n    <tr class="border-b border-border/50">\n      <td class="py-3 pr-4 font-medium text-foreground">NSF Advanced Technological Education (ATE)<br/><span class="font-normal text-muted-foreground text-xs">STEM Workforce Development</span></td>\n      <td class="py-3 pr-4 text-muted-foreground">NSF</td>\n      <td class="py-3 pr-4 text-muted-foreground">Pool of $69M–$74M annually</td>\n      <td class="py-3 pr-4 text-muted-foreground">Varies</td>\n      <td class="py-3 text-muted-foreground">Annual — <strong>Next deadline: October 1, 2026</strong></td>\n    </tr>\n    <tr class="border-b border-border/50">\n      <td class="py-3 pr-4 font-medium text-foreground">EPA Clean Ports Program<br/><span class="font-normal text-muted-foreground text-xs">Port Electrification &amp; Zero-Emission Tech</span></td>\n      <td class="py-3 pr-4 text-muted-foreground">EPA</td>\n      <td class="py-3 pr-4 text-muted-foreground">$3B allocated FY24</td>\n      <td class="py-3 pr-4 text-muted-foreground">10–20% match</td>\n      <td class="py-3 text-muted-foreground">Annual (exact 2026 dates TBD)</td>\n    </tr>\n    <tr class="border-b border-border/50">\n      <td class="py-3 pr-4 font-medium text-foreground">NSF STTR — Technology Transfer<br/><span class="font-normal text-muted-foreground text-xs">Collaborative R&amp;D with University Partners</span></td>\n      <td class="py-3 pr-4 text-muted-foreground">NSF</td>\n      <td class="py-3 pr-4 text-muted-foreground">$275K Phase I / $2M Phase II</td>\n      <td class="py-3 pr-4 text-muted-foreground">0% equity</td>\n      <td class="py-3 text-muted-foreground">Rolling windows — next opens July 15, 2026</td>\n    </tr>\n    <tr>\n      <td class="py-3 pr-4 font-medium text-foreground">DoD SBIR/STTR — Defense Maritime<br/><span class="font-normal text-muted-foreground text-xs">Dual-use composites, guidance, propulsion</span></td>\n      <td class="py-3 pr-4 text-muted-foreground">DoD (Navy, DARPA)</td>\n      <td class="py-3 pr-4 text-muted-foreground">Standard Phase I/II</td>\n      <td class="py-3 pr-4 text-muted-foreground">0%</td>\n      <td class="py-3 text-muted-foreground">Multiple releases per year — monitor closely</td>\n    </tr>\n  </tbody>\n</table>\n</div>	{"section": "investor"}	2026-04-30 21:54:06.746796+00
\.


--
-- Data for Name: investor_applications; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.investor_applications (id, user_id, status, nda_accepted_at, notes, created_at, updated_at) FROM stdin;
1	10	pending	\N	\N	2026-04-30 11:08:35.289293+00	2026-04-30 11:08:35.289293+00
2	23	approved	2026-04-30 13:27:23.147+00	\N	2026-04-30 13:27:14.765226+00	2026-04-30 13:28:58.48+00
\.


--
-- Data for Name: posts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.posts (id, title, excerpt, content, type, media_url, featured, published_at, created_at) FROM stdin;
10	Lessons from the Albemarle Sound: How Phillips Boatworks Avoids the Harbor Towns Mistakes	A management analysis of the $15M Harbor Towns ferry project failure—covering infrastructure gaps, governance breakdowns, and mission drift—and the strategic safeguards Phillips Boatworks has built to prevent repeating those errors.	<h3>Overview of the Albemarle Sound Project</h3>\n  <p>The Harbor Towns Project was originally conceptualized as an ambitious economic development initiative to create a regional water ferry transportation system linking Inner Banks towns along the Albemarle Sound, including Elizabeth City, Edenton, Hertford, Plymouth, Columbia, and Kitty Hawk. The project received approximately $15 million in state appropriations to stimulate tourism and build waterfront infrastructure.</p>\n  <p>The non-profit managing the project, Harbor Towns Inc., purchased a paddlewheel dinner boat (the Albemarle Queen) and two high-speed passenger ferries. While the Albemarle Queen saw some success hosting local events and private cruises, the fast ferries intended to create the actual regional transit network failed to launch regular service. The high-speed ferries encountered severe mechanical and manufacturing problems, proved too expensive to operate, and were eventually put up for sale. Consequently, the project devolved into a scramble to reallocate remaining grant funds to unrelated local waterfront projects before state spending deadlines expired.</p>\n\n  <h3>Core Causes of Failure</h3>\n  <p>The failure of the Harbor Towns ferry system can be traced to several critical operational and managerial missteps:</p>\n  <p><strong>Complete Lack of Infrastructure Due Diligence:</strong> Project leaders purchased high-speed ferries without evaluating whether local infrastructure could support them. The vessels weighed 16.5 tons and burned 40 gallons of fuel per hour, but the region possessed no fueling infrastructure, no boat lift capable of holding them, and no master mechanic qualified to service them.</p>\n  <p><strong>Poor Procurement and Blind Assumptions:</strong> The ferries were built in western North Carolina by a manufacturer that lacked the expertise required for such specialized vessels. The project's treasurer admitted that leadership operated on the flawed assumption that brand-new boats would simply be reliable after a month of testing, bypassing rigorous operational readiness protocols.</p>\n  <p><strong>Governance and Accountability Issues:</strong> A $15 million public grant was managed by a non-profit with only four paid staff members. The organization faced intense public scrutiny and accusations of wasting taxpayer money after IRS filings revealed that board officers were paid over $200,000 across two years while reporting only one hour of work per week.</p>\n  <p><strong>Mission Drift and Distractions:</strong> When the original ferry network failed to materialize, leadership pivoted to spending the grant money on unrelated projects—bathroom reconstructions, historic house repairs, and lighting—simply to avoid returning the funds to the state. Additionally, town governments became bogged down in a contentious, years-long lawsuit over the relocation of a Confederate monument, which monopolized municipal focus and complicated waterfront development plans.</p>\n\n  <h3>Strategic Safeguards for Phillips Boatworks</h3>\n  <p>To assure prospective investors and public funding sources that Phillips Boatworks will not repeat these mistakes, our management team has built strategy around the following safeguards:</p>\n  <p><strong>Mandate Comprehensive Feasibility &amp; Infrastructure Studies:</strong> We will never acquire major capital assets without first conducting a rigorous, third-party assessment of supporting infrastructure—guaranteeing that maintenance, fueling, and specialized labor are available before any purchase is made.</p>\n  <p><strong>Implement Strict Procurement and Testing Standards:</strong> We thoroughly vet vendors for specific, proven expertise in the assets they manufacture and require extensive stress-testing, refusing to rely on assumptions of reliability.</p>\n  <p><strong>Establish Transparent Governance and Financial Controls:</strong> Our oversight structure includes an independent board with clear performance metrics, capped and fully transparent executive compensation, and regular public reporting—preventing the financial mismanagement that destroyed public trust in the Harbor Towns project.</p>\n  <p><strong>Commit to Scope Discipline:</strong> Funding is strictly ring-fenced for the original project scope. If the primary mission encounters roadblocks, we maintain a structured contingency plan rather than pivoting to unrelated spending to meet budget deadlines.</p>\n  <p><strong>Isolate Core Operations from Local Political Distractions:</strong> Our project management structure is insulated from unrelated local disputes through a dedicated, independent management team—ensuring that local political controversies cannot paralyze our operational timeline.</p>\n\n  <h3>Bibliographic Sources</h3>\n  <ol>\n  <li>Litwin, Kevin. "Elizabeth City, NC Puts Together a Diverse Economy." <em>Livability.com</em>, March 30, 2018.</li>\n  <li>Bradshaw, Katie, et al. "Water Transportation in the Albemarle Sound: Harbor Town Project." Presented to Professor Nicholas Didow, Kenan-Flagler Business School, University of North Carolina, March 26, 2018.</li>\n  <li>mtnmamaadventures. "Harbor Towns defends ferry pilot program as Edenton council OKs projects." <em>Albemarle Observer</em>, February 11, 2026.</li>\n  <li>Bowman-Layton, Nicole. "Harbor Towns races deadline to allocate grant funds; wants to redirect money to Barker House." <em>Albemarle Observer</em>, February 9, 2026.</li>\n  <li>"Hertford council adopts speed-limit ordinance, OKs $20,000 move for theatre study and hears Harbor Towns update." <em>Citizen Portal</em>, February 28, 2026.</li>\n  <li>Campbell, Colin. "Inner Banks tourism project kicks off with cruises, but new ferry service hits snags." <em>WUNC News</em>, October 1, 2025.</li>\n  <li>Layton, Miles. "Our View: The Lost Ferry Dream: Taxpayer Money Wasted." <em>Albemarle Observer</em>, February 16, 2026.</li>\n  <li>Perquimans County Board of Commissioners Meeting Minutes, February 7, 2022. Perquimans County.</li>\n  <li>Sussman, Jacob H. (Southern Coalition for Social Justice). <em>Verified Complaint and Motion for Preliminary Injunction: Rev. Dr. John Shannon, et al. vs. Town of Edenton, et al.</em> State of North Carolina, Chowan County Superior Court Division, January 3, 2025.</li>\n  </ol>	press_release	\N	f	2026-05-02 14:27:01.967749+00	2026-05-02 14:27:01.967749+00
32	Vandemere Community Roundtable Explores Pamlico Sound Passenger Service with PamliEcoConnect	Vandemere Mayor Sandra Snipes and Pamlico Economic Development Director Beth Bucksot hosted the Annual Vandemere Community Roundtable on March 28, 2026 — inviting PamliEcoConnect to present a vision for electric passenger service connecting the Triangle to Ocracoke via the Pamlico Sound.	<p>On March 28, 2026, Vandemere Mayor <strong>Sandra Snipes</strong> and Pamlico County Economic Development Director <strong>Beth Bucksot</strong> hosted the Annual Vandemere Community Roundtable. PamliEcoConnect was invited by Director Bucksot following Vandemere's extensive feasibility study for a passenger route between Vandemere and Ocracoke.</p>\n\n<p>PamliEcoConnect CEO <strong>Jay Phillips</strong> and CFO <strong>John Elion</strong> attended the roundtable and presented the company's electric foiling vessel technology as a clean, quiet, and high-speed solution for the proposed crossing. Vandemere sits at an exceptional geographic position — a nearly ideal embarkation point for Triangle-area residents (a population of nearly 2 million) seeking weekend and week-long beach trips to the Outer Banks and Ocracoke Island via the Pamlico Sound.</p>\n\n<p>The presentation was well received by community members and local officials. PamliEcoConnect expects to continue working with Vandemere stakeholders as planning for a Blue Economy passenger corridor develops.</p>\n\n<h3>Presentations from the Roundtable</h3>\n<ul>\n  <li>\n    <strong>Audio Podcast Presentation</strong><br/>\n    <a href="https://drive.google.com/file/d/1dFmFx8udtVcVUU1f2mQWhWPIXxGOFvxH/viewlink" target="_blank" rel="noopener noreferrer">\n      Listen to the Vandemere–Ocracoke Blue Economy Corridor podcast presentation\n    </a>\n  </li>\n  <li>\n    <strong>Video Presentation</strong><br/>\n    <a href="https://app.heygen.com/videos/vandemere-ocracoke-buxton-a-blue-economy-corridor-21d3f5510b624dc0bbfc47789cd9cca0" target="_blank" rel="noopener noreferrer">\n      Watch the Vandemere–Ocracoke–Buxton: A Blue Economy Corridor video presentation\n    </a>\n  </li>\n</ul>	press_release	\N	t	2026-03-28 12:00:00+00	2026-05-08 14:22:44.443193+00
\.


--
-- Data for Name: sh_availability; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sh_availability (id, trip_id, date, available_slots, is_blocked, created_at) FROM stdin;
\.


--
-- Data for Name: sh_bookings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sh_bookings (id, trip_id, customer_name, customer_email, customer_phone, booking_date, passengers, total_cents, status, special_requests, stripe_session_id, stripe_payment_intent_id, created_at, updated_at, vessel_id, vessel_name, vacation_start, vacation_end) FROM stdin;
\.


--
-- Data for Name: sh_contacts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sh_contacts (id, name, email, phone, message, trip_interest, created_at) FROM stdin;
\.


--
-- Data for Name: sh_trip_vessels; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sh_trip_vessels (id, trip_id, vessel_id, price_override_cents, active) FROM stdin;
9	7	1	\N	t
35	7	5	\N	t
1	2	1	\N	t
2	3	1	\N	t
3	5	1	\N	t
4	6	1	\N	t
7	1	1	\N	t
8	4	1	\N	t
13	3	2	\N	t
14	5	2	\N	t
15	6	2	\N	t
16	1	2	\N	t
18	3	3	\N	t
19	5	3	\N	t
20	6	3	\N	t
22	4	3	\N	t
24	3	4	\N	t
25	5	4	\N	t
26	6	4	\N	t
27	1	4	\N	t
28	2	5	\N	t
29	3	5	\N	t
30	5	5	\N	t
31	6	5	\N	t
34	1	5	\N	t
38	8	6	\N	t
39	8	7	\N	t
40	8	8	\N	t
41	8	9	\N	t
21	1	3	59500	t
42	10	10	\N	t
43	10	11	\N	t
44	11	12	\N	t
12	2	2	89500	t
17	2	3	89500	t
23	2	4	49500	t
45	9	13	\N	t
46	9	14	\N	t
\.


--
-- Data for Name: sh_trips; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sh_trips (id, slug, name, category, type, short_description, description, duration, price_min, price_display, pricing_note, max_passengers, boat, highlights, image_url, active, sort_order, stripe_price_id, created_at, updated_at, pricing_model, coming_soon) FROM stdin;
1	sunset-sail	Sunset Sail	experiences	charter	Sunsets over the Pamlico are magic on Hatteras Island. This is our most popular cruise — book as soon as you have your rental house dates. A portion of every charter directly funds free youth sailing programs on Hatteras Island.	Sunsets over Pamlico Sound are among the most photographed moments on the Outer Banks — and you're going to watch one from the deck of a catamaran.\n\nHatteras Community Sailing's Sunset Sail is our most popular community charter. We depart from Buxton Harbor as the light begins to soften, sailing west across the Sound while Hatteras Island glows behind you. Activities include sailing, photography, relaxing, and complimentary drinks as the sky does its thing.\n\nDuration: 2 hours. Runs nightly, weather permitting. If conditions are not favorable on your reserved evening, we will work to find another time during your stay — or refund your deposit if we cannot make it happen.\n\n**What's Included**\n- **Licensed USCG captain** — experienced, local, and knows the Sound\n- **Junior sailor mate** — crew support aboard (works for tips, always appreciated)\n- **Cooler with ice** — bring your own drinks and snacks\n- **Porta-pot or marine head** — vessel equipped for comfort\n- **Bluetooth speaker** — your playlist, your sail\n- **Chloe** — Capt. Jay's golden retriever; first come, first served\n\nAs with all Hatteras Community Sailing programs, your charter fee directly supports free and reduced-cost youth sailing for Hatteras Island kids.	2.5 hours	39500	$395–$595	Community program fee: $395. Fees support our 501(c)3 mission. Up to 6 participants. Private group program.	6	Stiletto 27 Catamaran	["Licensed USCG captain aboard", "Junior sailor mate (works for tips)", "Cooler stocked with ice", "Porta-pot or marine head aboard", "Bluetooth music", "Chloe the golden retriever (with Capt. Jay, first come first served)", "Pamlico Sound sunset cruise", "Complimentary drinks", "Private charter — just your group", "Photography-worthy light every evening", "2-hour sail, weather permitting"]	/trip-photos/sunset-sail.jpg	t	10	\N	2026-05-07 15:37:29.275303+00	2026-05-07 15:37:29.275303+00	flat	f
8	kids-development-program	Local Youth Development Program	learn	lesson	Introduction camps are just the first step. Our year-round development program is for youth who love the water and want to keep growing — session by session, season by season.	The Local Youth Development Program is Hatteras Community Sailing's core youth pathway — structured around Optimist and Collegiate 420 sailing, with 12 classes per session, scheduled weather-dependently to get the best possible time on the water.\n\n  **Sailing Littles — Ages 6 to 9**\n  Introduction to sailing on Optimist dinghies. Young sailors learn the fundamentals: how a sailboat works, points of sail, basic boat handling, and water confidence. The focus is fun first — getting kids comfortable and in love with being on the water before technique takes over.\n\n  **Opti Green Fleet Competition — Ages 9 to 13**\n  Sailors who've outgrown the intro level move into structured Optimist racing. Green Fleet introduces race starts, mark rounding, tactics, and the competitive side of the sport. These are the kids who come back every year.\n\n  **Collegiate 420 Sailing — Ages 12 to 18**\n  The step up to a two-person high-performance dinghy. C420 sailing introduces teamwork, crew communication, upwind and downwind technique, and the kind of boat speed that only comes from repetition. Many of our 420 sailors go on to sail in college.\n\n  **SAISA High School Interscholastic Sailing — Grades 8 to 12**\n  Spring and fall competitive seasons with the Southern Atlantic Interscholastic Sailing Association. Student-athletes represent Hatteras Community Sailing in regional competition against high school programs across the Carolinas and beyond.\n\n  ---\n  Sessions run 12 classes, scheduled weather-dependently. Scholarships and fully subsidized spots available for local youth — no child is turned away for inability to pay. Program fees from paying participants directly fund free placements.	Per session (half day)	20000	$95–$695 / ~8 weeks	Community program fee: $200/session. Full and partial scholarships available for Hatteras community youth. Contact us. Minimum 4 participants per session.	8	Optimist fleet / Collegiate 420s	["Training boats supplied by Hatteras Community Sailing", "Certified coaching and instruction", "Coach and safety boats on the water", "On-water course marks", "Certificate of completion", "Interactive sailing log (online)", "Life vest provided", "Course materials", "2 regattas per session recommended"]	/trip-photos/kids-development-program.jpg	t	40	\N	2026-05-07 15:37:40.968044+00	2026-05-07 15:37:40.968044+00	per_person	f
9	visitor-intensive	Cape Explorers Camp	learn	lesson	Don't let your child mope around on vacation mornings. Get them out on the water learning to be masters of the ocean — at our Cape Explorers Camp. Your program fee also funds free sailing for local Hatteras Island youth.	Your family is on the Outer Banks — one of the most spectacular stretches of coastline in the country, surrounded by water on every side. Cape Explorers Camp puts your kid in it.\n\n  Every morning session puts young visitors on the water with our instructors, learning real skills in a real ocean environment: boat handling, navigation basics, reading wind and weather, and the kind of confidence that only comes from actually doing it. By Friday, they are not tourists anymore. They are Cape explorers.\n\n  Week-long program, Monday through Friday, morning sessions. Ages 8–16. All experience levels welcome — no prior sailing knowledge required. Limited spots available each week.\n\n  Here's something worth knowing: your program fee does double duty. Hatteras Community Sailing is a 501(c)3 nonprofit, and every dollar from visiting families directly subsidizes free spots for local Hatteras Island youth who otherwise couldn't access this kind of instruction.	Half day (4-5 hours)	50000	$500 / child	$500 per child for the full week morning program (Mon–Fri). Ages 8–16. All skill levels welcome. Spots are limited — book early.	10	Collegiate 420s	["Ages 8–16, all experience levels", "Monday–Friday morning program", "Boat handling and navigation basics", "Sailing certification included", "Your fee funds a local kid's spot"]	/trip-photos/cape-explorers-camp.jpg	t	55	\N	2026-05-07 15:37:42.445717+00	2026-05-07 15:37:42.445717+00	per_person	f
10	beach-cat-rental	Beach Cat Rental	rentals	rental	Low-cost beach cat rental for qualified community sailors — making independent sailing accessible and sustainable on Pamlico Sound.	Hatteras Community Sailing rents beach catamarans to qualified sailors on Pamlico Sound at rates well below what a commercial operator would charge — because access is part of our mission.\n\n  Available boats: Hobie 16, Hobie 18, and Collegiate 420. A skills checkout is required on your first rental of each class — call ahead or stop by to get on the calendar. We have wind limits by class and conditions, and we'll be straight with you about whether the day is right for it.\n\n  Not sure if you're ready? Start with our Beach Cat Sailing Lesson. Complete it and you're approved to rent with no additional checkout.\n\n  Rental fees support fleet maintenance, insurance, and the operational costs that make all Hatteras Community Sailing programs possible.	4 hours base (additional hours available)	20000	$200 / 4 hrs	Community program fee: $200/4 hours. $50/additional hour. One-time $50 checkout fee for new renters. Fees support fleet sustainability.	2	Hobie 16 or Hobie 18	["Hobie 16, Hobie 18, and C420 available", "Skills checkout on first rental of each class", "Call ahead to confirm conditions and availability", "Lesson completion = instant rental approval", "Extended half-day and full-day rentals"]	/trip-photos/beach-cat-rental.jpg	t	60	\N	2026-05-07 15:37:44.208865+00	2026-05-07 15:37:44.208865+00	flat	f
5	dolphin-tour	Dolphin & Wildlife Tour	experiences	tour	Learn about dolphins, tides, inlets, and barrier islands right in Hatteras Inlet. A portion of every tour directly funds free youth sailing programs on Hatteras Island.	Pamlico Sound and Hatteras Inlet are home to a resident population of Atlantic bottlenose dolphins — and we know where to find them.\n\nThis tour is part adventure, part environmental education. Your guide shares what we know about local dolphin behavior, Sound ecology, tidal dynamics, and the unique geography of the Hatteras Inlet system — one of the most active and ever-changing inlets on the East Coast. There is no better classroom than the water itself.\n\nIdeal for families, curious visitors, and anyone who wants to understand this place a little more deeply before they leave it.\n\n**What's Included**\n- **Licensed USCG captain** — experienced, local, and knows the Sound\n- **Junior sailor mate** — crew support aboard (works for tips, always appreciated)\n- **Cooler with ice** — bring your own drinks and snacks\n- **Porta-pot or marine head** — vessel equipped for comfort\n- **Bluetooth speaker** — your playlist, your sail\n- **Chloe** — Capt. Jay's golden retriever; first come, first served\n\nProgram fees support Hatteras Community Sailing's broader 501(c)3 mission: free youth sailing and environmental education on the Outer Banks.	2 hours	32500	$325–$595	Community program fee: $325. Fees support our 501(c)3 environmental education and community sailing mission. Up to 8 participants.	8	Zodiac RIB	["Licensed USCG captain aboard", "Junior sailor mate (works for tips)", "Cooler stocked with ice", "Porta-pot or marine head aboard", "Bluetooth music", "Chloe the golden retriever (with Capt. Jay, first come first served)", "Resident bottlenose dolphin population", "Hatteras Inlet ecology and tidal dynamics", "Environmental education component", "Suitable for all ages", "Small group for close approach"]	/trip-photos/dolphin-tour.jpg	t	75	\N	2026-05-07 15:37:35.026852+00	2026-05-07 15:37:35.026852+00	flat	f
7	beach-cat-lesson	Beach Cat Sailing Lesson	learn	lesson	Beach cat sailing is the fastest, most exciting sailing you can find — wet, wild, and a whole lot more fun with real training. Get certified to rent our beach cats, no questions asked.	Beach cat sailing is in a category of its own. These are fast, powerful multihull boats that fly a hull in big gusts and drench you in spray on every tack. They're not difficult to sail well — but there's a right way to do it, and learning that way makes all the difference between a great time and a swim.\n\n  Our Beach Cat Sailing Lesson is a half-day hands-on session on Pamlico Sound. You'll rig, launch, and sail a beach catamaran with one of our US Sailing certified instructors — covering points of sail, tacking and jibing, capsize recovery, and the finer points of beach cat handling in real wind and chop.\n\n  Complete the lesson and you're certified to rent our beach cats independently — no extra paperwork, no questions asked. It's the fastest path from curious to on the water on your own.\n\n  $300 per half-day session. Group rates available.	4 hours	30000	$300 / half day	Community program fee: $300 / half day. Includes beach cat certification — complete the lesson and rent our cats independently, no extra steps. Fees support our 501(c)3 mission.	2	Hobie 16 or Hobie 18	["US Sailing certified instruction", "Capsize recovery included", "Protected Sound sailing conditions", "Certifies you for independent beach cat rental", "Group rates available"]	/trip-photos/beach-cat-lesson.jpg	t	45	\N	2026-05-07 15:37:39.34882+00	2026-05-07 15:37:39.34882+00	flat	f
3	full-day-sail	Full Day Sail	experiences	charter	A full day of relaxation on the water. 'nuff said. A portion of every charter directly funds free youth sailing programs on Hatteras Island.	A full day on the water is its own kind of vacation. No schedule, no deadlines — just the Sound, the wind, and wherever the day takes you.\n\nPopular destinations for our Full Day Sail include Ocracoke Island, the ruins of Diamond City, and the remote barrier islands of the Sound's outer edge. We've also been known to drift through Hatteras Inlet and out toward the blue water just because conditions were right. Bring a cooler, bring lunch, and know that wherever we end up, you'll be glad you spent the day this way.\n\n**What's Included**\n- **Licensed USCG captain** — experienced, local, and knows the Sound\n- **Junior sailor mate** — crew support aboard (works for tips, always appreciated)\n- **Cooler with ice** — bring your own drinks and snacks\n- **Porta-pot or marine head** — vessel equipped for comfort\n- **Bluetooth speaker** — your playlist, your sail\n- **Lunch stop and fuel** — included for the full day\n- **Chloe** — Capt. Jay's golden retriever; first come, first served\n\nHatteras Community Sailing is a 501(c)3 nonprofit. Your full-day participation is the single largest contribution a visitor can make to our mission — every dollar supports free youth sailing and community instruction on the Outer Banks.	8 hours	99500	$995–$2,495	Community program fee: $1,400. Fees fund our 501(c)3 youth and community programs. Lunch and fuel included. Up to 6 participants.	6	Stiletto 27 Catamaran	["Licensed USCG captain aboard", "Junior sailor mate (works for tips)", "Cooler stocked with ice", "Porta-pot or marine head aboard", "Bluetooth music", "Chloe the golden retriever (with Capt. Jay, first come first served)", "Ocracoke or Diamond City day trip option", "Lunch stop and fuel included", "Private charter", "Hatteras Inlet and open Sound access", "Most impactful way to support our mission"]	/trip-photos/full-day-sail.jpg	t	70	\N	2026-05-07 15:37:32.307305+00	2026-05-07 15:37:32.307305+00	flat	f
12	adult-sailing-program	Adult Learn to Sail	learn	lesson	A structured 4-week sailing course for adults on Pamlico Sound. Two morning sessions per week — learn seamanship, boat handling, and the points of sail from certified instructors.	Hatteras Community Sailing's Adult Learn to Sail program is designed for complete beginners and returning sailors alike. Over four weeks, you will develop real sailing competency on the waters of Pamlico Sound — one of the finest sailing venues on the East Coast.\n\n**Program Format**\nTwo morning sessions per week for four weeks — eight sessions total. Each class runs approximately 3 hours, scheduled in the morning to take advantage of the Sound's best sailing winds.\n\n**Three Summer Sessions Available**\nSessions run in June, July, and August. Space is limited to 6 adults per session to ensure personalized instruction and maximum time at the helm.\n\n**What You Will Learn**\nWe cover everything from first principles: how a sailboat works, points of sail, tacking and gybing, sail trim, basic navigation, and safe boat handling. By the end of the program, you will be able to skipper a small sailboat independently.\n\n**Our Instructors**\nHCS instructors are US Sailing certified coaches with deep roots in the Hatteras sailing community. Small class sizes mean you get real feedback every session, not just observation from the dock.\n\n---\n\nThis program supports Hatteras Community Sailing's 501(c)3 mission. Member discounts available — ask us about HCS membership.	2 hrs · 2 mornings/week · 4 weeks	25000	$250 / session	Non-member pricing. HCS members receive a discount — membership details coming soon.	6	Collegiate 420s	["US Sailing certified instruction", "All sailing equipment provided", "Life vest included", "Maximum 6 students per session", "Morning sessions on Pamlico Sound", "Certificate of completion", "Skipper independently by end of program", "3 summer sessions: June, July, August"]	/trip-photos/adult-sailing-program.jpg	t	15	\N	2026-05-08 00:00:52.123363+00	2026-05-08 00:00:52.123363+00	per_person	f
4	stiletto-x-charter	Stiletto X Charter	experiences	charter	Sailing these boats since he was a boy, Capt. Jay went on to develop and build the new Stiletto X Series — and here it is. Charter it for a sunset, half day, or full day. Love it? It's for sale, or he can build you one. A portion of every charter directly funds free youth sailing programs on Hatteras Island.	Capt. Jay grew up sailing Stilettos on Hatteras Island. He went on to design, develop, and build the new Stiletto X Series — a complete reimagining of the iconic beach cat for the modern era. The boat you're chartering is one he built himself.\n\nThe Stiletto X is the highest-performance vessel in the Hatteras Community Sailing fleet. It's faster, more capable, and a more visceral sailing experience than anything else on the Sound. Available for sunset sails, half-day charters, and full-day adventures — at the Stiletto X price point.\n\nAnd yes — if you fall in love with it, it's for sale. Or Capt. Jay can build you one.\n\n**What's Included**\n- **Capt. Jay at the helm** — the man who built the boat\n- **Junior sailor mate** — crew support aboard (works for tips, always appreciated)\n- **Cooler with ice** — bring your own drinks and snacks\n- **Porta-pot or marine head** — vessel equipped for comfort\n- **Bluetooth speaker** — your playlist, your sail\n- **Chloe** — she sails with Capt. Jay; first come, first served\n\nCharter fees support Hatteras Community Sailing's 501(c)3 mission: free and reduced-cost youth sailing for Hatteras Island kids.	Half day, full day, or sunset	59500	$595–$1,495	Community program fee: 1.5× standard rates. Supports nonprofit operations. Up to 10 participants.	10	Stiletto X Catamaran	["Designed and built by Capt. Jay", "Licensed USCG captain (Capt. Jay)", "Junior sailor mate (works for tips)", "Cooler stocked with ice", "Porta-pot or marine head aboard", "Bluetooth music", "Chloe the golden retriever (first come first served)", "Highest-performance cat in the fleet", "Available sunset, half-day, or full day", "For sale — or build-to-order", "Supports youth sailing mission"]	/trip-photos/stiletto-x-charter.jpg	t	80	\N	2026-05-07 15:37:33.572114+00	2026-05-07 15:37:33.572114+00	flat	f
11	skiff-rental	Skiff Rental	rentals	rental	High-performance sailing access for experienced community sailors — the American 19 on Pamlico Sound.	For experienced one-design and high-performance dinghy sailors, the American 19 skiff is the most demanding boat in the Hatteras Community Sailing fleet — and the most rewarding to sail well.\n\n  This is not a boat for the casual or rusty sailor. Experience verification is required before checkout, and we'll have an honest conversation with you about conditions before you go out. Pamlico Sound can be deceptively technical, and the American 19 demands respect.\n\n  If you've got the skills and want a genuine performance sailing session on the Sound, this is it. Rental fees support Hatteras Community Sailing's 501(c)3 mission and fleet operations.	2-hour minimum	10000	$100 / hr	Community program fee: $100/hr. 2-hour minimum. Fuel surcharge and refundable damage deposit required.	2	American 19 Skiff	["High-performance one-design skiff", "Experienced sailors only", "Experience verification required", "2-hour minimum, extended rentals available", "Fuel surcharge and deposit apply"]	/trip-photos/skiff-rental.jpg	t	65	\N	2026-05-07 15:37:45.570263+00	2026-05-07 15:37:45.570263+00	flat	t
6	large-group-flotilla	Large Group Flotilla	experiences	tour	More than 6 in your group? You need more boats and captains — and we are here for you. Flotilla pricing is tailored to your group size and itinerary. A portion of every charter directly funds free youth sailing programs on Hatteras Island.	When your group is bigger than six, one boat isn't enough — and Hatteras Community Sailing is ready to put together a full flotilla for you.\n\n  We deploy multiple Stiletto catamarans with separate captains for groups of any size. Flotillas are popular for family reunions, corporate team building, wedding parties, school groups, and STEM outings. We've run programs for homeschool co-ops, Scout troops, and corporate retreats — and we tailor each one to the group's goals and ages.\n\n  Want a Intro to Sailing component? Racing between the boats? A sandbar stop and swim break? A naturalist-led environmental education component? We can build that in.\n\n  Call us to discuss your group and we'll put together a package priced to your needs. As a 501(c)3 nonprofit, working with groups is part of our broader community mission.	4 hours	59500	Custom pricing	Community program fee: $595. Fees support our 501(c)3 environmental education mission. Up to 8 participants.	8	Zodiac RIB	["Multiple boats and captains", "Cooler with ice on each vessel", "Porta-pot or marine head aboard", "Bluetooth music", "Chloe the golden retriever (with Capt. Jay, first come first served)", "Groups of any size", "Corporate, school, and family events", "Custom itinerary and curriculum", "STEM and environmental education options"]	/trip-photos/large-group-flotilla.jpg	t	30	\N	2026-05-07 15:37:38.212376+00	2026-05-07 15:37:38.212376+00	flat	f
2	half-day-sail	Half Day Charter	experiences	charter	4 hours is perfect for exploring the secret islands and sandbars of Pamlico Sound stretching from Avon to Hatteras Village. Your private charter, your itinerary. A portion of every charter directly funds free youth sailing programs on Hatteras Island.	Four hours is the perfect amount of time to disappear into the Pamlico Sound and find one of the secret islands and sandbars that stretch from Avon to Hatteras Village.\n\nThese are places most Outer Banks visitors never see — shallow bayside coves, remote sandy shoals where you can wade in the shallows, and the quiet that comes from being genuinely away from everything. Your captain knows them all.\n\nSwim stops are standard. All experience levels welcome. This is a private charter — just your group, your itinerary, your afternoon.\n\n**What's Included**\nEvery Half Day Charter comes fully set up so you can focus on the water:\n\n- **Licensed USCG captain** — experienced, local, and knows the Sound\n- **Junior sailor mate** — crew support aboard (works for tips, always appreciated)\n- **Cooler with ice** — bring your own drinks and snacks\n- **Porta-pot or marine head** — vessel equipped for comfort\n- **Bluetooth speaker** — your playlist, your sail\n- **Chloe** — Capt. Jay's golden retriever; first come, first served, ask when booking\n\nHatteras Community Sailing is a 501(c)3 nonprofit. Every charter supports free and reduced-cost youth sailing instruction for local Hatteras Island youth who otherwise couldn't access it.	4 hours	49500	$495–$895	Flat rate for the vessel. Prices vary by boat — see vessel options below.	6	Stiletto 27 Catamaran	["Licensed USCG captain aboard", "Junior sailor mate (works for tips)", "Cooler stocked with ice", "Porta-pot or marine head aboard", "Bluetooth music", "Chloe the golden retriever (with Capt. Jay, first come first served)", "Secret Sound islands and sandbars", "Swim stop included", "Private charter — your itinerary", "All experience levels welcome"]	/trip-photos/half-day-charter.jpg	t	20	\N	2026-05-07 15:37:30.618856+00	2026-05-07 15:37:30.618856+00	flat	f
\.


--
-- Data for Name: sh_vessels; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sh_vessels (id, name, description, capacity, price_cents, price_display, image_url, active, sort_order, created_at) FROM stdin;
1	Stiletto 27 Catamaran	Our classic twin-hull catamaran — stable, fast, and perfect for groups.	8	7500	$75/person	\N	t	1	2026-05-07 19:57:50.281983+00
2	46' Deadrise	A classic Carolina-style working boat — rugged, spacious, and authentic.	10	6500	$65/person	\N	t	2	2026-05-07 19:57:50.281983+00
3	Stiletto X Luxury Cat	The premium catamaran experience with upgraded amenities and more space.	6	15000	$150/person	\N	t	3	2026-05-07 19:57:50.281983+00
5	Zodiac 550 Pro	High-speed rigid inflatable — adventurous, nimble, and great for dolphins.	6	4500	$45/person	\N	t	5	2026-05-07 19:57:50.281983+00
7	Opti Green Fleet	Competitive Optimist racing for developing sailors. Ages 9–13.	8	20000	$200/session	\N	t	2	2026-05-07 22:42:01.079754+00
9	SAISA High School Sailing	Spring and fall interscholastic competitive sailing. Grades 8–12.	8	69500	$695/session	\N	t	4	2026-05-07 22:42:01.079754+00
6	Sailing Littles	Optimist intro sailing for young beginners. Ages 6–9.	8	9500	$95/session	\N	t	1	2026-05-07 22:42:01.079754+00
8	Collegiate 420 Sailing	Two-person high-performance dinghy. Teamwork, tactics, and boat speed. Ages 12–18.	6	29500	$295/session	\N	t	3	2026-05-07 22:42:01.079754+00
4	Over 6-Flotilla	Each boat holds up to 6 passengers — $395 per boat. We send as many boats as your group needs.	6	5500	$55/person	\N	t	4	2026-05-07 19:57:50.281983+00
10	Hobie 16	Classic twin-hull beach catamaran. Fast, fun, and ideal for two sailors on Pamlico Sound. Daggerboards, trampoline, and tiller steering.	2	20000	$200 / 4 hrs	\N	t	20	2026-05-08 00:04:58.700359+00
11	Hobie 18	Larger twin-hull catamaran with more sail area and stability. Great for a more exhilarating ride or for sailors who want a bit more boat.	2	20000	$200 / 4 hrs	\N	t	21	2026-05-08 00:04:58.700359+00
12	HCS Skiff	A stable, outboard-powered skiff ideal for exploring the sound, fishing, or getting to the beach. Easy to handle for new boaters.	4	10000	$100 / hr	\N	t	22	2026-05-08 00:04:58.700359+00
13	Opti — Ages 8–12	Optimist dinghy sailing for campers ages 8 to 12. Hands-on instruction in a stable, purpose-built beginner boat.	8	50000	$500 / child	\N	t	30	2026-05-08 01:43:33.770479+00
14	420 — Ages 13–18	Collegiate 420 sailing for teens ages 13 to 18. Two-up dinghy sailing with more speed and challenge.	8	50000	$500 / child	\N	t	31	2026-05-08 01:43:33.770479+00
\.


--
-- Data for Name: team_members; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.team_members (id, name, title, bio, headshot_url, display_order, created_at) FROM stdin;
1	Jay M. Phillips	CEO & Product Development	Jay has been immersed in the maritime industry since the age of 14, accumulating over 100,000 bluewater miles. His career spans ownership and management of sail lofts, boat building operations, and maritime web development firms. Jay currently serves as Chair of Hatteras Sailing, an educational maritime nonprofit, bringing decades of hands-on experience and passion for the sea to PamliEcoConnect.	\N	1	2026-04-30 20:03:35.476952+00
2	John Edward Elion	CFO & Technology Professional	John has served as Chair of the Waterworks Foundation, a Chesapeake Bay environmental organization. He has owned and built several multihull brands across the United States and Canada, combining deep financial acumen with a lifelong commitment to environmental stewardship in the maritime sector.	\N	2	2026-04-30 20:03:35.531576+00
3	Alan Stewart	Design Team Leader	Alan holds a degree in Aerospace Engineering and brings over a decade of partnership at B&B Boat Designs in Eastern North Carolina. His aerospace background directly informs PamliEcoConnect's hydrofoil engineering, where principles of lift, drag, and structural efficiency are as critical on the water as they are in the air.	\N	3	2026-04-30 20:03:35.577498+00
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, name, email, phone, password_hash, role, approval_status, nda_accepted, created_at, updated_at) FROM stdin;
1	Admin User	admin@pamliecoconnect.com	+1-555-0100	$2b$12$yhCEDTq1KCQRo5oscN7KZuROfybBTaf.JCpeivcO5CnX8/1sSuiqu	admin	approved	t	2026-04-30 01:41:04.463793+00	2026-04-30 01:41:04.463793+00
2	Alice Investor	alice_1777513715859@investortest.com	+1 (555) 123-4567	$2b$12$9NJVPy8A461ldyl3Mx/xEewCJBfsjZROcHp3BP3SQdFZs3kzPTd/2	investor	pending	f	2026-04-30 01:49:08.298088+00	2026-04-30 01:49:08.298088+00
23	Noah Phillips	noah.phillips@phillipsboatworks.com	252-489-7607	$2b$12$rsz4XLxG99y/FnqNeZDQHO873Vs0PF3iquy/PrevJi/Kk.l0f0.ZS	investor	approved	t	2026-04-30 13:27:14.558025+00	2026-04-30 13:28:58.466+00
10	JAY PHILLIPS	jay.phillips@phillipsboatworks.com	2524898193	$2b$10$rKVJZTtnB2.LjLATH02afeiN0dNPwP4vkDzsou.gQx.0rB7kNPl2a	admin	approved	t	2026-04-30 11:08:34.84979+00	2026-05-08 14:22:43.73+00
\.


--
-- Data for Name: waitlist; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.waitlist (id, name, email, phone, created_at) FROM stdin;
1	Test User	testuser_1777513567118@example.com	+1 (555) 000-0000	2026-04-30 01:47:11.201952+00
\.


--
-- Name: contact_submissions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.contact_submissions_id_seq', 1, true);


--
-- Name: content_pages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.content_pages_id_seq', 518, true);


--
-- Name: investor_applications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.investor_applications_id_seq', 2, true);


--
-- Name: posts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.posts_id_seq', 32, true);


--
-- Name: sh_availability_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sh_availability_id_seq', 1, false);


--
-- Name: sh_bookings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sh_bookings_id_seq', 1, false);


--
-- Name: sh_contacts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sh_contacts_id_seq', 1, false);


--
-- Name: sh_trip_vessels_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sh_trip_vessels_id_seq', 46, true);


--
-- Name: sh_trips_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sh_trips_id_seq', 12, true);


--
-- Name: sh_vessels_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sh_vessels_id_seq', 14, true);


--
-- Name: team_members_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.team_members_id_seq', 3, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 68, true);


--
-- Name: waitlist_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.waitlist_id_seq', 1, true);


--
-- Name: contact_submissions contact_submissions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contact_submissions
    ADD CONSTRAINT contact_submissions_pkey PRIMARY KEY (id);


--
-- Name: content_pages content_pages_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.content_pages
    ADD CONSTRAINT content_pages_pkey PRIMARY KEY (id);


--
-- Name: content_pages content_pages_slug_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.content_pages
    ADD CONSTRAINT content_pages_slug_unique UNIQUE (slug);


--
-- Name: investor_applications investor_applications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.investor_applications
    ADD CONSTRAINT investor_applications_pkey PRIMARY KEY (id);


--
-- Name: posts posts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_pkey PRIMARY KEY (id);


--
-- Name: sh_availability sh_availability_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sh_availability
    ADD CONSTRAINT sh_availability_pkey PRIMARY KEY (id);


--
-- Name: sh_bookings sh_bookings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sh_bookings
    ADD CONSTRAINT sh_bookings_pkey PRIMARY KEY (id);


--
-- Name: sh_contacts sh_contacts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sh_contacts
    ADD CONSTRAINT sh_contacts_pkey PRIMARY KEY (id);


--
-- Name: sh_trip_vessels sh_trip_vessels_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sh_trip_vessels
    ADD CONSTRAINT sh_trip_vessels_pkey PRIMARY KEY (id);


--
-- Name: sh_trips sh_trips_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sh_trips
    ADD CONSTRAINT sh_trips_pkey PRIMARY KEY (id);


--
-- Name: sh_trips sh_trips_slug_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sh_trips
    ADD CONSTRAINT sh_trips_slug_unique UNIQUE (slug);


--
-- Name: sh_vessels sh_vessels_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sh_vessels
    ADD CONSTRAINT sh_vessels_pkey PRIMARY KEY (id);


--
-- Name: team_members team_members_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.team_members
    ADD CONSTRAINT team_members_pkey PRIMARY KEY (id);


--
-- Name: users users_email_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_unique UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: waitlist waitlist_email_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.waitlist
    ADD CONSTRAINT waitlist_email_unique UNIQUE (email);


--
-- Name: waitlist waitlist_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.waitlist
    ADD CONSTRAINT waitlist_pkey PRIMARY KEY (id);


--
-- Name: investor_applications investor_applications_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.investor_applications
    ADD CONSTRAINT investor_applications_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: sh_availability sh_availability_trip_id_sh_trips_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sh_availability
    ADD CONSTRAINT sh_availability_trip_id_sh_trips_id_fk FOREIGN KEY (trip_id) REFERENCES public.sh_trips(id);


--
-- Name: sh_bookings sh_bookings_trip_id_sh_trips_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sh_bookings
    ADD CONSTRAINT sh_bookings_trip_id_sh_trips_id_fk FOREIGN KEY (trip_id) REFERENCES public.sh_trips(id);


--
-- Name: sh_trip_vessels sh_trip_vessels_trip_id_sh_trips_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sh_trip_vessels
    ADD CONSTRAINT sh_trip_vessels_trip_id_sh_trips_id_fk FOREIGN KEY (trip_id) REFERENCES public.sh_trips(id);


--
-- Name: sh_trip_vessels sh_trip_vessels_vessel_id_sh_vessels_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sh_trip_vessels
    ADD CONSTRAINT sh_trip_vessels_vessel_id_sh_vessels_id_fk FOREIGN KEY (vessel_id) REFERENCES public.sh_vessels(id);


--
-- PostgreSQL database dump complete
--

\unrestrict Jpr0hT74ZgSULkJOnzgCQnneAvmpI5LcAX3iMj40dtyFg1U91nMwmvNDr92AzYh

