# Images Directory

This directory contains all image assets for the portfolio website.

## Structure:
- `headshot.webp` - Professional headshot for hero section
- `projects/` - Project screenshots and demos
- `icons/` - Skill icons and social media icons
- `badges/` - Certification badges
- `placeholders/` - Placeholder images for development

## Image Optimization Guidelines:
- Use WebP format for photos with JPEG fallbacks
- Optimize images for web (80% quality for photos)
- Include responsive image sizes using srcset
- Add descriptive alt text for accessibility

## GitHub Pages Image Handling:

### Best Practices for GitHub Pages:
1. **Use Relative Paths**: Always use relative paths without leading slashes (e.g., `assets/images/file.jpg` not `/assets/images/file.jpg`)
2. **SVG Placeholders**: Include inline SVG placeholders as fallbacks
3. **Lazy Loading Pattern**: Use the following pattern for images:
   ```html
   <picture>
     <source data-srcset="assets/images/image.webp" type="image/webp">
     <img data-src="assets/images/image.jpg"
          src="[base64 placeholder or placeholder SVG file path]"
          alt="Description"
          loading="lazy">
   </picture>
   ```
4. **Case Sensitivity**: Ensure file extensions match exactly (JPG vs jpg)
5. **Placeholder Strategy**: Use SVG placeholders in the `placeholders/` directory as reliable fallbacks

### Troubleshooting:
- If images show as GitHub Pages placeholders, check that the file exists and paths are correct
- Verify that the repository is properly configured for GitHub Pages
- For critical images, consider using inline SVG or base64 encoding