import { ScrollArea } from '@/components/ui/scroll-area'

interface PreviewPageProps {
  pdfUrl?: string
}

export default function PreviewPage({ pdfUrl }: PreviewPageProps) {
  return (
    <ScrollArea className="h-[calc(100vh-7rem)]">
      <div className="bg-white shadow-xl" >
        {pdfUrl && (
          <iframe
            src={pdfUrl}
            className="w-full h-screen border-none"
          />
        )}
      </div>
    </ScrollArea>
  )
}
