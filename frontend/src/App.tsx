import { useState } from 'react'

import { ModeToggle } from './components/mode-toggle'
import PreviewPage from './components/preview-page'
import { PropertiesSideBar } from './components/properties'
import { ThemeProvider } from './components/theme-provider'
import type { PaperSizes } from './utils/constants'

function App() {
  const [previewHtml, setPreviewHtml] = useState('')
  const [pageSize, setPageSize] = useState<PaperSizes>('A4')

  return (
    <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
      <div className="p-6 flex flex-col gap-4">
        <div>
          <ModeToggle />
        </div>
        <main className='grid grid-cols-4 gap-4'>
          <PropertiesSideBar setPageSize={setPageSize} setPreview={setPreviewHtml} />
          <div className="col-span-3">
            <PreviewPage paper={pageSize} previewHtml={previewHtml} />
          </div>
        </main>
      </div>
    </ThemeProvider>
  )
}

export default App
