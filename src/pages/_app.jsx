import React from 'react'
import { AuthProvider } from '../hooks'
import Head from 'next/head'
import { Web3Provider } from '../context/web3-context'

function MyApp({ Component, pageProps }) {
  const getLayout = Component.getLayout ?? ((page) => page)

  return (
    <>
      {Component.requiresAuth && (
        <Head>
          <script
            // If no token is found, redirect immediately
            dangerouslySetInnerHTML={{
              __html: `if(!document.cookie || document.cookie.indexOf('token') === -1)
            {location.replace(
              "/sign_in?next=" + encodeURIComponent(location.pathname + location.search)
            )}`,
            }}
          />
        </Head>
      )}

      <AuthProvider>
        <Web3Provider>{getLayout(<Component {...pageProps} />)}</Web3Provider>
      </AuthProvider>
    </>
  )
}

export default MyApp
