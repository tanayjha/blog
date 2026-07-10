import { readFileSync } from "node:fs";
import { joinSession } from "@github/copilot-sdk/extension";

const skillInstructions = readFileSync(new URL("./SKILL.md", import.meta.url), "utf8");

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
                const paths =
                    Array.isArray(args.input_paths) && args.input_paths.length > 0
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
