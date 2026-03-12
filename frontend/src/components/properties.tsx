
import { useState } from 'react'

import { Input } from './ui/input'
import { Label } from './ui/label'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Button } from './ui/button'

import axios from 'axios'
import { Controller, useForm } from 'react-hook-form'


interface PropertiesSideBarProps {
  setPreview: React.Dispatch<React.SetStateAction<string>>
  setPageSize: React.Dispatch<React.SetStateAction<"A4" | "A5" | "A6" | "BINDER">>
}

interface PreviewPDFFormData {
  title?: string
  paperSize: string
  fontSize: number
  columns: number
  files: FileList
}

export function PropertiesSideBar({ setPreview, setPageSize }: PropertiesSideBarProps) {
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, control, formState: {} } = useForm<PreviewPDFFormData>({
  })

  const generatePreview = async (data: PreviewPDFFormData) => {
    if (data.files.length === 0) return
    const formData = new FormData()
    Array.from(data.files).forEach(file => {
      formData.append("files", file)
    })

    // required by your FastAPI endpoint
    formData.append(
      "config",
      JSON.stringify({
        title: data.title ?? "Preview",
        columns: data.columns,
        font_size: data.fontSize,
        paper_size: data.paperSize
      })
    )

    setLoading(true)

    console.log(formData)

    try {
      const res = await axios.post(
        "http://localhost:8000/preview",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      )
      setPreview(res.data.html)
    } catch (err) {
      console.error(err)
    }

    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit(generatePreview)} className='flex flex-col gap-2'>
      <div>
        <Label htmlFor="title">Title</Label>
        <Input id="title" {...register('title')} />
      </div>
      <div>
        <Label htmlFor="fontSize">Font size</Label>
        <Input id="fontSize" {...register('fontSize', {
          valueAsNumber: true
        })} />
      </div>
      <div>
        <Label htmlFor="columns">Columns</Label>
        <Input id="columns" {...register('columns')} />
      </div>
      <div>
        <Label htmlFor="marginLeft">Margin Left</Label>
        <Input id="marginLeft" />
      </div>
      <div>
        <Label htmlFor="ignoredSections">Ignored Sections</Label>
        <Input id="ignoredSections" />
      </div>
      <div>
        <Controller
          name="paperSize"
          control={control}
          render={({ field }) => (
            <Select onValueChange={(value) => {
              field.onChange(value)
              setPageSize(value as any)
            }}>
              <SelectTrigger className="w-full">
                <SelectValue defaultValue='A4' placeholder="Type of paper" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="A4">A4</SelectItem>
                  <SelectItem value="A5">A5</SelectItem>
                  <SelectItem value="A6">A6</SelectItem>
                  <SelectItem value="BINDER">Binder</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          )}
        />
      </div>

      <div className="flex gap-4 p-4 border-b">
        <Label htmlFor="files-to-convert">Files to convert</Label>
        <Input
          id="files-to-convert"
          type="file"
          multiple
          accept=".md"
          {...register('files')}
        />
      </div>

      <Button type='submit'>
        {loading ? "Loading..." : "Preview"}
      </Button>
    </form>
  )
}
