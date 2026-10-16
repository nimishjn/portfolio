import type { SerializedLinkNode } from '@payloadcms/richtext-lexical'
import { RichText, type JSXConvertersFunction } from '@payloadcms/richtext-lexical/react'
import Image from 'next/image'

import { ArrowUpRight, DownloadIcon } from '@/components/icons'
import { portraitOf } from '@/lib/content'
import type { Profile } from '@/payload-types'

import { CopyButton } from './CopyButton'
import { ProfileLinkIcon } from './ProfileLinkIcon'

const bioConverters: JSXConvertersFunction = ({ defaultConverters }) => ({
  ...defaultConverters,
  paragraph: ({ node, nodesToJSX }) => <p className="m-0 [&+p]:mt-3">{nodesToJSX({ nodes: node.children })}</p>,
  link: ({ node, nodesToJSX }) => {
    const { fields } = node as SerializedLinkNode
    const href = fields.linkType === 'custom' ? fields.url : undefined
    return (
      <a className="lnk lnk-u" href={href} {...(fields.newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
        {nodesToJSX({ nodes: node.children })}
      </a>
    )
  },
})

export function Hero({ profile, hasPdf }: { profile: Profile; hasPdf: boolean }) {
  const portrait = portraitOf(profile.portrait)
  const portraitSrc = portrait?.sizes?.portrait?.url || portrait?.url

  // No entrance animation here: the hero is the largest content on first paint (LCP).
  return (
    <section id="top" className="flex flex-wrap items-start gap-x-10 gap-y-7 pt-22 pb-6 max-sm:pt-12">
      <div className="portrait">
        {portraitSrc ? (
          <Image
            src={portraitSrc}
            alt={portrait?.alt || profile.name}
            width={240}
            height={240}
            priority
            className="size-full object-cover"
          />
        ) : (
          <span className="font-mono text-2xl font-medium tracking-[-0.04em] text-muted" aria-hidden="true">
            NJ
          </span>
        )}
      </div>

      <div className="min-w-0 flex-[999_1_420px]">
        <h1 className="m-0 text-[clamp(40px,6.4vw,64px)] leading-none font-semibold tracking-[-0.045em]">{profile.name}</h1>
        <p className="mt-[18px] inline-flex items-center gap-2.5 rounded-full border border-line bg-card py-[7px] pr-3.5 pl-3 font-mono text-[12.5px] leading-[1.4] text-muted">
          <span className="live" aria-hidden="true" />
          {profile.subtitle}
        </p>

        <div className="mt-[22px] max-w-[60ch] text-[17px] leading-[1.65]">
          <RichText data={profile.bio} converters={bioConverters} disableContainer />
          {profile.showStudyIntent && profile.studyIntentText && <p className="mt-3">{profile.studyIntentText}</p>}
        </div>

        <div className="mt-7 flex flex-wrap items-center gap-2.5">
          {hasPdf && (
            <a className="btn" href="/cv.pdf" download="Nimish-Jain-CV.pdf">
              <DownloadIcon className="btn-icon" />
              Download CV
            </a>
          )}
          <CopyButton text={profile.email} label={profile.email} ariaLabel={`Copy email address ${profile.email}`} />
        </div>

        {profile.links && profile.links.length > 0 && (
          <ul className="mt-3 flex flex-wrap gap-2">
            {profile.links.map((link) => (
              <li key={link.id ?? link.url}>
                <a className="pill" href={link.url} rel="me">
                  <ProfileLinkIcon icon={link.icon} />
                  {link.label}
                  <ArrowUpRight className="arrow" />
                </a>
              </li>
            ))}
          </ul>
        )}

        {profile.researchInterests && profile.researchInterests.length > 0 && (
          <div className="mt-9">
            <h2 className="m-0 font-mono text-xs font-medium tracking-[0.02em] text-muted">Research interests</h2>
            <ul className="mt-3 flex flex-wrap gap-2">
              {profile.researchInterests.map((interest) => (
                <li key={interest.id ?? interest.label} className="tag">
                  {interest.label}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  )
}
