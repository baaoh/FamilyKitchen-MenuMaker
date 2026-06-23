import React, { useState, useEffect, useRef } from 'react';
import { 
  Printer, 
  Download, 
  Upload, 
  RotateCcw, 
  Plus, 
  Trash2, 
  ChevronUp, 
  ChevronDown, 
  Sliders, 
  Palette, 
  FileText, 
  AlertTriangle, 
  Eye, 
  Copy, 
  Check, 
  Info,
  Layers,
  ArrowUpDown,
  BookOpen,
  Lock,
  Unlock,
  Key,
  FolderOpen,
  Pencil,
  X,
  GripVertical
} from 'lucide-react';
import { 
  PAGE_SIZES, 
  PRESET_THEMES, 
  INITIAL_MENU_DATA, 
  INITIAL_DRINKS_MENU_DATA, 
  INITIAL_FOOD_MENU_DATA 
} from './templates';

// --- Cryptographic Hash Helper (Web Crypto SHA-256 with shift-hash fallback for HTTP) ---
const hashPasscode = async (text) => {
  if (!text) return '';
  if (window.crypto && crypto.subtle) {
    try {
      const msgBuffer = new TextEncoder().encode(text);
      const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    } catch (e) {
      // Fallback below
    }
  }
  // Simple polynomial rolling hash fallback for unencrypted HTTP deployment
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return 'fallback_' + Math.abs(hash).toString(16);
};

const getItemsGridStyle = (layout) => {
  if (layout === 'grid-2') {
    return { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--item-gap, 14px)' };
  }
  if (layout === 'grid-3') {
    return { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--item-gap, 14px)' };
  }
  if (layout === 'grid-4') {
    return { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--item-gap, 14px)' };
  }
  if (layout === 'triangle-3') {
    return { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--item-gap, 14px)' };
  }
  return { display: 'flex', flexDirection: 'column', gap: 'var(--item-gap, 14px)' };
};

const getItemStyle = (layout, idx, totalItems) => {
  if (layout === 'triangle-3' && idx === 2) {
    return {
      gridColumn: 'span 2',
      justifySelf: 'center',
      width: '80%',
      textAlign: 'center'
    };
  }
  return {};
};

export default function App() {
  // --- MULTI-PROJECT STATE MANAGEMENT ---
  const [projects, setProjects] = useState(() => {
    const saved = localStorage.getItem('menu_designer_projects');
    if (saved) return JSON.parse(saved);
    
    // Default initial projects
    return [
      {
        id: 'proj-food',
        name: 'Food Menu',
        menuData: INITIAL_FOOD_MENU_DATA,
        settings: {
          pageSize: 'a4',
          theme: 'centered-zen',
          columns: 1,
          pagePadding: 35,
          categoryGap: 24,
          itemGap: 14,
          titleSize: 2.2,
          subtitleSize: 1.0,
          catSize: 1.25,
          itemSize: 0.95,
          descSize: 0.8,
          showDots: false,
          borderStyle: 'none',
          borderWidth: 1,
          customBg: '',
          customText: '',
          customAccent: '',
          customBorder: '',
          textAlign: 'center',
          pageCount: 3,
          paginationMode: 'auto'
        }
      },
      {
        id: 'proj-drinks',
        name: 'Drinks Menu',
        menuData: INITIAL_DRINKS_MENU_DATA,
        settings: {
          pageSize: 'split-a4',
          theme: 'modern-drinks',
          columns: 1,
          pagePadding: 25,
          categoryGap: 20,
          itemGap: 10,
          titleSize: 2.0,
          subtitleSize: 0.95,
          catSize: 1.1,
          itemSize: 0.9,
          descSize: 0.75,
          showDots: false,
          borderStyle: 'none',
          borderWidth: 1,
          customBg: '',
          customText: '',
          customAccent: '',
          customBorder: '',
          textAlign: 'left',
          pageCount: 2,
          paginationMode: 'auto'
        }
      }
    ];
  });

  const [activeProjectId, setActiveProjectId] = useState(() => {
    const saved = localStorage.getItem('menu_designer_active_project_id');
    return saved || 'proj-food';
  });

  // Derived Active Project, Data, and Settings
  const activeProject = projects.find(p => p.id === activeProjectId) || projects[0];
  const menuData = activeProject.menuData;
  const settings = activeProject.settings;

  // Custom Projects State Setters (keeps active project synchronized)
  const setMenuData = (update) => {
    setProjects(prev => prev.map(proj => {
      if (proj.id !== activeProjectId) return proj;
      const nextMenuData = typeof update === 'function' ? update(proj.menuData) : update;
      return { ...proj, menuData: nextMenuData };
    }));
  };

  const setSettings = (update) => {
    setProjects(prev => prev.map(proj => {
      if (proj.id !== activeProjectId) return proj;
      const nextSettings = typeof update === 'function' ? update(proj.settings) : update;
      return { ...proj, settings: nextSettings };
    }));
  };

  // Custom Presets State
  const [customPresets, setCustomPresets] = useState(() => {
    const saved = localStorage.getItem('menu_designer_custom_presets');
    return saved ? JSON.parse(saved) : [];
  });
  const [presetSaveName, setPresetSaveName] = useState('');

  // Sidebar Tabs & Visual preview states
  const [activeTab, setActiveTab] = useState('data'); // 'data' | 'styling' | 'presets' | 'projects'
  const [expandedCategories, setExpandedCategories] = useState({ 'cat-f1': true, 'cat-d1': true });
  const [scale, setScale] = useState(0.65);
  const [overflowState, setOverflowState] = useState({ pages: {}, categories: {} });
  const [successMessage, setSuccessMessage] = useState('');
  const [editingProjectId, setEditingProjectId] = useState(null);
  const [editingProjectName, setEditingProjectName] = useState('');
  const [draggedCatIdx, setDraggedCatIdx] = useState(null);
  const [activeScrollCatId, setActiveScrollCatId] = useState(null);
  
  // Resizable Sidebar States & Handlers
  const [sidebarWidth, setSidebarWidth] = useState(() => {
    const saved = localStorage.getItem('menu_designer_sidebar_width');
    return saved ? parseInt(saved) : 480;
  });
  const [isDraggingSidebar, setIsDraggingSidebar] = useState(false);

  const startResizing = (mouseDownEvent) => {
    mouseDownEvent.preventDefault();
    setIsDraggingSidebar(true);
    
    const startWidth = sidebarWidth;
    const startX = mouseDownEvent.clientX;

    const doDrag = (mouseMoveEvent) => {
      const currentWidth = startWidth + (mouseMoveEvent.clientX - startX);
      const newWidth = Math.max(320, Math.min(800, currentWidth)); // Clamp width between 320px and 800px
      setSidebarWidth(newWidth);
      localStorage.setItem('menu_designer_sidebar_width', newWidth.toString());
    };

    const stopDrag = () => {
      setIsDraggingSidebar(false);
      document.removeEventListener('mousemove', doDrag);
      document.removeEventListener('mouseup', stopDrag);
    };

    document.addEventListener('mousemove', doDrag);
    document.addEventListener('mouseup', stopDrag);
  };
  
  // Project Management Input
  const [newProjectName, setNewProjectName] = useState('');

  // App Security Password Protection
  const [isLocked, setIsLocked] = useState(() => {
    try {
      const savedProjects = localStorage.getItem('menu_designer_projects');
      const savedActiveId = localStorage.getItem('menu_designer_active_project_id') || 'proj-food';
      if (savedProjects) {
        const parsed = JSON.parse(savedProjects);
        const currentActive = parsed.find(p => p.id === savedActiveId) || parsed[0];
        return !!currentActive.settings.passcodeHash;
      }
    } catch(e) {}
    return false;
  });
  const [typedPasscode, setTypedPasscode] = useState('');
  const [lockError, setLockError] = useState('');
  
  const [newPasscode, setNewPasscode] = useState('');
  const [confirmPasscode, setConfirmPasscode] = useState('');
  const [passcodeError, setPasscodeError] = useState('');

  const previewRef = useRef(null);
  const pageRef = useRef(null);
  const scrollOwnerRef = useRef(null); // 'canvas' | 'sidebar'

  // --- LOCAL STORAGE SYNCRONIZATION ---
  useEffect(() => {
    localStorage.setItem('menu_designer_projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('menu_designer_active_project_id', activeProjectId);
  }, [activeProjectId]);

  useEffect(() => {
    localStorage.setItem('menu_designer_custom_presets', JSON.stringify(customPresets));
  }, [customPresets]);

  // --- DYNAMIC MULTI-PAGE & CATEGORY OVERFLOW DETECTOR ---
  useEffect(() => {
    if (isLocked) return;
    
    const checkAllOverflows = () => {
      const pageElements = document.querySelectorAll('.preview-canvas .menu-page-wrapper');
      const newPagesOverflow = {};
      const newCategoriesOverflow = {};

      pageElements.forEach((pageEl, pageIdx) => {
        // 1. Check page scroll overflow
        const contentBlock = pageEl.querySelector('.menu-page-content');
        if (!contentBlock) return;

        // Content overflows if scrollHeight is larger than clientHeight (with 2px buffer)
        const hasPageOverflow = contentBlock.scrollHeight > contentBlock.clientHeight + 2;
        if (hasPageOverflow) {
          newPagesOverflow[pageIdx] = true;
        }

        // 2. Check individual category cut-offs
        const contentRect = contentBlock.getBoundingClientRect();
        const categoryEls = pageEl.querySelectorAll('.menu-category-section');
        
        categoryEls.forEach(catEl => {
          const catId = catEl.getAttribute('data-catid');
          if (!catId) return;

          const catRect = catEl.getBoundingClientRect();
          // If the bottom of a category extends past the bottom margin of the page content box, it is cut off
          if (catRect.bottom > contentRect.bottom + 2) {
            newCategoriesOverflow[catId] = true;
          }
        });
      });

      setOverflowState(prev => {
        const pageKeysPrev = Object.keys(prev.pages).sort().join(',');
        const pageKeysNew = Object.keys(newPagesOverflow).sort().join(',');
        const catKeysPrev = Object.keys(prev.categories).sort().join(',');
        const catKeysNew = Object.keys(newCategoriesOverflow).sort().join(',');

        if (pageKeysPrev !== pageKeysNew || catKeysPrev !== catKeysNew) {
          return {
            pages: newPagesOverflow,
            categories: newCategoriesOverflow
          };
        }
        return prev;
      });
    };

    const timer = setTimeout(checkAllOverflows, 200);
    window.addEventListener('resize', checkAllOverflows);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', checkAllOverflows);
    };
  }, [projects, activeProjectId, scale, isLocked]);

  // --- AUTOMATIC PAGINATION ENGINE ---
  const triggerAutoPagination = (force = false) => {
    if (isLocked) return false;

    const pageSize = PAGE_SIZES.find(s => s.id === settings.pageSize) || PAGE_SIZES[0];
    const totalHeightPx = parseFloat(pageSize.height) * 3.77952;
    const paddingPx = (settings.pagePadding || 25) * 2;
    const catGapPx = settings.categoryGap || 24;
    
    // Dynamic header height measurement (fallback to 120 + 24 = 144)
    const headerEl = document.querySelector(`.preview-canvas .menu-header-block`);
    const headerPx = headerEl ? (headerEl.getBoundingClientRect().height / scale + 24) : 144;
    
    // Dynamic footer height measurement (fallback to 50 + 24 = 74)
    const footerEl = document.querySelector(`.preview-canvas .menu-footer-block`);
    const footerPx = footerEl ? (footerEl.getBoundingClientRect().height / scale + 24) : 74;

    // Helper to calculate height of category sections on a page
    const getPageContentHeight = (pageCats) => {
      if (pageCats.length === 0) return 0;
      
      let contentHeight = 0;
      if (settings.columns === 1) {
        contentHeight = pageCats.reduce((sum, c) => sum + c.height, 0);
        contentHeight += (pageCats.length - 1) * catGapPx;
      } else {
        const cols = settings.columns;
        let rowHeights = [];
        for (let i = 0; i < pageCats.length; i += cols) {
          const rowItems = pageCats.slice(i, i + cols);
          const maxHeight = Math.max(...rowItems.map(c => c.height));
          rowHeights.push(maxHeight);
        }
        contentHeight = rowHeights.reduce((sum, h) => sum + h, 0);
        contentHeight += (rowHeights.length - 1) * catGapPx;
      }
      return contentHeight;
    };

    // Get unscaled height for each category
    const categoryHeights = menuData.categories.map(cat => {
      const el = document.querySelector(`.preview-canvas [data-catid="${cat.id}"]`);
      let h = el ? (el.getBoundingClientRect().height / scale) : (90 + cat.items.length * 35);
      return { id: cat.id, height: h };
    });

    let pages = [[]];
    let currentPageIdx = 0;

    for (let i = 0; i < categoryHeights.length; i++) {
      const cat = categoryHeights[i];
      const isLastCategory = (i === categoryHeights.length - 1);
      const footerHeight = (menuData.footer && isLastCategory) ? footerPx : 0;
      const headerHeight = (currentPageIdx === 0) ? headerPx : 15; // 15px is the spacer height for sub-pages
      
      const availableHeight = totalHeightPx - paddingPx - headerHeight - footerHeight;
      
      // Calculate height if we add this category to the current page
      const testPageCats = [...pages[currentPageIdx], cat];
      const testHeight = getPageContentHeight(testPageCats);
      
      if (pages[currentPageIdx].length > 0 && testHeight > availableHeight) {
        // It doesn't fit, start a new page
        currentPageIdx += 1;
        pages[currentPageIdx] = [cat];
      } else {
        // It fits (or is the first category on the page), keep it here
        pages[currentPageIdx].push(cat);
      }
    }

    const categoryPageMap = {};
    pages.forEach((pageCats, pageIdx) => {
      pageCats.forEach(c => {
        categoryPageMap[c.id] = pageIdx;
      });
    });

    let changed = false;
    const updatedCategories = menuData.categories.map(category => {
      const targetPageIdx = categoryPageMap[category.id] !== undefined ? categoryPageMap[category.id] : 0;
      if (category.pageIndex !== targetPageIdx) {
        changed = true;
        return { ...category, pageIndex: targetPageIdx };
      }
      return category;
    });

    const nextPageCount = pages.length;
    
    if (changed || settings.pageCount !== nextPageCount || force) {
      setProjects(prev => prev.map(proj => {
        if (proj.id !== activeProjectId) return proj;
        return {
          ...proj,
          menuData: {
            ...proj.menuData,
            categories: updatedCategories
          },
          settings: {
            ...proj.settings,
            pageCount: nextPageCount
          }
        };
      }));
      return true;
    }
    return false;
  };

  useEffect(() => {
    if (settings.paginationMode !== 'auto' || isLocked) return;

    const timer = setTimeout(() => {
      triggerAutoPagination();
    }, 150);
    return () => clearTimeout(timer);
  }, [
    menuData.categories, 
    menuData.restaurantName,
    menuData.subtitle,
    menuData.footer,
    settings.pageSize, 
    settings.columns, 
    settings.pagePadding, 
    settings.categoryGap, 
    settings.itemGap, 
    settings.titleSize, 
    settings.subtitleSize,
    settings.catSize, 
    settings.itemSize, 
    settings.descSize, 
    settings.showDots,
    settings.borderStyle,
    settings.borderWidth,
    settings.paginationMode, 
    settings.customHeaderFont,
    settings.customBodyFont,
    activeProjectId,
    scale, 
    isLocked
  ]);

  // Flash messages helper
  const showToast = (msg) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  // --- SECURITY ACTIONS ---
  const handleUnlock = async (e) => {
    e.preventDefault();
    setLockError('');
    if (!typedPasscode) return;

    const enteredHash = await hashPasscode(typedPasscode);
    if (enteredHash === settings.passcodeHash) {
      setIsLocked(false);
      setTypedPasscode('');
      showToast('Welcome back! App unlocked.');
    } else {
      setLockError('Incorrect passcode. Please try again.');
    }
  };

  const enablePasscode = async (e) => {
    e.preventDefault();
    setPasscodeError('');
    
    if (!newPasscode) {
      setPasscodeError('Passcode cannot be empty.');
      return;
    }
    if (newPasscode !== confirmPasscode) {
      setPasscodeError('Passcodes do not match.');
      return;
    }

    const hashed = await hashPasscode(newPasscode);
    setSettings(prev => ({
      ...prev,
      passcodeHash: hashed
    }));
    setNewPasscode('');
    setConfirmPasscode('');
    showToast('Passcode protection enabled successfully!');
  };

  const removePasscode = () => {
    if (window.confirm('Are you sure you want to disable password protection? Anyone will be able to edit.')) {
      setSettings(prev => ({
        ...prev,
        passcodeHash: ''
      }));
      showToast('Passcode protection disabled.');
    }
  };

  // --- PROJECT ACTIONS ---
  const handleSwitchProject = (projId) => {
    setActiveProjectId(projId);
    const targetProj = projects.find(p => p.id === projId);
    if (targetProj && targetProj.settings.passcodeHash) {
      setIsLocked(true);
    } else {
      setIsLocked(false);
    }
    showToast(`Switched to menu: ${targetProj?.name}`);
  };

  const handleCreateProject = (e) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;

    const newId = `proj-${Date.now()}`;
    const newProj = {
      id: newId,
      name: newProjectName.trim(),
      menuData: {
        restaurantName: newProjectName.trim(),
        subtitle: "Subtitle / Slogan",
        footer: "Footer info note",
        categories: []
      },
      settings: {
        pageSize: 'a4',
        theme: 'centered-zen',
        columns: 1,
        pagePadding: 35,
        categoryGap: 24,
        itemGap: 14,
        titleSize: 2.2,
        subtitleSize: 1.0,
        catSize: 1.25,
        itemSize: 0.95,
        descSize: 0.8,
        showDots: false,
        borderStyle: 'none',
        borderWidth: 1,
        customBg: '',
        customText: '',
        customAccent: '',
        customBorder: '',
        customHeaderFont: '',
        customBodyFont: '',
        textAlign: 'center',
        pageCount: 1,
        passcodeHash: '',
        paginationMode: 'auto'
      }
    };

    setProjects(prev => [...prev, newProj]);
    setActiveProjectId(newId);
    setNewProjectName('');
    setIsLocked(false);
    showToast(`Project "${newProj.name}" created!`);
  };

  const handleRenameProjectSave = (projId) => {
    if (editingProjectName && editingProjectName.trim()) {
      setProjects(prev => prev.map(proj => 
        proj.id === projId ? { ...proj, name: editingProjectName.trim() } : proj
      ));
      setEditingProjectId(null);
      showToast('Project renamed!');
    }
  };

  const handleDuplicateProject = (projId) => {
    const target = projects.find(p => p.id === projId);
    if (!target) return;

    const newId = `proj-${Date.now()}`;
    const dup = {
      ...target,
      id: newId,
      name: `${target.name} (Copy)`
    };

    setProjects(prev => [...prev, dup]);
    setActiveProjectId(newId);
    showToast(`Duplicated into "${dup.name}"`);
  };

  const handleDeleteProject = (projId, e) => {
    e.stopPropagation();
    if (projects.length <= 1) {
      alert("You must keep at least one active project!");
      return;
    }
    const target = projects.find(p => p.id === projId);
    if (window.confirm(`Are you sure you want to permanently delete "${target?.name}"?`)) {
      const remaining = projects.filter(p => p.id !== projId);
      setProjects(remaining);
      // fallback to first project remaining
      if (activeProjectId === projId) {
        setActiveProjectId(remaining[0].id);
        setIsLocked(!!remaining[0].settings.passcodeHash);
      }
      showToast('Project deleted');
    }
  };

  // --- CUSTOM PRESETS MANAGEMENT ---
  const saveCustomPreset = (e) => {
    e.preventDefault();
    if (!presetSaveName.trim()) return;

    const newPreset = {
      id: `custom-preset-${Date.now()}`,
      name: presetSaveName.trim(),
      description: `Saved style (${new Date().toLocaleDateString()})`,
      styles: {
        theme: settings.theme,
        pageSize: settings.pageSize,
        columns: settings.columns,
        pagePadding: settings.pagePadding,
        categoryGap: settings.categoryGap,
        itemGap: settings.itemGap,
        titleSize: settings.titleSize,
        subtitleSize: settings.subtitleSize,
        catSize: settings.catSize,
        itemSize: settings.itemSize,
        descSize: settings.descSize,
        showDots: settings.showDots,
        borderStyle: settings.borderStyle,
        borderWidth: settings.borderWidth,
        textAlign: settings.textAlign,
        customBg: settings.customBg,
        customText: settings.customText,
        customAccent: settings.customAccent,
        customBorder: settings.customBorder,
        customHeaderFont: settings.customHeaderFont || '',
        customBodyFont: settings.customBodyFont || '',
        pageCount: settings.pageCount,
        paginationMode: settings.paginationMode || 'auto'
      }
    };

    setCustomPresets(prev => [...prev, newPreset]);
    setPresetSaveName('');
    showToast(`Preset "${newPreset.name}" saved!`);
  };

  const applyCustomPreset = (preset) => {
    setSettings(prev => ({
      ...prev,
      ...preset.styles
    }));
    showToast(`Applied custom preset "${preset.name}"`);
  };

  const deleteCustomPreset = (presetId, e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this saved preset?')) {
      setCustomPresets(prev => prev.filter(p => p.id !== presetId));
      showToast('Preset deleted');
    }
  };

  // --- DATABASE EXPORT AND IMPORT ---
  const handleExportDatabase = () => {
    const backupObj = {
      version: "1.1",
      projects,
      customPresets
    };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backupObj, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    
    const timestamp = new Date().toISOString().slice(0, 10);
    const filename = `menu_designer_database_${timestamp}.json`;
    downloadAnchor.setAttribute("download", filename);
    
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Database exported successfully!');
  };

  const handleImportDatabase = (e) => {
    const fileReader = new FileReader();
    const file = e.target.files[0];
    if (!file) return;

    fileReader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (parsed.projects && Array.isArray(parsed.projects)) {
          if (window.confirm('Warning: This will overwrite all your current food and drinks menu projects in this browser. Continue?')) {
            setProjects(parsed.projects);
            setActiveProjectId(parsed.projects[0].id);
            setIsLocked(!!parsed.projects[0].settings.passcodeHash);
            if (parsed.customPresets) {
              setCustomPresets(parsed.customPresets);
            }
            showToast('All projects imported successfully!');
          }
        } else {
          alert('Invalid file structure. Must contain a projects array.');
        }
      } catch (err) {
        alert('Invalid JSON file format. Make sure you load a valid menu designer backup.');
      }
    };
    fileReader.readAsText(file, "UTF-8");
  };

  // --- SINGLE PROJECT EXPORT AND IMPORT ---
  const handleExportSingleProject = (projId) => {
    const project = projects.find(p => p.id === projId);
    if (!project) return;

    const exportObj = {
      type: "menu_designer_project",
      version: "1.1",
      project
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);

    const filename = `menu_project_${project.name.toLowerCase().replace(/\s+/g, '_')}_backup.json`;
    downloadAnchor.setAttribute("download", filename);

    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast(`Project "${project.name}" exported successfully!`);
  };

  const handleImportSingleProject = (e) => {
    const fileReader = new FileReader();
    const file = e.target.files[0];
    if (!file) return;

    fileReader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        let projectData = null;
        if (parsed.type === "menu_designer_project" && parsed.project) {
          projectData = parsed.project;
        } else if (parsed.id && parsed.name && parsed.menuData && parsed.settings) {
          projectData = parsed;
        }

        if (projectData) {
          const exists = projects.find(p => p.id === projectData.id || p.name.toLowerCase() === projectData.name.toLowerCase());
          if (exists) {
            const choice = window.confirm(`A menu project named "${projectData.name}" already exists.\n\nClick OK to OVERWRITE the existing project, or Cancel to import it as a NEW copy.`);
            if (choice) {
              setProjects(prev => prev.map(p => p.id === exists.id ? { ...projectData, id: exists.id } : p));
              setActiveProjectId(exists.id);
              setIsLocked(!!projectData.settings.passcodeHash);
              showToast(`Project "${projectData.name}" updated!`);
            } else {
              const newId = `proj-${Date.now()}`;
              const copyProj = {
                ...projectData,
                id: newId,
                 name: `${projectData.name} (Imported)`
              };
              setProjects(prev => [...prev, copyProj]);
              setActiveProjectId(newId);
              setIsLocked(!!copyProj.settings.passcodeHash);
              showToast(`Imported as "${copyProj.name}"!`);
            }
          } else {
            setProjects(prev => [...prev, projectData]);
            setActiveProjectId(projectData.id);
            setIsLocked(!!projectData.settings.passcodeHash);
            showToast(`Project "${projectData.name}" imported successfully!`);
          }
        } else {
          alert('Invalid project file format. Make sure it contains a single valid project.');
        }
      } catch (err) {
        alert('Invalid JSON file format. Make sure you load a valid menu project backup.');
      }
      e.target.value = '';
    };
    fileReader.readAsText(file, "UTF-8");
  };

  // --- MENU DATA MUTATIONS ---
  const addCategory = () => {
    const newId = `cat-${Date.now()}`;
    const newCat = {
      id: newId,
      name: 'New Category',
      description: 'Describe this section of your menu',
      pageIndex: 0,
      items: []
    };
    setMenuData(prev => ({
      ...prev,
      categories: [...prev.categories, newCat]
    }));
    setExpandedCategories(prev => ({ ...prev, [newId]: true }));
    showToast('Category added!');
  };

  const updateCategory = (catId, field, value) => {
    setMenuData(prev => ({
      ...prev,
      categories: prev.categories.map(cat => 
        cat.id === catId ? { ...cat, [field]: value } : cat
      )
    }));
  };

  const deleteCategory = (catId, e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this category and all its items?')) {
      setMenuData(prev => ({
        ...prev,
        categories: prev.categories.filter(cat => cat.id !== catId)
      }));
      showToast('Category deleted');
    }
  };

  const handleCanvasScroll = (e) => {
    if (isDraggingSidebar || draggedCatIdx !== null) return;
    if (scrollOwnerRef.current !== 'canvas') return;

    const container = e.currentTarget;
    const containerRect = container.getBoundingClientRect();
    const categories = container.querySelectorAll('.menu-category-section');
    
    let closestCatId = null;
    let minDistance = Infinity;

    categories.forEach(el => {
      const rect = el.getBoundingClientRect();
      const distance = Math.abs(rect.top - containerRect.top - 20); // 20px offset
      if (distance < minDistance) {
        minDistance = distance;
        closestCatId = el.getAttribute('data-catid');
      }
    });

    if (closestCatId && closestCatId !== activeScrollCatId) {
      setActiveScrollCatId(closestCatId);
      
      const sidebarCard = document.querySelector(`.editor-list [data-sidebar-catid="${closestCatId}"]`);
      if (sidebarCard) {
        sidebarCard.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest'
        });
      }
    }
  };

  const handleSidebarScroll = (e) => {
    if (activeTab !== 'data') return;
    if (isDraggingSidebar || draggedCatIdx !== null) return;
    if (scrollOwnerRef.current !== 'sidebar') return;

    const container = e.currentTarget;
    const containerRect = container.getBoundingClientRect();
    const cards = container.querySelectorAll('.category-card');
    
    let closestCatId = null;
    let minDistance = Infinity;

    cards.forEach(el => {
      const rect = el.getBoundingClientRect();
      const distance = Math.abs(rect.top - containerRect.top - 10);
      if (distance < minDistance) {
        minDistance = distance;
        closestCatId = el.getAttribute('data-sidebar-catid');
      }
    });

    if (closestCatId && closestCatId !== activeScrollCatId) {
      setActiveScrollCatId(closestCatId);
      scrollToCategoryInCanvas(closestCatId, 'center');
    }
  };

  const scrollToCategoryInCanvas = (catId, block = 'center') => {
    const canvas = document.querySelector('.preview-canvas');
    const el = document.querySelector(`.preview-canvas [data-catid="${catId}"]`);
    if (canvas && el) {
      if (block === 'center') {
        const rect = el.getBoundingClientRect();
        const canvasRect = canvas.getBoundingClientRect();
        const diff = (rect.top - canvasRect.top) - (canvasRect.height / 2 - rect.height / 2);
        canvas.scrollTo({
          top: canvas.scrollTop + diff,
          behavior: 'smooth'
        });
      } else {
        el.scrollIntoView({
          behavior: 'smooth',
          block: block
        });
      }
    }
  };

  const handleDragStart = (e, index) => {
    setDraggedCatIdx(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', index.toString());
    e.stopPropagation();
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedCatIdx === null || draggedCatIdx === index) return;

    const newCategories = [...menuData.categories];
    const draggedItem = newCategories[draggedCatIdx];
    newCategories.splice(draggedCatIdx, 1);
    newCategories.splice(index, 0, draggedItem);

    setDraggedCatIdx(index);
    setMenuData(prev => ({
      ...prev,
      categories: newCategories
    }));
  };

  const handleDragEnd = () => {
    setDraggedCatIdx(null);
    if (settings.paginationMode !== 'auto') {
      setTimeout(() => triggerAutoPagination(true), 100);
    }
  };

  const handleDrop = (e, index) => {
    e.preventDefault();
    setDraggedCatIdx(null);
    if (settings.paginationMode !== 'auto') {
      setTimeout(() => triggerAutoPagination(true), 100);
    }
  };

  const moveCategory = (index, direction, e) => {
    e.stopPropagation();
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === menuData.categories.length - 1) return;
    
    const newCategories = [...menuData.categories];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const temp = newCategories[index];
    newCategories[index] = newCategories[targetIndex];
    newCategories[targetIndex] = temp;

    setMenuData(prev => ({
      ...prev,
      categories: newCategories
    }));

    if (settings.paginationMode !== 'auto') {
      setTimeout(() => triggerAutoPagination(true), 100);
    }
  };

  const addItem = (catId) => {
    const newItem = {
      id: `item-${Date.now()}`,
      name: 'New Menu Item',
      description: 'Ingredients, allergens, or descriptions of flavor.',
      price: '10.00',
      badge: '',
      isAvailable: true
    };
    setMenuData(prev => ({
      ...prev,
      categories: prev.categories.map(cat => 
        cat.id === catId ? { ...cat, items: [...cat.items, newItem] } : cat
      )
    }));
    showToast('Menu item added!');
  };

  const updateItem = (catId, itemId, field, value) => {
    setMenuData(prev => ({
      ...prev,
      categories: prev.categories.map(cat => {
        if (cat.id !== catId) return cat;
        return {
          ...cat,
          items: cat.items.map(item => 
            item.id === itemId ? { ...item, [field]: value } : item
          )
        };
      })
    }));
  };

  const deleteItem = (catId, itemId) => {
    if (window.confirm('Delete this menu item?')) {
      setMenuData(prev => ({
        ...prev,
        categories: prev.categories.map(cat => {
          if (cat.id !== catId) return cat;
          return {
            ...cat,
            items: cat.items.filter(item => item.id !== itemId)
          };
        })
      }));
      showToast('Item deleted');
    }
  };

  const moveItem = (catId, index, direction) => {
    const category = menuData.categories.find(c => c.id === catId);
    if (!category) return;
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === category.items.length - 1) return;

    const newItems = [...category.items];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const temp = newItems[index];
    newItems[index] = newItems[targetIndex];
    newItems[targetIndex] = temp;

    setMenuData(prev => ({
      ...prev,
      categories: prev.categories.map(cat => 
        cat.id === catId ? { ...cat, items: newItems } : cat
      )
    }));
  };

  const toggleExpand = (catId) => {
    setExpandedCategories(prev => {
      const nextExpanded = { ...prev, [catId]: !prev[catId] };
      if (nextExpanded[catId]) {
        setTimeout(() => {
          scrollToCategoryInCanvas(catId, 'center');
        }, 100);
      }
      return nextExpanded;
    });
  };

  const applyTheme = (themeId) => {
    const preset = PRESET_THEMES.find(t => t.id === themeId);
    if (preset) {
      setSettings(prev => ({
        ...prev,
        theme: themeId,
        textAlign: preset.styles['--menu-align'] || 'left',
        customBg: '',
        customText: '',
        customAccent: '',
        customBorder: ''
      }));
      showToast(`Applied ${preset.name} preset!`);
    }
  };

  const getThemeStyles = () => {
    const themePreset = PRESET_THEMES.find(t => t.id === settings.theme) || PRESET_THEMES[0];
    const baseStyles = { ...themePreset.styles };

    baseStyles['--page-padding'] = `${settings.pagePadding}px`;
    baseStyles['--category-gap'] = `${settings.categoryGap}px`;
    baseStyles['--item-gap'] = `${settings.itemGap}px`;
    
    baseStyles['--title-size'] = `${settings.titleSize}rem`;
    baseStyles['--subtitle-size'] = `${settings.subtitleSize}rem`;
    baseStyles['--cat-size'] = `${settings.catSize}rem`;
    baseStyles['--item-size'] = `${settings.itemSize}rem`;
    baseStyles['--desc-size'] = `${settings.descSize}rem`;
    
    baseStyles['--border-style'] = settings.borderStyle;
    baseStyles['--border-width'] = `${settings.borderWidth}px`;
    baseStyles['--menu-align'] = settings.textAlign || baseStyles['--menu-align'] || 'left';

    if (settings.customBg) baseStyles['--menu-bg'] = settings.customBg;
    if (settings.customText) baseStyles['--menu-text'] = settings.customText;
    if (settings.customAccent) baseStyles['--menu-accent'] = settings.customAccent;
    if (settings.customBorder) baseStyles['--menu-border'] = settings.customBorder;
    if (settings.customHeaderFont) baseStyles['--menu-header-font'] = settings.customHeaderFont;
    if (settings.customBodyFont) baseStyles['--menu-body-font'] = settings.customBodyFont;

    return baseStyles;
  };

  const handlePrint = () => {
    window.print();
  };

  const handleAddPage = () => {
    setSettings(prev => ({
      ...prev,
      pageCount: (prev.pageCount || 1) + 1
    }));
    showToast('Page added!');
  };

  const handleDeletePage = (pageIdx, e) => {
    if (e) e.stopPropagation();
    if (settings.pageCount <= 1) return;
    if (!window.confirm(`Are you sure you want to delete Page ${pageIdx + 1}? Any categories on this page will be moved to the preceding page.`)) return;

    // Shift categories
    setMenuData(prev => {
      const updatedCategories = prev.categories.map(cat => {
        const currentIdx = cat.pageIndex !== undefined ? cat.pageIndex : 0;
        if (currentIdx === pageIdx) {
          return { ...cat, pageIndex: Math.max(0, pageIdx - 1) };
        } else if (currentIdx > pageIdx) {
          return { ...cat, pageIndex: currentIdx - 1 };
        }
        return cat;
      });
      return { ...prev, categories: updatedCategories };
    });

    // Decrement pageCount
    setSettings(prev => ({
      ...prev,
      pageCount: Math.max(1, (prev.pageCount || 1) - 1)
    }));
    showToast(`Page ${pageIdx + 1} deleted.`);
  };

  const handleMovePage = (pageIdx, direction, e) => {
    if (e) e.stopPropagation();
    const targetIdx = direction === 'up' ? pageIdx - 1 : pageIdx + 1;
    if (targetIdx < 0 || targetIdx >= settings.pageCount) return;

    setMenuData(prev => {
      const updatedCategories = prev.categories.map(cat => {
        const currentIdx = cat.pageIndex !== undefined ? cat.pageIndex : 0;
        if (currentIdx === pageIdx) {
          return { ...cat, pageIndex: targetIdx };
        } else if (currentIdx === targetIdx) {
          return { ...cat, pageIndex: pageIdx };
        }
        return cat;
      });
      return { ...prev, categories: updatedCategories };
    });
    showToast(`Swapped Page ${pageIdx + 1} and Page ${targetIdx + 1}.`);
  };

  const currentSizeObj = PAGE_SIZES.find(s => s.id === settings.pageSize) || PAGE_SIZES[0];
  const activeThemeObj = PRESET_THEMES.find(t => t.id === settings.theme) || PRESET_THEMES[0];

  // ==========================================
  // LOCK SCREEN GATE
  // ==========================================
  if (isLocked) {
    return (
      <div style={{
        height: '100vh',
        width: '100vw',
        background: 'radial-gradient(circle at center, #18181b 0%, #09090b 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Open Sans', sans-serif",
        color: '#f4f4f5'
      }}>
        <div style={{
          width: '100%',
          maxWidth: '400px',
          padding: '40px 30px',
          background: 'rgba(20, 20, 25, 0.65)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '16px',
          backdropFilter: 'blur(16px)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 30px rgba(249, 115, 22, 0.1)',
          textAlign: 'center'
        }} className="animate-fade-in">
          <div style={{
            display: 'inline-flex',
            padding: '16px',
            background: 'rgba(249, 115, 22, 0.1)',
            borderRadius: '50%',
            color: '#10b981',
            marginBottom: '20px',
            border: '1px solid rgba(16, 185, 129, 0.25)'
          }}>
            <Lock size={32} />
          </div>
          
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '8px', letterSpacing: '-0.025em' }}>
            Menu Designer Locked
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#a1a1aa', marginBottom: '24px', lineHeight: 1.4 }}>
            Please enter your passcode to gain access to the active menu <strong>{activeProject.name}</strong>.
          </p>

          <form onSubmit={handleUnlock}>
            <div style={{ marginBottom: '16px' }}>
              <input 
                type="password" 
                className="form-input" 
                placeholder="••••" 
                value={typedPasscode}
                onChange={(e) => setTypedPasscode(e.target.value)}
                autoFocus
                style={{
                  textAlign: 'center',
                  fontSize: '1.4rem',
                  letterSpacing: '0.3em',
                  padding: '12px',
                  borderRadius: '10px'
                }}
              />
            </div>

            {lockError && (
              <div style={{
                color: '#f87171',
                background: 'rgba(239, 68, 68, 0.1)',
                padding: '10px',
                borderRadius: '8px',
                fontSize: '0.75rem',
                marginBottom: '16px',
                border: '1px solid rgba(239, 68, 68, 0.15)'
              }}>
                {lockError}
              </div>
            )}

            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px', background: '#10b981' }}>
              Unlock Editor
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ==========================================
  // CORE DASHBOARD EDITOR RENDER
  // ==========================================
  return (
    <>
      <div className="app-container">
      {/* HEADER BAR */}
      <header className="app-header no-print">
        <div className="header-logo">
          <BookOpen className="logo-icon" size={24} style={{ color: '#10b981' }} />
          <h1>Menu Designer Pro</h1>
          <span style={{ color: '#10b981', background: 'rgba(16, 185, 129, 0.1)', borderColor: 'rgba(16, 185, 129, 0.2)' }}>
            Active: {activeProject.name}
          </span>
        </div>
        
        {successMessage && (
          <div className="toast-message animate-fade-in" style={{
            background: 'rgba(16, 185, 129, 0.9)',
            color: 'white',
            padding: '6px 16px',
            borderRadius: '6px',
            fontSize: '0.8rem',
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)'
          }}>
            <Check size={16} /> {successMessage}
          </div>
        )}

        <div className="header-actions">
          {/* Quick switcher next to print */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginRight: '10px' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Switch Menu:</span>
            <select 
              className="select-input" 
              style={{ width: '140px', padding: '6px 10px', fontSize: '0.8rem' }}
              value={activeProjectId}
              onChange={(e) => handleSwitchProject(e.target.value)}
            >
              {projects.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          {settings.passcodeHash && (
            <button type="button" className="btn btn-secondary btn-sm" onClick={() => setIsLocked(true)} title="Lock Editor screen">
              <Lock size={14} /> Lock
            </button>
          )}

          <button type="button" className="btn btn-primary btn-sm" onClick={handlePrint} style={{ background: '#10b981' }}>
            <Printer size={14} /> Export PDF / Print
          </button>
        </div>
      </header>

      {/* WORKSPACE CONTENT */}
      <main className="app-main">
        {/* SIDEBAR PANELS */}
        <aside 
          className="app-sidebar no-print"
          style={{
            width: `${sidebarWidth}px`,
            position: 'relative'
          }}
        >
          {/* Sidebar resizer handle */}
          <div 
            className={`sidebar-resizer ${isDraggingSidebar ? 'is-dragging' : ''}`}
            onMouseDown={startResizing}
          />
          <div className="sidebar-tabs">
            <button 
              type="button"
              className={`tab-btn ${activeTab === 'data' ? 'active' : ''}`}
              onClick={() => setActiveTab('data')}
            >
              <FileText size={16} /> Data Input
            </button>
            <button 
              type="button"
              className={`tab-btn ${activeTab === 'styling' ? 'active' : ''}`}
              onClick={() => setActiveTab('styling')}
            >
              <Sliders size={16} /> Styling
            </button>
            <button 
              type="button"
              className={`tab-btn ${activeTab === 'presets' ? 'active' : ''}`}
              onClick={() => setActiveTab('presets')}
            >
              <Palette size={16} /> Presets
            </button>
            <button 
              type="button"
              className={`tab-btn ${activeTab === 'export' ? 'active' : ''}`}
              onClick={() => setActiveTab('export')}
            >
              <FolderOpen size={16} /> Projects
            </button>
          </div>

          <div 
            className="sidebar-content"
            onScroll={handleSidebarScroll}
            onMouseEnter={() => { scrollOwnerRef.current = 'sidebar'; }}
            onWheel={() => { scrollOwnerRef.current = 'sidebar'; }}
            onTouchStart={() => { scrollOwnerRef.current = 'sidebar'; }}
          >
            {/* TABS 1: DATA INPUT */}
            {activeTab === 'data' && (
              <div className="panel-section animate-fade-in">
                {/* BRAND INFO */}
                <div style={{ marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
                  <div className="panel-title">
                    <Info size={16} /> Header Details
                  </div>
                  <div className="form-group">
                    <label className="form-label">Restaurant Title</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={menuData.restaurantName}
                      onChange={(e) => setMenuData(prev => ({ ...prev, restaurantName: e.target.value }))}
                      placeholder="e.g. Family Kitchen"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Subtitle / Slogan</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={menuData.subtitle}
                      onChange={(e) => setMenuData(prev => ({ ...prev, subtitle: e.target.value }))}
                      placeholder="e.g. Drinks Menu"
                    />
                  </div>
                </div>

                {/* CATEGORIES SECTION */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <div className="panel-title" style={{ margin: 0 }}>
                    <Layers size={16} /> Categories & Items
                  </div>
                  <button type="button" className="btn btn-primary btn-sm" onClick={addCategory} style={{ background: '#10b981' }}>
                    <Plus size={12} /> Add Category
                  </button>
                </div>

                {settings.paginationMode === 'manual' && (
                  <div style={{ marginBottom: '16px' }}>
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      style={{ 
                        width: '100%', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        gap: '6px', 
                        borderColor: 'rgba(16, 185, 129, 0.2)', 
                        background: 'rgba(16, 185, 129, 0.04)',
                        color: '#10b981',
                        fontSize: '0.75rem',
                        padding: '6px 12px',
                        fontWeight: 500
                      }}
                      onClick={() => {
                        triggerAutoPagination(true);
                        showToast('Page flow re-calculated & applied!');
                      }}
                      title="Reassign pages for all categories automatically based on physical height and order"
                    >
                      <ArrowUpDown size={12} /> Re-calculate Page Flow
                    </button>
                  </div>
                )}

                <div className="editor-list">
                  {menuData.categories.map((cat, catIdx) => {
                    const prevPageIdx = catIdx > 0 ? (menuData.categories[catIdx - 1].pageIndex !== undefined ? menuData.categories[catIdx - 1].pageIndex : 0) : 0;
                    const currPageIdx = cat.pageIndex !== undefined ? cat.pageIndex : 0;
                    const showSplit = catIdx > 0 && prevPageIdx !== currPageIdx;
                    const isDragging = draggedCatIdx === catIdx;

                    return (
                      <React.Fragment key={cat.id}>
                        {showSplit && (
                          <div 
                            className="page-split-divider" 
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              margin: '18px 0 10px 0',
                              position: 'relative'
                            }}
                          >
                            <div style={{
                              position: 'absolute',
                              left: 0,
                              right: 0,
                              top: '50%',
                              borderTop: '2px dashed var(--primary)',
                              opacity: 0.3,
                              zIndex: 1
                            }} />
                            <span style={{
                              position: 'relative',
                              background: '#1e1e24',
                              padding: '3px 10px',
                              fontSize: '0.65rem',
                              fontWeight: 700,
                              color: 'var(--primary, #10b981)',
                              borderRadius: '10px',
                              border: '1px solid var(--primary)',
                              zIndex: 2,
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                              boxShadow: '0 2px 6px rgba(0,0,0,0.3)'
                            }}>
                              Page {prevPageIdx + 1} / Page {currPageIdx + 1} Split
                            </span>
                          </div>
                        )}
                        <div 
                          className={`category-card ${isDragging ? 'is-dragging' : ''} ${activeScrollCatId === cat.id ? 'active-scrolled' : ''}`}
                          data-sidebar-catid={cat.id}
                        >
                          <div 
                            className="category-card-header" 
                            onClick={() => toggleExpand(cat.id)}
                            draggable={true}
                            onDragStart={(e) => handleDragStart(e, catIdx)}
                            onDragOver={(e) => handleDragOver(e, catIdx)}
                            onDragEnd={handleDragEnd}
                            onDrop={(e) => handleDrop(e, catIdx)}
                            style={{ cursor: 'grab' }}
                          >
                            <div className="category-title-info">
                              <div 
                                style={{ 
                                  display: 'inline-flex', 
                                  alignItems: 'center', 
                                  color: 'var(--text-secondary)', 
                                  marginRight: '6px',
                                  cursor: 'grab' 
                                }}
                                onClick={e => e.stopPropagation()}
                              >
                                <GripVertical size={14} />
                              </div>
                              <span style={{ color: 'var(--text-muted)' }}>#{catIdx + 1}</span>
                              <span className="category-title">{cat.name || 'Untitled Category'}</span>
                              <span className="category-count">{cat.items.length} items</span>
                              
                              {/* Page badge */}
                              {settings.pageCount > 1 && (
                                <span style={{ fontSize: '0.65rem', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', padding: '1px 5px', borderRadius: '4px', marginLeft: '6px' }}>
                                  Pg { (cat.pageIndex !== undefined ? cat.pageIndex : 0) + 1 }
                                </span>
                              )}

                              {/* Overflow badge in sidebar */}
                              {overflowState.categories[cat.id] && (
                                <span style={{ 
                                  fontSize: '0.65rem', 
                                  background: 'rgba(239, 68, 68, 0.15)', 
                                  color: '#f87171', 
                                  padding: '1px 6px', 
                                  borderRadius: '4px', 
                                  marginLeft: '6px',
                                  fontWeight: 600,
                                  border: '1px solid rgba(239, 68, 68, 0.2)'
                                }} className="animate-pulse">
                                  ⚠️ Cut off
                                </span>
                              )}
                            </div>
                        <div className="card-actions">
                          <button 
                            type="button"
                            className="icon-action-btn btn-move-up" 
                            disabled={catIdx === 0}
                            onClick={(e) => moveCategory(catIdx, 'up', e)}
                            title="Move Category Up"
                          >
                            <ChevronUp size={14} />
                          </button>
                          <button 
                            type="button"
                            className="icon-action-btn btn-move-down" 
                            disabled={catIdx === menuData.categories.length - 1}
                            onClick={(e) => moveCategory(catIdx, 'down', e)}
                            title="Move Category Down"
                          >
                            <ChevronDown size={14} />
                          </button>
                          <button 
                            type="button"
                            className="icon-action-btn btn-delete-item" 
                            onClick={(e) => deleteCategory(cat.id, e)}
                            title="Delete Category"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>

                      {expandedCategories[cat.id] && (
                        <div className="category-card-body">
                          <div className="form-group">
                            <label className="form-label">Category Name</label>
                            <input 
                              type="text" 
                              className="form-input" 
                              value={cat.name}
                              onChange={(e) => updateCategory(cat.id, 'name', e.target.value)}
                            />
                          </div>
                          
                          <div className="form-group" style={{ marginBottom: '10px' }}>
                            <label className="form-label">Category Description (Optional)</label>
                            <input 
                              type="text" 
                              className="form-input" 
                              value={cat.description}
                              onChange={(e) => updateCategory(cat.id, 'description', e.target.value)}
                            />
                          </div>

                          {/* Multi-page page assignment */}
                          {settings.pageCount > 1 && (
                            <div className="form-group" style={{ marginBottom: '16px' }}>
                              <label className="form-label">Assign Category to Page</label>
                              {settings.paginationMode === 'auto' ? (
                                <div style={{ fontSize: '0.80rem', color: '#10b981', background: 'rgba(16, 185, 129, 0.05)', padding: '6px 10px', borderRadius: '6px', border: '1px solid rgba(16, 185, 129, 0.15)', fontWeight: 500 }}>
                                  Page { (cat.pageIndex !== undefined ? cat.pageIndex : 0) + 1 } (Managed Automatically)
                                </div>
                              ) : (
                                <select 
                                  className="select-input" 
                                  value={cat.pageIndex !== undefined ? cat.pageIndex : 0}
                                  onChange={(e) => updateCategory(cat.id, 'pageIndex', parseInt(e.target.value))}
                                  style={{ padding: '6px 10px', fontSize: '0.8rem' }}
                                >
                                  {Array.from({ length: settings.pageCount }).map((_, idx) => (
                                    <option key={idx} value={idx}>Page {idx + 1}</option>
                                  ))}
                                </select>
                              )}
                            </div>
                          )}

                          {/* Category Text Alignment Override */}
                          <div className="form-group" style={{ marginBottom: '16px' }}>
                            <label className="form-label">Category Text Alignment</label>
                            <select 
                              className="select-input" 
                              value={cat.textAlign || 'default'}
                              onChange={(e) => updateCategory(cat.id, 'textAlign', e.target.value)}
                              style={{ padding: '6px 10px', fontSize: '0.8rem' }}
                            >
                              <option value="default">Use Document Default ({settings.textAlign === 'center' ? 'Centered' : 'Left & Right'})</option>
                              <option value="left">Left & Right Align (Drinks Style)</option>
                              <option value="center">Centered Stacked (Food Style)</option>
                            </select>
                          </div>

                          {/* Category Item Layout Selector */}
                          <div className="form-group" style={{ marginBottom: '16px' }}>
                            <label className="form-label">Category Item Layout</label>
                            <select 
                              className="select-input" 
                              value={cat.itemLayout || 'list'}
                              onChange={(e) => updateCategory(cat.id, 'itemLayout', e.target.value)}
                              style={{ padding: '6px 10px', fontSize: '0.8rem' }}
                            >
                              <option value="list">Single Column (List)</option>
                              <option value="grid-2">2 Columns Grid</option>
                              <option value="grid-3">3 Columns Grid</option>
                              <option value="grid-4">4 Columns Grid</option>
                              <option value="triangle-3">Triangle of 3 (2 on top, 1 bottom-centered)</option>
                            </select>
                          </div>

                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', marginBottom: '8px' }}>
                            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Menu Items</span>
                            <button type="button" className="btn btn-secondary btn-sm" style={{ padding: '4px 8px', fontSize: '0.7rem', marginLeft: 'auto' }} onClick={() => addItem(cat.id)}>
                              <Plus size={10} /> Add Item
                            </button>
                          </div>

                          <div className="items-list">
                            {cat.items.map((item, itemIdx) => (
                              <div key={item.id} className="item-editor-card">
                                <div className="item-editor-row">
                                  <input 
                                    type="text" 
                                    className="form-input" 
                                    style={{ flex: 1, fontWeight: 'bold' }} 
                                    value={item.name} 
                                    placeholder="Dish name"
                                    onChange={(e) => updateItem(cat.id, item.id, 'name', e.target.value)}
                                  />
                                </div>
                                <div className="item-editor-row">
                                  <textarea 
                                    className="form-input" 
                                    value={item.description} 
                                    placeholder="Description / Ingredients / Translation"
                                    onChange={(e) => updateItem(cat.id, item.id, 'description', e.target.value)}
                                  />
                                </div>
                                <div className="item-editor-row" style={{ alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                                  <input 
                                    type="text" 
                                    className="form-input" 
                                    style={{ flex: 2, padding: '6px 8px', fontSize: '0.75rem' }}
                                    value={item.badge} 
                                    placeholder="Badge"
                                    onChange={(e) => updateItem(cat.id, item.id, 'badge', e.target.value)}
                                  />
                                  <input 
                                    type="text" 
                                    className="form-input" 
                                    style={{ flex: 1, padding: '6px 8px', fontSize: '0.75rem', textAlign: 'right', fontFamily: 'monospace' }} 
                                    value={item.price} 
                                    placeholder="Price"
                                    onChange={(e) => updateItem(cat.id, item.id, 'price', e.target.value)}
                                  />
                                  
                                  <div style={{ display: 'flex', gap: '2px', marginLeft: '4px' }}>
                                    <button 
                                      type="button"
                                      className="icon-action-btn" 
                                      disabled={itemIdx === 0}
                                      onClick={() => moveItem(cat.id, itemIdx, 'up')}
                                      title="Move Item Up"
                                    >
                                      <ChevronUp size={12} />
                                    </button>
                                    <button 
                                      type="button"
                                      className="icon-action-btn" 
                                      disabled={itemIdx === cat.items.length - 1}
                                      onClick={() => moveItem(cat.id, itemIdx, 'down')}
                                      title="Move Item Down"
                                    >
                                      <ChevronDown size={12} />
                                    </button>
                                    <button 
                                      type="button"
                                      className="icon-action-btn btn-delete-item" 
                                      onClick={() => deleteItem(cat.id, item.id)}
                                      title="Delete Item"
                                    >
                                      <Trash2 size={12} />
                                    </button>
                                  </div>
                                </div>

                                {/* Enable Image Option */}
                                <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '8px', borderTop: '1px solid var(--border-color)', paddingTop: '10px' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <label className="form-label" style={{ margin: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.72rem', userSelect: 'none' }}>
                                      <input 
                                        type="checkbox" 
                                        checked={!!item.showImage} 
                                        onChange={(e) => updateItem(cat.id, item.id, 'showImage', e.target.checked)}
                                        style={{ accentColor: '#10b981' }}
                                      />
                                      Enable Item Image
                                    </label>
                                  </div>

                                  {item.showImage && (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '8px', border: '1px dashed var(--border-color)', borderRadius: '6px', background: 'rgba(255,255,255,0.01)' }}>
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        {item.image ? (
                                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', justifyContent: 'space-between' }}>
                                            <img src={item.image} alt="Preview" style={{ width: '36px', height: '36px', borderRadius: '4px', objectFit: 'cover' }} />
                                            <button 
                                              type="button" 
                                              className="btn btn-secondary btn-sm"
                                              style={{ borderColor: '#ef4444', color: '#ef4444', padding: '2px 6px', fontSize: '0.65rem', minHeight: 0, height: 'auto' }}
                                              onClick={() => updateItem(cat.id, item.id, 'image', '')}
                                            >
                                              Remove Image
                                            </button>
                                          </div>
                                        ) : (
                                          <input 
                                            type="file" 
                                            accept="image/*"
                                            onChange={(e) => {
                                              const file = e.target.files[0];
                                              if (file) {
                                                const reader = new FileReader();
                                                reader.onload = (event) => {
                                                  updateItem(cat.id, item.id, 'image', event.target.result);
                                                  updateItem(cat.id, item.id, 'imageScale', 100);
                                                };
                                                reader.readAsDataURL(file);
                                              }
                                            }}
                                            style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', width: '100%' }}
                                          />
                                        )}
                                      </div>

                                      {item.image && (
                                        <div className="slider-group" style={{ margin: 0 }}>
                                          <div className="form-label" style={{ fontSize: '0.68rem', display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                                            <span>Image Scale</span>
                                            <span>{item.imageScale || 100}%</span>
                                          </div>
                                          <input 
                                            type="range" 
                                            min="20" 
                                            max="200" 
                                            step="5"
                                            value={item.imageScale || 100}
                                            onChange={(e) => updateItem(cat.id, item.id, 'imageScale', parseInt(e.target.value))}
                                            style={{ width: '100%', height: '4px', accentColor: '#10b981', background: 'rgba(255,255,255,0.1)' }}
                                          />
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </React.Fragment>
                );
              })}
            </div>

                {/* FOOTER INFO */}
                <div style={{ marginTop: '24px', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                  <div className="panel-title">
                    <Info size={16} /> Footer Information
                  </div>
                  <div className="form-group">
                    <label className="form-label">Footer Note</label>
                    <textarea 
                      className="form-input" 
                      value={menuData.footer}
                      onChange={(e) => setMenuData(prev => ({ ...prev, footer: e.target.value }))}
                      placeholder="e.g. Prices are in CZK..."
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TABS 2: STYLING & CUSTOMIZER */}
            {activeTab === 'styling' && (
              <div className="panel-section animate-fade-in">
                <div className="panel-title">
                  <Sliders size={16} /> Dimensions & Alignment
                </div>

                <div className="style-settings-grid">
                  {/* Page Size Toggle */}
                  <div className="form-group">
                    <label className="form-label">Page Dimensions</label>
                    <select 
                      className="select-input" 
                      value={settings.pageSize}
                      onChange={(e) => setSettings(prev => ({ ...prev, pageSize: e.target.value }))}
                    >
                      {PAGE_SIZES.map(size => (
                        <option key={size.id} value={size.id}>{size.name} ({size.width} x {size.height})</option>
                      ))}
                    </select>
                  </div>

                  {/* Text Alignment Selection */}
                  <div className="form-group">
                    <label className="form-label">Text Alignment Style</label>
                    <select 
                      className="select-input" 
                      value={settings.textAlign || 'left'}
                      onChange={(e) => setSettings(prev => ({ ...prev, 
                        textAlign: e.target.value
                      }))}
                    >
                      <option value="left">Left & Right Align (Drinks Style)</option>
                      <option value="center">Centered Stacked (Food Style)</option>
                    </select>
                  </div>

                  {/* Page Pagination Mode */}
                  <div className="form-group" style={{ marginBottom: settings.paginationMode === 'manual' ? '8px' : '20px' }}>
                    <label className="form-label">Page Pagination Mode</label>
                    <select 
                      className="select-input" 
                      value={settings.paginationMode || 'auto'}
                      onChange={(e) => setSettings(prev => ({ ...prev, paginationMode: e.target.value }))}
                    >
                      <option value="auto">Automatic (Flow categories as space runs out)</option>
                      <option value="manual">Manual (Assign page to each category manually)</option>
                    </select>
                  </div>

                  {settings.paginationMode === 'manual' && (
                    <div style={{ marginBottom: '20px' }}>
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        style={{ 
                          width: '100%', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center', 
                          gap: '6px', 
                          background: 'rgba(16, 185, 129, 0.05)', 
                          color: '#10b981', 
                          borderColor: 'rgba(16, 185, 129, 0.2)',
                          fontSize: '0.75rem',
                          padding: '6px 12px',
                          fontWeight: 500
                        }}
                        onClick={() => {
                          triggerAutoPagination(true);
                          showToast('Page flow re-calculated & applied!');
                        }}
                        title="Reassign pages for all categories automatically based on physical height and order"
                      >
                        <ArrowUpDown size={12} /> Re-calculate Page Flow
                      </button>
                    </div>
                  )}

                  {/* Document Page Count Control */}
                  {settings.paginationMode !== 'auto' && (
                    <div className="slider-group">
                      <div className="form-label">
                        <span>Total Document Pages</span>
                        <span className="value">{settings.pageCount || 1} Pages</span>
                      </div>
                      <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
                        <button 
                          type="button"
                          className="btn btn-secondary btn-sm" 
                          style={{ flex: 1 }}
                          disabled={settings.pageCount <= 1}
                          onClick={() => setSettings(prev => ({ ...prev, pageCount: Math.max(1, (prev.pageCount || 1) - 1) }))}
                        >
                          - Remove Page
                        </button>
                        <button 
                          type="button"
                          className="btn btn-secondary btn-sm" 
                          style={{ flex: 1 }}
                          onClick={() => setSettings(prev => ({ ...prev, pageCount: (prev.pageCount || 1) + 1 }))}
                        >
                          + Add Page
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Columns Grid Layout */}
                  <div className="form-group">
                    <label className="form-label">Category Grid Columns</label>
                    <select 
                      className="select-input" 
                      value={settings.columns}
                      onChange={(e) => setSettings(prev => ({ ...prev, columns: parseInt(e.target.value) }))}
                    >
                      <option value={1}>1 Column Layout (Classic)</option>
                      <option value={2}>2 Column Layout (Double Column)</option>
                      <option value={3}>3 Column Layout (Drinks / Grid)</option>
                    </select>
                  </div>

                  {/* Leader dots Toggle */}
                  {settings.textAlign !== 'center' && (
                    <div className="toggle-group">
                      <span style={{ fontSize: '0.8rem', fontWeight: 500 }}>Price-to-Name Leader Dots</span>
                      <label className="toggle-switch">
                        <input 
                          type="checkbox" 
                          checked={settings.showDots}
                          onChange={(e) => setSettings(prev => ({ ...prev, showDots: e.target.checked }))}
                        />
                        <span className="slider-toggle"></span>
                      </label>
                    </div>
                  )}

                  {/* Border Style Selection */}
                  <div className="form-group">
                    <label className="form-label">Page Border Style</label>
                    <select 
                      className="select-input" 
                      value={settings.borderStyle}
                      onChange={(e) => setSettings(prev => ({ ...prev, borderStyle: e.target.value }))}
                    >
                      <option value="none">No Border</option>
                      <option value="solid">Single Line (Solid)</option>
                      <option value="double">Double Line (Classic)</option>
                      <option value="dashed">Dashed Line</option>
                      <option value="dotted">Dotted Line</option>
                    </select>
                  </div>

                  {settings.borderStyle !== 'none' && (
                    <div className="slider-group">
                      <div className="form-label">
                        <span>Border Thickness</span>
                        <span className="value">{settings.borderWidth}px</span>
                      </div>
                      <input 
                        type="range" 
                        className="range-slider" 
                        min="1" 
                        max="8" 
                        value={settings.borderWidth}
                        onChange={(e) => setSettings(prev => ({ ...prev, borderWidth: parseInt(e.target.value) }))}
                      />
                    </div>
                  )}

                  {/* SPACING CONTROLS */}
                  <div className="panel-title" style={{ marginTop: '12px' }}>
                    <ArrowUpDown size={16} /> Spacing & Margins
                  </div>

                  <div className="slider-group">
                    <div className="form-label">
                      <span>Outer Page Padding</span>
                      <span className="value">{settings.pagePadding}px</span>
                    </div>
                    <input 
                      type="range" 
                      className="range-slider" 
                      min="15" 
                      max="80" 
                      value={settings.pagePadding}
                      onChange={(e) => setSettings(prev => ({ ...prev, pagePadding: parseInt(e.target.value) }))}
                    />
                  </div>

                  <div className="slider-group">
                    <div className="form-label">
                      <span>Spacing Between Categories</span>
                      <span className="value">{settings.categoryGap}px</span>
                    </div>
                    <input 
                      type="range" 
                      className="range-slider" 
                      min="10" 
                      max="70" 
                      value={settings.categoryGap}
                      onChange={(e) => setSettings(prev => ({ ...prev, categoryGap: parseInt(e.target.value) }))}
                    />
                  </div>

                  <div className="slider-group">
                    <div className="form-label">
                      <span>Spacing Between Items</span>
                      <span className="value">{settings.itemGap}px</span>
                    </div>
                    <input 
                      type="range" 
                      className="range-slider" 
                      min="6" 
                      max="40" 
                      value={settings.itemGap}
                      onChange={(e) => setSettings(prev => ({ ...prev, itemGap: parseInt(e.target.value) }))}
                    />
                  </div>

                  {/* FONT SIZING */}
                  <div className="panel-title" style={{ marginTop: '12px' }}>
                    <BookOpen size={16} /> Typography Sizes
                  </div>

                  <div className="slider-group">
                    <div className="form-label">
                      <span>Header Title Size</span>
                      <span className="value">{settings.titleSize}rem</span>
                    </div>
                    <input 
                      type="range" 
                      className="range-slider" 
                      min="1.5" 
                      max="4.0" 
                      step="0.05"
                      value={settings.titleSize}
                      onChange={(e) => setSettings(prev => ({ ...prev, titleSize: parseFloat(e.target.value) }))}
                    />
                  </div>

                  <div className="slider-group">
                    <div className="form-label">
                      <span>Category Name Size</span>
                      <span className="value">{settings.catSize}rem</span>
                    </div>
                    <input 
                      type="range" 
                      className="range-slider" 
                      min="0.9" 
                      max="2.5" 
                      step="0.05"
                      value={settings.catSize}
                      onChange={(e) => setSettings(prev => ({ ...prev, catSize: parseFloat(e.target.value) }))}
                    />
                  </div>

                  <div className="slider-group">
                    <div className="form-label">
                      <span>Item Name Size</span>
                      <span className="value">{settings.itemSize}rem</span>
                    </div>
                    <input 
                      type="range" 
                      className="range-slider" 
                      min="0.75" 
                      max="1.8" 
                      step="0.05"
                      value={settings.itemSize}
                      onChange={(e) => setSettings(prev => ({ ...prev, itemSize: parseFloat(e.target.value) }))}
                    />
                  </div>

                  {/* FONT FAMILY OVERRIDES */}
                  <div className="panel-title" style={{ marginTop: '12px' }}>
                    <BookOpen size={16} /> Font Families
                  </div>

                  <div className="form-group">
                    <label className="form-label">Header & Title Font</label>
                    <select 
                      className="select-input" 
                      value={settings.customHeaderFont || ''}
                      onChange={(e) => setSettings(prev => ({ ...prev, customHeaderFont: e.target.value }))}
                    >
                      <option value="">Default (From Theme Preset)</option>
                      <option value="'Open Sans', sans-serif">Open Sans (Modern Clean)</option>
                      <option value="'Outfit', sans-serif">Outfit (Premium Minimalist)</option>
                      <option value="'Inter', sans-serif">Inter (Sleek Clean Sans)</option>
                      <option value="'Montserrat', sans-serif">Montserrat (Geometric Bold)</option>
                      <option value="'Playfair Display', serif">Playfair Display (Elegant Serif)</option>
                      <option value="'Cormorant Garamond', serif">Cormorant Garamond (Sophisticated Serif)</option>
                      <option value="'Lora', serif">Lora (Readable Contemporary Serif)</option>
                      <option value="'Cinzel', serif">Cinzel (Classical Accent)</option>
                      <option value="'Alex Brush', cursive">Alex Brush (Cursive Script)</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Body Text & Items Font</label>
                    <select 
                      className="select-input" 
                      value={settings.customBodyFont || ''}
                      onChange={(e) => setSettings(prev => ({ ...prev, customBodyFont: e.target.value }))}
                    >
                      <option value="">Default (From Theme Preset)</option>
                      <option value="'Open Sans', sans-serif">Open Sans (Modern Clean)</option>
                      <option value="'Outfit', sans-serif">Outfit (Premium Minimalist)</option>
                      <option value="'Inter', sans-serif">Inter (Sleek Clean Sans)</option>
                      <option value="'Montserrat', sans-serif">Montserrat (Geometric Sans)</option>
                      <option value="'Playfair Display', serif">Playfair Display (Elegant Serif)</option>
                      <option value="'Cormorant Garamond', serif">Cormorant Garamond (Sophisticated Serif)</option>
                      <option value="'Lora', serif">Lora (Readable Contemporary Serif)</option>
                      <option value="'Cinzel', serif">Cinzel (Classical Accent)</option>
                      <option value="'Alex Brush', cursive">Alex Brush (Cursive Script)</option>
                    </select>
                  </div>

                  {/* COLOR CUSTOMIZATION */}
                  <div className="panel-title" style={{ marginTop: '12px' }}>
                    <Palette size={16} /> Color Overrides
                  </div>

                  <div className="style-row">
                    <div>
                      <label className="form-label">Menu Text</label>
                      <div className="color-picker-wrapper">
                        <input 
                          type="color" 
                          className="color-picker-input" 
                          value={settings.customText || getThemeStyles()['--menu-text']} 
                          onChange={(e) => setSettings(prev => ({ ...prev, customText: e.target.value }))}
                        />
                        <span className="color-code">{settings.customText || getThemeStyles()['--menu-text']}</span>
                      </div>
                    </div>
                    <div>
                      <label className="form-label">Background</label>
                      <div className="color-picker-wrapper">
                        <input 
                          type="color" 
                          className="color-picker-input" 
                          value={settings.customBg || getThemeStyles()['--menu-bg']} 
                          onChange={(e) => setSettings(prev => ({ ...prev, customBg: e.target.value }))}
                        />
                        <span className="color-code">{settings.customBg || getThemeStyles()['--menu-bg']}</span>
                      </div>
                    </div>
                  </div>

                  <div className="style-row" style={{ marginTop: '8px' }}>
                    <div>
                      <label className="form-label">Gold/Accent</label>
                      <div className="color-picker-wrapper">
                        <input 
                          type="color" 
                          className="color-picker-input" 
                          value={settings.customAccent || getThemeStyles()['--menu-accent']} 
                          onChange={(e) => setSettings(prev => ({ ...prev, customAccent: e.target.value }))}
                        />
                        <span className="color-code">{settings.customAccent || getThemeStyles()['--menu-accent']}</span>
                      </div>
                    </div>
                    <div>
                      <label className="form-label">Border Line</label>
                      <div className="color-picker-wrapper">
                        <input 
                          type="color" 
                          className="color-picker-input" 
                          value={settings.customBorder || getThemeStyles()['--menu-border']} 
                          onChange={(e) => setSettings(prev => ({ ...prev, customBorder: e.target.value }))}
                        />
                        <span className="color-code">{settings.customBorder || getThemeStyles()['--menu-border']}</span>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                    {(settings.customBg || settings.customText || settings.customAccent || settings.customBorder || settings.customHeaderFont || settings.customBodyFont) && (
                      <button 
                        type="button"
                        className="btn btn-secondary btn-sm" 
                        style={{ width: '100%' }}
                        onClick={() => setSettings(prev => ({ 
                          ...prev, 
                          customBg: '', 
                          customText: '', 
                          customAccent: '',
                          customBorder: '',
                          customHeaderFont: '',
                          customBodyFont: ''
                        }))}
                      >
                        Reset Custom Style Overrides
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* TABS 3: PRESETS */}
            {activeTab === 'presets' && (
              <div className="panel-section animate-fade-in">
                <div className="panel-title">
                  <Palette size={16} /> Theme Presets
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: 1.4 }}>
                  Choose a style layout preset designed to give your menu an immediate premium aesthetic. You can still adjust details afterwards.
                </p>

                <div className="preset-grid">
                  {PRESET_THEMES.map(theme => (
                    <button 
                      key={theme.id}
                      className={`preset-card ${settings.theme === theme.id ? 'active' : ''}`}
                      onClick={() => applyTheme(theme.id)}
                    >
                      <div className="preset-header">
                        <span className="preset-name">{theme.name}</span>
                        {settings.theme === theme.id && <span style={{ color: 'var(--primary)', fontSize: '0.75rem', fontWeight: 600 }}>Active</span>}
                      </div>
                      <div className="preset-desc">{theme.description}</div>
                      <div className="preset-pills">
                        <span className="preset-pill" style={{ fontFamily: theme.styles['--menu-header-font'] }}>Headers</span>
                        <span className="preset-pill" style={{ fontFamily: theme.styles['--menu-body-font'] }}>Body Font</span>
                      </div>
                    </button>
                  ))}
                </div>

                {/* SAVE CURRENT STYLE AS PRESET */}
                <div style={{ marginTop: '24px', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                  <div className="panel-title">
                    <Plus size={16} /> Save Current Styles
                  </div>
                  <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginBottom: '10px', lineHeight: 1.4 }}>
                    Save all current layout parameters (colors, font sizes, margins, alignment) to a custom preset.
                  </p>
                  <form onSubmit={saveCustomPreset} style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="Name your custom preset..." 
                      value={presetSaveName}
                      onChange={(e) => setPresetSaveName(e.target.value)}
                      style={{ flex: 1 }}
                    />
                    <button type="submit" className="btn btn-secondary btn-sm" style={{ padding: '0 16px' }}>
                      Save Preset
                    </button>
                  </form>
                </div>

                {/* LIST SAVED CUSTOM PRESETS */}
                {customPresets.length > 0 && (
                  <div style={{ marginTop: '20px', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                    <div className="panel-title">
                      <Sliders size={16} /> Your Custom Presets
                    </div>
                    <div className="preset-grid">
                      {customPresets.map(preset => (
                        <div 
                          key={preset.id}
                          className="preset-card"
                          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
                          onClick={() => applyCustomPreset(preset)}
                        >
                          <div>
                            <span className="preset-name">{preset.name}</span>
                            <div className="preset-desc" style={{ fontSize: '0.7rem' }}>{preset.description}</div>
                          </div>
                          <button 
                            type="button"
                            className="icon-action-btn btn-delete-item"
                            onClick={(e) => deleteCustomPreset(preset.id, e)}
                            title="Delete Saved Preset"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TABS 4: PROJECTS MANAGER */}
            {activeTab === 'export' && (
              <div className="panel-section animate-fade-in">
                {/* PROJECT LIST */}
                <div className="panel-title">
                  <FolderOpen size={16} style={{ color: '#10b981' }} /> Active Menu Projects
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '12px', lineHeight: 1.4 }}>
                  Switch between different menu templates, duplicate copies for price testing, or delete old versions.
                </p>

                <div className="preset-grid" style={{ marginBottom: '24px' }}>
                  {projects.map(proj => {
                    const isEditing = editingProjectId === proj.id;
                    return (
                      <div 
                        key={proj.id}
                        className={`preset-card ${proj.id === activeProjectId ? 'active' : ''}`}
                        onClick={() => {
                          if (!isEditing) handleSwitchProject(proj.id);
                        }}
                        style={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'center', 
                          cursor: isEditing ? 'default' : 'pointer',
                          borderColor: proj.id === activeProjectId ? '#10b981' : 'var(--border-color)',
                          background: proj.id === activeProjectId ? 'rgba(16, 185, 129, 0.03)' : 'rgba(255,255,255,0.01)',
                          padding: '12px'
                        }}
                      >
                        {isEditing ? (
                          <div 
                            style={{ display: 'flex', gap: '8px', alignItems: 'center', width: '100%' }} 
                            onClick={e => e.stopPropagation()}
                          >
                            <input
                              type="text"
                              className="form-input"
                              value={editingProjectName}
                              onChange={e => setEditingProjectName(e.target.value)}
                              onKeyDown={e => {
                                if (e.key === 'Enter') {
                                  handleRenameProjectSave(proj.id);
                                } else if (e.key === 'Escape') {
                                  setEditingProjectId(null);
                                }
                              }}
                              autoFocus
                              style={{
                                fontSize: '0.8rem',
                                padding: '4px 8px',
                                height: '28px',
                                margin: 0,
                                flex: 1,
                                background: 'var(--bg-input, rgba(0,0,0,0.2))',
                                color: 'var(--text-primary)',
                                border: '1px solid #10b981',
                                borderRadius: '4px'
                              }}
                            />
                            <button
                              type="button"
                              className="icon-action-btn"
                              onClick={() => handleRenameProjectSave(proj.id)}
                              title="Save Name"
                              style={{ color: '#10b981', padding: '4px' }}
                            >
                              <Check size={14} />
                            </button>
                            <button
                              type="button"
                              className="icon-action-btn"
                              onClick={() => setEditingProjectId(null)}
                              title="Cancel"
                              style={{ color: '#ef4444', padding: '4px' }}
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ) : (
                          <>
                            <div>
                              <span className="preset-name" style={{ color: proj.id === activeProjectId ? '#10b981' : 'var(--text-primary)' }}>
                                {proj.name}
                              </span>
                              <div className="preset-desc" style={{ fontSize: '0.7rem' }}>
                                {proj.menuData.categories.length} sections • {proj.settings.pageSize} format • {proj.settings.pageCount || 1} pgs
                              </div>
                            </div>
                            
                            <div className="card-actions" onClick={e => e.stopPropagation()}>
                              <button 
                                type="button" 
                                className="icon-action-btn"
                                onClick={() => {
                                  setEditingProjectId(proj.id);
                                  setEditingProjectName(proj.name);
                                }}
                                title="Rename Project"
                              >
                                <Pencil size={12} />
                              </button>
                              <button 
                                type="button" 
                                className="icon-action-btn"
                                onClick={() => handleExportSingleProject(proj.id)}
                                title="Export Project File"
                                style={{ color: '#10b981' }}
                              >
                                <Download size={12} />
                              </button>
                              <button 
                                type="button" 
                                className="icon-action-btn"
                                onClick={() => handleDuplicateProject(proj.id)}
                                title="Duplicate Project"
                              >
                                <Copy size={12} />
                              </button>
                              {projects.length > 1 && (
                                <button 
                                  type="button" 
                                  className="icon-action-btn btn-delete-item"
                                  onClick={(e) => handleDeleteProject(proj.id, e)}
                                  title="Delete Project"
                                >
                                  <Trash2 size={12} />
                                </button>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* CREATE NEW MENU PROJECT */}
                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px', marginBottom: '24px' }}>
                  <div className="panel-title" style={{ fontSize: '0.8rem' }}>
                    <Plus size={14} /> Create New Menu Project
                  </div>
                  <form onSubmit={handleCreateProject} style={{ display: 'flex', gap: '8px' }}>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="e.g. Lunch Specials..." 
                      value={newProjectName}
                      onChange={(e) => setNewProjectName(e.target.value)}
                      style={{ flex: 1 }}
                    />
                    <button type="submit" className="btn btn-secondary btn-sm">Create</button>
                  </form>
                </div>



                {/* SINGLE MENU PROJECT FILE MANAGER */}
                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px', marginBottom: '24px' }}>
                  <div className="panel-title">
                    <Download size={14} style={{ color: '#10b981' }} /> Single Menu File Manager
                  </div>
                  <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginBottom: '12px', lineHeight: 1.4 }}>
                    Export or import a single menu (e.g. only "Drinks Menu" or "Food Menu") as an individual file to share or back up.
                  </p>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <button type="button" className="btn btn-secondary btn-sm" style={{ width: '100%', justifyContent: 'flex-start' }} onClick={() => handleExportSingleProject(activeProjectId)}>
                      <Download size={14} style={{ color: '#10b981' }} /> Export Active Menu ({activeProject.name})
                    </button>

                    <div style={{ border: '1px dashed var(--border-color)', borderRadius: '8px', padding: '12px', textAlign: 'center', background: 'rgba(255,255,255,0.01)' }}>
                      <span style={{ fontSize: '0.7rem', fontWeight: 500, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                        Import Menu File (.json)
                      </span>
                      <input 
                        type="file" 
                        id="single-project-import-file" 
                        accept=".json" 
                        onChange={handleImportSingleProject} 
                        style={{ display: 'none' }}
                      />
                      <label htmlFor="single-project-import-file" className="btn btn-secondary btn-sm" style={{ cursor: 'pointer', display: 'inline-flex', borderColor: '#10b981', color: '#10b981' }}>
                        Select menu file
                      </label>
                    </div>
                  </div>
                </div>

                {/* FILE DATABASE BACKUPS */}
                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px', marginBottom: '24px' }}>
                  <div className="panel-title">
                    <Download size={14} /> Full Database Backup Manager
                  </div>
                  <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginBottom: '12px', lineHeight: 1.4 }}>
                    Export/Import your entire database (all food, drinks, custom presets) in a single file to migrate computers.
                  </p>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <button type="button" className="btn btn-secondary btn-sm" style={{ width: '100%', justifyContent: 'flex-start' }} onClick={handleExportDatabase}>
                      <Download size={14} /> Export Entire Database (.json)
                    </button>

                    <div style={{ border: '1px dashed var(--border-color)', borderRadius: '8px', padding: '12px', textAlign: 'center', background: 'rgba(255,255,255,0.01)' }}>
                      <span style={{ fontSize: '0.7rem', fontWeight: 500, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                        Import Database File
                      </span>
                      <input 
                        type="file" 
                        id="db-import-file" 
                        accept=".json" 
                        onChange={handleImportDatabase} 
                        style={{ display: 'none' }}
                      />
                      <label htmlFor="db-import-file" className="btn btn-secondary btn-sm" style={{ cursor: 'pointer', display: 'inline-flex' }}>
                        Select database file
                      </label>
                    </div>
                  </div>
                </div>

                {/* APP SECURITY PASSCODE SECTION */}
                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                  <div className="panel-title">
                    <Lock size={14} /> Passcode Lock Control
                  </div>
                  <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginBottom: '12px', lineHeight: 1.4 }}>
                    Lock the editor to prevent accidental modifications on public links.
                  </p>

                  {settings.passcodeHash ? (
                    <div style={{ background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.2)', padding: '14px', borderRadius: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981', fontSize: '0.8rem', fontWeight: 600, marginBottom: '10px' }}>
                        <Lock size={14} /> Hashed Passcode Active
                      </div>
                      <button type="button" className="btn btn-danger btn-sm" style={{ width: '100%' }} onClick={removePasscode}>
                        Disable Passcode Lock
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={enablePasscode} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <input 
                          type="password" 
                          className="form-input" 
                          placeholder="New passcode..." 
                          value={newPasscode}
                          onChange={(e) => setNewPasscode(e.target.value)}
                          style={{ padding: '6px 10px', fontSize: '0.8rem' }}
                        />
                      </div>
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <input 
                          type="password" 
                          className="form-input" 
                          placeholder="Confirm passcode..." 
                          value={confirmPasscode}
                          onChange={(e) => setConfirmPasscode(e.target.value)}
                          style={{ padding: '6px 10px', fontSize: '0.8rem' }}
                        />
                      </div>

                      {passcodeError && (
                        <div style={{ color: '#ef4444', fontSize: '0.7rem' }}>
                          {passcodeError}
                        </div>
                      )}

                      <button type="submit" className="btn btn-secondary btn-sm" style={{ alignSelf: 'flex-end' }}>
                        <Key size={12} /> Set Lock Passcode
                      </button>
                    </form>
                  )}
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* PAGE PREVIEW CANVAS (Right Side) */}
        <section className="preview-container no-print" ref={previewRef}>
          {/* TOOLBAR FOR PAGE PREVIEW OPTIONS */}
          <div className="preview-toolbar">
            <div className="toolbar-info">
              <span>Format:</span>
              <span className="toolbar-badge">{currentSizeObj.name}</span>
              <span>Theme:</span>
              <span className="toolbar-badge">{activeThemeObj.name}</span>
              <span>Doc Length:</span>
              <span className="toolbar-badge">{settings.pageCount || 1} Pages</span>
            </div>

            <div className="toolbar-controls">
              <div className="scale-control">
                <span>Scale:</span>
                <input 
                  type="range" 
                  min="0.3" 
                  max="1.5" 
                  step="0.05"
                  value={scale} 
                  onChange={(e) => setScale(parseFloat(e.target.value))}
                  style={{ width: '80px', accentColor: 'var(--primary)' }}
                />
                <span style={{ width: '36px', textAlign: 'right', fontFamily: 'monospace' }}>
                  {Math.round(scale * 100)}%
                </span>
              </div>
            </div>
          </div>

          {/* DYNAMIC CANVAS PREVIEW AREA */}
          <div 
            className="preview-canvas" 
            onScroll={handleCanvasScroll}
            onMouseEnter={() => { scrollOwnerRef.current = 'canvas'; }}
            onWheel={() => { scrollOwnerRef.current = 'canvas'; }}
            onTouchStart={() => { scrollOwnerRef.current = 'canvas'; }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'flex-start',
              gap: '40px',
              paddingBottom: '60px',
              overflowY: 'auto',
              minHeight: 0
            }}
          >
            {Array.from({ length: settings.pageCount || 1 }).map((_, pageIdx) => {
              const pageCategories = menuData.categories.filter(c => 
                (c.pageIndex !== undefined ? c.pageIndex : 0) === pageIdx
              );

              const scaledWidth = `${parseFloat(currentSizeObj.width) * scale}mm`;
              const scaledHeight = `${parseFloat(currentSizeObj.height) * scale}mm`;

              return (
                <div key={pageIdx} style={{ 
                  position: 'relative',
                  width: scaledWidth,
                  height: scaledHeight,
                  flexShrink: 0,
                  marginBottom: '20px'
                }}>
                  {/* Page Label */}
                  <div className="no-print page-header-controls" style={{
                    position: 'absolute',
                    top: '-32px',
                    left: '0',
                    right: '0',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: 'var(--text-secondary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '8px',
                    zIndex: 10
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span>Page {pageIdx + 1} of {settings.pageCount || 1}</span>
                      {pageCategories.length === 0 && (
                        <span style={{ color: '#ef4444', fontSize: '0.7rem', background: 'rgba(239, 68, 68, 0.1)', padding: '1px 6px', borderRadius: '4px' }}>(Empty Page)</span>
                      )}
                      {overflowState.pages[pageIdx] && (
                        <span style={{ 
                          color: '#ef4444', 
                          fontSize: '0.7rem', 
                          background: 'rgba(239, 68, 68, 0.15)', 
                          padding: '2px 8px', 
                          borderRadius: '4px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontWeight: 700,
                          border: '1px solid rgba(239, 68, 68, 0.3)',
                          boxShadow: '0 0 10px rgba(239, 68, 68, 0.1)'
                        }} className="animate-pulse">
                          <AlertTriangle size={12} /> PAGE OVERFLOWS
                        </span>
                      )}
                    </div>
                    
                    {settings.paginationMode !== 'auto' && (
                      <div className="page-actions-group" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <button 
                          type="button" 
                          className="icon-action-btn"
                          disabled={pageIdx === 0}
                          onClick={(e) => handleMovePage(pageIdx, 'up', e)}
                          title="Move Page Up"
                          style={{ padding: '2px', opacity: pageIdx === 0 ? 0.3 : 1 }}
                        >
                          <ChevronUp size={14} />
                        </button>
                        <button 
                          type="button" 
                          className="icon-action-btn"
                          disabled={pageIdx === settings.pageCount - 1}
                          onClick={(e) => handleMovePage(pageIdx, 'down', e)}
                          title="Move Page Down"
                          style={{ padding: '2px', opacity: pageIdx === settings.pageCount - 1 ? 0.3 : 1 }}
                        >
                          <ChevronDown size={14} />
                        </button>
                        {settings.pageCount > 1 && (
                          <button 
                            type="button" 
                            className="icon-action-btn btn-delete-item"
                            onClick={(e) => handleDeletePage(pageIdx, e)}
                            title="Delete Page"
                            style={{ padding: '2px' }}
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  <div 
                    ref={pageIdx === 0 ? pageRef : null}
                    className="menu-page-wrapper"
                    style={{
                      width: currentSizeObj.width,
                      height: currentSizeObj.height,
                      position: 'relative',
                      transform: `scale(${scale})`,
                      transformOrigin: 'top left',
                      ...getThemeStyles()
                    }}
                  >
                    {/* Decorative Frame */}
                    {settings.borderStyle !== 'none' && <div className="menu-border-decorator"></div>}
                    {settings.borderStyle === 'double' && <div className="menu-border-double"></div>}

                    {/* Menu Content Box */}
                    <div className="menu-page-content">
                      
                      {/* 1. Header block (Only on Page 1) */}
                      {pageIdx === 0 ? (
                        <header className="menu-header-block">
                          <h2 className="menu-title">{menuData.restaurantName || "Restaurant Name"}</h2>
                          {menuData.subtitle && <p className="menu-subtitle">{menuData.subtitle}</p>}
                          <div className="menu-header-divider"></div>
                        </header>
                      ) : (
                        // Mini spacer for subsequent pages
                        <div style={{ height: '15px' }}></div>
                      )}

                      {/* 2. Menu Items & Categories Body */}
                      <div className="menu-body-block">
                        <div 
                          className="menu-columns-container" 
                          style={{ 
                            gridTemplateColumns: `repeat(${settings.columns}, 1fr)`,
                            height: '100%',
                          }}
                        >
                          {pageCategories.map((category) => {
                            const categoryAlign = category.textAlign && category.textAlign !== 'default' ? category.textAlign : (settings.textAlign || 'left');
                            const isCatOverflowing = overflowState.categories[category.id];
                            return (
                              <section 
                                key={category.id} 
                                data-catid={category.id} 
                                className={`menu-category-section ${isCatOverflowing ? 'cat-overflow-highlight' : ''}`}
                                style={{
                                  textAlign: categoryAlign === 'center' ? 'center' : 'left'
                                }}
                              >
                                {/* Category Header */}
                                <div className="menu-category-header">
                                  <h3 className="menu-category-name">
                                    {category.name}
                                    {isCatOverflowing && (
                                      <span className="no-print cat-overflow-badge" title="This category exceeds the bottom margin of the page and is cut off.">
                                        ⚠️ Cut off!
                                      </span>
                                    )}
                                  </h3>
                                  {category.description && <p className="menu-category-desc">{category.description}</p>}
                                  
                                  {/* Divider Style */}
                                  <div className="category-divider">
                                    {activeThemeObj.dividerStyle === 'line' && <div className="divider-line-solid"></div>}
                                    {activeThemeObj.dividerStyle === 'dots' && <div className="divider-line-dots">...</div>}
                                    {activeThemeObj.dividerStyle === 'dashed' && <div className="divider-line-solid" style={{ borderBottom: '1px dashed' }}></div>}
                                    {activeThemeObj.dividerStyle === 'ornament' && (
                                      <div className="divider-line-ornament">
                                        <span style={{ fontSize: '0.65rem' }}>❖</span>
                                      </div>
                                    )}
                                  </div>
                                </div>

                                {/* Items Grid */}
                                <div 
                                  className="menu-items-grid"
                                  style={getItemsGridStyle(category.itemLayout)}
                                >
                                  {category.items.map((item, itemIdx) => (
                                    categoryAlign === 'center' ? (
                                      // Centered Stacked Layout (Canva Food Style)
                                      <div 
                                        key={item.id} 
                                        className="menu-item-row" 
                                        style={{ 
                                          alignItems: 'center', 
                                          textAlign: 'center', 
                                          marginBottom: '4px',
                                          ...getItemStyle(category.itemLayout, itemIdx, category.items.length)
                                        }}
                                      >
                                        {item.showImage && item.image && (
                                          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '6px', width: '100%' }}>
                                            <img 
                                              src={item.image} 
                                              alt={item.name} 
                                              style={{
                                                maxWidth: '100%',
                                                maxHeight: '100px',
                                                height: 'auto',
                                                width: `${item.imageScale || 100}%`,
                                                borderRadius: '4px',
                                                objectFit: 'cover'
                                              }}
                                            />
                                          </div>
                                        )}
                                        <div className="item-name-group" style={{ justifyContent: 'center' }}>
                                          <span className="item-name">{item.name}</span>
                                          {item.badge && <span className="item-badge" style={{ marginLeft: '6px' }}>{item.badge}</span>}
                                        </div>
                                        {item.description && (
                                          <p className="item-description" style={{ marginTop: '2px', marginBottom: '4px' }}>{item.description}</p>
                                        )}
                                        <span className="item-price" style={{ color: 'var(--menu-accent)', fontWeight: 700 }}>{item.price}</span>
                                      </div>
                                    ) : (
                                      // Left / Right Spacing Layout (Canva Drinks Style)
                                      <div 
                                        key={item.id} 
                                        className="menu-item-row"
                                        style={getItemStyle(category.itemLayout, itemIdx, category.items.length)}
                                      >
                                        {item.showImage && item.image && (
                                          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '6px', width: '100%' }}>
                                            <img 
                                              src={item.image} 
                                              alt={item.name} 
                                              style={{
                                                maxWidth: '100%',
                                                maxHeight: '100px',
                                                height: 'auto',
                                                width: `${item.imageScale || 100}%`,
                                                borderRadius: '4px',
                                                objectFit: 'cover'
                                              }}
                                            />
                                          </div>
                                        )}
                                        <div className="item-main-line">
                                          <div className="item-name-group">
                                            <span className="item-name">{item.name}</span>
                                            {item.badge && <span className="item-badge">{item.badge}</span>}
                                          </div>
                                          {settings.showDots && <div className="price-leader-dots"></div>}
                                          <span className="item-price">{item.price}</span>
                                        </div>
                                        {item.description && (
                                          <p className="item-description">{item.description}</p>
                                        )}
                                      </div>
                                    )
                                  ))}
                                </div>
                              </section>
                            );
                          })}
                        </div>
                      </div>

                      {/* 3. Footer block (Only on last page) */}
                      {pageIdx === (settings.pageCount || 1) - 1 && menuData.footer && (
                        <footer className="menu-footer-block">
                          <div className="menu-footer-divider"></div>
                          <p className="menu-footer-text">{menuData.footer}</p>
                        </footer>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Visual Add Page Button */}
            {settings.paginationMode !== 'auto' && (
              <div className="no-print add-page-canvas-wrapper" style={{
                width: `${parseFloat(currentSizeObj.width) * scale}mm`,
                height: `${100 * scale}px`,
                flexShrink: 0,
                marginBottom: '20px'
              }}>
                <button 
                  type="button"
                  className="add-page-canvas-btn"
                  onClick={handleAddPage}
                  style={{
                    width: currentSizeObj.width,
                    height: '100px',
                    transform: `scale(${scale})`,
                    transformOrigin: 'top left',
                    border: '2px dashed var(--border-color)',
                    background: 'rgba(255, 255, 255, 0.02)',
                    color: 'var(--text-secondary)',
                    borderRadius: '8px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    fontFamily: 'var(--font-ui)'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.borderColor = '#10b981';
                    e.currentTarget.style.color = '#10b981';
                    e.currentTarget.style.background = 'rgba(16, 185, 129, 0.04)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border-color)';
                    e.currentTarget.style.color = 'var(--text-secondary)';
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)';
                  }}
                >
                  <Plus size={24} />
                  <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Add Page to Document</span>
                </button>
              </div>
            )}
          </div>

          {/* OVERFLOW ALERT FOR USER */}
          {Object.keys(overflowState.pages).length > 0 && (
            <div className="overflow-alert-wrapper" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <AlertTriangle className="overflow-icon" size={20} style={{ color: '#ffffff' }} />
                <h4 style={{ margin: 0, fontSize: '0.85rem', fontWeight: 700 }}>Menu Overset Warning!</h4>
              </div>
              <div className="overflow-text" style={{ paddingLeft: '30px', width: '100%' }}>
                <p style={{ margin: 0, fontSize: '0.75rem', opacity: 0.9, lineHeight: 1.4 }}>
                  The following pages exceed printable boundaries:
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '6px' }}>
                  {Object.keys(overflowState.pages).map(pIdx => (
                    <span key={pIdx} style={{ 
                      fontSize: '0.65rem', 
                      background: 'rgba(255, 255, 255, 0.15)', 
                      color: 'white', 
                      padding: '2px 6px', 
                      borderRadius: '4px',
                      fontWeight: 600
                    }}>
                      Page {parseInt(pIdx) + 1}
                    </span>
                  ))}
                </div>
                {Object.keys(overflowState.categories).length > 0 && (
                  <>
                    <p style={{ margin: '8px 0 0 0', fontSize: '0.75rem', opacity: 0.9, lineHeight: 1.4 }}>
                      Cut-off categories:
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '4px' }}>
                      {Object.keys(overflowState.categories).map(catId => {
                        const cat = menuData.categories.find(c => c.id === catId);
                        return (
                          <span key={catId} style={{ 
                            fontSize: '0.65rem', 
                            background: 'rgba(0, 0, 0, 0.25)', 
                            color: '#f87171', 
                            padding: '2px 6px', 
                            borderRadius: '4px',
                            fontWeight: 600,
                            border: '1px solid rgba(239, 68, 68, 0.2)'
                          }}>
                            {cat ? cat.name : 'Untitled'}
                          </span>
                        );
                      })}
                    </div>
                  </>
                )}
                <p style={{ margin: '8px 0 0 0', fontSize: '0.7rem', opacity: 0.7 }}>
                  Tweak gaps, font sizes, margins, or shift items to resolve.
                </p>
                {settings.paginationMode === 'manual' && (
                  <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <p style={{ margin: 0, fontSize: '0.72rem', color: '#fca5a5', fontWeight: 600 }}>
                      💡 Tip: Click below to re-calculate and flow categories automatically based on heights and order.
                    </p>
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      style={{ 
                        width: '100%', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        gap: '6px', 
                        background: 'rgba(255, 255, 255, 0.1)', 
                        color: '#fff', 
                        borderColor: 'rgba(255, 255, 255, 0.2)',
                        fontSize: '0.72rem',
                        padding: '4px 8px'
                      }}
                      onClick={() => {
                        triggerAutoPagination(true);
                        showToast('Page flow re-calculated & applied!');
                      }}
                    >
                      <ArrowUpDown size={12} /> Auto-Flow & Reassign Pages
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </section>
      </main>
    </div>

    {/* PRINT-ONLY VERSION RENDERED IN NATIVE BROWSER WINDOW */}
    <div className="print-only-layout" style={{ display: 'none' }}>
      {Array.from({ length: settings.pageCount || 1 }).map((_, pageIdx) => {
        const pageCategories = menuData.categories.filter(c => 
          (c.pageIndex !== undefined ? c.pageIndex : 0) === pageIdx
        );

        return (
          <div 
            key={pageIdx}
            className="menu-page-wrapper" 
            style={{
              width: currentSizeObj.width,
              height: currentSizeObj.height,
              position: 'relative',
              margin: '0 auto',
              ...getThemeStyles()
            }}
          >
              {settings.borderStyle !== 'none' && <div className="menu-border-decorator"></div>}
              {settings.borderStyle === 'double' && <div className="menu-border-double"></div>}
              
              <div className="menu-page-content">
                {pageIdx === 0 ? (
                  <header className="menu-header-block">
                    <h2 className="menu-title">{menuData.restaurantName}</h2>
                    {menuData.subtitle && <p className="menu-subtitle">{menuData.subtitle}</p>}
                    <div className="menu-header-divider"></div>
                  </header>
                ) : (
                  <div style={{ height: '15px' }}></div>
                )}

                <div className="menu-body-block">
                  <div 
                    className="menu-columns-container" 
                    style={{ 
                      gridTemplateColumns: `repeat(${settings.columns}, 1fr)`,
                      height: '100%'
                    }}
                  >
                    {pageCategories.map((category) => {
                      const categoryAlign = category.textAlign && category.textAlign !== 'default' ? category.textAlign : (settings.textAlign || 'left');
                      return (
                        <section key={category.id} className="menu-category-section" style={{
                          textAlign: categoryAlign === 'center' ? 'center' : 'left'
                        }}>
                          <div className="menu-category-header">
                            <h3 className="menu-category-name">{category.name}</h3>
                            {category.description && <p className="menu-category-desc">{category.description}</p>}
                            <div className="category-divider">
                              {activeThemeObj.dividerStyle === 'line' && <div className="divider-line-solid"></div>}
                              {activeThemeObj.dividerStyle === 'dots' && <div className="divider-line-dots">...</div>}
                              {activeThemeObj.dividerStyle === 'dashed' && <div className="divider-line-solid" style={{ borderBottom: '1px dashed' }}></div>}
                              {activeThemeObj.dividerStyle === 'ornament' && (
                                <div className="divider-line-ornament">
                                  <span style={{ fontSize: '0.65rem' }}>❖</span>
                                </div>
                              )}
                            </div>
                          </div>

                          <div 
                            className="menu-items-grid"
                            style={getItemsGridStyle(category.itemLayout)}
                          >
                            {category.items.map((item, itemIdx) => (
                              categoryAlign === 'center' ? (
                                <div 
                                  key={item.id} 
                                  className="menu-item-row" 
                                  style={{ 
                                    alignItems: 'center', 
                                    textAlign: 'center', 
                                    marginBottom: '4px',
                                    ...getItemStyle(category.itemLayout, itemIdx, category.items.length)
                                  }}
                                >
                                  {item.showImage && item.image && (
                                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '6px', width: '100%' }}>
                                      <img 
                                        src={item.image} 
                                        alt={item.name} 
                                        style={{
                                          maxWidth: '100%',
                                          maxHeight: '100px',
                                          height: 'auto',
                                          width: `${item.imageScale || 100}%`,
                                          borderRadius: '4px',
                                          objectFit: 'cover'
                                        }}
                                      />
                                    </div>
                                  )}
                                  <div className="item-name-group" style={{ justifyContent: 'center' }}>
                                    <span className="item-name">{item.name}</span>
                                    {item.badge && <span className="item-badge" style={{ marginLeft: '6px' }}>{item.badge}</span>}
                                  </div>
                                  {item.description && (
                                    <p className="item-description" style={{ marginTop: '2px', marginBottom: '4px' }}>{item.description}</p>
                                  )}
                                  <span className="item-price" style={{ color: 'var(--menu-accent)', fontWeight: 700 }}>{item.price}</span>
                                </div>
                              ) : (
                                <div 
                                  key={item.id} 
                                  className="menu-item-row"
                                  style={getItemStyle(category.itemLayout, itemIdx, category.items.length)}
                                >
                                  {item.showImage && item.image && (
                                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '6px', width: '100%' }}>
                                      <img 
                                        src={item.image} 
                                        alt={item.name} 
                                        style={{
                                          maxWidth: '100%',
                                          maxHeight: '100px',
                                          height: 'auto',
                                          width: `${item.imageScale || 100}%`,
                                          borderRadius: '4px',
                                          objectFit: 'cover'
                                        }}
                                      />
                                    </div>
                                  )}
                                  <div className="item-main-line">
                                    <div className="item-name-group">
                                      <span className="item-name">{item.name}</span>
                                      {item.badge && <span className="item-badge">{item.badge}</span>}
                                    </div>
                                    {settings.showDots && <div className="price-leader-dots"></div>}
                                    <span className="item-price">{item.price}</span>
                                  </div>
                                  {item.description && (
                                    <p className="item-description">{item.description}</p>
                                  )}
                                </div>
                              )
                            ))}
                          </div>
                        </section>
                      );
                    })}
                  </div>
                </div>

                {pageIdx === (settings.pageCount || 1) - 1 && menuData.footer && (
                  <footer className="menu-footer-block">
                    <div className="menu-footer-divider"></div>
                    <p className="menu-footer-text">{menuData.footer}</p>
                  </footer>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}


