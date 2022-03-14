export type NoteType = 'text' | 'checklist' | 'image'

export interface CheckList {
  order: number
  done: boolean
  task: string
  id: string
}

export interface Note {
  type: NoteType
  title?: String
  content?: String
  imageUrl?: string
  pinned?: boolean
  checklist?: CheckList[]
}
