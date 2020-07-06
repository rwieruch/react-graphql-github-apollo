import gql from 'graphql-tag';

export default gql`
  fragment issueComment on IssueComment {
    id
    databaseId
    bodyHTML
    author {
      login
    }
  }
`;