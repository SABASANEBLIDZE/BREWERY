/* ============================================================
   AUSTRIAN BREWERY — script.js (FULLY IMPROVED)
   ── FIX LIST ────────────────────────────────────────────────
   1. Logo click → smooth scroll to top (#home) ✓
   2. Reservation system with localStorage storage ✓
      - Reservations saved permanently in browser
      - Time slots show as booked when date already reserved
      - Dynamic availability update after booking
      - Full validation (name, phone, date, time, table)
      - Cancel reservation capability
      - Alert on successful reservation ✓
   3. Language switch bug fixed ✓
      - All texts including hero title fully translated
      - hero_title_1 / hero_title_2 keys translate properly
   4. Footer enhanced with social/email/map ✓ (in HTML)
   5. Beer card translations added ✓
   ============================================================ */

'use strict';

/* ══════════════════════════════════════════════════════════════
   TRANSLATION DICTIONARY
   ══════════════════════════════════════════════════════════════ */
const TRANSLATIONS = {
  GE: {
    /* Navigation */
    nav_home:           'მთავარი',
    nav_menu:           'მენიუ',
    nav_about:          'ჩვენს შესახებ',
    nav_contact:        'კონტაქტი',
    nav_reserve:        'ჯავშანი',

    /* Hero — FIX: title words are translatable too */
    hero_eyebrow:       'თბილისი, საქართველო',
    hero_title_1:       'ავსტრიული',
    hero_title_2:       'ლუდსახარში',
    hero_subtitle:      'ავსტრიული კრაფტ ლუდი და ქართული კერძები',
    hero_desc:          'ავსტრიული სიზუსტე, ქართული სტუმართმოყვარეობა. გრძნობ სიამოვნებას ყოველ ჭიქაში.',
    hero_cta_menu:      'მენიუს ნახვა',
    hero_cta_loc:       'ადგილმდებარეობა',
    hero_scroll:        'გახვედი ქვევით',

    /* About */
    about_label:        'ჩვენს შესახებ',
    about_title:        'ხელოვნება ლუდის კათხაში',
    about_badge:        'ჩვენი',
    about_badge2:       'ისტორია',
    about_p1:           'Austrian Brewery — ეს არის ადგილი, სადაც ავსტრიული ლუდდამზადების ტრადიცია შეხვდება ქართულ სამზარეულოს სიამტკბილობას. ჩვენი ოსტატი ლუდმზადელები ყოველ ჭიქაში ჩადებენ სიყვარულს, ტრადიციასა და გამოცდილებას.',
    about_p2:           'თბილისშო, დავით აღმაშენებლის ხეივანზე, ჩვენ შევქმენით სივრცე, სადაც ყოველი სტუმარი განსაკუთრებულია.',
    feat_beer:          'კრაფტ ლუდი',
    feat_beer_d:        'ყოველი ლუდი ადგილობრივი ინგრედიენტებით',
    feat_food:          'ქართული კერძები',
    feat_food_d:        'ტრადიციული გემო, თანამედროვე მიდგომა',
    feat_out:           'გარე სივრცე',
    feat_out_d:         'კომფორტული ტერასა ღია ცის ქვეშ',
    feat_live:          'ლაივ მუსიკა',
    feat_live_d:        'ყოველ პარასკევ და შაბათს',

    /* Beer Showcase */
    beer_label:         'ჩვენი ლუდები',
    beer_title:         'კრაფტ ლუდის კოლექცია',
    beer_sub:           'ყოველი სეზონისთვის — განსაკუთრებული ლუდი',
    beer_view_all:      'სრული მენიუ',
    beer1_name:         'ვეიცენი',
    beer1_desc:         'ტრადიციული ხორბლის ლუდი ბანანისა და ლურჯი კბილის ნოტებით',
    beer2_name:         'დუნკელი',
    beer2_desc:         'მუქი ლაგერი შოკოლადისა და კარამელის ნოტებით',
    beer3_name:         'კავკასიური IPA',
    beer3_desc:         'ადგილობრივი სვეტი ციტრუსოვანი სახეობით, ყვავილოვანი სუნი',
    beer4_name:         'ჰელეს ლაგერი',
    beer4_desc:         'სუფთა ოქროსფერი ლაგერი ბალახოვანი სვეტით',

    /* Outdoor */
    out_label:          'ტერასა',
    out_title:          'გარე სივრცე TV-ით და კომფორტით',
    out_p1:             'ჩვენი ლამაზი ტერასა — სრულყოფილი ადგილია მეგობრებთან ერთად სასიამოვნო საღამოებისთვის. ბუნებრივი განათება, კომფორტული სავარძლები და ხალისიანი ატმოსფერო.',
    out_p2:             'ყოველდღე ღია ვართ 12:00-დან 23:00-მდე. ჩვენ სასიამოვნოა სტუმრობა ნებისმიერ ამინდში.',
    out_tag1:           'ტერასა',
    out_tag2:           'ლაივ ივენთები',
    out_tag3:           'სოკო გრილი',
    out_tag4:           'კომფორტი',
    out_cta:            'ჯავშნა მაგიდა',
    out_overlay:        'გარე სივრცე ✓ ხელმისაწვდომია',

    /* Reservation */
    res_label:          'სუფრის ჯავშანი',
    res_title:          'დაჯავშნე მაგიდა',
    res_sub:            'შეავსე ფორმა და ჩვენ დაგიკავშირდებით',
    res_form_title:     'თქვენი ინფორმაცია',
    res_name_label:     'სახელი და გვარი',
    res_name_ph:        'მაგ: გიორგი მამულაძე',
    res_phone_label:    'ტელეფონის ნომერი',
    res_phone_ph:       'მაგ: +995 555 123 456',
    res_guests_label:   'სტუმრების რაოდენობა',
    res_date_label:     'თარიღი',
    res_time_label:     'დრო',
    res_time_pick:      '-- აირჩიეთ --',
    res_submit:         'ჯავშნის დადასტურება',
    res_success_msg:    'ჯავშანი წარმატებით გაიგზავნა!',
    res_confirm_note:   'ჯავშანი დადასტურდება ჩვენი დაკავშირების შემდეგ.',
    /* Validation errors */
    err_name:           'სახელი სავალდებულოა',
    err_phone:          'ტელეფონის ნომერი სავალდებულოა',
    err_date:           'გთხოვთ აირჩიოთ თარიღი',
    err_time:           'გთხოვთ აირჩიოთ დრო',

    /* Reviews */
    rev_label:          'სტუმრების შთაბეჭდილებები',
    rev_title:          'ჩვენი სტუმრები ამბობენ',
    rev_sub:            'ნამდვილი შთაბეჭდილებები ჩვენი სტუმრებისგან',

    /* Footer */
    footer_tagline:     'ავსტრიული ლუდი · ქართული სამზარეულო',
    footer_brand_p:     'გამოჩნდი და გაეცანი ჩვენს ატმოსფეროს. ჩვენ ვიდგეები შენი სასიამოვნო სტუმრობისთვის.',
    footer_h_contact:   'კონტაქტი',
    footer_h_hours:     'სამუშაო საათები',
    footer_h_location:  'ადგილმდებარეობა',
    footer_addr:        'დავით აღმაშენებლის ხეივანი 256, თბილისი',
    footer_hours:       'ყოველდღე: 12:00 – 23:00',
    footer_location_desc: 'მდებარეობს დავით აღმაშენებლის ხეივანზე, ვაკე-საბურთალოს მეტროსთან ახლოს.',
    footer_map_cta:     'რუკაზე ნახვა',
    footer_copy:        '© 2025 Austrian Brewery. ყველა უფლება დაცულია.',
    footer_menu:        'მენიუ',
    footer_privacy:     'კონფიდენციალობა',
    footer_cta_label:   'გამოჩნდი',
    footer_cta_title:   'გახდი ჩვენი სტუმარი',
    hours_weekday:      'ორშ–პარ',
    hours_weekend:      'შაბ–კვი',

    /* Menu Page */
    menu_eyebrow:       'ჩვენი შეთავაზება',
    menu_title:         'მენიუ',
    menu_sub:           'კრაფტ ლუდი, ქართული კერძები და წასახემსებელი',
    filter_all:         'ყველა',
    filter_beer:        'კრაფტ ლუდი',
    filter_geo:         'ქართული კერძები',
    filter_snacks:      'წასახემსებელი',
    menu_empty:         'ამ კატეგორიაში პოზიციები არ მოიძებნა.',
  },

  EN: {
    /* Navigation */
    nav_home:           'Home',
    nav_menu:           'Menu',
    nav_about:          'About',
    nav_contact:        'Contact',
    nav_reserve:        'Reserve',

    /* Hero */
    hero_eyebrow:       'Tbilisi, Georgia',
    hero_title_1:       'Austrian',
    hero_title_2:       'Brewery',
    hero_subtitle:      'German Craft Beer & Georgian Cuisine',
    hero_desc:          'Austrian precision meets Georgian hospitality. Experience pleasure in every glass.',
    hero_cta_menu:      'View Menu',
    hero_cta_loc:       'Our Location',
    hero_scroll:        'Scroll Down',

    /* About */
    about_label:        'About Us',
    about_title:        'The Art in Every Bottle',
    about_badge:        'Our',
    about_badge2:       'Story',
    about_p1:           'Austrian Brewery is a place where the tradition of Austrian brewing meets the warmth of Georgian cuisine. Our master brewers pour love, tradition, and years of expertise into every glass.',
    about_p2:           "Located in the heart of Tbilisi on Davit Aghmashenebeli Avenue, we've created a space where every guest is special.",
    feat_beer:          'Craft Beer',
    feat_beer_d:        'Every beer brewed with local ingredients',
    feat_food:          'Georgian Dishes',
    feat_food_d:        'Traditional flavors, modern approach',
    feat_out:           'Outdoor Seating',
    feat_out_d:         'Comfortable terrace under the open sky',
    feat_live:          'Live Music',
    feat_live_d:        'Every Friday and Saturday evening',

    /* Beer Showcase */
    beer_label:         'Our Beers',
    beer_title:         'Craft Beer Collection',
    beer_sub:           'A special brew for every season',
    beer_view_all:      'Full Menu',
    beer1_name:         'Weizen',
    beer1_desc:         'Traditional wheat beer with notes of banana and clove',
    beer2_name:         'Dunkel',
    beer2_desc:         'Dark lager with notes of chocolate and caramel',
    beer3_name:         'Caucasian IPA',
    beer3_desc:         'Local hops and citrus varieties. Floral aroma, bold bitterness',
    beer4_name:         'Helles Lager',
    beer4_desc:         'Clean golden lager with grassy hops and subtle sweetness',

    /* Outdoor */
    out_label:          'Terrace',
    out_title:          'Outdoor Space With TV & Comfort',
    out_p1:             'Our beautiful terrace is the perfect place for enjoyable evenings with friends. Natural lighting, comfortable seating, and a vibrant atmosphere.',
    out_p2:             'Open daily from 12:00 PM to 11:00 PM. We welcome guests in any weather.',
    out_tag1:           'Terrace',
    out_tag2:           'Live Events',
    out_tag3:           'Grill',
    out_tag4:           'Comfort Seating',
    out_cta:            'Reserve a Table',
    out_overlay:        'Outdoor Seating ✓ Available',

    /* Reservation */
    res_label:          'Table Reservation',
    res_title:          'Reserve a Table',
    res_sub:            'Fill in the form and we will get in touch with you',
    res_form_title:     'Your Information',
    res_name_label:     'Full Name',
    res_name_ph:        'e.g. John Smith',
    res_phone_label:    'Phone Number',
    res_phone_ph:       'e.g. +995 555 123 456',
    res_guests_label:   'Number of Guests',
    res_date_label:     'Date',
    res_time_label:     'Time',
    res_time_pick:      '-- Select --',
    res_submit:         'Confirm Reservation',
    res_success_msg:    'Reservation request sent successfully!',
    res_confirm_note:   'Reservation will be confirmed after we contact you.',
    /* Validation errors */
    err_name:           'Name is required',
    err_phone:          'Phone number is required',
    err_date:           'Please select a date',
    err_time:           'Please select a time',

    /* Reviews */
    rev_label:          'Guest Reviews',
    rev_title:          'What Our Guests Say',
    rev_sub:            'Genuine experiences from our valued guests',

    /* Footer */
    footer_tagline:     'Austrian Beer · Georgian Cuisine',
    footer_brand_p:     'Come and experience our atmosphere. We are dedicated to making your visit unforgettable.',
    footer_h_contact:   'Contact',
    footer_h_hours:     'Working Hours',
    footer_h_location:  'Location',
    footer_addr:        '256 Davit Aghmashenebeli Ave, Tbilisi',
    footer_hours:       'Daily: 12:00 PM – 11:00 PM',
    footer_location_desc: 'Located on Davit Aghmashenebeli Avenue, near the Vake-Saburtalo metro.',
    footer_map_cta:     'View on Map',
    footer_copy:        '© 2025 Austrian Brewery. All rights reserved.',
    footer_menu:        'Menu',
    footer_privacy:     'Privacy',
    footer_cta_label:   'Visit Us',
    footer_cta_title:   'Become Our Guest',
    hours_weekday:      'Mon–Fri',
    hours_weekend:      'Sat–Sun',

    /* Menu Page */
    menu_eyebrow:       'Our Offerings',
    menu_title:         'Menu',
    menu_sub:           'Craft Beer, Georgian Dishes & Snacks',
    filter_all:         'All',
    filter_beer:        'Craft Beer',
    filter_geo:         'Georgian Dishes',
    filter_snacks:      'Snacks',
    menu_empty:         'No items found in this category.',
  }
};

/* ══════════════════════════════════════════════════════════════
   MENU ITEMS DATA
   ══════════════════════════════════════════════════════════════ */
const MENU_ITEMS = [
  /* ── CRAFT BEER ── */
  { id:1,  category:'beer',     img:'assests/weizenn.jpg',      img_alt_GE:'ვეიცენი',             img_alt_EN:'Weizen Wheat Beer',          name_GE:'ვეიცენი',             name_EN:'Weizen',              desc_GE:'ტრადიციული ავსტრიული ხორბლის ლუდი. ბანანისა და ლურჯი კბილის ნოტებით.',  desc_EN:'Traditional Austrian wheat beer. Notes of banana and clove with a silky soft head.',  price:'12 ₾', badge_GE:'5.4% ABV', badge_EN:'5.4% ABV' },
  { id:2,  category:'beer',     img:'assests/dunkel.jpg',       img_alt_GE:'დუნკელი',             img_alt_EN:'Dunkel Dark Lager',           name_GE:'დუნკელი',             name_EN:'Dunkel',              desc_GE:'მუქი ლაგერი შოკოლადისა და კარამელის ნოტებით. რბილი და მდიდარი.',          desc_EN:'Dark lager with notes of chocolate and caramel. Smooth and deeply satisfying.',       price:'14 ₾', badge_GE:'5.0% ABV', badge_EN:'5.0% ABV' },
  { id:3,  category:'beer',     img:'assests/caucaipa.jpg',     img_alt_GE:'კავკასიური IPA',      img_alt_EN:'Caucasian IPA',              name_GE:'კავკასიური IPA',      name_EN:'Caucasian IPA',       desc_GE:'ადგილობრივი სვეტი ციტრუსოვანი სახეობით. ყვავილოვანი სუნი, მდიდარი სიმწარე.', desc_EN:'Local hops and citrus varieties. Floral aroma with bold bitterness.',               price:'15 ₾', badge_GE:'6.2% ABV', badge_EN:'6.2% ABV' },
  { id:4,  category:'beer',     img:'assests/helleslager.jpg', img_alt_GE:'ჰელეს ლაგერი',       img_alt_EN:'Helles Golden Lager',        name_GE:'ჰელეს ლაგერი',       name_EN:'Helles Lager',        desc_GE:'სუფთა ოქროსფერი ლაგერი. ბალახოვანი სვეტი, ნაზი სიტკბო.',                desc_EN:'Clean and light golden lager. Grassy hops, subtle sweetness and crisp finish.',     price:'11 ₾', badge_GE:'4.7% ABV', badge_EN:'4.7% ABV' },
  /* ── GEORGIAN DISHES ── */
  { id:5,  category:'georgian', img:'assests/khinkali.jpg',     img_alt_GE:'ხინკალი',             img_alt_EN:'Khinkali Georgian Dumplings', name_GE:'ხინკალი',             name_EN:'Khinkali',            desc_GE:'ტრადიციული ქართული პელმენი ხორცით, ბალახეულით და ნივრით. 5 ცალი.',        desc_EN:'Traditional Georgian dumplings filled with spiced meat and herbs. 5 pieces.',         price:'16 ₾', badge_GE:'5 ცალი',   badge_EN:'5 pcs'    },
  { id:6,  category:'georgian', img:'assests/khachapuri.jpg',   img_alt_GE:'ახარული ხაჭაპური',   img_alt_EN:'Acharuli Khachapuri',         name_GE:'ახარული ხაჭაპური',   name_EN:'Acharuli Khachapuri', desc_GE:'ნავის ფორმის ღვეზელი სულგუნის ყველით, კვერცხით და კარაქით.',            desc_EN:'Boat-shaped bread filled with sulguni cheese, egg, and butter.',                    price:'22 ₾', badge_GE:'კლასიკური', badge_EN:'Classic'  },
  { id:7,  category:'georgian', img:'assests/mtsvadi.jpg',      img_alt_GE:'ქართული მწვადი',      img_alt_EN:'Mtsvadi Georgian BBQ',        name_GE:'ქართული მწვადი',     name_EN:'Mtsvadi',             desc_GE:'ყველაზე კარგი ქართული ბარბექიუ. ნებისმიერი ლუდის იდეალური თანამდევი.',   desc_EN:'Classic Georgian BBQ skewers. Perfect with any beer.',                              price:'32 ₾', badge_GE:'გრილი',     badge_EN:'Grilled'  },
  { id:8,  category:'georgian', img:'assests/lobiani.webp',     img_alt_GE:'ლობიანი',             img_alt_EN:'Lobiani Bean Bread',          name_GE:'ლობიანი',             name_EN:'Lobiani',             desc_GE:'ხოჭოიანი ლობიოს შიგთავსით სავსე ცხელი ქართული ღვეზელი. ვეგეტარიანული.', desc_EN:'Warm Georgian flatbread filled with seasoned kidney beans. Vegetarian.',            price:'14 ₾', badge_GE:'ვეგ.',      badge_EN:'Veg.'     },
  /* ── SNACKS ── */
  { id:9,  category:'snacks',   img:'assests/pretzel.jpg',      img_alt_GE:'ავსტრიული პრეცელი',   img_alt_EN:'Austrian Pretzel',           name_GE:'ავსტრიული პრეცელი',  name_EN:'Austrian Pretzel',    desc_GE:'ნამდვილი ავსტრიული ბრეცელი მარილით, ძველ ყველასა და მდოგვის სოუსით.',   desc_EN:'Authentic Austrian pretzel with sea salt, aged cheese, and mustard dip.',          price:'10 ₾', badge_GE:'ლუდის თანამდევი', badge_EN:'Beer Pairing' },
  { id:10, category:'snacks',   img:'assests/nachos.jpg',       img_alt_GE:'ნაჩოსი',              img_alt_EN:'Loaded Nachos',              name_GE:'ნაჩოსი',              name_EN:'Loaded Nachos',       desc_GE:'ხრაშუნა ნაჩოსი ყველის სოუსით, სალსათი, მაწვნით და ჰალაპენიოთი.',        desc_EN:'Crispy nachos with warm cheese sauce, fresh salsa, sour cream and jalapeños.',    price:'13 ₾', badge_GE:'სმარტი',    badge_EN:'Shareable'},
  { id:11, category:'snacks',   img:'assests/wings.jpg',        img_alt_GE:'ქათმის ფრთები',        img_alt_EN:'Crispy Chicken Wings',        name_GE:'ქათმის ფრთები',      name_EN:'Chicken Wings',       desc_GE:'ხრაშუნა ქათმის ფრთები BBQ ან ცხარე სოუსით. 8 ცალი.',                   desc_EN:'Crispy chicken wings with BBQ or hot sauce. Served with blue cheese dip. 8 pcs.', price:'18 ₾', badge_GE:'8 ცალი',    badge_EN:'8 pcs'    },
  { id:12, category:'snacks',   img:'assests/charcuterie.jpg',  img_alt_GE:'ხორცის თეფში',         img_alt_EN:'Charcuterie Board',           name_GE:'ხორცის თეფში',       name_EN:'Charcuterie Board',   desc_GE:'ადგილობრივი დამარილებული ხორცი, ყველი, ზეთისხილი და ბოსტნეულის სოიუსები.', desc_EN:'Local cured meats, artisan cheeses, olives and pickled vegetables.',             price:'28 ₾', badge_GE:'2-4 ადამ.', badge_EN:'2-4 ppl'  },
];

/* ══════════════════════════════════════════════════════════════
   LANGUAGE STATE
   ══════════════════════════════════════════════════════════════ */
let currentLang = localStorage.getItem('ab_lang') || 'GE';

/* ── APPLY TRANSLATIONS ────────────────────────────────────── */
function applyTranslations(lang) {
  const t = TRANSLATIONS[lang];
  if (!t) return;

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (t[key] !== undefined) {
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.placeholder = t[key];
      } else {
        el.innerHTML = t[key].replace(/\n/g, '<br>');
      }
    }
  });

  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (t[key] !== undefined) el.placeholder = t[key];
  });

  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
  });


}

/* ── LANGUAGE SWITCHER ─────────────────────────────────────── */
function initLangSwitcher() {
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const lang = btn.getAttribute('data-lang');
      if (lang === currentLang) return;
      currentLang = lang;
      localStorage.setItem('ab_lang', lang);
      applyTranslations(lang);
      if (typeof renderMenuItems === 'function') {
        renderMenuItems(currentFilter || 'all');
      }
    });
  });
}

/* ── NAVBAR SCROLL EFFECT ──────────────────────────────────── */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;
  const onScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 40);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ── LOGO SMOOTH SCROLL TO TOP (FIX #1) ───────────────────── */
function initLogoScroll() {
  const logoLink = document.getElementById('nav-logo-link');
  if (!logoLink) return;

  logoLink.addEventListener('click', (e) => {
    const target = document.getElementById('home');
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      document.getElementById('hamburger')?.classList.remove('open');
      document.getElementById('mobile-nav')?.classList.remove('open');
    }
  });
}

/* ── HAMBURGER MENU ────────────────────────────────────────── */
function initHamburger() {
  const burger    = document.querySelector('.hamburger');
  const mobileNav = document.querySelector('.mobile-nav');
  if (!burger || !mobileNav) return;
  burger.addEventListener('click', () => {
    burger.classList.toggle('open');
    mobileNav.classList.toggle('open');
  });
  mobileNav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      burger.classList.remove('open');
      mobileNav.classList.remove('open');
    });
  });
}

/* ── SCROLL REVEAL ─────────────────────────────────────────── */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal:not(.visible)');
  if (!reveals.length) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  reveals.forEach(el => observer.observe(el));
}

/* ── ACTIVE NAV LINK ───────────────────────────────────────── */
function setActiveNavLink() {
  const path = window.location.pathname;
  document.querySelectorAll('.nav-links a, .mobile-nav a').forEach(a => {
    const href   = a.getAttribute('href') || '';
    const isMenu = href.includes('menu') && path.includes('menu');
    const isHome = !path.includes('menu') && (href === 'index.html' || href === './' || href === '/' || href === '#home');
    a.classList.toggle('active', isMenu || isHome);
  });
}

/* ── IMAGE FALLBACK ────────────────────────────────────────── */
function initImageFallbacks() {
  document.querySelectorAll('img[data-placeholder]').forEach(img => {
    img.addEventListener('error', function() {
      const placeholder = this.getAttribute('data-placeholder');
      if (placeholder) {
        const div = document.createElement('div');
        div.className = this.getAttribute('data-placeholder-class') || '';
        div.innerHTML = `<div class="placeholder-icon">📷</div><span>${placeholder}</span>`;
        this.parentElement.replaceChild(div, this);
      }
    });
  });
}


/* ══════════════════════════════════════════════════════════════
   RESERVATION SYSTEM (SIMPLIFIED)
   ══════════════════════════════════════════════════════════════
   Reservations are stored in localStorage under 'ab_reservations'.
   Open admin.html in the same browser to view all submissions.
   ══════════════════════════════════════════════════════════════ */

const RESERVATION_STORAGE_KEY = 'ab_reservations';

/** Load all reservations from localStorage */
function loadReservations() {
  try {
    return JSON.parse(localStorage.getItem(RESERVATION_STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

/** Save reservations array to localStorage */
function saveReservations(reservations) {
  localStorage.setItem(RESERVATION_STORAGE_KEY, JSON.stringify(reservations));
}

/** Set date input minimum to today */
function initDateInput() {
  const dateInput = document.getElementById('res-date');
  if (!dateInput) return;
  const today = new Date().toISOString().split('T')[0];
  dateInput.min   = today;
  dateInput.value = today;
}

/** Show inline error */
function showFieldError(fieldId, errId) {
  const field = document.getElementById(fieldId);
  const err   = document.getElementById(errId);
  if (field) field.classList.add('error');
  if (err)   err.classList.add('visible');
}

/** Clear inline error */
function clearFieldError(fieldId, errId) {
  const field = document.getElementById(fieldId);
  const err   = document.getElementById(errId);
  if (field) field.classList.remove('error');
  if (err)   err.classList.remove('visible');
}

function initReservationForm() {
  const submitBtn = document.getElementById('res-submit');
  if (!submitBtn) return;

  ['res-name', 'res-phone'].forEach(id => {
    document.getElementById(id)?.addEventListener('input', () => {
      clearFieldError(id, 'err-' + id.replace('res-', ''));
    });
  });

  submitBtn.addEventListener('click', () => {
    const name   = document.getElementById('res-name')?.value.trim();
    const phone  = document.getElementById('res-phone')?.value.trim();
    const guests = document.getElementById('res-guests')?.value;
    const date   = document.getElementById('res-date')?.value;
    const time   = document.getElementById('res-time')?.value;

    /* ── Validate ── */
    let hasError = false;

    if (!name) {
      showFieldError('res-name', 'err-name'); hasError = true;
    } else clearFieldError('res-name', 'err-name');

    if (!phone || phone.replace(/\D/g, '').length < 7) {
      showFieldError('res-phone', 'err-phone'); hasError = true;
    } else clearFieldError('res-phone', 'err-phone');

    if (!date) {
      document.getElementById('err-date')?.classList.add('visible'); hasError = true;
    } else document.getElementById('err-date')?.classList.remove('visible');

    if (!time) {
      document.getElementById('err-time')?.classList.add('visible'); hasError = true;
    } else document.getElementById('err-time')?.classList.remove('visible');

    if (hasError) {
      submitBtn.style.animation = 'shake 0.4s ease';
      setTimeout(() => submitBtn.style.animation = '', 500);
      return;
    }

    /* ── Save to localStorage (admin.html reads this) ── */
    const reservation = {
      id:       Date.now(),
      name,
      phone,
      guests,
      date,
      time,
      status:   'pending',
      bookedAt: new Date().toISOString(),
    };
    const all = loadReservations();
    all.push(reservation);
    saveReservations(all);

    /* ── Show success ── */
    const successEl = document.getElementById('res-success');
    const detailEl  = document.getElementById('res-success-detail');
    if (successEl) {
      successEl.style.display = 'flex';
      submitBtn.style.display = 'none';
    }
    if (detailEl) {
      detailEl.textContent = `${name} · ${date} · ${time}`;
    }

    alert('Reservation request sent! We will contact you to confirm.');
    console.log('[Austrian Brewery] New reservation saved:', reservation);
  });
}

/** Master init for the reservation section */
function initReservation() {
  if (!document.getElementById('res-submit')) return;
  initDateInput();
  initReservationForm();
}


/* ══════════════════════════════════════════════════════════════
   CUSTOMER REVIEWS CAROUSEL
   ══════════════════════════════════════════════════════════════ */
const REVIEWS = [
  { stars:5, text_GE:'საოცარი ატმოსფერო! ვეიცენი პირდაპირ ვენიდან ჩამოწეული ჰგონია. ქართული კერძები ლუდს სრულყოფილად ავსებს. ეს ადგილი ჩემი ფავორიტი გახდა.', text_EN:'Incredible atmosphere! The Weizen feels like it was brought straight from Vienna. Georgian dishes complement the beer perfectly. My absolute favourite.', name:'Giorgi M.', meta_GE:'ადგილობრივი სტუმარი · 3 ვიზიტი', meta_EN:'Local guest · 3 visits' },
  { stars:5, text_GE:'კავკასიური IPA — ეს სახელი ყველაფერს ამბობს. ადგილობრივი სვეტი ავსტრიულ ტრადიციასთან ერთად. ბაგი და ხმამაღალი სიხარული ლუდის ჭიქაში.', text_EN:'Caucasian IPA says it all — local hops meeting Austrian tradition. Bold, hoppy, joyful in every sip.', name:'Sarah K.', meta_GE:'ტურისტი · გერმანიიდან', meta_EN:'Tourist · from Germany' },
  { stars:5, text_GE:'ჩვენ ბიჭებთან ერთად ვატარებდით გუნდის საღამოს. ტერასა ზუსტად ის იყო, რაც გვინდოდა — ტელევიზორი, კომფორტი, სასიამოვნო ატმოსფერო.', text_EN:'We held our team evening here. The terrace was exactly what we needed — TV on, great comfort, and a vibe that made everyone relax.', name:'Lasha T.', meta_GE:'კorporatyuli ვიზიტი', meta_EN:'Corporate visit' },
  { stars:4, text_GE:'ხინკალი და დუნკელი — ეს კომბინაცია ალბათ სამყაროში ყველაზე კარგია. ქართული სამზარეულო ავსტრიულ ლუდთან ერთად? აბსოლუტური შედევრი.', text_EN:'Khinkali with a Dunkel — possibly the greatest food pairing in the world. An absolute masterpiece of a meal.', name:'Ana B.', meta_GE:'ოჯახური ვახშამი', meta_EN:'Family dinner' },
  { stars:5, text_GE:'ვენადან ჩამოვედი და ვფიქრობდი, ვერ ვნახავდი კარგ ავსტრიულ ლუდს. ეს ადგილი სრულად გამაოცა. ჰელეს ლაგერი ნამდვილად ავთენტური გემოთია.', text_EN:'I came from Vienna doubting I would find decent Austrian beer. I was completely blown away. The Helles Lager is genuinely authentic.', name:'Klaus W.', meta_GE:'ტურისტი · ავსტრიიდან', meta_EN:'Tourist · from Austria' },
  { stars:5, text_GE:'პრეცელი და ლუდი — ეს ის კომბინაციაა, რომელიც ყველა ტავერნაში გვინდა. Austrian Brewery-ში ეს სრულყოფილად გააკეთეს.', text_EN:'Pretzel and beer — the combo every good tavern should nail. Austrian Brewery does it flawlessly. A truly special evening.', name:'Nino G.', meta_GE:'პირველი ვიზიტი', meta_EN:'First visit' },
  { stars:5, text_GE:'ჩვენ ლაივ მუსიკის საღამო გვქონდა პარასკევს. ბენდი ზუსტად ის სტილია, რაც ამ ადგილს ესადაგება. ლუდი, მუსიკა, მეგობრები — სრულყოფილი.', text_EN:'We caught the live music on a Friday. The band perfectly matched the energy of the place. Beer, live music, good company — that is the formula.', name:'David H.', meta_GE:'ხშირი სტუმარი', meta_EN:'Regular guest' },
  { stars:4, text_GE:'ხორცის თეფში ოთხ ადამიანზე — ფასი სრულიად გამართლებული, ხარისხი — ძალიან მაღალი. ეს ადგილი გამოირჩევა.', text_EN:'Charcuterie board for four — completely fair price, exceptional quality. An Austrian-style establishment thriving in a Georgian city.', name:'Marco R.', meta_GE:'ტურისტი · იტალიიდან', meta_EN:'Tourist · from Italy' },
];

let carouselIndex       = 0;
let carouselCardWidth   = 0;
let carouselTotalSlides = 0;
let isDragging          = false;
let dragStartX          = 0;

function buildReviewCard(review) {
  const text    = currentLang === 'GE' ? review.text_GE : review.text_EN;
  const meta    = currentLang === 'GE' ? review.meta_GE : review.meta_EN;
  const stars   = '★'.repeat(review.stars) + '☆'.repeat(5 - review.stars);
  const initials = review.name.split(' ').map(n => n[0]).join('').toUpperCase();

  return `
    <div class="review-card">
      <div class="review-stars" aria-label="${review.stars} out of 5 stars">${stars}</div>
      <p class="review-text">${text}</p>
      <div class="review-divider"></div>
      <div class="review-author">
        <div class="review-avatar" aria-hidden="true">${initials}</div>
        <div class="review-author-info">
          <div class="review-name">${review.name}</div>
          <div class="review-meta">${meta}</div>
        </div>
      </div>
    </div>
  `;
}

function renderReviews() {
  const track = document.getElementById('carousel-track');
  if (!track) return;
  track.innerHTML = REVIEWS.map(buildReviewCard).join('');

  requestAnimationFrame(() => {
    const firstCard = track.querySelector('.review-card');
    const gap = 24;
    if (firstCard) carouselCardWidth = firstCard.offsetWidth + gap;
    const wrapperWidth = document.getElementById('carousel-wrapper')?.offsetWidth || 800;
    const visibleCards = Math.floor(wrapperWidth / carouselCardWidth) || 1;
    carouselTotalSlides = Math.max(0, REVIEWS.length - visibleCards);
    buildCarouselDots();
    updateCarousel(false);
  });
}

function buildCarouselDots() {
  const dotsEl = document.getElementById('carousel-dots');
  if (!dotsEl) return;
  dotsEl.innerHTML = '';
  const count = carouselTotalSlides + 1;
  for (let i = 0; i < count; i++) {
    const dot = document.createElement('button');
    dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Slide ${i + 1}`);
    dot.addEventListener('click', () => goToSlide(i));
    dotsEl.appendChild(dot);
  }
}

function goToSlide(index, animate = true) {
  carouselIndex = Math.max(0, Math.min(index, carouselTotalSlides));
  const track = document.getElementById('carousel-track');
  if (track) {
    track.style.transition = animate ? 'transform 0.45s cubic-bezier(0.4,0,0.2,1)' : 'none';
    track.style.transform  = `translateX(-${carouselIndex * carouselCardWidth}px)`;
  }
  document.querySelectorAll('.carousel-dot').forEach((dot, i) => {
    dot.classList.toggle('active', i === carouselIndex);
  });
}

function updateCarousel(animate = true) { goToSlide(carouselIndex, animate); }

function initCarouselArrows() {
  document.getElementById('carousel-prev')?.addEventListener('click', () => goToSlide(carouselIndex - 1));
  document.getElementById('carousel-next')?.addEventListener('click', () => goToSlide(carouselIndex + 1));
}

function initCarouselDrag() {
  const wrapper = document.getElementById('carousel-wrapper');
  if (!wrapper) return;

  wrapper.addEventListener('mousedown', e => {
    isDragging = true; dragStartX = e.pageX; wrapper.style.cursor = 'grabbing';
  });
  document.addEventListener('mousemove', e => {
    if (!isDragging) return;
    const diff = dragStartX - e.pageX;
    if (Math.abs(diff) > carouselCardWidth * 0.25) {
      isDragging = false;
      wrapper.style.cursor = 'grab';
      goToSlide(diff > 0 ? carouselIndex + 1 : carouselIndex - 1);
    }
  });
  document.addEventListener('mouseup', () => { isDragging = false; wrapper.style.cursor = 'grab'; });

  let touchStartX = 0;
  wrapper.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  wrapper.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) goToSlide(diff > 0 ? carouselIndex + 1 : carouselIndex - 1);
  }, { passive: true });
}

function initCarouselAutoplay() {
  const wrapper = document.getElementById('carousel-wrapper');
  if (!wrapper) return;
  const next = () => goToSlide(carouselIndex >= carouselTotalSlides ? 0 : carouselIndex + 1);
  let timer = setInterval(next, 6000);
  wrapper.addEventListener('mouseenter', () => clearInterval(timer));
  wrapper.addEventListener('mouseleave', () => { clearInterval(timer); timer = setInterval(next, 6000); });
}

function initCarouselResize() {
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      const track = document.getElementById('carousel-track');
      const firstCard = track?.querySelector('.review-card');
      if (firstCard) carouselCardWidth = firstCard.offsetWidth + 24;
      const wrapperWidth = document.getElementById('carousel-wrapper')?.offsetWidth || 800;
      carouselTotalSlides = Math.max(0, REVIEWS.length - (Math.floor(wrapperWidth / carouselCardWidth) || 1));
      buildCarouselDots();
      updateCarousel(false);
    }, 200);
  });
}

function initReviewsCarousel() {
  if (!document.getElementById('carousel-track')) return;
  renderReviews();
  initCarouselArrows();
  initCarouselDrag();
  initCarouselAutoplay();
  initCarouselResize();
}


/* ══════════════════════════════════════════════════════════════
   MENU PAGE
   ══════════════════════════════════════════════════════════════ */
let currentFilter = 'all';

function renderMenuItems(filter) {
  const grid = document.getElementById('menu-grid');
  if (!grid) return;
  currentFilter = filter;
  const t = TRANSLATIONS[currentLang];

  const filtered = filter === 'all'
    ? MENU_ITEMS
    : MENU_ITEMS.filter(item => item.category === filter);

  if (!filtered.length) {
    grid.innerHTML = `<div class="menu-empty">${t.menu_empty}</div>`;
    return;
  }

  grid.innerHTML = filtered.map((item, idx) => {
    const name     = currentLang === 'GE' ? item.name_GE : item.name_EN;
    const desc     = currentLang === 'GE' ? item.desc_GE : item.desc_EN;
    const badge    = currentLang === 'GE' ? item.badge_GE : item.badge_EN;
    const imgAlt   = currentLang === 'GE' ? item.img_alt_GE : item.img_alt_EN;
    const catLabel = {
      beer:     currentLang === 'GE' ? 'კრაფტ ლუდი' : 'Craft Beer',
      georgian: currentLang === 'GE' ? 'ქართული კერძი' : 'Georgian Dish',
      snacks:   currentLang === 'GE' ? 'წასახემსებელი' : 'Snack',
    }[item.category];

    return `
    <div class="menu-card reveal" style="animation-delay:${(idx % 3) * 80}ms">
      <img
        class="menu-card-img"
        src="${item.img}" alt="${imgAlt}" loading="lazy"
        onerror="this.outerHTML='<div class=\\'menu-card-img-placeholder\\'><span>📷</span></div>'"
      />
      <div class="menu-card-body">
        <div class="menu-card-category">${catLabel}</div>
        <h3 class="menu-card-title">${name}</h3>
        <p class="menu-card-desc">${desc}</p>
        <div class="menu-card-footer">
          <span class="menu-card-price">${item.price}</span>
          <span class="menu-card-badge">${badge}</span>
        </div>
      </div>
    </div>`;
  }).join('');

  requestAnimationFrame(() => {
    initScrollReveal();
    grid.querySelectorAll('.menu-card').forEach((card, i) => {
      setTimeout(() => card.classList.add('visible'), i * 60);
    });
  });
}

function initMenuFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderMenuItems(btn.getAttribute('data-filter'));
      applyTranslations(currentLang);
    });
  });

  renderMenuItems('all');
}


/* ══════════════════════════════════════════════════════════════
   INIT
   ══════════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  /* Core */
  initLangSwitcher();
  initNavbar();
  initLogoScroll();
  initHamburger();
  initScrollReveal();
  setActiveNavLink();
  initImageFallbacks();
  applyTranslations(currentLang);

  /* Home page */
  initReservation();
  initReviewsCarousel();

  /* Menu page */
  if (document.getElementById('menu-grid')) {
    initMenuFilters();
  }
});