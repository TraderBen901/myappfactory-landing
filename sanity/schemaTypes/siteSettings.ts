import { defineArrayMember, defineField, defineType } from 'sanity';

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site settings',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Site title', type: 'string', initialValue: 'MyAppFactory' }),
    defineField({
      name: 'defaultLocale',
      title: 'Default locale',
      type: 'string',
      options: { list: [{ title: 'French', value: 'fr' }, { title: 'English', value: 'en' }] },
      initialValue: 'fr',
    }),
    defineField({
      name: 'mainNav',
      title: 'Main navigation',
      type: 'array',
      of: [defineArrayMember({ type: 'link' })],
    }),
    defineField({ name: 'contactEmail', title: 'Contact email', type: 'email' }),
    defineField({ name: 'bookingUrl', title: 'Booking URL', type: 'url' }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'defaultLocale' },
  },
});
