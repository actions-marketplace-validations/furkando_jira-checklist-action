import {Version3Client} from 'jira.js'
import {JiraClient, JiraClientImpl, JiraConfig} from '../src/jira'

jest.mock('jira.js')
jest.mock('@actions/core')
const mockJira = jest.mocked(Version3Client, true)

beforeEach(() => {
  mockJira.mockClear()
})

describe('JiraClientImpl', () => {
  const jiraConfig: JiraConfig = {
    host: 'https://jira.example.com',
    email: 'test@example.com',
    apiToken: '1234567890'
  }

  test('constructor', async () => {
    new JiraClientImpl(jiraConfig)

    expect(mockJira).toHaveBeenCalledWith({
      host: 'https://jira.example.com',
      authentication: {
        basic: {
          email: 'test@example.com',
          apiToken: '1234567890'
        }
      }
    })
  })

  describe('#issueExists - issue exists', () => {
    let client: JiraClient
    let mockGetIssue: jest.Mock
    let mockGetFields: jest.Mock

    beforeEach(() => {
      mockGetIssue = jest.fn().mockResolvedValue({})
      mockGetFields = jest.fn().mockResolvedValue([])
      mockJira.mockImplementation(() => {
        return {
          issues: {getIssue: mockGetIssue},
          issueFields: {getFields: mockGetFields}
        } as any
      })
      client = new JiraClientImpl(jiraConfig)
    })

    it('calls client.issues.getIssue()', async () => {
      await client.issueExistsAndChecklistCompleted('RNDK-1234')
      expect(mockGetIssue).toHaveBeenCalledTimes(1)
      expect(mockGetIssue).toHaveBeenCalledWith({issueIdOrKey: 'RNDK-1234'})
    })

    it('returns true', async () => {
      const result = await client.issueExistsAndChecklistCompleted('RNDK-1234')
      expect(result).toEqual(true)
    })
  })

  describe('#issueExists - issue does not exists', () => {
    let client: JiraClient
    let mockGetIssue: jest.Mock
    let mockGetFields: jest.Mock

    beforeEach(() => {
      mockGetIssue = jest.fn().mockRejectedValue(new Error('Not Found'))
      mockGetFields = jest.fn().mockResolvedValue([])

      mockJira.mockImplementation(() => {
        return {
          issues: {getIssue: mockGetIssue},
          issueFields: {getFields: mockGetFields}
        } as any
      })
      client = new JiraClientImpl(jiraConfig)
    })

    it('returns false', async () => {
      const result = await client.issueExistsAndChecklistCompleted('RNDK-1234')
      expect(result).toEqual(false)
    })

    it('calls client.issues.getIssue()', async () => {
      await client.issueExistsAndChecklistCompleted('RNDK-1234')
      expect(mockGetIssue).toHaveBeenCalledTimes(1)
      expect(mockGetIssue).toHaveBeenCalledWith({issueIdOrKey: 'RNDK-1234'})
    })
  })
})
