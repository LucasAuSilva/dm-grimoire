import { ScrollArea } from '@/components/ui/scroll-area'
import { EmptyPreview } from './empty-preview'

interface PreviewPageProps {
  pdfUrl?: string
  formRefs: {
    formRef: React.RefObject<HTMLFormElement | null>;
    fileInputRef: React.RefObject<HTMLInputElement | null>;
  }
}

export default function PreviewPage({ pdfUrl, formRefs }: PreviewPageProps) {
  return (
    <ScrollArea className="h-[calc(100vh-7rem)]">
      <div>
        {pdfUrl && (
          <iframe
            src={pdfUrl}
            name="PDF Preview of the generation"
            className="w-full h-screen border-none"
          />
        )}
        {!pdfUrl && (
          <EmptyPreview formRefs={formRefs} />
        )}
      </div>
    </ScrollArea>
  )
}
