# Portfolio Website

A modern, responsive portfolio website for undergraduate students seeking internship opportunities.

## Features

- **Responsive Design**: Mobile-first approach with clean, professional aesthetics
- **Interactive Projects**: Embedded demos for web projects and direct downloads for desktop applications
- **Skills Visualization**: Dynamic skill proficiency indicators
- **Certifications Display**: Easy-to-update certification management system
- **Accessibility**: WCAG 2.1 AA compliant with keyboard navigation support
- **Performance Optimized**: Fast loading with image optimization and lazy loading

## Project Structure

```
├── index.html                 # Main HTML file
├── assets/
│   ├── styles/
│   │   └── main.css          # Main stylesheet
│   ├── scripts/
│   │   └── main.js           # Main JavaScript file
│   ├── images/               # Image assets
│   │   └── placeholders/     # Placeholder images
│   ├── documents/            # Downloadable documents (resume, etc.)
│   └── installers/           # Desktop app installers
├── .gitignore               # Git ignore rules
└── README.md               # This file
```

## Development Setup

1. Clone the repository
2. Open `index.html` in a web browser or use a local development server
3. For live reloading during development, use a tool like Live Server (VS Code extension)

## Deployment

This website is designed for deployment on GitHub Pages with automated CI/CD:

### Quick Start
1. Create GitHub repository (recommended: `username.github.io`)
2. Push code to main branch
3. Enable GitHub Pages in repository settings
4. Site automatically deploys and updates on each push

### Detailed Setup
See [DEPLOYMENT.md](DEPLOYMENT.md) for comprehensive deployment instructions including:
- Repository configuration options
- Custom domain setup
- GitHub Actions automation
- Troubleshooting guide

### Repository Options
- **Username repo**: `username.github.io` → `https://username.github.io`
- **Custom repo**: `portfolio` → `https://username.github.io/portfolio`
- **Custom domain**: Configure CNAME for your own domain

For step-by-step setup, follow the [GitHub Pages Setup Checklist](setup-github-pages.md).

## Customization

1. Replace placeholder content in `index.html`
2. Add your professional headshot to `assets/images/`
3. Update personal information and projects
4. Add your resume to `assets/documents/`
5. Customize colors and styling in `assets/styles/main.css`

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance

- Target Lighthouse scores: 90+ in all categories
- Optimized images with WebP format
- Minimal JavaScript for fast loading
- CSS Grid and Flexbox for efficient layouts

## Accessibility

- Semantic HTML5 structure
- ARIA labels and roles
- Keyboard navigation support
- Screen reader compatible
- High contrast ratios

## License

This project is open source and available under the [MIT License](LICENSE).