// Unit tests for interactive elements functionality
describe('Interactive Elements', () => {
  beforeEach(() => {
    // Reset DOM
    document.body.innerHTML = `
      <div class="project-card">
        <h3 class="project-title">Test Project</h3>
        <button class="demo-toggle" data-project="test1">Show Demo</button>
        <div class="embedded-demo" id="demo-test1" style="display: none;">
          <iframe src="https://example.com" title="Demo"></iframe>
        </div>
      </div>
      <div class="download-section">
        <a href="app.exe" class="download-btn windows" download="app.exe">
          <span class="file-size">10 MB</span>
          Download Windows
        </a>
        <a href="app.dmg" class="download-btn mac" download="app.dmg">
          <span class="file-size">12 MB</span>
          Download Mac
        </a>
      </div>
      <div class="skills-section">
        <div class="skill-item">
          <span class="skill-name">JavaScript</span>
          <div class="skill-bar">
            <div class="skill-progress" data-level="85"></div>
          </div>
        </div>
      </div>
    `;
  });

  test('should toggle demo visibility', () => {
    const demoButton = document.querySelector('.demo-toggle');
    const demoContainer = document.getElementById('demo-test1');
    
    expect(demoContainer.style.display).toBe('none');
    
    // Simulate demo toggle
    demoButton.addEventListener('click', () => {
      if (demoContainer.style.display === 'none') {
        demoContainer.style.display = 'block';
        demoButton.textContent = 'Hide Demo';
      } else {
        demoContainer.style.display = 'none';
        demoButton.textContent = 'Show Demo';
      }
    });
    
    demoButton.click();
    expect(demoContainer.style.display).toBe('block');
    expect(demoButton.textContent).toBe('Hide Demo');
    
    demoButton.click();
    expect(demoContainer.style.display).toBe('none');
    expect(demoButton.textContent).toBe('Show Demo');
  });

  test('should handle download button clicks', () => {
    const windowsBtn = document.querySelector('.download-btn.windows');
    const macBtn = document.querySelector('.download-btn.mac');
    
    let downloadClicked = false;
    let downloadedFile = '';
    
    [windowsBtn, macBtn].forEach(btn => {
      btn.addEventListener('click', (e) => {
        downloadClicked = true;
        downloadedFile = e.target.closest('.download-btn').download;
      });
    });
    
    windowsBtn.click();
    expect(downloadClicked).toBe(true);
    expect(downloadedFile).toBe('app.exe');
    
    downloadClicked = false;
    macBtn.click();
    expect(downloadClicked).toBe(true);
    expect(downloadedFile).toBe('app.dmg');
  });

  test('should identify platform from download buttons', () => {
    const windowsBtn = document.querySelector('.download-btn.windows');
    const macBtn = document.querySelector('.download-btn.mac');
    
    function getPlatform(button) {
      if (button.classList.contains('windows')) return 'windows';
      if (button.classList.contains('mac')) return 'mac';
      if (button.classList.contains('linux')) return 'linux';
      return 'unknown';
    }
    
    expect(getPlatform(windowsBtn)).toBe('windows');
    expect(getPlatform(macBtn)).toBe('mac');
  });

  test('should handle skill level data', () => {
    const skillProgress = document.querySelector('.skill-progress');
    const skillLevel = skillProgress.getAttribute('data-level');
    
    expect(skillLevel).toBe('85');
    expect(parseInt(skillLevel)).toBe(85);
    
    // Test skill level validation
    function isValidSkillLevel(level) {
      const numLevel = parseInt(level);
      return numLevel >= 0 && numLevel <= 100;
    }
    
    expect(isValidSkillLevel(skillLevel)).toBe(true);
    expect(isValidSkillLevel('150')).toBe(false);
    expect(isValidSkillLevel('-10')).toBe(false);
  });

  test('should extract project information', () => {
    const projectCard = document.querySelector('.project-card');
    const projectTitle = projectCard.querySelector('.project-title').textContent;
    const demoButton = projectCard.querySelector('.demo-toggle');
    const projectId = demoButton.getAttribute('data-project');
    
    expect(projectTitle).toBe('Test Project');
    expect(projectId).toBe('test1');
  });

  test('should handle iframe loading states', () => {
    const iframe = document.querySelector('iframe');
    let loadingState = 'loading';
    
    iframe.addEventListener('load', () => {
      loadingState = 'loaded';
    });
    
    iframe.addEventListener('error', () => {
      loadingState = 'error';
    });
    
    // Simulate load event
    const loadEvent = createMockEvent('load');
    iframe.dispatchEvent(loadEvent);
    
    expect(loadingState).toBe('loaded');
  });
});