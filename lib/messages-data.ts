import { priorityProjects } from './priority-data'

// ─── Types ───────────────────────────────────────────────────────────────────

export type ConvType = 'project' | 'task' | 'procurement' | 'site-issue' | 'direct'
export type SelectedMode = 'project' | 'direct'
export type ConvPriority = 'critical' | 'high' | 'normal'
export type ConvPriorityLevel = 'p1' | 'p2' | 'p3' | 'none'
export type ConvStatus =
  | 'in-progress' | 'on-hold' | 'completed' | 'not-started'
  | 'pending' | 'waiting-approval' | 'approved' | 'rejected'
  | 'open' | 'resolved' | 'escalated'

export interface Participant {
  name: string
  avatar: string
  role: string
}

export interface UnifiedMessage {
  id: string
  content: string
  sender: Participant
  timestamp: Date
  type: 'text' | 'image' | 'file' | 'video'
  isOwn?: boolean
  mediaUrl?: string
  mediaName?: string
  mediaThumbnail?: string
  mediaSize?: string
  mediaType?: string
}

export interface UnifiedConversation {
  id: string
  projectId: string
  type: ConvType
  title: string
  subtitle?: string
  lastMessage: string
  lastSender: string
  timestamp: Date
  unreadCount: number
  isArchived?: boolean
  priority: ConvPriority
  priorityLevel?: ConvPriorityLevel
  priorityRank?: number
  status?: ConvStatus
  linkedTaskId?: string
  linkedProcurementId?: string
  linkedSiteIssueId?: string
  participants: Participant[]
  channelKey: string
}

// ─── Participants ─────────────────────────────────────────────────────────────

const p = {
  sarah:  { name: 'Sarah Chen',     avatar: 'SC', role: 'Project Manager' },
  mike:   { name: 'Mike Rodriguez', avatar: 'MR', role: 'Site Superintendent' },
  david:  { name: 'David Kim',      avatar: 'DK', role: 'Procurement Lead' },
  emily:  { name: 'Emily Johnson',  avatar: 'EJ', role: 'Architect' },
  james:  { name: 'James Wilson',   avatar: 'JW', role: 'Structural Engineer' },
  lisa:   { name: 'Lisa Park',      avatar: 'LP', role: 'MEP Coordinator' },
  you:    { name: 'You',            avatar: 'ME', role: 'Project Manager' },
  carlos: { name: 'Carlos Rivera',  avatar: 'CR', role: 'General Contractor' },
  anna:   { name: 'Anna Torres',    avatar: 'AT', role: 'Interior Designer' },
  ben:    { name: 'Ben Nakamura',   avatar: 'BN', role: 'Civil Engineer' },
}

// ─── Helper: build a conversation ────────────────────────────────────────────

function conv(overrides: Partial<UnifiedConversation> & Pick<UnifiedConversation, 'id' | 'projectId' | 'type' | 'title' | 'lastMessage' | 'lastSender' | 'timestamp' | 'participants' | 'channelKey'>): UnifiedConversation {
  const base = { unreadCount: 0, priority: 'normal' as ConvPriority, ...overrides } as UnifiedConversation
  if (!base.priorityLevel) {
    const prio = base.priority; const u = base.unreadCount
    if (prio === 'critical')              base.priorityLevel = 'p1'
    else if (prio === 'high' && u > 0)    base.priorityLevel = 'p1'
    else if (prio === 'high')             base.priorityLevel = 'p2'
    else if (prio === 'normal' && u > 0)  base.priorityLevel = 'p2'
    else if (base.lastMessage)            base.priorityLevel = 'p3'
    else                                  base.priorityLevel = 'none'
  }
  return base
}

const now = Date.now()
const m = (minAgo: number) => new Date(now - minAgo * 60 * 1000)

// ─── Conversations for all 15 projects ───────────────────────────────────────

export const unifiedConversations: UnifiedConversation[] = [

  // ── pp1: Mecca HQ Renovation ──────────────────────────────────────────────
  conv({ id: 'c-pp1-proj',   projectId: 'pp1', type: 'project',     title: 'Project Chat',                        lastMessage: 'Site walk scheduled for 8AM tomorrow.',           lastSender: 'Sarah Chen',     timestamp: m(12),   unreadCount: 3,  priority: 'critical', participants: [p.sarah, p.mike, p.david, p.emily], channelKey: 'project:pp1' }),
  conv({ id: 'c-pp1-t1',     projectId: 'pp1', type: 'task',        title: 'Finish wall framing — Level 3',        lastMessage: 'Still waiting on lumber delivery.',               lastSender: 'Mike Rodriguez', timestamp: m(45),   unreadCount: 4,  priority: 'critical', subtitle: 'Overdue · Mike R.',         status: 'in-progress', participants: [p.mike, p.sarah],          channelKey: 'task:pp1-t1' }),
  conv({ id: 'c-pp1-t2',     projectId: 'pp1', type: 'task',        title: 'Upload progress photos — Level 2',     lastMessage: 'Photos uploaded to shared folder.',               lastSender: 'Lisa Park',      timestamp: m(120),  unreadCount: 0,  priority: 'high',     subtitle: 'Due today · Lisa P.',       status: 'in-progress', participants: [p.lisa, p.emily],          channelKey: 'task:pp1-t2' }),
  conv({ id: 'c-pp1-proc1',  projectId: 'pp1', type: 'procurement', title: 'Lighting fixture quote approval',       lastMessage: 'Quote from 3 vendors. Need sign-off today.',     lastSender: 'David Kim',      timestamp: m(30),   unreadCount: 2,  priority: 'high',     subtitle: 'Waiting approval · David K.', status: 'waiting-approval', participants: [p.david, p.sarah], channelKey: 'procurement:pp1-proc1' }),
  conv({ id: 'c-pp1-iss1',   projectId: 'pp1', type: 'site-issue',  title: 'Water leak near storage wall',         lastMessage: 'Plumber on-site. Temporary patch applied.',       lastSender: 'Mike Rodriguez', timestamp: m(18),   unreadCount: 1,  priority: 'critical', subtitle: 'Critical · Mike R.',        status: 'open',          participants: [p.mike, p.sarah, p.james], channelKey: 'siteIssue:pp1-iss1' }),

  // ── pp2: Downtown Retail Build ────────────────────────────────────────────
  conv({ id: 'c-pp2-proj',   projectId: 'pp2', type: 'project',     title: 'Project Chat',                        lastMessage: 'Owner visiting Friday at 2PM. Keep site clean.',  lastSender: 'Mike Rodriguez', timestamp: m(120),  unreadCount: 0,  priority: 'critical', participants: [p.mike, p.sarah, p.david, p.james], channelKey: 'project:pp2' }),
  conv({ id: 'c-pp2-iss1',   projectId: 'pp2', type: 'site-issue',  title: 'Structural crack — east wall',         lastMessage: 'Engineer assessed. Needs rebar reinforcement.',   lastSender: 'James Wilson',   timestamp: m(25),   unreadCount: 2,  priority: 'critical', subtitle: 'Critical · James W.',       status: 'escalated',     participants: [p.james, p.mike, p.sarah], channelKey: 'siteIssue:pp2-iss1' }),
  conv({ id: 'c-pp2-proc1',  projectId: 'pp2', type: 'procurement', title: 'Steel beam order — 3 quotes',          lastMessage: 'All 3 quotes received. Waiting comparison.',      lastSender: 'David Kim',      timestamp: m(180),  unreadCount: 1,  priority: 'high',     subtitle: 'Pending · David K.',        status: 'pending',        participants: [p.david, p.mike],          channelKey: 'procurement:pp2-proc1' }),
  conv({ id: 'c-pp2-t1',     projectId: 'pp2', type: 'task',        title: 'Electrical rough-in inspection',       lastMessage: 'Inspector confirmed for 10AM. Lisa on-site.',     lastSender: 'Lisa Park',      timestamp: m(90),   unreadCount: 0,  priority: 'high',     subtitle: 'Due today · Lisa P.',       status: 'in-progress',    participants: [p.lisa, p.mike],           channelKey: 'task:pp2-t1' }),

  // ── pp3: North Miami Office ───────────────────────────────────────────────
  conv({ id: 'c-pp3-proj',   projectId: 'pp3', type: 'project',     title: 'Project Chat',                        lastMessage: 'MEP sign-off meeting moved to Thursday.',        lastSender: 'Emily Johnson',  timestamp: m(240),  unreadCount: 2,  priority: 'high',     participants: [p.emily, p.lisa, p.david, p.sarah], channelKey: 'project:pp3' }),
  conv({ id: 'c-pp3-proc1',  projectId: 'pp3', type: 'procurement', title: 'HVAC unit — quote approval',           lastMessage: 'Best quote attached. Please approve.',           lastSender: 'David Kim',      timestamp: m(50),   unreadCount: 3,  priority: 'high',     subtitle: 'Waiting approval · David K.', status: 'waiting-approval', participants: [p.david, p.emily], channelKey: 'procurement:pp3-proc1' }),
  conv({ id: 'c-pp3-t1',     projectId: 'pp3', type: 'task',        title: 'MEP coordination sign-off',            lastMessage: 'Checklist done. Waiting for Emily final sign-off.', lastSender: 'Lisa Park',   timestamp: m(300),  unreadCount: 0,  priority: 'high',     subtitle: 'Due today · Lisa P.',       status: 'in-progress',    participants: [p.lisa, p.emily],          channelKey: 'task:pp3-t1' }),

  // ── pp4: Wynwood Restaurant ───────────────────────────────────────────────
  conv({ id: 'c-pp4-proj',   projectId: 'pp4', type: 'project',     title: 'Project Chat',                        lastMessage: 'Kitchen hood install is starting tomorrow.',      lastSender: 'David Kim',      timestamp: m(60),   unreadCount: 2,  priority: 'high',     participants: [p.david, p.mike, p.james], channelKey: 'project:pp4' }),
  conv({ id: 'c-pp4-proc1',  projectId: 'pp4', type: 'procurement', title: 'Custom millwork approval',             lastMessage: 'Approval needed before supplier confirms order.', lastSender: 'David Kim',      timestamp: m(40),   unreadCount: 2,  priority: 'high',     subtitle: 'Waiting approval',          status: 'waiting-approval', participants: [p.david, p.sarah],  channelKey: 'procurement:pp4-proc1' }),
  conv({ id: 'c-pp4-t1',     projectId: 'pp4', type: 'task',        title: 'Health dept inspection prep',          lastMessage: 'Checklist half done. Need 2 more items cleared.', lastSender: 'James Wilson',   timestamp: m(80),   unreadCount: 0,  priority: 'high',     subtitle: 'Due today · James W.',      status: 'in-progress',    participants: [p.james, p.david],         channelKey: 'task:pp4-t1' }),

  // ── pp5: Brickell Apartment ───────────────────────────────────────────────
  conv({ id: 'c-pp5-proj',   projectId: 'pp5', type: 'project',     title: 'Project Chat',                        lastMessage: 'Flooring starts unit 4B tomorrow.',              lastSender: 'James Wilson',   timestamp: m(400),  unreadCount: 0,  priority: 'normal',   participants: [p.james, p.mike, p.david], channelKey: 'project:pp5' }),
  conv({ id: 'c-pp5-t1',     projectId: 'pp5', type: 'task',        title: 'Flooring installation — Unit 4B',      lastMessage: 'Material on-site. Ready to begin.',              lastSender: 'Mike Rodriguez', timestamp: m(350),  unreadCount: 0,  priority: 'normal',   subtitle: 'Due today',                 status: 'in-progress',    participants: [p.mike, p.james],          channelKey: 'task:pp5-t1' }),
  conv({ id: 'c-pp5-proc1',  projectId: 'pp5', type: 'procurement', title: 'Tile order — quantity confirm',        lastMessage: 'Waiting on your final count before placing order.', lastSender: 'David Kim',   timestamp: m(500),  unreadCount: 0,  priority: 'normal',   subtitle: 'Pending · David K.',        status: 'pending',        participants: [p.david, p.james],         channelKey: 'procurement:pp5-proc1' }),

  // ── pp6: Coral Gables Villa ───────────────────────────────────────────────
  conv({ id: 'c-pp6-proj',   projectId: 'pp6', type: 'project',     title: 'Project Chat',                        lastMessage: 'Pool deck crew ready. Waiting on weather.',      lastSender: 'Lisa Park',      timestamp: m(55),   unreadCount: 4,  priority: 'high',     participants: [p.lisa, p.mike, p.david], channelKey: 'project:pp6' }),
  conv({ id: 'c-pp6-t1',     projectId: 'pp6', type: 'task',        title: 'Pool deck waterproofing',              lastMessage: 'Rain pushed us back. Rescheduled for Friday.',   lastSender: 'Mike Rodriguez', timestamp: m(70),   unreadCount: 2,  priority: 'high',     subtitle: 'Overdue 3d · Mike R.',      status: 'on-hold',        participants: [p.mike, p.lisa],           channelKey: 'task:pp6-t1' }),
  conv({ id: 'c-pp6-iss1',   projectId: 'pp6', type: 'site-issue',  title: 'Drainage blockage — rear yard',        lastMessage: 'Plumber cleared partial blockage. Monitoring.', lastSender: 'James Wilson',   timestamp: m(200),  unreadCount: 0,  priority: 'high',     subtitle: 'Open · James W.',           status: 'open',           participants: [p.james, p.lisa],          channelKey: 'siteIssue:pp6-iss1' }),
  conv({ id: 'c-pp6-proc1',  projectId: 'pp6', type: 'procurement', title: 'Marble supplier lead time alert',      lastMessage: 'Supplier extended lead by 3 weeks. Need alt.',   lastSender: 'David Kim',      timestamp: m(160),  unreadCount: 2,  priority: 'high',     subtitle: 'Alert · David K.',          status: 'pending',        participants: [p.david, p.lisa],          channelKey: 'procurement:pp6-proc1' }),

  // ── pp7: Design Studio Buildout ───────────────────────────────────────────
  conv({ id: 'c-pp7-proj',   projectId: 'pp7', type: 'project',     title: 'Project Chat',                        lastMessage: 'Glass partition delivery confirmed.',            lastSender: 'Emily Johnson',  timestamp: m(480),  unreadCount: 1,  priority: 'normal',   participants: [p.emily, p.mike, p.lisa], channelKey: 'project:pp7' }),
  conv({ id: 'c-pp7-t1',     projectId: 'pp7', type: 'task',        title: 'Glass partition install',              lastMessage: 'Crew prepped. Starting at 8AM.',                lastSender: 'Mike Rodriguez', timestamp: m(450),  unreadCount: 0,  priority: 'normal',   subtitle: 'Due today',                 status: 'not-started',    participants: [p.mike, p.emily],          channelKey: 'task:pp7-t1' }),
  conv({ id: 'c-pp7-t2',     projectId: 'pp7', type: 'task',        title: 'Final electrical walkthrough',         lastMessage: 'Walkthrough scheduled for 4PM today.',           lastSender: 'Lisa Park',      timestamp: m(420),  unreadCount: 0,  priority: 'normal',   subtitle: 'Due today',                 status: 'not-started',    participants: [p.lisa, p.emily],          channelKey: 'task:pp7-t2' }),

  // ── pp8: Warehouse Conversion ─────────────────────────────────────────────
  conv({ id: 'c-pp8-proj',   projectId: 'pp8', type: 'project',     title: 'Project Chat',                        lastMessage: 'Permit still on hold. Awaiting zoning response.', lastSender: 'Sarah Chen',   timestamp: m(20),   unreadCount: 5,  priority: 'critical', participants: [p.sarah, p.mike, p.james, p.david], channelKey: 'project:pp8' }),
  conv({ id: 'c-pp8-t1',     projectId: 'pp8', type: 'task',        title: 'Permit resubmission — zoning',         lastMessage: 'Application resubmitted. Response in 3 days.',  lastSender: 'Sarah Chen',     timestamp: m(360),  unreadCount: 2,  priority: 'critical', subtitle: 'Overdue 5d · Sarah C.',     status: 'in-progress',    participants: [p.sarah, p.james],         channelKey: 'task:pp8-t1' }),
  conv({ id: 'c-pp8-iss1',   projectId: 'pp8', type: 'site-issue',  title: 'Roof structural assessment',           lastMessage: 'Engineer arriving Monday. Zones 2-4 halted.',   lastSender: 'James Wilson',   timestamp: m(35),   unreadCount: 4,  priority: 'critical', subtitle: 'Critical · James W.',       status: 'open',           participants: [p.james, p.mike],          channelKey: 'siteIssue:pp8-iss1' }),
  conv({ id: 'c-pp8-proc1',  projectId: 'pp8', type: 'procurement', title: 'Structural steel — on hold',           lastMessage: 'Supplier waiting on permit clearance.',         lastSender: 'David Kim',      timestamp: m(120),  unreadCount: 0,  priority: 'critical', subtitle: 'Blocked · David K.',        status: 'pending',        participants: [p.david, p.sarah],         channelKey: 'procurement:pp8-proc1' }),

  // ── pp9: Sunset Harbor Residences ─────────────────────────────────────────
  conv({ id: 'c-pp9-proj',   projectId: 'pp9', type: 'project',     title: 'Project Chat',                        lastMessage: 'Foundation crew confirmed for Monday.',          lastSender: 'Carlos Rivera',  timestamp: m(140),  unreadCount: 0,  priority: 'normal',   participants: [p.carlos, p.sarah, p.ben], channelKey: 'project:pp9' }),
  conv({ id: 'c-pp9-t1',     projectId: 'pp9', type: 'task',        title: 'Foundation excavation sign-off',       lastMessage: 'All soil tests passed. Ready for concrete pour.', lastSender: 'Ben Nakamura',  timestamp: m(200),  unreadCount: 0,  priority: 'normal',   subtitle: 'In progress',               status: 'in-progress',    participants: [p.ben, p.carlos],          channelKey: 'task:pp9-t1' }),

  // ── pp10: Midtown Medical Clinic ──────────────────────────────────────────
  conv({ id: 'c-pp10-proj',  projectId: 'pp10', type: 'project',    title: 'Project Chat',                        lastMessage: 'HVAC install complete. Electrical next.',        lastSender: 'Anna Torres',    timestamp: m(90),   unreadCount: 1,  priority: 'high',     participants: [p.anna, p.lisa, p.david], channelKey: 'project:pp10' }),
  conv({ id: 'c-pp10-proc1', projectId: 'pp10', type: 'procurement', title: 'Medical-grade flooring quote',        lastMessage: 'Spec sheet from 2 vendors. Need decision.',     lastSender: 'David Kim',      timestamp: m(75),   unreadCount: 2,  priority: 'high',     subtitle: 'Waiting approval',          status: 'waiting-approval', participants: [p.david, p.anna], channelKey: 'procurement:pp10-proc1' }),
  conv({ id: 'c-pp10-iss1',  projectId: 'pp10', type: 'site-issue', title: 'Ceiling tile damage — Room 3',         lastMessage: 'Water damage from above unit. Needs assessment.', lastSender: 'Lisa Park',    timestamp: m(110),  unreadCount: 1,  priority: 'high',     subtitle: 'Open',                      status: 'open',           participants: [p.lisa, p.anna],           channelKey: 'siteIssue:pp10-iss1' }),

  // ── pp11: Overtown Mixed-Use ──────────────────────────────────────────────
  conv({ id: 'c-pp11-proj',  projectId: 'pp11', type: 'project',    title: 'Project Chat',                        lastMessage: 'Structural drawings delivered. Review by Friday.',  lastSender: 'James Wilson', timestamp: m(500),  unreadCount: 0,  priority: 'normal',   participants: [p.james, p.emily, p.sarah], channelKey: 'project:pp11' }),
  conv({ id: 'c-pp11-t1',    projectId: 'pp11', type: 'task',       title: 'Review structural drawings',           lastMessage: 'Comments sent to engineer. Awaiting revision.',  lastSender: 'Emily Johnson',  timestamp: m(480),  unreadCount: 0,  priority: 'normal',   subtitle: 'In progress',               status: 'in-progress',    participants: [p.emily, p.james],         channelKey: 'task:pp11-t1' }),

  // ── pp12: Bayfront Hotel Renovation ──────────────────────────────────────
  conv({ id: 'c-pp12-proj',  projectId: 'pp12', type: 'project',    title: 'Project Chat',                        lastMessage: 'Guest floors reopening delayed by 2 weeks.',     lastSender: 'Sarah Chen',     timestamp: m(15),   unreadCount: 6,  priority: 'critical', participants: [p.sarah, p.anna, p.david, p.mike], channelKey: 'project:pp12' }),
  conv({ id: 'c-pp12-iss1',  projectId: 'pp12', type: 'site-issue', title: 'Elevator shaft obstruction',           lastMessage: 'Material staged in shaft. Must clear today.',   lastSender: 'Mike Rodriguez', timestamp: m(10),   unreadCount: 3,  priority: 'critical', subtitle: 'Critical — safety',         status: 'open',           participants: [p.mike, p.sarah],          channelKey: 'siteIssue:pp12-iss1' }),
  conv({ id: 'c-pp12-proc1', projectId: 'pp12', type: 'procurement', title: 'Lobby furniture order',               lastMessage: 'Lead time is 10 weeks. Approve now or delay.',  lastSender: 'David Kim',      timestamp: m(30),   unreadCount: 2,  priority: 'high',     subtitle: 'Waiting approval',          status: 'waiting-approval', participants: [p.david, p.anna], channelKey: 'procurement:pp12-proc1' }),
  conv({ id: 'c-pp12-t1',    projectId: 'pp12', type: 'task',       title: 'Fire suppression test',                lastMessage: 'Test passed floors 2-5. Floors 6-10 pending.',  lastSender: 'James Wilson',   timestamp: m(95),   unreadCount: 0,  priority: 'high',     subtitle: 'In progress · James W.',    status: 'in-progress',    participants: [p.james, p.mike],          channelKey: 'task:pp12-t1' }),

  // ── pp13: Edgewater Condos ────────────────────────────────────────────────
  conv({ id: 'c-pp13-proj',  projectId: 'pp13', type: 'project',    title: 'Project Chat',                        lastMessage: 'Drywall on schedule. Good progress.',            lastSender: 'Carlos Rivera',  timestamp: m(600),  unreadCount: 0,  priority: 'normal',   participants: [p.carlos, p.mike, p.james], channelKey: 'project:pp13' }),
  conv({ id: 'c-pp13-t1',    projectId: 'pp13', type: 'task',       title: 'Drywall — floors 4-7',                lastMessage: 'Crews at 80% completion on floor 6.',            lastSender: 'Mike Rodriguez', timestamp: m(580),  unreadCount: 0,  priority: 'normal',   subtitle: 'In progress',               status: 'in-progress',    participants: [p.mike, p.carlos],         channelKey: 'task:pp13-t1' }),

  // ── pp14: Airport Cargo Terminal ──────────────────────────────────────────
  conv({ id: 'c-pp14-proj',  projectId: 'pp14', type: 'project',    title: 'Project Chat',                        lastMessage: 'Steel erection on track. 60% complete.',         lastSender: 'Ben Nakamura',   timestamp: m(220),  unreadCount: 0,  priority: 'normal',   participants: [p.ben, p.james, p.sarah], channelKey: 'project:pp14' }),
  conv({ id: 'c-pp14-t1',    projectId: 'pp14', type: 'task',       title: 'Steel erection — Phase 2',             lastMessage: 'Phase 2 starts next week pending crane delivery.', lastSender: 'James Wilson', timestamp: m(210),  unreadCount: 0,  priority: 'normal',   subtitle: 'Upcoming',                  status: 'not-started',    participants: [p.james, p.ben],           channelKey: 'task:pp14-t1' }),
  conv({ id: 'c-pp14-proc1', projectId: 'pp14', type: 'procurement', title: 'Crane rental — 3 quotes',             lastMessage: 'National Crane is cheapest. Awaiting approval.', lastSender: 'David Kim',    timestamp: m(190),  unreadCount: 1,  priority: 'normal',   subtitle: 'Pending',                   status: 'pending',        participants: [p.david, p.ben],           channelKey: 'procurement:pp14-proc1' }),

  // ── pp15: Lincoln Road Pop-Up ─────────────────────────────────────────────
  conv({ id: 'c-pp15-proj',  projectId: 'pp15', type: 'project',    title: 'Project Chat',                        lastMessage: 'Client approved final layout. Proceed.',         lastSender: 'Anna Torres',    timestamp: m(700),  unreadCount: 0,  priority: 'normal',   participants: [p.anna, p.emily, p.david], channelKey: 'project:pp15' }),
  conv({ id: 'c-pp15-t1',    projectId: 'pp15', type: 'task',       title: 'Fixture installation',                 lastMessage: 'All fixtures on-site. Team briefed.',            lastSender: 'Mike Rodriguez', timestamp: m(680),  unreadCount: 0,  priority: 'normal',   subtitle: 'Due tomorrow',              status: 'not-started',    participants: [p.mike, p.anna],           channelKey: 'task:pp15-t1' }),

  // ── Global Direct Messages (no project) ───────────────────────────────────
  conv({ id: 'c-dm-sarah',   projectId: '', type: 'direct', title: 'Sarah Chen',     subtitle: 'Project Manager · Pinned',        lastMessage: 'Can you review the updated schedule before EOD?', lastSender: 'Sarah Chen',     timestamp: m(10),  unreadCount: 1, priority: 'normal', participants: [p.sarah], channelKey: 'direct:sarah' }),
  conv({ id: 'c-dm-david',   projectId: '', type: 'direct', title: 'David Kim',      subtitle: 'Procurement Lead',                lastMessage: 'PO sent. Should be in your inbox.',              lastSender: 'David Kim',      timestamp: m(180), unreadCount: 0, priority: 'normal', participants: [p.david], channelKey: 'direct:david' }),
  conv({ id: 'c-dm-mike',    projectId: '', type: 'direct', title: 'Mike Rodriguez', subtitle: 'Site Superintendent',             lastMessage: 'On my way to the site now.',                     lastSender: 'Mike Rodriguez', timestamp: m(60),  unreadCount: 0, priority: 'normal', participants: [p.mike],  channelKey: 'direct:mike' }),
  conv({ id: 'c-dm-emily',   projectId: '', type: 'direct', title: 'Emily Johnson',  subtitle: 'Architect · Pinned',              lastMessage: 'RFI #14 response is attached.',                  lastSender: 'Emily Johnson',  timestamp: m(300), unreadCount: 2, priority: 'normal', participants: [p.emily], channelKey: 'direct:emily' }),
  conv({ id: 'c-dm-james',   projectId: '', type: 'direct', title: 'James Wilson',   subtitle: 'Structural Engineer',             lastMessage: 'Revised load calculations sent.',                lastSender: 'James Wilson',   timestamp: m(420), unreadCount: 0, priority: 'normal', participants: [p.james], channelKey: 'direct:james' }),

  // ── Project-Context Direct Messages (linked to a project) ─────────────────
  conv({ id: 'c-pdm-pp1-sarah', projectId: 'pp1', type: 'direct', title: 'Sarah Chen',     subtitle: 'Direct · Mecca HQ Renovation · Project Manager',    lastMessage: 'Quick question on the Level 3 framing spec.',      lastSender: 'Sarah Chen',     timestamp: m(35),  unreadCount: 2, priority: 'normal', participants: [p.sarah], channelKey: 'pdirect:pp1-sarah' }),
  conv({ id: 'c-pdm-pp1-mike',  projectId: 'pp1', type: 'direct', title: 'Mike Rodriguez',  subtitle: 'Direct · Mecca HQ Renovation · Site Superintendent',  lastMessage: 'Lumber is here. Starting framing at 7AM.',          lastSender: 'Mike Rodriguez', timestamp: m(90),  unreadCount: 0, priority: 'normal', participants: [p.mike],  channelKey: 'pdirect:pp1-mike' }),
  conv({ id: 'c-pdm-pp2-james', projectId: 'pp2', type: 'direct', title: 'James Wilson',    subtitle: 'Direct · Downtown Retail Build · Structural Engineer', lastMessage: 'I need your sign-off on the rebar spec.',           lastSender: 'James Wilson',   timestamp: m(50),  unreadCount: 1, priority: 'normal', participants: [p.james], channelKey: 'pdirect:pp2-james' }),
  conv({ id: 'c-pdm-pp8-sarah', projectId: 'pp8', type: 'direct', title: 'Sarah Chen',     subtitle: 'Direct · Warehouse Conversion · Project Manager',    lastMessage: 'Zoning office called back. Update incoming.',        lastSender: 'Sarah Chen',     timestamp: m(22),  unreadCount: 3, priority: 'normal', participants: [p.sarah], channelKey: 'pdirect:pp8-sarah' }),
]

// ─── Mock messages per conversation ──────────────────────────────────────────

export const conversationMessages: Record<string, UnifiedMessage[]> = {
  'c-pp1-proj': [
    { id: 'm1', content: 'Morning team. Quick sync before we get started today.', sender: p.sarah, timestamp: m(180), type: 'text' },
    { id: 'm2', content: '@Mike Rodriguez how are we looking on Level 3 framing?', sender: p.sarah, timestamp: m(150), type: 'text' },
    { id: 'm3', content: 'Lumber delivery is delayed again. Following up with supplier by noon.', sender: p.mike, timestamp: m(120), type: 'text' },
    { id: 'm4', content: '@David Kim can you escalate to the backup supplier if needed?', sender: p.sarah, timestamp: m(60), type: 'text', isOwn: true },
    { id: 'm5', content: 'On it. I have a contact at Timber Pro. Will call now.', sender: p.david, timestamp: m(45), type: 'text' },
    { id: 'm6', content: 'Site walk scheduled for 8AM tomorrow.', sender: p.sarah, timestamp: m(12), type: 'text' },
  ],
  'c-pp1-t1': [
    { id: 'm1', content: 'Framing on Level 3 is blocked on lumber delivery.', sender: p.mike, timestamp: m(240), type: 'text' },
    { id: 'm2', content: 'How long have we been waiting?', sender: p.sarah, timestamp: m(210), type: 'text', isOwn: true },
    { id: 'm3', content: '3 days. Escalated twice. Supplier keeps pushing back.', sender: p.mike, timestamp: m(180), type: 'text' },
    { id: 'm4', content: 'Still waiting on lumber delivery before we can proceed.', sender: p.mike, timestamp: m(45), type: 'text' },
  ],
  'c-pp1-proc1': [
    { id: 'm1', content: 'Quotes from Lumina, BrightSpec, and ElectroSupply received.', sender: p.david, timestamp: m(120), type: 'text' },
    { id: 'm2', content: 'BrightSpec is lowest at $42,800 with 6-week lead time.', sender: p.david, timestamp: m(90), type: 'text' },
    { id: 'm3', content: 'Does the 6-week lead time work with our schedule?', sender: p.sarah, timestamp: m(60), type: 'text', isOwn: true },
    { id: 'm4', content: 'Quote from 3 vendors attached. Need sign-off today.', sender: p.david, timestamp: m(30), type: 'text' },
  ],
  'c-pp1-iss1': [
    { id: 'm1', content: 'Active water intrusion near storage wall on Level 1.', sender: p.mike, timestamp: m(90), type: 'text' },
    { id: 'm2', content: 'How bad? Any damage to materials?', sender: p.sarah, timestamp: m(80), type: 'text', isOwn: true },
    { id: 'm3', content: '@James Wilson I need you to assess the structural risk.', sender: p.mike, timestamp: m(70), type: 'text' },
    { id: 'm4', content: 'On my way. Keep the area clear.', sender: p.james, timestamp: m(60), type: 'text' },
    { id: 'm5', content: 'Plumber on-site. Temporary patch applied. Permanent fix tomorrow.', sender: p.mike, timestamp: m(18), type: 'text' },
  ],
  'c-pp2-iss1': [
    { id: 'm1', content: 'Crack is approx 4mm wide, vertical along east wall.', sender: p.james, timestamp: m(180), type: 'text' },
    { id: 'm2', content: 'All work in that zone stopped.', sender: p.mike, timestamp: m(150), type: 'text' },
    { id: 'm3', content: 'Has owner been notified yet?', sender: p.sarah, timestamp: m(120), type: 'text', isOwn: true },
    { id: 'm4', content: 'Not yet. Waiting for your go-ahead before we escalate.', sender: p.james, timestamp: m(40), type: 'text' },
    { id: 'm5', content: 'Engineer assessed. Needs rebar reinforcement before work continues.', sender: p.james, timestamp: m(25), type: 'text' },
  ],
  'c-pp8-proj': [
    { id: 'm1', content: 'Still no word from zoning. 3 weeks delayed now.', sender: p.sarah, timestamp: m(300), type: 'text' },
    { id: 'm2', content: 'Owner is getting impatient. Need status update by Friday.', sender: p.mike, timestamp: m(240), type: 'text' },
    { id: 'm3', content: 'I\'ll draft a report. James — can you include structural findings?', sender: p.sarah, timestamp: m(180), type: 'text', isOwn: true },
    { id: 'm4', content: 'Will do. Report ready by Thursday EOD.', sender: p.james, timestamp: m(150), type: 'text' },
    { id: 'm5', content: 'Permit still on hold. Awaiting zoning response.', sender: p.sarah, timestamp: m(20), type: 'text' },
  ],
  'c-pp12-proj': [
    { id: 'm1', content: 'Contractor flagged the elevator shaft issue. Must resolve today.', sender: p.mike, timestamp: m(120), type: 'text' },
    { id: 'm2', content: 'How critical is it? Can we get an inspector in?', sender: p.sarah, timestamp: m(90), type: 'text', isOwn: true },
    { id: 'm3', content: 'Yes — inspector confirmed for 2PM. All access to that zone is blocked.', sender: p.mike, timestamp: m(60), type: 'text' },
    { id: 'm4', content: 'Guest floors reopening delayed by 2 weeks.', sender: p.sarah, timestamp: m(15), type: 'text' },
  ],
  'c-pp12-iss1': [
    { id: 'm1', content: 'Material has been staged inside the elevator shaft. Safety hazard.', sender: p.mike, timestamp: m(60), type: 'text' },
    { id: 'm2', content: 'Who authorized that? Clear it immediately.', sender: p.sarah, timestamp: m(45), type: 'text', isOwn: true },
    { id: 'm3', content: 'Already on it. Crew clearing now. Should be done in 30 min.', sender: p.mike, timestamp: m(20), type: 'text' },
    { id: 'm4', content: 'Material staged in shaft. Must clear today.', sender: p.mike, timestamp: m(10), type: 'text' },
  ],
  'c-dm-sarah': [
    { id: 'm1', content: 'Hey, did you get the updated RFI from the architect?', sender: p.sarah, timestamp: m(120), type: 'text' },
    { id: 'm2', content: 'Yes, reviewing it now.', sender: p.you, timestamp: m(90), type: 'text', isOwn: true },
    { id: 'm3', content: 'Can you review the updated schedule before EOD?', sender: p.sarah, timestamp: m(10), type: 'text' },
  ],
  'c-dm-david': [
    { id: 'm1', content: 'The PO for Mecca HQ framing lumber is ready to send.', sender: p.david, timestamp: m(240), type: 'text' },
    { id: 'm2', content: 'Go ahead and send it.', sender: p.you, timestamp: m(210), type: 'text', isOwn: true },
    { id: 'm3', content: 'PO sent. Should be in your inbox.', sender: p.david, timestamp: m(180), type: 'text' },
  ],
  'c-dm-mike': [
    { id: 'm1', content: 'Leaving now. Should be on-site in 20 minutes.', sender: p.mike, timestamp: m(80), type: 'text' },
    { id: 'm2', content: 'Good. Gate code is 2847.', sender: p.you, timestamp: m(70), type: 'text', isOwn: true },
    { id: 'm3', content: 'On my way to the site now.', sender: p.mike, timestamp: m(60), type: 'text' },
  ],
  'c-dm-emily': [
    { id: 'm1', content: 'I sent over RFI #14 response. Let me know if you need the drawing set.', sender: p.emily, timestamp: m(320), type: 'text' },
    { id: 'm2', content: 'Got it, thanks. What\'s the turnaround on the revised elevations?', sender: p.you, timestamp: m(310), type: 'text', isOwn: true },
    { id: 'm3', content: 'RFI #14 response is attached.', sender: p.emily, timestamp: m(300), type: 'text' },
  ],
  'c-dm-james': [
    { id: 'm1', content: 'Revised load calculations sent over. Should cover floors 8-12.', sender: p.james, timestamp: m(420), type: 'text' },
    { id: 'm2', content: 'Perfect. I\'ll share with the GC today.', sender: p.you, timestamp: m(410), type: 'text', isOwn: true },
  ],
  'c-pdm-pp1-sarah': [
    { id: 'm1', content: 'Quick question on the Level 3 framing spec — does the revised drawing supersede sheet S-204?', sender: p.sarah, timestamp: m(50), type: 'text' },
    { id: 'm2', content: 'Yes, S-204 Rev B is current. The old one is obsolete.', sender: p.you, timestamp: m(40), type: 'text', isOwn: true },
    { id: 'm3', content: 'Quick question on the Level 3 framing spec.', sender: p.sarah, timestamp: m(35), type: 'text' },
  ],
  'c-pdm-pp1-mike': [
    { id: 'm1', content: 'Lumber arrived this morning. All 45 pieces counted and staged.', sender: p.mike, timestamp: m(100), type: 'text' },
    { id: 'm2', content: 'Great. Let\'s start framing Level 3 first thing.', sender: p.you, timestamp: m(95), type: 'text', isOwn: true },
    { id: 'm3', content: 'Lumber is here. Starting framing at 7AM.', sender: p.mike, timestamp: m(90), type: 'text' },
  ],
  'c-pdm-pp2-james': [
    { id: 'm1', content: 'I need your sign-off on the rebar spec before we order.', sender: p.james, timestamp: m(60), type: 'text' },
    { id: 'm2', content: 'Sending the spec sheet now.', sender: p.you, timestamp: m(55), type: 'text', isOwn: true },
    { id: 'm3', content: 'I need your sign-off on the rebar spec.', sender: p.james, timestamp: m(50), type: 'text' },
  ],
  'c-pdm-pp8-sarah': [
    { id: 'm1', content: 'Zoning office just called back. They want two additional documents.', sender: p.sarah, timestamp: m(30), type: 'text' },
    { id: 'm2', content: 'Which documents? I can pull them today.', sender: p.you, timestamp: m(25), type: 'text', isOwn: true },
    { id: 'm3', content: 'Zoning office called back. Update incoming.', sender: p.sarah, timestamp: m(22), type: 'text' },
  ],
}

// ─── Section grouping order ───────────────────────────────────────────────────

export type ConvFilter = 'all' | 'unread' | 'task' | 'procurement' | 'site-issue' | 'direct'

// ─── Auto-select: pick the most important conversation for a project ───────────

export function autoSelectConversation(projectId: string): string {
  const convs = unifiedConversations.filter(c => c.projectId === projectId && !c.isArchived)
  if (!convs.length) return ''

  // Priority: critical unread → any unread → critical → project chat → first
  const criticalUnread = convs.find(c => c.priority === 'critical' && c.unreadCount > 0)
  if (criticalUnread) return criticalUnread.id

  const anyUnread = convs.find(c => c.unreadCount > 0)
  if (anyUnread) return anyUnread.id

  const critical = convs.find(c => c.priority === 'critical')
  if (critical) return critical.id

  const projectChat = convs.find(c => c.type === 'project')
  if (projectChat) return projectChat.id

  return convs[0].id
}

// ─── Filter conversations ──────────────────────────────────────────────────────

export function getConversationsForProject(
  projectId: string,
  filter: ConvFilter,
  search: string
): UnifiedConversation[] {
  let list = projectId
    ? unifiedConversations.filter(c => c.projectId === projectId && !c.isArchived)
    : unifiedConversations.filter(c => !c.isArchived)

  // Exclude project-context DMs from the main count unless filter is 'direct'
  if (filter !== 'direct') {
    list = list.filter(c => !(c.type === 'direct' && c.projectId !== ''))
  }

  if (filter === 'unread')        list = list.filter(c => c.unreadCount > 0)
  else if (filter === 'task')     list = list.filter(c => c.type === 'task')
  else if (filter === 'procurement') list = list.filter(c => c.type === 'procurement')
  else if (filter === 'site-issue')  list = list.filter(c => c.type === 'site-issue')
  else if (filter === 'direct')   list = list.filter(c => c.type === 'direct')

  if (search.trim()) {
    const q = search.toLowerCase()
    list = list.filter(c =>
      c.title.toLowerCase().includes(q) ||
      c.lastMessage.toLowerCase().includes(q) ||
      c.subtitle?.toLowerCase().includes(q) ||
      c.participants.some(pp => pp.name.toLowerCase().includes(q))
    )
  }

  // Sort: p1 → p2 → p3 → none; within same level: unread first, then newest
  const lvlOrder: Record<string, number> = { p1: 0, p2: 1, p3: 2, none: 3 }
  return list.sort((a, b) => {
    const la = lvlOrder[a.priorityLevel ?? 'p3'] ?? 2
    const lb = lvlOrder[b.priorityLevel ?? 'p3'] ?? 2
    if (la !== lb) return la - lb
    if (b.unreadCount !== a.unreadCount) return b.unreadCount - a.unreadCount
    return b.timestamp.getTime() - a.timestamp.getTime()
  })
}

// ─── Unread total per project ──────────────────────────────────────────────────

export function getTotalUnreadForProject(projectId: string): number {
  return unifiedConversations
    .filter(c => c.projectId === projectId)
    .reduce((sum, c) => sum + c.unreadCount, 0)
}

// ─── Unread breakdown by conversation type ─────────────────────────────────────

export interface UnreadBreakdown {
  project:     number
  task:        number
  procurement: number
  siteIssue:   number
  direct:      number
}

export function getUnreadBreakdown(projectId: string): UnreadBreakdown {
  const convs = unifiedConversations.filter(c => c.projectId === projectId)
  return {
    project:     convs.filter(c => c.type === 'project').reduce((s, c) => s + c.unreadCount, 0),
    task:        convs.filter(c => c.type === 'task').reduce((s, c) => s + c.unreadCount, 0),
    procurement: convs.filter(c => c.type === 'procurement').reduce((s, c) => s + c.unreadCount, 0),
    siteIssue:   convs.filter(c => c.type === 'site-issue').reduce((s, c) => s + c.unreadCount, 0),
    direct:      convs.filter(c => c.type === 'direct').reduce((s, c) => s + c.unreadCount, 0),
  }
}

// ─── Global Direct Messages ────────────────────────────────────────────────────

export const pinnedDMIds = new Set(['c-dm-sarah', 'c-dm-emily'])

export function getGlobalDirectMessages(): UnifiedConversation[] {
  return unifiedConversations.filter(c => c.type === 'direct' && c.projectId === '')
}

export function getTotalUnreadDMs(): number {
  return getGlobalDirectMessages().reduce((sum, c) => sum + c.unreadCount, 0)
}

// ─── Project-context Direct Messages ──────────────────────────────────────────

export function getProjectDirectMessages(projectId: string): UnifiedConversation[] {
  return unifiedConversations.filter(
    c => c.type === 'direct' && c.projectId === projectId
  )
}

// ─── Default DM to auto-select ────────────────────────────────────────────────

export function autoSelectDM(): string {
  const dms = getGlobalDirectMessages()
  const unread = dms.find(c => c.unreadCount > 0)
  if (unread) return unread.id
  const pinned = dms.find(c => pinnedDMIds.has(c.id))
  if (pinned) return pinned.id
  return dms[0]?.id ?? ''
}

// ─── Relative time formatter ──────────────────────────────────────────────────

export function formatRelativeTime(date: Date): string {
  const diff = Date.now() - date.getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'now'
  if (mins < 60) return `${mins}m`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h`
  return `${Math.floor(hrs / 24)}d`
}
