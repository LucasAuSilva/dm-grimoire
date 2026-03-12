
import { useState } from 'react'

import { Input } from './ui/input'
import { Label } from './ui/label'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Button } from './ui/button'

import axios from 'axios'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { ButtonGroup } from './ui/button-group'
import { IconPlus, IconX } from '@tabler/icons-react'
import { Separator } from './ui/separator'
import { Badge } from './ui/badge'


interface PropertiesSideBarProps {
  setPreview: React.Dispatch<React.SetStateAction<string>>
}

interface PreviewPDFFormData {
  title?: string
  paperSize: string
  fontSize: number
  columns: number
  files: FileList
  ignored: {
    value: string
  }[]
}

export function PropertiesSideBar({ setPreview }: PropertiesSideBarProps) {
  const [loading, setLoading] = useState(false)
  const [section, setSection] = useState('')

  const { register, handleSubmit, control, formState: {} } = useForm<PreviewPDFFormData>({
    defaultValues: {
      title: "Preview",
      columns: 2,
      fontSize: 10,
      paperSize: 'A4'
    }
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'ignored'
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
        paper_size: data.paperSize,
        ignored: data.ignored.flatMap(i => i.value.toLowerCase())
      })
    )

    setLoading(true)

    try {
      const res = await axios.post(
        "http://localhost:8000/preview",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          },
          responseType: "blob"
        },
      )
      const blob = new Blob([res.data], { type: "application/pdf" })
      const resUrl = URL.createObjectURL(blob)

      setPreview(resUrl)
    } catch (err) {
      console.error(err)
    }

    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit(generatePreview)} className='flex flex-col gap-2'>
      <div className='flex flex-col gap-4'>
        <div className='flex flex-col gap-2'>
          <Label htmlFor="title">Title</Label>
          <Input id="title" {...register('title')} />
        </div>
        <div className='flex flex-col gap-2'>
          <Label htmlFor="fontSize">Font size</Label>
          <Input id="fontSize" {...register('fontSize', {
            valueAsNumber: true
          })} />
        </div>
        <div className='flex flex-col gap-2'>
          <Label htmlFor="columns">Columns</Label>
          <Input id="columns" {...register('columns')} />
        </div>
        <div className='flex flex-col gap-2'>
          <Label htmlFor="marginLeft">Margin Left</Label>
          <Input id="marginLeft" />
        </div>
        <div className='flex flex-col gap-2'>
          <Label htmlFor="ignoredSections">Ignored Sections</Label>
          <ButtonGroup className='w-full'>
            <Input value={section} id="ignoredSections" onChange={(e) => setSection(e.target.value)} />
            <Button
              variant='outline'
              aria-label="Plus"
              onClick={() => {
                append({
                  value: section
                })
                setSection('')
              }}
            >
              <IconPlus />
            </Button>
          </ButtonGroup>
          <ul className='flex gap-1'>
            {fields.map((i, idx) =>
              <li>
                <Badge variant='default'>
                  <Button
                    size='xs'
                    className='p-0 cursor-pointer'
                    onClick={
                      () => remove(idx)
                    }
                  >
                    {i.value}
                    <IconX />
                  </Button>
                </Badge>
              </li>
            )}
          </ul>
        </div>
        <div className='flex flex-col gap-2'>
          <Label htmlFor="columns">Paper Type</Label>
          <Controller
            name="paperSize"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={(value) => {
                field.onChange(value)
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
      </div>

      <Separator className='my-4' />

      <div className="flex flex-col gap-2 border-b">
        <Label htmlFor="files-to-convert">Files to convert</Label>
        <Input
          id="files-to-convert"
          type="file"
          multiple
          accept=".md"
          {...register('files')}
        />
      </div>

      <Separator className='my-4' />

      <Button type='submit'>
        {loading ? "Loading..." : "Generate PDF"}
      </Button>
    </form>
  )
}
