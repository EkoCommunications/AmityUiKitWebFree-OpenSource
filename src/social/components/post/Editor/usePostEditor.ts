import { PostRepository } from '@amityco/ts-sdk';
import { useMemo, useState } from 'react';
import { parseMentionsMarkup, reconstructMentions } from '~/helpers/utils';
import usePost from '~/social/hooks/usePost';
import usePostByIds from '~/social/hooks/usePostByIds';
import useSocialMention from '~/social/hooks/useSocialMention';

export const usePostEditor = ({ post, onSave }: { post: Amity.Post; onSave: () => void }) => {
  const initialChildrenPosts = usePostByIds(post?.children);
  const { text, markup, mentions, mentionees, metadata, clearAll, onChange, queryMentionees } =
    useSocialMention({
      targetId: post?.targetId,
      targetType: post?.targetType,
      remoteText:
        typeof post?.data === 'string' ? post?.data : (post?.data as Amity.ContentDataText)?.text,
      remoteMarkup: parseMentionsMarkup(
        typeof post?.data === 'string' ? post?.data : (post?.data as Amity.ContentDataText)?.text,
        post?.metadata,
      ),
      remoteMentions: reconstructMentions(post?.metadata, post?.mentionees),
    });

  // List of the children posts removed - these will be deleted on save.
  const [localRemovedChildren, setLocalRemovedChildren] = useState<string[]>([]);

  const childrenPosts = useMemo(() => {
    return initialChildrenPosts.filter(
      (childPost) => !localRemovedChildren.includes(childPost.postId),
    );
  }, [initialChildrenPosts, localRemovedChildren]);

  const handleRemoveChild = (childPostId: string) => {
    setLocalRemovedChildren((prevRemovedChildren) => [...prevRemovedChildren, childPostId]);
  };

  const formattedAttachment = (post: Amity.Post) => {
    if (post.dataType === 'file' || post.dataType === 'image') {
      return {
        type: post.dataType,
        fileId: post.data.fileId,
      };
    }
    if (post.dataType === 'video') {
      return {
        type: post.dataType,
        fileId: post.data.videoFileId.original,
      };
    }
  };

  const handleSave = async () => {
    await PostRepository.updatePost(post.postId, {
      data: { text },
      mentionees,
      metadata,
      attachments: childrenPosts.map(formattedAttachment),
    });
    clearAll();
    onSave();
  };

  const isEmpty = text?.trim() === '' && !childrenPosts.length;

  const childFilePosts = useMemo(
    () => childrenPosts.filter((childPost) => childPost.dataType === 'file'),
    [childrenPosts],
  );

  const childImagePosts = useMemo(
    () => childrenPosts.filter((childPost) => childPost.dataType === 'image'),
    [childrenPosts],
  );

  const childVideoPosts = useMemo(
    () => childrenPosts.filter((childPost) => childPost.dataType === 'video'),
    [childrenPosts],
  );

  return {
    text,
    markup,
    mentions,
    post,
    childrenPosts,
    clearAll,
    onChange,
    queryMentionees,
    childVideoPosts,
    childFilePosts,
    childImagePosts,
    handleRemoveChild,
    isEmpty,
    handleSave,
  };
};
