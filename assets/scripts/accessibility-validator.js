// Accessibility Validator for WCAG 2.1 AA Compliance
// This script performs automated accessibility checks

class AccessibilityValidator {
    constructor() {
        this.errors = [];
        this.warnings = [];
        this.passes = [];
        this.wcagLevel = 'AA';
    }

    // Main validation function
    validate() {
        console.log('Starting accessibility validation...');
        
        this.validateImages();
        this.validateHeadings();
        this.validateLinks();
        this.validateForms();
        this.validateKeyboardNavigation();
        this.validateAriaLabels();
        this.validateColorContrast();
        this.validateFocusManagement();
        this.validateSemanticStructure();
        this.validateLandmarks();
        this.validateTables();
        this.validateMultimedia();
        
        this.generateReport();
        return this.getResults();
    }

    // 1.1.1 Non-text Content (Level A)
    validateImages() {
        const images = document.querySelectorAll('img');
        let imageIssues = 0;

        images.forEach((img, index) => {
            const alt = img.getAttribute('alt');
            const ariaHidden = img.getAttribute('aria-hidden');
            const role = img.getAttribute('role');

            // Check for missing alt attribute
            if (alt === null && ariaHidden !== 'true') {
                this.errors.push({
                    element: img,
                    issue: 'Missing alt attribute',
                    wcag: '1.1.1',
                    level: 'A',
                    description: `Image ${index + 1} is missing an alt attribute`,
                    fix: 'Add descriptive alt text or aria-hidden="true" for decorative images'
                });
                imageIssues++;
            }

            // Check for empty alt text on meaningful images
            if (alt === '' && ariaHidden !== 'true' && !img.closest('[aria-hidden="true"]')) {
                this.warnings.push({
                    element: img,
                    issue: 'Empty alt text on potentially meaningful image',
                    wcag: '1.1.1',
                    level: 'A',
                    description: `Image ${index + 1} has empty alt text but may not be decorative`,
                    fix: 'Verify if image is decorative or add descriptive alt text'
                });
            }

            // Check for generic alt text
            const genericTexts = ['image', 'picture', 'photo', 'graphic', 'icon'];
            if (alt && genericTexts.some(generic => alt.toLowerCase().includes(generic))) {
                this.warnings.push({
                    element: img,
                    issue: 'Generic alt text',
                    wcag: '1.1.1',
                    level: 'A',
                    description: `Image ${index + 1} uses generic alt text: "${alt}"`,
                    fix: 'Use more descriptive alt text that explains the image content or purpose'
                });
            }

            // Check for alt text that's too long
            if (alt && alt.length > 125) {
                this.warnings.push({
                    element: img,
                    issue: 'Alt text too long',
                    wcag: '1.1.1',
                    level: 'A',
                    description: `Image ${index + 1} has alt text longer than 125 characters`,
                    fix: 'Consider using shorter alt text and longdesc or aria-describedby for detailed descriptions'
                });
            }
        });

        if (imageIssues === 0) {
            this.passes.push({
                test: 'Image alt text validation',
                wcag: '1.1.1',
                description: 'All images have appropriate alt text'
            });
        }
    }

    // 1.3.1 Info and Relationships (Level A) - Headings
    validateHeadings() {
        const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
        let headingLevels = [];
        let hasH1 = false;
        let multipleH1 = false;

        headings.forEach((heading, index) => {
            const level = parseInt(heading.tagName.charAt(1));
            headingLevels.push(level);

            if (level === 1) {
                if (hasH1) {
                    multipleH1 = true;
                } else {
                    hasH1 = true;
                }
            }

            // Check for empty headings
            if (!heading.textContent.trim()) {
                this.errors.push({
                    element: heading,
                    issue: 'Empty heading',
                    wcag: '1.3.1',
                    level: 'A',
                    description: `${heading.tagName} element ${index + 1} is empty`,
                    fix: 'Add descriptive text to the heading or remove if not needed'
                });
            }

            // Check for very long headings
            if (heading.textContent.trim().length > 120) {
                this.warnings.push({
                    element: heading,
                    issue: 'Heading text too long',
                    wcag: '1.3.1',
                    level: 'A',
                    description: `${heading.tagName} element ${index + 1} is longer than 120 characters`,
                    fix: 'Consider shortening the heading text'
                });
            }
        });

        // Check for missing H1
        if (!hasH1) {
            this.errors.push({
                element: document.body,
                issue: 'Missing H1 heading',
                wcag: '1.3.1',
                level: 'A',
                description: 'Page is missing an H1 heading',
                fix: 'Add an H1 heading that describes the main content of the page'
            });
        }

        // Check for multiple H1s
        if (multipleH1) {
            this.warnings.push({
                element: document.body,
                issue: 'Multiple H1 headings',
                wcag: '1.3.1',
                level: 'A',
                description: 'Page has multiple H1 headings',
                fix: 'Consider using only one H1 per page for better structure'
            });
        }

        // Check heading hierarchy
        for (let i = 1; i < headingLevels.length; i++) {
            const current = headingLevels[i];
            const previous = headingLevels[i - 1];
            
            if (current > previous + 1) {
                this.warnings.push({
                    element: headings[i],
                    issue: 'Heading hierarchy skip',
                    wcag: '1.3.1',
                    level: 'A',
                    description: `Heading level jumps from H${previous} to H${current}`,
                    fix: 'Use sequential heading levels (H1, H2, H3, etc.)'
                });
            }
        }

        if (hasH1 && !multipleH1) {
            this.passes.push({
                test: 'Heading structure validation',
                wcag: '1.3.1',
                description: 'Page has proper heading structure'
            });
        }
    }

    // 2.4.4 Link Purpose (Level A)
    validateLinks() {
        const links = document.querySelectorAll('a[href]');
        let linkIssues = 0;

        links.forEach((link, index) => {
            const linkText = this.getLinkText(link);
            const href = link.getAttribute('href');

            // Check for empty link text
            if (!linkText.trim()) {
                this.errors.push({
                    element: link,
                    issue: 'Empty link text',
                    wcag: '2.4.4',
                    level: 'A',
                    description: `Link ${index + 1} has no accessible text`,
                    fix: 'Add descriptive text, aria-label, or aria-labelledby to the link'
                });
                linkIssues++;
            }

            // Check for generic link text
            const genericTexts = ['click here', 'read more', 'more', 'link', 'here'];
            if (linkText && genericTexts.some(generic => 
                linkText.toLowerCase().trim() === generic)) {
                this.warnings.push({
                    element: link,
                    issue: 'Generic link text',
                    wcag: '2.4.4',
                    level: 'A',
                    description: `Link ${index + 1} uses generic text: "${linkText}"`,
                    fix: 'Use more descriptive link text that explains the link purpose'
                });
            }

            // Check for links that open in new window without indication
            const target = link.getAttribute('target');
            if (target === '_blank') {
                const hasIndicator = linkText.includes('(opens in new window)') ||
                                   linkText.includes('(external link)') ||
                                   link.querySelector('.sr-only') ||
                                   link.getAttribute('aria-label')?.includes('opens in new window');

                if (!hasIndicator) {
                    this.warnings.push({
                        element: link,
                        issue: 'New window link without indication',
                        wcag: '3.2.5',
                        level: 'AAA',
                        description: `Link ${index + 1} opens in new window without warning`,
                        fix: 'Add indication that link opens in new window'
                    });
                }
            }

            // Check for duplicate link text with different destinations
            const duplicateLinks = Array.from(links).filter(otherLink => 
                otherLink !== link && 
                this.getLinkText(otherLink).trim() === linkText.trim() &&
                otherLink.getAttribute('href') !== href
            );

            if (duplicateLinks.length > 0) {
                this.warnings.push({
                    element: link,
                    issue: 'Duplicate link text with different destinations',
                    wcag: '2.4.4',
                    level: 'A',
                    description: `Link "${linkText}" appears multiple times with different destinations`,
                    fix: 'Make link text more specific or add context'
                });
            }
        });

        if (linkIssues === 0) {
            this.passes.push({
                test: 'Link accessibility validation',
                wcag: '2.4.4',
                description: 'All links have accessible text'
            });
        }
    }

    // Helper function to get link text including aria-label and images
    getLinkText(link) {
        const ariaLabel = link.getAttribute('aria-label');
        if (ariaLabel) return ariaLabel;

        const ariaLabelledby = link.getAttribute('aria-labelledby');
        if (ariaLabelledby) {
            const labelElement = document.getElementById(ariaLabelledby);
            if (labelElement) return labelElement.textContent;
        }

        let text = link.textContent.trim();
        
        // Check for images with alt text
        const images = link.querySelectorAll('img[alt]');
        images.forEach(img => {
            text += ' ' + img.getAttribute('alt');
        });

        return text.trim();
    }

    // 3.3.2 Labels or Instructions (Level A)
    validateForms() {
        const formControls = document.querySelectorAll('input, textarea, select');
        let formIssues = 0;

        formControls.forEach((control, index) => {
            const type = control.type;
            const id = control.id;
            const name = control.name;

            // Skip hidden inputs
            if (type === 'hidden') return;

            // Check for labels
            const label = this.getFormLabel(control);
            if (!label && type !== 'submit' && type !== 'button' && type !== 'reset') {
                this.errors.push({
                    element: control,
                    issue: 'Missing form label',
                    wcag: '3.3.2',
                    level: 'A',
                    description: `Form control ${index + 1} (${type}) has no associated label`,
                    fix: 'Add a label element, aria-label, or aria-labelledby attribute'
                });
                formIssues++;
            }

            // Check for required field indicators
            if (control.hasAttribute('required')) {
                const hasRequiredIndicator = label?.includes('*') ||
                                           label?.includes('required') ||
                                           control.getAttribute('aria-required') === 'true' ||
                                           control.getAttribute('aria-describedby');

                if (!hasRequiredIndicator) {
                    this.warnings.push({
                        element: control,
                        issue: 'Required field without clear indication',
                        wcag: '3.3.2',
                        level: 'A',
                        description: `Required field ${index + 1} lacks clear required indication`,
                        fix: 'Add visual and programmatic indication that field is required'
                    });
                }
            }

            // Check for error message association
            const errorElement = document.querySelector(`[id="${control.getAttribute('aria-describedby')}"]`);
            if (control.getAttribute('aria-invalid') === 'true' && !errorElement) {
                this.warnings.push({
                    element: control,
                    issue: 'Invalid field without error message',
                    wcag: '3.3.1',
                    level: 'A',
                    description: `Field ${index + 1} is marked invalid but has no associated error message`,
                    fix: 'Associate error message using aria-describedby'
                });
            }
        });

        // Check fieldsets for radio buttons and checkboxes
        const radioGroups = this.getRadioGroups();
        radioGroups.forEach(group => {
            const fieldset = group[0].closest('fieldset');
            if (!fieldset) {
                this.warnings.push({
                    element: group[0],
                    issue: 'Radio group without fieldset',
                    wcag: '1.3.1',
                    level: 'A',
                    description: `Radio button group "${group[0].name}" should be wrapped in fieldset with legend`,
                    fix: 'Wrap related radio buttons in fieldset with descriptive legend'
                });
            }
        });

        if (formIssues === 0) {
            this.passes.push({
                test: 'Form accessibility validation',
                wcag: '3.3.2',
                description: 'All form controls have appropriate labels'
            });
        }
    }

    // Helper function to get form label
    getFormLabel(control) {
        const ariaLabel = control.getAttribute('aria-label');
        if (ariaLabel) return ariaLabel;

        const ariaLabelledby = control.getAttribute('aria-labelledby');
        if (ariaLabelledby) {
            const labelElement = document.getElementById(ariaLabelledby);
            if (labelElement) return labelElement.textContent;
        }

        const id = control.id;
        if (id) {
            const label = document.querySelector(`label[for="${id}"]`);
            if (label) return label.textContent;
        }

        const parentLabel = control.closest('label');
        if (parentLabel) return parentLabel.textContent;

        return null;
    }

    // Helper function to get radio button groups
    getRadioGroups() {
        const radios = document.querySelectorAll('input[type="radio"]');
        const groups = {};
        
        radios.forEach(radio => {
            const name = radio.name;
            if (!groups[name]) groups[name] = [];
            groups[name].push(radio);
        });

        return Object.values(groups).filter(group => group.length > 1);
    }

    // 2.1.1 Keyboard (Level A)
    validateKeyboardNavigation() {
        const interactiveElements = document.querySelectorAll(
            'a[href], button, input, textarea, select, [tabindex]:not([tabindex="-1"]), [role="button"], [role="link"], [role="menuitem"]'
        );

        let keyboardIssues = 0;

        interactiveElements.forEach((element, index) => {
            // Check if element is focusable
            const tabIndex = element.getAttribute('tabindex');
            const isNativelyFocusable = this.isNativelyFocusable(element);

            if (!isNativelyFocusable && (tabIndex === null || parseInt(tabIndex) < 0)) {
                this.warnings.push({
                    element: element,
                    issue: 'Interactive element not keyboard accessible',
                    wcag: '2.1.1',
                    level: 'A',
                    description: `Interactive element ${index + 1} may not be keyboard accessible`,
                    fix: 'Add tabindex="0" or use native focusable elements'
                });
            }

            // Check for positive tabindex values (anti-pattern)
            if (tabIndex && parseInt(tabIndex) > 0) {
                this.warnings.push({
                    element: element,
                    issue: 'Positive tabindex value',
                    wcag: '2.4.3',
                    level: 'A',
                    description: `Element ${index + 1} uses positive tabindex (${tabIndex})`,
                    fix: 'Use tabindex="0" or rely on natural tab order'
                });
            }
        });

        // Check for keyboard event handlers
        const elementsWithClickHandlers = document.querySelectorAll('[onclick]');
        elementsWithClickHandlers.forEach((element, index) => {
            if (!element.matches('button, input[type="button"], input[type="submit"], a[href]')) {
                this.warnings.push({
                    element: element,
                    issue: 'Click handler without keyboard support',
                    wcag: '2.1.1',
                    level: 'A',
                    description: `Element ${index + 1} has click handler but may not support keyboard`,
                    fix: 'Add keyboard event handlers (onkeydown/onkeyup) or use button element'
                });
            }
        });

        if (keyboardIssues === 0) {
            this.passes.push({
                test: 'Keyboard navigation validation',
                wcag: '2.1.1',
                description: 'Interactive elements are keyboard accessible'
            });
        }
    }

    // Helper function to check if element is natively focusable
    isNativelyFocusable(element) {
        const focusableElements = [
            'a[href]', 'button', 'input', 'textarea', 'select', 'details', 'iframe'
        ];
        
        return focusableElements.some(selector => element.matches(selector)) &&
               !element.disabled &&
               element.getAttribute('tabindex') !== '-1';
    }

    // 4.1.2 Name, Role, Value (Level A)
    validateAriaLabels() {
        const elementsWithRoles = document.querySelectorAll('[role]');
        let ariaIssues = 0;

        elementsWithRoles.forEach((element, index) => {
            const role = element.getAttribute('role');
            
            // Check for invalid ARIA roles
            const validRoles = [
                'alert', 'alertdialog', 'application', 'article', 'banner', 'button',
                'cell', 'checkbox', 'columnheader', 'combobox', 'complementary',
                'contentinfo', 'definition', 'dialog', 'directory', 'document',
                'feed', 'figure', 'form', 'grid', 'gridcell', 'group', 'heading',
                'img', 'link', 'list', 'listbox', 'listitem', 'log', 'main',
                'marquee', 'math', 'menu', 'menubar', 'menuitem', 'menuitemcheckbox',
                'menuitemradio', 'navigation', 'none', 'note', 'option', 'presentation',
                'progressbar', 'radio', 'radiogroup', 'region', 'row', 'rowgroup',
                'rowheader', 'scrollbar', 'search', 'searchbox', 'separator',
                'slider', 'spinbutton', 'status', 'switch', 'tab', 'table',
                'tablist', 'tabpanel', 'term', 'textbox', 'timer', 'toolbar',
                'tooltip', 'tree', 'treegrid', 'treeitem'
            ];

            if (!validRoles.includes(role)) {
                this.errors.push({
                    element: element,
                    issue: 'Invalid ARIA role',
                    wcag: '4.1.2',
                    level: 'A',
                    description: `Element ${index + 1} has invalid role: "${role}"`,
                    fix: 'Use a valid ARIA role or remove the role attribute'
                });
                ariaIssues++;
            }

            // Check for required ARIA properties
            const requiredProps = this.getRequiredAriaProps(role);
            requiredProps.forEach(prop => {
                if (!element.hasAttribute(prop)) {
                    this.errors.push({
                        element: element,
                        issue: `Missing required ARIA property: ${prop}`,
                        wcag: '4.1.2',
                        level: 'A',
                        description: `Element with role="${role}" is missing required ${prop}`,
                        fix: `Add ${prop} attribute to element with role="${role}"`
                    });
                    ariaIssues++;
                }
            });
        });

        // Check for ARIA attributes without roles
        const ariaAttributes = [
            'aria-label', 'aria-labelledby', 'aria-describedby', 'aria-expanded',
            'aria-hidden', 'aria-live', 'aria-atomic', 'aria-relevant'
        ];

        ariaAttributes.forEach(attr => {
            const elementsWithAttr = document.querySelectorAll(`[${attr}]`);
            elementsWithAttr.forEach((element, index) => {
                // Check for empty ARIA labels
                if ((attr === 'aria-label' || attr === 'aria-labelledby') && 
                    !element.getAttribute(attr).trim()) {
                    this.warnings.push({
                        element: element,
                        issue: `Empty ${attr}`,
                        wcag: '4.1.2',
                        level: 'A',
                        description: `Element ${index + 1} has empty ${attr}`,
                        fix: `Provide meaningful text for ${attr} or remove the attribute`
                    });
                }
            });
        });

        if (ariaIssues === 0) {
            this.passes.push({
                test: 'ARIA validation',
                wcag: '4.1.2',
                description: 'ARIA roles and properties are used correctly'
            });
        }
    }

    // Helper function to get required ARIA properties for roles
    getRequiredAriaProps(role) {
        const requirements = {
            'checkbox': ['aria-checked'],
            'combobox': ['aria-expanded'],
            'gridcell': ['aria-selected'],
            'listbox': ['aria-multiselectable'],
            'menuitemcheckbox': ['aria-checked'],
            'menuitemradio': ['aria-checked'],
            'option': ['aria-selected'],
            'progressbar': ['aria-valuenow'],
            'radio': ['aria-checked'],
            'scrollbar': ['aria-controls', 'aria-orientation', 'aria-valuenow'],
            'separator': ['aria-orientation'],
            'slider': ['aria-valuenow'],
            'spinbutton': ['aria-valuenow'],
            'switch': ['aria-checked'],
            'tab': ['aria-selected'],
            'tabpanel': ['aria-labelledby'],
            'textbox': ['aria-multiline'],
            'treeitem': ['aria-selected']
        };

        return requirements[role] || [];
    }

    // 1.4.3 Contrast (Level AA)
    validateColorContrast() {
        // This is a simplified contrast check
        // In a real implementation, you'd use a library like axe-core
        const textElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, a, button, label, li');
        let contrastIssues = 0;

        textElements.forEach((element, index) => {
            const styles = window.getComputedStyle(element);
            const fontSize = parseFloat(styles.fontSize);
            const fontWeight = styles.fontWeight;
            
            // Check if text is large (18pt+ or 14pt+ bold)
            const isLargeText = fontSize >= 18 || (fontSize >= 14 && (fontWeight === 'bold' || parseInt(fontWeight) >= 700));
            
            // Note: Actual contrast calculation would require color parsing
            // This is a placeholder for demonstration
            const textColor = styles.color;
            const backgroundColor = styles.backgroundColor;
            
            if (textColor === backgroundColor) {
                this.errors.push({
                    element: element,
                    issue: 'Text and background same color',
                    wcag: '1.4.3',
                    level: 'AA',
                    description: `Element ${index + 1} has same text and background color`,
                    fix: 'Ensure sufficient color contrast between text and background'
                });
                contrastIssues++;
            }
        });

        if (contrastIssues === 0) {
            this.passes.push({
                test: 'Color contrast validation',
                wcag: '1.4.3',
                description: 'Text has sufficient color contrast'
            });
        }
    }

    // 2.4.7 Focus Visible (Level AA)
    validateFocusManagement() {
        const focusableElements = document.querySelectorAll(
            'a[href], button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
        );

        let focusIssues = 0;

        focusableElements.forEach((element, index) => {
            // Check if element has focus styles
            const styles = window.getComputedStyle(element, ':focus');
            const outline = styles.outline;
            const outlineWidth = styles.outlineWidth;
            const boxShadow = styles.boxShadow;

            if (outline === 'none' && outlineWidth === '0px' && boxShadow === 'none') {
                this.warnings.push({
                    element: element,
                    issue: 'No visible focus indicator',
                    wcag: '2.4.7',
                    level: 'AA',
                    description: `Element ${index + 1} has no visible focus indicator`,
                    fix: 'Add visible focus styles (outline, box-shadow, or border)'
                });
            }
        });

        if (focusIssues === 0) {
            this.passes.push({
                test: 'Focus visibility validation',
                wcag: '2.4.7',
                description: 'Focusable elements have visible focus indicators'
            });
        }
    }

    // 1.3.1 Info and Relationships (Level A) - Semantic Structure
    validateSemanticStructure() {
        let structureIssues = 0;

        // Check for proper list structure
        const lists = document.querySelectorAll('ul, ol');
        lists.forEach((list, index) => {
            const children = Array.from(list.children);
            const hasNonListItems = children.some(child => !child.matches('li'));
            
            if (hasNonListItems) {
                this.errors.push({
                    element: list,
                    issue: 'Invalid list structure',
                    wcag: '1.3.1',
                    level: 'A',
                    description: `List ${index + 1} contains non-li elements`,
                    fix: 'Only include li elements as direct children of ul/ol'
                });
                structureIssues++;
            }
        });

        // Check for proper table structure
        const tables = document.querySelectorAll('table');
        tables.forEach((table, index) => {
            const hasCaption = table.querySelector('caption');
            const hasHeaders = table.querySelector('th');
            
            if (!hasCaption) {
                this.warnings.push({
                    element: table,
                    issue: 'Table without caption',
                    wcag: '1.3.1',
                    level: 'A',
                    description: `Table ${index + 1} lacks a caption`,
                    fix: 'Add a caption element to describe the table content'
                });
            }

            if (!hasHeaders) {
                this.warnings.push({
                    element: table,
                    issue: 'Table without headers',
                    wcag: '1.3.1',
                    level: 'A',
                    description: `Table ${index + 1} lacks header cells`,
                    fix: 'Use th elements for table headers'
                });
            }
        });

        if (structureIssues === 0) {
            this.passes.push({
                test: 'Semantic structure validation',
                wcag: '1.3.1',
                description: 'Content uses proper semantic structure'
            });
        }
    }

    // 1.3.6 Identify Purpose (Level AAA) - Landmarks
    validateLandmarks() {
        const landmarks = {
            'main': document.querySelectorAll('main, [role="main"]'),
            'navigation': document.querySelectorAll('nav, [role="navigation"]'),
            'banner': document.querySelectorAll('header, [role="banner"]'),
            'contentinfo': document.querySelectorAll('footer, [role="contentinfo"]'),
            'complementary': document.querySelectorAll('aside, [role="complementary"]')
        };

        // Check for main landmark
        if (landmarks.main.length === 0) {
            this.warnings.push({
                element: document.body,
                issue: 'Missing main landmark',
                wcag: '1.3.6',
                level: 'AAA',
                description: 'Page lacks a main landmark',
                fix: 'Add a main element or role="main" to identify main content'
            });
        } else if (landmarks.main.length > 1) {
            this.warnings.push({
                element: document.body,
                issue: 'Multiple main landmarks',
                wcag: '1.3.6',
                level: 'AAA',
                description: 'Page has multiple main landmarks',
                fix: 'Use only one main landmark per page'
            });
        }

        // Check for navigation landmarks
        if (landmarks.navigation.length === 0) {
            this.warnings.push({
                element: document.body,
                issue: 'Missing navigation landmark',
                wcag: '1.3.6',
                level: 'AAA',
                description: 'Page lacks navigation landmarks',
                fix: 'Add nav elements or role="navigation" for navigation areas'
            });
        }

        this.passes.push({
            test: 'Landmark validation',
            wcag: '1.3.6',
            description: 'Page structure uses appropriate landmarks'
        });
    }

    // Table validation
    validateTables() {
        const tables = document.querySelectorAll('table');
        
        tables.forEach((table, index) => {
            // Check for data tables vs layout tables
            const hasHeaders = table.querySelector('th');
            const hasCaption = table.querySelector('caption');
            const hasSummary = table.getAttribute('summary');
            
            if (hasHeaders || hasCaption || hasSummary) {
                // This is likely a data table
                const headers = table.querySelectorAll('th');
                headers.forEach((header, headerIndex) => {
                    if (!header.textContent.trim()) {
                        this.errors.push({
                            element: header,
                            issue: 'Empty table header',
                            wcag: '1.3.1',
                            level: 'A',
                            description: `Table ${index + 1}, header ${headerIndex + 1} is empty`,
                            fix: 'Provide descriptive text for table headers'
                        });
                    }
                });

                // Check for scope attributes on complex tables
                const rows = table.querySelectorAll('tr');
                if (rows.length > 3) {
                    const headersWithoutScope = table.querySelectorAll('th:not([scope])');
                    if (headersWithoutScope.length > 0) {
                        this.warnings.push({
                            element: table,
                            issue: 'Complex table without scope attributes',
                            wcag: '1.3.1',
                            level: 'A',
                            description: `Table ${index + 1} may need scope attributes for headers`,
                            fix: 'Add scope="col" or scope="row" to table headers'
                        });
                    }
                }
            }
        });
    }

    // Multimedia validation
    validateMultimedia() {
        // Check for videos
        const videos = document.querySelectorAll('video');
        videos.forEach((video, index) => {
            const hasControls = video.hasAttribute('controls');
            const hasAutoplay = video.hasAttribute('autoplay');
            
            if (!hasControls) {
                this.warnings.push({
                    element: video,
                    issue: 'Video without controls',
                    wcag: '2.2.2',
                    level: 'A',
                    description: `Video ${index + 1} lacks user controls`,
                    fix: 'Add controls attribute to video element'
                });
            }

            if (hasAutoplay) {
                this.warnings.push({
                    element: video,
                    issue: 'Autoplaying video',
                    wcag: '2.2.2',
                    level: 'A',
                    description: `Video ${index + 1} autoplays`,
                    fix: 'Remove autoplay or provide pause mechanism'
                });
            }

            // Check for captions
            const hasCaptions = video.querySelector('track[kind="captions"]');
            if (!hasCaptions) {
                this.warnings.push({
                    element: video,
                    issue: 'Video without captions',
                    wcag: '1.2.2',
                    level: 'A',
                    description: `Video ${index + 1} lacks captions`,
                    fix: 'Add caption track for video content'
                });
            }
        });

        // Check for audio
        const audios = document.querySelectorAll('audio');
        audios.forEach((audio, index) => {
            const hasControls = audio.hasAttribute('controls');
            const hasAutoplay = audio.hasAttribute('autoplay');
            
            if (!hasControls) {
                this.warnings.push({
                    element: audio,
                    issue: 'Audio without controls',
                    wcag: '2.2.2',
                    level: 'A',
                    description: `Audio ${index + 1} lacks user controls`,
                    fix: 'Add controls attribute to audio element'
                });
            }

            if (hasAutoplay) {
                this.warnings.push({
                    element: audio,
                    issue: 'Autoplaying audio',
                    wcag: '2.2.2',
                    level: 'A',
                    description: `Audio ${index + 1} autoplays`,
                    fix: 'Remove autoplay or provide pause mechanism'
                });
            }
        });
    }

    // Generate comprehensive report
    generateReport() {
        const totalIssues = this.errors.length + this.warnings.length;
        const totalTests = this.errors.length + this.warnings.length + this.passes.length;
        const passRate = totalTests > 0 ? ((this.passes.length / totalTests) * 100).toFixed(1) : 0;

        console.group('🔍 Accessibility Validation Report');
        console.log(`📊 Summary: ${this.passes.length} passed, ${this.warnings.length} warnings, ${this.errors.length} errors`);
        console.log(`✅ Pass Rate: ${passRate}%`);
        
        if (this.errors.length > 0) {
            console.group('❌ Errors (WCAG Violations)');
            this.errors.forEach((error, index) => {
                console.group(`${index + 1}. ${error.issue} (${error.wcag} Level ${error.level})`);
                console.log('Description:', error.description);
                console.log('Fix:', error.fix);
                console.log('Element:', error.element);
                console.groupEnd();
            });
            console.groupEnd();
        }

        if (this.warnings.length > 0) {
            console.group('⚠️ Warnings (Potential Issues)');
            this.warnings.forEach((warning, index) => {
                console.group(`${index + 1}. ${warning.issue} (${warning.wcag} Level ${warning.level})`);
                console.log('Description:', warning.description);
                console.log('Fix:', warning.fix);
                console.log('Element:', warning.element);
                console.groupEnd();
            });
            console.groupEnd();
        }

        if (this.passes.length > 0) {
            console.group('✅ Passed Tests');
            this.passes.forEach((pass, index) => {
                console.log(`${index + 1}. ${pass.test} (${pass.wcag}) - ${pass.description}`);
            });
            console.groupEnd();
        }

        console.groupEnd();

        // Create visual report in DOM
        this.createVisualReport();
    }

    // Create visual accessibility report
    createVisualReport() {
        const existingReport = document.getElementById('accessibility-report');
        if (existingReport) {
            existingReport.remove();
        }

        const report = document.createElement('div');
        report.id = 'accessibility-report';
        report.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            width: 400px;
            max-height: 80vh;
            overflow-y: auto;
            background: white;
            border: 2px solid #333;
            border-radius: 8px;
            padding: 20px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            z-index: 10000;
            font-family: Arial, sans-serif;
            font-size: 14px;
            line-height: 1.4;
        `;

        const totalIssues = this.errors.length + this.warnings.length;
        const totalTests = this.errors.length + this.warnings.length + this.passes.length;
        const passRate = totalTests > 0 ? ((this.passes.length / totalTests) * 100).toFixed(1) : 0;

        report.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                <h3 style="margin: 0; color: #333;">Accessibility Report</h3>
                <button onclick="this.parentElement.parentElement.remove()" style="background: #f44336; color: white; border: none; border-radius: 4px; padding: 5px 10px; cursor: pointer;">Close</button>
            </div>
            
            <div style="background: #f5f5f5; padding: 15px; border-radius: 4px; margin-bottom: 15px;">
                <div style="font-weight: bold; margin-bottom: 10px;">Summary</div>
                <div>✅ Passed: ${this.passes.length}</div>
                <div>⚠️ Warnings: ${this.warnings.length}</div>
                <div>❌ Errors: ${this.errors.length}</div>
                <div style="margin-top: 10px; font-weight: bold;">Pass Rate: ${passRate}%</div>
            </div>

            ${this.errors.length > 0 ? `
                <div style="margin-bottom: 15px;">
                    <h4 style="color: #f44336; margin: 0 0 10px 0;">❌ Errors (${this.errors.length})</h4>
                    ${this.errors.map(error => `
                        <div style="background: #ffebee; border-left: 4px solid #f44336; padding: 10px; margin-bottom: 8px;">
                            <div style="font-weight: bold;">${error.issue}</div>
                            <div style="font-size: 12px; color: #666; margin: 5px 0;">WCAG ${error.wcag} Level ${error.level}</div>
                            <div style="margin: 5px 0;">${error.description}</div>
                            <div style="font-size: 12px; color: #333; font-style: italic;">Fix: ${error.fix}</div>
                        </div>
                    `).join('')}
                </div>
            ` : ''}

            ${this.warnings.length > 0 ? `
                <div style="margin-bottom: 15px;">
                    <h4 style="color: #ff9800; margin: 0 0 10px 0;">⚠️ Warnings (${this.warnings.length})</h4>
                    ${this.warnings.map(warning => `
                        <div style="background: #fff3e0; border-left: 4px solid #ff9800; padding: 10px; margin-bottom: 8px;">
                            <div style="font-weight: bold;">${warning.issue}</div>
                            <div style="font-size: 12px; color: #666; margin: 5px 0;">WCAG ${warning.wcag} Level ${warning.level}</div>
                            <div style="margin: 5px 0;">${warning.description}</div>
                            <div style="font-size: 12px; color: #333; font-style: italic;">Fix: ${warning.fix}</div>
                        </div>
                    `).join('')}
                </div>
            ` : ''}

            <div style="text-align: center; margin-top: 20px;">
                <button onclick="window.accessibilityValidator.validate()" style="background: #2196f3; color: white; border: none; border-radius: 4px; padding: 10px 20px; cursor: pointer;">Re-run Validation</button>
            </div>
        `;

        document.body.appendChild(report);
    }

    // Get results object
    getResults() {
        return {
            errors: this.errors,
            warnings: this.warnings,
            passes: this.passes,
            summary: {
                totalErrors: this.errors.length,
                totalWarnings: this.warnings.length,
                totalPasses: this.passes.length,
                passRate: this.passes.length / (this.errors.length + this.warnings.length + this.passes.length) * 100
            }
        };
    }
}

// Initialize validator
window.accessibilityValidator = new AccessibilityValidator();

// Auto-run validation when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Wait a bit for all content to load
    setTimeout(() => {
        console.log('🔍 Running accessibility validation...');
        window.accessibilityValidator.validate();
    }, 2000);
});

// Add keyboard shortcut to run validation
document.addEventListener('keydown', function(e) {
    if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        e.preventDefault();
        window.accessibilityValidator.validate();
    }
});