import { useRef, useState } from 'react'

import { ModeToggle } from './components/mode-toggle'
import PreviewPage from './components/preview-page'
import { PropertiesSideBar } from './components/properties'
import { ThemeProvider } from './components/theme-provider'
import { LoadingProvider } from './context/loading-context'

function App() {
  const [previewUrl, setPreviewUrl] = useState('')
  const formRefs = {
    formRef: useRef<HTMLFormElement>(null),
    fileInputRef: useRef<HTMLInputElement>(null)
  }

  return (
    <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
      <LoadingProvider>
        <div className="p-6 flex flex-col gap-4">
          <div>
            <ModeToggle />
          </div>
          <main className='grid grid-cols-4 gap-4'>
            <PropertiesSideBar formRefs={formRefs} setPreview={setPreviewUrl} />
            <div className="col-span-3">
              <PreviewPage formRefs={formRefs} pdfUrl={previewUrl} />
            </div>
          </main>
        </div>
      </LoadingProvider>
    </ThemeProvider>
  )
}

export default App
