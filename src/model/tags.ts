export interface CreateTagInput {
  icon?: string,
  parentId?: string,
  value: string
}

export interface Tag {
  icon?: string,
  id: string,
  parentId: string,
  value: string
}

export interface TagConnection {
  items: Tag[],
  nextToken?: string
}