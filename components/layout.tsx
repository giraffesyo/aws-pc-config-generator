import Head from 'next/head'

const Layout: React.FC = ({ children }) => {
  return (
    <>
      <Head>
        <title>ParallelCluster Config Generator</title>
        <link
          rel='apple-touch-icon'
          sizes='180x180'
          href='/icons/apple-touch-icon.png'
        />
        <link
          rel='icon'
          type='image/png'
          sizes='32x32'
          href='/icons/favicon-32x32.png'
        />
        <link
          rel='icon'
          type='image/png'
          sizes='16x16'
          href='/icons/favicon-16x16.png'
        />
        <link rel='manifest' href='/icons/site.webmanifest' />
        <link
          rel='mask-icon'
          href='/icons/safari-pinned-tab.svg'
          color='#5bbad5'
        />
        <link rel='shortcut icon' href='/icons/favicon.ico' />
        <meta name='msapplication-TileColor' content='#2b5797' />
        <meta name='msapplication-config' content='/icons/browserconfig.xml' />
        <meta name='theme-color' content='#ffffff' />
      </Head>
      {children}
    </>
  )
}

export default Layout
