import { UserProvider } from '@auth0/nextjs-auth0/client'
import { CacheProvider, EmotionCache } from '@emotion/react'
import { Layout } from '@src/components/Layout'
import { HeaderProvider } from '@src/contexts/HeaderContext'
import { api } from '@src/utils/network'
import { NextSeo } from 'next-seo'
import { AppProps } from 'next/app'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { SWRConfig } from 'swr'
import { createEmotionCache } from '../utils/createEmotionCache'

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache()

export interface GAAppProps extends AppProps {
  emotionCache?: EmotionCache
}

export const GAApp = (props: GAAppProps) => {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props

  return (
    <SWRConfig
      value={{
        errorRetryCount: 1, // only retry once, then throw error
        fetcher: (resource, init) =>
          api.get(resource, init).then((res) => res.data),
        onErrorRetry: (error) => {
          toast.error(error.response?.data?.message || error.message || error)
        },
      }}
    >
      <NextSeo
        additionalLinkTags={[
          {
            rel: 'apple-touch-icon',
            href: '/logo192.png',
            sizes: '192x192',
          },
          {
            rel: 'manifest',
            href: '/manifest.json',
          },
          {
            rel: 'preconnect',
            href: 'https://log.cookieyes.com',
          },
        ]}
        titleTemplate="%s | Green Analytics"
      />
      <UserProvider>
        <HeaderProvider>
          <CacheProvider value={emotionCache}>
            <Layout>
              <Component {...pageProps} />
              <ToastContainer />
            </Layout>
          </CacheProvider>
        </HeaderProvider>
      </UserProvider>
    </SWRConfig>
  )
}

export default GAApp
