import gql from 'graphql-tag';

export default gql`
  fragment issueComment on IssueComment {
    id
    bodyHTML
    author {
      login
    }
  }
`;