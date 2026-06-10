import { defineArrayMember, defineField, defineType } from 'sanity';

export const link = defineType({
  name: 'link',
  title: 'Link',
  type: 'object',
  fields: [
    defineField({ name: 'label', title: 'Label', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({ name: 'href', title: 'URL / Anchor', type: 'string', validation: (Rule) => Rule.required() }),
  ],
  preview: {
    select: { title: 'label', subtitle: 'href' },
  },
});

export const stat = defineType({
  name: 'stat',
  title: 'Stat',
  type: 'object',
  fields: [
    defineField({ name: 'value', title: 'Value', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({ name: 'label', title: 'Label', type: 'string', validation: (Rule) => Rule.required() }),
  ],
  preview: {
    select: { title: 'value', subtitle: 'label' },
  },
});

export const card = defineType({
  name: 'card',
  title: 'Card',
  type: 'object',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({ name: 'body', title: 'Body', type: 'text', rows: 3, validation: (Rule) => Rule.required() }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'body' },
  },
});

export const appCard = defineType({
  name: 'appCard',
  title: 'App / Case study',
  type: 'object',
  fields: [
    defineField({ name: 'name', title: 'Name', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({ name: 'category', title: 'Category', type: 'string' }),
    defineField({ name: 'description', title: 'Description', type: 'text', rows: 3 }),
    defineField({ name: 'cta', title: 'CTA label', type: 'string' }),
    defineField({ name: 'url', title: 'URL', type: 'url' }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'category' },
  },
});

export const processStep = defineType({
  name: 'processStep',
  title: 'Process step',
  type: 'object',
  fields: [
    defineField({ name: 'number', title: 'Number', type: 'string' }),
    defineField({ name: 'title', title: 'Title', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({ name: 'duration', title: 'Duration', type: 'string' }),
    defineField({ name: 'body', title: 'Body', type: 'text', rows: 3 }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'duration' },
  },
});

export const trainingLevel = defineType({
  name: 'trainingLevel',
  title: 'Training level',
  type: 'object',
  fields: [
    defineField({ name: 'label', title: 'Label', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({ name: 'title', title: 'Title', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({ name: 'duration', title: 'Duration', type: 'string' }),
    defineField({ name: 'body', title: 'Body', type: 'text', rows: 4 }),
    defineField({ name: 'audience', title: 'For whom', type: 'text', rows: 2 }),
    defineField({ name: 'result', title: 'Result', type: 'text', rows: 2 }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'label' },
  },
});

export const richText = defineType({
  name: 'richText',
  title: 'Rich text',
  type: 'array',
  of: [
    defineArrayMember({ type: 'block' }),
  ],
});
