# Tanay Blog Authoring Copilot CLI Skill

This project extension exposes `tanay_blog_authoring_skill` inside GitHub Copilot CLI.

Use it when creating a blog post from notes, PDFs, handwritten material, or a topic description and publishing the result to this Hugo/Vercel blog repo.

The skill captures the end-to-end workflow:

- read notes and existing posts for style,
- write a complete Hugo post,
- add local/static images,
- validate with the Vercel-pinned Hugo version,
- preview locally,
- keep the diff source-only,
- use personal GitHub auth,
- create a normal PR in `tanayjha/blog`.
