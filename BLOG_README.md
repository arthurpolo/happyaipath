# Local Blog System Documentation

## Overview

This local blog system allows you to manage blog posts directly on your static website without relying on external platforms like Blogger. All blog data is stored in a simple JSON file that you can edit directly or through a web-based admin interface.

## Files

- **blog-data.json** - Stores all blog posts as JSON
- **blog.html** - Main blog listing page
- **blog-post.html** - Individual blog post page
- **blog-admin.html** - Admin interface for managing posts
- **blog-post-template.html** - Original template (kept for reference)

## Getting Started

### 1. Running Locally

Since this is a static site, you need a local web server to view it. Choose one of these methods:

**Python 3:**
```bash
python3 -m http.server 8000
# Visit: http://localhost:8000
```

**Node.js:**
```bash
npx http-server
# Visit: http://localhost:8080
```

**VS Code:**
- Install "Live Server" extension
- Right-click `index.html` → "Open with Live Server"

### 2. Accessing the Admin Interface

1. Start your local server
2. Navigate to `http://localhost:8000/blog-admin.html` (adjust port as needed)
3. The admin interface will load your existing posts from `blog-data.json`

## Managing Blog Posts

### Creating a New Post

1. Open `blog-admin.html` in your browser
2. Click "New Post" tab or "Create New Post" button
3. Fill in the form:
   - **Title**: Your blog post title
   - **Slug**: URL-friendly version (auto-generated from title)
   - **Author**: Post author (defaults to "Jim Perry")
   - **Date**: Publication date
   - **Thumbnail**: Image path (e.g., `HappyAIPath.png`)
   - **Excerpt**: Short summary (150-200 characters)
   - **Content**: Full HTML content
   - **Categories**: Comma-separated tags
   - **Published**: Check to make post visible on blog
4. Click "Save Post"

### Editing a Post

1. Go to "All Posts" tab
2. Click "Edit" next to the post you want to modify
3. Make your changes
4. Click "Save Post"

### Deleting a Post

1. Go to "All Posts" tab
2. Click "Delete" next to the post
3. Confirm deletion

### Saving Changes Permanently

**IMPORTANT:** Changes in the admin interface are temporary (stored in browser memory). To make them permanent:

1. Go to "Export/Import" tab
2. Click "Generate JSON"
3. Click "Copy to Clipboard"
4. Open `blog-data.json` in your text editor
5. Replace all content with the copied JSON
6. Save the file
7. Refresh your blog to see the changes

## Blog Data Structure

Each post in `blog-data.json` has this structure:

```json
{
  "id": "1",
  "title": "Post Title",
  "slug": "post-title",
  "author": "Jim Perry",
  "date": "2025-01-11",
  "thumbnail": "HappyAIPath.png",
  "excerpt": "Short summary of the post...",
  "content": "<p>Full HTML content...</p>",
  "categories": ["AI Strategy", "Leadership"],
  "published": true
}
```

## Writing Content

### HTML Content

The content field accepts HTML. Use these common tags:

```html
<h2>Heading</h2>
<h3>Subheading</h3>
<p>Paragraph text</p>
<ul>
  <li>List item</li>
</ul>
<a href="https://example.com">Link text</a>
```

### Best Practices

- Keep excerpts between 150-200 characters
- Use descriptive slugs (e.g., "ai-strategy-guide" not "post-1")
- Add relevant categories for organization
- Set `published: false` for drafts
- Use relative paths for images (e.g., `HappyAIPath.png`)

## Manual Editing

You can also edit `blog-data.json` directly in any text editor:

1. Open `blog-data.json`
2. Add/edit/remove posts in the `posts` array
3. Save the file
4. Refresh your blog

**Tip:** Use a JSON validator to check syntax before saving.

## Deploying Changes

When you're ready to publish:

1. Ensure `blog-data.json` is updated
2. Test locally to verify everything works
3. Commit all changes to git
4. Push to your repository
5. Your blog will update automatically

## Reverting to Blogger

If you want to switch back to the Blogger RSS feed:

1. Open `blog.html`
2. Replace the `loadPosts()` function with the original Blogger version
3. The original code fetched from: `https://happyaipath.blogspot.com/feeds/posts/default`

## Troubleshooting

### Posts Not Showing

- Check that `published: true` is set
- Verify `blog-data.json` has valid JSON syntax
- Make sure you're running a local server (not opening files directly)
- Check browser console for errors (F12)

### Admin Interface Not Loading Posts

- Ensure `blog-data.json` is in the same directory
- Check the file has proper JSON structure
- Look for browser console errors

### Changes Not Appearing

- Did you export the JSON and save to `blog-data.json`?
- Clear browser cache and refresh
- Check that you're viewing the correct file (not a cached version)

## Tips

- Use the admin interface for convenience
- Back up `blog-data.json` before major changes
- Test posts as drafts before publishing (`published: false`)
- Keep your JSON file well-formatted for easier manual editing

## Security Note

The admin interface (`blog-admin.html`) has no password protection. If deploying to production:

1. Don't link to it from your main navigation
2. Consider moving it to a subdirectory
3. Use `.htaccess` or server config to password-protect it
4. Or simply don't deploy it (keep it local-only)
