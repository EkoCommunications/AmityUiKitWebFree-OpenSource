import React, { memo } from 'react';
import { FormattedMessage } from 'react-intl';

import Content from './Content';
import { PostEditorContainer, Footer, ContentContainer, PostButton } from './styles';
import { usePostEditor } from './usePostEditor';

interface PostEditorProps {
  post: Amity.Post;
  onSave: () => void;
  className?: string;
  placeholder?: string;
}

const PostEditor = ({
  post,
  placeholder = "What's going on...",
  className,
  onSave,
}: PostEditorProps) => {
  const {
    markup,
    onChange,
    queryMentionees,
    childVideoPosts,
    childFilePosts,
    childImagePosts,
    handleRemoveChild,
    isEmpty,
    handleSave,
  } = usePostEditor({
    post,
    onSave,
  });

  if (post == null) return null;

  return (
    <PostEditorContainer className={className}>
      <ContentContainer>
        <Content
          data-qa-anchor="post-editor-textarea"
          data={markup}
          dataType={'text'}
          placeholder={placeholder}
          queryMentionees={queryMentionees}
          onChangeText={onChange}
        />
        {childImagePosts.length > 0 && (
          <Content data={childImagePosts} dataType={'image'} onRemoveChild={handleRemoveChild} />
        )}
        {childVideoPosts.length > 0 && (
          <Content data={childVideoPosts} dataType={'video'} onRemoveChild={handleRemoveChild} />
        )}
        {childFilePosts.length > 0 && (
          <Content data={childFilePosts} dataType={'file'} onRemoveChild={handleRemoveChild} />
        )}
      </ContentContainer>
      <Footer>
        <PostButton
          data-qa-anchor="post-editor-save-button"
          disabled={isEmpty}
          onClick={handleSave}
        >
          <FormattedMessage id="save" />
        </PostButton>
      </Footer>
    </PostEditorContainer>
  );
};

export default memo(PostEditor);
