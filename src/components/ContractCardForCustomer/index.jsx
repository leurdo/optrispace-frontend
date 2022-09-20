import * as Sentry from '@sentry/nextjs'
import React, { useState, useEffect, useContext } from 'react'
import { useRouter } from 'next/router'
import {
  Message,
  Container,
  Button,
  Header,
  Grid,
  Segment,
} from 'semantic-ui-react'
import { approveContract, deployContract, fundContract } from '../../lib/api'
import ErrorWrapper from '../ErrorWrapper'
import { ContractCardSidebar } from '../ContractCardSidebar'
import { ethers } from 'ethers'
import contractABI from '../../../contracts/Contract.json'
import Web3Context from '../../context/web3-context'
import WalletIsNotInstalled from '../WalletIsNotInstalled'
import { JustOneSecondBlockchain } from '../JustOneSecond'
import WrongBlockchainNetwork from '../WrongBlockchainNetwork'
import ConnectWallet from '../ConnectWallet'
import { FormattedDescription } from '../FormattedDescription'
import { isEmptyString } from '../../lib/validators'
import { ContractCardSteps } from '../ContractCardSteps'

export const ContractCardForCustomer = ({ contract, token, tokenSymbol }) => {
  const router = useRouter()

  const {
    isLoading: isLoadingWeb3,
    isWalletInstalled,
    isCorrectNetwork,
    connectWallet,
    currentAccount,
    accountBalance,
    contractFactory, // FIXME: Rename to contractFactoryContract
    signer,
    isWalletReady,
    blockchainViewAddressURL,
  } = useContext(Web3Context)

  const [error, setError] = useState('')

  const [txLoading, setTxLoading] = useState(false)
  const [txStatus, setTxStatus] = useState('')

  const [contractAddress, setContractAddress] = useState('')
  const [contractBalance, setContractBalance] = useState('')
  const [contractStatus, setContractStatus] = useState('')

  const reset = () => {
    setError('')
    setTxStatus('')
    setTxLoading(false)
  }

  const catchException = (err) => {
    reset()

    console.error({ err })
    Sentry.captureException(err)

    if (err?.data?.message.match(/execution reverted/)) {
      setError(
        'Blockchain error: ' +
          err.data.message.replace(/execution reverted:/, '').trim()
      )
    } else if (err.message.match(/user denied transaction/i)) {
      setError('You are denied transaction! Please try again.')
    } else {
      setError(
        'Transaction error: ' + (err?.data?.message || err?.message || err)
      )
    }
  }

  const callSmartContract = async (action, validate, callback) => {
    reset()

    if (!isWalletReady) {
      setError('Wallet is not ready')
      return
    }

    if (!validate()) {
      return
    }

    setTxLoading(true)
    setTxStatus(`Smart Contract: ${action}...`)

    try {
      const tx = await callback()

      setTxStatus('Waiting for transaction hash...')

      await tx.wait()

      router.reload()
    } catch (err) {
      catchException(err)
    }
  }

  const callBackend = (validate, callback) => {
    reset()

    if (!validate()) {
      return
    }

    try {
      callback()
        .then(() => router.reload())
        .catch((err) => setError(err?.info?.message || err.message))
    } catch (err) {
      console.error({ err })
      Sentry.captureException(err)
      setError(err.message)
    }
  }

  const getContractFromBlockchain = async () => {
    const _contractOnBlockchain = await contractFactory.getContractById(
      contract.id
    )

    return _contractOnBlockchain
  }

  const deployToBlockchain = async () => {
    await callSmartContract(
      'Create',
      () => {
        if (contract.status !== 'accepted') {
          setError('Contract is not accepted yet!')
          return false
        }

        return true
      },
      () => {
        const contractPrice = parseEther(contract.price)

        return contractFactory.createContract(
          contract.id,
          contract.performer_address,
          contractPrice,
          contract.customer_id,
          contract.performer_id
        )
      }
    )
  }

  const setAsDeployedOnBackend = () => {
    callBackend(
      () => {
        if (contractStatus !== 'Created') {
          setError('The contract has not been created on the blockchain')
          return false
        }

        if (isEmptyString(contractAddress)) {
          setError(
            'Unable to get contract address from blockchain. Refresh the page'
          )
          return false
        }

        return true
      },
      () => {
        return deployContract(token, contract.id, contractAddress)
      }
    )
  }

  const fundOnBlockchain = async () => {
    await callSmartContract(
      'Fund',
      () => {
        if (contractStatus !== 'Signed') {
          setError('The contract has not been signed on the blockchain')
          return false
        }

        if (accountBalance <= contract.price) {
          setError(
            'You do not have enough tokens to fund the contract. Required: ' +
              contract.price +
              ' ' +
              tokenSymbol
          )
          return false
        }

        return true
      },

      () => {
        const _contract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        )

        return _contract.fund({
          value: parseEther(contract.price),
        })
      }
    )
  }

  const setAsFundedOnBackend = () => {
    callBackend(
      () => {
        if (contractStatus !== 'Funded') {
          setError('The contract has not been funded on the blockchain')
          return false
        }

        return true
      },
      () => {
        return fundContract(token, contract.id)
      }
    )
  }

  const approveOnBlockchain = async () => {
    await callSmartContract(
      'Approve',
      () => {
        if (contractStatus !== 'Funded') {
          setError('The contract has not been funded on the blockchain')
          return false
        }

        return true
      },
      () => {
        const _contract = new ethers.Contract(
          contract.contract_address,
          contractABI,
          signer
        )

        return _contract.approve()
      }
    )
  }

  const setAsApprovedOnBackend = () => {
    callBackend(
      () => {
        if (contractStatus !== 'Approved') {
          setError('The contract has not been approved on the blockchain')
          return false
        }

        return true
      },
      () => {
        return approveContract(token, contract.id)
      }
    )
  }

  const convertToEth = (value) => {
    return ethers.utils.formatEther(value.toString())
  }

  const parseEther = (value) => {
    return ethers.utils.parseEther(parseFloat(value.toString()).toString())
  }

  useEffect(() => {
    reset()

    if (!isWalletReady) {
      return
    }

    setTxLoading(true)
    setTxStatus('Requesting contract from blockchain...')

    getContractFromBlockchain()
      .then((_contractOnBlockchain) => {
        setContractAddress(_contractOnBlockchain[0])
        setContractStatus(_contractOnBlockchain[8])
        setContractBalance(convertToEth(_contractOnBlockchain[1]))
      })
      .catch((err) => {
        if (err.reason !== 'Contract does not exist') {
          console.error({ err })
          Sentry.captureException(err)
          setError(err.reason)
        }
      })

    setTxStatus('')
    setTxLoading(false)
  }, [])

  if (!isWalletInstalled) {
    return <WalletIsNotInstalled />
  }

  if (!isCorrectNetwork) {
    return <WrongBlockchainNetwork router={router} />
  }

  const currentStatus = contract.status

  const statuses = {
    created: 1,
    accepted: 2,
    deployed: 3,
    signed: 4,
    funded: 5,
    approved: 6,
    completed: 7,
  }

  const currentStep = statuses[currentStatus] + 1

  return (
    <>
      <Header as="h1">{contract.title}</Header>

      {isWalletInstalled && isCorrectNetwork && currentAccount === '' && (
        <ConnectWallet connectWallet={connectWallet} />
      )}

      <ContractCardSteps
        me="customer"
        currentStatus={currentStatus}
        currentStep={currentStep}
        statuses={statuses}
      />

      {isLoadingWeb3 || txLoading ? (
        <JustOneSecondBlockchain message={txStatus !== '' && txStatus} />
      ) : (
        <>
          {currentStatus === 'created' && (
            <Message header="Waiting for the contract to be accepted" />
          )}

          {currentStatus === 'accepted' && (
            <Segment basic textAlign="right">
              {contractStatus === 'Created' ? (
                <Button
                  primary
                  content="Set as deployed"
                  onClick={setAsDeployedOnBackend}
                  disabled={isEmptyString(contractAddress)}
                />
              ) : (
                <Button
                  primary
                  content="Deploy to blockchain"
                  onClick={deployToBlockchain}
                  disabled={!isWalletReady}
                />
              )}
            </Segment>
          )}

          {currentStatus === 'signed' && (
            <Segment basic textAlign="right">
              {contractStatus === 'Funded' ? (
                <Button
                  primary
                  content="Set as funded"
                  onClick={setAsFundedOnBackend}
                />
              ) : (
                <Button
                  primary
                  content="Fund"
                  onClick={fundOnBlockchain}
                  disabled={!isWalletReady || accountBalance <= contract.price}
                />
              )}
            </Segment>
          )}

          {currentStatus === 'deployed' && (
            <>
              {contractStatus === 'Signed' ? (
                <Message header="Waiting for the contract to get a signed status" />
              ) : (
                <Message header="Waiting for the contract to be signed on the blockchain" />
              )}
            </>
          )}

          {currentStatus === 'funded' && (
            <Segment basic textAlign="right">
              {contractStatus === 'Approved' ? (
                <Button
                  primary
                  content="Set as approved"
                  onClick={setAsApprovedOnBackend}
                />
              ) : (
                <Button
                  primary
                  content="Approve"
                  onClick={approveOnBlockchain}
                  disabled={!isWalletReady}
                />
              )}
            </Segment>
          )}
        </>
      )}

      <Grid stackable verticalAlign="top">
        {error !== '' && (
          <Grid.Row>
            <Grid.Column>
              <ErrorWrapper header="Failed to perform action" error={error} />
            </Grid.Column>
          </Grid.Row>
        )}

        <Grid.Row>
          <Grid.Column width={10}>
            <Segment>
              <Container text fluid textAlign="justified">
                <FormattedDescription description={contract.description} />
              </Container>
            </Segment>
          </Grid.Column>

          <Grid.Column width={6}>
            <ContractCardSidebar
              contract={contract}
              tokenSymbol={tokenSymbol}
              blockchainViewAddressURL={blockchainViewAddressURL}
              contractBalance={contractBalance}
            />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </>
  )
}
