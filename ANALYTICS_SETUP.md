# Analytics Setup Guide

This guide explains how to configure Google Analytics 4 for your portfolio website.

## Quick Setup

1. **Create Google Analytics Account**
   - Go to [Google Analytics](https://analytics.google.com/)
   - Create a new account and property
   - Choose "Web" as the platform
   - Copy your GA4 Measurement ID (format: G-XXXXXXXXXX)

2. **Update Configuration**
   - Open `assets/scripts/analytics-config.js`
   - Replace `G-XXXXXXXXXX` with your actual tracking ID
   - Update domain name and other placeholder values
   - Configure privacy settings based on your region

3. **Update HTML Meta Tags**
   - Open `index.html`
   - Replace all `[your-domain].com` with your actual domain
   - Replace `[Student Name]` and other placeholders

4. **Privacy Policy**
   - Update `privacy-policy.html` with your information
   - Replace all placeholder values
   - Ensure compliance with local privacy laws (GDPR, CCPA, etc.)

5. **Test Implementation**
   - Open your site in development (localhost)
   - Check browser console for analytics test results
   - Verify consent banner appears on first visit
   - Test all tracking interactions

## Configuration Options

### Basic Settings
```javascript
googleAnalytics: {
    trackingId: 'G-XXXXXXXXXX', // Your GA4 tracking ID
    enabled: true,
    anonymizeIp: true, // GDPR compliance
}
```

### Privacy Settings
```javascript
privacy: {
    requireConsent: true, // Show consent banner
    respectDoNotTrack: true, // Honor DNT header
}
```

### Event Tracking
The system automatically tracks:
- Resume downloads
- Contact form submissions
- Project demo interactions
- Installer downloads
- Navigation clicks
- Scroll depth
- Time on page

## Google Analytics 4 Setup

1. **Create Goals/Conversions**
   - Resume downloads: `resume_download`
   - Contact form: `contact_form_submit`
   - Installer downloads: `installer_download`

2. **Custom Events**
   All events are automatically sent with relevant parameters:
   - `file_download` - Resume and installer downloads
   - `form_submit` - Contact form submissions
   - `demo_interaction` - Project demo usage
   - `navigation_click` - Menu navigation
   - `scroll_depth` - Page engagement
   - `external_link_click` - Links to GitHub, LinkedIn, etc.
   - `page_performance` - Core Web Vitals and load times
   - `time_on_page` - User engagement duration
   - `conversion` - Goal completions with values

### Enhanced Features
   - **Smart Link Tracking**: Automatically detects and categorizes external links
   - **Performance Monitoring**: Tracks page load times and Core Web Vitals
   - **Enhanced Conversions**: Assigns values to different types of interactions
   - **Error Handling**: Graceful degradation if analytics fails to load
   - **Privacy Compliance**: GDPR-ready with consent management
   - **Debug Mode**: Comprehensive logging for development and testing

3. **Enhanced Ecommerce** (Optional)
   If you want to track downloads as "purchases":
   ```javascript
   gtag('event', 'purchase', {
     transaction_id: 'resume_download_' + Date.now(),
     value: 1,
     currency: 'USD',
     items: [{
       item_id: 'resume',
       item_name: 'Resume Download',
       category: 'Document',
       quantity: 1,
       price: 1
     }]
   });
   ```

## GDPR Compliance

The analytics system includes:
- Consent banner for EU visitors
- IP anonymization
- Opt-out mechanisms
- Privacy policy integration
- Cookie consent management

### Required Updates for GDPR
1. Update privacy policy with your contact information
2. Ensure consent banner text is appropriate for your region
3. Consider using a more robust consent management platform for commercial sites

## Testing

### Development Testing
- Analytics debug mode is automatically enabled on localhost
- Check browser console for event tracking logs and test results
- Use the built-in analytics testing utilities
- Use Google Analytics DebugView for real-time testing

### Built-in Testing Tools
The portfolio includes automated testing tools that run in development:

```javascript
// Available testing commands in browser console:
window.analyticsTest.runAllTests()           // Run all analytics tests
window.analyticsTest.testTrackingElements()  // Check tracking elements
window.analyticsTest.simulateInteractions() // Simulate user interactions
window.analyticsManager.enableDebugMode()   // Enable debug mode
window.analyticsManager.trackEvent("test", {param: "value"}) // Test events
```

### Production Testing
1. Deploy your site
2. Visit in incognito mode
3. Check Google Analytics Real-time reports
4. Test all tracked interactions:
   - Download resume
   - Submit contact form
   - Open project demos
   - Download installers
   - Navigate between sections
   - Scroll through content

### Verification Checklist
- [ ] Tracking ID is not placeholder (G-XXXXXXXXXX)
- [ ] Consent banner appears on first visit
- [ ] Events appear in GA4 real-time reports
- [ ] Conversions are tracked properly
- [ ] Privacy policy is updated with your information
- [ ] All placeholder values are replaced

## Alternative Analytics

### Plausible Analytics
If you prefer privacy-focused analytics:
1. Sign up at [Plausible.io](https://plausible.io)
2. Update `analytics-config.js`:
   ```javascript
   plausible: {
     domain: 'your-domain.com',
     enabled: true,
     apiHost: 'https://plausible.io'
   },
   googleAnalytics: {
     enabled: false
   }
   ```

### No Analytics
To disable all tracking:
1. Set `enabled: false` in analytics-config.js
2. Remove analytics script from index.html
3. Remove consent banner CSS

## Troubleshooting

### Common Issues
1. **Events not showing in GA4**
   - Check tracking ID is correct
   - Verify site is not blocking analytics
   - Check browser console for errors

2. **Consent banner not showing**
   - Check localStorage for existing consent
   - Verify CSS is loading properly
   - Check console for JavaScript errors

3. **Downloads not tracked**
   - Ensure download links have proper attributes
   - Check file paths are correct
   - Verify event listeners are attached

### Debug Mode
Enable debug mode by adding to console:
```javascript
window.analyticsManager.enableDebugMode();
```

## Performance Impact

The analytics system is designed for minimal performance impact:
- Scripts load asynchronously
- Events are batched and sent efficiently
- No blocking of page rendering
- Graceful degradation if analytics fails

## Privacy Best Practices

1. **Minimal Data Collection**
   - Only collect necessary data
   - Use anonymous/pseudonymous identifiers
   - Respect user preferences

2. **Transparency**
   - Clear privacy policy
   - Obvious consent mechanisms
   - Easy opt-out options

3. **Security**
   - HTTPS for all data transmission
   - Regular security updates
   - Secure data storage practices

## Support

For issues with this analytics implementation:
1. Check browser console for errors
2. Verify configuration settings
3. Test in different browsers
4. Check Google Analytics documentation

Remember to test thoroughly before deploying to production!