// Configuration file for available slide decks
const PRESENTATION_DECKS = [
  {
    id: 'git-github',
    name: '01. Git & GitHub Collaboration',
    path: '01-git-github/slides.md',
    fallbackKey: 'gitGithubMarkdown'
  },
  {
    id: 'github-actions',
    name: '02. GitHub Actions CI/CD',
    path: '02-github-actions/slides.md',
    fallbackKey: 'githubActionsMarkdown'
  },
  {
    id: 'jenkins',
    name: '03. Jenkins CI/CD (Upcoming)',
    path: '03-jenkins/slides.md',
    fallbackKey: 'jenkinsMarkdown'
  }
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = PRESENTATION_DECKS;
}
