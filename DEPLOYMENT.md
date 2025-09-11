# GitHub Pages Deployment Guide

This guide covers deploying your portfolio website to GitHub Pages with automated deployment using GitHub Actions.

## Repository Setup Options

### Option 1: Username Repository (Recommended)
- Repository name: `username.github.io` (replace `username` with your GitHub username)
- Automatically serves from the root directory
- URL: `https://username.github.io`
- No additional configuration needed

### Option 2: Custom Repository Name
- Repository name: Any name (e.g., `portfolio`, `my-website`)
- Requires GitHub Pages configuration
- URL: `https://username.github.io/repository-name`
- Can use custom domain

## Repository Structure for GitHub Pages

Your repository should have this structure:

```
├── index.html              # Main entry point (required in root)
├── assets/                 # Static assets
│   ├── styles/
│   ├── scripts/
│   ├── images/
│   ├── documents/
│   └── installers/
├── .github/
│   └── workflows/
│       └── deploy.yml      # GitHub Actions workflow
├── CNAME                   # Custom domain (optional)
├── .gitignore
├── README.md
└── package.json            # For build dependencies (if needed)
```

## GitHub Pages Configuration Steps

### Step 1: Create Repository
1. Go to GitHub and create a new repository
2. Choose naming option (username.github.io or custom name)
3. Initialize with README if starting fresh
4. Clone to your local machine

### Step 2: Enable GitHub Pages
1. Go to repository Settings
2. Scroll to "Pages" section
3. Under "Source", select:
   - **For username.github.io**: Deploy from a branch → main → / (root)
   - **For custom repo**: Deploy from a branch → gh-pages → / (root)
4. Save settings

### Step 3: Configure Custom Domain (Optional)
1. In Pages settings, enter your custom domain
2. Enable "Enforce HTTPS"
3. Create CNAME file in repository root with your domain

### Step 4: Verify Deployment
1. Push your code to the main branch
2. Check Actions tab for deployment status
3. Visit your site URL to verify it's working
4. Check for HTTPS certificate (may take a few minutes)

## Custom Domain Setup

If using a custom domain (e.g., `yourname.com`):

1. **Create CNAME file** in repository root:
   ```
   yourname.com
   ```

2. **Configure DNS** with your domain provider:
   - Add CNAME record: `www` → `username.github.io`
   - Add A records for apex domain:
     ```
     185.199.108.153
     185.199.109.153
     185.199.110.153
     185.199.111.153
     ```

3. **Enable HTTPS** in GitHub Pages settings

## Troubleshooting

### Common Issues

1. **404 Error**: Ensure `index.html` is in the root directory
2. **CSS/JS Not Loading**: Check file paths are relative (no leading slash)
3. **Images Not Displaying**: Verify image paths and file extensions
4. **Custom Domain Not Working**: Check DNS propagation (can take 24-48 hours)

### Build Failures
- Check GitHub Actions logs in the Actions tab
- Ensure all file paths are correct
- Verify no broken links or missing files

### Performance Issues
- Optimize images before deployment
- Minimize CSS and JavaScript files
- Use CDN for external resources

## Security Considerations

1. **Never commit sensitive data** (API keys, passwords)
2. **Use environment variables** for configuration
3. **Enable HTTPS** for all deployments
4. **Review file permissions** and access controls

## Monitoring and Analytics

After deployment:
1. Set up Google Analytics or similar
2. Monitor Core Web Vitals
3. Check for broken links regularly
4. Review accessibility compliance

## Backup and Recovery

1. Keep local copies of all content
2. Tag releases for version control
3. Document any custom configurations
4. Maintain deployment logs