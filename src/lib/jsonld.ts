import type { Publication } from '@/payload-types'

import { portraitOf, type Content } from './content'
import { doiUrl } from './format'
import { siteUrl } from './site'

const ids = {
  website: `${siteUrl}/#website`,
  profilePage: `${siteUrl}/#profilepage`,
  person: `${siteUrl}/#person`,
}

const absolute = (url: string) => new URL(url, siteUrl).toString()

/** Where each kind of publication appeared, in schema.org terms. */
function container(item: Publication) {
  const type = item.type === 'Article' ? 'Periodical' : item.type === 'Book chapter' ? 'Book' : 'CreativeWork'
  return { '@type': type, name: item.venue }
}

/**
 * schema.org graph for the home page: the site, the profile page, the person it is about,
 * and their publications, all linked by @id.
 */
export function buildJsonLd({ profile, publications, education, work }: Content) {
  const current = work.find((item) => !item.endDate)
  // Found by address, so it doesn't depend on which icon the link uses.
  const orcid = profile.links?.find((link) => /^https?:\/\/(www\.)?orcid\.org\//.test(link.url))?.url
  const portrait = portraitOf(profile.portrait)

  const person = {
    '@type': 'Person',
    '@id': ids.person,
    name: profile.name,
    url: siteUrl,
    email: `mailto:${profile.email}`,
    description: profile.metaDescription,
    jobTitle: profile.jobTitle,
    ...(portrait?.url ? { image: absolute(portrait.url) } : {}),
    worksFor: {
      '@type': 'Organization',
      name: profile.employer,
      ...(current?.orgUrl ? { url: current.orgUrl } : {}),
    },
    alumniOf: education.map((item) => ({
      '@type': item.featured ? 'CollegeOrUniversity' : 'EducationalOrganization',
      name: item.institution,
      ...(item.institutionUrl ? { url: item.institutionUrl } : {}),
    })),
    knowsAbout: profile.researchInterests?.map((interest) => interest.label),
    sameAs: profile.links?.map((link) => link.url),
    ...(orcid
      ? { identifier: { '@type': 'PropertyValue', propertyID: 'ORCID', value: orcid.split('/').pop(), url: orcid } }
      : {}),
  }

  const website = {
    '@type': 'WebSite',
    '@id': ids.website,
    url: siteUrl,
    name: profile.name,
    inLanguage: 'en',
    publisher: { '@id': ids.person },
  }

  const profilePage = {
    '@type': 'ProfilePage',
    '@id': ids.profilePage,
    url: siteUrl,
    name: profile.seoTitle || profile.name,
    inLanguage: 'en',
    isPartOf: { '@id': ids.website },
    mainEntity: { '@id': ids.person },
    ...(profile.updatedAt ? { dateModified: profile.updatedAt } : {}),
  }

  const articles = publications.map((item) => ({
    '@type': 'ScholarlyArticle',
    '@id': doiUrl(item.doi),
    url: doiUrl(item.doi),
    headline: item.title,
    name: item.title,
    datePublished: String(item.year),
    inLanguage: 'en',
    author: item.authors.map((author) => (author.isMe ? { '@id': ids.person } : { '@type': 'Person', name: author.full })),
    publisher: { '@type': 'Organization', name: item.publisherFull || item.publisher },
    isPartOf: container(item),
    identifier: { '@type': 'PropertyValue', propertyID: 'DOI', value: item.doi },
    ...(item.preprintUrl ? { sameAs: item.preprintUrl } : {}),
    abstract: item.summary,
  }))

  return { '@context': 'https://schema.org', '@graph': [website, profilePage, person, ...articles] }
}
