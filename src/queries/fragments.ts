import gql from 'graphql-tag';

export const ENTRY_FIELDS_FRAGMENT = gql`
  fragment EntryFields on Entry {
    content
    createdAt
    date
    id
    tags
    title
    updatedAt
  }
`;

export const TAG_FIELDS_FRAGMENT = gql`
  fragment TagFields on Tag {
    id
    icon
    parentId
    value
  }
`;