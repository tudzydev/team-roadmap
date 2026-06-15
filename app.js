// Core Application Controller for Slide Presentation & Editing
document.addEventListener('DOMContentLoaded', () => {
  // state variables
  let rawMarkdown = '';
  let slides = [];
  let currentSlideIndex = 0;
  let activeViewMode = 'present'; // present, editor, grid
  let activeTheme = 'gaia-light';
  let currentDeck = null;
  
  // DOM Elements
  const themeSelect = document.getElementById('theme-select');
  const deckSelect = document.getElementById('deck-select');
  const viewPresent = document.getElementById('view-present');
  const viewEditor = document.getElementById('view-editor');
  const viewGrid = document.getElementById('view-grid');
  
  const sidebar = document.getElementById('app-sidebar');
  const stage = document.getElementById('app-stage');
  const editor = document.getElementById('app-editor');
  const textarea = document.getElementById('markdown-textarea');
  const btnSaveMarkdown = document.getElementById('btn-save-markdown');
  const slideSearch = document.getElementById('slide-search');
  
  const slideBox = document.getElementById('slide-box');
  const slideWrapper = document.getElementById('slide-wrapper');
  const slideContentElement = document.getElementById('slide-content');
  const slideOutlineList = document.getElementById('slide-outline-list');
  const slideIndicatorText = document.getElementById('slide-indicator-text');
  
  const btnPrev = document.getElementById('btn-prev-slide');
  const btnNext = document.getElementById('btn-next-slide');
  const btnFullscreen = document.getElementById('btn-fullscreen');
  
  const presenterNotesBox = document.getElementById('presenter-notes-box');
  const notesContent = document.getElementById('notes-content');
  
  const footerLeft = document.getElementById('footer-left');
  const footerRight = document.getElementById('footer-right');

  // Load a specific slide deck dynamically
  async function loadDeck(deck) {
    currentDeck = deck;
    try {
      const response = await fetch(deck.path);
      if (response.ok) {
        rawMarkdown = await response.text();
        console.log(`Successfully fetched slides from ${deck.path}`);
      } else {
        throw new Error(`Failed to load ${deck.path}`);
      }
    } catch (err) {
      console.warn(`Could not fetch external file for ${deck.id}. Using embedded fallback.`, err);
      const fallbackMap = {
        gitGithubMarkdown: typeof gitGithubMarkdown !== 'undefined' ? gitGithubMarkdown : '',
        githubActionsMarkdown: typeof githubActionsMarkdown !== 'undefined' ? githubActionsMarkdown : '',
        jenkinsMarkdown: typeof jenkinsMarkdown !== 'undefined' ? jenkinsMarkdown : ''
      };
      rawMarkdown = fallbackMap[deck.fallbackKey] || '';
    }

    textarea.value = rawMarkdown;
    currentSlideIndex = 0;
    parseMarkdown(rawMarkdown);
    setTimeout(resizeSlide, 50);
  }

  // Initialize
  async function init() {
    // Populate deck select dropdown
    if (typeof PRESENTATION_DECKS !== 'undefined' && deckSelect) {
      deckSelect.innerHTML = '';
      PRESENTATION_DECKS.forEach(deck => {
        const option = document.createElement('option');
        option.value = deck.id;
        option.textContent = deck.name;
        deckSelect.appendChild(option);
      });
    }

    setupEvents();
    
    // Load initial deck
    const initialDeckId = deckSelect ? deckSelect.value : (typeof PRESENTATION_DECKS !== 'undefined' ? PRESENTATION_DECKS[0].id : 'git-github');
    const initialDeck = typeof PRESENTATION_DECKS !== 'undefined' ? PRESENTATION_DECKS.find(d => d.id === initialDeckId) : null;
    if (initialDeck) {
      await loadDeck(initialDeck);
    }
    
    // Initial resize trigger
    setTimeout(resizeSlide, 50);
  }

  // Parse markdown into slides
  function parseMarkdown(markdownText) {
    if (!markdownText) return;
    
    let workingText = markdownText.trim();
    
    // Check if the document starts with frontmatter
    if (workingText.startsWith('---')) {
      const endFrontmatter = workingText.indexOf('---', 3);
      if (endFrontmatter !== -1) {
        workingText = workingText.substring(endFrontmatter + 3).trim();
      }
    }
    
    // Split by page separators
    const rawSegments = workingText.split(/\n---\n|\r\n---\r\n/);
    slides = [];
    
    rawSegments.forEach((segment) => {
      let content = segment.trim();
      
      // Don't add completely empty slides
      if (content) {
        slides.push(content);
      }
    });

    if (currentSlideIndex >= slides.length) {
      currentSlideIndex = Math.max(0, slides.length - 1);
    }

    renderOutline();
    
    if (activeViewMode === 'grid') {
      renderGridView();
    } else {
      renderSlide(currentSlideIndex);
    }
  }

  // Render outline list (Sidebar navigation)
  function renderOutline() {
    slideOutlineList.innerHTML = '';
    const searchFilter = slideSearch.value.toLowerCase();
    
    slides.forEach((slideText, idx) => {
      // Get heading title from slide content
      let title = `Slide ${idx + 1}`;
      const headingMatch = slideText.match(/^#+\s+(.+)$/m);
      if (headingMatch && headingMatch[1]) {
        title = headingMatch[1].replace(/[\`*_\\[\]]/g, '').trim();
      }
      
      // Skip if search filter is active and title doesn't match
      if (searchFilter && !title.toLowerCase().includes(searchFilter) && !slideText.toLowerCase().includes(searchFilter)) {
        return;
      }
      
      const item = document.createElement('div');
      item.className = `slide-item-link ${idx === currentSlideIndex ? 'active' : ''}`;
      item.innerHTML = `
        <span class="slide-item-num">${idx + 1}</span>
        <div class="slide-item-info">
          <div class="slide-item-title">${title}</div>
        </div>
      `;
      
      item.addEventListener('click', () => {
        if (activeViewMode === 'grid') {
          setViewMode('present');
        }
        currentSlideIndex = idx;
        renderSlide(currentSlideIndex);
        
        // Highlight active outline item
        document.querySelectorAll('.slide-item-link').forEach(el => el.classList.remove('active'));
        item.classList.add('active');
      });
      
      slideOutlineList.appendChild(item);
    });
    
    // Lucide Icons reload
    lucide.createIcons();
  }

  // Parse speaker notes out of slide markdown
  function extractSpeakerNotes(slideMarkdown) {
    const notesRegex = /<!--\s*(?:notes|Notes:)?\s*([\s\S]*?)\s*-->/g;
    let match;
    let notes = [];
    
    while ((match = notesRegex.exec(slideMarkdown)) !== null) {
      notes.push(match[1].trim());
    }
    
    // Return combined notes or default message
    return notes.length > 0 
      ? marked.parse(notes.join('\n\n'))
      : '<p class="text-muted">No presenter notes recorded for this slide. Write them using HTML comments <code>&lt;!-- notes here --&gt;</code> in the editor.</p>';
  }

  // Clean markdown slide content by removing comment nodes (like notes) before rendering
  function cleanMarkdownForRender(slideMarkdown) {
    return slideMarkdown.replace(/<!--[\s\S]*?-->/g, '').trim();
  }

  // Render a specific slide
  function renderSlide(index) {
    if (slides.length === 0) return;
    
    currentSlideIndex = index;
    const slideText = slides[index];
    
    // Extract notes
    notesContent.innerHTML = extractSpeakerNotes(slideText);
    
    // Clean comments
    const cleanText = cleanMarkdownForRender(slideText);
    
    // Render slide HTML
    let slideHtml = marked.parse(cleanText);
    
    // Check for interactive diagram tags
    const lowerText = cleanText.toLowerCase();
    
    slideContentElement.innerHTML = slideHtml;
    
    // Inject Interactive Diagram if matched
    if (lowerText.includes('วงจรการทำงานของ git') || lowerText.includes('git workflows')) {
      const codeBlock = slideContentElement.querySelector('pre');
      if (codeBlock) {
        const diagContainer = document.createElement('div');
        diagContainer.id = 'git-flow-diag-container';
        codeBlock.replaceWith(diagContainer);
        Diagrams.renderGitFlow(diagContainer);
      }
    } else if (lowerText.includes('git branch simulator') || lowerText.includes('จำลองการทำงานของ branch')) {
      const codeBlock = slideContentElement.querySelector('pre');
      if (codeBlock) {
        const diagContainer = document.createElement('div');
        diagContainer.id = 'branch-simulator-container';
        codeBlock.replaceWith(diagContainer);
        Diagrams.renderBranchSimulator(diagContainer);
      }
    } else if (lowerText.includes('pull request') && lowerText.includes('[สร้าง feature branch]')) {
      const codeBlock = slideContentElement.querySelector('pre');
      if (codeBlock) {
        const diagContainer = document.createElement('div');
        diagContainer.id = 'pr-lifecycle-container';
        codeBlock.replaceWith(diagContainer);
        Diagrams.renderPRLifecycle(diagContainer);
      }
    } else if (lowerText.includes('pipeline') && lowerText.includes('[push โค้ด]')) {
      const codeBlock = slideContentElement.querySelector('pre');
      if (codeBlock) {
        const diagContainer = document.createElement('div');
        diagContainer.id = 'pipeline-dashboard-container';
        codeBlock.replaceWith(diagContainer);
        Diagrams.renderPipeline(diagContainer);
      }
    } else if (lowerText.includes('push-based vs. pull-based') || lowerText.includes('แบบ push: [git]')) {
      const codeBlock = slideContentElement.querySelector('pre');
      if (codeBlock) {
        const diagContainer = document.createElement('div');
        diagContainer.id = 'gitops-panel-container';
        codeBlock.replaceWith(diagContainer);
        Diagrams.renderGitOps(diagContainer);
      }
    }
    
    // Update footer slide info
    const headingMatch = cleanText.match(/^#+\s+(.+)$/m);
    let slideTitle = currentDeck ? currentDeck.name : 'เจาะลึก Git, DevOps & GitOps';
    if (headingMatch && headingMatch[1]) {
      slideTitle = headingMatch[1].replace(/[\`*_\\[\]]/g, '').trim();
    }
    footerLeft.innerText = slideTitle;
    footerRight.innerText = `Slide ${index + 1} / ${slides.length}`;
    
    // Update navigation indicators
    slideIndicatorText.innerText = `Slide ${index + 1} / ${slides.length}`;
    btnPrev.disabled = index === 0;
    btnNext.disabled = index === slides.length - 1;
    
    // Highlight outline active item
    document.querySelectorAll('.slide-item-link').forEach((el, idx) => {
      if (idx === index) {
        el.classList.add('active');
        el.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      } else {
        el.classList.remove('active');
      }
    });

    // Fit content & icons
    lucide.createIcons();
    
    // Ensure content auto-fitting is triggered
    fitContentToSlideBox();
  }

  // Auto-fit content script (Shrinks text size of overloaded slides to fit container)
  function fitContentToSlideBox() {
    // Reset font size
    slideContentElement.style.fontSize = '';
    
    // Slide container has vertical padding of 80px (40px top + 40px bottom)
    // plus footer takes about 40px
    const maxContentHeight = 540 - 120; 
    let currentSize = 20; // base font size in pixels
    slideContentElement.style.fontSize = `${currentSize}px`;
    
    // If text overflows, shrink font-size incrementally
    let iterations = 0;
    while (slideContentElement.scrollHeight > maxContentHeight && currentSize > 10 && iterations < 35) {
      currentSize -= 0.5;
      slideContentElement.style.fontSize = `${currentSize}px`;
      iterations++;
    }
    
    // Shrink spacing if it is still very tight
    if (slideContentElement.scrollHeight > maxContentHeight) {
      slideContentElement.style.lineHeight = '1.4';
    } else {
      slideContentElement.style.lineHeight = '';
    }
  }

  // Scaling Slide container to fit stage
  function resizeSlide() {
    if (activeViewMode === 'grid') return;
    
    const wrapperWidth = slideWrapper.clientWidth;
    const wrapperHeight = slideWrapper.clientHeight;
    
    const w = 960;
    const h = 540;
    
    const scale = Math.min(wrapperWidth / w, wrapperHeight / h) * 0.95; // 0.95 adds a safety margin
    slideBox.style.transform = `scale(${scale})`;
    slideBox.style.position = 'absolute';
  }

  // Render Grid overview mode
  function renderGridView() {
    stage.innerHTML = '';
    
    const gridContainer = document.createElement('div');
    gridContainer.className = 'grid-container';
    
    slides.forEach((slideText, idx) => {
      const cleanText = cleanMarkdownForRender(slideText);
      const slideHtml = marked.parse(cleanText);
      
      const thumb = document.createElement('div');
      thumb.className = `grid-slide-thumb ${idx === currentSlideIndex ? 'active' : ''}`;
      thumb.innerHTML = `
        <span class="grid-slide-num">${idx + 1}</span>
        <div class="grid-slide-content">
          ${slideHtml}
        </div>
      `;
      
      thumb.addEventListener('click', () => {
        currentSlideIndex = idx;
        setViewMode('present');
      });
      
      gridContainer.appendChild(thumb);
    });
    
    stage.appendChild(gridContainer);
    
    // Hide presenter notes in grid view
    presenterNotesBox.style.display = 'none';
  }

  // Save edits back to browser local storage and propose project saves
  function saveSlides() {
    rawMarkdown = textarea.value;
    parseMarkdown(rawMarkdown);
    
    // Optional alert
    const pathText = currentDeck ? currentDeck.path : 'slides file';
    alert(`Slides updated in viewer! Changes are rendered. You can copy the code or check ${pathText}`);
  }

  // Change active view mode
  function setViewMode(mode) {
    activeViewMode = mode;
    
    viewPresent.classList.remove('active');
    viewEditor.classList.remove('active');
    viewGrid.classList.remove('active');
    
    if (mode === 'present') {
      viewPresent.classList.add('active');
      sidebar.style.display = 'flex';
      editor.style.display = 'none';
      stage.innerHTML = `
        <!-- Slide Viewer Stage -->
        <div class="slide-view-container" id="slide-container">
          <div class="slide-wrapper" id="slide-wrapper">
            <div class="slide-box" id="slide-box">
              <div class="auto-fit-container">
                <div class="slide-content" id="slide-content"></div>
                <div class="slide-footer">
                  <span id="footer-left">เจาะลึก Git, DevOps & Jenkins</span>
                  <span id="footer-right">Page 1</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Bottom controls -->
        <div class="stage-controls">
          <div class="nav-buttons">
            <button class="nav-btn" id="btn-prev-slide">
              <i data-lucide="chevron-left"></i> Previous
            </button>
            <button class="nav-btn" id="btn-next-slide">
              Next <i data-lucide="chevron-right"></i>
            </button>
          </div>
          
          <div class="slide-indicator" id="slide-indicator-text">Slide 1 / 1</div>
          
          <div class="right-controls">
            <button class="fullscreen-btn" id="btn-fullscreen" title="Toggle Fullscreen">
              <i data-lucide="maximize-2"></i>
            </button>
          </div>
        </div>
        
        <!-- Speaker / Presenter Notes -->
        <div class="notes-panel" id="presenter-notes-box">
          <div class="notes-title"><i data-lucide="message-square-quote"></i> Speaker Notes</div>
          <div id="notes-content">Welcome to the presentation.</div>
        </div>
      `;
      
      // Re-assign stage nodes
      rebindStageNodes();
      renderSlide(currentSlideIndex);
      resizeSlide();
      presenterNotesBox.style.display = 'block';
    } 
    
    else if (mode === 'editor') {
      viewEditor.classList.add('active');
      sidebar.style.display = 'none';
      editor.style.display = 'flex';
      
      // Re-build stages just like presenter view
      stage.innerHTML = `
        <div class="slide-view-container" id="slide-container">
          <div class="slide-wrapper" id="slide-wrapper">
            <div class="slide-box" id="slide-box">
              <div class="auto-fit-container">
                <div class="slide-content" id="slide-content"></div>
                <div class="slide-footer">
                  <span id="footer-left">เจาะลึก Git, DevOps & Jenkins</span>
                  <span id="footer-right">Page 1</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="stage-controls">
          <div class="nav-buttons">
            <button class="nav-btn" id="btn-prev-slide">
              <i data-lucide="chevron-left"></i> Previous
            </button>
            <button class="nav-btn" id="btn-next-slide">
              Next <i data-lucide="chevron-right"></i>
            </button>
          </div>
          <div class="slide-indicator" id="slide-indicator-text">Slide 1 / 1</div>
          <div class="right-controls">
            <button class="fullscreen-btn" id="btn-fullscreen" title="Toggle Fullscreen">
              <i data-lucide="maximize-2"></i>
            </button>
          </div>
        </div>
        
        <div class="notes-panel" id="presenter-notes-box">
          <div class="notes-title"><i data-lucide="message-square-quote"></i> Speaker Notes</div>
          <div id="notes-content">Welcome to the presentation.</div>
        </div>
      `;
      
      rebindStageNodes();
      renderSlide(currentSlideIndex);
      resizeSlide();
      presenterNotesBox.style.display = 'block';
    } 
    
    else if (mode === 'grid') {
      viewGrid.classList.add('active');
      sidebar.style.display = 'flex';
      editor.style.display = 'none';
      renderGridView();
    }
    
    lucide.createIcons();
  }

  // Re-bind stage elements when stage HTML gets replaced
  function rebindStageNodes() {
    const localBtnPrev = document.getElementById('btn-prev-slide');
    const localBtnNext = document.getElementById('btn-next-slide');
    const localBtnFullscreen = document.getElementById('btn-fullscreen');
    
    if (localBtnPrev) {
      localBtnPrev.addEventListener('click', () => {
        if (currentSlideIndex > 0) renderSlide(currentSlideIndex - 1);
      });
    }
    if (localBtnNext) {
      localBtnNext.addEventListener('click', () => {
        if (currentSlideIndex < slides.length - 1) renderSlide(currentSlideIndex + 1);
      });
    }
    if (localBtnFullscreen) {
      localBtnFullscreen.addEventListener('click', toggleFullscreen);
    }
  }

  function toggleFullscreen() {
    const slideContainer = document.getElementById('slide-container');
    if (!document.fullscreenElement) {
      slideContainer.requestFullscreen()
        .then(() => {
          setTimeout(resizeSlide, 100);
        })
        .catch(err => {
          console.error(`Error attempting to enable fullscreen: ${err.message}`);
        });
    } else {
      document.exitFullscreen();
    }
  }

  // Event hookups
  function setupEvents() {
    // Navigation
    rebindStageNodes();

    // Deck selector
    if (deckSelect) {
      deckSelect.addEventListener('change', async (e) => {
        const deckId = e.target.value;
        const deck = PRESENTATION_DECKS.find(d => d.id === deckId);
        if (deck) {
          await loadDeck(deck);
        }
      });
    }

    // Theme selector
    themeSelect.addEventListener('change', (e) => {
      const newTheme = e.target.value;
      document.body.className = `theme-${newTheme}`;
      activeTheme = newTheme;
    });

    // View selector buttons
    viewPresent.addEventListener('click', () => setViewMode('present'));
    viewEditor.addEventListener('click', () => setViewMode('editor'));
    viewGrid.addEventListener('click', () => setViewMode('grid'));

    // Markdown text input changes (Live Editing)
    textarea.addEventListener('input', () => {
      rawMarkdown = textarea.value;
      // Re-parse and update slides, but stay on same index
      parseMarkdown(rawMarkdown);
    });

    // Search bar outline
    slideSearch.addEventListener('input', renderOutline);

    // Save button
    btnSaveMarkdown.addEventListener('click', saveSlides);

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      // Ignore if user is typing in textarea or search input
      if (document.activeElement === textarea || document.activeElement === slideSearch) {
        return;
      }
      
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
        if (currentSlideIndex < slides.length - 1) {
          renderSlide(currentSlideIndex + 1);
        }
        e.preventDefault();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        if (currentSlideIndex > 0) {
          renderSlide(currentSlideIndex - 1);
        }
        e.preventDefault();
      } else if (e.key === 'f' || e.key === 'F') {
        toggleFullscreen();
      }
    });

    // Handle browser window resize
    window.addEventListener('resize', () => {
      resizeSlide();
    });
    
    // Listen for exiting fullscreen to recalculate bounds
    document.addEventListener('fullscreenchange', () => {
      setTimeout(resizeSlide, 100);
    });
  }

  // Kick off application
  init();
});
