import { Fragment, type ReactNode } from 'react'

import type { Content } from '@/lib/content'
import { doiUrl, formatCvRange, formatDayDate, preprintLabel } from '@/lib/format'
import { siteUrl } from '@/lib/site'
import type { Publication } from '@/payload-types'

/** Highlights "[TBD]"-style placeholders so open items are easy to spot before sending. */
function withPlaceholders(text: string | null | undefined): ReactNode {
  if (!text) return null
  return text.split(/(\[[^\]]+\])/g).map((part, i) =>
    /^\[[^\]]+\]$/.test(part) ? (
      <span key={i} className="cv-ph">
        {part}
      </span>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    ),
  )
}

function Row({ label, tight, children }: { label: ReactNode; tight?: boolean; children: ReactNode }) {
  return (
    <div className={tight ? 'cv-row cv-row-tight' : 'cv-row'}>
      <p className="cv-label">{label}</p>
      <div className="min-w-0">{children}</div>
    </div>
  )
}

function Pair({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="cv-pair">
      <dt className="cv-label">{label}</dt>
      <dd className="m-0 min-w-0">{children}</dd>
    </div>
  )
}

const hostOf = (url: string) => url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')

function linkByIcon(content: Content, icon: string) {
  return content.profile.links?.find((link) => link.icon === icon)?.url
}

function venueLine(item: Publication) {
  const venue = [item.venue, item.volumeIssue].filter(Boolean).join(' ')
  const tail = [item.publisherFull || item.publisher, item.pages && `pp. ${item.pages}`].filter(Boolean).join(', ')
  return (
    <>
      <em>{venue}</em>
      {item.series && ` (${item.series})`}. {tail}.
    </>
  )
}

/** The tabular, German-style academic CV. Screen and print share this markup. */
export function CvDocument({ content }: { content: Content }) {
  const { profile, cv, education, courseAreas, publications, work, internships, service } = content
  const orcid = linkByIcon(content, 'orcid')
  const github = linkByIcon(content, 'github')
  const totalCredits = courseAreas.reduce((sum, area) => sum + area.credits, 0)
  const totalCourses = courseAreas.reduce((sum, area) => sum + area.courses.length, 0)
  // The CV lists service newest start first; the site uses its own order.
  const serviceByDate = [...service].sort(
    (a, b) => b.startDate.localeCompare(a.startDate) || (b.endDate ?? '9999').localeCompare(a.endDate ?? '9999'),
  )
  const roles = [
    { title: 'Work experience', items: work },
    { title: 'Internships', items: internships },
  ]

  return (
    <article className="cv-sheet" style={{ fontSize: cv.bodySize === '11pt' ? '14.667px' : '16px' }}>
      <header>
        <p className="cv-meta">Curriculum vitae</p>
        <h1 className="mt-1.5 text-[2em] leading-[1.15] font-semibold tracking-[-0.025em]">{profile.name}</h1>
        <p className="cv-meta mt-1.5">{profile.subtitle}</p>
      </header>

      <section className="cv-section mt-8">
        <h2 className="cv-h2">Personal details</h2>
        <dl className="cv-pairs mt-3.5 grid grid-flow-col grid-cols-2 grid-rows-5 gap-x-6 gap-y-1.5">
          <Pair label="Name">{profile.name}</Pair>
          <Pair label="Location">{cv.location}</Pair>
          <Pair label="Phone">{withPlaceholders(cv.phone)}</Pair>
          <Pair label="Date of birth">{withPlaceholders(cv.dateOfBirth)}</Pair>
          <Pair label="Nationality">{withPlaceholders(cv.nationality)}</Pair>
          <Pair label="Email">
            <a className="cv-meta" href={`mailto:${profile.email}`}>
              {profile.email}
            </a>
          </Pair>
          <Pair label="Website">
            <a className="cv-meta" href={siteUrl}>
              {hostOf(siteUrl)}
            </a>
          </Pair>
          {orcid && (
            <Pair label="ORCID">
              <a className="cv-meta" href={orcid}>
                {orcid.split('/').pop()}
              </a>
            </Pair>
          )}
          {github && (
            <Pair label="GitHub">
              <a className="cv-meta" href={github}>
                {hostOf(github)}
              </a>
            </Pair>
          )}
        </dl>
      </section>

      <section className="cv-section">
        <h2 className="cv-h2">Education</h2>
        {education.map((item) => (
          <Row key={item.id} label={formatCvRange(item.startDate, item.endDate)}>
            <p className="font-medium">{[item.qualification, item.board].filter(Boolean).join(', ')}</p>
            <p>
              {item.institution}
              {item.abbreviation && ` (${item.abbreviation})`}, {item.location}
            </p>
            {item.school && <p className="cv-muted">{item.school}</p>}
            <p className="cv-meta">{[item.result, item.credits != null && `${item.credits} credits`].filter(Boolean).join(' · ')}</p>
            {item.cvExtra && <p>{withPlaceholders(item.cvExtra)}</p>}
          </Row>
        ))}
      </section>

      {courseAreas.length > 0 && (
        <section className="cv-section">
          <h2 className="cv-h2">Relevant coursework (B.Tech)</h2>
          {cv.courseworkNote && <p className="cv-muted mt-2.5 text-[0.875em]">{cv.courseworkNote}</p>}
          {courseAreas.map((area) => (
            <Row
              key={area.area}
              label={
                <>
                  {area.label}
                  <br />
                  {area.credits} credits
                </>
              }
            >
              <p>
                {area.courses.map((course, i) => (
                  <Fragment key={course.id}>
                    {course.title}{' '}
                    <span className="cv-muted">
                      ({course.credits}){i < area.courses.length - 1 && ' ·'}
                    </span>{' '}
                  </Fragment>
                ))}
              </p>
            </Row>
          ))}
          <Row label="Total">
            <p className="cv-meta">
              {totalCourses} courses · {totalCredits} credits
            </p>
          </Row>
        </section>
      )}

      <section className="cv-section">
        <h2 className="cv-h2">Publications</h2>
        {publications.map((item) => (
          <Row
            key={item.id}
            label={
              <>
                {item.year}
                <br />
                {item.type}
              </>
            }
          >
            <p className="font-medium">{item.title}</p>
            <p className="cv-muted">
              {item.authors.map((author, i) => (
                <Fragment key={author.id ?? i}>
                  {i > 0 && ', '}
                  {author.isMe ? <span className="cv-me">{author.short}</span> : author.short}
                </Fragment>
              ))}
            </p>
            <p className="cv-muted">{venueLine(item)}</p>
            <p className="cv-meta">
              <a href={doiUrl(item.doi)}>doi:{item.doi}</a>
              {item.preprintUrl && (
                <>
                  {' · '}
                  <a href={item.preprintUrl}>{preprintLabel(item.preprintUrl)}</a>
                </>
              )}
            </p>
          </Row>
        ))}
      </section>

      {roles.map(
        ({ title, items }) =>
          items.length > 0 && (
            <section key={title} className="cv-section">
              <h2 className="cv-h2">{title}</h2>
              {items.map((item) => (
                <Row
                  key={item.id}
                  label={
                    <>
                      {formatCvRange(item.startDate, item.endDate)}
                      <br />
                      {item.location}
                    </>
                  }
                >
                  <p>
                    <span className="font-medium">{item.role}</span> <span className="cv-muted">· {item.org}</span>
                  </p>
                  <p>{item.cvLine}</p>
                </Row>
              ))}
            </section>
          ),
      )}

      {serviceByDate.length > 0 && (
        <section className="cv-section">
          <h2 className="cv-h2">Leadership and service</h2>
          {serviceByDate.map((item) => (
            <Row key={item.id} label={formatCvRange(item.startDate, item.endDate)}>
              <p>
                <span className="font-medium">{item.org}</span> <span className="cv-muted">· {item.role}</span>
              </p>
              <p>{item.cvText || item.siteText}</p>
            </Row>
          ))}
        </section>
      )}

      {cv.languages && cv.languages.length > 0 && (
        <section className="cv-section">
          <h2 className="cv-h2">Languages and certificates</h2>
          {cv.languages.map((item, i) => (
            <Row key={item.id ?? i} label={item.name} tight={i > 0}>
              <p>{withPlaceholders(item.level)}</p>
            </Row>
          ))}
        </section>
      )}

      {cv.skills && cv.skills.length > 0 && (
        <section className="cv-section">
          <h2 className="cv-h2">Technical skills</h2>
          {cv.skills.map((item, i) => (
            <Row key={item.id ?? i} label={item.area} tight={i > 0}>
              <p>{item.items}</p>
            </Row>
          ))}
        </section>
      )}

      <section className="cv-closing mt-10">
        <p>
          {cv.place}, {cv.signedOn ? formatDayDate(cv.signedOn) : <span className="cv-ph">[DD.MM.YYYY]</span>}
        </p>
      </section>
    </article>
  )
}
