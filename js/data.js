/* ==========================================================
   data.js  -  fixed content used by the whole site
   1. constants   2. starter (seed) data   3. Swahili dictionary
   ========================================================== */

/* ---------- 1. Constants ---------- */
const STORE_KEY   = 'pwani2';     // name used to save data in the browser (localStorage)
const BASE_RAISED = 480000;       // money raised before any donations made on this site
const GOAL        = 2000000;      // fundraising target (KES)
const ADMIN_PASS  = 'admin123';   // demo password (a real site checks this on a server)

// Pages in menu order: [file name, label]. Used by swipe, Guide and page titles.
const PAGE_ORDER = [
  ['index', 'Home'],   ['about', 'About'],         ['programs', 'Programs'], ['impact', 'Impact'],
  ['blog', 'Blog'],    ['volunteer', 'Volunteer'], ['donate', 'Donate'],     ['contact', 'Contact']
];

// One-sentence help text the Guide reads out on pages that have a form
const GUIDE_HELP = {
  volunteer: 'Pick a role, choose when you are free, then submit.',
  donate:    'Choose an amount, enter your name, then press Donate.',
  contact:   'Fill in each field in order, then press Send message.'
};

/* ---------- 2. Starter data (first visit or "Reset demo data") ---------- */
function seed() {
  return {
    posts: [
      { id: 1, t: "Accessible beaches: Mombasa's push for inclusive shorelines", c: 'Community',
        ex: 'Beach wheelchairs and ramps are opening up Nyali and Bamburi.',
        b: 'Volunteers mapped 14 public beach access points across Nyali, Bamburi and Shanzu. Three now have firm mats and two beach wheelchairs are available on weekends. Next: ramps and accessible toilets at every point.',
        d: '2026-09-20', l: 24 },
      { id: 2, t: "From Likoni to a shop of her own: Halima's story", c: 'Stories',
        ex: 'A micro-grant and sewing training changed everything.',
        b: 'Halima, 29, lives in Likoni. After our six-week tailoring course and a KES 30,000 start-up grant she runs a small shop and employs two neighbours.',
        d: '2026-09-11', l: 41 },
      { id: 3, t: 'Five ways Mombasa employers can hire inclusively', c: 'Business',
        ex: 'Practical, low-cost steps that widen your talent pool.',
        b: '1. Advertise roles in accessible formats. 2. Offer flexible interviews. 3. Budget for small adjustments. 4. Train supervisors. 5. Partner with us for vetted, skilled candidates.',
        d: '2026-08-30', l: 18 },
      { id: 4, t: 'Wellness Wednesdays: adaptive fitness at Mama Ngina', c: 'Health',
        ex: 'Seated yoga, swimming and physio every week.',
        b: 'Every Wednesday at 4pm, physiotherapists and peer coaches lead seated yoga, water therapy and stretching. It is free and carers are welcome.',
        d: '2026-08-14', l: 33 },
      { id: 5, t: 'Learning sign language: Swahili & KSL classes', c: 'Culture',
        ex: 'Open classes bridge the communication gap.',
        b: 'Kenyan Sign Language classes run Saturdays at our Old Town hub. Over 120 residents, including shopkeepers and matatu crews, have enrolled.',
        d: '2026-07-29', l: 15 }
    ],
    don: [   // donations: n = name, a = amount, m = method, d = date
      { n: 'Amina K.',          a: 2500,  m: 'M-Pesa', d: '2026-09-25' },
      { n: 'Coast Traders Ltd', a: 50000, m: 'Card',   d: '2026-09-18' },
      { n: 'Anonymous',         a: 1000,  m: 'M-Pesa', d: '2026-09-10' }
    ],
    msg: [   // contact messages
      { id: 1, ty: 'General', n: 'Fatma S.', e: 'fatma@example.com', t: 'Do you have a hub in Changamwe?', d: '2026-09-27' }
    ],
    vol: [   // volunteer applications: st = status
      { id: 1, n: 'Brian Otieno', e: 'brian@example.com', p: '0712000111', r: 'Peer coach', s: 'Nyali',
        k: ['Fitness'], a: ['Weekends'], w: 'I want to give back.', st: 'Approved', d: '2026-09-15' }
    ],
    sub: [],   // newsletter subscribers
    adm: 0     // 1 = admin is logged in
  };
}

/* ---------- 3. Swahili dictionary ----------
   Key = the English text exactly as written in the HTML / JS.
   Anything missing here simply stays in English. */
const SW = {
  // menu + tools
  'Home':'Nyumbani','About':'Kuhusu','Programs':'Programu','Impact':'Athari','Blog':'Blogu','Volunteer':'Jitolee',
  'Donate':'Changia','Contact':'Wasiliana','Admin':'Msimamizi','Read':'Soma','Voice':'Sauti','Guide':'Mwongozo',
  'Skip to content':'Ruka hadi maudhui','Switch language English Swahili':'Badilisha lugha',
  'Bigger text':'Maandishi makubwa','Smaller text':'Maandishi madogo','High contrast':'Utofautishaji wa juu',
  'Dark mode':'Hali ya giza','Menu':'Menyu','Main':'Kuu','Accessibility tools':'Zana za ufikiaji',
  // home
  'Every ability deserves a chance to grow.':'Kila uwezo unastahili nafasi ya kukua.',
  'We help persons with disabilities in Mombasa County reach better health, skills, jobs and independence.':'Tunawasaidia watu wenye ulemavu Kaunti ya Mombasa kupata afya, ujuzi, kazi na uhuru.',
  'Donate now':'Changia sasa','Invest with us':'Wekeza nasi','Become a volunteer':'Jitolee nasi',
  'members':'wanachama','in jobs or business':'kwenye ajira au biashara','devices provided':'vifaa vilivyotolewa','sub-counties':'kata ndogo',
  'What we do':'Tunachofanya','Learn more':'Jifunze zaidi','Read more':'Soma zaidi','Latest from the blog':'Habari mpya',
  'Fund goal':'Lengo la fedha','Inclusive Skills Hub, Nyali.':'Kituo cha Ujuzi Jumuishi, Nyali.','Inclusive Skills Hub, Nyali':'Kituo cha Ujuzi Jumuishi, Nyali',
  // programs
  'Health & Wellness':'Afya na Ustawi','Skills & Jobs':'Ujuzi na Kazi','Micro-grants & Business':'Ruzuku na Biashara','Assistive Devices':'Vifaa Saidizi',
  'Adaptive fitness, physiotherapy and peer mental-health circles.':'Mazoezi saidizi, tiba ya viungo na vikundi vya rika vya afya ya akili.',
  'Tailoring, ICT, tourism and hospitality training with job placement.':'Mafunzo ya ushonaji, TEHAMA, utalii na ukarimu pamoja na kupata kazi.',
  'Start-up grants and mentoring for disabled entrepreneurs.':'Ruzuku za kuanzisha biashara na ushauri kwa wajasiriamali wenye ulemavu.',
  'Wheelchairs, crutches, hearing aids and white canes, repaired or donated.':'Viti vya magurudumu, mikongojo, vifaa vya kusikia na fimbo nyeupe, vilivyokarabatiwa au kutolewa.',
  'Register interest':'Onyesha nia',
  // about
  'About us':'Kuhusu sisi','Mission':'Dhamira','Vision':'Maono','Our values':'Maadili yetu',
  'Pwani Inclusive began in 2019 when physiotherapists, teachers and people living with disabilities in Mombasa decided talent should never be limited by access.':'Pwani Inclusive ilianza mwaka 2019 wakati wataalamu wa tiba ya viungo, walimu na watu wanaoishi na ulemavu Mombasa walipoamua kipaji kisikwamishwe na ukosefu wa ufikiaji.',
  'To advance the wellness, dignity and economic growth of persons with disabilities on the Kenyan coast.':'Kuendeleza ustawi, utu na ukuaji wa kiuchumi wa watu wenye ulemavu katika pwani ya Kenya.',
  'A Mombasa where every street, workplace and classroom is open to all.':'Mombasa ambako kila barabara, mahali pa kazi na darasa liko wazi kwa wote.',
  'Nothing about us without us':'Hakuna kitu kutuhusu bila sisi','People with disabilities lead our programs.':'Watu wenye ulemavu huongoza programu zetu.',
  'Dignity':'Utu','Support that builds independence.':'Msaada unaojenga uhuru.',
  'Transparency':'Uwazi','Open books and public impact reports.':'Hesabu wazi na ripoti za athari kwa umma.',
  // impact
  'Impact & investment':'Athari na uwekezaji',
  'Every KES 1 invested returns an estimated KES 3.4 in earnings and savings (demo model).':'Kila KES 1 inayowekezwa hurudisha makadirio ya KES 3.4 kama mapato na akiba (mfano wa majaribio).',
  'placed or self-employed':'waliopata kazi au kujiajiri','earned by members, 2025':'zilizopatikana na wanachama, 2025',
  'Members reached per year':'Wanachama waliofikiwa kila mwaka','Investment opportunities':'Fursa za uwekezaji',
  'Initiative':'Mpango','Ask':'Kiasi kinachohitajika','Outcome':'Matokeo',
  'Assistive Device Lab':'Maabara ya Vifaa Saidizi','Accessible Transport Pilot':'Majaribio ya Usafiri Jumuishi',
  '600 trained, 70% employed / year':'Watu 600 wanafunzwa, 70% wanaajiriwa kwa mwaka',
  '1,500 devices repaired / year':'Vifaa 1,500 hukarabatiwa kwa mwaka',
  '4 adapted vans, 3,000 trips / month':'Magari 4 yaliyorekebishwa, safari 3,000 kwa mwezi',
  'Partner with us':'Shirikiana nasi','Request investor pack':'Omba kifurushi cha wawekezaji',
  // blog + post
  'Search posts…':'Tafuta makala…','All':'Zote','Health':'Afya','Skills':'Ujuzi','Stories':'Hadithi','Business':'Biashara',
  'Community':'Jamii','Culture':'Utamaduni','No posts found.':'Hakuna makala.','Back to blog':'Rudi kwenye blogu',
  'Like':'Penda','Share':'Shiriki','Link copied':'Kiungo kimenakiliwa','Already liked':'Umeshapenda','Post not found':'Makala haipatikani',
  // volunteer
  'Give a few hours, change a life. Choose a role below, or apply directly.':'Toa saa chache, badilisha maisha. Chagua nafasi hapa chini, au omba moja kwa moja.',
  'Volunteer roles':'Nafasi za kujitolea','Name':'Jina','Email':'Barua pepe','Phone':'Simu','Role':'Nafasi','Sub-county':'Kata ndogo',
  'Availability':'Upatikanaji','Weekdays':'Siku za wiki','Weekends':'Wikendi','Evenings':'Jioni',
  'Why do you want to volunteer?':'Kwa nini unataka kujitolea?','Submit application':'Tuma maombi',
  'Peer coach':'Kocha rika','Sign-language interpreter':'Mkalimani wa lugha ya ishara','Driver / escort':'Dereva / msindikizaji',
  'Skills trainer':'Mkufunzi wa ujuzi','Fundraiser':'Mchangishaji','Beach access mapper':'Mchoraji ramani ya fukwe zinazofikika',
  'Fitness':'Mazoezi','Sign language':'Lugha ya ishara','Driving':'Kuendesha','Teaching':'Kufundisha','ICT':'TEHAMA',
  'Fundraising':'Kuchangisha fedha','Counselling':'Ushauri nasaha','Photography':'Upigaji picha',
  // donate
  'Donate & support':'Changia na kusaidia','Amount (KES)':'Kiasi (KES)','Your name':'Jina lako','Method':'Njia',
  'Card':'Kadi','Bank transfer':'Uhamisho wa benki','Recent supporters':'Wafadhili wa hivi karibuni',
  'KES 2,500 = a month of physiotherapy':'KES 2,500 = mwezi mmoja wa tiba ya viungo',
  'KES 5,000 = a repaired wheelchair':'KES 5,000 = kiti cha magurudumu kilichokarabatiwa',
  'KES 30,000 = a micro-business':'KES 30,000 = biashara ndogo',
  'Demo only – no real payment is taken.':'Ya majaribio tu – hakuna malipo halisi yanayochukuliwa.',
  // contact
  'Message':'Ujumbe','Send message':'Tuma ujumbe','Mon–Sat, 8am–5pm':'Jumatatu–Jumamosi, 8am–5pm',
  // admin
  'Sign in':'Ingia','Password':'Nenosiri','Demo password: admin123':'Nenosiri la majaribio: admin123',
  'Overview':'Muhtasari','Posts':'Makala','Volunteers':'Wajitoleaji','Donations':'Michango','Messages':'Ujumbe','Settings':'Mipangilio',
  'raised':'zilizokusanywa','donations':'michango','volunteers':'wajitoleaji','posts':'makala','messages':'jumbe','subscribers':'wanaojiunga',
  'Title':'Kichwa','Category':'Aina','Summary':'Muhtasari','Body':'Maudhui','Publish':'Chapisha','Published':'Imechapishwa',
  'Status':'Hali','Approve':'Idhinisha','Delete':'Futa','Pending':'Inasubiri','Approved':'Imeidhinishwa','None':'Hakuna',
  'Subscribers':'Wanaojiunga','Reset demo data':'Weka upya data','Log out':'Toka','Wrong password':'Nenosiri si sahihi',
  'Reset all demo data?':'Weka upya data zote za majaribio?','Delete this item?':'Futa kipengee hiki?',
  // footer + messages
  'Explore':'Gundua','Get involved':'Shiriki','Newsletter':'Jarida','Subscribe':'Jiunge',
  'Wellness, skills and opportunity for persons with disabilities in Mombasa. Demo site, sample data.':'Ustawi, ujuzi na fursa kwa watu wenye ulemavu Mombasa. Tovuti ya majaribio, data ya mfano.',
  'Application received – thank you!':'Maombi yamepokelewa – asante!','Message sent – thank you!':'Ujumbe umetumwa – asante!',
  'Donation recorded – asante sana!':'Mchango umehifadhiwa – asante sana!','Subscribed!':'Umejiunga!','Stopped':'Imesimamishwa',
  // guide
  'You are on the':'Uko kwenye ukurasa wa','Use the top menu, or swipe left or right, to change page.':'Tumia menyu ya juu, au telezesha kushoto au kulia, kubadilisha ukurasa.',
  'Double-tap, or press R, to hear this page read aloud.':'Gusa mara mbili, au bonyeza R, kusikiliza ukurasa huu.',
  'Every button can be reached with the Tab key.':'Kila kitufe kinafikiwa kwa kitufe cha Tab.',
  'Fill in each field in order, then press Submit application.':'Jaza kila sehemu kwa mpangilio, kisha bonyeza Tuma maombi.',
  'Fill in each field in order, then press Send message.':'Jaza kila sehemu kwa mpangilio, kisha bonyeza Tuma ujumbe.',
  'Choose an amount, enter your name, then press Donate.':'Chagua kiasi, andika jina lako, kisha bonyeza Changia.',
  'Pick a role, choose when you are free, then submit.':'Chagua nafasi, chagua wakati ulio huru, kisha tuma.',
  'Close':'Funga','Next':'Ijayo','Back':'Nyuma','on':'imewashwa','off':'imezimwa'
};
