import React from 'react'
import Link from 'next/link'
import { Container, Button, List, Divider, Header } from 'semantic-ui-react'

export const ThankYouScreen = ({ isSmallScreen }) => {
  return (
    <>
      <Container text textAlign="center">
        <Header
          as="h1"
          style={{
            fontSize: isSmallScreen ? '2.3em' : '3em',
            fontWeight: 'bold',
            marginBottom: 0,
            marginTop: isSmallScreen ? null : '0.7em',
          }}
        >
          Thank you for joining us in OptriSpace!
        </Header>

        <Header
          as="h2"
          style={{
            fontSize: isSmallScreen ? '1.3em' : '1.8em',
            fontWeight: 'normal',
            marginTop: isSmallScreen ? '1.3em' : '1.3em',
          }}
        >
          It doesn&apos;t matter where you live. It doesn&apos;t matter if you
          like working from home, from an office, or from the beach. It
          doesn&apos;t matter the currency you use.
          <br />
          <br />
          Sign up on our website and start looking
          <br />
          for your next job today!
        </Header>
      </Container>

      <Divider style={{ marginTop: isSmallScreen ? '1.3em' : '1.8em' }} />

      <Container text style={{ marginTop: '2em' }}>
        <p>
          <strong>One last thing before we start...</strong>
        </p>

        <List ordered>
          <List.Item>Check your inbox for everything we promised.</List.Item>
          <List.Item>
            Look for our email from &quot;OptriSpace Team&quot;
            (office@optriment.com) that we just sent to you.
          </List.Item>
          <List.Item>Add us to your safety-senders list.</List.Item>
          <List.Item>
            Click &quot;Yes, subscribe me to this list&quot; in the email.
          </List.Item>
          <List.Item>
            If you don&apos;t receive our confirmation email in the next 2
            hours, please contact us.
          </List.Item>
        </List>
      </Container>

      <Divider
        style={{ marginTop: isSmallScreen ? '1.3em' : '1.8em' }}
        hidden
      />

      <Container textAlign="center">
        <Link href="/sign_up" passHref>
          <Button primary>Click to Continue…</Button>
        </Link>
      </Container>
    </>
  )
}
