import gql from 'graphql-tag';

import ISSUECOMMENT_FRAGMENT from '../fragment';

export const GET_COMMENTS_OF_ISSUE = gql`
  query(
    $repositoryOwner: String!
    $repositoryName: String!
    $number: Int!
    $cursor: String
  ) {
    repository(name: $repositoryName, owner: $repositoryOwner) {
      issue(number: $number) {
        id
        comments(first: 1, after: $cursor) {
          edges {
            node {
              ...issueComment
            }
          }
          pageInfo {
            endCursor
            hasNextPage
          }
        }
      }
    }
  }
  ${ISSUECOMMENT_FRAGMENT}
`;
