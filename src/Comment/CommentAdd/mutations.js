import gql from 'graphql-tag';

import ISSUECOMMENT_FRAGMENT from '../fragment';

export const ADD_COMMENT = gql`
  mutation($subjectId: ID!, $body: String!) {
    addComment(input: { subjectId: $subjectId, body: $body }) {
      commentEdge {
        node {
          ...issueComment
        }
      }
    }
  }
  ${ISSUECOMMENT_FRAGMENT}
`;
