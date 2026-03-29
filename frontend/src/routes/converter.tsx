import React from 'react'

import PreviewPage from '@/components/preview-page'
import { PropertiesSideBar } from '@/components/properties'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/converter')({
  component: RouteComponent,
})

function RouteComponent() {
  const [previewUrl, setPreviewUrl] = React.useState('')
  const formRefs = {
    formRef: React.useRef<HTMLFormElement>(null),
    fileInputRef: React.useRef<HTMLInputElement>(null)
  }

  return (
    <section className='grid grid-cols-4 gap-4'>
      <PropertiesSideBar formRefs={formRefs} setPreview={setPreviewUrl} />
      <div className="col-span-3">
        <PreviewPage formRefs={formRefs} pdfUrl={previewUrl} />
      </div>
    </section>
  )

}
