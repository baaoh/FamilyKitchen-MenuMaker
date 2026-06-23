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
  Key
} from 'lucide-react';
import { PAGE_SIZES, PRESET_THEMES, INITIAL_MENU_DATA } from './templates';

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

export default function App() {
  // --- STATE ---
  const [menuData, setMenuData] = useState(() => {
    const saved = localStorage.getItem('menu_designer_data');
    return saved ? JSON.parse(saved) : INITIAL_MENU_DATA;
  });

  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('menu_designer_settings');
    return saved ? JSON.parse(saved) : {
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
      textAlign: 'center', // 'left' | 'center'
      passcodeHash: '' // Empty string if unlocked
    };
  });

  const [activeTab, setActiveTab] = useState('data'); // 'data' | 'styling' | 'presets' | 'export'
  const [expandedCategories, setExpandedCategories] = useState({ 'cat-1': true });
  const [scale, setScale] = useState(0.75);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  // Security Locks
  const [isLocked, setIsLocked] = useState(() => {
    // If settings are stored in localstorage with a passcode, start locked
    try {
      const savedSettings = localStorage.getItem('menu_designer_settings');
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        return !!parsed.passcodeHash;
      }
    } catch(e) {}
    return false;
  });
  const [typedPasscode, setTypedPasscode] = useState('');
  const [lockError, setLockError] = useState('');
  
  // Security setup states (inputs in settings tab)
  const [newPasscode, setNewPasscode] = useState('');
  const [confirmPasscode, setConfirmPasscode] = useState('');
  const [passcodeError, setPasscodeError] = useState('');

  // Custom Presets
  const [customPresets, setCustomPresets] = useState(() => {
    const saved = localStorage.getItem('menu_designer_custom_presets');
    return saved ? JSON.parse(saved) : [];
  });
  const [presetSaveName, setPresetSaveName] = useState('');

  const previewRef = useRef(null);
  const pageRef = useRef(null);

  // --- LOCAL STORAGE SYNCRONIZATION ---
  useEffect(() => {
    localStorage.setItem('menu_designer_data', JSON.stringify(menuData));
  }, [menuData]);

  useEffect(() => {
    localStorage.setItem('menu_designer_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('menu_designer_custom_presets', JSON.stringify(customPresets));
  }, [customPresets]);

  // --- AUTOMATIC OVERFLOW DETECTOR ---
  useEffect(() => {
    if (isLocked) return;
    const checkOverflow = () => {
      if (pageRef.current) {
        const element = pageRef.current;
        // Determine if content overflows vertically.
        const hasOverflow = element.scrollHeight > element.clientHeight + 2;
        setIsOverflowing(hasOverflow);
      }
    };
    
    // Run after components render and fonts load
    const timer = setTimeout(checkOverflow, 150);
    window.addEventListener('resize', checkOverflow);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', checkOverflow);
    };
  }, [menuData, settings, scale, isLocked]);

  // Flash messages helper
  const showToast = (msg) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  // --- SECURITY LOGIN VERIFICATION ---
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
        customBorder: settings.customBorder
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

  // --- MENU DATA MUTATIONS ---
  
  // Category management
  const addCategory = () => {
    const newId = `cat-${Date.now()}`;
    const newCat = {
      id: newId,
      name: 'New Category',
      description: 'Describe this section of your menu',
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
  };

  // Item management
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

  // Toggle Category Collapsed state in sidebar
  const toggleExpand = (catId) => {
    setExpandedCategories(prev => ({
      ...prev,
      [catId]: !prev[catId]
    }));
  };

  // --- FILE IMPORT/EXPORT & RESET ---
  
  const exportJSON = () => {
    const exportObj = {
      menuData,
      settings
    };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    
    const timestamp = new Date().toISOString().slice(0, 10);
    const filename = `${menuData.restaurantName.toLowerCase().replace(/[^a-z0-9]/g, '_')}_menu_${timestamp}.json`;
    downloadAnchor.setAttribute("download", filename);
    
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Exported successfully!');
  };

  const importJSON = (e) => {
    const fileReader = new FileReader();
    const file = e.target.files[0];
    if (!file) return;

    fileReader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (parsed.menuData) {
          setMenuData(parsed.menuData);
        }
        if (parsed.settings) {
          // preserve security settings during template loads
          setSettings(prev => ({
            ...parsed.settings,
            passcodeHash: prev.passcodeHash
          }));
        }
        showToast('Menu imported successfully!');
      } catch (err) {
        alert('Invalid JSON file format. Make sure you load a menu export file.');
      }
    };
    fileReader.readAsText(file, "UTF-8");
  };

  const resetToDefault = () => {
    if (window.confirm('Are you sure you want to reset all your items and layout overrides to the default?')) {
      setMenuData(INITIAL_MENU_DATA);
      setSettings(prev => ({
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
        passcodeHash: prev.passcodeHash // Keep the password lock active
      }));
      showToast('Reset complete');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Theme selection helper
  const applyTheme = (themeId) => {
    const preset = PRESET_THEMES.find(t => t.id === themeId);
    if (preset) {
      setSettings(prev => ({
        ...prev,
        theme: themeId,
        textAlign: preset.styles['--menu-align'] || 'left',
        // Reset color overrides to let theme defaults apply
        customBg: '',
        customText: '',
        customAccent: '',
        customBorder: ''
      }));
      showToast(`Applied ${preset.name} preset!`);
    }
  };

  // Get active configurations combined with custom overrides
  const getThemeStyles = () => {
    const themePreset = PRESET_THEMES.find(t => t.id === settings.theme) || PRESET_THEMES[0];
    const baseStyles = { ...themePreset.styles };

    // Inject manual sliders and toggles
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
    
    // Inject active alignment
    baseStyles['--menu-align'] = settings.textAlign || baseStyles['--menu-align'] || 'left';

    // Apply color overrides if set
    if (settings.customBg) baseStyles['--menu-bg'] = settings.customBg;
    if (settings.customText) baseStyles['--menu-text'] = settings.customText;
    if (settings.customAccent) baseStyles['--menu-accent'] = settings.customAccent;
    if (settings.customBorder) baseStyles['--menu-border'] = settings.customBorder;

    return baseStyles;
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
        fontFamily: "'Inter', sans-serif",
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
            color: '#f97316',
            marginBottom: '20px',
            border: '1px solid rgba(249, 115, 22, 0.25)'
          }}>
            <Lock size={32} />
          </div>
          
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '8px', letterSpacing: '-0.025em' }}>
            Menu Designer Locked
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#a1a1aa', marginBottom: '24px', lineHeight: 1.4 }}>
            Please enter your password passcode to gain editor access.
          </p>

          <form onSubmit={handleUnlock}>
            <div style={{ marginBottom: '16px' }}>
              <input 
                type="password" 
                className="form-input" 
                placeholder="••••••••" 
                value={typedPasscode}
                onChange={(e) => setTypedPasscode(e.target.value)}
                autoFocus
                style={{
                  textAlign: 'center',
                  fontSize: '1.2rem',
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

            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px' }}>
              Unlock Dashboard
            </button>
          </form>
          
          <div style={{ marginTop: '24px', fontSize: '0.7rem', color: '#71717a' }}>
            Hint: If passcode is forgotten, clear browser cache (clears data as well). Use backup JSON files.
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // CORE DASHBOARD EDITOR RENDER
  // ==========================================
  return (
    <div className="app-container">
      {/* HEADER BAR */}
      <header className="app-header no-print">
        <div className="header-logo">
          <BookOpen className="logo-icon" size={24} />
          <h1>Menu Designer Pro</h1>
          <span>v1.1</span>
        </div>
        
        {successMessage && (
          <div className="toast-message animate-fade-in" style={{
            background: 'rgba(34, 197, 94, 0.9)',
            color: 'white',
            padding: '6px 16px',
            borderRadius: '6px',
            fontSize: '0.8rem',
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 12px rgba(34, 197, 94, 0.2)'
          }}>
            <Check size={16} /> {successMessage}
          </div>
        )}

        <div className="header-actions">
          {settings.passcodeHash && (
            <button className="btn btn-secondary btn-sm" onClick={() => setIsLocked(true)} title="Lock Editor screen">
              <Lock size={14} /> Lock Dashboard
            </button>
          )}

          <button className="btn btn-secondary btn-sm" onClick={resetToDefault} title="Clear and load default template">
            <RotateCcw size={14} /> Reset
          </button>
          
          <button className="btn btn-primary btn-sm" onClick={handlePrint}>
            <Printer size={14} /> Export PDF / Print
          </button>
        </div>
      </header>

      {/* WORKSPACE CONTENT */}
      <main className="app-main">
        {/* SIDEBAR PANELS */}
        <aside className="app-sidebar no-print">
          <div className="sidebar-tabs">
            <button 
              className={`tab-btn ${activeTab === 'data' ? 'active' : ''}`}
              onClick={() => setActiveTab('data')}
            >
              <FileText size={16} /> Data Input
            </button>
            <button 
              className={`tab-btn ${activeTab === 'styling' ? 'active' : ''}`}
              onClick={() => setActiveTab('styling')}
            >
              <Sliders size={16} /> Styling
            </button>
            <button 
              className={`tab-btn ${activeTab === 'presets' ? 'active' : ''}`}
              onClick={() => setActiveTab('presets')}
            >
              <Palette size={16} /> Presets
            </button>
            <button 
              className={`tab-btn ${activeTab === 'export' ? 'active' : ''}`}
              onClick={() => setActiveTab('export')}
            >
              <Download size={16} /> Save / Lock
            </button>
          </div>

          <div className="sidebar-content">
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
                      placeholder="e.g. L'Aura Bistro"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Subtitle / Slogan</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={menuData.subtitle}
                      onChange={(e) => setMenuData(prev => ({ ...prev, subtitle: e.target.value }))}
                      placeholder="e.g. Coffee & Kitchen"
                    />
                  </div>
                </div>

                {/* CATEGORIES SECTION */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <div className="panel-title" style={{ margin: 0 }}>
                    <Layers size={16} /> Categories & Items
                  </div>
                  <button className="btn btn-primary btn-sm" onClick={addCategory}>
                    <Plus size={12} /> Add Category
                  </button>
                </div>

                <div className="editor-list">
                  {menuData.categories.map((cat, catIdx) => (
                    <div key={cat.id} className="category-card">
                      <div className="category-card-header" onClick={() => toggleExpand(cat.id)}>
                        <div className="category-title-info">
                          <span style={{ color: 'var(--text-muted)' }}>#{catIdx + 1}</span>
                          <span className="category-title">{cat.name || 'Untitled Category'}</span>
                          <span className="category-count">{cat.items.length} items</span>
                        </div>
                        <div className="card-actions">
                          <button 
                            className="icon-action-btn btn-move-up" 
                            disabled={catIdx === 0}
                            onClick={(e) => moveCategory(catIdx, 'up', e)}
                            title="Move Category Up"
                          >
                            <ChevronUp size={14} />
                          </button>
                          <button 
                            className="icon-action-btn btn-move-down" 
                            disabled={catIdx === menuData.categories.length - 1}
                            onClick={(e) => moveCategory(catIdx, 'down', e)}
                            title="Move Category Down"
                          >
                            <ChevronDown size={14} />
                          </button>
                          <button 
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
                          
                          <div className="form-group">
                            <label className="form-label">Category Description (Optional)</label>
                            <input 
                              type="text" 
                              className="form-input" 
                              value={cat.description}
                              onChange={(e) => updateCategory(cat.id, 'description', e.target.value)}
                            />
                          </div>

                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', marginBottom: '8px' }}>
                            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Menu Items</span>
                            <button className="btn btn-secondary btn-sm" style={{ padding: '4px 8px', fontSize: '0.7rem' }} onClick={() => addItem(cat.id)}>
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
                                    style={{ flex: 2, fontWeight: 'bold' }} 
                                    value={item.name} 
                                    placeholder="Dish name"
                                    onChange={(e) => updateItem(cat.id, item.id, 'name', e.target.value)}
                                  />
                                  <input 
                                    type="text" 
                                    className="form-input" 
                                    style={{ flex: 1, textAlign: 'right', fontFamily: 'monospace' }} 
                                    value={item.price} 
                                    placeholder="Price (e.g. 10.00)"
                                    onChange={(e) => updateItem(cat.id, item.id, 'price', e.target.value)}
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
                                <div className="item-editor-row" style={{ alignItems: 'center', justifyContent: 'space-between' }}>
                                  <input 
                                    type="text" 
                                    className="form-input" 
                                    style={{ flex: 1, padding: '6px 8px', fontSize: '0.75rem' }}
                                    value={item.badge} 
                                    placeholder="Badge (e.g. Vegan, Spicy)"
                                    onChange={(e) => updateItem(cat.id, item.id, 'badge', e.target.value)}
                                  />
                                  
                                  <div style={{ display: 'flex', gap: '2px', marginLeft: '12px' }}>
                                    <button 
                                      className="icon-action-btn" 
                                      disabled={itemIdx === 0}
                                      onClick={() => moveItem(cat.id, itemIdx, 'up')}
                                      title="Move Item Up"
                                    >
                                      <ChevronUp size={12} />
                                    </button>
                                    <button 
                                      className="icon-action-btn" 
                                      disabled={itemIdx === cat.items.length - 1}
                                      onClick={() => moveItem(cat.id, itemIdx, 'down')}
                                      title="Move Item Down"
                                    >
                                      <ChevronDown size={12} />
                                    </button>
                                    <button 
                                      className="icon-action-btn btn-delete-item" 
                                      onClick={() => deleteItem(cat.id, item.id)}
                                      title="Delete Item"
                                    >
                                      <Trash2 size={12} />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))}
                            {cat.items.length === 0 && (
                              <div style={{ padding: '20px', border: '1px dashed var(--border-color)', borderRadius: '6px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                                No items in this category. Click 'Add Item' above!
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                  {menuData.categories.length === 0 && (
                    <div style={{ padding: '40px 20px', border: '1px dashed var(--border-color)', borderRadius: '8px', textAlign: 'center', color: 'var(--text-muted)' }}>
                      No categories defined yet. Get started by clicking 'Add Category'.
                    </div>
                  )}
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
                      placeholder="e.g. Inform staff of any allergies..."
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
                      onChange={(e) => setSettings(prev => ({ ...prev, textAlign: e.target.value }))}
                    >
                      <option value="left">Left & Right Align (Drinks Style)</option>
                      <option value="center">Centered Stacked (Food Style)</option>
                    </select>
                  </div>

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

                  {/* Leader dots Toggle (Only valid for left align) */}
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
                    {(settings.customBg || settings.customText || settings.customAccent || settings.customBorder) && (
                      <button 
                        className="btn btn-secondary btn-sm" 
                        style={{ width: '100%' }}
                        onClick={() => setSettings(prev => ({ 
                          ...prev, 
                          customBg: '', 
                          customText: '', 
                          customAccent: '',
                          customBorder: ''
                        }))}
                      >
                        Reset Custom Color Overrides
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

            {/* TABS 4: SAVE / LOCK */}
            {activeTab === 'export' && (
              <div className="panel-section animate-fade-in">
                <div className="panel-title">
                  <Download size={16} /> Local File Backups
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '12px', lineHeight: 1.4 }}>
                  Export your menus as files. This lets you import them later, manage multiple versions, or share them.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                  <button className="btn btn-secondary" style={{ width: '100%', justifyContent: 'flex-start' }} onClick={exportJSON}>
                    <Download size={16} /> Export Menu to File (.json)
                  </button>

                  <div style={{ border: '1px dashed var(--border-color)', borderRadius: '8px', padding: '16px', textAlign: 'center', background: 'rgba(255,255,255,0.01)' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px' }}>
                      <Upload size={20} className="logo-icon" />
                    </div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-primary)', display: 'block', marginBottom: '8px' }}>
                      Import Menu Backups
                    </span>
                    <input 
                      type="file" 
                      id="menu-import-file" 
                      accept=".json" 
                      onChange={importJSON} 
                      style={{ display: 'none' }}
                    />
                    <label htmlFor="menu-import-file" className="btn btn-secondary btn-sm" style={{ cursor: 'pointer', display: 'inline-flex' }}>
                      Choose backup file
                    </label>
                  </div>
                </div>

                {/* APP SECURITY PASSCODE SECTION */}
                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
                  <div className="panel-title">
                    <Lock size={16} /> App Passcode Protection
                  </div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '12px', lineHeight: 1.4 }}>
                    Set a passcode to lock the editor dashboard. This protects your menus from accidental edits when hosted online on GitHub Pages.
                  </p>

                  {settings.passcodeHash ? (
                    <div style={{ background: 'rgba(249, 115, 22, 0.05)', border: '1px solid rgba(249, 115, 22, 0.2)', padding: '14px', borderRadius: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f97316', fontSize: '0.8rem', fontWeight: 600, marginBottom: '10px' }}>
                        <Lock size={14} /> Active Hashed Lock Protected
                      </div>
                      <button className="btn btn-danger btn-sm" style={{ width: '100%' }} onClick={removePasscode}>
                        Disable Password Protection
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={enablePasscode} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label" style={{ fontSize: '0.7rem' }}>New Passcode</label>
                        <input 
                          type="password" 
                          className="form-input" 
                          placeholder="Type password..." 
                          value={newPasscode}
                          onChange={(e) => setNewPasscode(e.target.value)}
                        />
                      </div>
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label" style={{ fontSize: '0.7rem' }}>Confirm Passcode</label>
                        <input 
                          type="password" 
                          className="form-input" 
                          placeholder="Re-type password..." 
                          value={confirmPasscode}
                          onChange={(e) => setConfirmPasscode(e.target.value)}
                        />
                      </div>

                      {passcodeError && (
                        <div style={{ color: '#ef4444', fontSize: '0.7rem', padding: '4px' }}>
                          {passcodeError}
                        </div>
                      )}

                      <button type="submit" className="btn btn-secondary btn-sm" style={{ alignSelf: 'flex-end', marginTop: '6px' }}>
                        <Key size={12} /> Set Lock Passcode
                      </button>
                    </form>
                  )}
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* PAGE PREVIEW SHEET SIMULATION (Right Side) */}
        <section className="preview-container no-print" ref={previewRef}>
          {/* TOOLBAR FOR PAGE PREVIEW OPTIONS */}
          <div className="preview-toolbar">
            <div className="toolbar-info">
              <span>Layout Format:</span>
              <span className="toolbar-badge">{currentSizeObj.name}</span>
              <span>Theme:</span>
              <span className="toolbar-badge">{activeThemeObj.name}</span>
              <span>Align:</span>
              <span className="toolbar-badge" style={{ textTransform: 'capitalize' }}>{settings.textAlign || 'Left'}</span>
            </div>

            <div className="toolbar-controls">
              <div className="scale-control">
                <span>Preview Scale:</span>
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
          <div className="preview-canvas">
            <div 
              ref={pageRef}
              className="menu-page-wrapper"
              style={{
                width: currentSizeObj.width,
                height: currentSizeObj.height,
                transform: `scale(${scale})`,
                ...getThemeStyles()
              }}
            >
              {/* Decorative Frame */}
              {settings.borderStyle !== 'none' && <div className="menu-border-decorator"></div>}
              {settings.borderStyle === 'double' && <div className="menu-border-double"></div>}

              {/* Menu Content Box */}
              <div className="menu-page-content">
                
                {/* 1. Header block */}
                <header className="menu-header-block">
                  <h2 className="menu-title">{menuData.restaurantName || "Restaurant Name"}</h2>
                  {menuData.subtitle && <p className="menu-subtitle">{menuData.subtitle}</p>}
                  <div className="menu-header-divider"></div>
                </header>

                {/* 2. Menu Items & Categories Body (Flexible layout) */}
                <div className="menu-body-block">
                  <div 
                    className="menu-columns-container" 
                    style={{ 
                      gridTemplateColumns: `repeat(${settings.columns}, 1fr)`,
                      height: '100%',
                    }}
                  >
                    {menuData.categories.map((category) => (
                      <section key={category.id} className="menu-category-section" style={{
                        textAlign: settings.textAlign === 'center' ? 'center' : 'left'
                      }}>
                        {/* Category Header */}
                        <div className="menu-category-header">
                          <h3 className="menu-category-name">{category.name}</h3>
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
                        <div className="menu-items-grid">
                          {category.items.map((item) => (
                            settings.textAlign === 'center' ? (
                              // Centered Stacked Layout (Canva Food Style)
                              <div key={item.id} className="menu-item-row" style={{ alignItems: 'center', textAlign: 'center', marginBottom: '4px' }}>
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
                              <div key={item.id} className="menu-item-row">
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
                    ))}
                  </div>
                </div>

                {/* 3. Footer block */}
                {menuData.footer && (
                  <footer className="menu-footer-block">
                    <div className="menu-footer-divider"></div>
                    <p className="menu-footer-text">{menuData.footer}</p>
                  </footer>
                )}
              </div>
            </div>

            {/* Scroll Indicator if preview overflows screen viewport */}
            <div className="canvas-scroll-hint">
              Use mouse wheel to zoom/scroll in preview canvas
            </div>
          </div>

          {/* OVERFLOW ALERT FOR USER */}
          {isOverflowing && (
            <div className="overflow-alert-wrapper">
              <AlertTriangle className="overflow-icon" size={24} />
              <div className="overflow-text">
                <h4>Content Overflow!</h4>
                <p>Items have exceeded physical boundaries of the selected page size. Try decreasing margins, item/category gap, or font sizes.</p>
              </div>
            </div>
          )}
        </section>
      </main>

      {/* PRINT-ONLY VERSION RENDERED IN NATIVE BROWSER WINDOW */}
      <div className="print-only-layout" style={{ display: 'none' }}>
        <div 
          className="menu-page-wrapper" 
          style={{
            width: currentSizeObj.width,
            height: currentSizeObj.height,
            position: 'absolute',
            top: 0,
            left: 0,
            ...getThemeStyles()
          }}
        >
          {settings.borderStyle !== 'none' && <div className="menu-border-decorator"></div>}
          {settings.borderStyle === 'double' && <div className="menu-border-double"></div>}
          
          <div className="menu-page-content">
            <header className="menu-header-block">
              <h2 className="menu-title">{menuData.restaurantName}</h2>
              {menuData.subtitle && <p className="menu-subtitle">{menuData.subtitle}</p>}
              <div className="menu-header-divider"></div>
            </header>

            <div className="menu-body-block">
              <div 
                className="menu-columns-container" 
                style={{ 
                  gridTemplateColumns: `repeat(${settings.columns}, 1fr)`,
                  height: '100%'
                }}
              >
                {menuData.categories.map((category) => (
                  <section key={category.id} className="menu-category-section" style={{
                    textAlign: settings.textAlign === 'center' ? 'center' : 'left'
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

                    <div className="menu-items-grid">
                      {category.items.map((item) => (
                        settings.textAlign === 'center' ? (
                          // Centered Stacked Layout (Canva Food Style)
                          <div key={item.id} className="menu-item-row" style={{ alignItems: 'center', textAlign: 'center', marginBottom: '4px' }}>
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
                          <div key={item.id} className="menu-item-row">
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
                ))}
              </div>
            </div>

            {menuData.footer && (
              <footer className="menu-footer-block">
                <div className="menu-footer-divider"></div>
                <p className="menu-footer-text">{menuData.footer}</p>
              </footer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
