'use client';

import { useState, useEffect } from 'react';

const C = {
  navy: '#1A2A4A', navyDark: '#0f1520', navyMid: '#1e3055',
  gold: '#C9963A', goldLight: '#f0c060', goldPale: '#fff3cd',
  cream: '#F5F0E8', lightGray: '#E8EDF2', darkGray: '#445566',
  green: '#1A7A4A', red: '#C0392B', purple: '#5B3A8A', blue: '#065A82',
  white: '#ffffff',
};

const days = [
  {
    date: 'Wed, Aug 5', emoji: '✈️', title: 'Travel Day',
    color: C.blue, tag: 'Departure',
    events: [
      { time: 'AM', title: 'Depart Indianapolis (IND)', desc: 'Fly IND → connection hub (Chicago, Amsterdam, or Frankfurt) → Belgrade BEG. Total travel ~14–17 hrs. Book Air France, Lufthansa, or KLM.', cost: '—' },
      { time: 'Late Night', title: 'Arrive Belgrade Nikola Tesla Airport', desc: "Grab a Bolt to your hotel in Stari Grad or Vračar. Check in, decompress. You're here. 🇷🇸", cost: '~$20 Bolt' },
    ]
  },
  {
    date: 'Thu, Aug 6', emoji: '🏰', title: 'First Day in Belgrade',
    color: C.green, tag: 'Explore',
    events: [
      { time: '10:00 AM', title: 'Slow morning + Balkan breakfast', desc: 'Head to a local kafana for burek, kajmak, and thick Turkish coffee. This is what locals do.', cost: '~$5' },
      { time: '12:00 PM', title: 'Kalemegdan Fortress + Pobednik', desc: 'Walk the ancient fortress at the confluence of the Sava and Danube. Stunning views. Free entry. Allow 1.5–2 hrs.', cost: 'Free' },
      { time: '2:30 PM', title: 'Knez Mihailova & Skadarlija stroll', desc: "Belgrade's main pedestrian boulevard, then the bohemian cobblestone quarter. Browse, people-watch, grab a rakija.", cost: '~$5' },
      { time: '5:00 PM', title: 'Nikola Tesla Museum', desc: "One of Belgrade's best museums. Small but engaging with live demonstrations. Book ahead online.", cost: '~$5' },
      { time: '8:00 PM', title: 'Dinner at a traditional kafana', desc: 'Ćevapi, pljeskavica, roasted peppers, ajvar, fresh bread. Pair with local beer or wine.', cost: '~$18' },
      { time: '10:00 PM', title: 'Warm up in Savamala bars', desc: 'Bar hop through the street art-filled lanes of Savamala district. Low key. Early night before the big weekend.', cost: '~$15' },
    ]
  },
  {
    date: 'Fri, Aug 7', emoji: '🚣', title: 'Adventure Day + Welcome Party',
    color: C.green, tag: '⭐ Priority', starred: true,
    events: [
      { time: '9:00 AM', title: 'Great War Island Kayak Adventure', desc: '2-hr guided kayak around the Veliko Ratno Ostrvo nature reserve at the Sava/Danube confluence. No experience needed. Book via GetYourGuide or Serbia.com.', cost: '~$35', badge: 'Active' },
      { time: '1:00 PM', title: "Ada Ciganlija — Belgrade's Sea", desc: 'Swim in the 28°C Sava Lake (Blue Flag beach), rent bikes for the 8km lake loop, beach bars and kiosks for lunch. Arrive early for a good spot.', cost: '~$15', badge: 'Active' },
      { time: '5:00 PM', title: 'Hotel — Rest & Get Ready', desc: 'Return to hotel, shower, change into smart casual for the evening welcome party.', cost: '—' },
      { time: 'Evening', title: "Naomi & Filip's Wedding Welcome Party", desc: "Confirm venue with couple once announced. Serbian welcome parties are warm and festive with endless food, toasts, and live music.", cost: 'Gift 💝', badge: 'Priority' },
    ]
  },
  {
    date: 'Sat, Aug 8', emoji: '🎉', title: 'Explore & Full Send Night',
    color: C.purple, tag: 'Full Send',
    events: [
      { time: '10:00 AM', title: 'Kalenić Market (Kalenićeva Pijaca)', desc: "One of Belgrade's most beloved open-air markets in Vračar. Locals shop here every morning. Cheeses, honey, seasonal produce, flowers.", cost: '~$5' },
      { time: '12:30 PM', title: 'Danube River Cruise', desc: '1–2 hr sightseeing boat past Kalemegdan, Great War Island, and the Zemun quay. Scenic and relaxing.', cost: '~$18' },
      { time: '3:00 PM', title: 'Zemun walk & fish lunch', desc: 'Charming old Austro-Hungarian district with cobblestone lanes, Millennium Tower, and riverside kafanas serving fresh Danube fish.', cost: '~$20' },
      { time: '7:00 PM', title: 'Pre-game dinner + nap strategy', desc: "Light dinner. Nap if needed — clubs don't start until 1–2 AM. Dress: dark, simple, edgy for underground venues.", cost: '~$15' },
      { time: '1:30 AM', title: 'DRUGSTORE — Underground rave till sunrise', desc: "Belgrade's most iconic underground club. Former slaughterhouse in Palilula. Industrial techno, Funktion-One sound system, outdoor summer garden. Stay until the sun comes up.", cost: '€10–20 + drinks', badge: '🔥 Full Send' },
    ]
  },
  {
    date: 'Sun, Aug 9', emoji: '💍', title: 'The Wedding Day',
    color: C.gold, tag: '⭐⭐ Wedding', starred: true,
    events: [
      { time: '11:00 AM', title: 'Late rise, big breakfast, freshen up', desc: "You'll be home from Drugstore around 6–8 AM. Set alarms! Hydrate. Get your formal attire ready.", cost: '~$12', badge: '⚠️ Alarm' },
      { time: '2:00 PM', title: 'Wedding Ceremony — Church of Saint Sava', desc: "One of the largest Orthodox churches in the world, modeled on the Hagia Sophia. Shoulders and knees must be covered. Golden crowns placed on couple's heads; ritual walk three times around the altar. Absolutely stunning.", cost: '—', badge: '⭐ Priority' },
      { time: '4:00 PM+', title: 'Wedding Reception', desc: 'Serbian receptions are legendary — roasted lamb, veal, kajmak, endless toasts, and live music that can go until morning. Go with the flow.', cost: '—', badge: '🎊 Feast' },
    ]
  },
  {
    date: 'Mon, Aug 10', emoji: '🌊', title: 'Recovery & Splav Night',
    color: C.blue, tag: 'Splav Night',
    events: [
      { time: 'Late AM', title: 'Slow recovery morning', desc: 'Earned. Sleep in. Coffee on a terrace somewhere. Do nothing with intention.', cost: '~$5' },
      { time: '2:00 PM', title: 'Belgrade Waterfront promenade', desc: 'Stroll the renovated Sava Embankment — modern architecture, boutiques, and cafés. Stop at Beton Hala restaurant row for a late lunch with river views.', cost: '~$18' },
      { time: '5:00 PM', title: 'Dorćol neighborhood wander', desc: "Belgrade's trendiest district — Ottoman-era architecture, the Bajrakli Mosque, craft coffee shops, Dorćol Platz cultural center.", cost: '~$8' },
      { time: '10:00 PM', title: 'Splav Night — Sindikat or Leto', desc: 'Open-air floating clubs on the Sava River. Balkan pop, EDM, or urban electronic with stunning views of Kalemegdan. Entry with table service.', cost: '€30–50', badge: '🎶 Splav' },
    ]
  },
  {
    date: 'Tue, Aug 11', emoji: '🏠', title: 'Departure Day',
    color: C.darkGray, tag: 'Fly Home',
    events: [
      { time: 'AM', title: 'Final morning in Belgrade', desc: 'Last kafana coffee. Quick visit to Kalenić market or National Museum at Republic Square if time allows.', cost: '~$8' },
      { time: 'Midday', title: 'Transfer to Belgrade Nikola Tesla Airport (BEG)', desc: 'Allow 45–60 min to airport via Bolt. Check in early for international connection.', cost: '~$20 Bolt' },
      { time: 'Evening', title: 'Back in Indianapolis 🇺🇸', desc: 'Green card. Celebrated.', cost: '—' },
    ]
  },
];

const budget = [
  { label: '✈️ Flights (RT)', amount: '~$800', note: 'Air France / Lufthansa via hub', pct: 40, color: C.navy },
  { label: '🏨 Hotel (6 nights)', amount: '~$480', note: '~$80/night, Stari Grad / Vračar', pct: 24, color: C.gold },
  { label: '🍽️ Food & Drink', amount: '~$250', note: '~$35/day avg', pct: 13, color: C.green },
  { label: '🎉 Nightlife', amount: '~$150', note: 'Drugstore + splav + drinks', pct: 8, color: C.purple },
  { label: '🏄 Activities', amount: '~$120', note: 'Kayak, cruise, museum, bike', pct: 6, color: C.blue },
  { label: '🚗 Transport & Misc', amount: '~$100', note: 'Bolt, tips, souvenirs', pct: 5, color: C.darkGray },
];

const tips = [
  { icon: '📅', label: 'Book Now', text: 'Book the Great War Island kayak tour immediately via GetYourGuide — August slots fill fast. This is the #1 priority booking.', color: C.green },
  { icon: '🚗', label: 'Use Bolt', text: 'Download the Bolt app before you leave. Reliable local rideshare — much better than street taxis in Belgrade.', color: C.blue },
  { icon: '👔', label: 'Dress Code', text: 'Church of Saint Sava requires covered shoulders and knees. Pack a blazer or jacket for the wedding ceremony.', color: C.gold },
  { icon: '💵', label: 'Cash for Clubs', text: 'Drugstore club is cash only. Bring Serbian Dinars (RSD). ATMs are everywhere in Stari Grad and Savamala.', color: C.red },
  { icon: '🏖️', label: 'Beach Timing', text: 'Ada Ciganlija is extremely crowded on summer weekends. Arrive before 11 AM for a good beach spot. Sunscreen essential.', color: C.gold },
  { icon: '🌙', label: 'Club Timing', text: "Belgrade clubs don't start until 1–2 AM. Nap before Drugstore night — you'll want energy to stay until sunrise.", color: C.purple },
];

const badgeColors: Record<string, { bg: string; text: string }> = {
  'Active': { bg: '#1a4a2a', text: '#6ee8a0' },
  'Priority': { bg: '#4a3a00', text: '#f0c060' },
  '⭐ Priority': { bg: '#4a3a00', text: '#f0c060' },
  '🔥 Full Send': { bg: '#4a1010', text: '#ff9999' },
  '⚠️ Alarm': { bg: '#4a2800', text: '#ffb366' },
  '🎊 Feast': { bg: '#2a1a4a', text: '#c0a0ff' },
  '🎶 Splav': { bg: '#0a2a4a', text: '#80c8ff' },
};

function Badge({ label }: { label: string }) {
  const colors = badgeColors[label] || { bg: '#2a3a4a', text: '#aabbcc' };
  return (
    <span style={{ background: colors.bg, color: colors.text, fontSize: 10, fontFamily: 'Helvetica, sans-serif', padding: '2px 8px', borderRadius: 20, fontWeight: 600, whiteSpace: 'nowrap' as const, display: 'inline-block', marginLeft: 6 }}>
      {label}
    </span>
  );
}

function DayCard({ day, index }: { day: typeof days[0]; index: number }) {
  const [open, setOpen] = useState(index <= 1);
  return (
    <div style={{ background: '#141e30', border: '1px solid #1e3055', borderRadius: 12, marginBottom: 12, overflow: 'hidden' }}>
      <button onClick={() => setOpen(!open)} style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 20px', borderLeft: `4px solid ${day.color}` }}>
          <span style={{ fontSize: 26 }}>{day.emoji}</span>
          <div style={{ flex: 1, textAlign: 'left' }}>
            <div style={{ fontSize: 11, color: day.color, fontFamily: 'Helvetica, sans-serif', fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase' as const, marginBottom: 2 }}>{day.date}</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#e8edf2' }}>{day.title}</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {day.starred && (
              <span style={{ background: '#4a3a00', color: C.goldLight, fontSize: 10, fontFamily: 'Helvetica, sans-serif', fontWeight: 700, padding: '3px 9px', borderRadius: 20 }}>{day.tag}</span>
            )}
            <span style={{ color: C.gold, fontSize: 18, transition: 'transform .2s', display: 'inline-block', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}>⌄</span>
          </div>
        </div>
      </button>
      {open && (
        <div style={{ borderTop: '1px solid #1e3055' }}>
          {day.events.map((e, i) => (
            <div key={i} style={{ display: 'flex', gap: 14, padding: '12px 20px', borderBottom: i < day.events.length - 1 ? '1px solid #1a2840' : 'none', background: i % 2 === 0 ? 'transparent' : '#111825' }}>
              <div style={{ minWidth: 72, fontFamily: 'Helvetica, sans-serif', fontSize: 10, color: day.color, fontWeight: 700, paddingTop: 2, textTransform: 'uppercase' as const, letterSpacing: 0.5 }}>{e.time}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' as const, marginBottom: 4 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#e8edf2', fontFamily: 'Helvetica, sans-serif' }}>{e.title}</span>
                  {'badge' in e && e.badge && <Badge label={e.badge} />}
                </div>
                <p style={{ fontSize: 12, color: '#8899aa', fontFamily: 'Helvetica, sans-serif', lineHeight: 1.6, margin: 0 }}>{e.desc}</p>
              </div>
              <div style={{ minWidth: 60, textAlign: 'right' as const, fontSize: 11, color: C.goldLight, fontFamily: 'Helvetica, sans-serif', fontWeight: 600, paddingTop: 2, whiteSpace: 'nowrap' as const }}>{e.cost}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function BudgetBar({ item, i }: { item: typeof budget[0]; i: number }) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setWidth(item.pct), 300 + i * 100);
    return () => clearTimeout(t);
  }, [item.pct, i]);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
      <div style={{ width: 150, fontFamily: 'Helvetica, sans-serif', fontSize: 12, color: '#c8d4e0' }}>{item.label}</div>
      <div style={{ flex: 1, background: '#1e3055', borderRadius: 4, height: 20, overflow: 'hidden' }}>
        <div style={{ width: `${width}%`, background: item.color, height: '100%', borderRadius: 4, transition: 'width 0.8s ease', display: 'flex', alignItems: 'center', paddingLeft: 8 }}>
          {width > 10 && <span style={{ fontSize: 10, color: 'white', fontFamily: 'Helvetica, sans-serif', fontWeight: 700, opacity: 0.9 }}>{item.pct}%</span>}
        </div>
      </div>
      <div style={{ width: 60, textAlign: 'right' as const, fontFamily: 'Helvetica, sans-serif', fontSize: 13, fontWeight: 700, color: C.goldLight }}>{item.amount}</div>
      <div style={{ width: 200, fontFamily: 'Helvetica, sans-serif', fontSize: 10, color: '#667788' }}>{item.note}</div>
    </div>
  );
}

export default function BelgradePage() {
  const [activeTab, setActiveTab] = useState('itinerary');
  const tabs = [
    { id: 'itinerary', label: '📅 Itinerary' },
    { id: 'budget', label: '💰 Budget' },
    { id: 'tips', label: '📌 Tips' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#0f1520', color: '#e8edf2' }}>
      {/* Back link */}
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '24px 16px 0' }}>
        <a href="/travel" style={{ fontFamily: 'Helvetica, sans-serif', fontSize: 13, color: C.gold, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6, opacity: 0.8 }}>
          ← Back to Travel
        </a>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 16px 60px' }}>
        {/* Hero */}
        <div style={{ textAlign: 'center', padding: '48px 20px 40px', borderBottom: '1px solid #1e3055' }}>
          <div style={{ fontSize: 13, letterSpacing: 6, color: C.gold, fontFamily: 'Helvetica, sans-serif', fontWeight: 700, textTransform: 'uppercase' as const, marginBottom: 16 }}>
            Green Card Celebration
          </div>
          <h1 style={{ fontSize: 'clamp(36px, 8vw, 64px)', fontWeight: 700, letterSpacing: -1, lineHeight: 1.05, marginBottom: 14, margin: '0 0 14px' }}>
            <span style={{ color: '#e8edf2' }}>Belgrade</span><br />
            <span style={{ color: C.goldLight, fontStyle: 'italic' }}>2025</span>
          </h1>
          <p style={{ fontSize: 14, color: '#8899aa', fontFamily: 'Helvetica, sans-serif', letterSpacing: 3, marginBottom: 28 }}>
            AUGUST 5 – 11 &nbsp;•&nbsp; INDIANAPOLIS → SERBIA
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 10, flexWrap: 'wrap' as const }}>
            {[['✈️', 'IND → BEG'], ['🏨', 'Stari Grad Hotel'], ['💍', 'Naomi & Filip'], ['💰', '~$2,000']].map(([icon, label]) => (
              <div key={label} style={{ background: '#141e30', border: '1px solid #1e3055', borderRadius: 8, padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 6 }}>
                <span>{icon}</span>
                <span style={{ fontFamily: 'Helvetica, sans-serif', fontSize: 12, color: '#c8d4e0' }}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, padding: '20px 0 24px', borderBottom: '1px solid #1e3055', marginBottom: 24 }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '8px 20px', borderRadius: 8, border: 'none', cursor: 'pointer',
                fontFamily: 'Helvetica, sans-serif', fontSize: 13, fontWeight: 600, transition: 'all .2s',
                background: activeTab === tab.id ? C.gold : '#141e30',
                color: activeTab === tab.id ? C.navy : '#8899aa',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Itinerary */}
        {activeTab === 'itinerary' && (
          <div>
            <div style={{ marginBottom: 20, fontFamily: 'Helvetica, sans-serif', fontSize: 13, color: '#667788' }}>
              Click any day to expand or collapse its schedule.
            </div>
            {days.map((day, i) => <DayCard key={i} day={day} index={i} />)}
          </div>
        )}

        {/* Budget */}
        {activeTab === 'budget' && (
          <div>
            <h2 style={{ fontSize: 22, marginBottom: 6 }}>Budget breakdown</h2>
            <p style={{ fontFamily: 'Helvetica, sans-serif', fontSize: 13, color: '#667788', marginBottom: 28 }}>
              All costs are estimates. Belgrade is very affordable by European standards.
            </p>
            <div style={{ background: '#141e30', border: '1px solid #1e3055', borderRadius: 12, padding: '24px 24px 20px' }}>
              {budget.map((item, i) => <BudgetBar key={i} item={item} i={i} />)}
              <div style={{ borderTop: '1px solid #1e3055', marginTop: 16, paddingTop: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontFamily: 'Helvetica, sans-serif', fontSize: 12, color: '#667788', letterSpacing: 2, textTransform: 'uppercase' as const, marginBottom: 4 }}>Estimated Total</div>
                  <div style={{ fontSize: 30, fontWeight: 700, color: C.goldLight }}>~$1,900 – $2,200</div>
                </div>
                <div style={{ background: '#1e3a1e', border: '1px solid #1A7A4A', borderRadius: 8, padding: '10px 16px', textAlign: 'right' as const }}>
                  <div style={{ fontFamily: 'Helvetica, sans-serif', fontSize: 11, color: '#6ee8a0', marginBottom: 4 }}>Under $2–3K budget</div>
                  <div style={{ fontFamily: 'Helvetica, sans-serif', fontSize: 12, color: '#8899aa' }}>~$800–$1,100 buffer remaining</div>
                </div>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, marginTop: 20 }}>
              {budget.map((item, i) => (
                <div key={i} style={{ background: '#141e30', border: '1px solid #1e3055', borderRadius: 10, padding: '14px 16px' }}>
                  <div style={{ fontFamily: 'Helvetica, sans-serif', fontSize: 11, color: '#667788', marginBottom: 4 }}>{item.label}</div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: item.color, marginBottom: 2 }}>{item.amount}</div>
                  <div style={{ fontFamily: 'Helvetica, sans-serif', fontSize: 10, color: '#556677' }}>{item.note}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tips */}
        {activeTab === 'tips' && (
          <div>
            <h2 style={{ fontSize: 22, marginBottom: 6 }}>Coordinator&apos;s notes</h2>
            <p style={{ fontFamily: 'Helvetica, sans-serif', fontSize: 13, color: '#667788', marginBottom: 28 }}>
              Key things to know and do before you go.
            </p>
            <div style={{ display: 'grid', gap: 12 }}>
              {tips.map((tip, i) => (
                <div key={i} style={{ background: '#141e30', border: '1px solid #1e3055', borderLeft: `4px solid ${tip.color}`, borderRadius: 10, padding: '16px 20px', display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                  <span style={{ fontSize: 22, flexShrink: 0 }}>{tip.icon}</span>
                  <div>
                    <div style={{ fontFamily: 'Helvetica, sans-serif', fontSize: 11, fontWeight: 700, color: tip.color, letterSpacing: 1, textTransform: 'uppercase' as const, marginBottom: 4 }}>{tip.label}</div>
                    <p style={{ fontFamily: 'Helvetica, sans-serif', fontSize: 13, color: '#c8d4e0', lineHeight: 1.6, margin: 0 }}>{tip.text}</p>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 32, background: '#141e30', border: `1px solid ${C.gold}`, borderRadius: 12, padding: '24px', textAlign: 'center' as const }}>
              <div style={{ fontSize: 28, marginBottom: 10 }}>🇷🇸</div>
              <p style={{ fontSize: 17, fontStyle: 'italic', color: C.goldLight, marginBottom: 6 }}>Congratulations on your Green Card.</p>
              <p style={{ fontFamily: 'Helvetica, sans-serif', fontSize: 13, color: '#8899aa' }}>This trip is yours. Explore it fully.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
