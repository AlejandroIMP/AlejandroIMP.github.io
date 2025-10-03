import { defineCollection, z } from "astro:content";

const projectsCollection = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string(),
    image: z.string().optional(), // Make image optional
    tags: z.array(z.string()).default([]), // Default empty array
    link: z.string().url(), // Validate URL format
    github: z.string().url(), // Validate URL format
    lang: z.enum(['en', 'es']), // Restrict to supported languages
  }),
})

export const collections = {
  projects: projectsCollection
};