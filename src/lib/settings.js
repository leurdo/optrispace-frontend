import { putWithToken } from './fetcher'
import getConfig from 'next/config'
const { publicRuntimeConfig } = getConfig()

export async function changeUserPassword(
  token,
  { old_password, new_password }
) {
  return await putWithToken(`${publicRuntimeConfig.api_url}/password`, token, {
    old_password,
    new_password,
  })
}

export async function changeWallet(token, personId, { walletAddress }) {
  return await putWithToken(
    `${publicRuntimeConfig.api_url}/persons/${personId}`,
    token,
    {
      ethereum_address: walletAddress,
    }
  )
}
