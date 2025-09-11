// Keyboard Navigation Testing Suite
// Tests keyboard accessibility and navigation patterns

class KeyboardNavigationTester {
    constructor() {
        this.testResults = [];
        this.currentTest = null;
        this.focusableElements = [];
        this.tabOrder = [];
    }

    // Run all keyboard navigation tests
    runTests() {
        console.log('🎹 Starting keyboard navigation tests...');
        
        this.testResults = [];
        
        this.testFocusableElements();
        this.testTabOrder();
        this.testKeyboardTraps();
        this.testSkipLinks();
        this.testCustomKeyboardHandlers();
        this.testArrowKeyNavigation();
        this.testEscapeKeyHandling();
        this.testEnterSpaceActivation();
        this.testFocusManagement();
        
        this.generateReport();
        return this.testResults;
    }

    // Test 1: Identify all focusable elements
    testFocusableElements() {
        this.currentTest = 'Focusable Elements Detection';
        
        const focusableSelectors = [
            'a[href]',
            'button:not([disabled])',
            'input:not([disabled]):not([type="hidden"])',
            'textarea:not([disabled])',
            'select:not([disabled])',
            '[tabindex]:not([tabindex="-1"])',
            'details',
            'iframe',
            '[contenteditable="true"]'
        ];

        this.focusableElements = [];
        
        focusableSelectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                if (this.isVisible(element) && !this.isDisabled(element)) {
                    this.focusableElements.push({
                        element: element,
                        selector: selector,
                        tagName: element.tagName.toLowerCase(),
                        id: element.id || '',
                        className: element.className || '',
                        tabIndex: element.tabIndex,
                        ariaLabel: element.getAttribute('aria-label') || '',
                        text: this.getElementText(element)
                    });
                }
            });
        });

        this.testResults.push({
            test: this.currentTest,
            status: 'info',
            message: `Found ${this.focusableElements.length} focusable elements`,
            details: this.focusableElements.map(item => ({
                element: item.element,
                description: `${item.tagName}${item.id ? '#' + item.id : ''}${item.className ? '.' + item.className.split(' ')[0] : ''} - "${item.text.substring(0, 50)}${item.text.length > 50 ? '...' : ''}"`
            }))
        });

        // Check for elements that should be focusable but aren't
        const interactiveElements = document.querySelectorAll('[onclick], [role="button"], [role="link"], [role="menuitem"]');
        const nonFocusableInteractive = [];
        
        interactiveElements.forEach(element => {
            if (!this.focusableElements.some(item => item.element === element) && 
                this.isVisible(element) && 
                !element.matches('button, a[href], input, textarea, select')) {
                nonFocusableInteractive.push(element);
            }
        });

        if (nonFocusableInteractive.length > 0) {
            this.testResults.push({
                test: 'Interactive Elements Without Focus',
                status: 'warning',
                message: `Found ${nonFocusableInteractive.length} interactive elements that may not be keyboard accessible`,
                details: nonFocusableInteractive.map(element => ({
                    element: element,
                    description: `${element.tagName.toLowerCase()} with interactive behavior but no tabindex`
                }))
            });
        }
    }

    // Test 2: Validate tab order
    testTabOrder() {
        this.currentTest = 'Tab Order Validation';
        
        // Sort elements by their position in the DOM and tabindex
        this.tabOrder = [...this.focusableElements].sort((a, b) => {
            // Elements with positive tabindex come first, sorted by tabindex value
            if (a.tabIndex > 0 && b.tabIndex > 0) {
                return a.tabIndex - b.tabIndex;
            }
            if (a.tabIndex > 0) return -1;
            if (b.tabIndex > 0) return 1;
            
            // Then elements with tabindex 0 or no tabindex, in DOM order
            const aPosition = this.getElementPosition(a.element);
            const bPosition = this.getElementPosition(b.element);
            return aPosition - bPosition;
        });

        // Check for positive tabindex values (anti-pattern)
        const positiveTabIndexElements = this.focusableElements.filter(item => item.tabIndex > 0);
        if (positiveTabIndexElements.length > 0) {
            this.testResults.push({
                test: 'Positive TabIndex Usage',
                status: 'warning',
                message: `Found ${positiveTabIndexElements.length} elements with positive tabindex values`,
                details: positiveTabIndexElements.map(item => ({
                    element: item.element,
                    description: `${item.tagName} has tabindex="${item.tabIndex}" - consider using tabindex="0" instead`
                }))
            });
        }

        // Check for logical tab order
        const visualOrder = this.getVisualOrder(this.focusableElements);
        const tabOrderMismatches = [];
        
        for (let i = 0; i < Math.min(visualOrder.length, this.tabOrder.length); i++) {
            if (visualOrder[i].element !== this.tabOrder[i].element) {
                tabOrderMismatches.push({
                    visual: visualOrder[i],
                    tab: this.tabOrder[i],
                    position: i
                });
            }
        }

        if (tabOrderMismatches.length > 0) {
            this.testResults.push({
                test: 'Tab Order vs Visual Order',
                status: 'warning',
                message: `Tab order may not match visual order in ${tabOrderMismatches.length} cases`,
                details: tabOrderMismatches.slice(0, 5).map(mismatch => ({
                    element: mismatch.tab.element,
                    description: `Position ${mismatch.position}: Tab order has ${mismatch.tab.tagName}, visual order suggests ${mismatch.visual.tagName}`
                }))
            });
        } else {
            this.testResults.push({
                test: 'Tab Order Validation',
                status: 'pass',
                message: 'Tab order appears to match visual order'
            });
        }
    }

    // Test 3: Check for keyboard traps
    testKeyboardTraps() {
        this.currentTest = 'Keyboard Trap Detection';
        
        // Look for modal dialogs and other potential traps
        const modalElements = document.querySelectorAll('[role="dialog"], [role="alertdialog"], .modal, .popup');
        const trapElements = [];

        modalElements.forEach(modal => {
            if (this.isVisible(modal)) {
                const focusableInModal = modal.querySelectorAll(
                    'a[href], button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
                );
                
                if (focusableInModal.length > 0) {
                    trapElements.push({
                        element: modal,
                        focusableCount: focusableInModal.length,
                        hasTrapLogic: this.checkForTrapLogic(modal)
                    });
                }
            }
        });

        if (trapElements.length > 0) {
            const trapsWithoutLogic = trapElements.filter(trap => !trap.hasTrapLogic);
            if (trapsWithoutLogic.length > 0) {
                this.testResults.push({
                    test: 'Keyboard Trap Implementation',
                    status: 'warning',
                    message: `Found ${trapsWithoutLogic.length} modal(s) that may not properly trap focus`,
                    details: trapsWithoutLogic.map(trap => ({
                        element: trap.element,
                        description: `Modal with ${trap.focusableCount} focusable elements may need focus trap implementation`
                    }))
                });
            } else {
                this.testResults.push({
                    test: 'Keyboard Trap Implementation',
                    status: 'pass',
                    message: 'Modal elements appear to have proper focus management'
                });
            }
        } else {
            this.testResults.push({
                test: 'Keyboard Trap Detection',
                status: 'info',
                message: 'No modal elements found that require focus trapping'
            });
        }
    }

    // Test 4: Test skip links
    testSkipLinks() {
        this.currentTest = 'Skip Link Functionality';
        
        const skipLinks = document.querySelectorAll('a[href^="#"]:first-child, .skip-link, [class*="skip"]');
        const workingSkipLinks = [];
        const brokenSkipLinks = [];

        skipLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                const targetId = href.substring(1);
                const target = document.getElementById(targetId);
                
                if (target) {
                    workingSkipLinks.push({
                        element: link,
                        target: target,
                        text: link.textContent.trim()
                    });
                } else {
                    brokenSkipLinks.push({
                        element: link,
                        targetId: targetId,
                        text: link.textContent.trim()
                    });
                }
            }
        });

        if (brokenSkipLinks.length > 0) {
            this.testResults.push({
                test: 'Skip Link Targets',
                status: 'error',
                message: `Found ${brokenSkipLinks.length} skip link(s) with missing targets`,
                details: brokenSkipLinks.map(link => ({
                    element: link.element,
                    description: `Skip link "${link.text}" points to missing element #${link.targetId}`
                }))
            });
        }

        if (workingSkipLinks.length > 0) {
            this.testResults.push({
                test: 'Skip Link Functionality',
                status: 'pass',
                message: `Found ${workingSkipLinks.length} working skip link(s)`,
                details: workingSkipLinks.map(link => ({
                    element: link.element,
                    description: `Skip link "${link.text}" correctly targets ${link.target.tagName.toLowerCase()}`
                }))
            });
        } else {
            this.testResults.push({
                test: 'Skip Link Presence',
                status: 'warning',
                message: 'No skip links found - consider adding skip navigation for keyboard users'
            });
        }
    }

    // Test 5: Test custom keyboard handlers
    testCustomKeyboardHandlers() {
        this.currentTest = 'Custom Keyboard Handlers';
        
        const elementsWithHandlers = [];
        const elementsWithClickOnly = [];

        // Check for elements with keyboard event handlers
        this.focusableElements.forEach(item => {
            const element = item.element;
            const hasKeydown = element.onkeydown || element.getAttribute('onkeydown');
            const hasKeyup = element.onkeyup || element.getAttribute('onkeyup');
            const hasKeypress = element.onkeypress || element.getAttribute('onkeypress');
            const hasClick = element.onclick || element.getAttribute('onclick');

            if (hasKeydown || hasKeyup || hasKeypress) {
                elementsWithHandlers.push({
                    element: element,
                    events: {
                        keydown: !!hasKeydown,
                        keyup: !!hasKeyup,
                        keypress: !!hasKeypress,
                        click: !!hasClick
                    }
                });
            } else if (hasClick && !element.matches('button, a[href], input[type="button"], input[type="submit"]')) {
                elementsWithClickOnly.push({
                    element: element,
                    tagName: element.tagName.toLowerCase()
                });
            }
        });

        if (elementsWithClickOnly.length > 0) {
            this.testResults.push({
                test: 'Click-Only Handlers',
                status: 'warning',
                message: `Found ${elementsWithClickOnly.length} element(s) with click handlers but no keyboard handlers`,
                details: elementsWithClickOnly.map(item => ({
                    element: item.element,
                    description: `${item.tagName} has click handler but may not respond to keyboard activation`
                }))
            });
        }

        if (elementsWithHandlers.length > 0) {
            this.testResults.push({
                test: 'Keyboard Event Handlers',
                status: 'info',
                message: `Found ${elementsWithHandlers.length} element(s) with custom keyboard handlers`,
                details: elementsWithHandlers.map(item => ({
                    element: item.element,
                    description: `Has handlers for: ${Object.keys(item.events).filter(key => item.events[key]).join(', ')}`
                }))
            });
        }
    }

    // Test 6: Test arrow key navigation
    testArrowKeyNavigation() {
        this.currentTest = 'Arrow Key Navigation';
        
        const arrowKeyElements = document.querySelectorAll(
            '[role="menu"], [role="menubar"], [role="tablist"], [role="listbox"], [role="tree"], [role="grid"]'
        );

        const elementsNeedingArrowKeys = [];
        const elementsWithArrowKeys = [];

        arrowKeyElements.forEach(element => {
            if (this.isVisible(element)) {
                const hasArrowKeyHandler = this.checkForArrowKeyHandlers(element);
                
                if (hasArrowKeyHandler) {
                    elementsWithArrowKeys.push(element);
                } else {
                    elementsNeedingArrowKeys.push(element);
                }
            }
        });

        if (elementsNeedingArrowKeys.length > 0) {
            this.testResults.push({
                test: 'Arrow Key Navigation Implementation',
                status: 'warning',
                message: `Found ${elementsNeedingArrowKeys.length} element(s) that may need arrow key navigation`,
                details: elementsNeedingArrowKeys.map(element => ({
                    element: element,
                    description: `${element.getAttribute('role')} should support arrow key navigation`
                }))
            });
        }

        if (elementsWithArrowKeys.length > 0) {
            this.testResults.push({
                test: 'Arrow Key Navigation',
                status: 'pass',
                message: `Found ${elementsWithArrowKeys.length} element(s) with arrow key navigation`
            });
        }
    }

    // Test 7: Test escape key handling
    testEscapeKeyHandling() {
        this.currentTest = 'Escape Key Handling';
        
        const escapableElements = document.querySelectorAll(
            '[role="dialog"], [role="alertdialog"], .modal, .popup, .dropdown, [aria-expanded="true"]'
        );

        const elementsWithEscape = [];
        const elementsWithoutEscape = [];

        escapableElements.forEach(element => {
            if (this.isVisible(element)) {
                const hasEscapeHandler = this.checkForEscapeHandler(element);
                
                if (hasEscapeHandler) {
                    elementsWithEscape.push(element);
                } else {
                    elementsWithoutEscape.push(element);
                }
            }
        });

        if (elementsWithoutEscape.length > 0) {
            this.testResults.push({
                test: 'Escape Key Implementation',
                status: 'warning',
                message: `Found ${elementsWithoutEscape.length} element(s) that should respond to Escape key`,
                details: elementsWithoutEscape.map(element => ({
                    element: element,
                    description: `${element.tagName.toLowerCase()} should close when Escape is pressed`
                }))
            });
        }

        if (elementsWithEscape.length > 0) {
            this.testResults.push({
                test: 'Escape Key Handling',
                status: 'pass',
                message: `Found ${elementsWithEscape.length} element(s) with Escape key handling`
            });
        }
    }

    // Test 8: Test Enter/Space activation
    testEnterSpaceActivation() {
        this.currentTest = 'Enter/Space Key Activation';
        
        const customButtons = document.querySelectorAll('[role="button"]:not(button)');
        const customLinks = document.querySelectorAll('[role="link"]:not(a)');
        const elementsNeedingActivation = [...customButtons, ...customLinks];

        const elementsWithActivation = [];
        const elementsWithoutActivation = [];

        elementsNeedingActivation.forEach(element => {
            if (this.isVisible(element)) {
                const hasActivationHandler = this.checkForActivationHandlers(element);
                
                if (hasActivationHandler) {
                    elementsWithActivation.push(element);
                } else {
                    elementsWithoutActivation.push(element);
                }
            }
        });

        if (elementsWithoutActivation.length > 0) {
            this.testResults.push({
                test: 'Enter/Space Activation',
                status: 'warning',
                message: `Found ${elementsWithoutActivation.length} custom interactive element(s) that may not respond to Enter/Space`,
                details: elementsWithoutActivation.map(element => ({
                    element: element,
                    description: `${element.tagName.toLowerCase()} with role="${element.getAttribute('role')}" should respond to Enter/Space keys`
                }))
            });
        }

        if (elementsWithActivation.length > 0) {
            this.testResults.push({
                test: 'Enter/Space Activation',
                status: 'pass',
                message: `Found ${elementsWithActivation.length} custom element(s) with proper activation handlers`
            });
        }
    }

    // Test 9: Test focus management
    testFocusManagement() {
        this.currentTest = 'Focus Management';
        
        const issues = [];

        // Check for elements that should manage focus but might not
        const dynamicContent = document.querySelectorAll('[aria-live], [role="status"], [role="alert"]');
        const modals = document.querySelectorAll('[role="dialog"], [role="alertdialog"]');
        const tabs = document.querySelectorAll('[role="tabpanel"]');

        // Check if modals have initial focus management
        modals.forEach(modal => {
            if (this.isVisible(modal)) {
                const focusableInModal = modal.querySelectorAll(
                    'a[href], button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
                );
                
                if (focusableInModal.length > 0) {
                    const firstFocusable = focusableInModal[0];
                    const hasAutofocus = Array.from(focusableInModal).some(el => el.hasAttribute('autofocus'));
                    
                    if (!hasAutofocus) {
                        issues.push({
                            element: modal,
                            issue: 'Modal without initial focus management',
                            description: 'Modal should focus first interactive element when opened'
                        });
                    }
                }
            }
        });

        // Check for focus restoration hints
        const elementsChangingContent = document.querySelectorAll('[aria-expanded], [aria-selected]');
        elementsChangingContent.forEach(element => {
            if (this.isVisible(element)) {
                // This is a simplified check - in practice, you'd need to test actual behavior
                const hasStateChange = element.getAttribute('aria-expanded') === 'true' || 
                                     element.getAttribute('aria-selected') === 'true';
                
                if (hasStateChange) {
                    // Element is in an active state - should have focus management
                    const hasFocusManagement = this.checkForFocusManagement(element);
                    if (!hasFocusManagement) {
                        issues.push({
                            element: element,
                            issue: 'State change without focus management',
                            description: 'Element changes state but may not manage focus properly'
                        });
                    }
                }
            }
        });

        if (issues.length > 0) {
            this.testResults.push({
                test: 'Focus Management Issues',
                status: 'warning',
                message: `Found ${issues.length} potential focus management issue(s)`,
                details: issues.map(issue => ({
                    element: issue.element,
                    description: issue.description
                }))
            });
        } else {
            this.testResults.push({
                test: 'Focus Management',
                status: 'pass',
                message: 'No obvious focus management issues detected'
            });
        }
    }

    // Helper methods
    isVisible(element) {
        const style = window.getComputedStyle(element);
        return style.display !== 'none' && 
               style.visibility !== 'hidden' && 
               style.opacity !== '0' &&
               element.offsetWidth > 0 && 
               element.offsetHeight > 0;
    }

    isDisabled(element) {
        return element.disabled || 
               element.getAttribute('aria-disabled') === 'true' ||
               element.closest('[aria-disabled="true"]');
    }

    getElementText(element) {
        return element.getAttribute('aria-label') ||
               element.getAttribute('title') ||
               element.textContent ||
               element.value ||
               element.alt ||
               '';
    }

    getElementPosition(element) {
        let position = 0;
        let current = element;
        
        while (current.previousElementSibling) {
            current = current.previousElementSibling;
            position++;
        }
        
        return position;
    }

    getVisualOrder(elements) {
        return elements.sort((a, b) => {
            const rectA = a.element.getBoundingClientRect();
            const rectB = b.element.getBoundingClientRect();
            
            // Sort by top position first, then left position
            if (Math.abs(rectA.top - rectB.top) > 10) {
                return rectA.top - rectB.top;
            }
            return rectA.left - rectB.left;
        });
    }

    checkForTrapLogic(element) {
        // Look for evidence of focus trap implementation
        const hasTabHandler = element.onkeydown || 
                             element.getAttribute('onkeydown') ||
                             element.querySelector('[onkeydown*="Tab"]');
        
        const hasDataAttribute = element.hasAttribute('data-focus-trap') ||
                                element.hasAttribute('data-modal');
        
        return hasTabHandler || hasDataAttribute;
    }

    checkForArrowKeyHandlers(element) {
        const keydownHandler = element.onkeydown || element.getAttribute('onkeydown');
        if (keydownHandler && typeof keydownHandler === 'string') {
            return keydownHandler.includes('Arrow') || 
                   keydownHandler.includes('Up') || 
                   keydownHandler.includes('Down') ||
                   keydownHandler.includes('Left') || 
                   keydownHandler.includes('Right');
        }
        return false;
    }

    checkForEscapeHandler(element) {
        const keydownHandler = element.onkeydown || element.getAttribute('onkeydown');
        if (keydownHandler && typeof keydownHandler === 'string') {
            return keydownHandler.includes('Escape') || keydownHandler.includes('27');
        }
        
        // Check for global escape handlers
        return document.onkeydown && document.onkeydown.toString().includes('Escape');
    }

    checkForActivationHandlers(element) {
        const keydownHandler = element.onkeydown || element.getAttribute('onkeydown');
        const keypressHandler = element.onkeypress || element.getAttribute('onkeypress');
        
        if (keydownHandler && typeof keydownHandler === 'string') {
            return keydownHandler.includes('Enter') || 
                   keydownHandler.includes('Space') ||
                   keydownHandler.includes('13') || 
                   keydownHandler.includes('32');
        }
        
        if (keypressHandler && typeof keypressHandler === 'string') {
            return keypressHandler.includes('Enter') || 
                   keypressHandler.includes('Space');
        }
        
        return false;
    }

    checkForFocusManagement(element) {
        // Look for focus-related method calls or attributes
        const hasFocusMethod = element.focus || element.blur;
        const hasTabIndex = element.hasAttribute('tabindex');
        const hasAriaAttributes = element.hasAttribute('aria-activedescendant') ||
                                 element.hasAttribute('aria-owns');
        
        return hasFocusMethod || hasTabIndex || hasAriaAttributes;
    }

    // Generate comprehensive report
    generateReport() {
        const errors = this.testResults.filter(result => result.status === 'error');
        const warnings = this.testResults.filter(result => result.status === 'warning');
        const passes = this.testResults.filter(result => result.status === 'pass');
        const info = this.testResults.filter(result => result.status === 'info');

        console.group('🎹 Keyboard Navigation Test Report');
        console.log(`📊 Summary: ${passes.length} passed, ${warnings.length} warnings, ${errors.length} errors, ${info.length} info`);
        
        if (errors.length > 0) {
            console.group('❌ Errors');
            errors.forEach(error => {
                console.group(error.test);
                console.log(error.message);
                if (error.details) {
                    error.details.forEach(detail => {
                        console.log('- ' + detail.description, detail.element);
                    });
                }
                console.groupEnd();
            });
            console.groupEnd();
        }

        if (warnings.length > 0) {
            console.group('⚠️ Warnings');
            warnings.forEach(warning => {
                console.group(warning.test);
                console.log(warning.message);
                if (warning.details) {
                    warning.details.forEach(detail => {
                        console.log('- ' + detail.description, detail.element);
                    });
                }
                console.groupEnd();
            });
            console.groupEnd();
        }

        if (passes.length > 0) {
            console.group('✅ Passed Tests');
            passes.forEach(pass => {
                console.log(`${pass.test}: ${pass.message}`);
            });
            console.groupEnd();
        }

        console.groupEnd();

        // Create visual report
        this.createVisualReport();
    }

    createVisualReport() {
        const existingReport = document.getElementById('keyboard-test-report');
        if (existingReport) {
            existingReport.remove();
        }

        const report = document.createElement('div');
        report.id = 'keyboard-test-report';
        report.style.cssText = `
            position: fixed;
            top: 20px;
            left: 20px;
            width: 400px;
            max-height: 80vh;
            overflow-y: auto;
            background: white;
            border: 2px solid #333;
            border-radius: 8px;
            padding: 20px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            z-index: 10001;
            font-family: Arial, sans-serif;
            font-size: 14px;
            line-height: 1.4;
        `;

        const errors = this.testResults.filter(result => result.status === 'error');
        const warnings = this.testResults.filter(result => result.status === 'warning');
        const passes = this.testResults.filter(result => result.status === 'pass');

        report.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                <h3 style="margin: 0; color: #333;">🎹 Keyboard Navigation Report</h3>
                <button onclick="this.parentElement.parentElement.remove()" style="background: #f44336; color: white; border: none; border-radius: 4px; padding: 5px 10px; cursor: pointer;">Close</button>
            </div>
            
            <div style="background: #f5f5f5; padding: 15px; border-radius: 4px; margin-bottom: 15px;">
                <div style="font-weight: bold; margin-bottom: 10px;">Summary</div>
                <div>✅ Passed: ${passes.length}</div>
                <div>⚠️ Warnings: ${warnings.length}</div>
                <div>❌ Errors: ${errors.length}</div>
                <div style="margin-top: 10px;">Total Focusable Elements: ${this.focusableElements.length}</div>
            </div>

            ${errors.length > 0 ? `
                <div style="margin-bottom: 15px;">
                    <h4 style="color: #f44336; margin: 0 0 10px 0;">❌ Errors (${errors.length})</h4>
                    ${errors.map(error => `
                        <div style="background: #ffebee; border-left: 4px solid #f44336; padding: 10px; margin-bottom: 8px;">
                            <div style="font-weight: bold;">${error.test}</div>
                            <div style="margin: 5px 0;">${error.message}</div>
                        </div>
                    `).join('')}
                </div>
            ` : ''}

            ${warnings.length > 0 ? `
                <div style="margin-bottom: 15px;">
                    <h4 style="color: #ff9800; margin: 0 0 10px 0;">⚠️ Warnings (${warnings.length})</h4>
                    ${warnings.map(warning => `
                        <div style="background: #fff3e0; border-left: 4px solid #ff9800; padding: 10px; margin-bottom: 8px;">
                            <div style="font-weight: bold;">${warning.test}</div>
                            <div style="margin: 5px 0;">${warning.message}</div>
                        </div>
                    `).join('')}
                </div>
            ` : ''}

            <div style="text-align: center; margin-top: 20px;">
                <button onclick="window.keyboardTester.runTests()" style="background: #2196f3; color: white; border: none; border-radius: 4px; padding: 10px 20px; cursor: pointer; margin-right: 10px;">Re-run Tests</button>
                <button onclick="window.keyboardTester.startInteractiveTest()" style="background: #4caf50; color: white; border: none; border-radius: 4px; padding: 10px 20px; cursor: pointer;">Interactive Test</button>
            </div>
        `;

        document.body.appendChild(report);
    }

    // Interactive keyboard testing mode
    startInteractiveTest() {
        console.log('🎹 Starting interactive keyboard test mode...');
        console.log('Use Tab to navigate, press Ctrl+Shift+K to stop');
        
        let currentIndex = 0;
        const testOverlay = this.createTestOverlay();
        
        const highlightElement = (index) => {
            // Remove previous highlights
            document.querySelectorAll('.keyboard-test-highlight').forEach(el => {
                el.classList.remove('keyboard-test-highlight');
            });
            
            if (index < this.focusableElements.length) {
                const element = this.focusableElements[index].element;
                element.classList.add('keyboard-test-highlight');
                element.focus();
                
                // Update overlay info
                const info = testOverlay.querySelector('.test-info');
                info.innerHTML = `
                    <strong>Element ${index + 1} of ${this.focusableElements.length}</strong><br>
                    Tag: ${element.tagName.toLowerCase()}<br>
                    Text: "${this.getElementText(element).substring(0, 50)}"<br>
                    TabIndex: ${element.tabIndex}<br>
                    <small>Press Tab/Shift+Tab to navigate, Escape to exit</small>
                `;
            }
        };

        const keyHandler = (e) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'K') {
                // Stop test
                document.removeEventListener('keydown', keyHandler);
                testOverlay.remove();
                document.querySelectorAll('.keyboard-test-highlight').forEach(el => {
                    el.classList.remove('keyboard-test-highlight');
                });
                console.log('Interactive keyboard test stopped');
                return;
            }
            
            if (e.key === 'Tab') {
                e.preventDefault();
                if (e.shiftKey) {
                    currentIndex = Math.max(0, currentIndex - 1);
                } else {
                    currentIndex = Math.min(this.focusableElements.length - 1, currentIndex + 1);
                }
                highlightElement(currentIndex);
            }
            
            if (e.key === 'Escape') {
                document.removeEventListener('keydown', keyHandler);
                testOverlay.remove();
                document.querySelectorAll('.keyboard-test-highlight').forEach(el => {
                    el.classList.remove('keyboard-test-highlight');
                });
                console.log('Interactive keyboard test stopped');
            }
        };

        document.addEventListener('keydown', keyHandler);
        highlightElement(0);
    }

    createTestOverlay() {
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.9);
            color: white;
            padding: 20px;
            border-radius: 8px;
            z-index: 10002;
            font-family: Arial, sans-serif;
            text-align: center;
            min-width: 300px;
        `;
        
        overlay.innerHTML = `
            <div class="test-info">Starting interactive test...</div>
        `;
        
        document.body.appendChild(overlay);
        
        // Add highlight styles
        const style = document.createElement('style');
        style.textContent = `
            .keyboard-test-highlight {
                outline: 3px solid #ff4444 !important;
                outline-offset: 2px !important;
                box-shadow: 0 0 10px rgba(255, 68, 68, 0.5) !important;
            }
        `;
        document.head.appendChild(style);
        
        return overlay;
    }
}

// Initialize keyboard tester
window.keyboardTester = new KeyboardNavigationTester();

// Add keyboard shortcut to run tests
document.addEventListener('keydown', function(e) {
    if (e.ctrlKey && e.shiftKey && e.key === 'K') {
        e.preventDefault();
        window.keyboardTester.runTests();
    }
});

// Auto-run tests when page loads
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        console.log('🎹 Running keyboard navigation tests...');
        window.keyboardTester.runTests();
    }, 3000);
});