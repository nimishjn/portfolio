import * as migration_20261011_125852_initial from './20261011_125852_initial';
import * as migration_20261011_161631_publication_figure_svg from './20261011_161631_publication_figure_svg';
import * as migration_20261011_162708_org_logos from './20261011_162708_org_logos';
import * as migration_20261012_090632_project_context_and_svg from './20261012_090632_project_context_and_svg';
import * as migration_20261012_120838_seo_fields from './20261012_120838_seo_fields';
import * as migration_20261016_095303_link_icon_any from './20261016_095303_link_icon_any';
import * as migration_20261016_103331_drop_figure_presets from './20261016_103331_drop_figure_presets';
import * as migration_20261016_145402_two_factor from './20261016_145402_two_factor';
import * as migration_20261016_161032_cv_pdf_upload from './20261016_161032_cv_pdf_upload';
import * as migration_20261016_164024_resume_pdf from './20261016_164024_resume_pdf';
import * as migration_20261025_095658 from './20261025_095658_totp_last_step';

export const migrations = [
  {
    up: migration_20261011_125852_initial.up,
    down: migration_20261011_125852_initial.down,
    name: '20261011_125852_initial',
  },
  {
    up: migration_20261011_161631_publication_figure_svg.up,
    down: migration_20261011_161631_publication_figure_svg.down,
    name: '20261011_161631_publication_figure_svg',
  },
  {
    up: migration_20261011_162708_org_logos.up,
    down: migration_20261011_162708_org_logos.down,
    name: '20261011_162708_org_logos',
  },
  {
    up: migration_20261012_090632_project_context_and_svg.up,
    down: migration_20261012_090632_project_context_and_svg.down,
    name: '20261012_090632_project_context_and_svg',
  },
  {
    up: migration_20261012_120838_seo_fields.up,
    down: migration_20261012_120838_seo_fields.down,
    name: '20261012_120838_seo_fields',
  },
  {
    up: migration_20261016_095303_link_icon_any.up,
    down: migration_20261016_095303_link_icon_any.down,
    name: '20261016_095303_link_icon_any',
  },
  {
    up: migration_20261016_103331_drop_figure_presets.up,
    down: migration_20261016_103331_drop_figure_presets.down,
    name: '20261016_103331_drop_figure_presets',
  },
  {
    up: migration_20261016_145402_two_factor.up,
    down: migration_20261016_145402_two_factor.down,
    name: '20261016_145402_two_factor',
  },
  {
    up: migration_20261016_161032_cv_pdf_upload.up,
    down: migration_20261016_161032_cv_pdf_upload.down,
    name: '20261016_161032_cv_pdf_upload',
  },
  {
    up: migration_20261016_164024_resume_pdf.up,
    down: migration_20261016_164024_resume_pdf.down,
    name: '20261016_164024_resume_pdf',
  },
  {
    up: migration_20261025_095658.up,
    down: migration_20261025_095658.down,
    name: '20261025_095658_totp_last_step'
  },
];
