import { bannerSize, renderCvBanner } from '@/lib/og-banner'

export const alt = 'Curriculum vitae of Nimish Jain'
export const size = bannerSize
export const contentType = 'image/png'

/** Social banner for /cv. */
export default function CvOpengraphImage() {
  return renderCvBanner()
}
