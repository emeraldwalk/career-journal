import { groupBy, Dict } from "./common";

export interface CreateTagInput {
  icon?: string,
  parentId: string,
  value: string
}

export interface UpdateTagInput {
  icon?: String
  id: string,
  parentId: string,
  value: String
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

/**
 * Build a category object containing a category tag with
 * it's child tags.
 */
export function getCategory(
  allTags: Tag[],
  categoryId: string
) {
  const parent = allTags.find(
    tag => tag.id === categoryId
  ) || { id: '__ROOT__', value: 'Categories' };

  const tags = groupBy(
    allTags,
    'parentId'
  )[categoryId] || [];

  return {
    parent,
    tags: tags.reduce((memo, tag) => {
      return {
        ...memo,
        [tag.id]: tag
      };
    }, {} as Dict<Tag>)
  };
}