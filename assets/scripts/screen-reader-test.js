// Screen Reader Testing Guide and Utilities
// Provides tools and guidance for testing with screen readers

class ScreenReaderTester {
    constructor() {
        this.testResults = [];
        this.announcements = [];
        this.isRecording = false;
    }

    // Start screen reader testing mode
    startTesting() {
        console.log('🔊 Starting screen reader testing mode...');
        
        this.createTestingInterface();
        this.startAnnouncementRecording();
        this.runScreenReaderChecks();
        
        // Provide testing instructions
        this.showTestingInstructions();
    }

    // Create testing interface
    createTestingInterface() {
        const existingInterface = document.getElementById('screen-reader-interface');
        if (existingInterface) {
            existingInterface.remove();
        }

        const interface = document.createElement('div');
        interface.id = 'screen-reader-interface';
        interface.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 350px;
            background: #2c3e50;
            color: white;
            border-radius: 8px;
            padding: 20px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            z-index: 10003;
            font-family: Arial, sans-serif;
            font-size: 14px;
            line-height: 1.4;
        `;

        interface.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                <h3 style="margin: 0; color: white;">🔊 Screen Reader Testing</h3>
                <button onclick="this.parentElement.parentElement.remove()" style="background: #e74c3c; color: white; border: none; border-radius: 4px; padding: 5px 10px; cursor: pointer;">Close</button>
            </div>
            
            <div style="margin-bottom: 15px;">
                <button onclick="window.screenReaderTester.toggleRecording()" id="recording-toggle" style="background: #27ae60; color: white; border: none; border-radius: 4px; padding: 8px 16px; cursor: pointer; width: 100%; margin-bottom: 10px;">
                    Start Recording Announcements
                </button>
                <button onclick="window.screenReaderTester.showTestingGuide()" style="background: #3498db; color: white; border: none; border-radius: 4px; padding: 8px 16px; cursor: pointer; width: 100%; margin-bottom: 10px;">
                    Show Testing Guide
                </button>
                <button onclick="window.screenReaderTester.runScreenReaderChecks()" style="background: #9b59b6; color: white; border: none; border-radius: 4px; padding: 8px 16px; cursor: pointer; width: 100%;">
                    Run SR Checks
                </button>
            </div>
            
            <div id="announcement-log" style="background: #34495e; padding: 10px; border-radius: 4px; max-height: 200px; overflow-y: auto; font-size: 12px;">
                <div style="color: #bdc3c7;">Announcements will appear here...</div>
            </div>
        `;

        document.body.appendChild(interface);
    }

    // Toggle announcement recording
    toggleRecording() {
        this.isRecording = !this.isRecording;
        const button = document.getElementById('recording-toggle');
        const log = document.getElementById('announcement-log');
        
        if (this.isRecording) {
            button.textContent = 'Stop Recording';
            button.style.background = '#e74c3c';
            log.innerHTML = '<div style="color: #27ae60;">🔴 Recording announcements...</div>';
            this.announcements = [];
            
            // Start intercepting announcements
            this.interceptAnnouncements();
        } else {
            button.textContent = 'Start Recording';
            button.style.background = '#27ae60';
            this.displayRecordedAnnouncements();
        }
    }

    // Intercept and record announcements
    interceptAnnouncements() {
        // Override the AccessibilityManager functions to record announcements
        if (window.AccessibilityManager) {
            const originalAnnouncePolite = window.AccessibilityManager.announcePolite;
            const originalAnnounceAssertive = window.AccessibilityManager.announceAssertive;
            const originalAnnounceToScreenReader = window.AccessibilityManager.announceToScreenReader;

            window.AccessibilityManager.announcePolite = (message) => {
                if (this.isRecording) {
                    this.recordAnnouncement('polite', message);
                }
                return originalAnnouncePolite.call(window.AccessibilityManager, message);
            };

            window.AccessibilityManager.announceAssertive = (message) => {
                if (this.isRecording) {
                    this.recordAnnouncement('assertive', message);
                }
                return originalAnnounceAssertive.call(window.AccessibilityManager, message);
            };

            window.AccessibilityManager.announceToScreenReader = (message) => {
                if (this.isRecording) {
                    this.recordAnnouncement('screen-reader', message);
                }
                return originalAnnounceToScreenReader.call(window.AccessibilityManager, message);
            };
        }

        // Monitor aria-live regions
        const liveRegions = document.querySelectorAll('[aria-live]');
        liveRegions.forEach(region => {
            const observer = new MutationObserver((mutations) => {
                if (this.isRecording) {
                    mutations.forEach(mutation => {
                        if (mutation.type === 'childList' || mutation.type === 'characterData') {
                            const liveType = region.getAttribute('aria-live');
                            this.recordAnnouncement(liveType, region.textContent.trim());
                        }
                    });
                }
            });

            observer.observe(region, {
                childList: true,
                subtree: true,
                characterData: true
            });
        });
    }

    // Record an announcement
    recordAnnouncement(type, message) {
        if (message && message.trim()) {
            const timestamp = new Date().toLocaleTimeString();
            this.announcements.push({
                type: type,
                message: message.trim(),
                timestamp: timestamp
            });

            // Update live display
            const log = document.getElementById('announcement-log');
            if (log) {
                const entry = document.createElement('div');
                entry.style.cssText = 'margin-bottom: 5px; padding: 5px; background: #2c3e50; border-radius: 3px;';
                entry.innerHTML = `
                    <div style="color: #3498db; font-size: 11px;">[${timestamp}] ${type.toUpperCase()}</div>
                    <div style="color: white;">${message}</div>
                `;
                log.appendChild(entry);
                log.scrollTop = log.scrollHeight;
            }
        }
    }

    // Display recorded announcements
    displayRecordedAnnouncements() {
        const log = document.getElementById('announcement-log');
        if (!log) return;

        if (this.announcements.length === 0) {
            log.innerHTML = '<div style="color: #e74c3c;">No announcements recorded</div>';
            return;
        }

        log.innerHTML = `
            <div style="color: #27ae60; margin-bottom: 10px;">
                📊 Recorded ${this.announcements.length} announcement(s)
            </div>
            ${this.announcements.map(announcement => `
                <div style="margin-bottom: 5px; padding: 5px; background: #2c3e50; border-radius: 3px;">
                    <div style="color: #3498db; font-size: 11px;">[${announcement.timestamp}] ${announcement.type.toUpperCase()}</div>
                    <div style="color: white;">${announcement.message}</div>
                </div>
            `).join('')}
        `;
    }

    // Run screen reader specific checks
    runScreenReaderChecks() {
        console.log('🔊 Running screen reader compatibility checks...');
        
        this.testResults = [];
        
        this.checkAriaLiveRegions();
        this.checkHeadingStructure();
        this.checkLandmarkStructure();
        this.checkFormLabels();
        this.checkImageAlternatives();
        this.checkLinkContext();
        this.checkTableStructure();
        this.checkButtonLabels();
        this.checkErrorMessages();
        this.checkDynamicContent();
        
        this.generateScreenReaderReport();
    }

    // Check ARIA live regions
    checkAriaLiveRegions() {
        const liveRegions = document.querySelectorAll('[aria-live]');
        const statusElements = document.querySelectorAll('[role="status"], [role="alert"]');
        
        if (liveRegions.length === 0 && statusElements.length === 0) {
            this.testResults.push({
                test: 'ARIA Live Regions',
                status: 'warning',
                message: 'No ARIA live regions found for dynamic content announcements',
                recommendation: 'Add aria-live regions for status updates and dynamic content changes'
            });
        } else {
            this.testResults.push({
                test: 'ARIA Live Regions',
                status: 'pass',
                message: `Found ${liveRegions.length + statusElements.length} live region(s) for announcements`
            });
        }

        // Check for empty live regions
        const emptyLiveRegions = Array.from(liveRegions).filter(region => !region.textContent.trim());
        if (emptyLiveRegions.length > 0) {
            this.testResults.push({
                test: 'Empty Live Regions',
                status: 'info',
                message: `Found ${emptyLiveRegions.length} empty live region(s) - ensure they're populated when needed`
            });
        }
    }

    // Check heading structure for screen readers
    checkHeadingStructure() {
        const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
        const headingLevels = Array.from(headings).map(h => parseInt(h.tagName.charAt(1)));
        
        let issues = [];
        
        // Check for H1
        if (!headingLevels.includes(1)) {
            issues.push('Missing H1 heading - screen readers use this for page identification');
        }
        
        // Check for heading hierarchy
        for (let i = 1; i < headingLevels.length; i++) {
            if (headingLevels[i] > headingLevels[i-1] + 1) {
                issues.push(`Heading hierarchy skip from H${headingLevels[i-1]} to H${headingLevels[i]} - may confuse screen reader navigation`);
                break;
            }
        }
        
        // Check for empty headings
        const emptyHeadings = Array.from(headings).filter(h => !h.textContent.trim());
        if (emptyHeadings.length > 0) {
            issues.push(`${emptyHeadings.length} empty heading(s) found - screen readers will announce these as unlabeled headings`);
        }

        if (issues.length > 0) {
            this.testResults.push({
                test: 'Heading Structure for Screen Readers',
                status: 'warning',
                message: `Found ${issues.length} heading issue(s)`,
                details: issues,
                recommendation: 'Fix heading structure for better screen reader navigation'
            });
        } else {
            this.testResults.push({
                test: 'Heading Structure for Screen Readers',
                status: 'pass',
                message: 'Heading structure is appropriate for screen reader navigation'
            });
        }
    }

    // Check landmark structure
    checkLandmarkStructure() {
        const landmarks = {
            main: document.querySelectorAll('main, [role="main"]'),
            navigation: document.querySelectorAll('nav, [role="navigation"]'),
            banner: document.querySelectorAll('header, [role="banner"]'),
            contentinfo: document.querySelectorAll('footer, [role="contentinfo"]'),
            complementary: document.querySelectorAll('aside, [role="complementary"]'),
            search: document.querySelectorAll('[role="search"]'),
            form: document.querySelectorAll('form, [role="form"]')
        };

        const issues = [];
        const recommendations = [];

        // Check main landmark
        if (landmarks.main.length === 0) {
            issues.push('No main landmark - screen readers cannot quickly navigate to main content');
            recommendations.push('Add <main> element or role="main" to identify primary content');
        } else if (landmarks.main.length > 1) {
            issues.push('Multiple main landmarks - may confuse screen reader users');
        }

        // Check navigation landmarks
        if (landmarks.navigation.length === 0) {
            issues.push('No navigation landmarks - screen readers cannot quickly find navigation');
            recommendations.push('Add <nav> elements or role="navigation" for navigation areas');
        }

        // Check for unlabeled landmarks
        Object.entries(landmarks).forEach(([type, elements]) => {
            Array.from(elements).forEach((element, index) => {
                if (elements.length > 1) {
                    const hasLabel = element.getAttribute('aria-label') || 
                                   element.getAttribute('aria-labelledby') ||
                                   (type === 'navigation' && element.querySelector('h1, h2, h3, h4, h5, h6'));
                    
                    if (!hasLabel) {
                        issues.push(`${type} landmark ${index + 1} lacks distinguishing label`);
                        recommendations.push(`Add aria-label to distinguish multiple ${type} landmarks`);
                    }
                }
            });
        });

        if (issues.length > 0) {
            this.testResults.push({
                test: 'Landmark Structure for Screen Readers',
                status: 'warning',
                message: `Found ${issues.length} landmark issue(s)`,
                details: issues,
                recommendations: recommendations
            });
        } else {
            this.testResults.push({
                test: 'Landmark Structure for Screen Readers',
                status: 'pass',
                message: 'Landmark structure supports screen reader navigation'
            });
        }
    }

    // Check form labels for screen readers
    checkFormLabels() {
        const formControls = document.querySelectorAll('input:not([type="hidden"]), textarea, select');
        const issues = [];

        formControls.forEach((control, index) => {
            const label = this.getFormControlLabel(control);
            
            if (!label) {
                issues.push(`Form control ${index + 1} (${control.type || control.tagName.toLowerCase()}) has no accessible label`);
            } else if (label.length < 2) {
                issues.push(`Form control ${index + 1} has very short label: "${label}"`);
            }

            // Check for required field indication
            if (control.required) {
                const hasRequiredIndication = label?.includes('required') ||
                                            label?.includes('*') ||
                                            control.getAttribute('aria-required') === 'true';
                
                if (!hasRequiredIndication) {
                    issues.push(`Required field ${index + 1} lacks clear required indication for screen readers`);
                }
            }

            // Check for field descriptions
            const describedBy = control.getAttribute('aria-describedby');
            if (describedBy) {
                const descriptionElement = document.getElementById(describedBy);
                if (!descriptionElement || !descriptionElement.textContent.trim()) {
                    issues.push(`Field ${index + 1} references missing or empty description`);
                }
            }
        });

        if (issues.length > 0) {
            this.testResults.push({
                test: 'Form Labels for Screen Readers',
                status: 'error',
                message: `Found ${issues.length} form labeling issue(s)`,
                details: issues,
                recommendation: 'Ensure all form controls have clear, descriptive labels'
            });
        } else {
            this.testResults.push({
                test: 'Form Labels for Screen Readers',
                status: 'pass',
                message: 'Form controls have appropriate labels for screen readers'
            });
        }
    }

    // Check image alternatives
    checkImageAlternatives() {
        const images = document.querySelectorAll('img');
        const issues = [];

        images.forEach((img, index) => {
            const alt = img.getAttribute('alt');
            const ariaHidden = img.getAttribute('aria-hidden') === 'true';
            const inHiddenContainer = img.closest('[aria-hidden="true"]');

            if (!ariaHidden && !inHiddenContainer) {
                if (alt === null) {
                    issues.push(`Image ${index + 1} missing alt attribute - screen readers will announce filename`);
                } else if (alt === '' && !this.isDecorativeImage(img)) {
                    issues.push(`Image ${index + 1} has empty alt text but may not be decorative`);
                } else if (alt && this.isGenericAltText(alt)) {
                    issues.push(`Image ${index + 1} has generic alt text: "${alt}"`);
                } else if (alt && alt.length > 125) {
                    issues.push(`Image ${index + 1} has very long alt text (${alt.length} characters)`);
                }
            }
        });

        // Check for complex images without long descriptions
        const complexImages = document.querySelectorAll('img[src*="chart"], img[src*="graph"], img[src*="diagram"]');
        complexImages.forEach((img, index) => {
            const hasLongDesc = img.getAttribute('longdesc') || 
                              img.getAttribute('aria-describedby') ||
                              img.nextElementSibling?.textContent?.includes('description');
            
            if (!hasLongDesc) {
                issues.push(`Complex image ${index + 1} may need detailed description for screen readers`);
            }
        });

        if (issues.length > 0) {
            this.testResults.push({
                test: 'Image Alternatives for Screen Readers',
                status: 'warning',
                message: `Found ${issues.length} image alternative issue(s)`,
                details: issues,
                recommendation: 'Provide appropriate alternative text for all meaningful images'
            });
        } else {
            this.testResults.push({
                test: 'Image Alternatives for Screen Readers',
                status: 'pass',
                message: 'Images have appropriate alternative text for screen readers'
            });
        }
    }

    // Check link context
    checkLinkContext() {
        const links = document.querySelectorAll('a[href]');
        const issues = [];

        links.forEach((link, index) => {
            const linkText = this.getLinkText(link);
            
            if (!linkText.trim()) {
                issues.push(`Link ${index + 1} has no accessible text for screen readers`);
            } else if (this.isGenericLinkText(linkText)) {
                issues.push(`Link ${index + 1} has generic text: "${linkText}" - screen reader users won't understand the purpose`);
            }

            // Check for links that open in new windows
            if (link.target === '_blank') {
                const hasNewWindowIndication = linkText.includes('new window') ||
                                             linkText.includes('external') ||
                                             link.getAttribute('aria-label')?.includes('new window');
                
                if (!hasNewWindowIndication) {
                    issues.push(`Link ${index + 1} opens in new window without warning for screen reader users`);
                }
            }
        });

        if (issues.length > 0) {
            this.testResults.push({
                test: 'Link Context for Screen Readers',
                status: 'warning',
                message: `Found ${issues.length} link context issue(s)`,
                details: issues,
                recommendation: 'Ensure links have descriptive text that makes sense out of context'
            });
        } else {
            this.testResults.push({
                test: 'Link Context for Screen Readers',
                status: 'pass',
                message: 'Links have appropriate context for screen readers'
            });
        }
    }

    // Check table structure
    checkTableStructure() {
        const tables = document.querySelectorAll('table');
        const issues = [];

        tables.forEach((table, index) => {
            // Check for caption
            const caption = table.querySelector('caption');
            if (!caption) {
                issues.push(`Table ${index + 1} lacks caption - screen readers cannot identify table purpose`);
            }

            // Check for headers
            const headers = table.querySelectorAll('th');
            if (headers.length === 0) {
                issues.push(`Table ${index + 1} lacks header cells - screen readers cannot identify column/row purposes`);
            } else {
                // Check for empty headers
                const emptyHeaders = Array.from(headers).filter(th => !th.textContent.trim());
                if (emptyHeaders.length > 0) {
                    issues.push(`Table ${index + 1} has ${emptyHeaders.length} empty header(s)`);
                }

                // Check for scope attributes on complex tables
                const rows = table.querySelectorAll('tr');
                if (rows.length > 3 || headers.length > 3) {
                    const headersWithoutScope = Array.from(headers).filter(th => !th.getAttribute('scope'));
                    if (headersWithoutScope.length > 0) {
                        issues.push(`Complex table ${index + 1} may need scope attributes for screen reader navigation`);
                    }
                }
            }
        });

        if (issues.length > 0) {
            this.testResults.push({
                test: 'Table Structure for Screen Readers',
                status: 'warning',
                message: `Found ${issues.length} table structure issue(s)`,
                details: issues,
                recommendation: 'Ensure tables have proper headers and captions for screen reader users'
            });
        } else if (tables.length > 0) {
            this.testResults.push({
                test: 'Table Structure for Screen Readers',
                status: 'pass',
                message: 'Tables have appropriate structure for screen readers'
            });
        }
    }

    // Check button labels
    checkButtonLabels() {
        const buttons = document.querySelectorAll('button, [role="button"]');
        const issues = [];

        buttons.forEach((button, index) => {
            const label = this.getButtonLabel(button);
            
            if (!label.trim()) {
                issues.push(`Button ${index + 1} has no accessible label for screen readers`);
            } else if (label.length < 2) {
                issues.push(`Button ${index + 1} has very short label: "${label}"`);
            } else if (this.isGenericButtonText(label)) {
                issues.push(`Button ${index + 1} has generic label: "${label}" - screen readers need more context`);
            }

            // Check for state information
            const ariaPressed = button.getAttribute('aria-pressed');
            const ariaExpanded = button.getAttribute('aria-expanded');
            
            if (ariaPressed && !label.includes('pressed') && !label.includes('selected')) {
                issues.push(`Toggle button ${index + 1} state may not be clear to screen reader users`);
            }
            
            if (ariaExpanded && !label.includes('expand') && !label.includes('menu') && !label.includes('dropdown')) {
                issues.push(`Expandable button ${index + 1} purpose may not be clear to screen reader users`);
            }
        });

        if (issues.length > 0) {
            this.testResults.push({
                test: 'Button Labels for Screen Readers',
                status: 'warning',
                message: `Found ${issues.length} button labeling issue(s)`,
                details: issues,
                recommendation: 'Ensure buttons have clear, descriptive labels for screen reader users'
            });
        } else {
            this.testResults.push({
                test: 'Button Labels for Screen Readers',
                status: 'pass',
                message: 'Buttons have appropriate labels for screen readers'
            });
        }
    }

    // Check error messages
    checkErrorMessages() {
        const errorElements = document.querySelectorAll('.error, [role="alert"], .error-message, [aria-invalid="true"]');
        const issues = [];

        // Check for error message association
        const invalidFields = document.querySelectorAll('[aria-invalid="true"]');
        invalidFields.forEach((field, index) => {
            const describedBy = field.getAttribute('aria-describedby');
            if (describedBy) {
                const errorElement = document.getElementById(describedBy);
                if (!errorElement || !errorElement.textContent.trim()) {
                    issues.push(`Invalid field ${index + 1} references missing or empty error message`);
                }
            } else {
                issues.push(`Invalid field ${index + 1} has no associated error message for screen readers`);
            }
        });

        // Check for error message clarity
        const errorMessages = document.querySelectorAll('.error-message, [role="alert"]');
        errorMessages.forEach((error, index) => {
            const text = error.textContent.trim();
            if (text && text.length < 10) {
                issues.push(`Error message ${index + 1} may be too brief: "${text}"`);
            }
        });

        if (issues.length > 0) {
            this.testResults.push({
                test: 'Error Messages for Screen Readers',
                status: 'warning',
                message: `Found ${issues.length} error message issue(s)`,
                details: issues,
                recommendation: 'Ensure error messages are properly associated and descriptive'
            });
        } else if (errorElements.length > 0) {
            this.testResults.push({
                test: 'Error Messages for Screen Readers',
                status: 'pass',
                message: 'Error messages are properly structured for screen readers'
            });
        }
    }

    // Check dynamic content
    checkDynamicContent() {
        const dynamicElements = document.querySelectorAll('[aria-live], [role="status"], [role="alert"], [role="log"]');
        const issues = [];

        if (dynamicElements.length === 0) {
            issues.push('No dynamic content regions found - screen readers may miss content updates');
        }

        // Check for appropriate live region types
        const liveRegions = document.querySelectorAll('[aria-live]');
        liveRegions.forEach((region, index) => {
            const liveType = region.getAttribute('aria-live');
            const content = region.textContent.trim();
            
            if (liveType === 'assertive' && content && !this.isUrgentContent(content)) {
                issues.push(`Live region ${index + 1} uses assertive but content may not be urgent`);
            }
            
            if (liveType === 'polite' && content && this.isUrgentContent(content)) {
                issues.push(`Live region ${index + 1} uses polite but content appears urgent`);
            }
        });

        if (issues.length > 0) {
            this.testResults.push({
                test: 'Dynamic Content for Screen Readers',
                status: 'warning',
                message: `Found ${issues.length} dynamic content issue(s)`,
                details: issues,
                recommendation: 'Ensure dynamic content updates are announced appropriately to screen readers'
            });
        } else {
            this.testResults.push({
                test: 'Dynamic Content for Screen Readers',
                status: 'pass',
                message: 'Dynamic content is properly configured for screen readers'
            });
        }
    }

    // Helper methods
    getFormControlLabel(control) {
        const ariaLabel = control.getAttribute('aria-label');
        if (ariaLabel) return ariaLabel;

        const ariaLabelledby = control.getAttribute('aria-labelledby');
        if (ariaLabelledby) {
            const labelElement = document.getElementById(ariaLabelledby);
            if (labelElement) return labelElement.textContent.trim();
        }

        const id = control.id;
        if (id) {
            const label = document.querySelector(`label[for="${id}"]`);
            if (label) return label.textContent.trim();
        }

        const parentLabel = control.closest('label');
        if (parentLabel) return parentLabel.textContent.trim();

        return '';
    }

    getLinkText(link) {
        const ariaLabel = link.getAttribute('aria-label');
        if (ariaLabel) return ariaLabel;

        let text = link.textContent.trim();
        
        // Include alt text from images
        const images = link.querySelectorAll('img[alt]');
        images.forEach(img => {
            text += ' ' + img.getAttribute('alt');
        });

        return text.trim();
    }

    getButtonLabel(button) {
        const ariaLabel = button.getAttribute('aria-label');
        if (ariaLabel) return ariaLabel;

        const ariaLabelledby = button.getAttribute('aria-labelledby');
        if (ariaLabelledby) {
            const labelElement = document.getElementById(ariaLabelledby);
            if (labelElement) return labelElement.textContent.trim();
        }

        return button.textContent.trim();
    }

    isDecorativeImage(img) {
        // Simple heuristic to determine if image is decorative
        const src = img.src.toLowerCase();
        const decorativeKeywords = ['decoration', 'border', 'spacer', 'bullet', 'icon'];
        return decorativeKeywords.some(keyword => src.includes(keyword)) ||
               img.closest('.decoration, .border, .spacer');
    }

    isGenericAltText(alt) {
        const genericTexts = ['image', 'picture', 'photo', 'graphic', 'icon', 'logo'];
        return genericTexts.some(generic => alt.toLowerCase().trim() === generic);
    }

    isGenericLinkText(text) {
        const genericTexts = ['click here', 'read more', 'more', 'link', 'here', 'this'];
        return genericTexts.some(generic => text.toLowerCase().trim() === generic);
    }

    isGenericButtonText(text) {
        const genericTexts = ['button', 'click', 'submit', 'ok'];
        return genericTexts.some(generic => text.toLowerCase().trim() === generic);
    }

    isUrgentContent(content) {
        const urgentKeywords = ['error', 'alert', 'warning', 'failed', 'required', 'invalid'];
        return urgentKeywords.some(keyword => content.toLowerCase().includes(keyword));
    }

    // Generate screen reader report
    generateScreenReaderReport() {
        const errors = this.testResults.filter(result => result.status === 'error');
        const warnings = this.testResults.filter(result => result.status === 'warning');
        const passes = this.testResults.filter(result => result.status === 'pass');

        console.group('🔊 Screen Reader Compatibility Report');
        console.log(`📊 Summary: ${passes.length} passed, ${warnings.length} warnings, ${errors.length} errors`);
        
        if (errors.length > 0) {
            console.group('❌ Errors');
            errors.forEach(error => {
                console.group(error.test);
                console.log(error.message);
                if (error.details) {
                    error.details.forEach(detail => console.log('- ' + detail));
                }
                if (error.recommendation) {
                    console.log('💡 Recommendation:', error.recommendation);
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
                    warning.details.forEach(detail => console.log('- ' + detail));
                }
                if (warning.recommendation) {
                    console.log('💡 Recommendation:', warning.recommendation);
                }
                console.groupEnd();
            });
            console.groupEnd();
        }

        console.groupEnd();
    }

    // Show testing guide
    showTestingGuide() {
        const guide = document.createElement('div');
        guide.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 80%;
            max-width: 600px;
            max-height: 80vh;
            overflow-y: auto;
            background: white;
            border: 2px solid #333;
            border-radius: 8px;
            padding: 30px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.5);
            z-index: 10004;
            font-family: Arial, sans-serif;
            font-size: 14px;
            line-height: 1.6;
        `;

        guide.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h2 style="margin: 0; color: #333;">🔊 Screen Reader Testing Guide</h2>
                <button onclick="this.parentElement.parentElement.remove()" style="background: #e74c3c; color: white; border: none; border-radius: 4px; padding: 8px 12px; cursor: pointer;">Close</button>
            </div>

            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <h3 style="margin-top: 0; color: #2c3e50;">Quick Start</h3>
                <ol>
                    <li><strong>Enable a screen reader:</strong> NVDA (free), JAWS, or VoiceOver (Mac)</li>
                    <li><strong>Turn off your monitor</strong> or close your eyes to simulate the experience</li>
                    <li><strong>Navigate using only keyboard:</strong> Tab, Shift+Tab, Arrow keys, Enter, Space</li>
                    <li><strong>Listen to announcements</strong> and check if they make sense</li>
                </ol>
            </div>

            <h3 style="color: #2c3e50;">Testing Checklist</h3>
            
            <div style="margin-bottom: 20px;">
                <h4 style="color: #34495e;">🎯 Navigation Testing</h4>
                <ul>
                    <li>Can you navigate to all interactive elements using Tab?</li>
                    <li>Do headings provide a logical outline? (Use H key in screen reader)</li>
                    <li>Can you jump between landmarks? (Use D key for landmarks)</li>
                    <li>Are skip links working properly?</li>
                </ul>
            </div>

            <div style="margin-bottom: 20px;">
                <h4 style="color: #34495e;">📝 Content Testing</h4>
                <ul>
                    <li>Are all images described meaningfully?</li>
                    <li>Do links make sense out of context?</li>
                    <li>Are form fields clearly labeled?</li>
                    <li>Are error messages announced and helpful?</li>
                </ul>
            </div>

            <div style="margin-bottom: 20px;">
                <h4 style="color: #34495e;">🔄 Dynamic Content Testing</h4>
                <ul>
                    <li>Are status updates announced automatically?</li>
                    <li>When content changes, is the user informed?</li>
                    <li>Do modals trap focus appropriately?</li>
                    <li>Can you close modals and return to previous focus?</li>
                </ul>
            </div>

            <div style="background: #e8f5e8; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                <h4 style="margin-top: 0; color: #27ae60;">💡 Pro Tips</h4>
                <ul style="margin-bottom: 0;">
                    <li><strong>Use screen reader shortcuts:</strong> H (headings), L (links), F (forms), B (buttons)</li>
                    <li><strong>Test with eyes closed:</strong> This reveals issues you might miss visually</li>
                    <li><strong>Listen to the full page:</strong> Use screen reader's "read all" function</li>
                    <li><strong>Test forms completely:</strong> Fill out, submit, and handle errors</li>
                </ul>
            </div>

            <div style="background: #fff3cd; padding: 15px; border-radius: 8px;">
                <h4 style="margin-top: 0; color: #856404;">⚠️ Common Issues to Watch For</h4>
                <ul style="margin-bottom: 0;">
                    <li>Unlabeled form controls</li>
                    <li>Generic link text ("click here", "read more")</li>
                    <li>Missing alt text on meaningful images</li>
                    <li>Poor heading structure</li>
                    <li>Keyboard traps in modals</li>
                    <li>Unannounced dynamic content changes</li>
                </ul>
            </div>
        `;

        document.body.appendChild(guide);
    }

    // Show testing instructions
    showTestingInstructions() {
        console.group('🔊 Screen Reader Testing Instructions');
        console.log('1. Enable a screen reader (NVDA, JAWS, or VoiceOver)');
        console.log('2. Use keyboard navigation only (Tab, Shift+Tab, Arrow keys)');
        console.log('3. Test with eyes closed to simulate the real experience');
        console.log('4. Check that all content is announced meaningfully');
        console.log('5. Verify that dynamic content changes are announced');
        console.log('6. Use the recording feature to capture announcements');
        console.groupEnd();
    }
}

// Initialize screen reader tester
window.screenReaderTester = new ScreenReaderTester();

// Add keyboard shortcut to start screen reader testing
document.addEventListener('keydown', function(e) {
    if (e.ctrlKey && e.shiftKey && e.key === 'S') {
        e.preventDefault();
        window.screenReaderTester.startTesting();
    }
});

// Auto-run screen reader checks when page loads
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        console.log('🔊 Running screen reader compatibility checks...');
        window.screenReaderTester.runScreenReaderChecks();
    }, 4000);
});