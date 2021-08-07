## @kunalnagarco/action-semantic-pr

A [GitHub action](https://github.com/features/actions) that ensures your PR title matches the [Conventional Commits spec](https://www.conventionalcommits.org/)

### Usage

```yaml
name: 'Lint PR'

on:
  pull_request:
    types:
      - opened
      - edited
      - synchronize

jobs:
  main:
    runs-on: ubuntu-latest
    steps:
      # X.X.X - Latest version available at:
      #         https://github.com/kunalnagarco/action-semantic-pr/releases
      - uses: kunalnagarco/action-semantic-pr@vX.X.X
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

### Notes

This is a PR title validator only. It does not validate commits.
