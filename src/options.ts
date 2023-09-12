import * as core from '@actions/core'
import {JiraConfig} from './jira'

export interface Options {
  project: string
  jira: JiraConfig
}

export function getInput(): Options {
  const project = core.getInput('project', {required: true})
  const jiraHost = core.getInput('jira-host', {required: true})
  const jiraEmail = core.getInput('jira-email', {required: true})
  const jiraToken = core.getInput('jira-api-token', {required: true})

  return {
    project,
    jira: {
      host: jiraHost,
      email: jiraEmail,
      apiToken: jiraToken
    }
  }
}
