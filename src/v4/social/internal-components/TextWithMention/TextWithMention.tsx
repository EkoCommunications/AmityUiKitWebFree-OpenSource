import { SerializedLexicalNode, SerializedParagraphNode } from 'lexical';
import React, { useMemo, useState } from 'react';
import { Mentioned, Mentionees } from '~/v4/helpers/utils';
import styles from './TextWithMention.module.css';
import {
  textToEditorState,
  $isSerializedMentionNode,
  $isSerializedAutoLinkNode,
  $isSerializedTextNode,
  MentionData,
  $isSerializedLinkNode,
} from '~/v4/social/internal-components/Lexical/utils';
import clsx from 'clsx';
import { useNavigation } from '~/v4/core/providers/NavigationProvider';
import { Button } from '~/v4/core/natives/Button/Button';
import { Typography } from '~/v4/core/components';
import Truncate from 'react-truncate-markup';
interface TextWithMentionProps {
  pageId?: string;
  componentId?: string;
  maxLines?: number;
  data: {
    text: string;
  };
  mentionees: Mentionees;
  metadata?: {
    mentioned?: Mentioned[];
  };
}

export const TextWithMention = ({
  pageId = '*',
  componentId = '*',
  maxLines = 8,
  data,
  mentionees,
  metadata,
}: TextWithMentionProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const { goToUserProfilePage } = useNavigation();

  const editorState = useMemo(
    () =>
      textToEditorState({
        data,
        mentionees,
        metadata,
      }),
    [data, mentionees, metadata],
  );

  const convertSerializedToText = (child: SerializedLexicalNode) => {
    if ($isSerializedMentionNode<MentionData>(child)) {
      return (
        <span
          data-qa-anchor={`${pageId}/${componentId}/mention`}
          key={child.data.userId}
          className={clsx(styles.textWithMention__mention)}
          onClick={() => goToUserProfilePage(child.data.userId)}
          tabIndex={0}
        >
          {child.text}
        </span>
      );
    }
    if ($isSerializedAutoLinkNode(child) || $isSerializedLinkNode(child)) {
      return (
        <a
          key={child.url}
          href={child.url}
          className={clsx(styles.textWithMention__link)}
          data-qa-anchor={`${pageId}/${componentId}/post_link`}
          target="_blank"
        >
          {$isSerializedTextNode(child.children[0]) ? child.children[0]?.text : child.url}
        </a>
      );
    }

    if ($isSerializedTextNode(child)) {
      return <React.Fragment>{child.text}</React.Fragment>;
    }

    return null;
  };

  const renderText = (paragraph: SerializedParagraphNode[]) => {
    return paragraph.map((p, index) => (
      <React.Fragment key={index}>
        {p.children.map((child, childIndex) => convertSerializedToText(child))}
        <br />
      </React.Fragment>
    ));
  };

  return (
    <Typography.Body
      renderer={({ typoClassName }) => (
        <div className={clsx(styles.textWithMention__container, typoClassName)}>
          {isExpanded ? (
            renderText(editorState.root.children)
          ) : (
            <Truncate
              lines={maxLines}
              ellipsis={
                <>
                  ...
                  <Button
                    className={styles.textWithMention__seeMore}
                    onPress={() => setIsExpanded(true)}
                  >
                    See more
                  </Button>
                </>
              }
            >
              <div>{renderText(editorState.root.children)}</div>
            </Truncate>
          )}
        </div>
      )}
    />
  );
};
