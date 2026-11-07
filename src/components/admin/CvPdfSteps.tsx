import { Button } from '@payloadcms/ui'

import styles from './CvPdfSteps.module.css'

/** How to make the CV PDFs, shown above the field the public one is uploaded to (Site → CV). */
export function CvPdfSteps() {
  return (
    <div className={styles.root}>
      <ol className={styles.steps}>
        <li>Save any changes to the CV first.</li>
        <li>Open a print view. It shows the latest content and opens the print dialog.</li>
        <li>Choose Save as PDF, turn off Headers and footers, and save the file. Chrome gives the intended result.</li>
        <li>
          Upload the public one below, then save. The full one adds the phone number, date of birth and
          nationality: send it with applications, and keep it off the site.
        </li>
      </ol>
      <div className={styles.buttons}>
        <Button buttonStyle="secondary" el="anchor" newTab size="small" url="/cv/print">
          Open print view
        </Button>
        <Button buttonStyle="secondary" el="anchor" newTab size="small" url="/cv/print?full=1">
          Open full print view
        </Button>
      </div>
    </div>
  )
}
