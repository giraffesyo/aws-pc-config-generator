import Head from 'next/head'
import { FaGithub } from 'react-icons/fa'
const Layout: React.FC = ({ children }) => {
  return (
    <div className='mb-12'>
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
      <div>{children}</div>
      <div
        className='text-center fixed bottom-0 w-full mb-1'
        style={{ zIndex: -10 }}
      >
        Created by{' '}
        <a
          target='_blank'
          className='font-medium text-purple-800 hover:opacity-80'
          href='https://giraffesyo.io'
        >
          Michael "giraffesyo" McQuade
        </a>
        , source code available on{' '}
        <a target='_blank' href='https://github.com/giraffesyo'>
          <FaGithub className='inline hover:opacity-80'></FaGithub>
        </a>
      </div>
    </div>
  )
}

export default Layout
