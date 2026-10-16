/**
 * The site's starting content. Run `pnpm seed` to load it into a fresh database; after that,
 * the CMS is the source of truth and this file is not kept in step with it.
 */
import type { DataFromGlobalSlug, RequiredDataFromCollectionSlug } from 'payload'

import type { CourseArea } from '../collections/Courses'
import { figures, previews } from './figures'
import { link, paragraph, richText } from './lexical'

const month = (yyyyMm: string) => `${yyyyMm}-01T00:00:00.000Z`

export const profile: Partial<DataFromGlobalSlug<'profile'>> = {
  name: 'Nimish Jain',
  jobTitle: 'Software Development Engineer II',
  employer: 'Luganodes',
  subtitle: 'Software Development Engineer II · Luganodes · India',
  bio: richText(
    paragraph(
      'I build backend and infrastructure for blockchain RPC and staking at ',
      link('https://www.luganodes.com', 'Luganodes'),
      ', and before that was the founding frontend engineer at ',
      link('https://www.electron.dev', 'Electron'),
      '. As an undergraduate at VIT Vellore I co-authored four papers on time-series outlier detection and fully homomorphic encryption.',
    ),
  ) as DataFromGlobalSlug<'profile'>['bio'],
  showStudyIntent: false,
  researchInterests: [
    { label: 'Privacy-preserving computation' },
    { label: 'Time-series data quality' },
    { label: 'Distributed systems' },
  ],
  email: 'contact@nimish-jain.com',
  links: [
    { label: 'Google Scholar', url: 'https://scholar.google.com/citations?user=oKBKRQ0AAAAJ&hl=en', icon: 'scholar' },
    { label: 'ORCID', url: 'https://orcid.org/0000-0001-9607-0764', icon: 'orcid' },
    { label: 'GitHub', url: 'https://github.com/nimishjn', icon: 'github' },
    { label: 'LinkedIn', url: 'https://www.linkedin.com/in/nimishjn/', icon: 'linkedin' },
  ],
  metaDescription:
    'Nimish Jain, software engineer working on backend and blockchain infrastructure, with research in time-series outlier detection and fully homomorphic encryption.',
  lastUpdated: month('2026-10'),
}

export const cv: Partial<DataFromGlobalSlug<'cv'>> = {
  phone: '[TBD]',
  location: 'Hyderabad, India',
  dateOfBirth: '[Optional — TBD]',
  nationality: '[Optional — TBD]',
  courseworkNote: 'Credits as listed in the VIT grade history; full transcript of records attached.',
  languages: [
    { name: 'English', level: 'IELTS, 08/2026: 7.0 overall (Listening 7.5, Reading 7.5, Writing 6.5, Speaking 7.0)' },
    { name: 'Hindi', level: '[Level — TBD]' },
  ],
  skills: [
    { area: 'Programming languages', items: 'TypeScript, JavaScript, Python, Java, C, C++' },
    { area: 'Web and backend', items: 'Node.js, Next.js, React, Express, Payload CMS, Strapi' },
    { area: 'Data and infrastructure', items: 'MongoDB, MySQL, Docker, Grafana, Git, Vercel' },
    { area: 'Domains', items: 'Blockchain RPC and staking infrastructure, role-based access control, billing systems' },
  ],
  place: 'Hyderabad',
  signedOn: null,
  // 12pt spills onto a fifth, nearly empty page.
  bodySize: '11pt',
}

const nj = { short: 'N. Jain', full: 'Nimish Jain', isMe: true }
const prusty = { short: 'B. R. Prusty', full: 'B. Rajanarayan Prusty' }
const bingi = { short: 'K. Bingi', full: 'Kishore Bingi' }

export const publications: RequiredDataFromCollectionSlug<'publications'>[] = [
  {
    title: 'Revisiting Fully Homomorphic Encryption Schemes for Privacy-Preserving Computing',
    authors: [nj, { short: 'A. K. Cherukuri', full: 'Aswani Kumar Cherukuri' }, { short: 'F. Kamalov', full: 'Firuz Kamalov' }],
    type: 'Book chapter',
    year: 2024,
    venue: 'Emerging Technologies and Security in Cloud Computing',
    series: 'Advances in Information Security, Privacy, and Ethics',
    publisher: 'IGI Global',
    pages: '276–294',
    doi: '10.4018/979-8-3693-2081-5.ch012',
    preprintUrl: 'https://arxiv.org/abs/2305.05904',
    summary:
      'A survey of fully homomorphic encryption schemes, which let a third party compute on data it cannot read. The chapter compares the major schemes and catalogues the open-source libraries and applications built on them.',
    bibtex: `@incollection{jain2024fhe,
  author    = {Jain, Nimish and Cherukuri, Aswani Kumar and Kamalov, Firuz},
  title     = {Revisiting Fully Homomorphic Encryption Schemes for Privacy-Preserving Computing},
  booktitle = {Emerging Technologies and Security in Cloud Computing},
  series    = {Advances in Information Security, Privacy, and Ethics},
  publisher = {IGI Global},
  year      = {2024},
  pages     = {276--294},
  doi       = {10.4018/979-8-3693-2081-5.ch012}
}`,
    figureSvg: figures.encryption,
    sortOrder: 1,
  },
  {
    title: 'New Performance Evaluation Metrics for Outlier Detection and Correction',
    authors: [
      prusty,
      nj,
      { short: 'K. G. Ranjan', full: 'Kumar Gaurav Ranjan' },
      bingi,
      { short: 'D. Jena', full: 'Debashisha Jena' },
    ],
    type: 'Book chapter',
    year: 2022,
    venue: 'Sustainable Energy and Technological Advancements',
    series: 'Advances in Sustainability Science and Technology',
    publisher: 'Springer',
    publisherFull: 'Springer Singapore',
    pages: '837–845',
    doi: '10.1007/978-981-16-9033-4_63',
    summary:
      'Proposes two metrics, CNSAD and OPP, for numerically scoring outlier detection and correction, and shows how they expose a method’s handling of extreme outliers on data with synthetic trend and volatility effects.',
    bibtex: `@incollection{prusty2022metrics,
  author    = {Prusty, B. Rajanarayan and Jain, Nimish and Ranjan, Kumar Gaurav and Bingi, Kishore and Jena, Debashisha},
  title     = {New Performance Evaluation Metrics for Outlier Detection and Correction},
  booktitle = {Sustainable Energy and Technological Advancements},
  series    = {Advances in Sustainability Science and Technology},
  publisher = {Springer Singapore},
  year      = {2022},
  pages     = {837--845},
  doi       = {10.1007/978-981-16-9033-4_63}
}`,
    figureSvg: figures['outlier-band'],
    sortOrder: 2,
  },
  {
    title: 'Performance Comparison of Two Statistical Parametric Methods for Outlier Detection and Correction',
    authors: [nj, { short: 'S. Suman', full: 'Shraddha Suman' }, prusty],
    type: 'Article',
    year: 2021,
    venue: 'IFAC-PapersOnLine',
    volumeIssue: '54(16)',
    publisher: 'Elsevier',
    pages: '168–174',
    doi: '10.1016/j.ifacol.2021.10.089',
    summary:
      'Compares two statistical methods for cleaning outliers from seasonal time series, improved sliding-window prediction and a portrait-dataset approach, across time resolutions and outlier rates, and suggests a metric for correction capability.',
    bibtex: `@article{jain2021outlier,
  author  = {Jain, Nimish and Suman, Shraddha and Prusty, B. Rajanarayan},
  title   = {Performance Comparison of Two Statistical Parametric Methods for Outlier Detection and Correction},
  journal = {IFAC-PapersOnLine},
  volume  = {54},
  number  = {16},
  pages   = {168--174},
  year    = {2021},
  doi     = {10.1016/j.ifacol.2021.10.089}
}`,
    figureSvg: figures.seasonal,
    sortOrder: 3,
  },
  {
    title: 'Modeling of Predictable Variations in Multi-Time Instant Ambient Temperature Time Series',
    authors: [
      { short: 'U. Shyamsukha', full: 'Udith Shyamsukha' },
      nj,
      { short: 'T. Chakraborty', full: 'Tirthankar Chakraborty' },
      prusty,
      bingi,
    ],
    type: 'Conference',
    year: 2021,
    venue: '3rd International Conference on Energy, Power and Environment (ICEPE)',
    venueShort: '3rd Int. Conf. on Energy, Power and Environment (ICEPE)',
    publisher: 'IEEE',
    pages: '1–6',
    doi: '10.1109/ICEPE50861.2021.9404497',
    summary:
      'A multiple linear regression model with a small set of deterministic regressors that captures the predictable annual variation in daily ambient temperature, validated on records from three locations in India.',
    bibtex: `@inproceedings{shyamsukha2021temperature,
  author    = {Shyamsukha, Udith and Jain, Nimish and Chakraborty, Tirthankar and Prusty, B. Rajanarayan and Bingi, Kishore},
  title     = {Modeling of Predictable Variations in Multi-Time Instant Ambient Temperature Time Series},
  booktitle = {2020 3rd International Conference on Energy, Power and Environment (ICEPE)},
  publisher = {IEEE},
  year      = {2021},
  pages     = {1--6},
  doi       = {10.1109/ICEPE50861.2021.9404497}
}`,
    figureSvg: figures.regression,
    sortOrder: 4,
  },
]

export const experiences: RequiredDataFromCollectionSlug<'experiences'>[] = [
  {
    kind: 'work',
    role: 'Software Development Engineer II',
    org: 'Luganodes',
    orgUrl: 'https://www.luganodes.com',
    location: 'Hyderabad, India',
    startDate: month('2026-02'),
    summary: 'The platform behind rpc.luganodes.com.',
    badge: 'Promoted · Oct 2026',
    bullets: [
      { text: 'Role-based access control and a subscription-billing state machine covering downgrades, grace periods and endpoint suspension.' },
      { text: 'WebSocket RPC, Stripe webhooks, and a log-to-alert observability pipeline.' },
    ],
    cvLine:
      'Promoted from SDE in 10/2026. Building the platform behind rpc.luganodes.com: role-based access control, a subscription-billing state machine, WebSocket RPC and a log-to-alert observability pipeline.',
  },
  {
    kind: 'work',
    role: 'Founding Frontend Engineer',
    org: 'Electron',
    orgUrl: 'https://www.electron.dev',
    location: 'Bengaluru, India',
    startDate: month('2025-08'),
    endDate: month('2026-01'),
    summary: 'Launched app.permute.finance, a Bitcoin swap dApp, and the CMS behind its website.',
    bullets: [
      { text: 'Architected and launched app.permute.finance: $2M+ in transaction volume across 10+ blockchains and 100+ wallet integrations.' },
      { text: 'Integrated Payload CMS with the permute.finance website for dynamic content, programmatic and internal SEO pages, the blog and FAQs.' },
    ],
    cvLine:
      'Architected and launched app.permute.finance, a Bitcoin swap dApp with $2M+ in transaction volume across 10+ blockchains and 100+ wallets; integrated Payload CMS for the website’s content and SEO pages.',
  },
  {
    kind: 'work',
    role: 'Software Development Engineer',
    org: 'Luganodes',
    orgUrl: 'https://www.luganodes.com',
    location: 'Remote',
    startDate: month('2024-07'),
    endDate: month('2025-07'),
    summary: 'Staking infrastructure and reward reporting for institutional clients.',
    bullets: [
      { text: 'Built a Ronin indexer that generates validator and delegator reward reports back to genesis within minutes.' },
      { text: 'Engineered an Ethereum staking dApp through which institutional clients stake millions of dollars.' },
      { text: 'Moved legacy monitoring onto Grafana and set up pipelines that deploy internal projects to bare-metal servers.' },
    ],
    cvLine:
      'Built a Ronin indexer that generates validator and delegator reward reports back to genesis within minutes; engineered an Ethereum staking dApp for institutional clients; moved monitoring onto Grafana and set up bare-metal deployment pipelines.',
  },
  {
    kind: 'internship',
    role: 'Software Development Engineer Intern',
    org: 'Luganodes',
    orgUrl: 'https://www.luganodes.com',
    location: 'Remote',
    startDate: month('2023-09'),
    endDate: month('2024-06'),
    summary: 'The staking terminal, rewards indexing and luganodes.com.',
    bullets: [
      { text: 'Built an indexer that tracks client rewards on the Ronin blockchain.' },
      { text: 'Contributed to the staking terminal, Luganodes’ flagship product for B2B clients.' },
      { text: 'Raised luganodes.com’s Lighthouse SEO score to 91, with 60% more visitors, and moved the newsletter service onto the Brevo API.' },
    ],
    cvLine:
      'Built a rewards indexer for the Ronin blockchain, contributed to the staking terminal for B2B clients, and raised the website’s Lighthouse SEO score to 91, with 60% more visitors.',
  },
  {
    kind: 'internship',
    role: 'Next.js Developer Intern',
    org: 'Kwikpic',
    location: 'Remote',
    startDate: month('2023-06'),
    endDate: month('2023-08'),
    summary: 'A customer-management system with access control, built in Next.js and MongoDB.',
    bullets: [
      { text: 'Identity and access management and an admin panel; MongoDB pipelines with dynamic queries that cut response times by 60%.' },
      { text: 'Editable data tables with server-side pagination, filtering and sorting, and a bulk CSV import with upload, review and error steps.' },
    ],
    cvLine: 'Built a customer-management system with access control in Next.js and MongoDB; pipelines with dynamic queries cut response times by 60%.',
  },
  {
    kind: 'internship',
    role: 'Frontend Engineer Intern',
    org: 'Disecto',
    location: 'Remote',
    startDate: month('2022-11'),
    endDate: month('2023-05'),
    summary: 'Frontend lead for INCOG, a data-classification product.',
    bullets: [
      { text: 'Led a frontend team of two developers and coordinated its deliverables.' },
      { text: 'Real-time dashboards, and a reports section built with Nivo and D3.' },
      { text: 'An interactive file explorer and database-schema viewer built on React Flow.' },
    ],
    cvLine:
      'Led frontend development of INCOG, a data-classification product, with a team of two developers: real-time dashboards, reports with Nivo and D3, and a file and schema explorer built on React Flow.',
  },
  {
    kind: 'internship',
    role: 'Web Developer Intern',
    org: 'Nishkaera',
    location: 'Mumbai, India',
    startDate: month('2021-08'),
    endDate: month('2021-10'),
    summary: 'Customer portal and webinar admin for a fintech startup.',
    bullets: [
      { text: 'Webinar admin panel with participant lists and email reminders.' },
      { text: 'Rebuilt the Detailed Financial Pulse tool used daily by its customers.' },
    ],
    cvLine: 'Customer portal and webinar admin panel for a fintech startup.',
  },
]

export const education: RequiredDataFromCollectionSlug<'education'>[] = [
  {
    qualification: 'B.Tech, Information Technology',
    institution: 'Vellore Institute of Technology',
    abbreviation: 'VIT',
    location: 'Vellore, India',
    school: 'School of Computer Science Engineering and Information Systems',
    startDate: month('2020-08'),
    endDate: month('2024-06'),
    result: 'CGPA 8.64 / 10',
    credits: 161,
    cvExtra: 'Capstone project (12 credits): [Project title — TBD]',
    featured: true,
    sortOrder: 1,
  },
  {
    qualification: 'Senior Secondary (Class XII)',
    board: 'CBSE',
    institution: 'Delhi Public School, R. K. Puram',
    institutionUrl: 'https://dpsrkp.net/',
    location: 'New Delhi, India',
    startDate: month('2018-04'),
    endDate: month('2020-03'),
    result: '93%',
    sortOrder: 2,
  },
  {
    qualification: 'Secondary (Class X)',
    board: 'ICSE',
    institution: 'St. Michael’s School',
    institutionUrl: 'https://smsslg.com/',
    location: 'Siliguri, India',
    startDate: month('2009-04'),
    endDate: month('2018-03'),
    result: '95%',
    sortOrder: 3,
  },
]

const courseList: Array<[CourseArea, string, number]> = [
  ['mathematics', 'Calculus for Engineers', 4],
  ['mathematics', 'Applied Linear Algebra', 4],
  ['mathematics', 'Discrete Mathematics and Graph Theory', 4],
  ['mathematics', 'Applications of Differential and Difference Equations', 4],
  ['mathematics', 'Statistics for Engineers', 4],
  ['mathematics', 'Transformation Techniques', 3],
  ['theory', 'Theory of Computation', 3],
  ['theory', 'Data Structures and Algorithms', 4],
  ['systems', 'Digital Logic and Microprocessor', 4],
  ['systems', 'Computer Architecture and Organization', 3],
  ['systems', 'Operating Systems', 4],
  ['systems', 'Data Communication and Computer Networks', 4],
  ['systems', 'Wireless Mobile Networking', 4],
  ['security', 'Network and Information Security', 4],
  ['security', 'Information Security Management', 4],
  ['security', 'Information Security Analysis and Audit', 4],
  ['security', 'Information System Audit', 2],
  ['ai', 'Artificial Intelligence', 4],
  ['ai', 'Data Mining Techniques', 4],
  ['ai', 'Soft Computing', 4],
  ['software', 'Problem Solving and Programming', 3],
  ['software', 'Problem Solving and Object Oriented Programming', 3],
  ['software', 'Java Programming', 4],
  ['software', 'Database Management Systems', 4],
  ['software', 'Software Engineering: Principles and Practices', 3],
  ['software', 'Object Oriented Analysis and Design', 4],
  ['software', 'Software Testing', 4],
  ['software', 'Web Technologies', 3],
  ['software', 'Human Computer Interaction', 4],
]

export const courses: RequiredDataFromCollectionSlug<'courses'>[] = courseList.map(([area, title, credits], index) => ({
  area,
  title,
  credits,
  sortOrder: index + 1,
}))

export const projects: RequiredDataFromCollectionSlug<'projects'>[] = [
  {
    title: 'RPC Dashboard',
    year: 2026,
    context: 'organisation',
    org: 'Luganodes',
    description:
      'The self-serve dashboard for Luganodes’ blockchain RPC: developers create apps with API keys, get RPC and MCP endpoints for Ethereum, Bitcoin and Tron, track usage, set alerts, and manage plans and team roles. It runs on Kubernetes, deployed through Argo CD.',
    stack: [{ label: 'Next.js' }, { label: 'TypeScript' }, { label: 'TanStack Query' }, { label: 'Kubernetes' }],
    links: [{ label: 'Demo', url: 'https://rpc.luganodes.com' }],
    previewSvg: previews['rpc-dashboard'],
    sortOrder: 1,
  },
  {
    title: 'Permute Finance',
    year: 2025,
    context: 'organisation',
    org: 'Electron',
    description:
      'A Bitcoin swap dApp that works across 10+ blockchains and 100+ wallets, with $2M+ in transaction volume. Its website’s content and SEO pages come from Payload CMS.',
    stack: [{ label: 'Next.js' }, { label: 'Ant Design' }, { label: 'Payload CMS' }, { label: 'Vercel' }],
    previewSvg: previews.permute,
    sortOrder: 2,
  },
  {
    title: 'ETH Staking dApp',
    year: 2025,
    context: 'organisation',
    org: 'Luganodes',
    description:
      'An invite-only Ethereum staking dApp for institutional clients. It deposits up to 100 validators in one transaction, supports 0x01 and compounding 0x02 validators, and handles the Pectra operations: switching 0x01 to 0x02, top-ups, partial withdrawals and exits.',
    stack: [{ label: 'Next.js' }, { label: 'wagmi' }, { label: 'Ant Design' }, { label: 'Vercel' }],
    links: [{ label: 'Demo', url: 'https://native-staking.luganodes.com' }],
    previewSvg: previews['eth-staking'],
    sortOrder: 3,
  },
  {
    title: 'Ronin Blockchain Indexer',
    year: 2025,
    context: 'organisation',
    org: 'Luganodes',
    description:
      'Tracks daily validator and delegator rewards on the Ronin blockchain from on-chain staking events. A subgraph indexes the staking contracts (20M+ events), and the service backfills every validator’s full reward history within minutes.',
    stack: [{ label: 'Node.js' }, { label: 'Express' }, { label: 'MongoDB' }, { label: 'The Graph' }],
    previewSvg: previews['ronin-indexer'],
    sortOrder: 4,
  },
  {
    title: 'Password + image-pattern authentication',
    year: 2023,
    context: 'personal',
    description:
      'A login scheme that pairs a password with a pattern drawn on a 16-cell image grid. The image is discarded after authentication and never stored on the server.',
    stack: [{ label: 'Next.js' }, { label: 'TypeScript' }, { label: 'Tailwind CSS' }],
    links: [
      { label: 'Code', url: 'https://github.com/nimishjn/hash-generator' },
      { label: 'Demo', url: 'https://hash-generator-nimishjn.vercel.app' },
      { label: 'Write-up', url: 'https://nimishjn.medium.com/a37a3e599009' },
    ],
    previewSvg: previews['pattern-grid'],
    sortOrder: 5,
  },
  {
    title: 'Riddler — online cryptic hunt',
    year: 2021,
    context: 'organisation',
    org: 'CSI-VIT',
    description:
      'Frontend for CSI-VIT’s annual cryptic hunt: a 40-node riddle map with a hint economy and a live leaderboard, played by 700+ active players.',
    stack: [{ label: 'React' }, { label: 'Redux' }, { label: 'Material UI' }],
    links: [
      { label: 'Code', url: 'https://github.com/csivitu/riddler-frontend-2021' },
      { label: 'Demo', url: 'https://riddler-sample.vercel.app' },
    ],
    previewSvg: previews['riddle-map'],
    sortOrder: 6,
  },
]

export const service: RequiredDataFromCollectionSlug<'service'>[] = [
  {
    org: 'Computer Society of India, VIT',
    role: 'Senior Core Member',
    tile: 'CSI',
    startDate: month('2021-01'),
    endDate: month('2022-12'),
    siteText:
      'Organised Devspace (1,400+ registrations) and Riddler (1,100+); coordinated core-committee selections with 200+ interviews over two days.',
    cvText:
      'Organising committee for Devspace ’21 and ’22 (1,400+ and 1,200+ registrations) and Riddler ’21 (1,100+); coordinated core-committee selections with 200+ interviews in two days.',
    sortOrder: 1,
  },
  {
    org: 'Apple Developer Group, VIT',
    role: 'Senior Core Member',
    tile: 'ADG',
    startDate: month('2021-01'),
    endDate: month('2023-06'),
    siteText: 'Co-built the official ADG-VIT website in a team of three.',
    sortOrder: 2,
  },
  {
    org: 'Design and Code',
    role: 'Core team',
    tile: 'D&C',
    startDate: month('2021-11'),
    endDate: month('2022-08'),
    siteText: 'Moderated a 4,300-member developer community and maintained its open-source projects for Hacktoberfest ’21.',
    cvText: 'Developer community of 4,300+ members. Maintained open-source projects for Hacktoberfest ’21; 20+ résumé reviews.',
    sortOrder: 3,
  },
]

export const writing: RequiredDataFromCollectionSlug<'writing'>[] = [
  {
    title: 'Enhancing Login Security: A New Authentication Schema Using Password and Image Patterns',
    date: month('2023-05'),
    platform: 'Medium',
    url: 'https://nimishjn.medium.com/a37a3e599009',
  },
]
