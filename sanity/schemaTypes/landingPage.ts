import { defineArrayMember, defineField, defineType } from 'sanity';

export const landingPage = defineType({
  name: 'landingPage',
  title: 'Landing page',
  type: 'document',
  fields: [
    defineField({
      name: 'locale',
      title: 'Locale',
      type: 'string',
      options: { list: [{ title: 'French', value: 'fr' }, { title: 'English', value: 'en' }] },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'object',
      fields: [
        defineField({ name: 'title', title: 'Meta title', type: 'string' }),
        defineField({ name: 'description', title: 'Meta description', type: 'text', rows: 2 }),
      ],
    }),
    defineField({
      name: 'hero',
      title: 'Hero',
      type: 'object',
      fields: [
        defineField({ name: 'eyebrow', title: 'Eyebrow', type: 'string' }),
        defineField({ name: 'title', title: 'Title', type: 'string' }),
        defineField({ name: 'titleAccent', title: 'Title accent', type: 'string' }),
        defineField({ name: 'subtitle', title: 'Subtitle', type: 'text', rows: 3 }),
        defineField({ name: 'primaryCta', title: 'Primary CTA', type: 'link' }),
        defineField({ name: 'secondaryCta', title: 'Secondary CTA', type: 'link' }),
        defineField({ name: 'stats', title: 'Stats', type: 'array', of: [defineArrayMember({ type: 'stat' })], validation: (Rule) => Rule.max(3) }),
      ],
    }),
    defineField({
      name: 'problem',
      title: 'Problem section',
      type: 'object',
      fields: [
        defineField({ name: 'eyebrow', title: 'Eyebrow', type: 'string' }),
        defineField({ name: 'title', title: 'Title', type: 'string' }),
        defineField({ name: 'subtitle', title: 'Subtitle', type: 'text', rows: 2 }),
        defineField({ name: 'cards', title: 'Cards', type: 'array', of: [defineArrayMember({ type: 'card' })] }),
      ],
    }),
    defineField({
      name: 'approach',
      title: 'Approach section',
      type: 'object',
      fields: [
        defineField({ name: 'eyebrow', title: 'Eyebrow', type: 'string' }),
        defineField({ name: 'title', title: 'Title', type: 'string' }),
        defineField({ name: 'subtitle', title: 'Subtitle', type: 'text', rows: 3 }),
        defineField({ name: 'pillars', title: 'Pillars', type: 'array', of: [defineArrayMember({ type: 'card' })] }),
      ],
    }),
    defineField({
      name: 'build',
      title: 'What we build',
      type: 'object',
      fields: [
        defineField({ name: 'eyebrow', title: 'Eyebrow', type: 'string' }),
        defineField({ name: 'title', title: 'Title', type: 'string' }),
        defineField({ name: 'subtitle', title: 'Subtitle', type: 'text', rows: 2 }),
        defineField({ name: 'badge', title: 'Badge label', type: 'string' }),
        defineField({ name: 'categories', title: 'Categories', type: 'array', of: [defineArrayMember({ type: 'card' })] }),
      ],
    }),
    defineField({
      name: 'apps',
      title: 'Apps / proof projects',
      type: 'object',
      fields: [
        defineField({ name: 'eyebrow', title: 'Eyebrow', type: 'string' }),
        defineField({ name: 'title', title: 'Title', type: 'string' }),
        defineField({ name: 'subtitle', title: 'Subtitle', type: 'text', rows: 2 }),
        defineField({ name: 'items', title: 'Items', type: 'array', of: [defineArrayMember({ type: 'appCard' })] }),
      ],
    }),
    defineField({
      name: 'process',
      title: 'Process',
      type: 'object',
      fields: [
        defineField({ name: 'eyebrow', title: 'Eyebrow', type: 'string' }),
        defineField({ name: 'title', title: 'Title', type: 'string' }),
        defineField({ name: 'subtitle', title: 'Subtitle', type: 'text', rows: 2 }),
        defineField({ name: 'steps', title: 'Steps', type: 'array', of: [defineArrayMember({ type: 'processStep' })] }),
      ],
    }),
    defineField({
      name: 'forWho',
      title: 'For who',
      type: 'object',
      fields: [
        defineField({ name: 'eyebrow', title: 'Eyebrow', type: 'string' }),
        defineField({ name: 'title', title: 'Title', type: 'string' }),
        defineField({ name: 'personas', title: 'Personas', type: 'array', of: [defineArrayMember({ type: 'card' })] }),
      ],
    }),
    defineField({
      name: 'training',
      title: 'Training / Academy',
      type: 'object',
      fields: [
        defineField({ name: 'eyebrow', title: 'Eyebrow', type: 'string' }),
        defineField({ name: 'title', title: 'Title', type: 'string' }),
        defineField({ name: 'subtitle', title: 'Subtitle', type: 'text', rows: 3 }),
        defineField({ name: 'academyLabel', title: 'Academy label', type: 'string' }),
        defineField({ name: 'academyTitle', title: 'Academy title', type: 'string' }),
        defineField({ name: 'academyBody', title: 'Academy body', type: 'text', rows: 3 }),
        defineField({ name: 'forWhomLabel', title: 'For whom label', type: 'string' }),
        defineField({ name: 'resultLabel', title: 'Result label', type: 'string' }),
        defineField({ name: 'levels', title: 'Levels', type: 'array', of: [defineArrayMember({ type: 'trainingLevel' })], validation: (Rule) => Rule.max(3) }),
        defineField({ name: 'outcomesTitle', title: 'Outcomes title', type: 'string' }),
        defineField({ name: 'outcomes', title: 'Outcomes', type: 'array', of: [defineArrayMember({ type: 'string' })] }),
        defineField({ name: 'cta', title: 'CTA', type: 'link' }),
      ],
    }),
    defineField({
      name: 'finalCta',
      title: 'Final CTA',
      type: 'object',
      fields: [
        defineField({ name: 'eyebrow', title: 'Eyebrow', type: 'string' }),
        defineField({ name: 'title', title: 'Title', type: 'string' }),
        defineField({ name: 'subtitle', title: 'Subtitle', type: 'text', rows: 3 }),
        defineField({ name: 'expectations', title: 'Expectations', type: 'array', of: [defineArrayMember({ type: 'string' })] }),
      ],
    }),
  ],
  preview: {
    select: { title: 'seo.title', subtitle: 'locale' },
    prepare({ title, subtitle }) {
      return { title: title || 'Landing page', subtitle };
    },
  },
});
