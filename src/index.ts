export { default as AmityUiKitProvider } from '~/v4/core/providers/AmityUIKitProvider';
export { default as AmityUiKitFeed } from '~/social/components/Feed';
export { default as AmityUiKitSocial } from '~/social/pages/Application';
export { default as AmityUiKitChat } from '~/chat/pages/Application';

// Export helper
export {
  addChatMembers as amityAddChatMembers,
  removeChatMembers as amityRemoveChatMembers,
} from '~/chat/helpers';

export { default as useAmityUser } from '~/core/hooks/useUser';
export { useNavigation as useAmityNavigation } from '~/social/providers/NavigationProvider';

export { default as AmityAvatar } from '~/core/components/Avatar';
export { PostContainer as AmityPostContainer } from '~/social/components/post/Post/styles';
export { default as AmityPostEngagementBar } from '~/social/components/EngagementBar';
export { default as AmityExpandableText } from '~/social/components/Comment/CommentText';
export { useSDK as useAmitySDK } from '~/core/hooks/useSDK';

export { AmityUIKitManager } from '~/v4/core/AmityUIKitManager';

// v4 Export only components and pages related to Story feature

import type { ReactionListProps } from '~/v4/social/components/ReactionList';
export type { ReactionListProps as AmityReactionListProps };

// v4 Social
export {
  AmityDraftStoryPage,
  ViewStoryPage as AmityViewStoryPage,
  StoryTargetSelectionPage as AmityStoryTargetSelectionPage,
} from '~/v4/social/pages';

export {
  ReactionList as AmityReactionListComponent,
  CommentTray as AmityCommentTrayComponent,
  StoryTab as AmityStoryTabComponent,
} from '~/v4/social/components/';

export { HomePageTab as AmitySocialHomePageTab } from '~/v4/social/pages/SocialHomePage';
