## Usage:

```yaml
name: JIRA Checklist

on:
  pull_request:
    types:
      - opened
      - reopened
      - edited
      - synchronize

jobs:
  enforce-issue-checklist:
    runs-on: ubuntu-latest
    name: JIRA Checklist
    steps:
      - name: Check for JIRA issue checklist
        id: check
        uses: furkando/jira-checklist-action
```
