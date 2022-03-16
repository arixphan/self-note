export type NoteType = 'text' | 'checklist' | 'image';

export interface CheckList {
  order: number;
  done: boolean;
  task: string;
  id: string;
}

export interface Note {
  id?: string;
  type: NoteType;
  title?: String;
  content?: String;
  imagePath?: string;
  pinned?: boolean;
  checklist?: CheckList[];
}
