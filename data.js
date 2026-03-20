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
