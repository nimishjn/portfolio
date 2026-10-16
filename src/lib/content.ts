import config from '@payload-config'
import { getPayload } from 'payload'
import { cache } from 'react'

import { courseAreas, type CourseArea } from '@/collections/Courses'
import type { Course, Media } from '@/payload-types'

/**
 * Everything the site renders, in one round trip. Wrapped in React's cache so the page,
 * its metadata and the OG image share a single set of queries per render.
 */
export const getContent = cache(async () => {
  const payload = await getPayload({ config })
  // Depth 0 by default; collections with an organisation logo populate it (depth: 1).
  const list = { depth: 0, limit: 200, pagination: false } as const

  const [profile, cv, publications, experiences, education, courses, projects, service, writing] = await Promise.all([
    payload.findGlobal({ slug: 'profile', depth: 1 }),
    payload.findGlobal({ slug: 'cv', depth: 0 }),
    payload.find({ collection: 'publications', sort: ['sortOrder', '-year'], ...list }),
    payload.find({ collection: 'experiences', sort: ['sortOrder', '-startDate'], ...list, depth: 1 }),
    payload.find({ collection: 'education', sort: ['sortOrder', '-startDate'], ...list, depth: 1 }),
    payload.find({ collection: 'courses', sort: 'sortOrder', ...list }),
    payload.find({ collection: 'projects', sort: ['sortOrder', '-year'], ...list }),
    payload.find({ collection: 'service', sort: 'sortOrder', ...list, depth: 1 }),
    payload.find({ collection: 'writing', sort: '-date', ...list }),
  ])

  return {
    profile,
    cv,
    publications: publications.docs,
    work: experiences.docs.filter((item) => item.kind === 'work'),
    internships: experiences.docs.filter((item) => item.kind === 'internship'),
    education: education.docs,
    courseAreas: groupCourses(courses.docs),
    projects: projects.docs,
    service: service.docs,
    writing: writing.docs,
  }
})

export type Content = Awaited<ReturnType<typeof getContent>>

export type CourseGroup = {
  area: CourseArea
  label: string
  credits: number
  courses: Course[]
}

/** Groups courses by area, in the fixed area order, dropping empty areas. */
export function groupCourses(courses: Course[]): CourseGroup[] {
  return courseAreas
    .map(({ value, label }) => {
      const inArea = courses.filter((course) => course.area === value)
      return {
        area: value,
        label,
        credits: inArea.reduce((sum, course) => sum + course.credits, 0),
        courses: inArea,
      }
    })
    .filter((group) => group.courses.length > 0)
}

/** The portrait upload, when one has been set. */
export function portraitOf(portrait: number | Media | null | undefined) {
  return portrait && typeof portrait === 'object' && portrait.url ? portrait : null
}

/** URL of an uploaded logo, when one is set and populated. */
export function logoUrlOf(logo: number | Media | null | undefined) {
  return logo && typeof logo === 'object' && logo.url ? logo.url : undefined
}
