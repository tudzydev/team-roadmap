// Diagrams module for interactive Git and DevOps visualizers
const Diagrams = {
  // Render Git Three Zones Flow
  renderGitFlow(container) {
    container.innerHTML = `
      <div class="diagram-card git-flow-diag">
        <div class="diag-header">
          <span>Interactive Git Zones Simulator</span>
          <button class="diag-btn reset-btn" id="git-reset-btn">Reset Simulator</button>
        </div>
        
        <div class="git-zones-grid">
          <!-- Working Directory -->
          <div class="git-zone-col" id="zone-working">
            <div class="zone-title working-title">Working Directory</div>
            <div class="zone-subtitle">Unstaged Changes (Disk)</div>
            <div class="zone-canvas" id="canvas-working">
              <div class="diag-file-item modified" id="file-draft">
                <i class="lucide-file-text"></i> index.js (Modified)
              </div>
            </div>
          </div>
          
          <!-- Staging Area -->
          <div class="git-zone-col" id="zone-staging">
            <div class="zone-title staging-title">Staging Area</div>
            <div class="zone-subtitle">Prepared index changes</div>
            <div class="zone-canvas" id="canvas-staging">
              <div class="empty-placeholder">Empty (Staging is clean)</div>
            </div>
          </div>
          
          <!-- Local Repository -->
          <div class="git-zone-col" id="zone-local">
            <div class="zone-title local-title">Local Repo (.git)</div>
            <div class="zone-subtitle">Committed History</div>
            <div class="zone-canvas" id="canvas-local">
              <div class="commits-list" id="local-commits">
                <div class="commit-node header-commit">HEAD -> main</div>
                <div class="commit-node base">commit: a3f8d2 (Initial)</div>
              </div>
            </div>
          </div>
          
          <!-- Remote Repository -->
          <div class="git-zone-col" id="zone-remote">
            <div class="zone-title remote-title">Remote Repo (GitHub)</div>
            <div class="zone-subtitle">Shared Source of Truth</div>
            <div class="zone-canvas" id="canvas-remote">
              <div class="commits-list" id="remote-commits">
                <div class="commit-node base">commit: a3f8d2 (Initial)</div>
              </div>
            </div>
          </div>
        </div>

        <div class="diag-actions">
          <button class="diag-btn action-btn" id="btn-git-add">1. Run "git add index.js"</button>
          <button class="diag-btn action-btn disabled" id="btn-git-commit" disabled>2. Run "git commit -m 'feat: login'"</button>
          <button class="diag-btn action-btn disabled" id="btn-git-push" disabled>3. Run "git push origin main"</button>
        </div>
        
        <div class="diag-logs" id="git-logs">
          <span class="log-prefix">System ready.</span> Modify files, add them to staging, commit, and push upstream!
        </div>
      </div>
    `;

    // Hook up elements
    const fileDraft = container.querySelector('#file-draft');
    const canvasWorking = container.querySelector('#canvas-working');
    const canvasStaging = container.querySelector('#canvas-staging');
    const localCommits = container.querySelector('#local-commits');
    const remoteCommits = container.querySelector('#remote-commits');
    
    const btnAdd = container.querySelector('#btn-git-add');
    const btnCommit = container.querySelector('#btn-git-commit');
    const btnPush = container.querySelector('#btn-git-push');
    const btnReset = container.querySelector('#git-reset-btn');
    const logs = container.querySelector('#git-logs');

    let state = 'modified'; // modified, staged, committed, pushed

    function updateLogs(command, description) {
      logs.innerHTML = `<span class="log-command">$ ${command}</span><br><span class="log-desc">${description}</span>`;
    }

    btnAdd.addEventListener('click', () => {
      if (state !== 'modified') return;
      
      canvasStaging.innerHTML = '';
      
      // Move file to Staging
      const stagedFile = document.createElement('div');
      stagedFile.className = 'diag-file-item staged';
      stagedFile.id = 'file-staged';
      stagedFile.innerHTML = '<i class="lucide-file-check"></i> index.js (Staged)';
      canvasStaging.appendChild(stagedFile);
      
      // Clear working directory placeholder
      canvasWorking.innerHTML = '<div class="empty-placeholder">Working directory clean</div>';
      
      state = 'staged';
      btnAdd.classList.add('disabled');
      btnAdd.disabled = true;
      btnCommit.classList.remove('disabled');
      btnCommit.disabled = false;
      
      updateLogs('git add index.js', 'Changes staged. index.js is now in the Index (Staging Area) and ready to be committed.');
    });

    btnCommit.addEventListener('click', () => {
      if (state !== 'staged') return;
      
      canvasStaging.innerHTML = '<div class="empty-placeholder">Staging area empty</div>';
      
      // Add Commit to Local Repository list
      const newCommit = document.createElement('div');
      newCommit.className = 'commit-node head-new';
      newCommit.innerHTML = 'commit: c9e2f5 (feat: login)';
      
      // Remove head tag from previous top, add to this one
      const oldHead = localCommits.querySelector('.header-commit');
      if (oldHead) oldHead.remove();
      
      const headLabel = document.createElement('div');
      headLabel.className = 'commit-node header-commit';
      headLabel.innerText = 'HEAD -> main';
      
      localCommits.prepend(headLabel);
      localCommits.insertBefore(newCommit, localCommits.children[1]);
      
      state = 'committed';
      btnCommit.classList.add('disabled');
      btnCommit.disabled = true;
      btnPush.classList.remove('disabled');
      btnPush.disabled = false;
      
      updateLogs('git commit -m "feat: login"', 'Commit recorded locally as c9e2f5. Local branch main is now 1 commit ahead of origin/main.');
    });

    btnPush.addEventListener('click', () => {
      if (state !== 'committed') return;
      
      // Add Commit to Remote Repository list
      const remoteNewCommit = document.createElement('div');
      remoteNewCommit.className = 'commit-node head-new';
      remoteNewCommit.innerHTML = 'commit: c9e2f5 (feat: login)';
      
      // Remove any heads and append
      remoteCommits.prepend(remoteNewCommit);
      
      state = 'pushed';
      btnPush.classList.add('disabled');
      btnPush.disabled = true;
      
      updateLogs('git push origin main', 'Changes pushed. Local commits uploaded to origin (GitHub). Branch main and origin/main are now in sync!');
    });

    btnReset.addEventListener('click', () => {
      state = 'modified';
      canvasWorking.innerHTML = `
        <div class="diag-file-item modified" id="file-draft">
          <i class="lucide-file-text"></i> index.js (Modified)
        </div>
      `;
      canvasStaging.innerHTML = '<div class="empty-placeholder">Empty (Staging is clean)</div>';
      
      localCommits.innerHTML = `
        <div class="commit-node header-commit">HEAD -> main</div>
        <div class="commit-node base">commit: a3f8d2 (Initial)</div>
      `;
      
      remoteCommits.innerHTML = `
        <div class="commit-node base">commit: a3f8d2 (Initial)</div>
      `;
      
      btnAdd.classList.remove('disabled');
      btnAdd.disabled = false;
      btnCommit.classList.add('disabled');
      btnCommit.disabled = true;
      btnPush.classList.add('disabled');
      btnPush.disabled = true;
      
      updateLogs('reset', 'Simulator reset. Workspace modified. Let\'s run "git add" again.');
    });
  },

  // Render Pull Request Timeline
  renderPRLifecycle(container) {
    const steps = [
      { name: 'Feature Branch', desc: 'Create a local branch from main and write your feature code.' },
      { name: 'Push to Remote', desc: 'Upload the branch to GitHub to make it available to the team.' },
      { name: 'Open Pull Request', desc: 'Create a PR on GitHub, describing changes, requesting reviews.' },
      { name: 'CI Pipeline Runs', desc: 'Automated workflow builds, lints, and tests your branch code.' },
      { name: 'Code Review', desc: 'Team reviews changes, comments, suggests improvements, and approves.' },
      { name: 'Merge to Main', desc: 'PR is merged, code is integrated into main, and deployed.' }
    ];

    let currentStep = 0;

    function render() {
      container.innerHTML = `
        <div class="diagram-card pr-timeline-card">
          <div class="diag-header">
            <span>Pull Request (PR) Lifecycle Timeline</span>
            <div class="step-counter">Step ${currentStep + 1} of ${steps.length}</div>
          </div>
          
          <div class="timeline-visual-container">
            <div class="timeline-track"></div>
            <div class="timeline-steps">
              ${steps.map((step, idx) => `
                <div class="timeline-node ${idx <= currentStep ? 'active' : ''} ${idx === currentStep ? 'current' : ''}" data-index="${idx}">
                  <div class="node-dot">${idx + 1}</div>
                  <div class="node-label">${step.name}</div>
                </div>
              `).join('')}
            </div>
          </div>
          
          <div class="timeline-detail-panel">
            <div class="detail-title">${steps[currentStep].name}</div>
            <div class="detail-description">${steps[currentStep].desc}</div>
            
            <div class="detail-animation-view">
              ${renderPRStepAnimation(currentStep)}
            </div>
          </div>
          
          <div class="diag-actions">
            <button class="diag-btn prev-btn ${currentStep === 0 ? 'disabled' : ''}" id="pr-prev-btn" ${currentStep === 0 ? 'disabled' : ''}>Previous Step</button>
            <button class="diag-btn next-btn ${currentStep === steps.length - 1 ? 'disabled' : ''}" id="pr-next-btn" ${currentStep === steps.length - 1 ? 'disabled' : ''}>Next Step</button>
          </div>
        </div>
      `;

      // Set up listeners
      container.querySelectorAll('.timeline-node').forEach(node => {
        node.addEventListener('click', () => {
          currentStep = parseInt(node.getAttribute('data-index'));
          render();
        });
      });

      container.querySelector('#pr-prev-btn').addEventListener('click', () => {
        if (currentStep > 0) {
          currentStep--;
          render();
        }
      });

      container.querySelector('#pr-next-btn').addEventListener('click', () => {
        if (currentStep < steps.length - 1) {
          currentStep++;
          render();
        }
      });
    }

    function renderPRStepAnimation(stepIndex) {
      switch(stepIndex) {
        case 0: // Feature Branch
          return `
            <div class="pr-anim-box">
              <div class="branch-line main-line"><span>main</span></div>
              <div class="branch-line feat-line animate-slide-in"><span>feature/login</span></div>
              <div class="commit-point animate-ping-small"></div>
            </div>
          `;
        case 1: // Push to Remote
          return `
            <div class="pr-anim-box split-row">
              <div class="device-box"><i class="lucide-laptop"></i> Local Machine</div>
              <div class="arrow-flow"><i class="lucide-arrow-right animate-flow-horizontal"></i></div>
              <div class="device-box github"><i class="lucide-github"></i> GitHub (origin)</div>
            </div>
          `;
        case 2: // Open Pull Request
          return `
            <div class="pr-anim-box">
              <div class="pr-card-element animate-fade-in">
                <div class="pr-card-head"><span class="badge open">Open</span> <strong>PR #14: Support JWT Login</strong></div>
                <div class="pr-card-body">Requesting merge of <code>feature/login</code> into <code>main</code></div>
              </div>
            </div>
          `;
        case 3: // CI Pipeline
          return `
            <div class="pr-anim-box flex-col">
              <div class="ci-runner-status">
                <i class="lucide-loader-2 animate-spin text-primary"></i>
                <span>GitHub Actions runner executing tests...</span>
              </div>
              <div class="mini-progress-bar"><div class="bar animate-progress-fill"></div></div>
            </div>
          `;
        case 4: // Code Review
          return `
            <div class="pr-anim-box comments-stack">
              <div class="comment-bubble user-a"><strong>@reviewer_oak</strong>: Code looks clean, but check if password hashing works.</div>
              <div class="comment-bubble user-b animate-slide-up"><strong>@dev_sommai</strong>: Fixed! Pushed updated hash algorithm.</div>
              <div class="approval-badge animate-scale-up"><i class="lucide-check-circle"></i> Approved</div>
            </div>
          `;
        case 5: // Merge to Main
          return `
            <div class="pr-anim-box">
              <div class="branch-merge-diagram">
                <div class="branch-label">feature/login</div>
                <div class="merge-arrow"><i class="lucide-corner-down-right"></i></div>
                <div class="branch-label main-dest animate-highlight">main (Merged!)</div>
              </div>
              <div class="success-confetti">🎉 Merge successful!</div>
            </div>
          `;
        default:
          return '';
      }
    }

    render();
  },

  // Render CI/CD Pipeline Board
  renderPipeline(container) {
    let pipelineState = 'idle'; // idle, running, approval, completed
    let activeStep = -1;
    let stepStatuses = ['pending', 'pending', 'pending', 'pending', 'pending'];
    let logs = ['Pipeline ready to trigger. Click "Run CI/CD Pipeline" button.'];

    const stages = [
      { name: 'Code Lint', icon: 'lucide-code-2', runMsg: 'Checking code styling & formats...' },
      { name: 'Unit Tests', icon: 'lucide-test-tube', runMsg: 'Running Jest test suites...' },
      { name: 'Docker Build', icon: 'lucide-container', runMsg: 'Compiling Docker container image...' },
      { name: 'Deploy Staging', icon: 'lucide-server', runMsg: 'Publishing artifact to staging server...' },
      { name: 'Deploy Prod', icon: 'lucide-rocket', runMsg: 'Deploying release to Kubernetes cluster...' }
    ];

    function addLog(msg) {
      logs.push(msg);
      // Keep only last 5 logs
      if (logs.length > 5) logs.shift();
    }

    function render() {
      container.innerHTML = `
        <div class="diagram-card pipeline-card">
          <div class="diag-header">
            <span>CI/CD Pipeline Dashboard</span>
            <div class="pipeline-status-badge ${pipelineState}">${pipelineState.toUpperCase()}</div>
          </div>
          
          <div class="pipeline-board-grid">
            ${stages.map((stage, idx) => `
              <div class="pipeline-stage-card ${idx === activeStep ? 'active-run' : ''} status-${stepStatuses[idx]}" id="stage-${idx}">
                <div class="stage-icon-box">
                  <i class="${stage.icon}"></i>
                </div>
                <div class="stage-name">${stage.name}</div>
                <div class="stage-status-label">${stepStatuses[idx].toUpperCase()}</div>
                ${idx === activeStep && pipelineState === 'running' ? '<div class="stage-loader-line"></div>' : ''}
              </div>
              ${idx < stages.length - 1 ? '<div class="stage-connector-arrow"><i class="lucide-chevron-right"></i></div>' : ''}
            `).join('')}
          </div>
          
          <div class="pipeline-console">
            <div class="console-head">Console Logs</div>
            <div class="console-body" id="pipeline-logs">
              ${logs.map(log => `<div class="console-line">${log}</div>`).join('')}
            </div>
          </div>
          
          <div class="diag-actions">
            ${renderPipelineActions()}
          </div>
        </div>
      `;

      bindEvents();
    }

    function renderPipelineActions() {
      if (pipelineState === 'idle') {
        return `<button class="diag-btn run-btn" id="btn-trigger-pipeline"><i class="lucide-play"></i> Run CI/CD Pipeline</button>`;
      } else if (pipelineState === 'running') {
        return `<button class="diag-btn run-btn disabled" disabled><i class="lucide-loader-2 animate-spin"></i> Running pipeline...</button>`;
      } else if (pipelineState === 'approval') {
        return `
          <div class="approval-panel-actions">
            <span class="warning-text animate-pulse"><i class="lucide-shield-alert"></i> Production Deployment Requires Security Approval!</span>
            <div class="btn-row">
              <button class="diag-btn approve-btn" id="btn-approve-prod"><i class="lucide-check"></i> Approve & Deploy</button>
              <button class="diag-btn reject-btn" id="btn-reject-prod"><i class="lucide-x"></i> Reject</button>
            </div>
          </div>
        `;
      } else if (pipelineState === 'completed') {
        return `<button class="diag-btn reset-btn" id="btn-reset-pipeline">Reset Dashboard</button>`;
      }
    }

    function runPipeline() {
      pipelineState = 'running';
      activeStep = 0;
      stepStatuses = ['running', 'pending', 'pending', 'pending', 'pending'];
      logs = [];
      addLog('🚀 Triggering pipeline for commit hash: #c9e2f5...');
      render();

      executeStep(0);
    }

    function executeStep(stepIndex) {
      if (stepIndex >= stages.length) return;
      
      const currentStage = stages[stepIndex];
      addLog(`[RUNNING] ${currentStage.name}: ${currentStage.runMsg}`);
      
      let delay = 1800; // Simulated time
      
      setTimeout(() => {
        // Step completes
        stepStatuses[stepIndex] = 'success';
        addLog(`[SUCCESS] ${currentStage.name} passed successfully!`);
        
        if (stepIndex === 3) {
          // Staging successfully deployed, now requires Production approval (Continuous Delivery gate)
          pipelineState = 'approval';
          activeStep = 4;
          stepStatuses[4] = 'waiting';
          addLog(`⚠️ [CD GATE] Staging deployment successful. Ready for Production. Waiting for manual approval...`);
          render();
        } else if (stepIndex === 4) {
          // Finished prod
          pipelineState = 'completed';
          activeStep = -1;
          addLog(`🎉 [DEPLOYED] Release successfully deployed to Kubernetes production environment. Pipeline complete!`);
          render();
        } else {
          // Move to next step
          activeStep = stepIndex + 1;
          stepStatuses[activeStep] = 'running';
          render();
          executeStep(activeStep);
        }
      }, delay);
    }

    function bindEvents() {
      const btnTrigger = container.querySelector('#btn-trigger-pipeline');
      if (btnTrigger) {
        btnTrigger.addEventListener('click', runPipeline);
      }

      const btnApprove = container.querySelector('#btn-approve-prod');
      if (btnApprove) {
        btnApprove.addEventListener('click', () => {
          pipelineState = 'running';
          activeStep = 4;
          stepStatuses[4] = 'running';
          addLog(`✅ Production deployment approved by Administrator. Triggering deploy runner...`);
          render();
          executeStep(4);
        });
      }

      const btnReject = container.querySelector('#btn-reject-prod');
      if (btnReject) {
        btnReject.addEventListener('click', () => {
          pipelineState = 'completed';
          activeStep = -1;
          stepStatuses[4] = 'failed';
          addLog(`❌ Deployment rejected by Administrator. Production deploy aborted.`);
          render();
        });
      }

      const btnReset = container.querySelector('#btn-reset-pipeline');
      if (btnReset) {
        btnReset.addEventListener('click', () => {
          pipelineState = 'idle';
          activeStep = -1;
          stepStatuses = ['pending', 'pending', 'pending', 'pending', 'pending'];
          logs = ['Pipeline ready to trigger. Click "Run CI/CD Pipeline" button.'];
          render();
        });
      }
    }

    render();
  },

  // Render Git Branching Simulator
  renderBranchSimulator(container) {
    let commits = [
      { id: 'c1', branch: 'main', label: 'C1: Initial commit', hash: '5f92d1a', parents: [] },
      { id: 'c2', branch: 'main', label: 'C2: feat: init develop', hash: '2e81b4c', parents: ['c1'] },
      { id: 'c3', branch: 'develop', label: 'C3: chore: setup project configs', hash: '8d42a1f', parents: ['c2'] }
    ];
    let activeBranch = 'develop';
    let featureActive = false;
    let featureMerged = false;
    let releaseCreated = false;
    let logs = [
      'Initialized repository with main branch.',
      'Branched develop from main (C2).',
      'Switched to develop and committed C3.'
    ];

    function addLog(cmd, output) {
      logs.push(`<span class="log-cmd">$ ${cmd}</span>`);
      if (output) {
        logs.push(`<span class="log-out">${output}</span>`);
      }
      if (logs.length > 15) {
        logs.shift();
      }
    }

    function render() {
      const yCoords = { main: 60, develop: 140, feature: 220 };
      const xStep = 70;
      commits.forEach((c, idx) => {
        c.x = 60 + idx * xStep;
        c.y = yCoords[c.branch];
      });

      let linesHtml = '';
      commits.forEach(c => {
        c.parents.forEach(pId => {
          const p = commits.find(x => x.id === pId);
          if (p) {
            if (p.y === c.y) {
              linesHtml += `<line x1="${p.x}" y1="${p.y}" x2="${c.x}" y2="${c.y}" stroke="#57606a" stroke-width="3" />`;
            } else {
              const midX = (p.x + c.x) / 2;
              linesHtml += `<path d="M ${p.x} ${p.y} C ${midX} ${p.y}, ${midX} ${c.y}, ${c.x} ${c.y}" fill="none" stroke="#8c95a0" stroke-width="3" stroke-dasharray="2,2" />`;
            }
          }
        });
      });

      const colors = { main: '#0969da', develop: '#2da44e', feature: '#bf3989' };
      let nodesHtml = '';
      commits.forEach(c => {
        const isActive = (c.id === commits[commits.length - 1].id);
        const radius = isActive ? 12 : 9;
        const color = colors[c.branch];
        nodesHtml += `
          <g class="commit-node" cursor="pointer">
            <circle cx="${c.x}" cy="${c.y}" r="${radius}" fill="${color}" stroke="#ffffff" stroke-width="2" />
            <title>${c.label} (${c.hash})</title>
            <text x="${c.x}" y="${c.y - 18}" font-family="monospace" font-size="10" fill="#24292f" text-anchor="middle" font-weight="bold">${c.hash}</text>
          </g>
        `;
      });

      const canCommitDevelop = activeBranch === 'develop' && !releaseCreated;
      const canCreateFeature = !featureActive && !featureMerged && !releaseCreated;
      const canCommitFeature = featureActive && activeBranch === 'feature';
      const canMergeFeature = featureActive && !featureMerged;
      const canRelease = activeBranch === 'develop' && featureMerged && !releaseCreated;

      container.innerHTML = `
        <div class="diagram-card branch-sim-card" style="box-shadow: 0 4px 12px rgba(0,0,0,0.08); border-radius: 8px; border: 1px solid #d0d7de; background: #ffffff; padding: 16px;">
          <div class="diag-header" style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #d0d7de; padding-bottom: 8px; margin-bottom: 12px;">
            <span style="font-weight: bold; font-size: 14px; color: #24292f;">Git Branching & Merging Interactive Simulator</span>
            <div class="active-branch-badge" style="font-size: 12px; color: #57606a;">Active Branch: <strong style="color: ${colors[activeBranch]}">${activeBranch}</strong></div>
          </div>
          
          <div class="sim-workspace">
            <div class="sim-svg-container" style="overflow-x: auto; background: #f6f8fa; padding: 10px; border-radius: 6px; border: 1px solid #d0d7de; margin-bottom: 10px;">
              <svg width="${Math.max(760, 100 + commits.length * xStep)}" height="280">
                <text x="15" y="64" font-family="sans-serif" font-size="11" fill="#57606a" font-weight="bold">main (prod)</text>
                <text x="15" y="144" font-family="sans-serif" font-size="11" fill="#57606a" font-weight="bold">develop</text>
                <text x="15" y="224" font-family="sans-serif" font-size="11" fill="#57606a" font-weight="bold">feature/login</text>
                
                <line x1="100" y1="60" x2="${Math.max(760, 80 + commits.length * xStep)}" y2="60" stroke="#d0d7de" stroke-dasharray="4" />
                <line x1="100" y1="140" x2="${Math.max(760, 80 + commits.length * xStep)}" y2="140" stroke="#d0d7de" stroke-dasharray="4" />
                <line x1="100" y1="220" x2="${Math.max(760, 80 + commits.length * xStep)}" y2="220" stroke="#d0d7de" stroke-dasharray="4" />
                
                ${linesHtml}
                ${nodesHtml}
              </svg>
            </div>
            
            <div class="sim-controls" style="display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 12px;">
              <button class="diag-btn" id="btn-commit-dev" ${canCommitDevelop ? '' : 'disabled'}>Commit on develop</button>
              <button class="diag-btn" id="btn-create-feat" ${canCreateFeature ? '' : 'disabled'} style="background: #bf3989; color: #fff; border: none;">Create feature/login</button>
              <button class="diag-btn" id="btn-commit-feat" ${canCommitFeature ? '' : 'disabled'} style="border-color: #bf3989; color: #bf3989; background: transparent;">Commit on feature</button>
              <button class="diag-btn" id="btn-merge-feat" ${canMergeFeature ? '' : 'disabled'} style="background: #2da44e; color: #fff; border: none;">Merge Feature (PR)</button>
              <button class="diag-btn" id="btn-release" ${canRelease ? '' : 'disabled'} style="background: #0969da; color: #fff; border: none;">Create Release v1.0.0</button>
              <button class="diag-btn reset-btn" id="btn-sim-reset" style="background: #f6f8fa; border: 1px solid #d0d7de;">Reset</button>
            </div>

            <div class="sim-terminal" style="background: #0f1419; color: #3df294; font-family: monospace; font-size: 11px; padding: 12px; border-radius: 6px; height: 120px; overflow-y: auto;">
              <div style="color: #8c95a0; margin-bottom: 4px; border-bottom: 1px dashed #24292f; padding-bottom: 2px;">Git Bash Terminal logs:</div>
              ${logs.join('<br>')}
            </div>
          </div>
        </div>
      `;

      const term = container.querySelector('.sim-terminal');
      if (term) term.scrollTop = term.scrollHeight;

      const btnCommitDev = container.querySelector('#btn-commit-dev');
      if (btnCommitDev && canCommitDevelop) {
        btnCommitDev.addEventListener('click', () => {
          const parentDev = commits.filter(x => x.branch === 'develop').pop();
          const newId = 'c' + (commits.length + 1);
          const hash = Math.random().toString(16).substring(2, 9);
          commits.push({
            id: newId,
            branch: 'develop',
            label: `C${commits.length + 1}: feat: update develop branch`,
            hash: hash,
            parents: [parentDev.id]
          });
          addLog('git commit -m "feat: add business logic to develop"', `[develop ${hash}] feat: add business logic to develop`);
          render();
        });
      }

      const btnCreateFeat = container.querySelector('#btn-create-feat');
      if (btnCreateFeat && canCreateFeature) {
        btnCreateFeat.addEventListener('click', () => {
          const parentDev = commits.filter(x => x.branch === 'develop').pop();
          const newId = 'c' + (commits.length + 1);
          const hash = Math.random().toString(16).substring(2, 9);
          commits.push({
            id: newId,
            branch: 'feature',
            label: `C${commits.length + 1}: feat: initiate login page`,
            hash: hash,
            parents: [parentDev.id]
          });
          activeBranch = 'feature';
          featureActive = true;
          addLog('git switch -c feature/login', `Switched to a new branch 'feature/login'`);
          addLog('git commit -m "feat: initiate login UI page"', `[feature/login ${hash}] feat: initiate login UI page`);
          render();
        });
      }

      const btnCommitFeat = container.querySelector('#btn-commit-feat');
      if (btnCommitFeat && canCommitFeature) {
        btnCommitFeat.addEventListener('click', () => {
          const parentFeat = commits.filter(x => x.branch === 'feature').pop();
          const newId = 'c' + (commits.length + 1);
          const hash = Math.random().toString(16).substring(2, 9);
          commits.push({
            id: newId,
            branch: 'feature',
            label: `C${commits.length + 1}: feat: support login validations`,
            hash: hash,
            parents: [parentFeat.id]
          });
          addLog('git commit -m "feat: support input validations"', `[feature/login ${hash}] feat: support input validations`);
          render();
        });
      }

      const btnMergeFeat = container.querySelector('#btn-merge-feat');
      if (btnMergeFeat && canMergeFeature) {
        btnMergeFeat.addEventListener('click', () => {
          const parentDev = commits.filter(x => x.branch === 'develop').pop();
          const parentFeat = commits.filter(x => x.branch === 'feature').pop();
          const newId = 'c' + (commits.length + 1);
          const hash = Math.random().toString(16).substring(2, 9);
          commits.push({
            id: newId,
            branch: 'develop',
            label: `Merge Pull Request #1 from feature/login`,
            hash: hash,
            parents: [parentDev.id, parentFeat.id]
          });
          activeBranch = 'develop';
          featureActive = false;
          featureMerged = true;
          addLog('git switch develop && git merge feature/login --no-ff', 
            `Merge made by the 'recursive' strategy.<br>[develop ${hash}] Merge Pull Request #1 from feature/login`);
          render();
        });
      }

      const btnRelease = container.querySelector('#btn-release');
      if (btnRelease && canRelease) {
        btnRelease.addEventListener('click', () => {
          const parentMain = commits.filter(x => x.branch === 'main').pop();
          const parentDev = commits.filter(x => x.branch === 'develop').pop();
          const newId = 'c' + (commits.length + 1);
          const hash = Math.random().toString(16).substring(2, 9);
          commits.push({
            id: newId,
            branch: 'main',
            label: `Release version v1.0.0`,
            hash: hash,
            parents: [parentMain.id, parentDev.id]
          });
          activeBranch = 'main';
          releaseCreated = true;
          addLog('git switch main && git merge develop --no-ff', `[main ${hash}] Merge branch 'develop' into main`);
          addLog('git tag -a v1.0.0 -m "Release production version 1.0.0"', `Tagged commit ${hash} as v1.0.0`);
          render();
        });
      }

      const btnReset = container.querySelector('#btn-sim-reset');
      if (btnReset) {
        btnReset.addEventListener('click', () => {
          commits = [
            { id: 'c1', branch: 'main', label: 'C1: Initial commit', hash: '5f92d1a', parents: [] },
            { id: 'c2', branch: 'main', label: 'C2: feat: init develop', hash: '2e81b4c', parents: ['c1'] },
            { id: 'c3', branch: 'develop', label: 'C3: chore: setup project configs', hash: '8d42a1f', parents: ['c2'] }
          ];
          activeBranch = 'develop';
          featureActive = false;
          featureMerged = false;
          releaseCreated = false;
          logs = [
            'Initialized repository with main branch.',
            'Branched develop from main (C2).',
            'Switched to develop and committed C3.'
          ];
          render();
        });
      }
    }

    render();
  },

  // Render GitOps Push vs Pull Panel
  renderGitOps(container) {
    let activeMode = 'push'; // push, pull
    let k8sState = 'v1.0.0';
    let gitState = 'v1.0.0';
    let driftStatus = 'in-sync'; // in-sync, drifted

    function render() {
      container.innerHTML = `
        <div class="diagram-card gitops-card">
          <div class="diag-header">
            <span>GitOps Deployment Architectures</span>
            <div class="mode-tabs">
              <button class="mode-tab-btn ${activeMode === 'push' ? 'active' : ''}" data-mode="push">Push-Based (CI Runner)</button>
              <button class="mode-tab-btn ${activeMode === 'pull' ? 'active' : ''}" data-mode="pull">Pull-Based (GitOps Agent)</button>
            </div>
          </div>
          
          <div class="gitops-diagram-stage">
            <div class="split-columns">
              <!-- Git Repository -->
              <div class="gitops-actor-box git-actor">
                <div class="actor-icon"><i class="lucide-github"></i></div>
                <div class="actor-title">Git Repository</div>
                <div class="state-badge">Desired State: <strong>${gitState}</strong></div>
              </div>
              
              <!-- Intermediate Actor -->
              ${renderMiddleActor()}
              
              <!-- Kubernetes Cluster -->
              <div class="gitops-actor-box k8s-actor ${driftStatus === 'drifted' ? 'drifted' : 'synced'}">
                <div class="actor-icon"><i class="lucide-container-node"></i></div>
                <div class="actor-title">Kubernetes Cluster</div>
                <div class="state-badge">Running State: <strong>${k8sState}</strong></div>
                ${driftStatus === 'drifted' ? '<div class="warning-alert animate-pulse"><i class="lucide-triangle-alert"></i> State Drifted!</div>' : '<div class="sync-alert"><i class="lucide-check-circle-2"></i> In Sync</div>'}
              </div>
            </div>
          </div>

          <div class="diag-actions flex-wrap gap-10">
            <button class="diag-btn action-btn" id="btn-update-git">1. Update Git Config to v1.1.0</button>
            <button class="diag-btn action-btn" id="btn-manual-drift">2. Manually Hack K8s to v2.0.0-hack</button>
            <button class="diag-btn reset-btn" id="btn-gitops-reset">Reset</button>
          </div>

          <div class="diag-explain-box">
            ${getExplanation()}
          </div>
        </div>
      `;

      bindEvents();
    }

    function renderMiddleActor() {
      if (activeMode === 'push') {
        return `
          <div class="connector-flow-path">
            <div class="flow-line">
              <div class="agent-label">CI Runner (GHA)</div>
              <div class="flow-action">Runs "kubectl apply"</div>
              <div class="flow-arrow push-flow"><i class="lucide-arrow-right animate-flow-horizontal"></i></div>
            </div>
          </div>
        `;
      } else {
        // pull
        return `
          <div class="connector-flow-path">
            <div class="flow-line flex-col justify-center align-center">
              <div class="agent-avatar animate-pulse-border"><i class="lucide-refresh-cw animate-spin-slow"></i> ArgoCD Agent</div>
              <div class="agent-details">
                <span class="flow-arrow pull-flow"><i class="lucide-arrow-left animate-flow-horizontal-reverse"></i> Polls Git</span>
                <span class="flow-arrow sync-flow"><i class="lucide-arrow-right animate-flow-horizontal"></i> Reconciles K8s</span>
              </div>
            </div>
          </div>
        `;
      }
    }

    function getExplanation() {
      if (activeMode === 'push') {
        return `
          <strong>Push-Based (CI/CD Deploy)</strong>:<br>
          When you update Git, the CI runner pushes manifests to Kubernetes using administrative credentials.
          <br><span class="highlight-warn">Drift vulnerability</span>: If you manually hack Kubernetes, the system remains drifted because GHA only runs on event push. It will not fix out-of-band modifications automatically.
        `;
      } else {
        return `
          <strong>Pull-Based (GitOps / ArgoCD)</strong>:<br>
          An agent (like ArgoCD) runs <em>inside</em> the cluster, continuously comparing cluster state with Git.
          <br><span class="highlight-success">Auto-Reconciliation</span>: If you manually hack Kubernetes, the agent detects the state drift immediately and syncs the cluster back to match Git's state within seconds!
        `;
      }
    }

    function bindEvents() {
      container.querySelectorAll('.mode-tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          activeMode = btn.getAttribute('data-mode');
          resetState();
        });
      });

      const btnUpdateGit = container.querySelector('#btn-update-git');
      if (btnUpdateGit) {
        btnUpdateGit.addEventListener('click', () => {
          gitState = 'v1.1.0';
          if (activeMode === 'push') {
            // Push triggers and deploys
            setTimeout(() => {
              k8sState = 'v1.1.0';
              driftStatus = 'in-sync';
              render();
            }, 1000);
          } else {
            // Pull agent pulls and reconciles
            setTimeout(() => {
              k8sState = 'v1.1.0';
              driftStatus = 'in-sync';
              render();
            }, 1200);
          }
          render();
        });
      }

      const btnManualDrift = container.querySelector('#btn-manual-drift');
      if (btnManualDrift) {
        btnManualDrift.addEventListener('click', () => {
          k8sState = 'v2.0.0-hack';
          driftStatus = 'drifted';
          
          if (activeMode === 'pull') {
            // ArgoCD agent immediately detects and reverts to Git state
            setTimeout(() => {
              k8sState = gitState; // revert back
              driftStatus = 'in-sync';
              render();
            }, 2000);
          }
          render();
        });
      }

      const btnReset = container.querySelector('#btn-gitops-reset');
      if (btnReset) {
        btnReset.addEventListener('click', resetState);
      }
    }

    function resetState() {
      k8sState = 'v1.0.0';
      gitState = 'v1.0.0';
      driftStatus = 'in-sync';
      render();
    }

    render();
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = Diagrams;
}
