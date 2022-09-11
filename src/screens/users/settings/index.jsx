import React from 'react'
import { Input, Segment, Grid, Header } from 'semantic-ui-react'
import JustOneSecond from '../../../components/JustOneSecond'
import ErrorWrapper from '../../../components/ErrorWrapper'
import { ChangePasswordForm } from '../../../forms/ChangePassword'
import { ChangeDisplayName } from '../../../forms/ChangeDisplayName'
import { useAuth } from '../../../hooks'

export const SettingsScreen = () => {
  const {
    isLoading: personLoading,
    isAuthenticated,
    person,
    token,
    authenticate,
  } = useAuth()

  if (personLoading) {
    return <JustOneSecond title="Loading profile..." />
  }

  if (!isAuthenticated) {
    return <ErrorWrapper header="Please, sign in" />
  }

  return (
    <>
      <Header as="h1">Settings</Header>

      <Grid padded stackable>
        <Grid.Row>
          <Grid.Column width={8}>
            <Header as="h3">Your ID (for bug reports)</Header>

            <Segment>
              <Input value={person.id} readOnly fluid />
            </Segment>
          </Grid.Column>
        </Grid.Row>

        <Grid.Row>
          <Grid.Column width={8}>
            <Header as="h3">Change Display Name</Header>

            <Segment>
              <ChangeDisplayName
                token={token}
                id={person.id}
                displayName={person.display_name}
              />
            </Segment>
          </Grid.Column>
        </Grid.Row>

        <Grid.Row>
          <Grid.Column width={8}>
            <Header as="h3">Change Password</Header>

            <ChangePasswordForm token={token} authenticate={authenticate} />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </>
  )
}
