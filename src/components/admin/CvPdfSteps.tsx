import { Button } from '@payloadcms/ui'

import styles from './CvPdfSteps.module.css'

/** How to make the CV PDF, shown above the field it is uploaded to (Site → CV). */
export function CvPdfSteps() {
  return (
    <div className={styles.root}>
      <ol className={styles.steps}>
        <li>Save any changes to the CV first.</li>
        <li>Open the print view. It shows the latest content and opens the print dialog.</li>
        <li>Choose Save as PDF, turn off Headers and footers, and save the file. Chrome gives the intended result.</li>
        <li>Upload that file below, then save.</li>
      </ol>
      <Button buttonStyle="secondary" el="anchor" newTab size="small" url="/cv/print">
        Open print view
      </Button>
    </div>
  )
}
