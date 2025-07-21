# GoDaddy Deployment Guide

## Files to Upload
Upload ALL files from the `dist` folder to your GoDaddy `public_html` directory:

### Required Files:
- `index.html` (main HTML file)
- `.htaccess` (for React Router support)
- `assets/` folder (contains all CSS, JS, fonts, and images)

### File Structure on GoDaddy:
```
public_html/
├── index.html
├── .htaccess
└── assets/
    ├── index-BGc39Nn-.css
    ├── index-pSbEoF-p.js
    ├── DOTMATRI-DinwS7HJ.TTF
    └── asterisk-Bm6-0iRt.svg
```

## Upload Methods

### Method 1: GoDaddy File Manager
1. Log into GoDaddy hosting control panel
2. Open File Manager
3. Navigate to `public_html` folder
4. Upload all files from `dist` folder
5. Ensure `.htaccess` is uploaded (hidden file)

### Method 2: FTP Upload
1. Get FTP credentials from GoDaddy
2. Use FTP client (FileZilla, Cyberduck)
3. Connect to your server
4. Upload `dist` contents to `public_html`

## Important Notes

### React Router Support
- The `.htaccess` file handles client-side routing
- All routes will redirect to `index.html`
- This enables your app's navigation to work properly

### Performance Optimization
- Static assets are cached for 1 year
- Gzip compression is enabled
- Your app will load faster

### Domain Configuration
- Your app will be available at your GoDaddy domain
- Example: `https://yourdomain.com`

## Troubleshooting

### If app doesn't load:
1. Check that all files are uploaded
2. Ensure `.htaccess` is in the root directory
3. Verify file permissions (644 for files, 755 for folders)

### If routing doesn't work:
1. Confirm `.htaccess` is uploaded
2. Check that mod_rewrite is enabled on your hosting
3. Contact GoDaddy support if needed

## Testing
After upload, visit your domain to test:
- Blog functionality
- Game mode
- Drawing canvas
- All interactive features 