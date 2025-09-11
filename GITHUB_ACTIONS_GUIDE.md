# GitHub Actions Deployment Guide

This guide explains the automated deployment system set up for your portfolio website using GitHub Actions.

## Overview

The portfolio uses multiple GitHub Actions workflows for:
- **Continuous Integration/Continuous Deployment (CI/CD)**
- **Automated optimization and deployment**
- **Custom domain configuration**
- **Post-deployment testing**

## Workflows

### 1. Main Deployment (`deploy.yml`)

**Trigger**: Push to `main` branch or manual dispatch

**What it does**:
- Optimizes images, CSS, and JavaScript
- Generates sitemap automatically
- Deploys to GitHub Pages
- Provides deployment URL

**Configuration**:
```yaml
# Runs on every push to main
on:
  push:
    branches: ["main"]
  workflow_dispatch:
```

### 2. CI/CD Pipeline (`ci-cd.yml`)

**Trigger**: Push to `main`/`develop` or pull requests

**What it does**:
- Runs tests and linting
- Validates HTML and accessibility
- Performs Lighthouse audits
- Optimizes assets for production
- Deploys only from `main` branch

**Key Features**:
- Asset optimization (CSS/JS minification)
- Image optimization
- Performance testing
- Build artifact generation

### 3. Custom Domain Setup (`custom-domain.yml`)

**Trigger**: Manual workflow dispatch

**What it does**:
- Creates CNAME file with your domain
- Generates DNS configuration instructions
- Provides step-by-step setup guide
- Commits changes automatically

**Usage**:
1. Go to Actions tab in your repository
2. Select "Custom Domain Setup"
3. Click "Run workflow"
4. Enter your domain name
5. Follow generated instructions

### 4. Deployment Testing (`test-deployment.yml`)

**Trigger**: After successful deployment or manual

**What it does**:
- Tests site accessibility and HTTPS
- Validates page content and navigation
- Checks asset loading
- Runs Lighthouse performance audit
- Generates deployment report

## Setup Instructions

### Initial Setup

1. **Enable GitHub Pages**:
   ```
   Repository Settings → Pages → Source: GitHub Actions
   ```

2. **Configure Repository Secrets** (if needed):
   - No secrets required for basic deployment
   - Add `CUSTOM_DOMAIN` if using custom domain

3. **Verify Workflows**:
   - Check `.github/workflows/` directory exists
   - Ensure workflows have proper permissions

### First Deployment

1. **Push to main branch**:
   ```bash
   git add .
   git commit -m "Initial deployment setup"
   git push origin main
   ```

2. **Monitor deployment**:
   - Go to Actions tab
   - Watch "Deploy Portfolio to GitHub Pages" workflow
   - Check for any errors

3. **Verify site**:
   - Visit your GitHub Pages URL
   - Test all functionality
   - Check browser console for errors

## Customization

### Modifying Build Process

Edit `.github/workflows/ci-cd.yml`:

```yaml
- name: Optimize assets
  run: |
    # Add your custom build commands here
    npm run build
    # Custom optimization steps
```

### Adding Environment Variables

Add to workflow files:

```yaml
env:
  NODE_ENV: production
  CUSTOM_VAR: ${{ secrets.CUSTOM_VAR }}
```

### Custom Domain Automation

Use the custom domain workflow:

1. Run "Custom Domain Setup" workflow
2. Enter your domain
3. Follow generated DNS instructions
4. Enable HTTPS in repository settings

## Monitoring and Maintenance

### Deployment Status

Monitor deployments:
- **Actions tab**: View workflow runs
- **Environments**: Check deployment history
- **Pages settings**: Verify domain status

### Performance Monitoring

Automated checks include:
- Lighthouse performance audits
- Accessibility compliance
- SEO optimization
- Core Web Vitals

### Troubleshooting

#### Common Issues

1. **Deployment fails**:
   - Check Actions logs
   - Verify file paths
   - Ensure no syntax errors

2. **Assets not loading**:
   - Check relative paths (no leading `/`)
   - Verify file names and extensions
   - Check build optimization step

3. **Custom domain issues**:
   - Verify DNS configuration
   - Check CNAME file content
   - Wait for DNS propagation

#### Debug Steps

1. **Check workflow logs**:
   ```
   Actions → Failed workflow → View logs
   ```

2. **Test locally**:
   ```bash
   npm start
   npm run test:deployment:local
   ```

3. **Validate HTML**:
   ```bash
   npm install -g html-validate
   html-validate index.html
   ```

## Advanced Configuration

### Custom Build Steps

Add to `package.json`:

```json
{
  "scripts": {
    "prebuild": "echo 'Pre-build tasks'",
    "build": "npm run build:css && npm run build:js",
    "postbuild": "echo 'Post-build tasks'"
  }
}
```

### Environment-Specific Builds

Create different workflows for staging/production:

```yaml
# .github/workflows/staging.yml
on:
  push:
    branches: ["develop"]

jobs:
  deploy-staging:
    # Deploy to staging environment
```

### Security Considerations

1. **Secrets Management**:
   - Use repository secrets for sensitive data
   - Never commit API keys or passwords

2. **Permissions**:
   - Workflows use minimal required permissions
   - Review and audit regularly

3. **Dependencies**:
   - Keep Actions versions updated
   - Monitor for security vulnerabilities

## Performance Optimization

### Automated Optimizations

The workflows automatically:
- Minify CSS and JavaScript
- Optimize images
- Generate compressed assets
- Create efficient caching headers

### Manual Optimizations

Additional steps you can add:
- Image format conversion (WebP/AVIF)
- Critical CSS inlining
- Resource preloading
- Service worker implementation

## Support and Resources

### GitHub Documentation
- [GitHub Pages](https://docs.github.com/en/pages)
- [GitHub Actions](https://docs.github.com/en/actions)
- [Custom Domains](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site)

### Tools and Testing
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [Web.dev](https://web.dev/) - Performance best practices
- [PageSpeed Insights](https://pagespeed.web.dev/)

### Community Resources
- [GitHub Community](https://github.community/)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/github-actions)
- [GitHub Actions Marketplace](https://github.com/marketplace?type=actions)