import {Version3Client} from 'jira.js'
import * as core from '@actions/core'
export interface JiraConfig {
  host: string
  email: string
  apiToken: string
}

export interface JiraClient {
  issueExistsAndChecklistCompleted: (issueIdOrKey: string) => Promise<boolean>
}

export class JiraClientImpl implements JiraClient {
  private readonly client: Version3Client

  constructor({host, email, apiToken}: JiraConfig) {
    this.client = new Version3Client({
      host,
      authentication: {
        basic: {
          email,
          apiToken
        }
      }
    })
  }

  async issueExistsAndChecklistCompleted(
    issueIdOrKey: string
  ): Promise<boolean> {
    try {
      const fields = await this.client.issueFields.getFields()
      const issue = await this.client.issues.getIssue({issueIdOrKey})
      // check if checklist is completed
      const checklistField = fields.find(
        (field: any) => field.name === 'Checklist Progress'
      )
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const checklist = checklistField ? issue.fields[checklistField.id!] : null
      if (checklist) {
        const matches = checklist.match(/(\d+)\/(\d+)/)

        if (matches) {
          const completedItems = parseInt(matches[1])
          const totalItems = parseInt(matches[2])

          if (completedItems === totalItems) {
            return true
          } else {
            core.warning(
              `Jira issue ${issueIdOrKey} has an incomplete checklist.`
            )
            return false
          }
        } else {
          core.warning(
            `Jira issue ${issueIdOrKey} has an invalid checklist value.`
          )
          return false
        }
      }
      return true
    } catch (error) {
      core.debug(`getIssue error: ${error}`)
      return false
    }
  }
}
