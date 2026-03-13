import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { useLoadingContext } from "@/context/loading-context";
import { IconFileTypePdf } from "@tabler/icons-react"
import { Spinner } from "./ui/spinner";

interface EmptyPreviewProps {
  formRefs: {
    formRef: React.RefObject<HTMLFormElement | null>;
    fileInputRef: React.RefObject<HTMLInputElement | null>;
  }
}

export function EmptyPreview({ formRefs: { fileInputRef, formRef: formRef } }: EmptyPreviewProps) {
  const {isLoading, updateLoading} = useLoadingContext()

  const handleUploadAndSubmit = () => {
    const input = fileInputRef.current
    if (!input) return

    updateLoading(true)

    const onFileChange = () => {
      input.removeEventListener('change', onFileChange)
      setTimeout(() => {
        formRef.current?.requestSubmit()
      }, 0)
    }

    input.addEventListener('change', onFileChange)
    input.click()

    updateLoading(false)
  }

  return (
    <Empty className="h-[calc(100vh-8rem)]">
      <EmptyMedia variant="icon">
        <IconFileTypePdf />
      </EmptyMedia>
      {isLoading ? (
        <EmptyHeader>
          <EmptyTitle>No Previews Yet</EmptyTitle>
          <EmptyDescription>
            You haven&apos;t generated any PDF. Get started by uploading
            your DM notes (.md).
          </EmptyDescription>
        </EmptyHeader>
      ) : (
        <Spinner />
      )}
      <EmptyContent className="flex-row justify-center gap-2">
        <Button variant="default" onClick={handleUploadAndSubmit}>
          Upload your notes
        </Button>
      </EmptyContent>
    </Empty>
  )
}

