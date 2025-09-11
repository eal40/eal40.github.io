# Development Guide

## Local Development Setup

### Prerequisites
- Git installed on your system
- Node.js (optional, for live-server)
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Quick Start

1. **Clone the repository**:
   ```bash
   git clone https://github.com/eal40/eal40.github.io.git
   cd eal40.github.io
   ```

2. **Install development dependencies** (optional):
   ```bash
   npm install
   ```

3. **Start local development server**:
   
   **Option A: Using npm script (recommended)**
   ```bash
   npm run dev
   ```
   
   **Option B: Using live-server directly**
   ```bash
   npx live-server --port=3000 --open=/
   ```
   
   **Option C: Simple file opening**
   - Open `index.html` directly in your browser
   - Note: Some features may not work due to CORS restrictions

4. **Access the website**:
   - Open http://localhost:3000 in your browser
   - The page will automatically reload when you make changes

### Development Workflow

1. **Make changes** to HTML, CSS, or JavaScript files
2. **Save files** - live-server will automatically reload the browser
3. **Test changes** across different screen sizes and browsers
4. **Commit changes** when ready:
   ```bash
   git add .
   git commit -m "Description of changes"
   ```

### File Structure for Development

```
├── index.html              # Main HTML - edit content here
├── assets/
│   ├── styles/
│   │   └── main.css       # Main styles - customize appearance
│   ├── scripts/
│   │   └── main.js        # JavaScript functionality
│   ├── images/            # Add your images here
│   ├── documents/         # Add resume and other documents
│   └── installers/        # Add desktop app installers
```

### Customization Checklist

- [ ] Replace "Student Name" with your actual name in all files
- [ ] Add your professional headshot to `assets/images/`
- [ ] Update personal information in `index.html`
- [ ] Add your resume to `assets/documents/`
- [ ] Customize colors in CSS custom properties (`:root` section)
- [ ] Update repository URLs in `package.json`
- [ ] Add your actual projects, skills, and certifications

### Testing

- **Cross-browser testing**: Test in Chrome, Firefox, Safari, Edge
- **Responsive testing**: Use browser dev tools to test mobile/tablet views
- **Accessibility testing**: Use browser accessibility tools
- **Performance testing**: Use Lighthouse in Chrome DevTools

### GitHub Repository Setup

✅ **Repository already connected**: `eal40.github.io`

**Push your changes**:
```bash
git push -u origin main
```

**GitHub Pages**:
- GitHub Pages is automatically enabled for `username.github.io` repositories
- No additional setup required in repository settings
- Site automatically deploys from the main branch
- Access your deployed site at: `https://eal40.github.io`

**Future updates**:
```bash
git add .
git commit -m "Your commit message"
git push origin main
```

### Troubleshooting

**Live server not working?**
- Make sure Node.js is installed
- Try: `npm install -g live-server`
- Alternative: Use VS Code Live Server extension

**Images not loading?**
- Check file paths are correct
- Ensure images are in `assets/images/` directory
- Use relative paths starting with `assets/`

**Styles not applying?**
- Check CSS file path in `index.html`
- Clear browser cache (Ctrl+F5 or Cmd+Shift+R)
- Check browser console for errors

**Git issues?**
- Make sure Git is installed and configured
- Set up Git credentials: `git config --global user.name "Your Name"`
- Set up email: `git config --global user.email "your.email@example.com"`