import { List, Item } from 'semantic-ui-react'
import { formatDateTime } from '../../lib/formatDate'

export const JobCardHeader = ({ job, tokenSymbol }) => {
  const { customer } = job
  const createdAt = formatDateTime(job.created_at)
  const updatedAt = formatDateTime(job.updated_at)

  return (
    <Item.Group>
      <Item>
        <Item.Image bordered avatar size="tiny" src="/default-userpic.jpg" />

        <Item.Content verticalAlign="middle">
          <Item.Header>{customer.display_name}</Item.Header>
          <Item.Meta>
            <List bulleted horizontal>
              {job.budget > 0 && (
                <List.Item>
                  Budget: {job.budget} {tokenSymbol}
                </List.Item>
              )}
              <List.Item>{job.applications_count} Applicants</List.Item>
            </List>
          </Item.Meta>
          <Item.Extra>
            <List bulleted horizontal>
              <List.Item>Created: {createdAt}</List.Item>
              {updatedAt > createdAt && (
                <List.Item>Updated: {updatedAt}</List.Item>
              )}
            </List>
          </Item.Extra>
        </Item.Content>
      </Item>
    </Item.Group>
  )
}
