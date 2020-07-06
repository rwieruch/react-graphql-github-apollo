import React, { Component } from 'react';
import { Mutation } from 'react-apollo';

import { GET_COMMENTS_OF_ISSUE } from '../CommentList/queries';
import { ADD_COMMENT } from './mutations';

import TextArea from '../../TextArea';
import Button from '../../Button';
import ErrorMessage from '../../Error';

const updateComments = ({
  repositoryOwner,
  repositoryName,
  issue
},
client,
{
  data: {
    addComment: {
      commentEdge
    }
  }
}
) => {
  const data = client.readQuery({
    query: GET_COMMENTS_OF_ISSUE,
    variables: {
      repositoryOwner,
      repositoryName,
      number: issue.number
    }
  });

  client.writeQuery({
    query: GET_COMMENTS_OF_ISSUE,
    variables: {
      repositoryOwner,
      repositoryName,
      number: issue.number
    },
    data: {
      ...data,
      repository: {
        ...data.repository,
        issue: {
          ...data.repository.issue,
          comments: {
            ...data.repository.issue.comments,
            edges: [
              ...data.repository.issue.comments.edges,
              commentEdge
            ]
          }
        }
      }
    }
  })
};

class CommentAdd extends Component {
  state = {
    value: '',
  };

  onChange = value => {
    this.setState({ value });
  };

  onSubmit = (event, addComment) => {
    addComment().then(() => this.setState({ value: '' }));

    event.preventDefault();
  };

  render() {
    const { issue, repositoryOwner, repositoryName } = this.props;
    const { value } = this.state;

    return (
      <Mutation
        mutation={ADD_COMMENT}
        variables={{ body: value, subjectId: issue.id }}
        optimisticResponse={{
          addComment: {
            __typename: 'Mutation',
            commentEdge: {
              __typename: 'IssueCommentEdge',
              node: {
                __typename: 'IssueComment',
                id: new Date().getTime() + '',
                databaseId: new Date().getTime(),
                author: {
                  __typename: 'User',
                  login: 'me'
                },
                bodyHTML: value
              }
            }
          }
        }}
        update={(client, data) => updateComments({
          repositoryOwner,
          repositoryName,
          issue
        }, client, data)}
      >
        {(addComment, { data, loading, error }) => (
          <div>
            {error && <ErrorMessage error={error} />}

            <form onSubmit={e => this.onSubmit(e, addComment)}>
              <TextArea
                value={value}
                onChange={e => this.onChange(e.target.value)}
                placeholder="Leave a comment"
              />
              <Button type="submit">Comment</Button>
            </form>
          </div>
        )}
      </Mutation>
    );
  }
}

export default CommentAdd;
