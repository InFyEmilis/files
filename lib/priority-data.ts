export type PriorityLevel = 'critical' | 'high' | 'normal' | 'healthy'
export type ProjectStatus = 'active' | 'on-hold' | 'at-risk' | 'completed'

export interface PriorityItem {
  id: string
  type: 'task' | 'procurement' | 'site-issue' | 'file' | 'chat'
  title: string
  dueDate?: string
  status: string
  assignedTo?: string
  assignedAvatar?: string
  priority: 'critical' | 'high' | 'normal'
  chatId?: string
}

export interface ProjectPriority {
  id: string
  name: string
  initials: string
  status: ProjectStatus
  priorityLevel: PriorityLevel
  manager: string
  managerAvatar: string
  priorityReason: string

  // Counts
  totalTasks: number
  openTasks: number
  overdueTasks: number
  dueTodayTasks: number
  unreadMessages: number
  pendingApprovals: number
  procurementAlerts: number
  siteIssues: number

  // Flags
  hasBlocker: boolean
  hasWaitingApproval: boolean
  hasProcurementAlert: boolean
  hasSiteIssue: boolean

  // Accent color for initials bg
  color: string

  relatedItems: PriorityItem[]
}

export const priorityProjects: ProjectPriority[] = [
  {
    id: 'pp1',
    name: 'Mecca HQ Renovation',
    initials: 'MH',
    status: 'at-risk',
    priorityLevel: 'critical',
    manager: 'Sarah Chen',
    managerAvatar: 'SC',
    priorityReason: '4 overdue tasks',
    totalTasks: 34,
    openTasks: 12,
    overdueTasks: 4,
    dueTodayTasks: 2,
    unreadMessages: 7,
    pendingApprovals: 2,
    procurementAlerts: 1,
    siteIssues: 1,
    hasBlocker: true,
    hasWaitingApproval: true,
    hasProcurementAlert: true,
    hasSiteIssue: true,
    color: '#ef4444',
    relatedItems: [
      { id: 'ri1', type: 'task', title: 'Finish wall framing - Level 3', dueDate: '2 days ago', status: 'Overdue', assignedTo: 'John M.', assignedAvatar: 'JM', priority: 'critical' },
      { id: 'ri2', type: 'procurement', title: 'Lighting fixture quote approval', status: 'Waiting Approval', assignedTo: 'David Kim', assignedAvatar: 'DK', priority: 'high' },
      { id: 'ri3', type: 'site-issue', title: 'Water leak near storage wall', status: 'Critical', assignedTo: 'Mike R.', assignedAvatar: 'MR', priority: 'critical' },
      { id: 'ri4', type: 'chat', title: 'Unread task discussion — Foundation', status: '7 unread', priority: 'high' },
    ],
  },
  {
    id: 'pp2',
    name: 'Downtown Retail Build',
    initials: 'DR',
    status: 'at-risk',
    priorityLevel: 'critical',
    manager: 'Mike Rodriguez',
    managerAvatar: 'MR',
    priorityReason: 'Site issue open',
    totalTasks: 28,
    openTasks: 9,
    overdueTasks: 2,
    dueTodayTasks: 1,
    unreadMessages: 3,
    pendingApprovals: 0,
    procurementAlerts: 3,
    siteIssues: 2,
    hasBlocker: true,
    hasWaitingApproval: false,
    hasProcurementAlert: true,
    hasSiteIssue: true,
    color: '#ef4444',
    relatedItems: [
      { id: 'ri5', type: 'site-issue', title: 'Structural crack in east wall', status: 'Critical', assignedTo: 'James W.', assignedAvatar: 'JW', priority: 'critical' },
      { id: 'ri6', type: 'procurement', title: 'Steel beam order — 3 quotes pending', status: 'Pending', assignedTo: 'David Kim', assignedAvatar: 'DK', priority: 'high' },
      { id: 'ri7', type: 'task', title: 'Electrical rough-in inspection', dueDate: 'Today', status: 'Due Today', assignedTo: 'Lisa P.', assignedAvatar: 'LP', priority: 'high' },
    ],
  },
  {
    id: 'pp3',
    name: 'North Miami Office',
    initials: 'NM',
    status: 'active',
    priorityLevel: 'high',
    manager: 'Emily Johnson',
    managerAvatar: 'EJ',
    priorityReason: '2 quotes pending',
    totalTasks: 21,
    openTasks: 6,
    overdueTasks: 1,
    dueTodayTasks: 2,
    unreadMessages: 5,
    pendingApprovals: 3,
    procurementAlerts: 2,
    siteIssues: 0,
    hasBlocker: false,
    hasWaitingApproval: true,
    hasProcurementAlert: true,
    hasSiteIssue: false,
    color: '#f97316',
    relatedItems: [
      { id: 'ri8', type: 'procurement', title: 'HVAC unit — quote approval needed', status: 'Waiting Approval', assignedTo: 'David Kim', assignedAvatar: 'DK', priority: 'high' },
      { id: 'ri9', type: 'task', title: 'MEP coordination sign-off', dueDate: 'Today', status: 'Due Today', assignedTo: 'Lisa P.', assignedAvatar: 'LP', priority: 'high' },
      { id: 'ri10', type: 'file', title: 'Revised floor plan v4 — needs review', status: 'Pending Review', assignedTo: 'Emily J.', assignedAvatar: 'EJ', priority: 'normal' },
    ],
  },
  {
    id: 'pp4',
    name: 'Wynwood Restaurant',
    initials: 'WR',
    status: 'active',
    priorityLevel: 'high',
    manager: 'David Kim',
    managerAvatar: 'DK',
    priorityReason: 'Approval blocking order',
    totalTasks: 18,
    openTasks: 7,
    overdueTasks: 0,
    dueTodayTasks: 3,
    unreadMessages: 2,
    pendingApprovals: 4,
    procurementAlerts: 0,
    siteIssues: 0,
    hasBlocker: false,
    hasWaitingApproval: true,
    hasProcurementAlert: false,
    hasSiteIssue: false,
    color: '#f59e0b',
    relatedItems: [
      { id: 'ri11', type: 'procurement', title: 'Custom millwork approval required', status: 'Waiting Approval', assignedTo: 'Sarah C.', assignedAvatar: 'SC', priority: 'high' },
      { id: 'ri12', type: 'task', title: 'Kitchen hood installation', dueDate: 'Today', status: 'Due Today', assignedTo: 'Mike R.', assignedAvatar: 'MR', priority: 'high' },
      { id: 'ri13', type: 'task', title: 'Health dept inspection prep', dueDate: 'Today', status: 'Due Today', assignedTo: 'James W.', assignedAvatar: 'JW', priority: 'high' },
    ],
  },
  {
    id: 'pp5',
    name: 'Brickell Apartment',
    initials: 'BA',
    status: 'active',
    priorityLevel: 'normal',
    manager: 'James Wilson',
    managerAvatar: 'JW',
    priorityReason: '5 open tasks',
    totalTasks: 42,
    openTasks: 5,
    overdueTasks: 0,
    dueTodayTasks: 1,
    unreadMessages: 0,
    pendingApprovals: 1,
    procurementAlerts: 0,
    siteIssues: 0,
    hasBlocker: false,
    hasWaitingApproval: false,
    hasProcurementAlert: false,
    hasSiteIssue: false,
    color: '#3b82f6',
    relatedItems: [
      { id: 'ri14', type: 'task', title: 'Flooring installation — Unit 4B', dueDate: 'Today', status: 'Due Today', assignedTo: 'Mike R.', assignedAvatar: 'MR', priority: 'normal' },
      { id: 'ri15', type: 'procurement', title: 'Tile order — final quantity confirm', status: 'Pending', assignedTo: 'David K.', assignedAvatar: 'DK', priority: 'normal' },
    ],
  },
  {
    id: 'pp6',
    name: 'Coral Gables Villa',
    initials: 'CG',
    status: 'active',
    priorityLevel: 'high',
    manager: 'Lisa Park',
    managerAvatar: 'LP',
    priorityReason: '3 overdue tasks',
    totalTasks: 26,
    openTasks: 8,
    overdueTasks: 3,
    dueTodayTasks: 0,
    unreadMessages: 4,
    pendingApprovals: 0,
    procurementAlerts: 1,
    siteIssues: 1,
    hasBlocker: false,
    hasWaitingApproval: false,
    hasProcurementAlert: true,
    hasSiteIssue: true,
    color: '#8b5cf6',
    relatedItems: [
      { id: 'ri16', type: 'task', title: 'Pool deck waterproofing', dueDate: '3 days ago', status: 'Overdue', assignedTo: 'Mike R.', assignedAvatar: 'MR', priority: 'high' },
      { id: 'ri17', type: 'site-issue', title: 'Drainage blockage - rear yard', status: 'Open', assignedTo: 'James W.', assignedAvatar: 'JW', priority: 'high' },
      { id: 'ri18', type: 'procurement', title: 'Marble supplier lead time extended', status: 'Alert', assignedTo: 'David K.', assignedAvatar: 'DK', priority: 'high' },
    ],
  },
  {
    id: 'pp7',
    name: 'Design Studio Buildout',
    initials: 'DS',
    status: 'active',
    priorityLevel: 'normal',
    manager: 'Emily Johnson',
    managerAvatar: 'EJ',
    priorityReason: 'Task due today',
    totalTasks: 15,
    openTasks: 4,
    overdueTasks: 0,
    dueTodayTasks: 2,
    unreadMessages: 1,
    pendingApprovals: 0,
    procurementAlerts: 0,
    siteIssues: 0,
    hasBlocker: false,
    hasWaitingApproval: false,
    hasProcurementAlert: false,
    hasSiteIssue: false,
    color: '#06b6d4',
    relatedItems: [
      { id: 'ri19', type: 'task', title: 'Glass partition install', dueDate: 'Today', status: 'Due Today', assignedTo: 'Mike R.', assignedAvatar: 'MR', priority: 'normal' },
      { id: 'ri20', type: 'task', title: 'Final electrical walkthrough', dueDate: 'Today', status: 'Due Today', assignedTo: 'Lisa P.', assignedAvatar: 'LP', priority: 'normal' },
    ],
  },
  {
    id: 'pp8',
    name: 'Warehouse Conversion',
    initials: 'WC',
    status: 'at-risk',
    priorityLevel: 'critical',
    manager: 'Mike Rodriguez',
    managerAvatar: 'MR',
    priorityReason: 'Blocker — permit hold',
    totalTasks: 31,
    openTasks: 14,
    overdueTasks: 5,
    dueTodayTasks: 0,
    unreadMessages: 9,
    pendingApprovals: 1,
    procurementAlerts: 2,
    siteIssues: 3,
    hasBlocker: true,
    hasWaitingApproval: true,
    hasProcurementAlert: true,
    hasSiteIssue: true,
    color: '#ef4444',
    relatedItems: [
      { id: 'ri21', type: 'task', title: 'Permit resubmission — zoning', dueDate: '5 days ago', status: 'Overdue', assignedTo: 'Sarah C.', assignedAvatar: 'SC', priority: 'critical' },
      { id: 'ri22', type: 'site-issue', title: 'Roof structural assessment needed', status: 'Critical', assignedTo: 'James W.', assignedAvatar: 'JW', priority: 'critical' },
      { id: 'ri23', type: 'procurement', title: 'Structural steel — supplier on hold', status: 'Blocked', assignedTo: 'David K.', assignedAvatar: 'DK', priority: 'critical' },
      { id: 'ri24', type: 'chat', title: 'Unread manager escalation message', status: '9 unread', priority: 'critical' },
    ],
  },
  {
    id: 'pp9',
    name: 'Sunset Harbor Residences',
    initials: 'SH',
    status: 'active',
    priorityLevel: 'normal',
    manager: 'Carlos Rivera',
    managerAvatar: 'CR',
    priorityReason: 'Foundation phase active',
    totalTasks: 19,
    openTasks: 3,
    overdueTasks: 0,
    dueTodayTasks: 0,
    unreadMessages: 0,
    pendingApprovals: 0,
    procurementAlerts: 0,
    siteIssues: 0,
    hasBlocker: false,
    hasWaitingApproval: false,
    hasProcurementAlert: false,
    hasSiteIssue: false,
    color: '#10b981',
    relatedItems: [
      { id: 'ri25', type: 'task', title: 'Foundation excavation sign-off', dueDate: 'In progress', status: 'Open', assignedTo: 'Ben N.', assignedAvatar: 'BN', priority: 'normal' },
    ],
  },
  {
    id: 'pp10',
    name: 'Midtown Medical Clinic',
    initials: 'MM',
    status: 'active',
    priorityLevel: 'high',
    manager: 'Anna Torres',
    managerAvatar: 'AT',
    priorityReason: 'Quote approval needed',
    totalTasks: 22,
    openTasks: 6,
    overdueTasks: 0,
    dueTodayTasks: 1,
    unreadMessages: 3,
    pendingApprovals: 2,
    procurementAlerts: 1,
    siteIssues: 1,
    hasBlocker: false,
    hasWaitingApproval: true,
    hasProcurementAlert: true,
    hasSiteIssue: true,
    color: '#f97316',
    relatedItems: [
      { id: 'ri27', type: 'procurement', title: 'Medical-grade flooring quote', status: 'Waiting Approval', assignedTo: 'David K.', assignedAvatar: 'DK', priority: 'high' },
      { id: 'ri28', type: 'site-issue', title: 'Ceiling tile damage — Room 3', status: 'Open', assignedTo: 'Lisa P.', assignedAvatar: 'LP', priority: 'high' },
    ],
  },
  {
    id: 'pp11',
    name: 'Overtown Mixed-Use',
    initials: 'OM',
    status: 'active',
    priorityLevel: 'normal',
    manager: 'Emily Johnson',
    managerAvatar: 'EJ',
    priorityReason: 'Drawing review in progress',
    totalTasks: 17,
    openTasks: 4,
    overdueTasks: 0,
    dueTodayTasks: 0,
    unreadMessages: 0,
    pendingApprovals: 0,
    procurementAlerts: 0,
    siteIssues: 0,
    hasBlocker: false,
    hasWaitingApproval: false,
    hasProcurementAlert: false,
    hasSiteIssue: false,
    color: '#3b82f6',
    relatedItems: [
      { id: 'ri30', type: 'task', title: 'Review structural drawings', status: 'In Progress', assignedTo: 'Emily J.', assignedAvatar: 'EJ', priority: 'normal' },
    ],
  },
  {
    id: 'pp12',
    name: 'Bayfront Hotel Renovation',
    initials: 'BH',
    status: 'at-risk',
    priorityLevel: 'critical',
    manager: 'Sarah Chen',
    managerAvatar: 'SC',
    priorityReason: 'Elevator shaft safety issue',
    totalTasks: 24,
    openTasks: 7,
    overdueTasks: 0,
    dueTodayTasks: 1,
    unreadMessages: 9,
    pendingApprovals: 1,
    procurementAlerts: 1,
    siteIssues: 1,
    hasBlocker: true,
    hasWaitingApproval: true,
    hasProcurementAlert: true,
    hasSiteIssue: true,
    color: '#ef4444',
    relatedItems: [
      { id: 'ri31', type: 'site-issue', title: 'Elevator shaft obstruction', status: 'Critical', assignedTo: 'Mike R.', assignedAvatar: 'MR', priority: 'critical' },
      { id: 'ri32', type: 'procurement', title: 'Lobby furniture order', status: 'Waiting Approval', assignedTo: 'David K.', assignedAvatar: 'DK', priority: 'high' },
      { id: 'ri33', type: 'task', title: 'Fire suppression test', status: 'In Progress', assignedTo: 'James W.', assignedAvatar: 'JW', priority: 'high' },
    ],
  },
  {
    id: 'pp13',
    name: 'Edgewater Condos',
    initials: 'EC',
    status: 'active',
    priorityLevel: 'normal',
    manager: 'Carlos Rivera',
    managerAvatar: 'CR',
    priorityReason: 'Drywall on schedule',
    totalTasks: 20,
    openTasks: 5,
    overdueTasks: 0,
    dueTodayTasks: 0,
    unreadMessages: 0,
    pendingApprovals: 0,
    procurementAlerts: 0,
    siteIssues: 0,
    hasBlocker: false,
    hasWaitingApproval: false,
    hasProcurementAlert: false,
    hasSiteIssue: false,
    color: '#06b6d4',
    relatedItems: [
      { id: 'ri34', type: 'task', title: 'Drywall — floors 4-7', status: 'In Progress', assignedTo: 'Mike R.', assignedAvatar: 'MR', priority: 'normal' },
    ],
  },
  {
    id: 'pp14',
    name: 'Airport Cargo Terminal',
    initials: 'AC',
    status: 'active',
    priorityLevel: 'normal',
    manager: 'Ben Nakamura',
    managerAvatar: 'BN',
    priorityReason: 'Steel erection phase',
    totalTasks: 28,
    openTasks: 8,
    overdueTasks: 0,
    dueTodayTasks: 0,
    unreadMessages: 1,
    pendingApprovals: 0,
    procurementAlerts: 1,
    siteIssues: 0,
    hasBlocker: false,
    hasWaitingApproval: false,
    hasProcurementAlert: true,
    hasSiteIssue: false,
    color: '#64748b',
    relatedItems: [
      { id: 'ri35', type: 'task', title: 'Steel erection — Phase 2', status: 'Upcoming', assignedTo: 'James W.', assignedAvatar: 'JW', priority: 'normal' },
      { id: 'ri36', type: 'procurement', title: 'Crane rental — 3 quotes', status: 'Pending', assignedTo: 'David K.', assignedAvatar: 'DK', priority: 'normal' },
    ],
  },
  {
    id: 'pp15',
    name: 'Lincoln Road Pop-Up',
    initials: 'LR',
    status: 'active',
    priorityLevel: 'normal',
    manager: 'Anna Torres',
    managerAvatar: 'AT',
    priorityReason: 'Install phase starting',
    totalTasks: 9,
    openTasks: 2,
    overdueTasks: 0,
    dueTodayTasks: 1,
    unreadMessages: 0,
    pendingApprovals: 0,
    procurementAlerts: 0,
    siteIssues: 0,
    hasBlocker: false,
    hasWaitingApproval: false,
    hasProcurementAlert: false,
    hasSiteIssue: false,
    color: '#f43f5e',
    relatedItems: [
      { id: 'ri37', type: 'task', title: 'Fixture installation', status: 'Due Tomorrow', assignedTo: 'Mike R.', assignedAvatar: 'MR', priority: 'normal' },
    ],
  },
]

export type FilterChip = 'all' | 'critical' | 'due-today' | 'overdue' | 'waiting-approval' | 'procurement' | 'site-issues' | 'my-projects'

export function filterProjects(projects: ProjectPriority[], chip: FilterChip, search: string): ProjectPriority[] {
  let filtered = projects

  if (chip === 'critical') filtered = filtered.filter(p => p.priorityLevel === 'critical')
  else if (chip === 'due-today') filtered = filtered.filter(p => p.dueTodayTasks > 0)
  else if (chip === 'overdue') filtered = filtered.filter(p => p.overdueTasks > 0)
  else if (chip === 'waiting-approval') filtered = filtered.filter(p => p.hasWaitingApproval)
  else if (chip === 'procurement') filtered = filtered.filter(p => p.hasProcurementAlert)
  else if (chip === 'site-issues') filtered = filtered.filter(p => p.hasSiteIssue)

  if (search.trim()) {
    const q = search.toLowerCase()
    filtered = filtered.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.manager.toLowerCase().includes(q) ||
      p.priorityReason.toLowerCase().includes(q)
    )
  }

  // Sort: critical first, then high, then normal
  const order = { critical: 0, high: 1, normal: 2, healthy: 3 }
  return filtered.sort((a, b) => order[a.priorityLevel] - order[b.priorityLevel])
}
