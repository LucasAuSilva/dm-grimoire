import { ScrollArea } from '@/components/ui/scroll-area'
import { PAPER_RATIOS, type PaperSizes } from '@/utils/constants'

interface PreviewPageProps {
  previewHtml: string
  paper: PaperSizes
}

export default function PreviewPage({ previewHtml, paper }: PreviewPageProps) {
  const paperSize = PAPER_RATIOS[paper]
  
  return (
    <ScrollArea className="h-[calc(100vh-8rem)]">
      <div className="bg-zinc-500 flex justify-center p-10">
        <div
          className="bg-white shadow-xl"
          style={{
            ...paperSize,
            marginTop: "8mm",
            marginBottom: "8mm",
            marginLeft: "22mm",
            marginRight: "10mm"
          }}
        >
          <iframe
            srcDoc={previewHtml}
            className="w-full h-full border-none"
          />
        </div>
      </div>
    </ScrollArea>
  )
}
