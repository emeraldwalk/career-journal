import gql from 'graphql-tag';

export const TAG_FIELDS_FRAGMENT = gql`
  fragment TagFields on Tag {
    id
    icon
    parentId
    value
  }
`;