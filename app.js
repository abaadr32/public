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
      requestAnimationFrame(bootFlameCanvases);
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
      const scoreText = `${m.home_score} – ${m.away_score}`;
      return`<div class="mc-center">
        <div class="flame-score-wrap">
          <canvas class="flame-canvas" data-score="${scoreText}" width="160" height="120" aria-hidden="true"></canvas>
          <div class="flame-score-aria" aria-label="${scoreText}"></div>
        </div>
        <div class="mc-live-min">⏱ ${m.minute||'...'}′</div>
      </div>`;
    }
    return`<div class="mc-center"><div class="mc-score">${m.home_score}<span style="opacity:.3;margin:0 2px">–</span>${m.away_score}</div></div>`;
  }
  return`<div class="mc-center"><div class="vs-container"><div class="vs-word">VS</div><div class="vs-kickoff"><div class="vs-kickoff-date">${m.date||''}</div><div class="vs-kickoff-time">${m.time||''}</div></div></div></div>`;
}

// ══════════════════════════════════════════════════════════
//  FLAME ENGINE v4 — fires emit from digit outline pixels
// ══════════════════════════════════════════════════════════
function bootFlameCanvases(){
  document.querySelectorAll('.flame-canvas').forEach(cvs=>{
    if(cvs._flameRunning) return;
    cvs._flameRunning = true;

    const W = cvs.width, H = cvs.height;
    const score = cvs.dataset.score || '0 – 0';
    const ctx = cvs.getContext('2d');

    // ── 1. SAMPLE DIGIT OUTLINE POINTS ───────────────────
    // Use an offscreen canvas to render the text, then find edge pixels
    const off = document.createElement('canvas');
    off.width = W; off.height = H;
    const octx = off.getContext('2d');

    const FONT_SIZE = 52;
    octx.clearRect(0, 0, W, H);
    octx.fillStyle = '#fff';
    octx.font = `${FONT_SIZE}px 'Black Han Sans', sans-serif`;
    octx.textAlign = 'center';
    octx.textBaseline = 'middle';
    octx.fillText(score, W/2, H * 0.62);  // sit in lower half so flames go up

    // Find all edge pixels (non-transparent pixel adjacent to transparent)
    const idata = octx.getImageData(0, 0, W, H);
    const px = idata.data;
    const edgePoints = [];
    const stride = 4;
    for(let y = 1; y < H-1; y++){
      for(let x = 1; x < W-1; x++){
        const i = (y*W + x) * stride;
        if(px[i+3] > 60){  // opaque pixel
          // check 4-neighbors for transparency
          const n = (( (y-1)*W + x  ) * stride)+3;
          const s = (( (y+1)*W + x  ) * stride)+3;
          const ww= (( y    *W + x-1) * stride)+3;
          const e = (( y    *W + x+1) * stride)+3;
          if(px[n]<60 || px[s]<60 || px[ww]<60 || px[e]<60){
            edgePoints.push({x, y});
          }
        }
      }
    }

    // ── 2. PARTICLE POOL ──────────────────────────────────
    const particles = [];
    let frameN = 0;

    function spawnFromEdge(){
      // Pick 14–18 random edge points each frame and spawn fire there
      const count = 14 + Math.floor(Math.random()*6);
      for(let i=0;i<count;i++){
        if(!edgePoints.length) break;
        const pt = edgePoints[Math.floor(Math.random()*edgePoints.length)];

        const layer = Math.random();
        let size, vy, col, life, vx;

        if(layer < 0.35){
          // CORE — red-orange base
          size = 6 + Math.random()*8;
          vy   = -(1.2 + Math.random()*2.0);
          vx   = (Math.random()-0.5)*1.4;
          life = 50 + Math.random()*35;
          col  = ['#ff1800','#ff2e00','#ff4400','#cc1000'][Math.floor(Math.random()*4)];
        } else if(layer < 0.72){
          // MID — orange tongues
          size = 4 + Math.random()*6;
          vy   = -(2.0 + Math.random()*2.8);
          vx   = (Math.random()-0.5)*1.1;
          life = 35 + Math.random()*25;
          col  = ['#ff7700','#ff9500','#ffaa00','#ffbe00'][Math.floor(Math.random()*4)];
        } else {
          // TIPS — yellow-white wisps
          size = 2.5 + Math.random()*4;
          vy   = -(3.2 + Math.random()*3.5);
          vx   = (Math.random()-0.5)*0.9;
          life = 22 + Math.random()*18;
          col  = ['#ffe033','#ffee66','#fffa99','#ffffff'][Math.floor(Math.random()*4)];
        }

        particles.push({
          x: pt.x + (Math.random()-0.5)*2,
          y: pt.y + (Math.random()-0.5)*2,
          vx, vy, size, life, maxLife: life, col,
          wobble: Math.random()*Math.PI*2,
          wFreq:  0.07+Math.random()*0.09,
          wAmp:   0.03+Math.random()*0.07,
        });
      }
    }

    // Hex → rgb cache
    const rgbCache = {};
    function rgb(hex){
      if(rgbCache[hex]) return rgbCache[hex];
      const r=parseInt(hex.slice(1,3),16);
      const g=parseInt(hex.slice(3,5),16);
      const b=parseInt(hex.slice(5,7),16);
      return (rgbCache[hex]=[r,g,b]);
    }

    function drawParticle(p){
      const t = p.life/p.maxLife;
      const r = p.size*(0.5+t*0.5);
      // Fade: quick ramp up, hold, slow fade out
      const a = t<0.15 ? t/0.15 : t<0.6 ? 1 : Math.pow((t-0.6)/0.4, 0.4);
      const [rr,gg,bb] = rgb(p.col);
      const g = ctx.createRadialGradient(p.x,p.y,0, p.x,p.y,r);
      g.addColorStop(0,   `rgba(${rr},${gg},${bb},${(a*.98).toFixed(3)})`);
      g.addColorStop(0.35,`rgba(${rr},${gg},${bb},${(a*.72).toFixed(3)})`);
      g.addColorStop(0.7, `rgba(${rr},${gg},${bb},${(a*.28).toFixed(3)})`);
      g.addColorStop(1,   `rgba(${rr},${gg},${bb},0)`);
      ctx.globalCompositeOperation = 'lighter';
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.ellipse(p.x, p.y, r*0.7, r*1.25, 0, 0, Math.PI*2);
      ctx.fill();
    }

    function step(){
      if(!cvs._flameRunning) return;

      ctx.clearRect(0,0,W,H);

      // ── LAYER 1 (bottom): Thick black outline behind fire — creates contrast halo ──
      ctx.save();
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = 'rgba(0,0,0,0.95)';
      ctx.lineWidth   = 12;
      ctx.lineJoin    = 'round';
      ctx.font        = `${FONT_SIZE}px 'Black Han Sans', sans-serif`;
      ctx.textAlign   = 'center';
      ctx.textBaseline= 'middle';
      ctx.strokeText(score, W/2, H*0.62);
      ctx.restore();

      // ── LAYER 2: Solid bright white fill — maximum legibility ──
      ctx.save();
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle   = '#ffffff';
      ctx.font        = `${FONT_SIZE}px 'Black Han Sans', sans-serif`;
      ctx.textAlign   = 'center';
      ctx.textBaseline= 'middle';
      ctx.fillText(score, W/2, H*0.62);
      ctx.restore();

      // ── Fire particles spawn + animate OVER the white numbers ──
      spawnFromEdge();

      for(let i=particles.length-1;i>=0;i--){
        const p=particles[i];
        p.wobble += p.wFreq;
        p.vx += Math.sin(p.wobble)*p.wAmp + (Math.random()-0.5)*0.06;
        p.vx *= 0.965;
        p.vy *= 0.992;
        p.x  += p.vx;
        p.y  += p.vy;
        p.size *= 0.993;
        p.life--;
        if(p.life<=0 || p.y<-p.size*3){ particles.splice(i,1); continue; }
        drawParticle(p);
      }

      // ── LAYER 3 (top): Re-draw crisp number above the fire so it never disappears ──
      // Thin dark outline for edge crispness
      ctx.save();
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = 'rgba(0,0,0,0.8)';
      ctx.lineWidth   = 6;
      ctx.lineJoin    = 'round';
      ctx.font        = `${FONT_SIZE}px 'Black Han Sans', sans-serif`;
      ctx.textAlign   = 'center';
      ctx.textBaseline= 'middle';
      ctx.strokeText(score, W/2, H*0.62);
      ctx.restore();

      // Bright white fill — always readable, punches through fire
      ctx.save();
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle   = '#ffffff';
      ctx.shadowColor = 'rgba(255,255,255,0.9)';
      ctx.shadowBlur  = 10;
      ctx.font        = `${FONT_SIZE}px 'Black Han Sans', sans-serif`;
      ctx.textAlign   = 'center';
      ctx.textBaseline= 'middle';
      ctx.fillText(score, W/2, H*0.62);
      ctx.restore();

      // Hot amber heat tint — looks scorching but stays transparent
      ctx.save();
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 0.22;
      ctx.fillStyle   = '#ffcc00';
      ctx.shadowColor = '#ff8800';
      ctx.shadowBlur  = 18;
      ctx.font        = `${FONT_SIZE}px 'Black Han Sans', sans-serif`;
      ctx.textAlign   = 'center';
      ctx.textBaseline= 'middle';
      ctx.fillText(score, W/2, H*0.62);
      ctx.restore();

      frameN++;
      requestAnimationFrame(step);
    }

    // Preload font then start
    document.fonts.load(`${FONT_SIZE}px 'Black Han Sans'`).then(()=>{
      // Re-sample edge points after font loads
      octx.clearRect(0,0,W,H);
      octx.fillStyle='#fff';
      octx.font=`${FONT_SIZE}px 'Black Han Sans', sans-serif`;
      octx.textAlign='center'; octx.textBaseline='middle';
      octx.fillText(score, W/2, H*0.62);
      const id2=octx.getImageData(0,0,W,H); const p2=id2.data;
      edgePoints.length=0;
      for(let y=1;y<H-1;y++){
        for(let x=1;x<W-1;x++){
          const i=(y*W+x)*4;
          if(p2[i+3]>60){
            const n=((y-1)*W+x)*4+3, s=((y+1)*W+x)*4+3,
                  wl=(y*W+x-1)*4+3,  e=(y*W+x+1)*4+3;
            if(p2[n]<60||p2[s]<60||p2[wl]<60||p2[e]<60)
              edgePoints.push({x,y});
          }
        }
      }
      step();
    }).catch(()=>step());
  });
}

async function buildHome(){
  document.getElementById('liveCount').textContent='Loading…';
  document.getElementById('liveMatchList').innerHTML=`<div class="empty"><div class="icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg></div><p>Loading matches…</p></div>`;
  document.getElementById('upcomingMatchList').innerHTML=`<div class="empty"><div class="icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg></div><p>Loading…</p></div>`;
  const[live,upcoming,recent]=await Promise.all([fetchLive(),fetchUpcoming(),fetchRecent()]);
  document.getElementById('liveCount').textContent=live.length+' match'+(live.length!==1?'es':'');
  document.getElementById('liveMatchList').innerHTML=live.length?live.map(matchCardHTML).join(''):`<div class="empty"><div class="icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/><path d="M2 12h20"/></svg></div><p>No live matches right now</p></div>`;
  if(live.length) requestAnimationFrame(bootFlameCanvases);
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
function initBgParticles(){
  const cvs = document.getElementById('bgCanvas');
  if(!cvs) return;
  const ctx = cvs.getContext('2d');
  let W, H;

  function resize(){
    W = cvs.width  = window.innerWidth;
    H = cvs.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  // Three types of particles
  const stars=[], orbs=[], streaks=[];

  // Static twinkling stars
  for(let i=0;i<120;i++){
    stars.push({
      x:Math.random()*W, y:Math.random()*H,
      r:0.5+Math.random()*1.5,
      a:Math.random(), da:0.005+Math.random()*0.015,
      phase:Math.random()*Math.PI*2
    });
  }

  // Slow drifting orbs
  for(let i=0;i<18;i++){
    orbs.push({
      x:Math.random()*W, y:Math.random()*H,
      r:40+Math.random()*80,
      vx:(Math.random()-0.5)*0.15,
      vy:(Math.random()-0.5)*0.12,
      a:0.03+Math.random()*0.06,
      hue:Math.random()>0.5?210:190,
      phase:Math.random()*Math.PI*2,
      pSpeed:0.008+Math.random()*0.012
    });
  }

  // Occasional shooting streaks
  function spawnStreak(){
    streaks.push({
      x:Math.random()*W*0.8, y:Math.random()*H*0.5,
      len:60+Math.random()*100,
      angle:0.3+Math.random()*0.4,
      speed:8+Math.random()*6,
      life:1, maxLife:1,
      a:0.6+Math.random()*0.4
    });
    setTimeout(spawnStreak, 2000+Math.random()*5000);
  }
  setTimeout(spawnStreak, 1000);

  let t=0;
  function frame(){
    ctx.clearRect(0,0,W,H);
    t+=0.016;

    // Draw orbs
    orbs.forEach(o=>{
      o.phase+=o.pSpeed;
      o.x+=o.vx; o.y+=o.vy;
      if(o.x<-o.r)o.x=W+o.r; if(o.x>W+o.r)o.x=-o.r;
      if(o.y<-o.r)o.y=H+o.r; if(o.y>H+o.r)o.y=-o.r;
      const pulse=o.a*(0.7+0.3*Math.sin(o.phase));
      const g=ctx.createRadialGradient(o.x,o.y,0,o.x,o.y,o.r);
      g.addColorStop(0,`hsla(${o.hue},100%,65%,${pulse})`);
      g.addColorStop(1,`hsla(${o.hue},100%,50%,0)`);
      ctx.fillStyle=g;
      ctx.beginPath();ctx.arc(o.x,o.y,o.r,0,Math.PI*2);ctx.fill();
    });

    // Draw stars
    stars.forEach(s=>{
      s.phase+=s.da;
      const a=0.2+0.8*Math.abs(Math.sin(s.phase));
      ctx.fillStyle=`rgba(180,220,255,${(a*0.7).toFixed(3)})`;
      ctx.beginPath();ctx.arc(s.x,s.y,s.r,0,Math.PI*2);ctx.fill();
    });

    // Draw streaks
    for(let i=streaks.length-1;i>=0;i--){
      const s=streaks[i];
      s.x+=Math.cos(s.angle)*s.speed;
      s.y+=Math.sin(s.angle)*s.speed;
      s.life-=0.025;
      if(s.life<=0){streaks.splice(i,1);continue;}
      const a=s.life*s.a;
      const grd=ctx.createLinearGradient(s.x,s.y,s.x-Math.cos(s.angle)*s.len,s.y-Math.sin(s.angle)*s.len);
      grd.addColorStop(0,`rgba(0,212,255,${a.toFixed(3)})`);
      grd.addColorStop(1,'rgba(0,212,255,0)');
      ctx.strokeStyle=grd;ctx.lineWidth=1.5;
      ctx.beginPath();
      ctx.moveTo(s.x,s.y);
      ctx.lineTo(s.x-Math.cos(s.angle)*s.len,s.y-Math.sin(s.angle)*s.len);
      ctx.stroke();
    }

    requestAnimationFrame(frame);
  }
  frame();
}

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
window.addEventListener('resize', ()=>{
  const cvs = document.getElementById('clashCanvas');
  if(cvs && document.getElementById('clashOverlay').style.display !== 'none'){
    cvs.width = window.innerWidth;
    cvs.height = window.innerHeight;
  }
});

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

// ─── CLASH ENGINE ───────────────────────────────────────────
function _runClash(cfg) {
  const ov  = document.getElementById('clashOverlay');
  const cvs = document.getElementById('clashCanvas');
  const ctx = cvs.getContext('2d');

  // Resize canvas to viewport
  cvs.width  = window.innerWidth;
  cvs.height = window.innerHeight;
  const W = cvs.width, H = cvs.height;
  const CX = W/2, CY = H/2;

  // Populate DOM labels
  document.getElementById('c_homeName').textContent = cfg.homeTeam;
  document.getElementById('c_awayName').textContent = cfg.awayTeam;
  document.getElementById('c_homeCode').textContent = cfg.homeCode;
  document.getElementById('c_awayCode').textContent = cfg.awayCode;
  document.getElementById('c_homeAv').className = 'c-av ' + cfg.homeKit;
  document.getElementById('c_awayAv').className = 'c-av ' + cfg.awayKit;

  const scoreEl = document.getElementById('c_score');
  if (cfg.status !== 'scheduled') {
    scoreEl.textContent = cfg.homeScore + ' – ' + cfg.awayScore;
    scoreEl.style.opacity = '0';
  } else {
    scoreEl.textContent = '';
    scoreEl.style.opacity = '0';
  }
  const liveEl = document.getElementById('c_live');
  liveEl.style.opacity = '0';
  if (cfg.status === 'live') {
    liveEl.innerHTML = `<span class="c-live-dot"></span> LIVE &nbsp; ${cfg.minute||''}′`;
  }

  // Reset VS
  const vsEl = document.getElementById('c_vs');
  vsEl.style.opacity = '0';
  vsEl.style.transform = 'scale(0) rotate(-20deg)';

  // Show overlay
  ov.style.display = 'flex';
  ov.style.opacity = '0';

  // Particle pools
  let particles = [], sparks = [], shockwaves = [], fireTrails = [];
  let rafId = null, startTime = null;
  let phase = 0; // 0=charge, 1=impact, 2=reveal, 3=done

  // Home badge screen position (left side, charging right)
  // Away badge screen position (right side, charging left)
  // We animate them on canvas too for the fire trail effect
  const homeEl = document.getElementById('c_homeAv');
  const awayEl = document.getElementById('c_awayAv');

  function getBadgePos(el) {
    const r = el.getBoundingClientRect();
    return { x: r.left + r.width/2, y: r.top + r.height/2 };
  }

  // ── helpers ──
  function lerp(a,b,t){ return a+(b-a)*t; }
  function easeOut(t){ return 1-Math.pow(1-t,3); }
  function easeIn(t){ return t*t*t; }

  function spawnBurst(x, y, count, colors, spd, life) {
    for (let i=0;i<count;i++) {
      const a = Math.random()*Math.PI*2;
      const s = spd*(0.3+Math.random()*0.9);
      particles.push({ x,y, vx:Math.cos(a)*s, vy:Math.sin(a)*s - Math.random()*spd*0.4,
        life: life*(0.5+Math.random()*0.6), maxLife:life,
        size: 1.5+Math.random()*5, color:colors[Math.floor(Math.random()*colors.length)],
        gravity: 0.08+Math.random()*0.12 });
    }
  }
  function spawnSparks(x, y, count) {
    for (let i=0;i<count;i++) {
      const a = -Math.PI/2 + (Math.random()-0.5)*Math.PI*1.6;
      const s = 5+Math.random()*18;
      sparks.push({ x,y, vx:Math.cos(a)*s, vy:Math.sin(a)*s,
        life:35+Math.random()*35, maxLife:70,
        color:['#00d4ff','#fff','#ffcc00','#ff6a00','#4d9fff'][Math.floor(Math.random()*5)] });
    }
  }
  function addShockwave(x,y){ shockwaves.push({x,y,r:0,maxR:Math.max(W,H)*0.75,alpha:1}); }

  function shakeDom() {
    ov.style.animation='none'; void ov.offsetWidth;
    ov.style.animation='c-shake .5s cubic-bezier(.36,.07,.19,.97) both';
  }

  function lightPath(x1,y1,x2,y2,rough) {
    const pts=[{x:x1,y:y1}];
    for(let i=1;i<14;i++){
      const t=i/14;
      pts.push({x:x1+(x2-x1)*t+(Math.random()-.5)*rough*2, y:y1+(y2-y1)*t+(Math.random()-.5)*rough});
    }
    pts.push({x:x2,y:y2}); return pts;
  }
  function drawBolt(pts,w,color,alpha) {
    ctx.save(); ctx.globalAlpha=alpha; ctx.strokeStyle=color;
    ctx.lineWidth=w; ctx.shadowColor=color; ctx.shadowBlur=18; ctx.lineCap='round';
    ctx.beginPath(); ctx.moveTo(pts[0].x,pts[0].y);
    pts.forEach(p=>ctx.lineTo(p.x,p.y)); ctx.stroke(); ctx.restore();
  }

  // ── FIRE TRAIL particles for charge phase ──
  function emitFire(x, y, dirX) {
    for (let i=0;i<4;i++) {
      const angle = Math.PI/2 + (Math.random()-0.5)*0.8;
      const spd   = 1+Math.random()*3;
      fireTrails.push({
        x: x+(Math.random()-0.5)*20, y: y+(Math.random()-0.5)*20,
        vx: Math.cos(angle)*spd - dirX*0.5,
        vy: Math.sin(angle)*spd - 2 - Math.random()*2,
        life:15+Math.random()*20, maxLife:35,
        size:3+Math.random()*8,
        color:['#ff6a00','#ff2d55','#ffcc00','#ff9500','#fff'][Math.floor(Math.random()*5)]
      });
    }
  }

  // ── MAIN TICK ──
  function tick(ts) {
    if (!startTime) startTime = ts;
    const t = ts - startTime; // ms elapsed

    ctx.clearRect(0,0,W,H);

    // ── PHASE 0: CHARGE (0–700ms) ──
    // CSS handles the DOM badges sliding in, canvas draws fire trails
    if (phase === 0) {
      // Emit fire from each badge position every frame
      const hp = getBadgePos(homeEl);
      const ap = getBadgePos(awayEl);
      emitFire(hp.x, hp.y,  1);  // home moving right → fire goes left
      emitFire(ap.x, ap.y, -1);  // away moving left  → fire goes right

      // Also draw a faint trail line converging
      if (t > 100) {
        const progress = Math.min(1, (t-100)/500);
        // energy buildup lines from edges to center
        const alpha = easeOut(progress) * 0.3;
        for (let i=0;i<3;i++) {
          const offY = (Math.random()-0.5)*80;
          const pts1 = lightPath(hp.x, hp.y, CX, CY+offY, 20*(1-progress));
          drawBolt(pts1, 0.8, '#00d4ff', alpha);
        }
      }

      if (t >= 700 && phase === 0) {
        phase = 1;
        // ── IMPACT ──
        shakeDom();
        spawnBurst(CX,CY, 200, ['#00d4ff','#fff','#4d9fff','#ffcc00','#ff6a00','#ff2d55'], 22, 100);
        spawnSparks(CX, CY, 100);
        addShockwave(CX,CY);
        setTimeout(()=>addShockwave(CX,CY), 60);
        setTimeout(()=>addShockwave(CX,CY), 150);
        setTimeout(()=>addShockwave(CX,CY), 280);
        setTimeout(()=>{ spawnBurst(CX,CY,80,['#ff2d55','#ffcc00','#00e87a','#fff'],14,70); spawnSparks(CX,CY,50); },100);
        setTimeout(()=>{ spawnBurst(CX,CY,40,['#00d4ff','#4d9fff'],8,50); },250);

        // Flash the whole screen white
        ov.style.background='#fff';
        setTimeout(()=>{ ov.style.background='#020916'; }, 80);
      }
    }

    // ── PHASE 1: IMPACT AFTERMATH (700–1600ms) ──
    if (phase >= 1 && t > 700 && t < 1600) {
      const intensity = 1 - (t-700)/900;
      const count = Math.floor(intensity * 5) + 1;
      for (let b=0;b<count;b++) {
        const offY = (Math.random()-0.5)*140;
        const offX = (Math.random()-0.5)*40;
        const pts  = lightPath(CX+offX-30, CY+offY, CX+offX+30, CY+offY, 70*(0.3+intensity));
        drawBolt(pts, 2+intensity*3, '#fff', (0.3+intensity*0.7)*0.9);
        drawBolt(pts, 1, '#00d4ff', 0.4+intensity*0.5);
        // branch
        if (Math.random() > 0.5) {
          const mp = pts[Math.floor(pts.length/2)];
          const bp = lightPath(mp.x,mp.y, CX+(Math.random()-0.5)*400, CY+(Math.random()-0.5)*220, 35);
          drawBolt(bp, 0.8, '#4d9fff', intensity*0.4);
        }
      }
    }

    // ── PHASE 2: REVEAL (1600ms) ──
    if (phase === 1 && t >= 1600) {
      phase = 2;
      // Animate VS in
      vsEl.style.transition='opacity .25s, transform .35s cubic-bezier(.2,0,.2,1)';
      vsEl.style.opacity='1'; vsEl.style.transform='scale(1) rotate(0deg)';
      // Score
      setTimeout(()=>{
        scoreEl.style.transition='opacity .3s ease .1s, transform .3s ease .1s';
        scoreEl.style.opacity='1'; scoreEl.style.transform='scale(1)';
      }, 200);
      // Live badge
      if (cfg.status === 'live') {
        setTimeout(()=>{
          liveEl.style.transition='opacity .3s ease';
          liveEl.style.opacity='1';
        }, 450);
      }
      // Hint
      setTimeout(()=>{
        document.getElementById('c_hint').style.opacity='1';
      }, 900);
      // Idle sparkle + auto-close
      setTimeout(()=>{ if(phase<3){ phase=3; _dismissClash(cfg.id); } }, 3000);
    }

    // ── IDLE SPARKLE after reveal ──
    if (phase >= 2 && t > 1600 && Math.random() > 0.75) {
      spawnBurst(CX+(Math.random()-0.5)*100, CY+(Math.random()-0.5)*60, 2, ['#00d4ff','#ffcc00','#fff'], 3, 25);
    }

    // ── DRAW FIRE TRAILS ──
    for (let i=fireTrails.length-1; i>=0; i--) {
      const f = fireTrails[i];
      f.x+=f.vx; f.y+=f.vy; f.vy-=0.15; f.life--;
      if(f.life<=0){fireTrails.splice(i,1);continue;}
      const a=f.life/f.maxLife;
      ctx.save(); ctx.globalAlpha=a*0.85;
      ctx.fillStyle=f.color; ctx.shadowColor=f.color; ctx.shadowBlur=10;
      ctx.beginPath(); ctx.arc(f.x,f.y,f.size*a,0,Math.PI*2); ctx.fill(); ctx.restore();
    }

    // ── SHOCKWAVES ──
    for (let i=shockwaves.length-1; i>=0; i--) {
      const sw=shockwaves[i];
      sw.r+=32; sw.alpha=Math.max(0,1-sw.r/sw.maxR);
      if(sw.alpha<=0){shockwaves.splice(i,1);continue;}
      ctx.save();
      ctx.strokeStyle=`rgba(0,212,255,${sw.alpha*0.7})`; ctx.lineWidth=3*sw.alpha;
      ctx.shadowColor='#00d4ff'; ctx.shadowBlur=25;
      ctx.beginPath(); ctx.arc(sw.x,sw.y,sw.r,0,Math.PI*2); ctx.stroke();
      ctx.strokeStyle=`rgba(255,255,255,${sw.alpha*0.15})`; ctx.lineWidth=1;
      ctx.beginPath(); ctx.arc(sw.x,sw.y,sw.r*0.65,0,Math.PI*2); ctx.stroke();
      ctx.restore();
    }

    // ── SPARKS ──
    for (let i=sparks.length-1; i>=0; i--) {
      const s=sparks[i]; s.x+=s.vx; s.y+=s.vy; s.vy+=0.35; s.life--;
      if(s.life<=0){sparks.splice(i,1);continue;}
      const a=s.life/s.maxLife;
      ctx.save(); ctx.globalAlpha=a; ctx.strokeStyle=s.color;
      ctx.lineWidth=1.8; ctx.shadowColor=s.color; ctx.shadowBlur=10;
      ctx.beginPath(); ctx.moveTo(s.x,s.y); ctx.lineTo(s.x-s.vx*1.8,s.y-s.vy*1.8);
      ctx.stroke(); ctx.restore();
    }

    // ── PARTICLES ──
    for (let i=particles.length-1; i>=0; i--) {
      const p=particles[i]; p.x+=p.vx; p.y+=p.vy; p.vy+=p.gravity; p.vx*=0.97; p.life--;
      if(p.life<=0){particles.splice(i,1);continue;}
      const a=p.life/p.maxLife;
      ctx.save(); ctx.globalAlpha=a; ctx.fillStyle=p.color;
      ctx.shadowColor=p.color; ctx.shadowBlur=8;
      ctx.beginPath(); ctx.arc(p.x,p.y,p.size*a,0,Math.PI*2); ctx.fill(); ctx.restore();
    }

    rafId = requestAnimationFrame(tick);
  }

  // Fade in overlay then start
  ov.style.transition='opacity .2s ease';
  setTimeout(()=>{ ov.style.opacity='1'; rafId=requestAnimationFrame(tick); }, 20);
  ov._stop = ()=>{ if(rafId) cancelAnimationFrame(rafId); };

  // Click anywhere to skip
  ov.onclick = ()=>{ if(phase<3){ phase=3; _dismissClash(cfg.id); } };
}

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
</script>
