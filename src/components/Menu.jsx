import React, { useContext } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  Loader,
  Icon,
  Button,
  Container,
  Dropdown,
  Menu,
} from 'semantic-ui-react'
import ClientOnly from './ClientOnly'
import { useAuth } from '../hooks'
import { useRouter } from 'next/router'
import Web3Context from '../context/web3-context'
import Logo from '../../public/optrispace.svg'

const MenuComponent = () => {
  const router = useRouter()

  return (
    <Menu secondary borderless size="large" style={{ marginTop: '10px' }}>
      <Menu.Item>
        <Link href="/" passHref>
          <a>
            <Image src={Logo} alt="OptriSpace" width="100" height="42" />
          </a>
        </Link>
      </Menu.Item>

      <Menu.Item active={router.pathname == '/jobs'}>
        <Link href="/jobs">
          <a>Jobs</a>
        </Link>
      </Menu.Item>

      <ClientOnly>
        <AuthDetails />
      </ClientOnly>
    </Menu>
  )
}

function AuthDetails() {
  const { person, logout, isLoading } = useAuth()
  const {
    isWalletInstalled,
    isCorrectNetwork,
    isWalletConnected,
    currentAccount,
    connectWallet,
    accountBalance,
    accountBalanceLoading,
    coinSymbol,
    blockchainNetworkName,
  } = useContext(Web3Context)
  const router = useRouter()

  if (isLoading) {
    return <Loader size="tiny" active inline />
  }

  if (!person) {
    return (
      <Container>
        <Menu.Menu position="right">
          <Menu.Item active={router.pathname == '/sign_up'}>
            <Link href="/sign_up" passHref>
              <a>Sign Up</a>
            </Link>
          </Menu.Item>

          <Menu.Item active={router.pathname == '/sign_in'}>
            <Link href="/sign_in" passHref>
              <a>Log In</a>
            </Link>
          </Menu.Item>
        </Menu.Menu>
      </Container>
    )
  }

  return (
    <Container>
      <Menu.Item active={router.pathname == '/applications'}>
        <Link href="/applications" passHref>
          <a>Applications</a>
        </Link>
      </Menu.Item>

      <Menu.Item active={router.pathname == '/contracts'}>
        <Link href="/contracts" passHref>
          <a>Contracts</a>
        </Link>
      </Menu.Item>

      <Menu.Menu position="right">
        <Menu.Item icon>
          {isWalletInstalled ? (
            <>
              {isCorrectNetwork ? (
                <>
                  {isWalletConnected ? (
                    <>
                      {currentAccount === '' ? (
                        <Icon
                          name="warning sign"
                          size="large"
                          color="orange"
                          title="Unable to get your wallet address"
                        />
                      ) : (
                        <>
                          {accountBalanceLoading ? (
                            <Loader size="tiny" active inline />
                          ) : (
                            <b>
                              Balance: {accountBalance} {coinSymbol}
                            </b>
                          )}
                        </>
                      )}
                    </>
                  ) : (
                    <Button color="orange" inverted onClick={connectWallet}>
                      Connect Wallet
                    </Button>
                  )}
                </>
              ) : (
                <Icon
                  name="warning sign"
                  size="large"
                  color="red"
                  title={`Please connect your wallet to ${blockchainNetworkName}`}
                />
              )}
            </>
          ) : (
            <a href="https://metamask.io/" target="_blank" rel="noreferrer">
              <Button color="orange" inverted>
                Install Wallet
              </Button>
            </a>
          )}
        </Menu.Item>

        <Dropdown item text="Account">
          <Dropdown.Menu>
            <Link href="/settings" passHref>
              <Dropdown.Item icon="settings" text="Settings" />
            </Link>
            <Dropdown.Divider />
            <Dropdown.Item
              onClick={() => logout()}
              icon="sign-out"
              text="Sign Out"
            />
          </Dropdown.Menu>
        </Dropdown>
      </Menu.Menu>
    </Container>
  )
}

export default MenuComponent
