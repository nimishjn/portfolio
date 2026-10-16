import type { CSSProperties } from 'react'

import { logoUrlOf, type CourseGroup } from '@/lib/content'
import { formatSiteRange, monogram } from '@/lib/format'
import type { Education as EducationItem } from '@/payload-types'

import { Disclosure } from './Disclosure'
import { OrgTile } from './OrgTile'
import { Section } from './Section'
import { SpotlightCard } from './SpotlightCard'

export function Education({ items, courseAreas }: { items: EducationItem[]; courseAreas: CourseGroup[] }) {
  const featured = items.find((item) => item.featured)
  const rest = items.filter((item) => item !== featured)

  return (
    <Section id="education" index="02" title="Education" delay={0.14}>
      {featured && <FeaturedDegree item={featured} courseAreas={courseAreas} />}
      {rest.length > 0 && (
        <div className="mt-1.5">
          {rest.map((item) => (
            <div
              key={item.id}
              className="flex flex-wrap items-baseline gap-x-6 gap-y-0.5 border-b border-line py-[18px] last:border-b-0"
            >
              <span className="flex-[0_0_10.5rem] font-mono text-[12.5px] text-muted">
                {formatSiteRange(item.startDate, item.endDate, 'year')}
              </span>
              <span className="min-w-0 flex-[999_1_260px]">
                <span className="block text-[15.5px] leading-normal font-medium">
                  {[item.qualification, item.board].filter(Boolean).join(', ')}
                </span>
                <span className="block text-sm text-muted">
                  {item.institutionUrl ? (
                    <a className="lnk" href={item.institutionUrl}>
                      {item.institution}
                    </a>
                  ) : (
                    item.institution
                  )}
                  , {item.location}
                </span>
              </span>
              <span className="font-mono text-[12.5px] text-muted">{item.result}</span>
            </div>
          ))}
        </div>
      )}
    </Section>
  )
}

function FeaturedDegree({ item, courseAreas }: { item: EducationItem; courseAreas: CourseGroup[] }) {
  const totalCredits = courseAreas.reduce((sum, area) => sum + area.credits, 0)
  const totalCourses = courseAreas.reduce((sum, area) => sum + area.courses.length, 0)
  const maxCredits = Math.max(1, ...courseAreas.map((area) => area.credits))

  return (
    <SpotlightCard className="p-6">
      <div className="flex flex-wrap items-start gap-x-4 gap-y-3">
        <OrgTile monogram={monogram(item.institution, item.abbreviation)} logoUrl={logoUrlOf(item.logo)} />
        <div className="min-w-0 flex-[999_1_260px]">
          <h3 className="text-[17px] leading-[1.4] font-medium tracking-[-0.01em]">{item.qualification}</h3>
          <p className="mt-0.5 text-sm text-muted">
            {item.institution}, {item.location}
          </p>
        </div>
        <span className="font-mono text-[12.5px] leading-[30px] text-muted">
          {formatSiteRange(item.startDate, item.endDate, 'year')}
        </span>
      </div>
      <div className="mt-3.5 flex flex-wrap gap-1.5">
        <span className="chip">{item.result}</span>
        {item.credits != null && <span className="chip">{item.credits} credits</span>}
      </div>

      {courseAreas.length > 0 && (
        <div className="mt-[22px] border-t border-dashed border-line pt-5">
          <div className="mb-3.5 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <h4 className="text-sm font-medium">Computer science coursework</h4>
            <p className="font-mono text-xs text-muted">
              {totalCredits} credits · {totalCourses} courses
            </p>
          </div>

          <ul className="grid gap-1.5" aria-label="Coursework credits by area">
            {courseAreas.map((area, i) => (
              <li
                key={area.area}
                className="bar-row"
                title={`${area.label}: ${area.credits} credits across ${area.courses.length} courses`}
              >
                <span>{area.label}</span>
                <span className="bar-track" aria-hidden="true">
                  <span
                    className="bar-fill"
                    style={
                      {
                        width: `${((area.credits / maxCredits) * 100).toFixed(1)}%`,
                        animationDelay: `${(0.35 + i * 0.07).toFixed(2)}s`,
                      } as CSSProperties
                    }
                  />
                </span>
                <span className="text-right font-mono text-[12.5px] text-fg tabular-nums">
                  {area.credits}
                  <span className="sr-only"> credits</span>
                </span>
              </li>
            ))}
          </ul>

          <Disclosure label={`All ${totalCourses} courses`} className="mt-[18px]">
            <p className="mt-[18px] font-mono text-xs text-muted">VIT credits per course</p>
            {courseAreas.map((area) => (
              <div key={area.area} className="mt-[18px]">
                <h5 className="font-mono text-xs font-normal text-muted">
                  {area.label} · {area.credits} credits
                </h5>
                <ul className="mt-2 flex flex-wrap gap-1.5">
                  {area.courses.map((course) => (
                    <li
                      key={course.id}
                      className="course-chip inline-flex items-baseline gap-1.5 rounded-lg border border-line bg-bg px-[11px] py-[7px] text-[13.5px] leading-[1.3]"
                    >
                      {course.title}
                      <span className="font-mono text-[11px] text-muted">
                        {course.credits}
                        <span className="sr-only"> credits</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </Disclosure>
        </div>
      )}
    </SpotlightCard>
  )
}
