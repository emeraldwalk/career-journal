import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { TagConnection } from '../model/tags';

export interface ListTagsVariables {
}

export interface ListTagsData {
  listTags: TagConnection
}

export class ListTagsQuery extends Query<ListTagsData, ListTagsVariables> {
}

const listTags = gql`
  query listTags {
    listTags {
      items {
        id
        icon
        parentId
        value
      }
    }
  }
`;

export default listTags;