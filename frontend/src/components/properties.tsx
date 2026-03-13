
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
import { Checkbox } from './ui/checkbox'
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from './ui/input-group'


interface PropertiesSideBarProps {
  setPreview: React.Dispatch<React.SetStateAction<string>>
}

interface PreviewPDFFormData {
  title?: string
  paperSize: string
  fontSize: number
  columns: number
  files: FileList
  useFileName: boolean
  marginLeft: number
  ignored: {
    value: string
  }[]
  tagsToInclude: {
    value: string
  }[]
}

export function PropertiesSideBar({ setPreview }: PropertiesSideBarProps) {
  const [loading, setLoading] = useState(false)
  const [useFileNameChecked, setUseFileNameChecked] = useState(false)
  const [section, setSection] = useState('')
  const [tag, setTag] = useState('')

  const { register, handleSubmit, control, formState: {} } = useForm<PreviewPDFFormData>({
    defaultValues: {
      title: "Preview",
      columns: 2,
      fontSize: 10,
      paperSize: 'A4'
    }
  })

  const { fields: ignoredFields, append: appendIgnored, remove: removeIgnored } = useFieldArray({
    control,
    name: 'ignored'
  })

  const { fields: tagsFields, append: appendTags, remove: removeTags } = useFieldArray({
    control,
    name: 'tagsToInclude'
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
        use_file_name: useFileNameChecked,
        margin_left: data.marginLeft,
        ignored: data.ignored.flatMap(i => i.value.toLowerCase()),
        tags: data.tagsToInclude.flatMap(i => i.value.toLowerCase()),
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

          <div className='flex gap-1'>
          <Checkbox
            id='use-file-name'
            checked={useFileNameChecked}
            onCheckedChange={(value) => setUseFileNameChecked(value as any)}
          />
          <Label htmlFor="use-file-name">Use file name?</Label>
          </div>
        </div>
        <div className='flex flex-col gap-2'>
          <Label htmlFor="fontSize">Font size</Label>
          <InputGroup>
            <InputGroupInput id='fontSize' placeholder="0" {...register('fontSize', {
                valueAsNumber: true
              })}
            />
            <InputGroupAddon align="inline-end">
              <InputGroupText>px</InputGroupText>
            </InputGroupAddon>
          </InputGroup>
        </div>
        <div className='flex flex-col gap-2'>
          <Label htmlFor="columns">Columns</Label>
          <Input id="columns" {...register('columns')} />
        </div>
        <div className='flex flex-col gap-2'>
          <Label htmlFor="marginLeft">Margin Left</Label>
          <InputGroup>
            <InputGroupInput id='marginLeft' placeholder="0" {...register('marginLeft', {
                valueAsNumber: true
              })}
            />
            <InputGroupAddon align="inline-end">
              <InputGroupText>mm</InputGroupText>
            </InputGroupAddon>
          </InputGroup>
        </div>
        <div className='flex flex-col gap-2'>
          <Label htmlFor="tagsToInclude">Tags to include</Label>
          <ButtonGroup className='w-full'>
            <Input value={tag} id="tagsToInclude" onChange={(e) => setTag(e.target.value)} />
            <Button
              variant='outline'
              aria-label="Plus"
              onClick={() => {
                appendTags({
                  value: tag
                })
                setTag('')
              }}
            >
              <IconPlus />
            </Button>
          </ButtonGroup>
          <ul className='flex gap-1'>
            {tagsFields.map((i, idx) =>
              <li>
                <Badge variant='default'>
                  <Button
                    size='xs'
                    className='p-0 cursor-pointer'
                    onClick={
                      () => removeTags(idx)
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
          <Label htmlFor="ignoredSections">Ignored Sections</Label>
          <ButtonGroup className='w-full'>
            <Input value={section} id="ignoredSections" onChange={(e) => setSection(e.target.value)} />
            <Button
              variant='outline'
              aria-label="Plus"
              onClick={() => {
                appendIgnored({
                  value: section
                })
                setSection('')
              }}
            >
              <IconPlus />
            </Button>
          </ButtonGroup>
          <ul className='flex gap-1'>
            {ignoredFields.map((i, idx) =>
              <li>
                <Badge variant='default'>
                  <Button
                    size='xs'
                    className='p-0 cursor-pointer'
                    onClick={
                      () => removeIgnored(idx)
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
