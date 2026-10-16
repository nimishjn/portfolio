import { Education } from '@/components/site/Education'
import { Hero } from '@/components/site/Hero'
import { Service, Writing } from '@/components/site/Lists'
import { Projects } from '@/components/site/Projects'
import { Publications } from '@/components/site/Publications'
import { SiteFooter } from '@/components/site/SiteFooter'
import { SiteHeader } from '@/components/site/SiteHeader'
import { Timeline } from '@/components/site/Timeline'
import { getContent } from '@/lib/content'
import { buildJsonLd } from '@/lib/jsonld'

// Rendered at build time; content edits in /admin revalidate it (see src/hooks/revalidate.ts).
export const dynamic = 'force-static'

export default async function HomePage() {
  const content = await getContent()
  const { profile } = content
  const scholarUrl = profile.links?.find((link) => link.icon === 'scholar')?.url

  return (
    <div className="relative min-h-dvh overflow-x-clip">
      <div className="bgfx" aria-hidden="true">
        <div className="bgfx-grid" />
        <div className="bgfx-glow" />
      </div>

      <a className="pill skip-link" href="#main">
        Skip to content
      </a>
      <SiteHeader name={profile.name} />

      <div className="wrap">
        <main id="main" tabIndex={-1} className="outline-none">
          <Hero profile={profile} hasPdf={Boolean(content.cv.pdf)} />
          <Publications items={content.publications} scholarUrl={scholarUrl} />
          <Education items={content.education} courseAreas={content.courseAreas} />
          <Timeline id="experience" index="03" title="Work experience" items={content.work} delay={0.2} />
          <Timeline id="internships" index="04" title="Internships" items={content.internships} delay={0.24} />
          <Projects items={content.projects} />
          <Service items={content.service} />
          <Writing items={content.writing} />
        </main>
        <SiteFooter profile={profile} />
      </div>

      <script
        type="application/ld+json"
        // JSON-LD is built from CMS content; escape "<" so text can't close the script tag.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildJsonLd(content)).replace(/</g, '\\u003c') }}
      />
    </div>
  )
}
