const APP={liveMatches:[],upcomingMatches:[],recentResults:[],tournaments:[],standings:{},bracket:null,teams:[],matchDetail:null,loadedPages:{}};

/* ═══════════════════════════════════════
   MOCK DATA — BELIZE FOOTBALL SIMULATION
═══════════════════════════════════════ */
const MOCK = {
  liveMatches: [
    { id:1, tournament:'Orange Walk Premier League', tournament_name:'Orange Walk Premier League', round:'Week 8', status:'live', minute:67, home_score:2, away_score:1, venue:'People\'s Stadium, O.W.', date:'Mar 19', time:'7:30 PM',
      home:{name:'Corozal FC', code:'COR', city:'Corozal Town'}, away:{name:'Orange Walk United', code:'OWU', city:'Orange Walk'} },
    { id:2, tournament:'Belize Premier Football League', tournament_name:'Belize Premier Football League', round:'Matchday 12', status:'live', minute:34, home_score:0, away_score:0, venue:'FFB Stadium, Belmopan', date:'Mar 19', time:'9:00 PM',
      home:{name:'Belmopan Bandits', code:'BAN', city:'Belmopan'}, away:{name:'Altitude FC', code:'ALT', city:'San Ignacio'} }
  ],
  upcomingMatches: [
    { id:3, tournament:'Orange Walk District Cup', tournament_name:'Orange Walk District Cup', round:'Semifinal', status:'scheduled', home_score:null, away_score:null, venue:'Laguna Park, Corozal', date:'Mar 22', time:'4:00 PM',
      home:{name:'San Jose FC', code:'SJF', city:'San Jose Village'}, away:{name:'Yo Creek Ballers', code:'YCB', city:'Yo Creek'} },
    { id:4, tournament:'Belize Premier Football League', tournament_name:'BPFL', round:'Matchday 13', status:'scheduled', home_score:null, away_score:null, venue:'Marion Jones Stadium', date:'Mar 23', time:'7:00 PM',
      home:{name:'Verdes FC', code:'VER', city:'Benque Viejo'}, away:{name:'Belmopan Bandits', code:'BAN', city:'Belmopan'} },
    { id:5, tournament:'U16 Youth Cup', tournament_name:'U16 Youth Cup', round:'Quarterfinal', status:'scheduled', home_score:null, away_score:null, venue:'People\'s Stadium', date:'Mar 24', time:'3:00 PM',
      home:{name:'OW Youngsters', code:'OWY', city:'Orange Walk'}, away:{name:'Corozal Youth', code:'CYT', city:'Corozal'} },
    { id:6, tournament:'Orange Walk Premier League', tournament_name:'OW Premier League', round:'Week 9', status:'scheduled', home_score:null, away_score:null, venue:'People\'s Stadium', date:'Mar 26', time:'7:30 PM',
      home:{name:'Guinea Grass FC', code:'GGF', city:'Guinea Grass'}, away:{name:'San Estevan FC', code:'SEF', city:'San Estevan'} }
  ],
  recentResults: [
    { id:7, tournament:'Orange Walk Premier League', round:'Week 7', status:'confirmed', home_score:3, away_score:1, venue:'People\'s Stadium', date:'Mar 15', time:'7:30 PM',
      home:'Corozal FC', away:'Guinea Grass FC' },
    { id:8, tournament:'BPFL', round:'Matchday 11', status:'confirmed', home_score:2, away_score:2, venue:'FFB Stadium', date:'Mar 14', time:'9:00 PM',
      home:'Altitude FC', away:'Verdes FC' },
    { id:9, tournament:'OW District Cup', round:'QF', status:'confirmed', home_score:1, away_score:0, venue:'Laguna Park', date:'Mar 12', time:'4:00 PM',
      home:'San Jose FC', away:'Douglas FC' },
    { id:10, tournament:'BPFL', round:'Matchday 11', status:'confirmed', home_score:4, away_score:0, venue:'MCC Grounds', date:'Mar 12', time:'7:00 PM',
      home:'Belmopan Bandits', away:'Wagiya FC' },
    { id:11, tournament:'Orange Walk Premier League', round:'Week 7', status:'confirmed', home_score:0, away_score:2, venue:'People\'s Stadium', date:'Mar 11', time:'7:30 PM',
      home:'Yo Creek Ballers', away:'Orange Walk United' }
  ],
  tournaments: [
    { id:1, name:'Orange Walk Premier League 2026', division:'Division 1', age_group:'Senior', type:'league', status:'ongoing', teams_count:8, matches_played:28, matches_count:56, start_date:'Jan 10', end_date:'Apr 20', venue_location:'Orange Walk District', organizer:'OW Football Assoc.' },
    { id:2, name:'Belize Premier Football League 2026', division:'Division 1', age_group:'Senior', type:'league', status:'ongoing', teams_count:10, matches_played:54, matches_count:90, start_date:'Jan 5', end_date:'May 10', venue_location:'National', organizer:'Football Federation of Belize' },
    { id:3, name:'OW District Cup 2026', division:'Division 2', age_group:'Senior', type:'knockout', status:'ongoing', teams_count:8, matches_played:6, matches_count:7, start_date:'Feb 1', end_date:'Apr 5', venue_location:'Orange Walk & Corozal', organizer:'OW Football Assoc.' },
    { id:4, name:'U16 Youth Cup 2026', division:'Youth', age_group:'U16', type:'knockout', status:'ongoing', teams_count:8, matches_played:4, matches_count:7, start_date:'Mar 1', end_date:'Apr 15', venue_location:'Orange Walk District', organizer:'OW Youth Sports' },
    { id:5, name:'Northern Invitational 2025', division:'Division 1', age_group:'Senior', type:'league', status:'completed', teams_count:6, matches_played:30, matches_count:30, start_date:'Aug 1', end_date:'Nov 30', venue_location:'Northern Districts', organizer:'FFB North' },
    { id:6, name:'Christmas Classic 2025', division:'Open', age_group:'Senior', type:'knockout', status:'completed', teams_count:16, matches_played:15, matches_count:15, start_date:'Dec 20', end_date:'Dec 28', venue_location:'Orange Walk', organizer:'OW Municipality' }
  ],
  standings: {
    1: [
      {team_name:'Corozal FC',      code:'COR', village_city:'Corozal',     group_label:'A', played:7, won:6, drawn:1, lost:0, goals_for:18, goals_against:5,  goal_difference:13, points:19},
      {team_name:'Orange Walk Utd', code:'OWU', village_city:'Orange Walk', group_label:'A', played:7, won:4, drawn:2, lost:1, goals_for:12, goals_against:7,  goal_difference:5,  points:14},
      {team_name:'Guinea Grass FC', code:'GGF', village_city:'Guinea Grass',group_label:'A', played:7, won:3, drawn:1, lost:3, goals_for:9,  goals_against:10, goal_difference:-1, points:10},
      {team_name:'San Estevan FC',  code:'SEF', village_city:'San Estevan', group_label:'A', played:7, won:2, drawn:1, lost:4, goals_for:7,  goals_against:14, goal_difference:-7, points:7},
      {team_name:'San Jose FC',     code:'SJF', village_city:'San Jose',    group_label:'B', played:7, won:5, drawn:0, lost:2, goals_for:15, goals_against:8,  goal_difference:7,  points:15},
      {team_name:'Yo Creek Ballers',code:'YCB', village_city:'Yo Creek',    group_label:'B', played:7, won:4, drawn:1, lost:2, goals_for:11, goals_against:9,  goal_difference:2,  points:13},
      {team_name:'Douglas FC',      code:'DFC', village_city:'Douglas',     group_label:'B', played:7, won:1, drawn:2, lost:4, goals_for:6,  goals_against:12, goal_difference:-6, points:5},
      {team_name:'Shipyard United', code:'SHU', village_city:'Shipyard',    group_label:'B', played:7, won:0, drawn:1, lost:6, goals_for:3,  goals_against:16, goal_difference:-13,points:1}
    ]
  },
  bracket: {
    3: [
      { label:'QUARTERFINALS', matches:[
        { home:'Corozal FC',    home_score:2, away:'Douglas FC',       away_score:0, winner:'home', status:'confirmed' },
        { home:'San Jose FC',   home_score:1, away:'Yo Creek Ballers', away_score:1, winner:null,   status:'live', home_score_pen:4, away_score_pen:3 },
        { home:'OW United',     home_score:3, away:'Shipyard Utd',     away_score:1, winner:'home', status:'confirmed' },
        { home:'Guinea Grass',  home_score:null,away:'San Estevan',    away_score:null,winner:null, status:'scheduled' }
      ]},
      { label:'SEMIFINALS', matches:[
        { home:'Corozal FC',  home_score:null, away:'San Jose FC',   away_score:null, winner:null, status:'scheduled' },
        { home:'OW United',   home_score:null, away:'TBD',           away_score:null, winner:null, status:'scheduled' }
      ]},
      { label:'FINAL', matches:[
        { home:'TBD', home_score:null, away:'TBD', away_score:null, winner:null, status:'scheduled' }
      ]},
      { label:'CHAMPION', matches:[
        { champion:true }
      ]}
    ]
  },
  teams: [
    { id:1, team_name:'Corozal FC', code:'COR', village_city:'Corozal Town', division:'Division 1', coach_name:'Marco Aldana', played:14, won:11, drawn:2, players:[
      {full_name:'Kevin Muñoz',      jersey_number:1,  position:'GK'},
      {full_name:'Diego Requena',    jersey_number:3,  position:'DF'},
      {full_name:'Carlos Tzib',      jersey_number:5,  position:'DF'},
      {full_name:'Javier Mencias',   jersey_number:6,  position:'DF'},
      {full_name:'Luis Ek',          jersey_number:8,  position:'MF'},
      {full_name:'Bryan Choc',       jersey_number:10, position:'MF'},
      {full_name:'Omar Avilez',      jersey_number:11, position:'FW'},
      {full_name:'Wilmer Coc',       jersey_number:9,  position:'FW'},
    ]},
    { id:2, team_name:'Orange Walk United', code:'OWU', village_city:'Orange Walk Town', division:'Division 1', coach_name:'Ernesto Mag', played:14, won:8, drawn:3, players:[
      {full_name:'Anthony Baptist',  jersey_number:1,  position:'GK'},
      {full_name:'Joel Alamilla',    jersey_number:4,  position:'DF'},
      {full_name:'Ricardo Chan',     jersey_number:7,  position:'MF'},
      {full_name:'Elmer Guerrero',   jersey_number:10, position:'MF'},
      {full_name:'Marvin Tun',       jersey_number:9,  position:'FW'},
      {full_name:'Elvis Reyes',      jersey_number:11, position:'FW'},
    ]},
    { id:3, team_name:'Belmopan Bandits', code:'BAN', village_city:'Belmopan', division:'Division 1', coach_name:'Lionel Retreat', played:12, won:9, drawn:2, players:[
      {full_name:'Elroy Smith',      jersey_number:1,  position:'GK'},
      {full_name:'Deon McCaulay',    jersey_number:10, position:'FW'},
      {full_name:'Harrison Roches',  jersey_number:7,  position:'MF'},
      {full_name:'Ian Gaynair',      jersey_number:9,  position:'FW'},
      {full_name:'Marcos Sanchez',   jersey_number:5,  position:'DF'},
    ]},
    { id:4, team_name:'Altitude FC', code:'ALT', village_city:'San Ignacio', division:'Division 1', coach_name:'Pedro Umul', played:12, won:5, drawn:4, players:[
      {full_name:'Gilroy Thurton',   jersey_number:1,  position:'GK'},
      {full_name:'Brandon Tillett',  jersey_number:8,  position:'MF'},
      {full_name:'Lennox Castillo',  jersey_number:11, position:'FW'},
      {full_name:'Dale Pelayo',      jersey_number:4,  position:'DF'},
    ]},
    { id:5, team_name:'Verdes FC', code:'VER', village_city:'Benque Viejo', division:'Division 1', coach_name:'Rodrigo Orellano', played:12, won:7, drawn:3, players:[
      {full_name:'Woodrow West',     jersey_number:1,  position:'GK'},
      {full_name:'Nana Mensah',      jersey_number:10, position:'FW'},
      {full_name:'Evan Mariano',     jersey_number:6,  position:'MF'},
      {full_name:'Christopher Avila',jersey_number:3,  position:'DF'},
    ]},
    { id:6, team_name:'Yo Creek Ballers', code:'YCB', village_city:'Yo Creek Village', division:'Division 2', coach_name:'Hipolito Cano', played:7, won:4, drawn:1, players:[
      {full_name:'Santos Cano',      jersey_number:1,  position:'GK'},
      {full_name:'Felix Moh',        jersey_number:9,  position:'FW'},
      {full_name:'Rene Avilez',      jersey_number:7,  position:'MF'},
      {full_name:'Gilberto Murillo', jersey_number:5,  position:'DF'},
    ]},
    { id:7, team_name:'Guinea Grass FC', code:'GGF', village_city:'Guinea Grass Village', division:'Division 1', coach_name:'Armando Novelo', played:7, won:3, drawn:1, players:[
      {full_name:'Junior Palma',     jersey_number:1,  position:'GK'},
      {full_name:'Elvin Camal',      jersey_number:11, position:'FW'},
      {full_name:'Nelson Patt',      jersey_number:8,  position:'MF'},
    ]},
    { id:8, team_name:'San Estevan FC', code:'SEF', village_city:'San Estevan Village', division:'Division 2', coach_name:'Rogelio Teck', played:7, won:2, drawn:1, players:[
      {full_name:'Marcelino Chan',   jersey_number:1,  position:'GK'},
      {full_name:'Aldrin Morales',   jersey_number:10, position:'FW'},
      {full_name:'Rolando Cob',      jersey_number:6,  position:'MF'},
    ]}
  ],
  matchDetails: {
    1: { id:1, tournament:'Orange Walk Premier League', round:'Week 8', status:'live', minute:67, home_score:2, away_score:1, venue:"People's Stadium, O.W.", date:'Mar 19, 2026', time:'7:30 PM',
      home:{name:'Corozal FC',        code:'COR', city:'Corozal Town'},
      away:{name:'Orange Walk United', code:'OWU', city:'Orange Walk'},
      events:[
        {minute:12, event_type:'goal',        player_name:'Omar Avilez',     description:'Right foot shot, bottom left corner',  team_name:'Corozal FC'},
        {minute:28, event_type:'yellow_card', player_name:'Joel Alamilla',   description:'Dangerous foul on midfield',           team_name:'OW United'},
        {minute:39, event_type:'goal',        player_name:'Marvin Tun',      description:'Header from corner kick',              team_name:'OW United'},
        {minute:54, event_type:'yellow_card', player_name:'Carlos Tzib',     description:'Time wasting',                         team_name:'Corozal FC'},
        {minute:61, event_type:'goal',        player_name:'Wilmer Coc',      description:'Low drive from outside the box ⚽🔥',   team_name:'Corozal FC'},
        {minute:66, event_type:'red_card',    player_name:'Elvis Reyes',     description:'Second yellow — reckless tackle',      team_name:'OW United'},
      ]
    },
    2: { id:2, tournament:'Belize Premier Football League', round:'Matchday 12', status:'live', minute:34, home_score:0, away_score:0, venue:'FFB Stadium, Belmopan', date:'Mar 19, 2026', time:'9:00 PM',
      home:{name:'Belmopan Bandits', code:'BAN', city:'Belmopan'},
      away:{name:'Altitude FC',      code:'ALT', city:'San Ignacio'},
      events:[
        {minute:8,  event_type:'yellow_card', player_name:'Dale Pelayo',     description:'Foul on Deon McCaulay',                team_name:'Altitude FC'},
        {minute:22, event_type:'yellow_card', player_name:'Harrison Roches', description:'Simulation',                           team_name:'Belmopan Bandits'},
      ]
    },
    3: { id:3, tournament:'OW District Cup', round:'Semifinal', status:'scheduled', home_score:null, away_score:null, venue:'Laguna Park, Corozal', date:'Mar 22, 2026', time:'4:00 PM',
      home:{name:'San Jose FC',     code:'SJF', city:'San Jose Village'},
      away:{name:'Yo Creek Ballers', code:'YCB', city:'Yo Creek'},
      events:[]
    },
    4: { id:4, tournament:'Belize Premier Football League', round:'Matchday 13', status:'scheduled', home_score:null, away_score:null, venue:'Marion Jones Stadium', date:'Mar 23, 2026', time:'7:00 PM',
      home:{name:'Verdes FC',          code:'VER', city:'Benque Viejo'},
      away:{name:'Belmopan Bandits',   code:'BAN', city:'Belmopan'},
      events:[]
    },
    7: { id:7, tournament:'Orange Walk Premier League', round:'Week 7', status:'confirmed', home_score:3, away_score:1, venue:"People's Stadium", date:'Mar 15, 2026', time:'7:30 PM',
      home:{name:'Corozal FC',      code:'COR', city:'Corozal Town'},
      away:{name:'Guinea Grass FC', code:'GGF', city:'Guinea Grass'},
      events:[
        {minute:9,  event_type:'goal',        player_name:'Omar Avilez',  description:'Tap-in from close range',       team_name:'Corozal FC'},
        {minute:33, event_type:'goal',        player_name:'Elvin Camal',  description:'Long range effort',             team_name:'Guinea Grass FC'},
        {minute:58, event_type:'goal',        player_name:'Wilmer Coc',   description:'Penalty kick — VAR review',    team_name:'Corozal FC'},
        {minute:82, event_type:'goal',        player_name:'Bryan Choc',   description:'Counter attack finish',         team_name:'Corozal FC'},
      ]
    },
    8: { id:8, tournament:'BPFL', round:'Matchday 11', status:'confirmed', home_score:2, away_score:2, venue:'FFB Stadium', date:'Mar 14, 2026', time:'9:00 PM',
      home:{name:'Altitude FC', code:'ALT', city:'San Ignacio'},
      away:{name:'Verdes FC',   code:'VER', city:'Benque Viejo'},
      events:[
        {minute:15, event_type:'goal', player_name:'Lennox Castillo', description:'Brilliant solo goal', team_name:'Altitude FC'},
        {minute:37, event_type:'goal', player_name:'Nana Mensah',     description:'Header — corner',     team_name:'Verdes FC'},
        {minute:60, event_type:'goal', player_name:'Evan Mariano',    description:'Free kick — top bin', team_name:'Verdes FC'},
        {minute:89, event_type:'goal', player_name:'Brandon Tillett', description:'Injury time equaliser!', team_name:'Altitude FC'},
      ]
    }
  }
};

/* ── SIMULATED LIVE TICKER: minute increments every 30s ── */
function startLiveSimulation() {
  setInterval(() => {
    APP.liveMatches.forEach(m => {
      if (m.status === 'live' && m.minute < 90) {
        m.minute += 1;
        if (MOCK.matchDetails[m.id]) MOCK.matchDetails[m.id].minute = m.minute;
      }
    });
    // Re-render ticker if on home page
    buildTicker();
    // Update live cards
    const lmlEl = document.getElementById('liveMatchList');
    if (lmlEl && APP.liveMatches.length) {
      lmlEl.innerHTML = APP.liveMatches.map(matchCardHTML).join('');
          }
  }, 30000);
}

/* ── MOCK FETCH FUNCTIONS ── */
const fetchLive = async () => {
  await new Promise(r => setTimeout(r, 150));
  APP.liveMatches = MOCK.liveMatches;
  return APP.liveMatches;
};
const fetchUpcoming = async () => {
  await new Promise(r => setTimeout(r, 100));
  APP.upcomingMatches = MOCK.upcomingMatches;
  return APP.upcomingMatches;
};
const fetchRecent = async () => {
  await new Promise(r => setTimeout(r, 100));
  APP.recentResults = MOCK.recentResults;
  return APP.recentResults;
};
const fetchTournaments = async () => {
  await new Promise(r => setTimeout(r, 120));
  APP.tournaments = MOCK.tournaments;
  return APP.tournaments;
};
const fetchStandings = async (id) => {
  await new Promise(r => setTimeout(r, 100));
  const data = MOCK.standings[id] || [];
  APP.standings[id] = data;
  return data;
};
const fetchBracket = async (id) => {
  await new Promise(r => setTimeout(r, 100));
  const rounds = MOCK.bracket[id] || [];
  APP.bracket = rounds;
  return rounds;
};
const fetchTeams = async () => {
  await new Promise(r => setTimeout(r, 120));
  APP.teams = MOCK.teams;
  return APP.teams;
};
const fetchMatchDetail = async (id) => {
  await new Promise(r => setTimeout(r, 80));
  const detail = MOCK.matchDetails[id] || {
    id, tournament:'Orange Walk Premier League', round:'—', status:'confirmed',
    home_score: 0, away_score: 0, venue:'People\'s Stadium', date:'—', time:'—',
    home:{name:'Home Team', code:'HME', city:'—'}, away:{name:'Away Team', code:'AWY', city:'—'},
    events:[]
  };
  APP.matchDetail = detail;
  return detail;
};

async function navigate(page,btn){
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b=>b.classList.remove('active'));
  const pg=document.getElementById('page-'+page);
  if(pg)pg.classList.add('active');
  if(btn)btn.classList.add('active');
  window.scrollTo(0,0);
  if(!APP.loadedPages[page]){
    try{
      if(page==='tournaments')await buildTournaments();
      else if(page==='standings'){if(!APP.tournaments.length)await fetchTournaments();const t=APP.tournaments.find(t=>t.status==='ongoing')||APP.tournaments[0];if(t)await buildStandings(t.id);}
      else if(page==='bracket'){if(!APP.tournaments.length)await fetchTournaments();const t=APP.tournaments.find(t=>t.id===3)||APP.tournaments.find(t=>t.status==='ongoing')||APP.tournaments[0];if(t)await buildBracket(t.id);}
      else if(page==='teams')await renderTeams();
      APP.loadedPages[page]=true;
    }catch(e){}
  }
}

async function buildTicker(){
  const items=[...APP.liveMatches.map(m=>{const h=m.home?.name||m.home_team||'Home',a=m.away?.name||m.away_team||'Away';return`<span style="display:inline-block;width:7px;height:7px;background:var(--red);border-radius:50%;margin-right:5px;vertical-align:middle;animation:blink 1s infinite"></span>LIVE  ${h} <b>${m.home_score}–${m.away_score}</b> ${a} · ${m.minute||'...'}′`}),...APP.recentResults.map(r=>{const h=r.home||r.home_team||'Home',a=r.away||r.away_team||'Away';return`FT  ${h} <b>${r.home_score}–${r.away_score}</b> ${a}`}),...APP.upcomingMatches.map(m=>{const h=m.home?.name||m.home_team||'Home',a=m.away?.name||m.away_team||'Away';return`<svg style="width:11px;height:11px;vertical-align:middle;opacity:.7;margin-right:3px" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>${m.date} ${m.time}  ${h} vs ${a}`})];
  const doubled=[...items,...items];
  document.getElementById('tickerTrack').innerHTML=doubled.map(i=>`<span class="ticker-item"><span class="ticker-score">${i}</span></span>`).join('');
}

function centerHTML(m){
  const hasScore = m.status !== 'scheduled';
  if(hasScore){
    const isLive = m.status === 'live';
    if(isLive){
      return`<div class="mc-center">
        <div class="mc-score live">${m.home_score}<span style="opacity:.3;margin:0 4px">–</span>${m.away_score}</div>
        <div class="mc-live-min"><svg style="width:11px;height:11px;vertical-align:middle;margin-right:2px" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>${m.minute||'...'}′</div>
      </div>`;
    }
    return`<div class="mc-center"><div class="mc-score">${m.home_score}<span style="opacity:.3;margin:0 4px">–</span>${m.away_score}</div></div>`;
  }
  return`<div class="mc-center"><div class="vs-container"><div class="vs-word">VS</div><div class="vs-kickoff"><div class="vs-kickoff-date">${m.date||''}</div><div class="vs-kickoff-time">${m.time||''}</div></div></div></div>`;
}

// ══════════════════════════════════════════════════════════
//  FLAME ENGINE v4 — fires emit from digit outline pixels
// ══════════════════════════════════════════════════════════
// flame canvas removed — replaced with CSS score display

async function buildHome(){
  document.getElementById('liveCount').textContent='Loading…';
  document.getElementById('liveMatchList').innerHTML=`<div class="empty"><div class="icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg></div><p>Loading matches…</p></div>`;
  document.getElementById('upcomingMatchList').innerHTML=`<div class="empty"><div class="icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg></div><p>Loading…</p></div>`;
  const[live,upcoming,recent]=await Promise.all([fetchLive(),fetchUpcoming(),fetchRecent()]);
  document.getElementById('liveCount').textContent=live.length+' match'+(live.length!==1?'es':'');
  document.getElementById('liveMatchList').innerHTML=live.length?live.map(matchCardHTML).join(''):`<div class="empty"><div class="icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/><path d="M2 12h20"/></svg></div><p>No live matches right now</p></div>`;
  document.getElementById('upcomingMatchList').innerHTML=upcoming.length?upcoming.map(matchCardHTML).join(''):`<div class="empty"><div class="icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg></div><p>No upcoming matches scheduled</p></div>`;
  document.getElementById('recentResultsSidebar').innerHTML=recent.length?recent.map(r=>`<div class="qr" onclick="openMatchDetail(${r.id})"><div class="qr-teams">${r.home||r.home_team}<br><small style="color:var(--off)">${r.away||r.away_team}</small></div><div class="qr-score">${r.home_score}–${r.away_score}</div></div>`).join(''):`<div style="padding:16px;text-align:center;font-size:12px;color:var(--off)">No recent results</div>`;
  // Mobile recent results — same data as sidebar but as full match cards
  const recentMatchListEl = document.getElementById('recentMatchList');
  if(recentMatchListEl) recentMatchListEl.innerHTML=recent.length?recent.map(r=>{
    const h=r.home||r.home_team||'',a=r.away||r.away_team||'';
    const hc=h.substring(0,3).toUpperCase(),ac=a.substring(0,3).toUpperCase();
    const hk=KITS[hc.charCodeAt(0)%KITS.length],ak=KITS[ac.charCodeAt(0)%KITS.length];
    return`<div class="match-card" onclick="openMatchDetail(${r.id})">
      <div class="mc-top"><span class="mc-league">${r.tournament||''}</span><span class="mc-round">${r.round||''}</span><span class="mc-status confirmed"><svg style="width:12px;height:12px;vertical-align:middle;margin-right:3px" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>FT</span></div>
      <div class="mc-body">
        <div class="mc-team"><div class="mc-kit ${hk}">${hc}</div><div><div class="mc-team-name">${h}</div></div></div>
        <div class="mc-center"><div class="mc-score">${r.home_score}<span style="opacity:.3;margin:0 2px">–</span>${r.away_score}</div></div>
        <div class="mc-team away"><div class="mc-kit ${ak}">${ac}</div><div><div class="mc-team-name">${a}</div></div></div>
      </div>
    </div>`;
  }).join(''):``;
  document.getElementById('thisWeekSidebar').innerHTML=upcoming.length?upcoming.slice(0,4).map(m=>{const h=m.home?.name||m.home_team||'',a=m.away?.name||m.away_team||'';return`<div class="up-item"><div class="up-date">${m.date}<br>${m.time}</div><div class="up-teams" style="font-family:'Barlow Condensed',sans-serif;font-size:14px;font-weight:800">${h}<br><span style="color:var(--off);font-weight:600">vs ${a}</span></div></div>`}).join(''):`<div style="padding:16px;text-align:center;font-size:12px;color:var(--off)">No upcoming matches</div>`;
  await buildTicker();
}

const KITS=['kit-a','kit-b','kit-c','kit-d','kit-e','kit-f','kit-g','kit-h'];
function matchCardHTML(m){
  const h=m.home?.name||m.home_team||'',a=m.away?.name||m.away_team||'';
  const hc=(m.home?.code||h).substring(0,3).toUpperCase(),ac=(m.away?.code||a).substring(0,3).toUpperCase();
  const hk=KITS[hc.charCodeAt(0)%KITS.length],ak=KITS[ac.charCodeAt(0)%KITS.length];
  const isLive=m.status==='live';
  return`<div class="match-card ${isLive?'live':''}" onclick="openMatchDetail(${m.id})">
    <div class="mc-top"><span class="mc-league">${m.tournament||m.tournament_name||''}</span><span class="mc-round">${m.round||''}</span><span class="mc-status ${m.status}">${isLive?'<span class="live-dot"></span>LIVE':m.status==='confirmed'?'<svg style="width:12px;height:12px;vertical-align:middle;margin-right:3px" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>FT':m.status==='played'?'FT':'<svg style="width:12px;height:12px;vertical-align:middle;margin-right:3px" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>'+(m.time||'')}</span></div>
    <div class="mc-body">
      <div class="mc-team"><div class="mc-kit ${hk}">${hc}</div><div><div class="mc-team-name">${h}</div><div class="mc-team-city">${m.home?.city||''}</div></div></div>
      ${centerHTML(m)}
      <div class="mc-team away"><div class="mc-kit ${ak}">${ac}</div><div><div class="mc-team-name">${a}</div><div class="mc-team-city">${m.away?.city||''}</div></div></div>
    </div>
    <div class="mc-foot"><svg style="width:12px;height:12px;vertical-align:middle;margin-right:4px;opacity:.6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>${m.venue||'—'}</div>
  </div>`;
}

async function buildTournaments(){
  document.getElementById('tournamentGrid').innerHTML=`<div class="empty" style="grid-column:1/-1"><div class="icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg></div><p>Loading…</p></div>`;
  await fetchTournaments();filterT('all',document.querySelector('.filter-btn'));
}
function filterT(f,btn){
  document.querySelectorAll('.filter-btn').forEach(b=>b.classList.remove('active'));
  if(btn)btn.classList.add('active');
  const data=f==='all'?APP.tournaments:APP.tournaments.filter(t=>t.status===f);
  document.getElementById('tournamentGrid').innerHTML=data.length?data.map(t=>{
    const sc={ongoing:'c-blue',upcoming:'c-gold',completed:'c-green',cancelled:'c-red'}[t.status]||'';
    return`<div class="tourn-card" onclick="openTournamentStandings(${t.id})">
      <div class="tc-banner"><div class="tc-icon">${t.type==='league'?'<svg style="width:22px;height:22px" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2z"/></svg>':'<svg style="width:22px;height:22px" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5"/><line x1="13" x2="19" y1="19" y2="13"/><line x1="16" x2="20" y1="16" y2="20"/><line x1="19" x2="21" y1="21" y2="19"/><polyline points="14.5 6.5 18 3 21 3 21 6 17.5 9.5"/><line x1="5" x2="9" y1="14" y2="18"/><line x1="7" x2="4" y1="17" y2="20"/><line x1="3" x2="5" y1="19" y2="21"/></svg>'}</div><div class="tc-info"><h3>${t.name}</h3><div class="chips"><span class="chip ${sc}">${t.status.toUpperCase()}</span><span class="chip">${t.division}</span><span class="chip">${t.age_group}</span><span class="chip">${t.type}</span></div></div></div>
      <div class="tc-stats"><div class="ts"><div class="v">${t.teams_count}</div><div class="l">Teams</div></div><div class="ts"><div class="v">${t.matches_played}</div><div class="l">Played</div></div><div class="ts"><div class="v">${t.matches_count-t.matches_played}</div><div class="l">Left</div></div></div>
      <div class="tc-foot"><span><svg style="width:11px;height:11px;vertical-align:middle;margin-right:3px;opacity:.7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>${t.start_date} → ${t.end_date}</span><span class="view-btn">View →</span></div>
    </div>`;}).join(''):`<div class="empty" style="grid-column:1/-1"><div class="icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg></div><p>No tournaments found</p></div>`;
}
async function openTournamentStandings(id){
  if(id===3||id===4||id===6){navigate('bracket',document.querySelector('[data-page=bracket]'));await buildBracket(id);}
  else{const s=await fetchStandings(id);if(s&&s.length){navigate('standings',document.querySelector('[data-page=standings]'));await buildStandings(id);}else{navigate('bracket',document.querySelector('[data-page=bracket]'));await buildBracket(id);}}
}

async function buildStandings(activeId){
  const tabsEl=document.getElementById('standingsTabs'),contentEl=document.getElementById('standingsContent');
  tabsEl.innerHTML='';contentEl.innerHTML='';
  if(!APP.tournaments.length)await fetchTournaments();
  const t=APP.tournaments.find(t=>t.id==activeId);
  if(!t){contentEl.innerHTML='<div class="empty"><div class="icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg></div><p>Tournament not found</p></div>';return}
  const standings=await fetchStandings(activeId);
  tabsEl.innerHTML=APP.tournaments.filter(t=>APP.standings[t.id]?.length).map(t=>`<button class="st-tab ${t.id==activeId?'active':''}" onclick="buildStandings(${t.id})">${t.name.replace(/ 202[0-9]/g,'')}</button>`).join('');
  if(!standings?.length){contentEl.innerHTML='<div class="empty"><div class="icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" x2="12" y1="20" y2="10"/><line x1="18" x2="18" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="16"/></svg></div><p>No standings available yet</p></div>';return}
  const groups={};
  standings.forEach(s=>{const g=s.group_label||'A';if(!groups[g])groups[g]=[];groups[g].push({team:s.team_name,code:(s.code||s.team_name).substring(0,3).toUpperCase(),city:s.village_city||'—',P:s.played,W:s.won,D:s.drawn,L:s.lost,GF:s.goals_for,GA:s.goals_against,GD:s.goal_difference,Pts:s.points,form:[]})});
  contentEl.innerHTML=`<div class="groups-grid">${Object.entries(groups).map(([g,rows])=>`<div><div class="gl-head"><span class="gl-badge">GROUP ${g}</span><span class="gl-sub">Top 2 qualify</span></div><table class="st-table"><thead><tr><th>#</th><th>Team</th><th class="c">P</th><th class="c">W</th><th class="c">D</th><th class="c">L</th><th class="c">GF</th><th class="c">GA</th><th class="c">GD</th><th class="c">Pts</th><th>Form</th></tr></thead><tbody>${rows.map((r,i)=>`<tr class="${i<2?'qualify':i===rows.length-1&&rows.length>3?'eliminate':''}"><td><span class="rank-n ${i===0?'r1':i===1?'r2':i===2?'r3':''}">${i+1}</span></td><td><div class="t-cell"><div class="t-av kit-a">${r.code}</div><div><div class="t-nm">${r.team}</div><div class="t-cy">${r.city}</div></div></div></td><td class="c">${r.P}</td><td class="c">${r.W}</td><td class="c">${r.D}</td><td class="c">${r.L}</td><td class="c">${r.GF}</td><td class="c">${r.GA}</td><td class="gd ${r.GD>0?'pos':r.GD<0?'neg':''}">${r.GD>0?'+':''}${r.GD}</td><td class="pts">${r.Pts}</td><td><div class="form-row">${r.form.map(f=>`<div class="fd ${f}">${f}</div>`).join('')}</div></td></tr>`).join('')}</tbody></table></div>`).join('')}</div>`;
}

async function buildBracket(id){
  const c=document.getElementById('bracketView');
  c.innerHTML=`<div class="empty"><div class="icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg></div><p>Loading bracket…</p></div>`;
  const bracket=await fetchBracket(id);
  if(!bracket?.length){c.innerHTML=`<div class="empty"><div class="icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" x2="12" y1="20" y2="10"/><line x1="18" x2="18" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="16"/></svg></div><p>No bracket available</p></div>`;return}
  c.innerHTML=bracket.map(round=>`<div class="bracket-round"><div class="round-hdr">${round.label}</div><div class="bracket-matches">${round.matches.map(m=>{if(m.champion)return`<div class="bm champion" style="display:flex;align-items:center;justify-content:center;padding:22px;text-align:center"><div><div style="font-size:32px;margin-bottom:6px;color:var(--gold)"><svg style="width:36px;height:36px" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2z"/></svg></div><div style="font-family:'Barlow Condensed',sans-serif;font-size:13px;font-weight:900;letter-spacing:.12em;color:var(--gold)">CHAMPION</div><div style="font-size:12px;color:var(--off);margin-top:4px">TBD</div></div></div>`;const hw=m.winner==='home',aw=m.winner==='away';return`<div class="bm"><div class="bm-row ${hw?'W':''} ${!m.home?'tbd':''}">${m.home?`<div class="bm-av kit-a">${(m.home?.code||m.home||'?').substring(0,3)}</div><span>${m.home}</span>`:'<span>TBD</span>'}${m.home_score!=null?`<span class="bm-score">${m.home_score}</span>`:''}</div><div class="bm-row ${aw?'W':''} ${!m.away?'tbd':''}">${m.away?`<div class="bm-av kit-c">${(m.away?.code||m.away||'?').substring(0,3)}</div><span>${m.away}</span>`:'<span>TBD</span>'}${m.away_score!=null?`<span class="bm-score">${m.away_score}</span>`:''}</div></div>`;}).join('')}</div></div>`).join('');
}

async function renderTeams(){
  const gridEl=document.getElementById('teamsGrid'),countEl=document.getElementById('teamsCount');
  if(!APP.teams.length){gridEl.innerHTML=`<div class="empty" style="grid-column:1/-1"><div class="icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg></div><p>Loading teams…</p></div>`;try{await fetchTeams()}catch{gridEl.innerHTML=`<div class="empty" style="grid-column:1/-1"><div class="icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg></div><p>Could not load teams</p></div>`;return}}
  const q=document.getElementById('teamSearch').value.toLowerCase();
  const div=document.getElementById('divisionFilter').value;
  const filtered=APP.teams.filter(t=>{const mq=!q||t.team_name.toLowerCase().includes(q)||(t.village_city||'').toLowerCase().includes(q)||(t.coach_name||'').toLowerCase().includes(q);const md=!div||t.division===div;return mq&&md});
  countEl.textContent=filtered.length+' team'+(filtered.length!==1?'s':'');
  gridEl.innerHTML=filtered.length?filtered.map(t=>{
    const code=(t.code||t.team_name).substring(0,3).toUpperCase();
    const kit=KITS[code.charCodeAt(0)%KITS.length];
    const players=t.players||[];
    const posLabel={FW:'FW',MF:'MF',DF:'DF',GK:'GK'};
    return`<div class="team-card" onclick="toggleTeam(this)">
      <div class="tc-strip"><div class="tc-av ${kit}">${code}</div><div class="tc-info"><h3>${t.team_name}</h3><p>${t.village_city||'—'} · ${t.division||''}</p><p style="font-size:11px;margin-top:2px;color:var(--off)">Coach: ${t.coach_name||'—'}</p></div><button class="tc-toggle">▼</button></div>
      <div class="tc-stats"><div class="tc-stat"><div class="v">${t.played||0}</div><div class="l">Played</div></div><div class="tc-stat"><div class="v">${t.won||0}</div><div class="l">Won</div></div><div class="tc-stat"><div class="v">${t.drawn||0}</div><div class="l">Drawn</div></div></div>
      <div class="player-panel"><div class="pp-inner"><div class="pp-title"><svg style="width:13px;height:13px;vertical-align:middle;margin-right:5px" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>Squad — ${players.length} Players</div>${players.length?players.map(p=>`<div class="p-row"><div class="jersey">${p.jersey_number||'—'}</div><div class="p-name">${p.full_name}</div><span class="pos-badge pos-${p.position}">${posLabel[p.position]||p.position}</span></div>`).join(''):`<div style="font-size:13px;color:var(--off);padding:8px 0;font-family:'Barlow Condensed',sans-serif;font-weight:700;letter-spacing:.06em;text-transform:uppercase">No players listed</div>`}</div></div>
    </div>`;
  }).join(''):`<div class="empty" style="grid-column:1/-1"><div class="icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg></div><p>No teams match your search</p></div>`;
}

function toggleTeam(card){card.classList.toggle('open')}
function handleSearch(q){
  if(!q){ document.getElementById('searchResults').style.display='none'; return; }
  const ql=q.toLowerCase();
  // Search across teams AND all matches
  const allMatches=[...APP.liveMatches,...APP.upcomingMatches,...APP.recentResults];
  const matchHits=allMatches.filter(m=>{
    const h=(m.home?.name||m.home_team||m.home||'').toLowerCase();
    const a=(m.away?.name||m.away_team||m.away||'').toLowerCase();
    const t=(m.tournament||m.tournament_name||'').toLowerCase();
    const v=(m.venue||'').toLowerCase();
    return h.includes(ql)||a.includes(ql)||t.includes(ql)||v.includes(ql);
  });
  const teamHits=(APP.teams||[]).filter(t=>
    (t.team_name||'').toLowerCase().includes(ql)||(t.village_city||'').toLowerCase().includes(ql)
  );
  const sr=document.getElementById('searchResults');
  if(!matchHits.length&&!teamHits.length){ sr.innerHTML='<div class="sr-empty">No results for "'+q+'"</div>'; sr.style.display='block'; return; }
  let html='';
  if(matchHits.length){
    html+='<div class="sr-section">Matches</div>';
    html+=matchHits.slice(0,5).map(m=>{
      const h=m.home?.name||m.home_team||m.home||'',a=m.away?.name||m.away_team||m.away||'';
      const score=m.home_score!=null?`<strong>${m.home_score}–${m.away_score}</strong>`:'vs';
      const badge=m.status==='live'?'<span class="sr-live">LIVE</span>':'';
      return`<div class="sr-row" onclick="closeSR();openMatchDetail(${m.id})">${badge}<span class="sr-teams">${h} ${score} ${a}</span><span class="sr-meta">${m.tournament||''}</span></div>`;
    }).join('');
  }
  if(teamHits.length){
    html+='<div class="sr-section">Teams</div>';
    html+=teamHits.slice(0,4).map(t=>`<div class="sr-row" onclick="closeSR();navigate('teams',document.querySelector('[data-page=teams]'));syncMobileNav(document.querySelector('#mobileNav [data-page=teams]'));document.getElementById('teamSearch').value='${t.team_name}';renderTeams()"><span class="sr-teams">${t.team_name}</span><span class="sr-meta">${t.village_city||''} · ${t.division||''}</span></div>`).join('');
  }
  sr.innerHTML=html; sr.style.display='block';
}
function closeSR(){ document.getElementById('searchResults').style.display='none'; document.getElementById('globalSearch').value=''; }
document.addEventListener('click',e=>{ if(!e.target.closest('.search-wrap')) closeSR(); });

function syncMobileNav(activeBtn){
  if(!activeBtn) return;
  document.querySelectorAll('.mnav-btn').forEach(b=>b.classList.remove('active'));
  activeBtn.classList.add('active');
  // trigger bounce animation restart
  const icon=activeBtn.querySelector('.mnav-icon');
  if(icon){icon.style.animation='none';void icon.offsetWidth;icon.style.animation=''}
}

const _origNavigate = navigate;
navigate = async function(page, btn) {
  // If already on this page, just scroll to top (active tab feedback)
  const currentActive = document.querySelector('.page.active');
  if(currentActive && currentActive.id === 'page-' + page) {
    window.scrollTo({top:0, behavior:'smooth'});
    return;
  }
  await _origNavigate(page, btn);
  const mBtn = document.querySelector(`#mobileNav [data-page="${page}"]`);
  if(mBtn) syncMobileNav(mBtn);
  const dBtn = document.querySelector(`#mainNav [data-page="${page}"]`);
  if(dBtn){ document.querySelectorAll('.nav-btn').forEach(b=>b.classList.remove('active')); dBtn.classList.add('active'); }
};

/* ══════════════════════════════════════
   BACKGROUND PARTICLE STAR FIELD
══════════════════════════════════════ */
function initBgParticles(){}

/* ═══════════════════════ ICON SYSTEM ═══════════════════════ */
const ICONS = {
  ball: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/><path d="M2 12h20"/></svg>`,
  search: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>`,
  trophy: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2z"/></svg>`,
  barChart: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" x2="12" y1="20" y2="10"/><line x1="18" x2="18" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="16"/></svg>`,
  swords: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5"/><line x1="13" x2="19" y1="19" y2="13"/><line x1="16" x2="20" y1="16" y2="20"/><line x1="19" x2="21" y1="21" y2="19"/><polyline points="14.5 6.5 18 3 21 3 21 6 17.5 9.5"/><line x1="5" x2="9" y1="14" y2="18"/><line x1="7" x2="4" y1="17" y2="20"/><line x1="3" x2="5" y1="19" y2="21"/></svg>`,
  users: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
  mapPin: `<svg class="icon icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`,
  calendar: `<svg class="icon icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>`,
  clock: `<svg class="icon icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
  zap: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
  check: `<svg class="icon icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>`,
  loader: `<svg class="icon icon-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>`,
  xCircle: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>`,
  goal: `<svg class="icon icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/><path d="M2 12h20"/></svg>`,
  yellowCard: `<svg class="icon icon-sm" viewBox="0 0 24 24" fill="#ffcc00" stroke="#c9a000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="2"/></svg>`,
  redCard: `<svg class="icon icon-sm" viewBox="0 0 24 24" fill="#ff2d55" stroke="#cc0033" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="2"/></svg>`,
  arrowLeft: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>`,
  refresh: `<svg class="icon icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/></svg>`,
  award: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>`,
};

document.addEventListener('DOMContentLoaded',()=>{ buildHome(); startLiveSimulation(); });


/* ═══════════════════════════════════════════════════
   CLASH ENGINE v3 — fire trails + canvas charge + impact
════════════════════════════════════════════════════ */

// Called from match cards — finds data then fires clash
function openMatchDetail(id) {
  _doOpenMatchDetail(id);
}

// The real page-building function (no clash)
async function _doOpenMatchDetail(id) {
  document.getElementById('matchDetailContent').innerHTML=`<div class="empty"><div class="icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg></div><p>Loading match details…</p></div>`;
  // show match page
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b=>b.classList.remove('active'));
  const pg=document.getElementById('page-match');
  if(pg) pg.classList.add('active');
  window.scrollTo(0,0);
  try {
    await fetchMatchDetail(id);
    const m = APP.matchDetail;
    const h = m.home?.name||m.homeTeam||'Home', a = m.away?.name||m.awayTeam||'Away';
    const hc = (m.home?.code||h).substring(0,3).toUpperCase();
    const ac = (m.away?.code||a).substring(0,3).toUpperCase();
    const hk = KITS[hc.charCodeAt(0)%KITS.length];
    const ak = KITS[ac.charCodeAt(0)%KITS.length];
    const evIcons = {
      goal: '<svg style="width:15px;height:15px;vertical-align:middle" viewBox="0 0 24 24" fill="none" stroke="#00e87a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/><path d="M2 12h20"/></svg>',
      own_goal: '<svg style="width:15px;height:15px;vertical-align:middle" viewBox="0 0 24 24" fill="none" stroke="#ff2d55" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>',
      yellow_card: '<svg style="width:11px;height:15px;vertical-align:middle" viewBox="0 0 24 24" fill="#ffcc00" stroke="#c9a000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="2"/></svg>',
      red_card: '<svg style="width:11px;height:15px;vertical-align:middle" viewBox="0 0 24 24" fill="#ff2d55" stroke="#cc0033" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="2"/></svg>',
      penalty: '<svg style="width:15px;height:15px;vertical-align:middle" viewBox="0 0 24 24" fill="none" stroke="#00e87a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/><path d="M2 12h20"/></svg>',
      substitution: '<svg style="width:15px;height:15px;vertical-align:middle" viewBox="0 0 24 24" fill="none" stroke="#4d9fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/></svg>',
    };
    document.getElementById('matchDetailContent').innerHTML=`
      <div class="detail-hero">
        <div class="dh-tourn">${m.tournament||''} · ${m.round||''}</div>
        <div class="dh-teams">
          <div class="dh-team"><div class="dh-av ${hk}">${hc}</div><div class="dh-name">${h}</div><div class="dh-city">${m.home?.city||''}</div></div>
          <div>
            <div class="dh-score ${m.status==='live'?'live':''}">${m.home_score??0}–${m.away_score??0}</div>
            <div style="text-align:center;margin-top:8px"><span class="mc-status ${m.status}" style="font-size:11px;display:inline-block">${m.status==='confirmed'?'<svg style="width:11px;height:11px;vertical-align:middle;margin-right:3px" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>FT':m.status==='live'?`<span class="live-dot"></span>LIVE ${m.minute||''}′`:m.status}</span></div>
          </div>
          <div class="dh-team"><div class="dh-av ${ak}">${ac}</div><div class="dh-name">${a}</div><div class="dh-city">${m.away?.city||''}</div></div>
        </div>
        <div class="dh-info"><span><svg style="width:12px;height:12px;vertical-align:middle;margin-right:4px;opacity:.7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>${m.venue||''}</span><span><svg style="width:12px;height:12px;vertical-align:middle;margin-right:4px;opacity:.7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>${m.date||''} · ${m.time||''}</span></div>
      </div>
      <div class="timeline-wrap">
        <div class="sh" style="margin-bottom:16px"><div class="sh-accent"></div><h2>Match Timeline</h2></div>
        <div class="tl">${(m.events||[]).length ? (m.events||[]).map(e=>`
          <div class="tl-ev ${e.event_type||e.type||''}">
            <div class="tl-min">${e.minute||e.min||''}′</div>
            <div class="tl-icon">${evIcons[e.event_type||e.type]||'•'}</div>
            <div class="tl-info"><div class="tl-player">${e.player_name||e.player||'—'}</div><div class="tl-desc">${e.description||e.desc||''}</div></div>
            <span class="tl-team">${e.team_name||e.team||''}</span>
          </div>`).join('') : '<div style="padding:20px;text-align:center;color:var(--off);font-family:Barlow Condensed,sans-serif;font-weight:700;letter-spacing:.08em;text-transform:uppercase;font-size:13px">No events yet</div>'}
        </div>
      </div>`;
  } catch(e) {
    document.getElementById('matchDetailContent').innerHTML=`<div class="empty"><div class="icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg></div><p>Could not load match details</p></div>`;
  }
}

// clash engine removed

function _dismissClash(matchId) {
  const ov = document.getElementById('clashOverlay');
  if(ov._stop) ov._stop();
  ov.style.transition='opacity .35s ease';
  ov.style.opacity='0';
  setTimeout(()=>{
    ov.style.display='none';
    ov.onclick=null;
    ov.style.transition='';
    if(matchId!=null) _doOpenMatchDetail(matchId);
  }, 360);
}