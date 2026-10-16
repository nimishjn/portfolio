/**
 * Conventional Commits. Enforced by the commit-msg hook.
 * Types: feat, fix, refactor, perf, docs, style, test, build, ci, chore, revert.
 */
const config = {
  extends: ['@commitlint/config-conventional'],
}

export default config
