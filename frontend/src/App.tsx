import { useRef, useState } from 'react'

import PreviewPage from './components/preview-page'
import { PropertiesSideBar } from './components/properties'
import { ThemeProvider } from './components/theme-provider'
import { LoadingProvider } from './context/loading-context'
import { TopBar } from './components/top-bar'
import { usePageContext } from './context/page-context'
import { CombatTracker } from './components/combat-tracker'

function App() {
  const [previewUrl, setPreviewUrl] = useState('')
  const { page } = usePageContext()
  const formRefs = {
    formRef: useRef<HTMLFormElement>(null),
    fileInputRef: useRef<HTMLInputElement>(null)
  }

  return (
    <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
      <LoadingProvider>
        <div className="p-6 flex flex-col gap-4">
          <TopBar/>
          {page === 'converter' && (
            <main className='grid grid-cols-4 gap-4'>
              <PropertiesSideBar formRefs={formRefs} setPreview={setPreviewUrl} />
              <div className="col-span-3">
                <PreviewPage formRefs={formRefs} pdfUrl={previewUrl} />
              </div>
            </main>
          )}
          {page === 'combat' && (
            <CombatTracker />
          )}
        </div>
      </LoadingProvider>
    </ThemeProvider>
  )
}

export default App
