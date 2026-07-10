import { joinSession } from "@github/copilot-sdk/extension";

const skillInstructions = String.raw`
# Tanay Blog Authoring Skill

Use this skill when the user asks to create, draft, port, publish, or add a blog post to Tanay Jha's personal Hugo blog.

## Purpose

Turn a blog idea plus supporting inputs into a complete, reviewed blog post PR in \`tanayjha/blog\`. Inputs can be free-form text, existing Markdown, images, web links, PDFs, or handwritten notes in PDFs.

## Default behavior

- Treat this as a personal project workflow, not a LinkedIn workflow.
- For personal projects, create normal/open PRs by default. Do not create draft PRs unless the user explicitly asks for a draft.
- Use the personal GitHub account \`tanayjha\`, not any LinkedIn GitHub account.
- Follow Tanay's existing blog writing style by default: first-person, conversational, math/CS explanation, concise sections, enough rigor without sounding academic or AI-written.
- Prefer original diagrams generated locally over third-party web images. If using external images, verify license/source and save them under \`static/images/<slug>/\`.
- Do not commit generated Hugo \`public/\` output unless the repo already requires it for deployment. For this repo, commit source content and static assets only.

## Repositories and hosting

- Blog source repo: \`~/Documents/Playground/repos/blog\`
- Live blog: \`https://tanayjha-blog.vercel.app/blog/\`
- Main personal website repo: \`~/Documents/Playground/repos/tanayjha.github.io\`
- Main site: \`https://tanayjha.github.io/\`
- The React main site links to the Vercel blog. New blog posts go to \`tanayjha/blog\`, not \`tanayjha.github.io\`.

## Required workflow

1. Understand the requested blog.
   - Read all provided text/files.
   - For PDFs, first try text extraction. If the PDF is scanned/handwritten, use local OCR or image inspection; do not upload notes to third-party services.
   - Ask only if the inclusion/exclusion scope is genuinely ambiguous.

2. Study writing style.
   - Read several existing posts under \`content/blog/\`, especially math/CS posts such as \`birthday-paradox.md\`, \`chinese-remainder-theorem.md\`, \`fermats-little-theorem.md\`, \`rsa-encryption.md\`, and \`infiniteQueens.md\`.
   - Emulate tone and structure without copying unrelated content.

3. Draft the blog.
   - Create or update a Markdown post with Hugo front matter:
     \`\`\`yaml
     ---
     title: "Post Title"
     date: <current local timestamp with +05:30>
     draft: false
     showToc: true
     ShowReadingTime: true
     ---
     \`\`\`
   - Use slug-style filename under \`content/blog/<slug>.md\`.
   - Use Hugo static image paths like \`/images/<slug>/<file>\`.
   - Put images in \`static/images/<slug>/\`.
   - Use raw HTML \`<sub>\` and \`<sup>\` for simple inline math notation if consistent with existing posts.
   - If raw HTML math is used, ensure \`config.toml\` contains:
     \`\`\`toml
     [markup]
       [markup.goldmark]
         [markup.goldmark.renderer]
           unsafe = true
     \`\`\`

4. Validate content.
   - Fact-check mathematical and historical claims.
   - For math-heavy posts, run a separate proofread/review pass focused on mathematical correctness.
   - Check all image references resolve in the built site.

5. Build and preview locally.
   - The production Hugo version is pinned in \`vercel.json\` as \`HUGO_VERSION\`.
   - Prefer the pinned version over the system Hugo version. If needed, download the official Hugo release to session storage, not into the repo.
   - Initialize the theme submodule before previewing:
     \`\`\`bash
     git submodule update --init --recursive
     \`\`\`
   - Build with:
     \`\`\`bash
     hugo --gc --minify --destination /tmp/<slug>-blog-build --cleanDestinationDir
     \`\`\`
   - Serve with:
     \`\`\`bash
     hugo server -D --bind 127.0.0.1 --port <free-port> --disableFastRender --noHTTPCache
     \`\`\`
   - Verify via HTTP that:
     - \`/blog/<slug>/\` returns 200.
     - Each \`/images/<slug>/...\` asset returns 200.
     - Important rendered syntax is present in generated HTML.

6. Keep the git diff source-only.
   - If local Hugo preview modified \`public/\`, clean it before committing:
     \`\`\`bash
     git restore -- public
     git clean -fd -- public
     \`\`\`
   - Stage specific files only.
   - Do not stage secrets, local tools, temporary OCR outputs, or generated build directories.

7. Use personal GitHub authentication.
   - Confirm \`gh auth status -a\` shows active account \`tanayjha\`.
   - If it shows a LinkedIn account, run:
     \`\`\`bash
     gh auth login --hostname github.com --git-protocol https --web
     gh auth setup-git -h github.com
     \`\`\`
     Ask the user to complete browser/device login as \`tanayjha\`.
   - Ensure the repo remote is clean and does not embed tokens:
     \`\`\`bash
     git remote set-url origin https://github.com/tanayjha/blog.git
     \`\`\`
   - Never paste or store a PAT in shell history, git remotes, commits, or PR bodies.

8. Commit and create PR.
   - Branch naming: \`tanayjha/<short-kebab-description>\`.
   - Commit message example: \`Add <topic> blog post\`.
   - Push branch to \`origin\`.
   - Create a normal/open PR by default:
     \`\`\`bash
     gh pr create --base main --head <branch> --title "<title>" --body-file /tmp/<slug>-pr-body.md
     \`\`\`
   - Only add \`--draft\` if the user explicitly requests a draft PR.
   - PR body should include:
     \`\`\`markdown
     ## Summary
     - Added the <topic> blog post.
     - Added supporting images/assets under \`static/images/<slug>/\`.
     - Mention any config changes, such as Goldmark unsafe rendering.

     ## Testing Done
     - Built with the production-pinned Hugo version from \`vercel.json\`.
     - Served locally and verified the post and assets returned HTTP 200.
     - Verified key rendered math/image snippets in generated HTML.
     \`\`\`

## Output expected from the agent

The final output should be a GitHub PR URL for \`tanayjha/blog\`, plus a concise note of the local validation performed.
`;

await joinSession({
    tools: [
        {
            name: "tanay_blog_authoring_skill",
            description:
                "Instructions for creating, validating, and publishing Tanay Jha personal blog posts to the Hugo/Vercel blog repo. Use for blog writing requests with text, files, PDFs, or handwritten notes.",
            parameters: {
                type: "object",
                properties: {
                    blog_description: {
                        type: "string",
                        description:
                            "What blog should be written or published, including topic, scope, audience, and requested structure.",
                    },
                    input_paths: {
                        type: "array",
                        description:
                            "Optional local file paths for source material such as Markdown drafts, PDFs, handwritten notes, or images.",
                        items: { type: "string" },
                    },
                    additional_instructions: {
                        type: "string",
                        description:
                            "Optional extra constraints such as sections to include/skip, math rigor, or publication preferences.",
                    },
                },
                required: ["blog_description"],
            },
            handler: async (args) => {
                const paths = Array.isArray(args.input_paths) && args.input_paths.length > 0
                    ? args.input_paths.map((path) => `- ${path}`).join("\n")
                    : "- none provided";
                return `${skillInstructions}

## Skill input for this invocation

Description:
${args.blog_description}

Input paths:
${paths}

Additional instructions:
${args.additional_instructions || "none provided"}`;
            },
        },
    ],
});
