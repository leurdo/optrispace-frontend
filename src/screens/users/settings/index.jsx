import React from 'react'
import { Input, Segment, Grid, Header } from 'semantic-ui-react'
import { ChangePasswordForm } from '../../../forms/ChangePassword'
import { ChangeDisplayName } from '../../../forms/ChangeDisplayName'
import { ConnectWalletForm } from '../../../forms/ConnectWalletForm'
import { ChangeEmail } from '../../../forms/ChangeEmail'

export const SettingsScreen = ({ person, token, authenticate }) => {
  return (
    <>
      <Header as="h1">Settings</Header>

      <Grid padded stackable>
        <Grid.Row>
          <Grid.Column width={8}>
            <Header as="h3">Connect Wallet</Header>

            <ConnectWalletForm token={token} person={person} />
          </Grid.Column>
        </Grid.Row>

        <Grid.Row>
          <Grid.Column width={8}>
            <Header as="h3">Change Display Name</Header>

            <ChangeDisplayName
              token={token}
              id={person.id}
              displayName={person.display_name}
            />
          </Grid.Column>
        </Grid.Row>

        <Grid.Row>
          <Grid.Column width={8}>
            <Header as="h3">Change Email</Header>
            <ChangeEmail token={token} id={person.id} email={person.email} />
          </Grid.Column>
        </Grid.Row>

        <Grid.Row>
          <Grid.Column width={8}>
            <Header as="h3">Change Password</Header>

            <ChangePasswordForm token={token} authenticate={authenticate} />
          </Grid.Column>
        </Grid.Row>

        <Grid.Row>
          <Grid.Column width={8}>
            <Header as="h3">Your ID (for bug reports)</Header>

            <Segment>
              <Input value={person.id} readOnly fluid />
            </Segment>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </>
  )
}
