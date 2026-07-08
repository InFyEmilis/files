// iPad Files workspace. Front-end only: mirrors the Option 1 file model with
// project-scoped mock data and leaves storage/Dropbox work behind service APIs.

const { useEffect: _fsE, useMemo: _fsM, useRef: _fsR, useState: _fsS } = React;

const _FsIc = ({ d, size = 18, stroke = 1.7 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">{d}</svg>
);

const FsI = {
  folder: p => <_FsIc {...p} d={<><path d="M3 7.5A2.5 2.5 0 0 1 5.5 5H10l2 2h6.5A2.5 2.5 0 0 1 21 9.5v7A2.5 2.5 0 0 1 18.5 19h-13A2.5 2.5 0 0 1 3 16.5z"/></>} />,
  file: p => <_FsIc {...p} d={<><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></>} />,
  image: p => <_FsIc {...p} d={<><rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="8.5" cy="10" r="1.5"/><path d="m21 15-4-4-5 5-2-2-5 5"/></>} />,
  plan: p => <_FsIc {...p} d={<><path d="M4 4h16v16H4z"/><path d="M8 4v16M4 9h16M13 9v11M13 14h7"/></>} />,
  chat: p => <_FsIc {...p} d={<><path d="M21 11.5a8.38 8.38 0 0 1-8.5 8.5 8.5 8.5 0 0 1-3.6-.8L3 21l1.9-5.7A8.38 8.38 0 0 1 4 11.5 8.5 8.5 0 0 1 12.5 3 8.38 8.38 0 0 1 21 11.5z"/></>} />,
  video: p => <_FsIc {...p} d={<><rect x="3" y="5" width="14" height="14" rx="2"/><path d="m17 9 4-2.5v11L17 15"/></>} />,
  sheet: p => <_FsIc {...p} d={<><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M8 13h8M8 17h8M11 10v10"/></>} />,
  presentation: p => <_FsIc {...p} d={<><path d="M4 4h16v12H4z"/><path d="M12 16v4M8 20h8"/><path d="M8 8h5M8 11h8"/></>} />,
  archive: p => <_FsIc {...p} d={<><path d="M5 7h14v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2z"/><path d="M8 7V3h8v4M10 11h4M10 15h4"/></>} />,
  link: p => <_FsIc {...p} d={<><path d="M10 13a5 5 0 0 0 7.1 0l2-2a5 5 0 0 0-7.1-7.1l-1.1 1.1"/><path d="M14 11a5 5 0 0 0-7.1 0l-2 2a5 5 0 0 0 7.1 7.1l1.1-1.1"/></>} />,
  edit: p => <_FsIc {...p} d={<><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/></>} />,
  move: p => <_FsIc {...p} d={<><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/><path d="M5 5v14"/></>} />,
  annotate: p => <_FsIc {...p} d={<><path d="M4 5h16v11H7l-3 3z"/><path d="M8 9h8M8 13h5"/></>} />,
  search: p => <_FsIc {...p} d={<><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></>} />,
  upload: p => <_FsIc {...p} d={<><path d="M12 16V4"/><path d="m7 9 5-5 5 5"/><path d="M20 16v3a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-3"/></>} />,
  plus: p => <_FsIc {...p} d={<><path d="M12 5v14M5 12h14"/></>} />,
  filter: p => <_FsIc {...p} d={<><path d="M4 5h16M7 12h10M10 19h4"/></>} />,
  more: p => <_FsIc {...p} d={<><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></>} />,
  download: p => <_FsIc {...p} d={<><path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M5 21h14"/></>} />,
  lock: p => <_FsIc {...p} d={<><rect x="4" y="10" width="16" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></>} />,
  warning: p => <_FsIc {...p} d={<><path d="M10.3 3.7 2.8 17a2 2 0 0 0 1.7 3h15a2 2 0 0 0 1.7-3L13.7 3.7a2 2 0 0 0-3.4 0z"/><path d="M12 9v4M12 17h.01"/></>} />,
  check: p => <_FsIc {...p} d={<><path d="m20 6-11 11-5-5"/></>} />,
  close: p => <_FsIc {...p} d={<><path d="M18 6 6 18M6 6l12 12"/></>} />,
  back: p => <_FsIc {...p} d={<><path d="M15 6l-6 6 6 6"/></>} />,
  chevron: p => <_FsIc {...p} d={<><path d="m9 6 6 6-6 6"/></>} />,
  list: p => <_FsIc {...p} d={<><path d="M8 6h13M8 12h13M8 18h13"/><path d="M3 6h.01M3 12h.01M3 18h.01"/></>} />,
  grid: p => <_FsIc {...p} d={<><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></>} />,
  star: p => <_FsIc {...p} d={<><path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9z"/></>} />,
  share: p => <_FsIc {...p} d={<><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.6 10.5 6.8-4M8.6 13.5l6.8 4"/></>} />,
};

const FS_ROOT_FOLDERS = [
  {
    id: 'project-documents',
    name: 'Project Documents',
    kind: 'folder',
    system: true,
    children: [
      { id: 'project-documents--renderings', name: 'Renderings', system: true },
      { id: 'project-documents--architectural-plans', name: 'Architectural Plans', system: true },
      { id: 'project-documents--general-documents', name: 'General Documents', system: true },
    ],
  },
  {
    id: 'internal-mecca',
    name: 'Internal Mecca',
    kind: 'folder',
    system: true,
  },
  {
    id: 'site-files',
    name: 'Site Files',
    kind: 'folder',
    system: true,
    children: [
      { id: 'site-files--site-pictures', name: 'Site Pictures', system: true },
    ],
  },
];

const FS_PROTECTED_ROOTS = new Set([
  'project-documents',
  'project-documents--renderings',
  'project-documents--architectural-plans',
  'project-documents--general-documents',
  'internal-mecca',
  'site-files',
  'site-files--site-pictures',
]);

const FS_ROLE_FILTERS = [
  { id: 'ALL', label: 'All roles' },
  { id: 'PM', label: 'PM - Project Manager' },
  { id: 'EX', label: 'EX - Executive' },
  { id: 'ARC', label: 'ARC - Architect' },
  { id: 'WO', label: 'WO - Worker' },
  { id: 'CL', label: 'CL - Client' },
];

const FS_ACCESS_USERS = [
  { name: 'Sarah Chen', role: 'PM', roleLabel: 'Project Manager' },
  { name: 'Emily Johnson', role: 'ARC', roleLabel: 'Architect' },
  { name: 'David Kim', role: 'EX', roleLabel: 'Executive' },
  { name: 'Mike Rodriguez', role: 'WO', roleLabel: 'Worker' },
  { name: 'Lisa Park', role: 'WO', roleLabel: 'Worker' },
  { name: 'Mark Rivera', role: 'WO', roleLabel: 'Worker' },
  { name: 'Nina Patel', role: 'ARC', roleLabel: 'Architect' },
  { name: 'Oliver Martin', role: 'CL', roleLabel: 'Client' },
  { name: 'Laura Brooks', role: 'CL', roleLabel: 'Client' },
  { name: 'Chris Wong', role: 'EX', roleLabel: 'Executive' },
];

function initialsForName(name) {
  return (name || '?')
    .split(/\s+/)
    .filter(Boolean)
    .map(part => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

function fsPersonForName(name) {
  const dataPeople = Object.values(window.MeccaData?.participants || {});
  const chatPerson = dataPeople.find(person => person.name === name);
  const accessPerson = FS_ACCESS_USERS.find(person => person.name === name);
  return {
    name,
    avatar: chatPerson?.avatar || initialsForName(name),
    role: chatPerson?.role || accessPerson?.roleLabel || 'Project member',
    roleCode: accessPerson?.role || '',
    hue: chatPerson?.hue ?? 220,
  };
}

function projectAccessPeople(project, file) {
  const conversations = window.MeccaData?.CONVERSATIONS || [];
  const projectChat = conversations.find(conversation => (
    conversation.projectId === project?.id && conversation.type === 'project'
  ));
  const names = new Set((projectChat?.participants || []).map(person => person.name));
  if (file?.uploader) names.add(file.uploader);
  (file?.access?.users || []).forEach(name => names.add(name));
  if (file?.clientVisible) {
    names.add('Oliver Martin');
    names.add('Laura Brooks');
  }
  return Array.from(names).map(fsPersonForName);
}

function fileSpecificAccessNames(file) {
  if (Array.isArray(file?.access?.users)) return file.access.users;
  return file?.uploader ? [file.uploader] : [];
}

function fileAccessDraftFor(file) {
  return {
    projectMembers: file?.access?.projectMembers !== false,
    parentAccess: file?.access?.parentAccess !== false,
    clientVisible: !!file?.clientVisible,
    users: new Set(fileSpecificAccessNames(file)),
  };
}

function folderAccessDraftFor(folder) {
  return {
    projectMembers: folder?.access?.projectMembers !== false,
    parentAccess: folder?.access?.parentAccess !== false,
    clientAccess: !!(folder?.access?.clientAccess || folder?.clientVisible),
    users: new Set(folder?.access?.users || []),
  };
}

function sameNameSet(a, b) {
  if (a.size !== b.size) return false;
  for (const value of a) {
    if (!b.has(value)) return false;
  }
  return true;
}

const COMMON_FILE_TYPE_FILTERS = [
  'PDF',
  'DOC',
  'DOCX',
  'XLS',
  'XLSX',
  'PPT',
  'PPTX',
  'TXT',
  'CSV',
  'JPG',
  'JPEG',
  'PNG',
  'HEIC',
  'WEBP',
  'MP4',
  'MOV',
  'AVI',
  'ZIP',
  'DWG',
  'RVT',
  'External link',
];

function buildFiles(project) {
  const p = project || { id: 'pp1', name: 'Mecca HQ Renovation' };
  const tag = p.initials || 'PR';
  return [
    { id: 'f-plan', folderId: 'project-documents', name: `${tag}-L3-framing-plan-v4.pdf`, type: 'PDF', size: '4.2 MB', uploader: 'Emily Johnson', modified: 'Today, 9:42 AM', workflow: 'Architectural Plans', status: 'backedUp', icon: 'plan', previewStyle: 'plan', clientVisible: true },
    { id: 'f-spec', folderId: 'project-documents', name: 'MEP-coordination-markups.dwg', type: 'DWG', size: '12.8 MB', uploader: 'Lisa Park', modified: 'Yesterday, 4:18 PM', workflow: 'General Documents', status: 'backupPending', icon: 'plan', previewStyle: 'drawing' },
    { id: 'f-permit', folderId: 'project-documents', name: 'Building-permit-revision-2.pdf', type: 'PDF', size: '1.8 MB', uploader: p.manager || 'Sarah Chen', modified: 'Jun 27, 2026', workflow: 'General Documents', status: 'backedUp', icon: 'file', previewStyle: 'document', clientVisible: true },
    { id: 'f-task', folderId: 'internal-mecca', name: 'Finish wall framing - instructions.pdf', type: 'PDF', size: '860 KB', uploader: 'Sarah Chen', modified: 'Today, 8:05 AM', workflow: 'Internal Mecca', relation: 'Task: Finish wall framing - Level 3', status: 'backedUp', icon: 'file' },
    { id: 'f-evidence', folderId: 'site-files', name: 'Completion evidence - north partition.jpg', type: 'JPG', size: '6.4 MB', uploader: 'Mike Rodriguez', modified: 'Today, 11:31 AM', workflow: 'Site Pictures', relation: 'Task: Upload progress photos - Level 2', status: 'backupFailed', icon: 'image', previewStyle: 'photo' },
    { id: 'f-issue', folderId: 'internal-mecca', name: 'Water leak initial photo.mov', type: 'MOV', size: '24 MB', uploader: 'Mike Rodriguez', modified: 'Yesterday, 7:55 AM', workflow: 'Internal Mecca', relation: 'Site Issue: Water leak near storage wall', status: 'backedUp', icon: 'image', previewStyle: 'video' },
    { id: 'f-proc', folderId: 'internal-mecca', name: 'Lighting fixtures - BrightSpec quote.pdf', type: 'PDF', size: '2.6 MB', uploader: 'David Kim', modified: 'Jun 26, 2026', workflow: 'Internal Mecca', relation: 'Procurement Item: Lighting fixture quote approval', status: 'backupPending', icon: 'file' },
    { id: 'f-chat', folderId: 'internal-mecca', name: 'Project chat attachment - site walk notes.pdf', type: 'PDF', size: '720 KB', uploader: 'Sarah Chen', modified: 'Today, 10:04 AM', workflow: 'Internal Mecca', relation: 'Project Chat', status: 'backedUp', icon: 'chat', adminOnly: true },
    { id: 'f-render', folderId: 'project-documents', name: `${p.name} - lobby rendering.url`, type: 'External link', size: 'Link', uploader: 'Emily Johnson', modified: 'Jun 24, 2026', workflow: 'Renderings', status: 'available', icon: 'plan', external: true, previewStyle: 'rendering', clientVisible: true },
    { id: 'f-photo', folderId: 'site-files', name: '2026-06-29 site pictures - south entrance.jpg', type: 'JPG', size: '8.1 MB', uploader: 'Mike Rodriguez', modified: 'Today, 12:22 PM', workflow: 'Site Pictures', relation: 'Phase: Interior framing', status: 'backupPending', icon: 'image', previewStyle: 'photo' },
  ];
}

function backupLabel(status) {
  if (status === 'backedUp') return { label: 'Backed Up', tone: 'ok', Icon: FsI.check };
  if (status === 'backupFailed') return { label: 'Backup Failed', tone: 'bad', Icon: FsI.warning };
  if (status === 'backupPending') return { label: 'Backup Pending', tone: 'warn', Icon: FsI.warning };
  return { label: 'Available', tone: 'plain', Icon: FsI.check };
}

function fileVisualType(file) {
  const type = (file.type || '').toUpperCase();
  if (file.external || type === 'EXTERNAL LINK') return 'link';
  if (['JPG', 'JPEG', 'PNG', 'HEIC', 'WEBP'].includes(type)) return 'image';
  if (['MP4', 'MOV', 'AVI'].includes(type)) return 'video';
  if (['DWG', 'RVT'].includes(type)) return 'plan';
  if (['XLS', 'XLSX', 'CSV'].includes(type)) return 'sheet';
  if (['PPT', 'PPTX'].includes(type)) return 'presentation';
  if (['ZIP'].includes(type)) return 'archive';
  if (file.icon === 'chat') return 'chat';
  if (type === 'PDF') return 'pdf';
  return 'file';
}

function fileIcon(file, props) {
  const map = { image: FsI.image, video: FsI.video, plan: FsI.plan, sheet: FsI.sheet, presentation: FsI.presentation, archive: FsI.archive, link: FsI.link, chat: FsI.chat, pdf: FsI.file, file: FsI.file };
  const Icon = map[fileVisualType(file)] || FsI.file;
  return <Icon {...props} />;
}

function filePreviewLabel(file) {
  const visualType = fileVisualType(file);
  if (visualType === 'image') return 'Image preview';
  if (visualType === 'video') return 'Video preview';
  if (visualType === 'plan') return 'Drawing preview';
  if (visualType === 'sheet') return 'Sheet preview';
  if (visualType === 'presentation') return 'Slides preview';
  if (visualType === 'link') return 'External link';
  if (visualType === 'archive') return 'Archive';
  if (visualType === 'pdf') return 'PDF preview';
  return file.type || 'File';
}

function renderFileGridPreview(file) {
  if (!file.previewStyle && !file.previewUrl) {
    return <span className={'ipad-files-row__preview-icon ipad-files-row__glyph--' + fileVisualType(file)}>{fileIcon(file, { size: 24 })}</span>;
  }
  if (file.previewUrl && fileVisualType(file) === 'image') {
    return <img className="ipad-files-row__preview-media" src={file.previewUrl} alt="" />;
  }
  const style = file.previewStyle || fileVisualType(file);
  return (
    <span className={'ipad-files-row__mock-preview ipad-files-row__mock-preview--' + style} aria-hidden="true">
      <span />
      <span />
      <span />
    </span>
  );
}

function modifiedRank(value) {
  if (!value) return 0;
  if (value.includes('Just now')) return 500;
  if (value.includes('Today')) return 400;
  if (value.includes('Yesterday')) return 300;
  const cleaned = value.replace(/,?\s*\d{1,2}:\d{2}\s*(AM|PM)/i, '');
  const parsed = Date.parse(/\d{4}/.test(cleaned) ? cleaned : cleaned + ', 2026');
  return Number.isNaN(parsed) ? 0 : parsed;
}

function slugifyFolderName(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function makeChildFolder(parent, name, index) {
  return {
    id: parent.id + '--' + slugifyFolderName(name) + '-' + index,
    name,
    parentId: parent.id,
    system: false,
    adminOnly: parent.adminOnly,
  };
}

function normalizeFolderNode(node, parent = null, index = 0) {
  if (typeof node === 'string') return makeChildFolder(parent, node, index);
  const id = node.id || (parent ? `${parent.id}--${slugifyFolderName(node.name)}-${index}` : slugifyFolderName(node.name));
  const normalized = {
    ...node,
    id,
    kind: node.kind || 'folder',
    parentId: parent ? parent.id : node.parentId,
    system: node.system ?? false,
    children: [],
  };
  normalized.children = (node.children || []).map((child, childIndex) => normalizeFolderNode(child, normalized, childIndex));
  return normalized;
}

function flattenFolders(nodes, expandedIds, level = 0) {
  return nodes.flatMap(node => {
    const row = { ...node, level };
    if (!node.children?.length || !expandedIds.has(node.id)) return [row];
    return [row, ...flattenFolders(node.children, expandedIds, level + 1)];
  });
}

function findFolder(nodes, id) {
  for (const node of nodes) {
    if (node.id === id) return node;
    const found = findFolder(node.children || [], id);
    if (found) return found;
  }
  return null;
}

function findFolderPath(nodes, id, path = []) {
  if (!id) return [];
  for (const node of nodes) {
    const nextPath = [...path, node];
    if (node.id === id) return nextPath;
    const found = findFolderPath(node.children || [], id, nextPath);
    if (found) return found;
  }
  return null;
}

function getFolderIdFromLocation() {
  const params = new URLSearchParams(window.location.hash.replace(/^#/, ''));
  return params.get('folder') || 'project-documents';
}

function isDescendantFolder(nodes, ancestorId, targetId) {
  const ancestor = findFolder(nodes, ancestorId);
  if (!ancestor) return false;
  return !!findFolder(ancestor.children || [], targetId);
}

function siblingNameExists(nodes, parentId, name, ignoreId = '') {
  const normalized = name.trim().toLowerCase();
  const siblings = parentId
    ? (findFolder(nodes, parentId)?.children || [])
    : nodes;
  return siblings.some(node => node.id !== ignoreId && node.name.trim().toLowerCase() === normalized);
}

function addFolderToTree(nodes, folder) {
  if (!folder.parentId) return [...nodes, folder];
  return nodes.map(node => {
    if (node.id === folder.parentId) {
      return { ...node, children: [...(node.children || []), folder] };
    }
    return { ...node, children: addFolderToTree(node.children || [], folder) };
  });
}

function updateFolderInTree(nodes, folderId, updater) {
  return nodes.map(node => {
    if (node.id === folderId) return updater(node);
    return { ...node, children: updateFolderInTree(node.children || [], folderId, updater) };
  });
}

function removeFolderFromTree(nodes, folderId) {
  let removed = null;
  const next = nodes
    .filter(node => {
      if (node.id !== folderId) return true;
      removed = node;
      return false;
    })
    .map(node => {
      const result = removeFolderFromTree(node.children || [], folderId);
      if (result.removed) removed = result.removed;
      return { ...node, children: result.nodes };
    });
  return { nodes: next, removed };
}

function canMoveFolder(tree, folder, targetId) {
  if (!folder || folder.system || FS_PROTECTED_ROOTS.has(folder.id)) return false;
  if (folder.id === targetId) return false;
  if (targetId && isDescendantFolder(tree, folder.id, targetId)) return false;
  return true;
}

function IPadFilesPage({ project, compact = false }) {
  const initialTree = _fsM(() => FS_ROOT_FOLDERS.map(folder => normalizeFolderNode(folder)), []);
  const [folderTree, setFolderTree] = _fsS(initialTree);
  const initialFolderId = _fsM(() => getFolderIdFromLocation(), []);
  const initialPath = _fsM(() => {
    if (initialFolderId === 'project-root') return [];
    return findFolderPath(initialTree, initialFolderId) || findFolderPath(initialTree, 'project-documents') || [initialTree[0]];
  }, [initialFolderId, initialTree]);
  const [selectedFolderId, setSelectedFolderId] = _fsS(initialPath[0]?.id || '');
  const [selectedTreeFolderId, setSelectedTreeFolderId] = _fsS(initialPath[initialPath.length - 1]?.id || 'project-root');
  const [selectedSubfolder, setSelectedSubfolder] = _fsS(initialPath.length > 1 ? initialPath[initialPath.length - 1].name : '');
  const [expandedIds, setExpandedIds] = _fsS(new Set(['project-documents', 'site-files']));
  const [folderDraft, setFolderDraft] = _fsS(null);
  const [folderDraftName, setFolderDraftName] = _fsS('');
  const [folderError, setFolderError] = _fsS('');
  const [folderCreateDialog, setFolderCreateDialog] = _fsS(null);
  const [folderAccessDraft, setFolderAccessDraft] = _fsS({
    name: '',
    projectMembers: true,
    parentAccess: true,
    clientAccess: false,
    users: new Set(['Sarah Chen']),
    roleFilter: 'ALL',
    error: '',
  });
  const [openMenuId, setOpenMenuId] = _fsS('');
  const [dragFolderId, setDragFolderId] = _fsS('');
  const [dropTargetId, setDropTargetId] = _fsS('');
  const [invalidDropId, setInvalidDropId] = _fsS('');
  const [breadcrumbMenuOpen, setBreadcrumbMenuOpen] = _fsS(false);
  const [folderPanel, setFolderPanel] = _fsS(null);
  const [sidebarWidth, setSidebarWidth] = _fsS(() => {
    const saved = Number(window.sessionStorage.getItem('meccaFilesSidebarWidth'));
    return Number.isFinite(saved) && saved >= 240 && saved <= 380 ? saved : 280;
  });
  const [isResizingSidebar, setIsResizingSidebar] = _fsS(false);
  const [selectedFileId, setSelectedFileId] = _fsS('');
  const filesShellRef = _fsR(null);
  const lastFocusedFileId = _fsR('');
  const [query, setQuery] = _fsS('');
  const [filter, setFilter] = _fsS('All');
  const [sort, setSort] = _fsS('Modified');
  const [filtersOpen, setFiltersOpen] = _fsS(true);
  const [viewMode, setViewMode] = _fsS('list');
  const [selectedIds, setSelectedIds] = _fsS(new Set());
  const [uploadedFiles, setUploadedFiles] = _fsS([]);
  const [backupFiles, setBackupFiles] = _fsS([]);
  const [deletedFileIds, setDeletedFileIds] = _fsS(new Set());
  const [fileEdits, setFileEdits] = _fsS({});
  const [fileAction, setFileAction] = _fsS(null);
  const [fileActionDraft, setFileActionDraft] = _fsS({ name: '', destinationId: '', note: '', error: '' });
  const [panelMoreOpen, setPanelMoreOpen] = _fsS(false);
  const [panelMorePosition, setPanelMorePosition] = _fsS(null);
  const [panelDialog, setPanelDialog] = _fsS(null);
  const [panelToast, setPanelToast] = _fsS(null);
  const uploadInputRef = _fsR(null);

  const folders = folderTree;
  const visibleFolders = _fsM(() => flattenFolders(folderTree, expandedIds), [folderTree, expandedIds]);
  const baseFiles = _fsM(() => buildFiles(project), [project?.id]);
  const files = _fsM(() => [...baseFiles, ...uploadedFiles, ...backupFiles].map(file => ({
    ...file,
    ...(fileEdits[file.id] || {}),
  })).filter(file => !deletedFileIds.has(file.id)), [baseFiles, uploadedFiles, backupFiles, fileEdits, deletedFileIds]);
  const selectedPath = selectedTreeFolderId === 'project-root'
    ? []
    : (findFolderPath(folderTree, selectedTreeFolderId) || [folderTree[0]]);
  const selectedFolder = selectedPath[0] || null;
  const currentFolder = selectedPath[selectedPath.length - 1] || null;
  const subfolders = currentFolder ? (currentFolder.children || []) : folderTree;
  const visibleItems = _fsM(() => {
    const q = query.trim().toLowerCase();
    const rows = files.filter(f => selectedFolderId && f.folderId === selectedFolderId)
      .filter(f => !selectedSubfolder || f.workflow === selectedSubfolder)
      .filter(f => filter === 'All' || f.type === filter)
      .filter(f => !q || [f.name, f.type, f.uploader, f.workflow, f.relation].filter(Boolean).join(' ').toLowerCase().includes(q));
    if (sort === 'Name') return [...rows].sort((a, b) => a.name.localeCompare(b.name));
    return [...rows].sort((a, b) => modifiedRank(b.modified) - modifiedRank(a.modified));
  }, [files, selectedFolderId, selectedSubfolder, query, filter, sort]);
  const folderCards = subfolders.map(folder => ({
    id: folder.id,
    name: folder.name,
    folder,
    count: currentFolder
      ? files.filter(file => file.folderId === selectedFolderId && file.workflow === folder.name).length
      : files.filter(file => file.folderId === folder.id).length,
  }));
  const selectedFile = selectedFileId ? files.find(f => f.id === selectedFileId) : null;
  const projectName = project?.name || 'Mecca HQ Renovation';
  const fileTypeFilters = _fsM(() => {
    const scopeFiles = files.filter(f => selectedFolderId && f.folderId === selectedFolderId)
      .filter(f => !selectedSubfolder || f.workflow === selectedSubfolder);
    const scopeTypes = scopeFiles.map(file => file.type).filter(Boolean);
    return ['All', ...Array.from(new Set([...COMMON_FILE_TYPE_FILTERS, ...scopeTypes]))];
  }, [files, selectedFolderId, selectedSubfolder]);
  const visibleFolderCards = _fsM(() => {
    const q = query.trim().toLowerCase();
    if (filter !== 'All') return [];
    if (!q) return folderCards;
    return folderCards.filter(folder => folder.name.toLowerCase().includes(q));
  }, [folderCards, query, filter]);
  const selectedCount = selectedIds.size;
  const selectedActionFiles = files.filter(file => selectedIds.has(file.id));
  const fileDestinationOptions = _fsM(() => {
    const collect = (nodes) => nodes.flatMap(folder => [folder, ...collect(folder.children || [])]);
    return collect(folderTree).map(folder => {
      const path = findFolderPath(folderTree, folder.id) || [folder];
      return {
        id: folder.id,
        label: [projectName, ...path.map(item => item.name)].join(' / '),
      };
    });
  }, [folderTree, projectName]);
  const activeScope = currentFolder ? currentFolder.name : projectName;
  const visibleBreadcrumbFolders = selectedPath.length > 3 ? selectedPath.slice(-2) : selectedPath;
  const hiddenBreadcrumbFolders = selectedPath.length > 3 ? selectedPath.slice(0, -2) : [];
  const compactParentTarget = selectedPath.length > 1
    ? selectedPath[selectedPath.length - 2]
    : (selectedPath.length === 1 ? { id: 'project-root', name: projectName } : null);

  _fsE(() => {
    setSelectedFileId('');
  }, [project?.id]);

  _fsE(() => {
    if (filter !== 'All' && !fileTypeFilters.includes(filter)) {
      setFilter('All');
    }
  }, [filter, fileTypeFilters]);

  _fsE(() => {
    const initialId = initialFolderId === 'project-root' || findFolder(folderTree, initialFolderId)
      ? initialFolderId
      : 'project-documents';
    if (initialId !== selectedTreeFolderId) {
      navigateToFolderId(initialId, { push: false });
    }
    window.history.replaceState({ meccaFilesFolderId: initialId }, '', '#folder=' + encodeURIComponent(initialId));
    const onPopState = (event) => {
      const targetId = event.state?.meccaFilesFolderId || getFolderIdFromLocation();
      navigateToFolderId(targetId, { push: false });
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  _fsE(() => {
    if (selectedFileId && !files.some(file => file.id === selectedFileId)) {
      setSelectedFileId('');
    }
  }, [files, selectedFileId]);

  _fsE(() => {
    const onKeyDown = (event) => {
      if (event.key !== 'Escape' || !selectedFileId) return;
      event.preventDefault();
      closeFileDetails();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [selectedFileId]);

  _fsE(() => {
    if (!isResizingSidebar) return;
    const onMove = (event) => {
      const shellLeft = filesShellRef.current?.getBoundingClientRect().left || 0;
      const nextWidth = Math.max(240, Math.min(380, event.clientX - shellLeft));
      setSidebarWidth(nextWidth);
      window.sessionStorage.setItem('meccaFilesSidebarWidth', String(nextWidth));
    };
    const onUp = () => setIsResizingSidebar(false);
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, [isResizingSidebar]);

  const closeFileDetails = () => {
    const returnId = selectedFileId || lastFocusedFileId.current;
    lastFocusedFileId.current = returnId;
    setPanelMoreOpen(false);
    setPanelMorePosition(null);
    setPanelDialog(null);
    setSelectedFileId('');
    window.setTimeout(() => {
      if (!returnId) return;
      document.querySelector(`[data-file-id="${returnId}"]`)?.focus();
    }, 0);
  };
  const chooseFile = (id) => {
    lastFocusedFileId.current = id;
    setSelectedFileId(id);
    setPanelMoreOpen(false);
    setPanelMorePosition(null);
  };
  const togglePanelMoreMenu = (event) => {
    if (panelMoreOpen) {
      setPanelMoreOpen(false);
      setPanelMorePosition(null);
      return;
    }
    const rect = event.currentTarget.getBoundingClientRect();
    const menuWidth = 210;
    const estimatedMenuHeight = 226;
    const viewportPadding = 8;
    const left = Math.max(
      viewportPadding,
      Math.min(window.innerWidth - menuWidth - viewportPadding, rect.right - menuWidth)
    );
    const opensAbove = rect.bottom + estimatedMenuHeight + viewportPadding > window.innerHeight;
    const top = opensAbove
      ? Math.max(viewportPadding, rect.top - estimatedMenuHeight - 6)
      : rect.bottom + 6;
    setPanelMorePosition({ left, top });
    setPanelMoreOpen(true);
  };
  const navigateToFolderId = (folderId, { push = true } = {}) => {
    const isProjectRoot = folderId === 'project-root';
    const path = isProjectRoot ? [] : (findFolderPath(folderTree, folderId) || findFolderPath(folderTree, 'project-documents') || [folderTree[0]]);
    const targetId = isProjectRoot ? 'project-root' : path[path.length - 1].id;
    const root = path[0] || null;
    setSelectedTreeFolderId(targetId);
    setSelectedFolderId(root?.id || '');
    setSelectedSubfolder(path.length > 1 ? path[path.length - 1].name : '');
    setExpandedIds(prev => {
      const next = new Set(prev);
      path.slice(0, -1).forEach(folder => next.add(folder.id));
      return next;
    });
    setSelectedFileId('');
    setPanelMoreOpen(false);
    setPanelMorePosition(null);
    setSelectedIds(new Set());
    setBreadcrumbMenuOpen(false);
    if (push) {
      window.history.pushState({ meccaFilesFolderId: targetId }, '', '#folder=' + encodeURIComponent(targetId));
    }
  };
  const changeFolder = (folder) => {
    navigateToFolderId(folder.id);
  };
  const toggleFolder = (folderId) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      next.has(folderId) ? next.delete(folderId) : next.add(folderId);
      return next;
    });
  };
  const toggleSelected = (id) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };
  const destinationForFolderId = (folderId) => {
    const path = findFolderPath(folderTree, folderId);
    if (!path?.length) return null;
    const root = path[0];
    const target = path[path.length - 1];
    return {
      folderId: root.id,
      workflow: path.length > 1 ? target.name : root.name,
      path,
    };
  };
  const openFileAction = (mode, actionFiles = selectedFile ? [selectedFile] : selectedActionFiles) => {
    const filesForAction = actionFiles.filter(Boolean);
    if (!filesForAction.length) return;
    const firstFile = filesForAction[0];
    setFileAction({ mode, fileIds: filesForAction.map(file => file.id) });
    setFileActionDraft({
      name: firstFile.name,
      destinationId: selectedTreeFolderId === 'project-root' ? (selectedFolderId || folderTree[0]?.id || '') : selectedTreeFolderId,
      note: '',
      error: '',
    });
  };
  const closeFileAction = () => {
    setFileAction(null);
    setFileActionDraft({ name: '', destinationId: '', note: '', error: '' });
  };
  const commitFileAction = () => {
    if (!fileAction) return;
    const actionFiles = files.filter(file => fileAction.fileIds.includes(file.id));
    if (!actionFiles.length) return closeFileAction();
    if (fileAction.mode === 'edit') {
      const name = fileActionDraft.name.trim();
      if (!name) {
        setFileActionDraft(prev => ({ ...prev, error: 'Enter a file name.' }));
        return;
      }
      setFileEdits(prev => ({
        ...prev,
        [actionFiles[0].id]: {
          ...(prev[actionFiles[0].id] || {}),
          name,
          modified: 'Just now',
        },
      }));
      closeFileAction();
      return;
    }
    if (fileAction.mode === 'transfer') {
      const destination = destinationForFolderId(fileActionDraft.destinationId);
      if (!destination) {
        setFileActionDraft(prev => ({ ...prev, error: 'Choose a destination folder.' }));
        return;
      }
      setFileEdits(prev => {
        const next = { ...prev };
        actionFiles.forEach(file => {
          next[file.id] = {
            ...(next[file.id] || {}),
            folderId: destination.folderId,
            workflow: destination.workflow,
            modified: 'Just now',
          };
        });
        return next;
      });
      setSelectedIds(new Set());
      closeFileDetails();
      closeFileAction();
      return;
    }
    if (fileAction.mode === 'annotate') {
      const note = fileActionDraft.note.trim();
      if (!note) {
        setFileActionDraft(prev => ({ ...prev, error: 'Enter an annotation.' }));
        return;
      }
      setFileEdits(prev => {
        const next = { ...prev };
        actionFiles.forEach(file => {
          const existing = next[file.id]?.annotations || file.annotations || [];
          next[file.id] = {
            ...(next[file.id] || {}),
            annotations: [...existing, { text: note, author: 'You', createdAt: 'Just now' }],
            modified: 'Just now',
          };
        });
        return next;
      });
      closeFileAction();
    }
  };
  const isPdfFile = (file) => (file?.type || '').toUpperCase() === 'PDF';
  const canMovePanelFile = (file) => {
    if (!file) return false;
    if (file.folderId !== 'project-documents') return false;
    if (file.relation) return false;
    return true;
  };
  const panelRelatedWorkflow = (file) => {
    if (!file) return '';
    if (file.relation) return file.relation;
    if (file.workflow && selectedFolder?.name && file.workflow !== selectedFolder.name) return file.workflow;
    return '';
  };
  const panelRelatedRecord = (file) => file?.relation || '';
  const openPanelDialog = (mode) => {
    if (!selectedFile) return;
    setPanelMoreOpen(false);
    setPanelMorePosition(null);
    if (mode === 'rename') {
      setPanelDialog({ mode, name: selectedFile.name, error: '' });
      return;
    }
    if (mode === 'move') {
      setPanelDialog({
        mode,
        destinationId: selectedTreeFolderId === 'project-root' ? selectedFolderId : selectedTreeFolderId,
        error: '',
      });
      return;
    }
    if (mode === 'backup') {
      const baseName = selectedFile.name.replace(/\.[^.]+$/, '');
      const extension = selectedFile.name.includes('.') ? selectedFile.name.slice(selectedFile.name.lastIndexOf('.')) : '';
      setPanelDialog({
        mode,
        backupName: baseName + ' - Backup' + extension,
        destinationId: selectedTreeFolderId === 'project-root' ? selectedFolderId : selectedTreeFolderId,
        error: '',
      });
      return;
    }
    if (mode === 'delete') {
      setPanelDialog({ mode, error: '' });
      return;
    }
    if (mode === 'access') {
      const accessDraft = fileAccessDraftFor(selectedFile);
      setPanelDialog({
        mode,
        projectMembers: accessDraft.projectMembers,
        parentAccess: accessDraft.parentAccess,
        clientVisible: accessDraft.clientVisible,
        roleFilter: 'ALL',
        selectedUsers: new Set(accessDraft.users),
        originalAccess: {
          projectMembers: accessDraft.projectMembers,
          parentAccess: accessDraft.parentAccess,
          clientVisible: accessDraft.clientVisible,
          users: new Set(accessDraft.users),
        },
        confirmAccess: false,
        error: '',
      });
      return;
    }
    if (mode === 'access-view') {
      const selectedUsers = new Set(fileSpecificAccessNames(selectedFile));
      setPanelDialog({
        mode,
        selectedUsers,
        originalUsers: new Set(selectedUsers),
        removeMode: false,
        confirmAccess: false,
        error: '',
      });
      return;
    }
    if (mode === 'workflow') {
      setPanelDialog({ mode, relation: panelRelatedRecord(selectedFile), error: '' });
    }
  };
  const closePanelDialog = () => setPanelDialog(null);
  const showPanelToast = (message, undo) => {
    setPanelToast({ message, undo });
    window.setTimeout(() => setPanelToast(current => current?.message === message ? null : current), 5200);
  };
  const commitPanelDialog = () => {
    if (!panelDialog || !selectedFile) return;
    if (panelDialog.mode === 'rename') {
      const name = panelDialog.name.trim();
      if (!name) {
        setPanelDialog(prev => ({ ...prev, error: 'Enter a file name.' }));
        return;
      }
      setFileEdits(prev => ({
        ...prev,
        [selectedFile.id]: {
          ...(prev[selectedFile.id] || {}),
          name,
          modified: 'Just now',
        },
      }));
      setPanelDialog(null);
      showPanelToast('File renamed.');
      return;
    }
    if (panelDialog.mode === 'move') {
      const destination = destinationForFolderId(panelDialog.destinationId);
      if (!destination) {
        setPanelDialog(prev => ({ ...prev, error: 'Choose a destination folder.' }));
        return;
      }
      setFileEdits(prev => ({
        ...prev,
        [selectedFile.id]: {
          ...(prev[selectedFile.id] || {}),
          folderId: destination.folderId,
          workflow: destination.workflow,
          modified: 'Just now',
        },
      }));
      closeFileDetails();
      setPanelDialog(null);
      showPanelToast('File moved.');
      return;
    }
    if (panelDialog.mode === 'backup') {
      const destination = destinationForFolderId(panelDialog.destinationId);
      const requestedName = panelDialog.backupName.trim();
      if (!destination || !requestedName) {
        setPanelDialog(prev => ({ ...prev, error: 'Choose a backup name and destination.' }));
        return;
      }
      const hasDuplicate = files.some(file => file.name.toLowerCase() === requestedName.toLowerCase());
      const stamp = new Date().toISOString().slice(0, 16).replace('T', ' ');
      const backupName = hasDuplicate
        ? requestedName.replace(/(\.[^.]+)?$/, ' ' + stamp + '$1')
        : requestedName;
      const backupId = 'backup-' + Date.now().toString(36);
      const backupFile = {
        ...selectedFile,
        id: backupId,
        name: backupName,
        folderId: destination.folderId,
        workflow: destination.workflow,
        modified: 'Just now',
        uploader: 'You',
        status: 'available',
        relation: selectedFile.relation,
        backupOf: selectedFile.id,
      };
      setBackupFiles(prev => [backupFile, ...prev]);
      setPanelDialog(null);
      showPanelToast('Backup copy created.', () => setBackupFiles(prev => prev.filter(file => file.id !== backupId)));
      return;
    }
    if (panelDialog.mode === 'delete') {
      const deletedId = selectedFile.id;
      setDeletedFileIds(prev => new Set([...prev, deletedId]));
      closeFileDetails();
      setPanelDialog(null);
      showPanelToast('File moved to Trash.', () => setDeletedFileIds(prev => {
        const next = new Set(prev);
        next.delete(deletedId);
        return next;
      }));
      return;
    }
    if (panelDialog.mode === 'access') {
      setFileEdits(prev => ({
        ...prev,
        [selectedFile.id]: {
          ...(prev[selectedFile.id] || {}),
          clientVisible: panelDialog.clientVisible,
          access: {
            ...(selectedFile.access || {}),
            projectMembers: panelDialog.projectMembers,
            parentAccess: panelDialog.parentAccess,
            users: Array.from(panelDialog.selectedUsers || []),
          },
        },
      }));
      setPanelDialog(null);
      showPanelToast('Access updated.');
    }
  };
  const togglePanelAccessViewUser = (name, checked) => {
    setPanelDialog(prev => {
      if (!prev || prev.mode !== 'access-view') return prev;
      const selectedUsers = new Set(prev.selectedUsers || []);
      checked ? selectedUsers.add(name) : selectedUsers.delete(name);
      return { ...prev, selectedUsers };
    });
  };
  const applyPanelAccessViewChanges = () => {
    if (!selectedFile || !panelDialog || panelDialog.mode !== 'access-view') return;
    setFileEdits(prev => {
      const currentFile = {
        ...selectedFile,
        ...(prev[selectedFile.id] || {}),
      };
      return {
        ...prev,
        [selectedFile.id]: {
          ...(prev[selectedFile.id] || {}),
          access: {
            ...(currentFile.access || {}),
            projectMembers: currentFile.access?.projectMembers ?? true,
            parentAccess: currentFile.access?.parentAccess ?? true,
            users: Array.from(panelDialog.selectedUsers || []),
          },
        },
      };
    });
    setPanelDialog(null);
    showPanelToast('Access changes applied.');
  };
  const openFullPreview = (file) => {
    if (file?.previewUrl) {
      window.open(file.previewUrl, '_blank', 'noopener');
      return;
    }
    setPanelDialog({ mode: 'full-preview', fileId: file?.id || '', error: '' });
  };
  const startFolderDraft = (parentId = '') => {
    setFolderDraft({ mode: 'create', parentId });
    setFolderDraftName('');
    setFolderError('');
    setOpenMenuId('');
    if (parentId) {
      setExpandedIds(prev => new Set([...prev, parentId]));
    }
  };
  const startToolbarFolderDraft = () => {
    const parentId = selectedTreeFolderId === 'project-root' ? '' : selectedTreeFolderId;
    setFolderCreateDialog({ parentId });
    setFolderAccessDraft({
      name: '',
      projectMembers: true,
      parentAccess: true,
      clientAccess: false,
      users: new Set(['Sarah Chen']),
      roleFilter: 'ALL',
      error: '',
    });
    setOpenMenuId('');
    setFolderDraft(null);
    if (parentId) {
      setExpandedIds(prev => new Set([...prev, parentId]));
    }
  };
  const closeFolderCreateDialog = () => {
    setFolderCreateDialog(null);
    setFolderAccessDraft(prev => ({ ...prev, error: '' }));
  };
  const setFolderAccessUser = (user, checked) => {
    setFolderAccessDraft(prev => {
      const users = new Set(prev.users);
      checked ? users.add(user) : users.delete(user);
      return { ...prev, users, error: '' };
    });
  };
  const commitToolbarFolder = () => {
    if (!folderCreateDialog) return;
    const parentId = folderCreateDialog.parentId;
    const name = folderAccessDraft.name.trim();
    if (!name) {
      setFolderAccessDraft(prev => ({ ...prev, error: 'Enter a folder name.' }));
      return;
    }
    if (siblingNameExists(folderTree, parentId, name)) {
      setFolderAccessDraft(prev => ({ ...prev, error: 'A folder with this name already exists here.' }));
      return;
    }
    if (!folderAccessDraft.projectMembers && !folderAccessDraft.parentAccess && !folderAccessDraft.clientAccess && folderAccessDraft.users.size === 0) {
      setFolderAccessDraft(prev => ({ ...prev, error: 'Select at least one access option.' }));
      return;
    }
    const created = {
      id: 'custom-' + Date.now().toString(36),
      name,
      parentId,
      system: false,
      children: [],
      access: {
        projectMembers: folderAccessDraft.projectMembers,
        parentAccess: folderAccessDraft.parentAccess,
        clientAccess: folderAccessDraft.clientAccess,
        users: Array.from(folderAccessDraft.users),
      },
      clientVisible: folderAccessDraft.clientAccess,
    };
    setFolderTree(prev => addFolderToTree(prev, created));
    setExpandedIds(prev => parentId ? new Set([...prev, parentId]) : prev);
    setFolderCreateDialog(null);
    setFolderAccessDraft(prev => ({ ...prev, name: '', error: '' }));
    setSelectedTreeFolderId(created.id);
    window.history.pushState({ meccaFilesFolderId: created.id }, '', '#folder=' + encodeURIComponent(created.id));
    if (parentId) {
      const parentPath = findFolderPath(folderTree, parentId);
      const root = parentPath?.[0] || created;
      setSelectedFolderId(root.id);
      setSelectedSubfolder(created.name);
    } else {
      setSelectedFolderId(created.id);
      setSelectedSubfolder('');
    }
  };
  const startRenameFolder = (folder) => {
    if (folder.system || FS_PROTECTED_ROOTS.has(folder.id)) return;
    setFolderDraft({ mode: 'rename', folderId: folder.id, parentId: folder.parentId || '' });
    setFolderDraftName(folder.name);
    setFolderError('');
    setOpenMenuId('');
  };
  const commitFolderDraft = () => {
    if (!folderDraft) return;
    const name = folderDraftName.trim();
    if (!name) {
      setFolderError('Enter a folder name.');
      return;
    }
    if (siblingNameExists(folderTree, folderDraft.parentId, name, folderDraft.folderId)) {
      setFolderError('A folder with this name already exists here.');
      return;
    }
    if (folderDraft.mode === 'rename') {
      setFolderTree(prev => updateFolderInTree(prev, folderDraft.folderId, folder => ({ ...folder, name })));
      setFolderDraft(null);
      setFolderError('');
      return;
    }
    const created = {
      id: 'custom-' + Date.now().toString(36),
      name,
      parentId: folderDraft.parentId,
      system: false,
      children: [],
    };
    setFolderTree(prev => addFolderToTree(prev, created));
    setExpandedIds(prev => folderDraft.parentId ? new Set([...prev, folderDraft.parentId]) : prev);
    setFolderDraft(null);
    setFolderError('');
    setSelectedTreeFolderId(created.id);
    window.history.pushState({ meccaFilesFolderId: created.id }, '', '#folder=' + encodeURIComponent(created.id));
    if (folderDraft.parentId) {
      const parentPath = findFolderPath(folderTree, folderDraft.parentId);
      const root = parentPath?.[0] || created;
      setSelectedFolderId(root.id);
      setSelectedSubfolder(created.name);
    } else {
      setSelectedFolderId(created.id);
      setSelectedSubfolder('');
    }
  };
  const deleteFolder = (folder) => {
    if (folder.system || FS_PROTECTED_ROOTS.has(folder.id)) return;
    setFolderTree(prev => removeFolderFromTree(prev, folder.id).nodes);
    if (selectedTreeFolderId === folder.id) {
      const fallback = folder.parentId ? findFolder(folderTree, folder.parentId) : folderTree[0];
      if (fallback) changeFolder(fallback);
    }
    setOpenMenuId('');
  };
  const moveFolder = (folder, targetId) => {
    if (!canMoveFolder(folderTree, folder, targetId)) return false;
    if (siblingNameExists(folderTree, targetId, folder.name, folder.id)) {
      setFolderError('A folder with this name already exists there.');
      return false;
    }
    setFolderTree(prev => {
      const result = removeFolderFromTree(prev, folder.id);
      if (!result.removed) return prev;
      return addFolderToTree(result.nodes, { ...result.removed, parentId: targetId, system: false });
    });
    if (targetId) setExpandedIds(prev => new Set([...prev, targetId]));
    setOpenMenuId('');
    return true;
  };
  const folderCountFor = (folder) => {
    const path = findFolderPath(folderTree, folder.id) || [folder];
    if (path.length > 1) {
      const root = path[0];
      return files.filter(file => file.folderId === root.id && file.workflow === folder.name).length;
    }
    return files.filter(file => file.folderId === folder.id).length;
  };
  const uploadIntoActiveFolder = (fileList) => {
    const selectedFiles = Array.from(fileList || []);
    if (!selectedFiles.length) return;
    const root = selectedPath[0] || currentFolder || folderTree[0];
    const workflow = selectedPath.length > 1 ? currentFolder?.name : (selectedSubfolder || currentFolder?.name || root.name);
    const nextFiles = selectedFiles.map((file, index) => {
      const extension = (file.name.split('.').pop() || 'file').toUpperCase();
      const isImage = ['JPG', 'JPEG', 'PNG', 'HEIC', 'WEBP', 'MOV', 'MP4'].includes(extension);
      const isPlan = ['PDF', 'DWG', 'RVT'].includes(extension);
      const mimeType = file.type || '';
      const size = file.size >= 1024 * 1024
        ? (file.size / (1024 * 1024)).toFixed(1) + ' MB'
        : Math.max(1, Math.round(file.size / 1024)) + ' KB';
      return {
        id: 'uploaded-' + Date.now().toString(36) + '-' + index,
        folderId: root.id,
        name: file.name,
        type: extension,
        size,
        uploader: 'You',
        modified: 'Just now',
        workflow,
        status: 'backupPending',
        icon: isImage ? 'image' : isPlan ? 'plan' : 'file',
        localFile: true,
        previewUrl: URL.createObjectURL(file),
        mimeType,
      };
    });
    setUploadedFiles(prev => [...nextFiles, ...prev]);
    setSelectedFileId('');
  };
  const renderFilePreview = (file) => {
    if (!file.previewUrl) {
      return (
        <>
          <div className="ipad-files-previewbox__glyph">{fileIcon(file, { size: 42, stroke: 1.4 })}</div>
          <div className="ipad-files-previewbox__type">Upload this file from this PC to preview it here</div>
        </>
      );
    }
    const mime = file.mimeType || '';
    const type = file.type || '';
    if (mime.startsWith('image/')) {
      return <img src={file.previewUrl} alt={file.name} />;
    }
    if (mime.startsWith('video/')) {
      return <video src={file.previewUrl} controls />;
    }
    if (mime === 'application/pdf' || type === 'PDF') {
      return <iframe src={file.previewUrl} title={file.name} />;
    }
    if (mime.startsWith('text/') || ['TXT', 'CSV', 'JSON', 'MD'].includes(type)) {
      return <iframe src={file.previewUrl} title={file.name} />;
    }
    return (
      <>
        <div className="ipad-files-previewbox__glyph">{fileIcon(file, { size: 42, stroke: 1.4 })}</div>
        <div className="ipad-files-previewbox__type">{type} preview is not available in browser</div>
      </>
    );
  };
  const renderFolderDraft = (parentId, level = 0) => {
    if (!folderDraft || folderDraft.parentId !== parentId || folderDraft.mode !== 'create') return null;
    return (
      <div className="ipad-files-folder-draft" style={{ '--level': level }}>
        <span className="ipad-files-tree__guide" />
        <span className="ipad-files-folder__icon"><FsI.folder size={18} /></span>
        <span className="ipad-files-folder-draft__body">
          <input
            autoFocus
            value={folderDraftName}
            onChange={e => { setFolderDraftName(e.target.value); setFolderError(''); }}
            onKeyDown={e => {
              if (e.key === 'Enter') commitFolderDraft();
              if (e.key === 'Escape') { setFolderDraft(null); setFolderError(''); }
            }}
            placeholder="Folder name"
          />
          {folderError && <span>{folderError}</span>}
        </span>
        <button onClick={commitFolderDraft} aria-label="Create folder"><FsI.check size={14} /></button>
      </div>
    );
  };
  const handleFolderNameHover = (event, name) => {
    if (event.currentTarget.scrollWidth > event.currentTarget.clientWidth) {
      event.currentTarget.title = name;
    } else {
      event.currentTarget.removeAttribute('title');
    }
  };
  const openFolderPanel = (mode, folder) => {
    if (mode === 'access') {
      const accessDraft = folderAccessDraftFor(folder);
      setFolderPanel({
        mode,
        folderId: folder.id,
        projectMembers: accessDraft.projectMembers,
        parentAccess: accessDraft.parentAccess,
        clientAccess: accessDraft.clientAccess,
        selectedUsers: new Set(accessDraft.users),
        originalAccess: {
          projectMembers: accessDraft.projectMembers,
          parentAccess: accessDraft.parentAccess,
          clientAccess: accessDraft.clientAccess,
          users: new Set(accessDraft.users),
        },
        roleFilter: 'ALL',
        confirmAccess: false,
      });
    } else {
      setFolderPanel({ mode, folderId: folder.id });
    }
    setOpenMenuId('');
  };
  const setPanelFolderAccess = (key, value) => {
    if (!folderPanel?.folderId || folderPanel.mode !== 'access') return;
    setFolderPanel(prev => ({ ...prev, [key]: value, confirmAccess: false }));
  };
  const setPanelFolderAccessUser = (name, checked) => {
    setFolderPanel(prev => {
      if (!prev || prev.mode !== 'access') return prev;
      const selectedUsers = new Set(prev.selectedUsers || []);
      checked ? selectedUsers.add(name) : selectedUsers.delete(name);
      return { ...prev, selectedUsers, confirmAccess: false };
    });
  };
  const commitPanelFolderAccess = () => {
    if (!folderPanel?.folderId || folderPanel.mode !== 'access') return;
    setFolderTree(prev => updateFolderInTree(prev, folderPanel.folderId, folder => ({
      ...folder,
      clientVisible: folderPanel.clientAccess,
      access: {
        ...(folder.access || {}),
        projectMembers: folderPanel.projectMembers,
        parentAccess: folderPanel.parentAccess,
        clientAccess: folderPanel.clientAccess,
        users: Array.from(folderPanel.selectedUsers || []),
      },
    })));
    setFolderPanel(null);
  };
  const panelFolder = folderPanel ? findFolder(folderTree, folderPanel.folderId) : null;
  const panelPath = panelFolder ? (findFolderPath(folderTree, panelFolder.id) || [panelFolder]) : [];
  const panelIsProtected = !!panelFolder && (panelFolder.system || FS_PROTECTED_ROOTS.has(panelFolder.id));
  const panelFolderCount = panelFolder ? folderCountFor(panelFolder) : 0;
  const panelFolderAccessOriginal = folderPanel?.mode === 'access' && folderPanel.originalAccess
    ? folderPanel.originalAccess
    : folderAccessDraftFor(panelFolder);
  const panelFolderAccessSelectedUsers = folderPanel?.mode === 'access' && folderPanel.selectedUsers
    ? folderPanel.selectedUsers
    : panelFolderAccessOriginal.users;
  const panelFolderAccessGroupChanges = folderPanel?.mode === 'access' ? [
    {
      key: 'projectMembers',
      label: 'Project team',
      before: panelFolderAccessOriginal.projectMembers ? 'Can view and upload' : 'Not selected',
      after: folderPanel.projectMembers ? 'Can view and upload' : 'Not selected',
      changed: panelFolderAccessOriginal.projectMembers !== folderPanel.projectMembers,
    },
    {
      key: 'parentAccess',
      label: 'Parent folder access',
      before: panelFolderAccessOriginal.parentAccess ? 'Inherited' : 'Not inherited',
      after: folderPanel.parentAccess ? 'Inherited' : 'Not inherited',
      changed: panelFolderAccessOriginal.parentAccess !== folderPanel.parentAccess,
    },
    {
      key: 'clientAccess',
      label: 'Clients',
      before: panelFolderAccessOriginal.clientAccess ? 'Can access folder' : 'No access by default',
      after: folderPanel.clientAccess ? 'Can access folder' : 'No access by default',
      changed: panelFolderAccessOriginal.clientAccess !== folderPanel.clientAccess,
    },
  ].filter(item => item.changed) : [];
  const panelFolderAccessAddedPeople = folderPanel?.mode === 'access'
    ? Array.from(panelFolderAccessSelectedUsers).filter(name => !panelFolderAccessOriginal.users.has(name)).map(fsPersonForName)
    : [];
  const panelFolderAccessRemovedPeople = folderPanel?.mode === 'access'
    ? Array.from(panelFolderAccessOriginal.users).filter(name => !panelFolderAccessSelectedUsers.has(name)).map(fsPersonForName)
    : [];
  const hasPanelFolderAccessChanges = folderPanel?.mode === 'access'
    ? panelFolderAccessGroupChanges.length > 0 || !sameNameSet(panelFolderAccessOriginal.users, panelFolderAccessSelectedUsers)
    : false;
  const filteredPanelFolderAccessUsers = folderPanel?.mode === 'access'
    ? (folderPanel.roleFilter === 'ALL'
      ? FS_ACCESS_USERS
      : FS_ACCESS_USERS.filter(user => user.role === folderPanel.roleFilter))
    : [];
  const createParentFolder = folderCreateDialog?.parentId ? findFolder(folderTree, folderCreateDialog.parentId) : null;
  const createParentName = createParentFolder?.name || projectName;
  const filteredAccessUsers = folderAccessDraft.roleFilter === 'ALL'
    ? FS_ACCESS_USERS
    : FS_ACCESS_USERS.filter(user => user.role === folderAccessDraft.roleFilter);
  const fileActionFiles = fileAction ? files.filter(file => fileAction.fileIds.includes(file.id)) : [];
  const fileActionPlural = fileActionFiles.length > 1;
  const fileActionTitle = fileAction?.mode === 'edit'
    ? 'Edit file'
    : fileAction?.mode === 'transfer'
      ? (fileActionPlural ? 'Transfer files' : 'Transfer file')
      : (fileActionPlural ? 'Annotate files' : 'Annotate file');
  const fileActionTarget = fileActionFiles.length === 1
    ? fileActionFiles[0].name
    : fileActionFiles.length + ' selected files';
  const selectedRelatedRecord = panelRelatedRecord(selectedFile);
  const selectedAccessPeople = selectedFile ? projectAccessPeople(project, selectedFile) : [];
  const selectedSpecificAccessNames = selectedFile ? fileSpecificAccessNames(selectedFile) : [];
  const panelOriginalAccessSet = panelDialog?.originalUsers || new Set(selectedSpecificAccessNames);
  const panelSelectedAccessSet = panelDialog?.selectedUsers || new Set(selectedSpecificAccessNames);
  const accessViewPeople = FS_ACCESS_USERS
    .map(user => fsPersonForName(user.name))
    .sort((a, b) => {
      const aSelected = panelSelectedAccessSet.has(a.name) ? 0 : 1;
      const bSelected = panelSelectedAccessSet.has(b.name) ? 0 : 1;
      if (aSelected !== bSelected) return aSelected - bSelected;
      return a.name.localeCompare(b.name);
    });
  const selectedAccessSummary = selectedAccessPeople.length
    ? selectedAccessPeople.map(person => person.name).join(', ')
    : 'No individual access';
  const filteredPanelAccessUsers = panelDialog?.mode === 'access'
    ? (panelDialog.roleFilter === 'ALL'
      ? FS_ACCESS_USERS
      : FS_ACCESS_USERS.filter(user => user.role === panelDialog.roleFilter))
    : [];
  const panelFileAccessOriginal = panelDialog?.mode === 'access' && panelDialog.originalAccess
    ? panelDialog.originalAccess
    : fileAccessDraftFor(selectedFile);
  const panelFileAccessSelectedUsers = panelDialog?.mode === 'access' && panelDialog.selectedUsers
    ? panelDialog.selectedUsers
    : panelFileAccessOriginal.users;
  const panelFileAccessGroupChanges = panelDialog?.mode === 'access' ? [
    {
      key: 'projectMembers',
      label: 'Project members',
      before: panelFileAccessOriginal.projectMembers ? 'Can access' : 'Not selected',
      after: panelDialog.projectMembers ? 'Can access' : 'Not selected',
      changed: panelFileAccessOriginal.projectMembers !== panelDialog.projectMembers,
    },
    {
      key: 'parentAccess',
      label: 'Inherited folder access',
      before: panelFileAccessOriginal.parentAccess ? 'Inherited' : 'Not inherited',
      after: panelDialog.parentAccess ? 'Inherited' : 'Not inherited',
      changed: panelFileAccessOriginal.parentAccess !== panelDialog.parentAccess,
    },
    {
      key: 'clientVisible',
      label: 'Client visibility',
      before: panelFileAccessOriginal.clientVisible ? 'Approved' : 'Internal',
      after: panelDialog.clientVisible ? 'Approved' : 'Internal',
      changed: panelFileAccessOriginal.clientVisible !== panelDialog.clientVisible,
    },
  ].filter(item => item.changed) : [];
  const panelFileAccessAddedPeople = panelDialog?.mode === 'access'
    ? Array.from(panelFileAccessSelectedUsers).filter(name => !panelFileAccessOriginal.users.has(name)).map(fsPersonForName)
    : [];
  const panelFileAccessRemovedPeople = panelDialog?.mode === 'access'
    ? Array.from(panelFileAccessOriginal.users).filter(name => !panelFileAccessSelectedUsers.has(name)).map(fsPersonForName)
    : [];
  const hasPanelFileAccessChanges = panelDialog?.mode === 'access'
    ? panelFileAccessGroupChanges.length > 0 || !sameNameSet(panelFileAccessOriginal.users, panelFileAccessSelectedUsers)
    : false;
  const panelSpecificAccessPeople = panelDialog?.selectedUsers
    ? Array.from(panelDialog.selectedUsers).map(fsPersonForName)
    : selectedSpecificAccessNames.map(fsPersonForName);
  const panelAddedAccessPeople = Array.from(panelSelectedAccessSet)
    .filter(name => !panelOriginalAccessSet.has(name))
    .map(fsPersonForName);
  const panelRemovedAccessPeople = Array.from(panelOriginalAccessSet)
    .filter(name => !panelSelectedAccessSet.has(name))
    .map(fsPersonForName);
  const hasPanelAccessChanges = panelAddedAccessPeople.length > 0 || panelRemovedAccessPeople.length > 0;
  const selectedUploaded = selectedFile?.uploaded || selectedFile?.modified || '-';
  const selectedModifiedBy = selectedFile?.modifiedBy || selectedFile?.editor || selectedFile?.uploader || '-';

  return (
    <section
      ref={filesShellRef}
      className="ipad-files"
      data-compact={compact ? 'true' : 'false'}
      data-preview={selectedFile ? 'open' : 'closed'}
      style={{ '--files-sidebar-w': sidebarWidth + 'px' }}
    >
      <div className="ipad-files__nav" aria-label="Files folders">
        <div className="ipad-files__project">
          <span className="ipad-files__project-kicker">Selected Project</span>
          <strong>{projectName}</strong>
          <span>Operational source of truth</span>
        </div>
        <div className="ipad-files-folder-head">
          <span>Project Folders</span>
        </div>
        <div className="ipad-files__folder-list">
          {renderFolderDraft('', 0)}
          {visibleFolders.map(folder => {
            const isActive = folder.id === selectedTreeFolderId;
            const isExpanded = expandedIds.has(folder.id);
            const hasChildren = !!folder.children?.length;
            const isMenuOpen = openMenuId === folder.id;
            const canEditFolder = !folder.system && !FS_PROTECTED_ROOTS.has(folder.id);
            const validDrop = dropTargetId === folder.id;
            const invalidDrop = invalidDropId === folder.id;
            return (
              <React.Fragment key={folder.id}>
              <div
                key={folder.id}
                className={
                  'ipad-files-folder'
                  + (isActive ? ' is-active' : '')
                  + (isMenuOpen ? ' is-menu-open' : '')
                  + (validDrop ? ' is-drop-valid' : '')
                  + (invalidDrop ? ' is-drop-invalid' : '')
                }
                style={{ '--level': folder.level }}
                draggable={canEditFolder}
                onDragStart={e => {
                  if (!canEditFolder) return;
                  setDragFolderId(folder.id);
                  e.dataTransfer.effectAllowed = 'move';
                }}
                onDragOver={e => {
                  if (!dragFolderId || dragFolderId === folder.id) return;
                  const dragged = findFolder(folderTree, dragFolderId);
                  if (canMoveFolder(folderTree, dragged, folder.id)) {
                    e.preventDefault();
                    setDropTargetId(folder.id);
                    setInvalidDropId('');
                  } else {
                    setDropTargetId('');
                    setInvalidDropId(folder.id);
                  }
                }}
                onDragLeave={() => {
                  setDropTargetId('');
                  setInvalidDropId('');
                }}
                onDrop={e => {
                  e.preventDefault();
                  const dragged = findFolder(folderTree, dragFolderId);
                  if (moveFolder(dragged, folder.id)) {
                    setDropTargetId('');
                    setInvalidDropId('');
                    setDragFolderId('');
                  }
                }}
                onDragEnd={() => {
                  setDropTargetId('');
                  setInvalidDropId('');
                  setDragFolderId('');
                }}
              >
                <span className="ipad-files-tree__guide" />
                <button
                  className={'ipad-files-folder__chev' + (isExpanded ? ' is-expanded' : '')}
                  onClick={e => { e.stopPropagation(); if (hasChildren) toggleFolder(folder.id); }}
                  aria-label={isExpanded ? 'Collapse folder' : 'Expand folder'}
                  disabled={!hasChildren}
                >
                  {hasChildren && <FsI.chevron size={14} />}
                </button>
                <button className="ipad-files-folder__main" onClick={() => changeFolder(folder)} aria-label={folder.name}>
                <span className="ipad-files-folder__icon"><FsI.folder size={18} /></span>
                <span className="ipad-files-folder__body">
                  {folderDraft?.mode === 'rename' && folderDraft.folderId === folder.id ? (
                    <span className="ipad-files-folder-draft__body">
                      <input
                        autoFocus
                        value={folderDraftName}
                        onChange={e => { setFolderDraftName(e.target.value); setFolderError(''); }}
                        onKeyDown={e => {
                          if (e.key === 'Enter') commitFolderDraft();
                          if (e.key === 'Escape') { setFolderDraft(null); setFolderError(''); }
                        }}
                      />
                      {folderError && <span>{folderError}</span>}
                    </span>
                  ) : (
                    <span className="ipad-files-folder__name" onMouseEnter={event => handleFolderNameHover(event, folder.name)}>{folder.name}</span>
                  )}
                  <span className="ipad-files-folder__meta">
                    {folder.adminOnly ? 'Admin visible' : folder.system ? 'System folder' : 'Custom folder'}
                  </span>
                </span>
                {folder.adminOnly && <FsI.lock size={14} />}
                </button>
                <button
                  className="ipad-files-folder__more"
                  onClick={e => { e.stopPropagation(); setOpenMenuId(isMenuOpen ? '' : folder.id); }}
                  aria-label={'Folder actions for ' + folder.name}
                >
                  <FsI.more size={15} />
                </button>
                {isMenuOpen && (
                  <div className="ipad-files-folder-menu">
                    {canEditFolder ? (
                      <>
                        <button onClick={() => startRenameFolder(folder)}>Rename</button>
                        <button onClick={() => {
                          if (!folder.parentId) setFolderError('Drag this folder onto another permitted folder to move it.');
                          else moveFolder(folder, '');
                        }}>Move</button>
                        <button onClick={() => openFolderPanel('access', folder)}>Manage access</button>
                        <button className="is-danger" onClick={() => deleteFolder(folder)}>Delete</button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => openFolderPanel('access', folder)}>Manage access</button>
                        <button onClick={() => openFolderPanel('details', folder)}>Folder details</button>
                      </>
                    )}
                  </div>
                )}
              </div>
              {renderFolderDraft(folder.id, folder.level + 1)}
              </React.Fragment>
            );
          })}
        </div>
        <div
          className="ipad-files__resize"
          onMouseDown={event => {
            event.preventDefault();
            setIsResizingSidebar(true);
          }}
          role="separator"
          aria-orientation="vertical"
          aria-label="Resize files sidebar"
        />
      </div>

      {folderCreateDialog && (
        <div className="ipad-files-action-panel" role="dialog" aria-modal="true" aria-label="Create custom folder">
          <div className="ipad-files-action-panel__sheet ipad-files-create-folder">
            <div className="ipad-files-action-panel__head">
              <div>
                <span>New custom folder</span>
                <strong>{createParentName}</strong>
              </div>
              <button onClick={closeFolderCreateDialog} aria-label="Close"><FsI.close size={16} /></button>
            </div>
            <div className="ipad-files-create-folder__body">
              <label className="ipad-files-create-folder__field">
                <span>Folder Name</span>
                <input
                  autoFocus
                  value={folderAccessDraft.name}
                  onChange={event => setFolderAccessDraft(prev => ({ ...prev, name: event.target.value, error: '' }))}
                  onKeyDown={event => {
                    if (event.key === 'Enter') commitToolbarFolder();
                    if (event.key === 'Escape') closeFolderCreateDialog();
                  }}
                  placeholder="Folder name"
                />
                <small>Used for search and to clearly identify the folder in this project.</small>
              </label>
              <div className="ipad-files-create-folder__access">
                <span>Access Management</span>
                <label>
                  <input
                    type="checkbox"
                    checked={folderAccessDraft.projectMembers}
                    onChange={event => setFolderAccessDraft(prev => ({ ...prev, projectMembers: event.target.checked, error: '' }))}
                  />
                  <strong>Project Members</strong>
                  <small>Allow members assigned to {projectName}.</small>
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={folderAccessDraft.parentAccess}
                    onChange={event => setFolderAccessDraft(prev => ({ ...prev, parentAccess: event.target.checked, error: '' }))}
                  />
                  <strong>Users with access to parent folder</strong>
                  <small>Inherit access from {createParentName}.</small>
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={folderAccessDraft.clientAccess}
                    onChange={event => setFolderAccessDraft(prev => ({ ...prev, clientAccess: event.target.checked, error: '' }))}
                  />
                  <strong>Clients</strong>
                  <small>Allow client users to access this folder.</small>
                </label>
              </div>
              <div className="ipad-files-create-folder__users">
                <div className="ipad-files-create-folder__users-head">
                  <span>Specific users</span>
                  <select
                    value={folderAccessDraft.roleFilter}
                    onChange={event => setFolderAccessDraft(prev => ({ ...prev, roleFilter: event.target.value }))}
                    aria-label="Filter users by role"
                  >
                    {FS_ROLE_FILTERS.map(role => <option key={role.id} value={role.id}>{role.label}</option>)}
                  </select>
                </div>
                <div className="ipad-files-create-folder__user-list">
                  {filteredAccessUsers.map(user => (
                    <label key={user.name}>
                      <input
                        type="checkbox"
                        checked={folderAccessDraft.users.has(user.name)}
                        onChange={event => setFolderAccessUser(user.name, event.target.checked)}
                      />
                      <span className="ipad-files-create-folder__user-main">
                        <strong>{user.name}</strong>
                        <small>{user.roleLabel}</small>
                      </span>
                      <span className="ipad-files-create-folder__role">{user.role}</span>
                    </label>
                  ))}
                </div>
              </div>
              {folderAccessDraft.error && <div className="ipad-files-create-folder__error">{folderAccessDraft.error}</div>}
            </div>
            <div className="ipad-files-action-panel__foot ipad-files-create-folder__foot">
              <button className="ipad-files-action-panel__secondary" onClick={closeFolderCreateDialog}>Cancel</button>
              <button onClick={commitToolbarFolder}>Create folder</button>
            </div>
          </div>
        </div>
      )}

      {panelFolder && (
        <div className="ipad-files-action-panel" role="dialog" aria-modal="true" aria-label={folderPanel.mode === 'access' ? 'Manage folder access' : 'Folder details'}>
          <div className="ipad-files-action-panel__sheet">
            <div className="ipad-files-action-panel__head">
              <div>
                <span>{folderPanel.mode === 'access' ? 'Manage access' : 'Folder details'}</span>
                <strong>{panelFolder.name}</strong>
              </div>
              <button onClick={() => setFolderPanel(null)} aria-label="Close"><FsI.close size={16} /></button>
            </div>
            {folderPanel.mode === 'access' ? (
              <>
                {!folderPanel.confirmAccess ? (
                  <>
                    <label className="ipad-files-access-row ipad-files-access-row--toggle">
                      <input
                        type="checkbox"
                        checked={folderPanel.projectMembers}
                        onChange={event => setPanelFolderAccess('projectMembers', event.target.checked)}
                      />
                      <span>Project team</span>
                      <strong>{folderPanel.projectMembers ? 'Can view and upload' : 'Not selected'}</strong>
                    </label>
                    <label className="ipad-files-access-row ipad-files-access-row--toggle">
                      <input
                        type="checkbox"
                        checked={folderPanel.parentAccess}
                        onChange={event => setPanelFolderAccess('parentAccess', event.target.checked)}
                      />
                      <span>Parent folder access</span>
                      <strong>{folderPanel.parentAccess ? 'Inherited' : 'Not inherited'}</strong>
                    </label>
                    <label className="ipad-files-access-row ipad-files-access-row--toggle">
                      <input
                        type="checkbox"
                        checked={folderPanel.clientAccess}
                        onChange={event => setPanelFolderAccess('clientAccess', event.target.checked)}
                      />
                      <span>Clients</span>
                      <strong>{folderPanel.clientAccess ? 'Can access folder' : 'No access by default'}</strong>
                    </label>
                    <div className="ipad-files-access-people">
                      <div className="ipad-files-access-people__head">
                        <span>Specific users</span>
                        <select
                          value={folderPanel.roleFilter}
                          onChange={event => setFolderPanel(prev => ({ ...prev, roleFilter: event.target.value }))}
                          aria-label="Filter users by role"
                        >
                          {FS_ROLE_FILTERS.map(role => <option key={role.id} value={role.id}>{role.label}</option>)}
                        </select>
                      </div>
                      <div className="ipad-files-access-people__list">
                        {filteredPanelFolderAccessUsers.map(user => {
                          const person = fsPersonForName(user.name);
                          return (
                            <label key={user.name} className="ipad-files-access-person">
                              <input
                                type="checkbox"
                                checked={folderPanel.selectedUsers.has(user.name)}
                                onChange={event => setPanelFolderAccessUser(user.name, event.target.checked)}
                              />
                              {window.MC?.Avatar
                                ? React.createElement(window.MC.Avatar, { p: person, size: 28 })
                                : <span className="ipad-files-access-person__fallback">{person.avatar}</span>}
                              <span className="ipad-files-access-person__body">
                                <strong>{user.name}</strong>
                                <small>{user.roleLabel}</small>
                              </span>
                              <span className="ipad-files-create-folder__role">{user.role}</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                    {panelFolder.adminOnly && (
                      <div className="ipad-files-action-panel__note">
                        Admin-only folder: normal users access related files only through permitted workflows.
                      </div>
                    )}
                    <div className="ipad-files-action-panel__note">
                      Review group, client, and user access before applying changes.
                    </div>
                    <div className="ipad-files-action-panel__foot">
                      <button className="ipad-files-action-panel__secondary" onClick={() => setFolderPanel(null)}>Cancel</button>
                      <button
                        disabled={!hasPanelFolderAccessChanges}
                        onClick={() => setFolderPanel(prev => ({ ...prev, confirmAccess: true }))}
                      >
                        Review changes
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="ipad-files-access-confirm">
                      <div className="ipad-files-access-confirm__head">
                        <strong>Confirm folder access changes</strong>
                        <span>Review the group, client, and user changes before updating this folder.</span>
                      </div>
                      {panelFolderAccessGroupChanges.length > 0 && (
                        <div className="ipad-files-access-confirm__group">
                          <h4>Access groups</h4>
                          {panelFolderAccessGroupChanges.map(change => (
                            <div key={change.key} className="ipad-files-access-confirm__change">
                              <strong>{change.label}</strong>
                              <span>{change.before} -> {change.after}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      {panelFolderAccessAddedPeople.length > 0 && (
                        <div className="ipad-files-access-confirm__group">
                          <h4>Add people</h4>
                          {panelFolderAccessAddedPeople.map(person => (
                            <div key={person.name} className="ipad-files-access-confirm__person">
                              {window.MC?.Avatar
                                ? React.createElement(window.MC.Avatar, { p: person, size: 28 })
                                : <span className="ipad-files-access-person__fallback">{person.avatar}</span>}
                              <span><strong>{person.name}</strong><small>{person.role}</small></span>
                            </div>
                          ))}
                        </div>
                      )}
                      {panelFolderAccessRemovedPeople.length > 0 && (
                        <div className="ipad-files-access-confirm__group is-remove">
                          <h4>Remove people</h4>
                          {panelFolderAccessRemovedPeople.map(person => (
                            <div key={person.name} className="ipad-files-access-confirm__person">
                              {window.MC?.Avatar
                                ? React.createElement(window.MC.Avatar, { p: person, size: 28 })
                                : <span className="ipad-files-access-person__fallback">{person.avatar}</span>}
                              <span><strong>{person.name}</strong><small>{person.role}</small></span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="ipad-files-action-panel__foot">
                      <button className="ipad-files-action-panel__secondary" onClick={() => setFolderPanel(prev => ({ ...prev, confirmAccess: false }))}>Back</button>
                      <button onClick={commitPanelFolderAccess}>Confirm changes</button>
                    </div>
                  </>
                )}
              </>
            ) : (
              <dl className="ipad-files-folder-details">
                <div><dt>Type</dt><dd>{panelIsProtected ? 'System folder' : 'Custom folder'}</dd></div>
                <div><dt>Path</dt><dd>{[projectName, ...panelPath.map(folder => folder.name)].join(' / ')}</dd></div>
                <div><dt>Files</dt><dd>{panelFolderCount}</dd></div>
                <div><dt>Can rename</dt><dd>{panelIsProtected ? 'No' : 'Yes'}</dd></div>
                <div><dt>Can move</dt><dd>{panelIsProtected ? 'No' : 'Yes'}</dd></div>
                <div><dt>Can delete</dt><dd>{panelIsProtected ? 'No' : 'Yes'}</dd></div>
              </dl>
            )}
            {folderPanel.mode !== 'access' && (
              <div className="ipad-files-action-panel__foot">
                <button onClick={() => setFolderPanel(null)}>Done</button>
              </div>
            )}
          </div>
        </div>
      )}

      {fileAction && (
        <div className="ipad-files-action-panel" role="dialog" aria-modal="true" aria-label={fileActionTitle}>
          <div className="ipad-files-action-panel__sheet ipad-files-file-action">
            <div className="ipad-files-action-panel__head">
              <div>
                <span>{fileActionTitle}</span>
                <strong>{fileActionTarget}</strong>
              </div>
              <button onClick={closeFileAction} aria-label="Close"><FsI.close size={16} /></button>
            </div>
            <div className="ipad-files-file-action__body">
              {fileAction.mode === 'edit' && (
                <>
                  <label className="ipad-files-create-folder__field">
                    <span>File name</span>
                    <input
                      autoFocus
                      value={fileActionDraft.name}
                      onChange={event => setFileActionDraft(prev => ({ ...prev, name: event.target.value, error: '' }))}
                      onKeyDown={event => {
                        if (event.key === 'Enter') commitFileAction();
                        if (event.key === 'Escape') closeFileAction();
                      }}
                    />
                    <small>Rename this file for search, display and project recognition.</small>
                  </label>
                  <div className="ipad-files-action-panel__note">
                    This edits the file metadata in Mecca Files. The source document contents stay unchanged.
                  </div>
                </>
              )}
              {fileAction.mode === 'transfer' && (
                <>
                  <label className="ipad-files-create-folder__field">
                    <span>Destination folder</span>
                    <select
                      autoFocus
                      value={fileActionDraft.destinationId}
                      onChange={event => setFileActionDraft(prev => ({ ...prev, destinationId: event.target.value, error: '' }))}
                    >
                      {fileDestinationOptions.map(folder => (
                        <option key={folder.id} value={folder.id}>{folder.label}</option>
                      ))}
                    </select>
                    <small>Moves the selected file record into the chosen project folder or workflow folder.</small>
                  </label>
                  <div className="ipad-files-action-panel__note">
                    Transfer keeps permissions and backup status with the file unless the destination workflow later overrides them.
                  </div>
                </>
              )}
              {fileAction.mode === 'annotate' && (
                <>
                  <label className="ipad-files-create-folder__field">
                    <span>Annotation</span>
                    <textarea
                      autoFocus
                      value={fileActionDraft.note}
                      onChange={event => setFileActionDraft(prev => ({ ...prev, note: event.target.value, error: '' }))}
                      onKeyDown={event => {
                        if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') commitFileAction();
                        if (event.key === 'Escape') closeFileAction();
                      }}
                      placeholder="Add a project note, markup instruction, or review comment"
                    />
                    <small>Annotations stay attached to the file and appear in file details.</small>
                  </label>
                  {fileActionFiles.length === 1 && fileActionFiles[0].annotations?.length > 0 && (
                    <div className="ipad-files-file-action__annotations">
                      {fileActionFiles[0].annotations.map((note, index) => (
                        <div key={index}>
                          <strong>{note.author}</strong>
                          <span>{note.text}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
              {fileActionDraft.error && <div className="ipad-files-create-folder__error">{fileActionDraft.error}</div>}
            </div>
            <div className="ipad-files-action-panel__foot ipad-files-create-folder__foot">
              <button className="ipad-files-action-panel__secondary" onClick={closeFileAction}>Cancel</button>
              <button onClick={commitFileAction}>
                {fileAction.mode === 'edit' ? 'Save changes' : fileAction.mode === 'transfer' ? 'Transfer' : 'Add annotation'}
              </button>
            </div>
          </div>
        </div>
      )}

      {panelDialog && (
        <div className="ipad-files-action-panel" role="dialog" aria-modal="true" aria-label={
          panelDialog.mode === 'backup' ? 'Create backup copy'
          : panelDialog.mode === 'delete' ? 'Delete file'
          : panelDialog.mode === 'access' ? 'Manage file access'
          : panelDialog.mode === 'access-view' ? 'File access'
          : panelDialog.mode === 'workflow' ? 'Related workflow'
          : panelDialog.mode === 'full-preview' ? 'Full file preview'
          : panelDialog.mode === 'move' ? 'Move file'
          : 'Rename file'
        }>
          <div className="ipad-files-action-panel__sheet ipad-files-panel-dialog">
            <div className="ipad-files-action-panel__head">
              <div>
                <span>{
                  panelDialog.mode === 'backup' ? 'Create backup copy'
                  : panelDialog.mode === 'delete' ? 'Delete file?'
                  : panelDialog.mode === 'access' ? 'Manage access'
                  : panelDialog.mode === 'access-view' ? 'File access'
                  : panelDialog.mode === 'workflow' ? 'Related workflow'
                  : panelDialog.mode === 'full-preview' ? 'Full preview'
                  : panelDialog.mode === 'move' ? 'Move file'
                  : 'Rename file'
                }</span>
                <strong>{selectedFile?.name}</strong>
              </div>
              <button onClick={closePanelDialog} aria-label="Close"><FsI.close size={16} /></button>
            </div>

            {panelDialog.mode === 'rename' && (
              <div className="ipad-files-file-action__body">
                <label className="ipad-files-create-folder__field">
                  <span>File name</span>
                  <input
                    autoFocus
                    value={panelDialog.name}
                    onChange={event => setPanelDialog(prev => ({ ...prev, name: event.target.value, error: '' }))}
                    onKeyDown={event => {
                      if (event.key === 'Enter') commitPanelDialog();
                      if (event.key === 'Escape') closePanelDialog();
                    }}
                  />
                </label>
                {panelDialog.error && <div className="ipad-files-create-folder__error">{panelDialog.error}</div>}
                <div className="ipad-files-action-panel__foot ipad-files-create-folder__foot">
                  <button className="ipad-files-action-panel__secondary" onClick={closePanelDialog}>Cancel</button>
                  <button onClick={commitPanelDialog}>Save</button>
                </div>
              </div>
            )}

            {panelDialog.mode === 'move' && (
              <div className="ipad-files-file-action__body">
                <label className="ipad-files-create-folder__field">
                  <span>Destination</span>
                  <select
                    autoFocus
                    value={panelDialog.destinationId}
                    onChange={event => setPanelDialog(prev => ({ ...prev, destinationId: event.target.value, error: '' }))}
                  >
                    {fileDestinationOptions.map(folder => <option key={folder.id} value={folder.id}>{folder.label}</option>)}
                  </select>
                  <small>The file keeps its project and workflow linkage.</small>
                </label>
                {panelDialog.error && <div className="ipad-files-create-folder__error">{panelDialog.error}</div>}
                <div className="ipad-files-action-panel__foot ipad-files-create-folder__foot">
                  <button className="ipad-files-action-panel__secondary" onClick={closePanelDialog}>Cancel</button>
                  <button onClick={commitPanelDialog}>Move file</button>
                </div>
              </div>
            )}

            {panelDialog.mode === 'backup' && (
              <div className="ipad-files-file-action__body">
                <div className="ipad-files-access-row">
                  <span>File</span>
                  <strong>{selectedFile?.name}</strong>
                </div>
                <label className="ipad-files-create-folder__field">
                  <span>Backup name</span>
                  <input
                    autoFocus
                    value={panelDialog.backupName}
                    onChange={event => setPanelDialog(prev => ({ ...prev, backupName: event.target.value, error: '' }))}
                  />
                </label>
                <label className="ipad-files-create-folder__field">
                  <span>Destination</span>
                  <select
                    value={panelDialog.destinationId}
                    onChange={event => setPanelDialog(prev => ({ ...prev, destinationId: event.target.value, error: '' }))}
                  >
                    {fileDestinationOptions.map(folder => <option key={folder.id} value={folder.id}>{folder.label}</option>)}
                  </select>
                </label>
                {panelDialog.error && <div className="ipad-files-create-folder__error">{panelDialog.error}</div>}
                <div className="ipad-files-action-panel__foot ipad-files-create-folder__foot">
                  <button className="ipad-files-action-panel__secondary" onClick={closePanelDialog}>Cancel</button>
                  <button onClick={commitPanelDialog}>Create backup</button>
                </div>
              </div>
            )}

            {panelDialog.mode === 'delete' && (
              <div className="ipad-files-file-action__body">
                <div className="ipad-files-delete-copy">
                  <strong>{selectedFile?.name}</strong>
                  <span>This file will be removed from MeccaAI and will no longer be available to users with access to this folder.</span>
                </div>
                <div className="ipad-files-action-panel__foot ipad-files-create-folder__foot">
                  <button className="ipad-files-action-panel__secondary" onClick={closePanelDialog}>Cancel</button>
                  <button className="ipad-files-danger-button" onClick={commitPanelDialog}>Delete file</button>
                </div>
              </div>
            )}

            {panelDialog.mode === 'access' && (
              <div className="ipad-files-file-action__body">
                {!panelDialog.confirmAccess ? (
                  <>
                    <label className="ipad-files-access-row ipad-files-access-row--toggle">
                      <input
                        type="checkbox"
                        checked={panelDialog.projectMembers}
                        onChange={event => setPanelDialog(prev => ({ ...prev, projectMembers: event.target.checked }))}
                      />
                      <span>Project members</span>
                      <strong>{panelDialog.projectMembers ? 'Can access' : 'Not selected'}</strong>
                    </label>
                    <label className="ipad-files-access-row ipad-files-access-row--toggle">
                      <input
                        type="checkbox"
                        checked={panelDialog.parentAccess}
                        onChange={event => setPanelDialog(prev => ({ ...prev, parentAccess: event.target.checked }))}
                      />
                      <span>Inherited folder access</span>
                      <strong>{panelDialog.parentAccess ? 'Inherited' : 'Not inherited'}</strong>
                    </label>
                    <label className="ipad-files-access-row ipad-files-access-row--toggle">
                      <input
                        type="checkbox"
                        checked={panelDialog.clientVisible}
                        onChange={event => setPanelDialog(prev => ({ ...prev, clientVisible: event.target.checked }))}
                      />
                      <span>Client visibility</span>
                      <strong>{panelDialog.clientVisible ? 'Approved' : 'Internal'}</strong>
                    </label>
                    <div className="ipad-files-access-people">
                      <div className="ipad-files-access-people__head">
                        <span>Specific users</span>
                        <select
                          value={panelDialog.roleFilter}
                          onChange={event => setPanelDialog(prev => ({ ...prev, roleFilter: event.target.value }))}
                          aria-label="Filter users by role"
                        >
                          {FS_ROLE_FILTERS.map(role => <option key={role.id} value={role.id}>{role.label}</option>)}
                        </select>
                      </div>
                      <div className="ipad-files-access-people__list">
                        {filteredPanelAccessUsers.map(user => {
                          const person = fsPersonForName(user.name);
                          return (
                            <label key={user.name} className="ipad-files-access-person">
                              <input
                                type="checkbox"
                                checked={panelDialog.selectedUsers.has(user.name)}
                                onChange={event => setPanelDialog(prev => {
                                  const selectedUsers = new Set(prev.selectedUsers);
                                  event.target.checked ? selectedUsers.add(user.name) : selectedUsers.delete(user.name);
                                  return { ...prev, selectedUsers };
                                })}
                              />
                              {window.MC?.Avatar
                                ? React.createElement(window.MC.Avatar, { p: person, size: 28 })
                                : <span className="ipad-files-access-person__fallback">{person.avatar}</span>}
                              <span className="ipad-files-access-person__body">
                                <strong>{user.name}</strong>
                                <small>{user.roleLabel}</small>
                              </span>
                              <span className="ipad-files-create-folder__role">{user.role}</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                    <div className="ipad-files-action-panel__note">Review group and user access before applying changes.</div>
                    <div className="ipad-files-action-panel__foot ipad-files-create-folder__foot">
                      <button className="ipad-files-action-panel__secondary" onClick={closePanelDialog}>Cancel</button>
                      <button
                        disabled={!hasPanelFileAccessChanges}
                        onClick={() => setPanelDialog(prev => ({ ...prev, confirmAccess: true }))}
                      >
                        Review changes
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="ipad-files-access-confirm">
                      <div className="ipad-files-access-confirm__head">
                        <strong>Confirm permission changes</strong>
                        <span>Review the group and user access changes before updating this file.</span>
                      </div>
                      {panelFileAccessGroupChanges.length > 0 && (
                        <div className="ipad-files-access-confirm__group">
                          <h4>Access groups</h4>
                          {panelFileAccessGroupChanges.map(change => (
                            <div key={change.key} className="ipad-files-access-confirm__change">
                              <strong>{change.label}</strong>
                              <span>{change.before} -> {change.after}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      {panelFileAccessAddedPeople.length > 0 && (
                        <div className="ipad-files-access-confirm__group">
                          <h4>Add people</h4>
                          {panelFileAccessAddedPeople.map(person => (
                            <div key={person.name} className="ipad-files-access-confirm__person">
                              {window.MC?.Avatar
                                ? React.createElement(window.MC.Avatar, { p: person, size: 28 })
                                : <span className="ipad-files-access-person__fallback">{person.avatar}</span>}
                              <span><strong>{person.name}</strong><small>{person.role}</small></span>
                            </div>
                          ))}
                        </div>
                      )}
                      {panelFileAccessRemovedPeople.length > 0 && (
                        <div className="ipad-files-access-confirm__group is-remove">
                          <h4>Remove people</h4>
                          {panelFileAccessRemovedPeople.map(person => (
                            <div key={person.name} className="ipad-files-access-confirm__person">
                              {window.MC?.Avatar
                                ? React.createElement(window.MC.Avatar, { p: person, size: 28 })
                                : <span className="ipad-files-access-person__fallback">{person.avatar}</span>}
                              <span><strong>{person.name}</strong><small>{person.role}</small></span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="ipad-files-action-panel__foot ipad-files-create-folder__foot">
                      <button className="ipad-files-action-panel__secondary" onClick={() => setPanelDialog(prev => ({ ...prev, confirmAccess: false }))}>Back</button>
                      <button onClick={commitPanelDialog}>Confirm changes</button>
                    </div>
                  </>
                )}
              </div>
            )}

            {panelDialog.mode === 'access-view' && (
              <div className="ipad-files-file-action__body">
                {!panelDialog.confirmAccess ? (
                  <>
                    <div className="ipad-files-access-view">
                      <div className="ipad-files-access-view__toolbar">
                        <span>{panelDialog.removeMode ? 'Changes enabled' : 'Review access'}</span>
                        <button
                          onClick={() => setPanelDialog(prev => ({ ...prev, removeMode: !prev.removeMode, confirmAccess: false }))}
                          aria-pressed={panelDialog.removeMode}
                        >
                          Changes
                        </button>
                      </div>
                      <div className="ipad-files-access-view__summary">
                        {panelSpecificAccessPeople.length > 0 ? (
                          window.MC?.StackedAvatars
                            ? React.createElement(window.MC.StackedAvatars, { people: panelSpecificAccessPeople, max: 5, size: 30 })
                            : <div className="ipad-files__access-fallback">{panelSpecificAccessPeople.slice(0, 5).map(person => person.avatar).join(' ')}</div>
                        ) : (
                          <div className="ipad-files-access-view__empty-avatar">0</div>
                        )}
                        <div>
                          <strong>{panelDialog.selectedUsers.size} specific user{panelDialog.selectedUsers.size === 1 ? '' : 's'} added</strong>
                          <span>{panelDialog.removeMode ? 'Check or uncheck people, then review before applying.' : 'Added users are shown first. Use Changes to edit access.'}</span>
                        </div>
                      </div>
                      <div className="ipad-files-access-view__list">
                        {accessViewPeople.map(person => {
                          const isAdded = panelDialog.selectedUsers.has(person.name);
                          return (
                          <div key={person.name} className={'ipad-files-access-view__person' + (isAdded ? ' is-added' : '') + (panelDialog.removeMode ? ' is-editing' : '')}>
                            {panelDialog.removeMode ? (
                              <input
                                type="checkbox"
                                checked={isAdded}
                                onChange={event => togglePanelAccessViewUser(person.name, event.target.checked)}
                                aria-label={(isAdded ? 'Remove access for ' : 'Add access for ') + person.name}
                              />
                            ) : (
                              <span className="ipad-files-access-view__presence">{isAdded ? <FsI.check size={12} /> : ''}</span>
                            )}
                            {window.MC?.Avatar
                              ? React.createElement(window.MC.Avatar, { p: person, size: 30 })
                              : <span className="ipad-files-access-person__fallback">{person.avatar}</span>}
                            <span>
                              <strong>{person.name}</strong>
                              <small>{person.role}</small>
                            </span>
                            <span className="ipad-files-access-view__status">{isAdded ? (panelDialog.removeMode ? 'Remove' : 'Added') : (panelDialog.removeMode ? 'Add' : 'Project')}</span>
                            {person.roleCode && <em>{person.roleCode}</em>}
                          </div>
                        );})}
                      </div>
                    </div>
                    <div className="ipad-files-action-panel__foot ipad-files-create-folder__foot">
                      <button className="ipad-files-action-panel__secondary" onClick={closePanelDialog}>Done</button>
                      {panelDialog.removeMode && hasPanelAccessChanges ? (
                        <button onClick={() => setPanelDialog(prev => ({ ...prev, confirmAccess: true }))}>Review changes</button>
                      ) : (
                        <button onClick={() => openPanelDialog('access')}>Manage access</button>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="ipad-files-access-confirm">
                      <div className="ipad-files-access-confirm__head">
                        <strong>Confirm access changes</strong>
                        <span>These changes affect who can open this file.</span>
                      </div>
                      {panelAddedAccessPeople.length > 0 && (
                        <div className="ipad-files-access-confirm__group">
                          <h4>Add access</h4>
                          {panelAddedAccessPeople.map(person => (
                            <div key={person.name} className="ipad-files-access-confirm__person">
                              {window.MC?.Avatar
                                ? React.createElement(window.MC.Avatar, { p: person, size: 28 })
                                : <span className="ipad-files-access-person__fallback">{person.avatar}</span>}
                              <span><strong>{person.name}</strong><small>{person.role}</small></span>
                            </div>
                          ))}
                        </div>
                      )}
                      {panelRemovedAccessPeople.length > 0 && (
                        <div className="ipad-files-access-confirm__group is-remove">
                          <h4>Remove access</h4>
                          {panelRemovedAccessPeople.map(person => (
                            <div key={person.name} className="ipad-files-access-confirm__person">
                              {window.MC?.Avatar
                                ? React.createElement(window.MC.Avatar, { p: person, size: 28 })
                                : <span className="ipad-files-access-person__fallback">{person.avatar}</span>}
                              <span><strong>{person.name}</strong><small>{person.role}</small></span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="ipad-files-action-panel__foot ipad-files-create-folder__foot">
                      <button className="ipad-files-action-panel__secondary" onClick={() => setPanelDialog(prev => ({ ...prev, confirmAccess: false }))}>Back</button>
                      <button onClick={applyPanelAccessViewChanges}>Confirm changes</button>
                    </div>
                  </>
                )}
              </div>
            )}

            {panelDialog.mode === 'workflow' && (
              <div className="ipad-files-file-action__body">
                <dl className="ipad-files-folder-details">
                  <div><dt>Project</dt><dd>{projectName}</dd></div>
                  <div><dt>Related record</dt><dd>{panelDialog.relation}</dd></div>
                  <div><dt>Folder</dt><dd>{selectedFolder?.name}</dd></div>
                </dl>
                <div className="ipad-files-action-panel__foot">
                  <button onClick={closePanelDialog}>Done</button>
                </div>
              </div>
            )}

            {panelDialog.mode === 'full-preview' && (
              <div className="ipad-files-file-action__body">
                <div className="ipad-files-full-preview">
                  {selectedFile && renderFilePreview(selectedFile)}
                </div>
                <div className="ipad-files-action-panel__foot">
                  <button onClick={closePanelDialog}>Done</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="ipad-files__content">
        <div className="ipad-files__toolbar">
          <div className="ipad-files__title">
            <div className="ipad-files__crumbs">
              <button
                className={'ipad-files__crumb' + (selectedTreeFolderId === 'project-root' ? ' is-current' : '')}
                onClick={() => selectedTreeFolderId !== 'project-root' && navigateToFolderId('project-root')}
                aria-current={selectedTreeFolderId === 'project-root' ? 'page' : undefined}
              >
                {projectName}
              </button>
              {hiddenBreadcrumbFolders.length > 0 && (
                <>
                  <span className="ipad-files__crumb-sep">/</span>
                  <span className="ipad-files__crumb-ellipsis-wrap">
                    <button
                      className="ipad-files__crumb ipad-files__crumb--ellipsis"
                      onClick={() => setBreadcrumbMenuOpen(open => !open)}
                      aria-label="Show hidden parent folders"
                    >
                      ...
                    </button>
                    {breadcrumbMenuOpen && (
                      <span className="ipad-files__crumb-menu">
                        {hiddenBreadcrumbFolders.map(folder => (
                          <button key={folder.id} onClick={() => navigateToFolderId(folder.id)}>{folder.name}</button>
                        ))}
                      </span>
                    )}
                  </span>
                </>
              )}
              {visibleBreadcrumbFolders.map((folder, index) => {
                const isCurrent = folder.id === selectedTreeFolderId;
                return (
                  <React.Fragment key={folder.id}>
                    <span className="ipad-files__crumb-sep">/</span>
                    <button
                      className={'ipad-files__crumb' + (isCurrent ? ' is-current' : '')}
                      onClick={() => !isCurrent && navigateToFolderId(folder.id)}
                      aria-current={isCurrent ? 'page' : undefined}
                    >
                      {folder.name}
                    </button>
                  </React.Fragment>
                );
              })}
            </div>
            {compactParentTarget && (
              <button
                className="ipad-files__compact-parent"
                onClick={() => navigateToFolderId(compactParentTarget.id)}
                title={'Return to ' + compactParentTarget.name}
                aria-label={'Return to ' + compactParentTarget.name}
              >
                <FsI.back size={14} /> {compactParentTarget.name}
              </button>
            )}
            <h2>{activeScope}</h2>
          </div>
          <div className="ipad-files__actions">
            <button
              className={'ipad-files__iconbtn' + (filtersOpen ? ' is-active' : '')}
              onClick={() => setFiltersOpen(open => !open)}
              aria-label={filtersOpen ? 'Hide filters' : 'Show filters'}
              aria-expanded={filtersOpen}
              title={filtersOpen ? 'Hide filters' : 'Show filters'}
            ><FsI.filter size={17} /></button>
            <button
              className={'ipad-files__iconbtn' + (viewMode === 'list' ? ' is-active' : '')}
              onClick={() => setViewMode('list')}
              aria-label="List view"
            ><FsI.list size={17} /></button>
            <button
              className={'ipad-files__iconbtn' + (viewMode === 'grid' ? ' is-active' : '')}
              onClick={() => setViewMode('grid')}
              aria-label="Grid view"
            ><FsI.grid size={17} /></button>
            <button className="ipad-files__btn" onClick={startToolbarFolderDraft} aria-label="New folder in current folder"><FsI.plus size={16} /><span>Folder</span></button>
            <button className="ipad-files__btn ipad-files__btn--primary" onClick={() => uploadInputRef.current?.click()} aria-label="Upload files"><FsI.upload size={16} /><span>Upload</span></button>
            <input
              ref={uploadInputRef}
              className="ipad-files__upload-input"
              type="file"
              multiple
              onChange={event => {
                uploadIntoActiveFolder(event.target.files);
                event.target.value = '';
              }}
            />
          </div>
        </div>

        {filtersOpen && <div className="ipad-files__controls">
          <label className="ipad-files__search">
            <FsI.search size={16} />
            <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search files in this folder" />
          </label>
          <select value={filter} onChange={e => setFilter(e.target.value)} aria-label="Filter by file type">
            {fileTypeFilters.map(type => (
              <option key={type} value={type}>{type === 'All' ? 'All file types' : type}</option>
            ))}
          </select>
          <select value={sort} onChange={e => setSort(e.target.value)} aria-label="Sort files">
            {['Modified', 'Name'].map(s => <option key={s}>{s}</option>)}
          </select>
        </div>}

        {selectedCount > 0 && (
          <div className="ipad-files__selectionbar">
            <strong>{selectedCount} selected</strong>
            <button><FsI.download size={14} />Download</button>
            <button><FsI.share size={14} />Share</button>
            <button onClick={() => openFileAction('transfer', selectedActionFiles)}><FsI.move size={14} />Transfer</button>
            <button onClick={() => openFileAction('annotate', selectedActionFiles)}><FsI.annotate size={14} />Annotate</button>
            <button onClick={() => setSelectedIds(new Set())}>Clear</button>
          </div>
        )}

        <div className="ipad-files__table" data-view={viewMode} role="table" aria-label="Folder contents">
          {visibleFolderCards.length > 0 && (
            <div className="ipad-files__folder-grid" aria-label="Folders">
              {visibleFolderCards.map(folder => (
                <button key={folder.id} className="ipad-files-card ipad-files-card--folder" onClick={() => changeFolder(folder.folder)}>
                  <span className="ipad-files-card__icon"><FsI.folder size={24} /></span>
                  <span className="ipad-files-card__body">
                    <span className="ipad-files-card__name">{folder.name}</span>
                    <span className="ipad-files-card__meta">{folder.count ? folder.count + ' ' + (folder.count === 1 ? 'file' : 'files') : 'Empty'}</span>
                  </span>
                </button>
              ))}
            </div>
          )}

          <div className="ipad-files-row ipad-files-row--head" role="row">
            <span></span><span>Name</span><span>Modified</span><span>Workflow</span><span></span>
          </div>
          {visibleItems.length ? visibleItems.map(file => {
            const isChecked = selectedIds.has(file.id);
            return (
              <button
                key={file.id}
                data-file-id={file.id}
                className={'ipad-files-row' + (file.id === selectedFile?.id ? ' is-selected' : '') + (isChecked ? ' is-checked' : '')}
                onClick={() => chooseFile(file.id)}
                role="row"
              >
                <span className="ipad-files-row__check" onClick={e => e.stopPropagation()}>
                  <input type="checkbox" checked={isChecked} onChange={() => toggleSelected(file.id)} aria-label={'Select ' + file.name} />
                </span>
                <span className={'ipad-files-row__preview ipad-files-row__preview--' + fileVisualType(file)}>
                  {renderFileGridPreview(file)}
                  <span className="ipad-files-row__preview-label">{filePreviewLabel(file)}</span>
                </span>
                <span className="ipad-files-row__name">
                  <span className={'ipad-files-row__glyph ipad-files-row__glyph--' + fileVisualType(file)}>{fileIcon(file, { size: 18 })}</span>
                  <span><strong>{file.name}</strong><small>{file.type} - {file.size} - {file.uploader}</small></span>
                </span>
                <span>{file.modified}</span>
                <span>{file.workflow}</span>
                <span className="ipad-files-row__quick">
                  <span><FsI.star size={15} /></span>
                  <span onClick={event => { event.stopPropagation(); openFileAction('annotate', [file]); }} title="Annotate file"><FsI.annotate size={15} /></span>
                </span>
              </button>
            );
          }) : visibleFolderCards.length ? null : (
            <div className="ipad-files__empty">
              <FsI.folder size={26} />
              <strong>No files match this view</strong>
              <span>Uploads must stay linked to {projectName} and the selected workflow.</span>
            </div>
          )}
        </div>
      </div>

      {selectedFile && (
        <aside className="ipad-files__preview is-open">
          <div className="ipad-files__preview-head">
            <strong>File details</strong>
            <button className="ipad-files__preview-close" onClick={closeFileDetails} title="Close file details" aria-label="Close file details">
              <FsI.close size={17} />
            </button>
          </div>
          <div className={'ipad-files-previewbox' + (selectedFile.previewUrl ? ' ipad-files-previewbox--active' : '')}>
            {renderFilePreview(selectedFile)}
          </div>
          <div className="ipad-files__meta-head">
            <h3 title={selectedFile.name}>{selectedFile.name}</h3>
            <span>{selectedFile.type} &middot; {selectedFile.size} &middot; Uploaded by {selectedFile.uploader}</span>
          </div>
          <div className="ipad-files__panel-actions ipad-files__panel-actions--primary">
            <button onClick={() => openFullPreview(selectedFile)}>Open file</button>
            <button onClick={() => showPanelToast('Download started.')}><FsI.download size={15} />Download</button>
          </div>
          <div className="ipad-files__panel-actions ipad-files__panel-actions--secondary">
            {isPdfFile(selectedFile) && (
              <button onClick={() => openFileAction('annotate', [selectedFile])}><FsI.annotate size={15} />Annotate PDF</button>
            )}
            <span className="ipad-files__more-wrap">
              <button onClick={togglePanelMoreMenu} aria-haspopup="menu" aria-expanded={panelMoreOpen}><FsI.more size={15} />More</button>
              {panelMoreOpen && (
                <span className="ipad-files__more-menu" role="menu" style={panelMorePosition || undefined}>
                  <button onClick={() => openPanelDialog('rename')}>Rename</button>
                  {canMovePanelFile(selectedFile) && <button onClick={() => openPanelDialog('move')}>Move</button>}
                  <button onClick={() => openPanelDialog('backup')}>Create backup copy</button>
                  {selectedRelatedRecord && <button onClick={() => openPanelDialog('workflow')}>View related workflow</button>}
                  <span className="ipad-files__more-divider" />
                  <button className="is-danger" onClick={() => openPanelDialog('delete')}>Delete</button>
                </span>
              )}
            </span>
          </div>

          <button className="ipad-files__access-summary" onClick={() => openPanelDialog('access-view')} title={selectedAccessSummary} aria-label="View people who can access this file">
            <div>
              <h4>Access</h4>
              <span>{selectedAccessPeople.length} people</span>
              <small>View people</small>
            </div>
            <span className="ipad-files__access-avatars" aria-hidden="true">
              {window.MC?.StackedAvatars ? (
                React.createElement(window.MC.StackedAvatars, { people: selectedAccessPeople, max: 3, size: 24 })
              ) : (
                <span className="ipad-files__access-fallback">{selectedAccessPeople.slice(0, 3).map(person => person.avatar).join(' ')}</span>
              )}
            </span>
          </button>

          <div className="ipad-files__meta-section">
            <h4>Location</h4>
            <dl className="ipad-files__meta">
              <div><dt>Project</dt><dd>{projectName}</dd></div>
              <div><dt>Folder</dt><dd>{selectedFolder?.name || '-'}</dd></div>
            </dl>
          </div>
          <div className="ipad-files__meta-section">
            <h4>File Information</h4>
            <dl className="ipad-files__meta">
              <div><dt>Modified by</dt><dd>{selectedModifiedBy}</dd></div>
              <div><dt>Uploaded</dt><dd>{selectedUploaded}</dd></div>
              <div><dt>Modified</dt><dd>{selectedFile.modified}</dd></div>
              {selectedFile.annotations?.length > 0 && (
                <div><dt>Annotations</dt><dd>{selectedFile.annotations.map(note => note.text).join(' | ')}</dd></div>
              )}
            </dl>
          </div>
          {panelToast && (
            <div className="ipad-files__panel-toast">
              <span>{panelToast.message}</span>
              {panelToast.undo && <button onClick={() => { panelToast.undo(); setPanelToast(null); }}>Undo</button>}
            </div>
          )}
        </aside>
      )}
    </section>
  );
}

window.MC = window.MC || {};
window.MC.IPadFilesPage = IPadFilesPage;
