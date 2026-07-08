// Mock data extracted from lib/messages-data.ts and lib/priority-data.ts

const _participants = {
  sarah:  { name: 'Sarah Chen',     avatar: 'SC', role: 'Project Manager',     hue: 220 },
  mike:   { name: 'Mike Rodriguez', avatar: 'MR', role: 'Site Superintendent', hue: 25  },
  david:  { name: 'David Kim',      avatar: 'DK', role: 'Procurement Lead',    hue: 145 },
  emily:  { name: 'Emily Johnson',  avatar: 'EJ', role: 'Architect',           hue: 290 },
  james:  { name: 'James Wilson',   avatar: 'JW', role: 'Structural Engineer', hue: 200 },
  lisa:   { name: 'Lisa Park',      avatar: 'LP', role: 'MEP Coordinator',     hue: 340 },
  you:    { name: 'You',            avatar: 'ME', role: 'Project Manager',     hue: 230 },
  carlos: { name: 'Carlos Rivera',  avatar: 'CR', role: 'General Contractor',  hue: 50  },
  anna:   { name: 'Anna Torres',    avatar: 'AT', role: 'Interior Designer',   hue: 320 },
  ben:    { name: 'Ben Nakamura',   avatar: 'BN', role: 'Civil Engineer',      hue: 170 },
};

const _now = Date.now();
const _m = (minAgo) => new Date(_now - minAgo * 60_000);

const PRIORITY_PROJECTS = [
  { id: 'pp1',  name: 'Mecca HQ Renovation',     initials: 'MH', priorityLevel: 'critical', manager: 'Sarah Chen',     priorityReason: '4 overdue tasks',           overdueTasks: 4, dueTodayTasks: 2, unreadMessages: 7, hasBlocker: true,  hasWaitingApproval: true,  hasSiteIssue: true,  color: '#ef4444' },
  { id: 'pp2',  name: 'Downtown Retail Build',   initials: 'DR', priorityLevel: 'critical', manager: 'Mike Rodriguez', priorityReason: 'Site issue open',           overdueTasks: 2, dueTodayTasks: 1, unreadMessages: 3, hasBlocker: true,  hasWaitingApproval: false, hasSiteIssue: true,  color: '#ef4444' },
  { id: 'pp3',  name: 'North Miami Office',      initials: 'NM', priorityLevel: 'high',     manager: 'Emily Johnson',  priorityReason: '2 quotes pending',          overdueTasks: 1, dueTodayTasks: 2, unreadMessages: 5, hasBlocker: false, hasWaitingApproval: true,  hasSiteIssue: false, color: '#f97316' },
  { id: 'pp4',  name: 'Wynwood Restaurant',      initials: 'WR', priorityLevel: 'high',     manager: 'David Kim',      priorityReason: 'Approval blocking order',   overdueTasks: 0, dueTodayTasks: 3, unreadMessages: 2, hasBlocker: false, hasWaitingApproval: true,  hasSiteIssue: false, color: '#f59e0b' },
  { id: 'pp5',  name: 'Brickell Apartment',      initials: 'BA', priorityLevel: 'normal',   manager: 'James Wilson',   priorityReason: '5 open tasks',              overdueTasks: 0, dueTodayTasks: 1, unreadMessages: 0, hasBlocker: false, hasWaitingApproval: false, hasSiteIssue: false, color: '#3b82f6' },
  { id: 'pp6',  name: 'Coral Gables Villa',      initials: 'CG', priorityLevel: 'high',     manager: 'Lisa Park',      priorityReason: '3 overdue tasks',           overdueTasks: 3, dueTodayTasks: 0, unreadMessages: 4, hasBlocker: false, hasWaitingApproval: false, hasSiteIssue: true,  color: '#8b5cf6' },
  { id: 'pp7',  name: 'Design Studio Buildout',  initials: 'DS', priorityLevel: 'normal',   manager: 'Emily Johnson',  priorityReason: 'Task due today',            overdueTasks: 0, dueTodayTasks: 2, unreadMessages: 1, hasBlocker: false, hasWaitingApproval: false, hasSiteIssue: false, color: '#06b6d4' },
  { id: 'pp8',  name: 'Warehouse Conversion',    initials: 'WC', priorityLevel: 'critical', manager: 'Mike Rodriguez', priorityReason: 'Blocker — permit hold',     overdueTasks: 5, dueTodayTasks: 0, unreadMessages: 9, hasBlocker: true,  hasWaitingApproval: true,  hasSiteIssue: true,  color: '#ef4444' },
  { id: 'pp9',  name: 'Sunset Harbor Residences',initials: 'SH', priorityLevel: 'normal',   manager: 'Carlos Rivera',  priorityReason: 'Foundation phase active',   overdueTasks: 0, dueTodayTasks: 0, unreadMessages: 0, hasBlocker: false, hasWaitingApproval: false, hasSiteIssue: false, color: '#10b981' },
  { id: 'pp10', name: 'Midtown Medical Clinic',  initials: 'MM', priorityLevel: 'high',     manager: 'Anna Torres',    priorityReason: 'Quote approval needed',     overdueTasks: 0, dueTodayTasks: 1, unreadMessages: 3, hasBlocker: false, hasWaitingApproval: true,  hasSiteIssue: true,  color: '#f97316' },
  { id: 'pp11', name: 'Overtown Mixed-Use',      initials: 'OM', priorityLevel: 'normal',   manager: 'Emily Johnson',  priorityReason: 'Drawing review in progress',overdueTasks: 0, dueTodayTasks: 0, unreadMessages: 0, hasBlocker: false, hasWaitingApproval: false, hasSiteIssue: false, color: '#3b82f6' },
  { id: 'pp12', name: 'Bayfront Hotel Renovation',initials:'BH', priorityLevel: 'critical', manager: 'Sarah Chen',     priorityReason: 'Elevator shaft safety',     overdueTasks: 0, dueTodayTasks: 1, unreadMessages: 9, hasBlocker: true,  hasWaitingApproval: true,  hasSiteIssue: true,  color: '#ef4444' },
  { id: 'pp13', name: 'Edgewater Condos',        initials: 'EC', priorityLevel: 'normal',   manager: 'Carlos Rivera',  priorityReason: 'Drywall on schedule',       overdueTasks: 0, dueTodayTasks: 0, unreadMessages: 0, hasBlocker: false, hasWaitingApproval: false, hasSiteIssue: false, color: '#06b6d4' },
  { id: 'pp14', name: 'Airport Cargo Terminal',  initials: 'AC', priorityLevel: 'normal',   manager: 'Ben Nakamura',   priorityReason: 'Steel erection phase',      overdueTasks: 0, dueTodayTasks: 0, unreadMessages: 1, hasBlocker: false, hasWaitingApproval: false, hasSiteIssue: false, color: '#64748b' },
  { id: 'pp15', name: 'Lincoln Road Pop-Up',     initials: 'LR', priorityLevel: 'normal',   manager: 'Anna Torres',    priorityReason: 'Install phase starting',    overdueTasks: 0, dueTodayTasks: 1, unreadMessages: 0, hasBlocker: false, hasWaitingApproval: false, hasSiteIssue: false, color: '#f43f5e' },
];

function _conv(o) {
  const base = { unreadCount: 0, priority: 'normal', ...o };
  if (!base.priorityLevel) {
    if (base.priority === 'critical') base.priorityLevel = 'p1';
    else if (base.priority === 'high' && base.unreadCount > 0) base.priorityLevel = 'p1';
    else if (base.priority === 'high') base.priorityLevel = 'p2';
    else if (base.priority === 'normal' && base.unreadCount > 0) base.priorityLevel = 'p2';
    else base.priorityLevel = 'p3';
  }
  return base;
}

const CONVERSATIONS = [
  // pp1
  _conv({ id: 'c-pp1-proj',  projectId: 'pp1', type: 'project',     title: 'Project Chat',                       lastMessage: 'Site walk scheduled for 8AM tomorrow.',           lastSender: 'Sarah Chen',     timestamp: _m(12),  unreadCount: 3, priority: 'critical', participants: [_participants.sarah, _participants.mike, _participants.david, _participants.emily] }),
  _conv({ id: 'c-pp1-t1',    projectId: 'pp1', type: 'task',        title: 'Finish wall framing — Level 3',       lastMessage: 'Still waiting on lumber delivery.',               lastSender: 'Mike Rodriguez', timestamp: _m(45),  unreadCount: 4, priority: 'critical', subtitle: 'Overdue · Mike R.',         status: 'in-progress', participants: [_participants.mike, _participants.sarah] }),
  _conv({ id: 'c-pp1-t2',    projectId: 'pp1', type: 'task',        title: 'Upload progress photos — Level 2',    lastMessage: 'Photos uploaded to shared folder.',               lastSender: 'Lisa Park',      timestamp: _m(120), unreadCount: 0, priority: 'high',     subtitle: 'Due today · Lisa P.',       status: 'in-progress', participants: [_participants.lisa, _participants.emily] }),
  _conv({ id: 'c-pp1-proc1', projectId: 'pp1', type: 'procurement', title: 'Lighting fixture quote approval',     lastMessage: 'Quote from 3 vendors. Need sign-off today.',     lastSender: 'David Kim',      timestamp: _m(30),  unreadCount: 2, priority: 'high',     subtitle: 'Waiting approval · David K.', status: 'waiting-approval', participants: [_participants.david, _participants.sarah] }),
  _conv({ id: 'c-pp1-iss1',  projectId: 'pp1', type: 'site-issue',  title: 'Water leak near storage wall',        lastMessage: 'Plumber on-site. Temporary patch applied.',       lastSender: 'Mike Rodriguez', timestamp: _m(18),  unreadCount: 1, priority: 'critical', subtitle: 'Critical · Mike R.',        status: 'open',          participants: [_participants.mike, _participants.sarah, _participants.james] }),

  // pp2
  _conv({ id: 'c-pp2-proj',  projectId: 'pp2', type: 'project',     title: 'Project Chat',                       lastMessage: 'Owner visiting Friday at 2PM. Keep site clean.',  lastSender: 'Mike Rodriguez', timestamp: _m(120), unreadCount: 0, priority: 'critical', participants: [_participants.mike, _participants.sarah, _participants.david, _participants.james] }),
  _conv({ id: 'c-pp2-iss1',  projectId: 'pp2', type: 'site-issue',  title: 'Structural crack — east wall',        lastMessage: 'Engineer assessed. Needs rebar reinforcement.',   lastSender: 'James Wilson',   timestamp: _m(25),  unreadCount: 2, priority: 'critical', subtitle: 'Critical · James W.',       status: 'escalated',     participants: [_participants.james, _participants.mike, _participants.sarah] }),
  _conv({ id: 'c-pp2-proc1', projectId: 'pp2', type: 'procurement', title: 'Steel beam order — 3 quotes',         lastMessage: 'All 3 quotes received. Waiting comparison.',      lastSender: 'David Kim',      timestamp: _m(180), unreadCount: 1, priority: 'high',     subtitle: 'Pending · David K.',        status: 'pending',        participants: [_participants.david, _participants.mike] }),
  _conv({ id: 'c-pp2-t1',    projectId: 'pp2', type: 'task',        title: 'Electrical rough-in inspection',      lastMessage: 'Inspector confirmed for 10AM. Lisa on-site.',     lastSender: 'Lisa Park',      timestamp: _m(90),  unreadCount: 0, priority: 'high',     subtitle: 'Due today · Lisa P.',       status: 'in-progress',    participants: [_participants.lisa, _participants.mike] }),

  // pp3
  _conv({ id: 'c-pp3-proj',  projectId: 'pp3', type: 'project',     title: 'Project Chat',                       lastMessage: 'MEP sign-off meeting moved to Thursday.',        lastSender: 'Emily Johnson',  timestamp: _m(240), unreadCount: 2, priority: 'high',     participants: [_participants.emily, _participants.lisa, _participants.david, _participants.sarah] }),
  _conv({ id: 'c-pp3-proc1', projectId: 'pp3', type: 'procurement', title: 'HVAC unit — quote approval',          lastMessage: 'Best quote attached. Please approve.',           lastSender: 'David Kim',      timestamp: _m(50),  unreadCount: 3, priority: 'high',     subtitle: 'Waiting approval · David K.', status: 'waiting-approval', participants: [_participants.david, _participants.emily] }),
  _conv({ id: 'c-pp3-t1',    projectId: 'pp3', type: 'task',        title: 'MEP coordination sign-off',           lastMessage: 'Checklist done. Waiting for Emily final sign-off.',lastSender: 'Lisa Park',     timestamp: _m(300), unreadCount: 0, priority: 'high',     subtitle: 'Due today · Lisa P.',       status: 'in-progress',    participants: [_participants.lisa, _participants.emily] }),

  // pp6
  _conv({ id: 'c-pp6-proj',  projectId: 'pp6', type: 'project',     title: 'Project Chat',                       lastMessage: 'Pool deck crew ready. Waiting on weather.',      lastSender: 'Lisa Park',      timestamp: _m(55),  unreadCount: 4, priority: 'high',     participants: [_participants.lisa, _participants.mike, _participants.david] }),
  _conv({ id: 'c-pp6-t1',    projectId: 'pp6', type: 'task',        title: 'Pool deck waterproofing',             lastMessage: 'Rain pushed us back. Rescheduled for Friday.',   lastSender: 'Mike Rodriguez', timestamp: _m(70),  unreadCount: 2, priority: 'high',     subtitle: 'Overdue 3d · Mike R.',      status: 'on-hold',        participants: [_participants.mike, _participants.lisa] }),
  _conv({ id: 'c-pp6-iss1',  projectId: 'pp6', type: 'site-issue',  title: 'Drainage blockage — rear yard',       lastMessage: 'Plumber cleared partial blockage. Monitoring.', lastSender: 'James Wilson',   timestamp: _m(200), unreadCount: 0, priority: 'high',     subtitle: 'Open · James W.',           status: 'open',           participants: [_participants.james, _participants.lisa] }),

  // pp8
  _conv({ id: 'c-pp8-proj',  projectId: 'pp8', type: 'project',     title: 'Project Chat',                       lastMessage: 'Permit still on hold. Awaiting zoning response.',lastSender: 'Sarah Chen',     timestamp: _m(20),  unreadCount: 5, priority: 'critical', participants: [_participants.sarah, _participants.mike, _participants.james, _participants.david] }),
  _conv({ id: 'c-pp8-t1',    projectId: 'pp8', type: 'task',        title: 'Permit resubmission — zoning',        lastMessage: 'Application resubmitted. Response in 3 days.',   lastSender: 'Sarah Chen',     timestamp: _m(360), unreadCount: 2, priority: 'critical', subtitle: 'Overdue 5d · Sarah C.',     status: 'in-progress',    participants: [_participants.sarah, _participants.james] }),
  _conv({ id: 'c-pp8-iss1',  projectId: 'pp8', type: 'site-issue',  title: 'Roof structural assessment',          lastMessage: 'Engineer arriving Monday. Zones 2-4 halted.',    lastSender: 'James Wilson',   timestamp: _m(35),  unreadCount: 4, priority: 'critical', subtitle: 'Critical · James W.',       status: 'open',           participants: [_participants.james, _participants.mike] }),

  // pp12
  _conv({ id: 'c-pp12-proj', projectId: 'pp12', type: 'project',    title: 'Project Chat',                       lastMessage: 'Guest floors reopening delayed by 2 weeks.',     lastSender: 'Sarah Chen',     timestamp: _m(15),  unreadCount: 6, priority: 'critical', participants: [_participants.sarah, _participants.anna, _participants.david, _participants.mike] }),
  _conv({ id: 'c-pp12-iss1', projectId: 'pp12', type: 'site-issue', title: 'Elevator shaft obstruction',          lastMessage: 'Material staged in shaft. Must clear today.',   lastSender: 'Mike Rodriguez', timestamp: _m(10),  unreadCount: 3, priority: 'critical', subtitle: 'Critical — safety',         status: 'open',           participants: [_participants.mike, _participants.sarah] }),

  // direct messages (global)
  _conv({ id: 'c-dm-sarah',  projectId: '', type: 'direct', title: 'Sarah Chen',     subtitle: 'Project Manager · Pinned',  lastMessage: 'Can you review the updated schedule before EOD?', lastSender: 'Sarah Chen',     timestamp: _m(10),  unreadCount: 1, participants: [_participants.sarah] }),
  _conv({ id: 'c-dm-david',  projectId: '', type: 'direct', title: 'David Kim',      subtitle: 'Procurement Lead',          lastMessage: 'PO sent. Should be in your inbox.',               lastSender: 'David Kim',      timestamp: _m(180), unreadCount: 0, participants: [_participants.david] }),
  _conv({ id: 'c-dm-mike',   projectId: '', type: 'direct', title: 'Mike Rodriguez', subtitle: 'Site Superintendent',       lastMessage: 'On my way to the site now.',                      lastSender: 'Mike Rodriguez', timestamp: _m(60),  unreadCount: 0, participants: [_participants.mike] }),
  _conv({ id: 'c-dm-emily',  projectId: '', type: 'direct', title: 'Emily Johnson',  subtitle: 'Architect · Pinned',        lastMessage: 'RFI #14 response is attached.',                   lastSender: 'Emily Johnson',  timestamp: _m(300), unreadCount: 2, participants: [_participants.emily] }),

  // project custom group chats
  _conv({ id: 'c-pg-pp1-field',  projectId: 'pp1', type: 'custom-group', title: 'Field Coordination', subtitle: 'Custom group · 4 members', lastMessage: 'Lumber is here. Starting framing at 7AM.',       lastSender: 'Mike Rodriguez', timestamp: _m(90),  unreadCount: 2, participants: [_participants.mike, _participants.sarah, _participants.lisa] }),
  _conv({ id: 'c-pg-pp1-design', projectId: 'pp1', type: 'custom-group', title: 'Design + PM',        subtitle: 'Custom group · 3 members', lastMessage: 'Quick question on the Level 3 framing spec.',   lastSender: 'Sarah Chen',     timestamp: _m(35),  unreadCount: 0, participants: [_participants.sarah, _participants.emily] }),
  _conv({ id: 'c-pg-pp2-site',   projectId: 'pp2', type: 'custom-group', title: 'Site + Structure',   subtitle: 'Custom group · 3 members', lastMessage: 'I uploaded the reinforcement sketch.',          lastSender: 'James Wilson',   timestamp: _m(55),  unreadCount: 1, participants: [_participants.james, _participants.mike] }),
  _conv({ id: 'c-pg-pp8-permit', projectId: 'pp8', type: 'custom-group', title: 'Permit Response',    subtitle: 'Custom group · 4 members', lastMessage: 'Zoning package is ready for final review.',      lastSender: 'Sarah Chen',     timestamp: _m(80),  unreadCount: 1, participants: [_participants.sarah, _participants.james, _participants.mike] }),
];

const MESSAGES = {
  'c-pp1-proj': [
    { id: 'm1', content: 'Morning team. Quick sync before we get started today.', sender: _participants.sarah, timestamp: _m(180) },
    { id: 'm2', content: '@Mike Rodriguez how are we looking on Level 3 framing?', sender: _participants.sarah, timestamp: _m(150) },
    { id: 'm3', content: 'Lumber delivery is delayed again. Following up with supplier by noon.', sender: _participants.mike, timestamp: _m(120) },
    { id: 'm4', content: '@David Kim can you escalate to the backup supplier if needed?', sender: _participants.you, timestamp: _m(60), isOwn: true },
    { id: 'm5', content: 'On it. I have a contact at Timber Pro. Will call now.', sender: _participants.david, timestamp: _m(45) },
    { id: 'm6', content: 'Site walk scheduled for 8AM tomorrow.', sender: _participants.sarah, timestamp: _m(12) },
  ],
  'c-pp1-t1': [
    { id: 'm1', content: 'Framing on Level 3 is blocked on lumber delivery.', sender: _participants.mike, timestamp: _m(240) },
    { id: 'm2', content: 'How long have we been waiting?', sender: _participants.you, timestamp: _m(210), isOwn: true },
    { id: 'm3', content: '3 days. Escalated twice. Supplier keeps pushing back.', sender: _participants.mike, timestamp: _m(180) },
    { id: 'm4', content: 'Still waiting on lumber delivery before we can proceed.', sender: _participants.mike, timestamp: _m(45) },
  ],
  'c-pp1-proc1': [
    { id: 'm1', content: 'Quotes from Lumina, BrightSpec, and ElectroSupply received.', sender: _participants.david, timestamp: _m(120) },
    { id: 'm2', content: 'BrightSpec is lowest at $42,800 with 6-week lead time.', sender: _participants.david, timestamp: _m(90) },
    { id: 'm3', content: 'Does the 6-week lead time work with our schedule?', sender: _participants.you, timestamp: _m(60), isOwn: true },
    { id: 'm4', content: 'Quote from 3 vendors attached. Need sign-off today.', sender: _participants.david, timestamp: _m(30) },
  ],
  'c-pp1-iss1': [
    { id: 'm1', content: 'Active water intrusion near storage wall on Level 1.', sender: _participants.mike, timestamp: _m(90) },
    { id: 'm2', content: 'How bad? Any damage to materials?', sender: _participants.you, timestamp: _m(80), isOwn: true },
    { id: 'm3', content: '@James Wilson I need you to assess the structural risk.', sender: _participants.mike, timestamp: _m(70) },
    { id: 'm4', content: 'On my way. Keep the area clear.', sender: _participants.james, timestamp: _m(60) },
    { id: 'm5', content: 'Plumber on-site. Temporary patch applied. Permanent fix tomorrow.', sender: _participants.mike, timestamp: _m(18) },
  ],
  'c-pp2-iss1': [
    { id: 'm1', content: 'Crack is approx 4mm wide, vertical along east wall.', sender: _participants.james, timestamp: _m(180) },
    { id: 'm2', content: 'All work in that zone stopped.', sender: _participants.mike, timestamp: _m(150) },
    { id: 'm3', content: 'Has owner been notified yet?', sender: _participants.you, timestamp: _m(120), isOwn: true },
    { id: 'm4', content: 'Not yet. Waiting for your go-ahead before we escalate.', sender: _participants.james, timestamp: _m(40) },
    { id: 'm5', content: 'Engineer assessed. Needs rebar reinforcement before work continues.', sender: _participants.james, timestamp: _m(25) },
  ],
  'c-pp8-proj': [
    { id: 'm1', content: 'Still no word from zoning. 3 weeks delayed now.', sender: _participants.sarah, timestamp: _m(300) },
    { id: 'm2', content: 'Owner is getting impatient. Need status update by Friday.', sender: _participants.mike, timestamp: _m(240) },
    { id: 'm3', content: "I'll draft a report. James — can you include structural findings?", sender: _participants.you, timestamp: _m(180), isOwn: true },
    { id: 'm4', content: 'Will do. Report ready by Thursday EOD.', sender: _participants.james, timestamp: _m(150) },
    { id: 'm5', content: 'Permit still on hold. Awaiting zoning response.', sender: _participants.sarah, timestamp: _m(20) },
  ],
  'c-pp12-iss1': [
    { id: 'm1', content: 'Material has been staged inside the elevator shaft. Safety hazard.', sender: _participants.mike, timestamp: _m(60) },
    { id: 'm2', content: 'Who authorized that? Clear it immediately.', sender: _participants.you, timestamp: _m(45), isOwn: true },
    { id: 'm3', content: 'Already on it. Crew clearing now. Should be done in 30 min.', sender: _participants.mike, timestamp: _m(20) },
    { id: 'm4', content: 'Material staged in shaft. Must clear today.', sender: _participants.mike, timestamp: _m(10) },
  ],
  'c-dm-sarah': [
    { id: 'm1', content: 'Hey, did you get the updated RFI from the architect?', sender: _participants.sarah, timestamp: _m(120) },
    { id: 'm2', content: 'Yes, reviewing it now.', sender: _participants.you, timestamp: _m(90), isOwn: true },
    { id: 'm3', content: 'Can you review the updated schedule before EOD?', sender: _participants.sarah, timestamp: _m(10) },
  ],
  'c-dm-emily': [
    { id: 'm1', content: 'I sent over RFI #14 response. Let me know if you need the drawing set.', sender: _participants.emily, timestamp: _m(320) },
    { id: 'm2', content: "Got it, thanks. What's the turnaround on the revised elevations?", sender: _participants.you, timestamp: _m(310), isOwn: true },
    { id: 'm3', content: 'RFI #14 response is attached.', sender: _participants.emily, timestamp: _m(300) },
  ],
};

function _autoMsgs(convId) {
  const conv = CONVERSATIONS.find(c => c.id === convId);
  if (!conv) return [];
  return [
    { id: 'a1', content: `Let's discuss "${conv.title}".`, sender: conv.participants[0], timestamp: _m(200) },
    { id: 'a2', content: 'Sounds good — what do you want to cover first?', sender: _participants.you, timestamp: _m(180), isOwn: true },
    { id: 'a3', content: conv.lastMessage, sender: conv.participants[0], timestamp: conv.timestamp },
  ];
}

function getMessages(convId) {
  return MESSAGES[convId] || _autoMsgs(convId);
}

function getProjectConversations(projectId) {
  return CONVERSATIONS.filter(c => c.projectId === projectId && !(c.type === 'direct'));
}
function getProjectDMs(projectId) {
  return CONVERSATIONS.filter(c => c.projectId === projectId && c.type === 'direct');
}
function getGlobalDMs() {
  return CONVERSATIONS.filter(c => c.type === 'direct' && c.projectId === '');
}
function getTotalUnread(projectId) {
  return CONVERSATIONS.filter(c => c.projectId === projectId).reduce((s, c) => s + c.unreadCount, 0);
}
function getUnreadBreakdown(projectId) {
  const cs = CONVERSATIONS.filter(c => c.projectId === projectId);
  return {
    project:     cs.filter(c => c.type === 'project').reduce((s, c) => s + c.unreadCount, 0),
    task:        cs.filter(c => c.type === 'task').reduce((s, c) => s + c.unreadCount, 0),
    procurement: cs.filter(c => c.type === 'procurement').reduce((s, c) => s + c.unreadCount, 0),
    'site-issue':cs.filter(c => c.type === 'site-issue').reduce((s, c) => s + c.unreadCount, 0),
    'custom-group': cs.filter(c => c.type === 'custom-group').reduce((s, c) => s + c.unreadCount, 0),
    direct:      cs.filter(c => c.type === 'direct').reduce((s, c) => s + c.unreadCount, 0),
  };
}
function autoSelectConv(projectId) {
  const cs = getProjectConversations(projectId);
  if (!cs.length) return '';
  const cu = cs.find(c => c.priority === 'critical' && c.unreadCount > 0);
  if (cu) return cu.id;
  const u = cs.find(c => c.unreadCount > 0);
  if (u) return u.id;
  const cr = cs.find(c => c.priority === 'critical');
  if (cr) return cr.id;
  const pc = cs.find(c => c.type === 'project');
  if (pc) return pc.id;
  return cs[0].id;
}

function fmtRelative(d) {
  const diff = Date.now() - d.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'now';
  if (mins < 60) return mins + 'm';
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return hrs + 'h';
  return Math.floor(hrs / 24) + 'd';
}
function fmtTime(d) {
  return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}
function fmtDay(d) {
  const today = new Date();
  const isToday = d.toDateString() === today.toDateString();
  const yest = new Date(today); yest.setDate(today.getDate() - 1);
  const isYest = d.toDateString() === yest.toDateString();
  if (isToday) return 'Today';
  if (isYest) return 'Yesterday';
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
}

window.MeccaData = {
  PRIORITY_PROJECTS, CONVERSATIONS, MESSAGES, participants: _participants,
  getMessages, getProjectConversations, getProjectDMs, getGlobalDMs,
  getTotalUnread, getUnreadBreakdown, autoSelectConv,
  fmtRelative, fmtTime, fmtDay,
};
