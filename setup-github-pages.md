# GitHub Pages Setup Checklist

Follow this checklist to set up your portfolio for GitHub Pages deployment.

## Pre-Deployment Checklist

### 1. Repository Setup
- [ ] Create GitHub repository with appropriate name:
  - [ ] Option A: `username.github.io` (replace with your GitHub username)
  - [ ] Option B: Custom name (e.g., `portfolio`, `my-website`)
- [ ] Clone repository to local machine
- [ ] Ensure `index.html` is in the root directory
- [ ] Verify all asset paths are relative (no leading slashes)

### 2. Content Preparation
- [ ] Replace placeholder content with your information
- [ ] Add your professional headshot to `assets/images/`
- [ ] Upload your resume to `assets/documents/`
- [ ] Update project information and links
- [ ] Add installer files to `assets/installers/` (if applicable)
- [ ] Test all links and downloads locally

### 3. GitHub Pages Configuration
- [ ] Push initial code to GitHub
- [ ] Go to repository Settings → Pages
- [ ] Configure source:
  - [ ] For `username.github.io`: Deploy from branch → main → / (root)
  - [ ] For custom repo: Deploy from branch → gh-pages → / (root)
- [ ] Save settings and note the provided URL

### 4. Custom Domain (Optional)
- [ ] Purchase and configure domain with DNS provider
- [ ] Create `CNAME` file in repository root with your domain
- [ ] Add DNS records:
  - [ ] CNAME record: `www` → `username.github.io`
  - [ ] A records for apex domain (see DEPLOYMENT.md)
- [ ] Enable "Enforce HTTPS" in GitHub Pages settings
- [ ] Wait for DNS propagation (24-48 hours)

### 5. Testing and Verification
- [ ] Visit your GitHub Pages URL
- [ ] Test all navigation links
- [ ] Verify embedded demos work
- [ ] Test download links for installers/resume
- [ ] Check mobile responsiveness
- [ ] Verify HTTPS certificate is active
- [ ] Test form submission (if applicable)

## Post-Deployment Tasks

### Performance Optimization
- [ ] Run Lighthouse audit
- [ ] Optimize images for web
- [ ] Minimize CSS and JavaScript
- [ ] Set up analytics tracking

### Accessibility Testing
- [ ] Test keyboard navigation
- [ ] Verify screen reader compatibility
- [ ] Check color contrast ratios
- [ ] Validate HTML markup

### SEO Optimization
- [ ] Add meta descriptions
- [ ] Implement structured data
- [ ] Submit sitemap to search engines
- [ ] Set up Google Search Console

## Maintenance Schedule

### Weekly
- [ ] Check for broken links
- [ ] Review analytics data
- [ ] Update project information as needed

### Monthly
- [ ] Update certifications and skills
- [ ] Review and update resume
- [ ] Check for security updates

### Quarterly
- [ ] Perform full accessibility audit
- [ ] Update project screenshots
- [ ] Review and optimize performance

## Emergency Procedures

### Site Down
1. Check GitHub Pages status
2. Verify DNS configuration
3. Check repository settings
4. Review recent commits for issues

### Broken Links
1. Use link checker tool
2. Update or remove broken links
3. Test all downloads
4. Verify external project links

### Performance Issues
1. Run Lighthouse audit
2. Optimize large images
3. Review third-party scripts
4. Check CDN performance

## Support Resources

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [Custom Domain Setup](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site)
- [Troubleshooting Guide](https://docs.github.com/en/pages/getting-started-with-github-pages/troubleshooting-404-errors-for-github-pages-sites)
- [DNS Configuration Help](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site)