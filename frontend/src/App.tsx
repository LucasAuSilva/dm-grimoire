import { useState } from 'react'

import { ModeToggle } from './components/mode-toggle'
import PreviewPage from './components/preview-page'
import { PropertiesSideBar } from './components/properties'
import { ThemeProvider } from './components/theme-provider'

function App() {
  const [previewUrl, setPreviewUrl] = useState('')

  return (
    <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
      <div className="p-6 flex flex-col gap-4">
        <div>
          <ModeToggle />
        </div>
        <main className='grid grid-cols-4 gap-4'>
          <PropertiesSideBar setPreview={setPreviewUrl} />
          <div className="col-span-3">
            <PreviewPage pdfUrl={previewUrl} />
          </div>
        </main>
      </div>
    </ThemeProvider>
  )
}

export default App
