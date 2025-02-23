import React, { useMemo, useRef, useState } from 'react';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { COMMAND_PRIORITY_HIGH, Klass, LexicalNode } from 'lexical';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import {
  $createMentionNode,
  MentionNode,
} from '~/v4/social/internal-components/Lexical/nodes/MentionNode';
import { MentionPlugin } from '~/v4/social/internal-components/Lexical/plugins/MentionPlugin';
import { Mentioned, Mentionees } from '~/v4/helpers/utils';
import { LinkPlugin } from '~/v4/social/internal-components/Lexical/plugins/LinkPlugin';
import { AutoLinkPlugin } from '~/v4/social/internal-components/Lexical/plugins/AutoLinkPlugin';
import {
  editorToText,
  getEditorConfig,
  MentionData,
  textToEditorState,
} from '~/v4/social/internal-components/Lexical/utils';
import ReactDOM from 'react-dom';
import { useMemberQueryByDisplayName } from '~/v4/social/hooks/useMemberQueryByDisplayName';
import { useUserQueryByDisplayName } from '~/v4/core/hooks/collections/useUsersCollection';
import { AutoLinkNode, LinkNode } from '@lexical/link';
import useIntersectionObserver from '~/v4/core/hooks/useIntersectionObserver';
import useCommunity from '~/v4/core/hooks/collections/useCommunity';
import { MentionItem } from '~/v4/social/internal-components/Lexical/MentionItem';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import clsx from 'clsx';
import styles from './PostTextField.module.css';

interface PostTextFieldProps {
  pageId?: string;
  className?: string;
  componentId?: string;
  communityId?: string | null;
  attachmentAmount?: number;
  placeholderClassName?: string;
  mentionContainer?: HTMLElement | null;
  mentionContainerClassName?: string;
  placeholder?: string;
  isValidInput?: string | boolean;
  dataValue: {
    data: { text: string };
    metadata?: {
      mentioned?: Mentioned[];
    };
    mentionees?: Mentionees;
  };
  onChange: (data: { mentioned: Mentioned[]; mentionees: Mentionees; text: string }) => void;
}

const useSuggestions = (communityId?: string | null) => {
  const [queryString, setQueryString] = useState<string | null>(null);

  const { community, isLoading: isCommunityLoading } = useCommunity({ communityId });

  const isSearchCommunityMembers = useMemo(
    () => !!communityId && !isCommunityLoading && !community?.isPublic,
    [communityId, isCommunityLoading, community],
  );

  const {
    members,
    hasMore: hasMoreMember,
    isLoading: isLoadingMember,
    loadMore: loadMoreMember,
  } = useMemberQueryByDisplayName({
    communityId: communityId || '',
    displayName: queryString || '',
    limit: 10,
    enabled: isSearchCommunityMembers,
  });
  const {
    users,
    hasMore: hasMoreUser,
    loadMore: loadMoreUser,
    isLoading: isLoadingUser,
  } = useUserQueryByDisplayName({
    displayName: queryString || '',
    limit: 10,
    enabled: !isSearchCommunityMembers,
  });

  const onQueryChange = (newQuery: string | null) => {
    setQueryString(newQuery);
  };

  const suggestions = useMemo(() => {
    if (!!communityId && isCommunityLoading) return [];

    if (isSearchCommunityMembers) {
      return members.map(({ user, userId }) => ({
        userId: user?.userId || userId,
        displayName: user?.displayName,
      }));
    }

    return users.map(({ displayName, userId }) => ({
      userId: userId,
      displayName: displayName,
    }));
  }, [users, members, isSearchCommunityMembers, isCommunityLoading]);

  const hasMore = useMemo(() => {
    if (isSearchCommunityMembers) {
      return hasMoreMember;
    } else {
      return hasMoreUser;
    }
  }, [isSearchCommunityMembers, hasMoreMember, hasMoreUser]);

  const loadMore = () => {
    if (isLoading || !hasMore) return;
    if (isSearchCommunityMembers) {
      loadMoreMember();
    } else {
      loadMoreUser();
    }
  };

  const isLoading = useMemo(() => {
    if (isSearchCommunityMembers) {
      return isLoadingMember;
    } else {
      return isLoadingUser;
    }
  }, [isLoadingMember, isLoadingUser, isSearchCommunityMembers]);

  return { suggestions, queryString, onQueryChange, loadMore, hasMore, isLoading };
};

const nodes = [AutoLinkNode, LinkNode, MentionNode] as Array<Klass<LexicalNode>>;

export const PostTextField = ({
  onChange,
  dataValue,
  className,
  communityId,
  pageId = '*',
  mentionContainer,
  componentId = '*',
  placeholderClassName,
  mentionContainerClassName,
  placeholder,
  isValidInput: dataInputAttributes,
}: PostTextFieldProps) => {
  const elementId = 'post_text_field';
  const [intersectionNode, setIntersectionNode] = useState<HTMLElement | null>(null);

  const { accessibilityId } = useAmityElement({ pageId, componentId, elementId });

  const editorConfig = getEditorConfig({
    namespace: 'PostTextField',
    theme: {
      link: styles.editorLink,
      placeholder: styles.editorPlaceholder,
      paragraph: styles.editorParagraph,
    },
    nodes,
  });

  const { onQueryChange, suggestions, isLoading, loadMore } = useSuggestions(communityId);

  useIntersectionObserver({
    onIntersect: () => {
      loadMore();
    },
    node: intersectionNode,
    options: {
      threshold: 0.7,
    },
  });

  return (
    <LexicalComposer
      initialConfig={{
        ...editorConfig,
        ...(dataValue?.data.text
          ? { editorState: JSON.stringify(textToEditorState(dataValue)) }
          : {}),
      }}
    >
      <div
        data-input-validation={dataInputAttributes}
        className={clsx(styles.editorContainer, className)}
        data-qa-anchor={accessibilityId}
      >
        <RichTextPlugin
          contentEditable={<ContentEditable />}
          placeholder={
            <div className={clsx(styles.editorPlaceholder, placeholderClassName)}>
              {placeholder ?? "What's going on..."}
            </div>
          }
          ErrorBoundary={LexicalErrorBoundary}
        />
        <OnChangePlugin
          onChange={(_, editor) => {
            onChange(editorToText(editor));
          }}
        />
        <HistoryPlugin />
        <AutoFocusPlugin />
        <LinkPlugin />
        <AutoLinkPlugin />
        <MentionPlugin<MentionData, MentionNode<MentionData>>
          suggestions={suggestions}
          onQueryChange={onQueryChange}
          commandPriority={COMMAND_PRIORITY_HIGH}
          getSuggestionId={(suggestion) => suggestion.userId}
          $createNode={(data) =>
            $createMentionNode({
              text: `@${data?.displayName || ''}`,
              data,
            })
          }
          menuRenderFn={(
            menuRenderRef,
            { options, selectedIndex, setHighlightedIndex, selectOptionAndCleanUp },
          ) => {
            if (options.length === 0) return null;

            const optionList = options.map((option, i: number) => {
              return (
                <MentionItem
                  pageId={pageId}
                  componentId={componentId}
                  isSelected={selectedIndex === i}
                  onClick={() => {
                    setHighlightedIndex(i);
                    selectOptionAndCleanUp(option);
                  }}
                  onMouseEnter={() => {
                    setHighlightedIndex(i);
                  }}
                  key={option.key}
                  option={{
                    ...option,
                    setRefElement: (element) => {
                      if (i === options.length - 1) {
                        setIntersectionNode(element);
                      }
                      option.setRefElement(element);
                    },
                  }}
                />
              );
            });

            if (mentionContainer) return ReactDOM.createPortal(optionList, mentionContainer);

            return menuRenderRef?.current
              ? ReactDOM.createPortal(
                  <div className={mentionContainerClassName}>{optionList}</div>,
                  menuRenderRef.current,
                )
              : null;
          }}
        />
      </div>
    </LexicalComposer>
  );
};
