-- =============================================================
-- Learn to Sail Program Updates
-- Run on server: psql $DATABASE_URL -f update-learn-programs.sql
-- =============================================================

-- 1. Insert Cape Explorer Camp (5-day weekday camp, $500/week)
--    If it already exists with this slug, update it instead.
INSERT INTO sh_trips (
  slug, name, category, type,
  short_description, description,
  duration, price_min, price_display, pricing_note, pricing_model,
  max_passengers, boat,
  highlights,
  active, coming_soon, sort_order
)
VALUES (
  'cape-explorer-camp',
  'Cape Explorer Camp',
  'learn',
  'camp',
  'Introductory 5-day weekday sailing and boating camp for children. Many participants have never sailed, boated, or swum before joining. Large and small boats, certified instructors, and a welcoming community.',
  E'Cape Explorer Camp is our introductory sailing and boating program for children — a full 5-day weekday camp designed for kids with little or no prior experience on the water.\n\nParticipants learn the basics of sailing, boat handling, water safety, and seamanship using both large and small boats from our community fleet. Many of our campers have never sailed, boated, or even swum before arriving.\n\n**No experience required.** Our certified US Sailing instructors meet every child where they are and make sure they leave with confidence and a love for the water.\n\nCamps run Monday through Friday during the summer season on Pamlico Sound in Buxton, NC — one of the finest youth sailing environments on the East Coast.',
  '5 days (Mon–Fri)',
  50000,
  '$500',
  'per week · Monday–Friday',
  'per_person',
  12,
  'Community Fleet',
  '["On-water sailing instruction", "Water safety and seamanship", "Large and small boat experience", "US Sailing certified instructors", "All ages and experience levels welcome", "No prior experience required"]'::jsonb,
  true,
  false,
  25
)
ON CONFLICT (slug) DO UPDATE SET
  name            = EXCLUDED.name,
  short_description = EXCLUDED.short_description,
  description     = EXCLUDED.description,
  duration        = EXCLUDED.duration,
  price_min       = EXCLUDED.price_min,
  price_display   = EXCLUDED.price_display,
  pricing_note    = EXCLUDED.pricing_note,
  highlights      = EXCLUDED.highlights,
  active          = EXCLUDED.active;

-- 2. Insert Adult Training Programs card
INSERT INTO sh_trips (
  slug, name, category, type,
  short_description, description,
  duration, price_min, price_display, pricing_note, pricing_model,
  max_passengers, boat,
  highlights,
  active, coming_soon, sort_order
)
VALUES (
  'adult-training-programs',
  'Adult Training Programs',
  'learn',
  'instruction',
  'Private adult sailing instruction on Pamlico Sound — from a focused 4-hour lesson to a customized 3-to-5-day training program. All experience levels welcome. US Sailing certified instructors.',
  E'Whether you are brand new to sailing or looking to sharpen your skills, our Adult Training Programs offer structured, personalized instruction on the waters of Pamlico Sound.\n\n**Choose the program that fits your schedule and goals:**\n\n**Private 4-Hour Lesson — $495/person**\nA focused half-day session covering the essentials of sailing, boat handling, and seamanship. Perfect for first-timers or those returning to the water after a break.\n\n**Private Full Day Lesson — $895/person**\nA comprehensive full-day on-water training experience. Cover more ground, build real confidence, and leave with the skills to sail independently.\n\n**3 to 5 Day Training Program — Contact us**\nA customized multi-day program built around your goals — whether you are working toward a certification, preparing for offshore sailing, or developing crew skills. Contact us to build your schedule.\n\nAll programs are conducted by US Sailing certified instructors on Pamlico Sound — one of the finest sailing environments on the East Coast.',
  'Varies by program',
  49500,
  'From $495',
  'per person',
  'per_person',
  4,
  'Community Fleet',
  '["US Sailing certified instructors", "All experience levels welcome", "Private one-on-one or small group instruction", "Pamlico Sound — flat water, consistent winds", "Choose your schedule and program length", "Path to US Sailing certification available"]'::jsonb,
  true,
  false,
  35
)
ON CONFLICT (slug) DO UPDATE SET
  name              = EXCLUDED.name,
  short_description = EXCLUDED.short_description,
  description       = EXCLUDED.description,
  duration          = EXCLUDED.duration,
  price_min         = EXCLUDED.price_min,
  price_display     = EXCLUDED.price_display,
  pricing_note      = EXCLUDED.pricing_note,
  highlights        = EXCLUDED.highlights,
  active            = EXCLUDED.active;

-- Confirm
SELECT slug, name, price_display, active FROM sh_trips WHERE slug IN ('cape-explorer-camp', 'adult-training-programs');
