import React, { useContext } from 'react';
import { PageTypes, useNavigation } from '~/v4/core/providers/NavigationProvider';
import { AmityPostCategory } from '~/v4/social/components/PostContent/PostContent';
import {
  AmityCommunitySetupPageMode,
  MemberCommunitySetup,
} from '~/v4/social/pages/CommunitySetupPage/CommunitySetupPage';
import { Mode } from '~/v4/social/pages/PostComposerPage/PostComposerPage';

export interface PageBehavior {
  AmityStoryViewPageBehavior?: {
    onCloseAction?(): void;
    hyperLinkAction?(context: Record<string, unknown>): void;
  };
  AmityDraftStoryPageBehavior?: {
    onCloseAction?(): void;
  };
  onClickHyperLink?(): void;
  AmitySocialHomePageBehavior?: Record<string, unknown>;
  AmityGlobalFeedComponentBehavior?: {
    goToPostDetailPage?: (context: { postId: string }) => void;
    goToViewStoryPage?: (context: {
      targetId: string;
      targetType: Amity.StoryTargetType;
      storyType: 'communityFeed' | 'globalFeed';
      targetIds?: string[];
    }) => void;
    goToCreateCommunityPage?(context: { mode: AmityCommunitySetupPageMode }): void;
  };
  AmityPostDetailPageBehavior?: Record<string, unknown>;
  AmityPostContentComponentBehavior?: {
    goToCommunityProfilePage?: (context: { communityId: string }) => void;
    goToUserProfilePage?: (context: { userId: string }) => void;
    goToPostComposerPage?: (context: { mode: Mode.EDIT; post: Amity.Post }) => void;
  };
  AmitySocialGlobalSearchPageBehavior?: Record<string, unknown>;
  AmityCommunitySearchResultComponentBehavior?: {
    goToCommunityProfilePage?: (context: { communityId: string }) => void;
  };
  AmityUserSearchResultComponentBehavior?: {
    goToUserProfilePage?: (context: { userId: string }) => void;
  };
  AmityCreatePostMenuComponentBehavior?: {
    goToSelectPostTargetPage?(): void;
    goToStoryTargetSelectionPage?(): void;
  };
  AmityPostTargetSelectionPage?: {
    goToPostComposerPage?: (context: {
      mode: Mode.CREATE;
      targetId: string | null;
      targetType: 'community' | 'user';
      community?: Amity.Community;
    }) => void;
  };
  AmityStoryTargetSelectionPage?: {
    goToStoryCreationPage?(context: {
      targetId: string | null;
      targetType: Amity.StoryTargetType;
      mediaType: { type: 'image'; url: string } | { type: 'video'; url: string };
      storyType: 'communityFeed' | 'globalFeed';
    }): void;
  };
  AmityPostComposerPageBehavior?: {
    goToSocialHomePage?(): void;
  };
  AmityCommunityProfilePageBehavior?: {
    goToPostComposerPage?(context: {
      mode: Mode.CREATE | Mode.EDIT;
      targetId: string | null;
      targetType: 'community' | 'user';
      community?: Amity.Community;
      post?: Amity.Post;
    }): void;
    goToPostDetailPage?(context: {
      postId: string;
      hideTarget?: boolean;
      category?: AmityPostCategory;
    }): void;
    goToStoryCreationPage?(context: {
      targetId: string | null;
      targetType: Amity.StoryTargetType;
      mediaType: { type: 'image'; url: string } | { type: 'video'; url: string };
      storyType: 'communityFeed' | 'globalFeed';
    }): void;
    goToCommunitySettingPage?(context: { community: Amity.Community }): void;
    goToEditCommunityPage?(context: {
      mode: AmityCommunitySetupPageMode;
      community: Amity.Community;
    }): void;
    goToPendingPostPage?(context: { communityId: string }): void;
    goToMembershipPage?(context: { community: Amity.Community }): void;
  };
  AmitySocialHomeTopNavigationComponentBehavior?: {
    goToCreateCommunityPage?(context: { mode: AmityCommunitySetupPageMode }): void;
  };
  AmityCommunitySetupPageBehavior?: {
    goToAddCategoryPage?(context: { categories?: Amity.Category[] }): void;
    goToAddMemberPage?(context: {
      members?: MemberCommunitySetup[];
      communityId?: string;
      onAddedAction?: (userId: string[]) => void;
    }): void;
  };
  AmityCommunitySettingPageBehavior?: {
    goToEditCommunityPage?(context: {
      mode: AmityCommunitySetupPageMode;
      community: Amity.Community;
    }): void;
    goToMembershipPage?(context: { community: Amity.Community }): void;
    goToPostPermissionPage?(context: { community: Amity.Community }): void;
    goToStorySettingPage?(context: { community: Amity.Community }): void;
    goToSocialHomePage?(): void;
  };
  AmityCommunityMembershipPage?: {
    goToAddMemberPage?(context: {
      members?: MemberCommunitySetup[];
      communityId?: string;
      onAddedAction?: (userId: string[]) => void;
    }): void;
    goToUserProfilePage?: (context: { userId: string }) => void;
  };
}

const PageBehaviorContext = React.createContext<PageBehavior | undefined>(undefined);

interface PageBehaviorProviderProps {
  children: React.ReactNode;
  pageBehavior?: Partial<PageBehavior>;
}

export const PageBehaviorProvider: React.FC<PageBehaviorProviderProps> = ({
  children,
  pageBehavior = {},
}) => {
  const {
    page,
    onBack,
    goToPostDetailPage,
    goToCommunityProfilePage,
    goToUserProfilePage,
    goToViewStoryPage,
    onChangePage,
    goToSelectPostTargetPage,
    goToStoryTargetSelectionPage,
    goToStoryCreationPage,
    goToPostComposerPage,
    goToSocialHomePage,
    goToAddCategoryPage,
    goToAddMemberPage,
    goToCommunitySettingPage,
    goToEditCommunityPage,
    goToMembershipPage,
    goToPostPermissionPage,
    goToStorySettingPage,
    goToPendingPostPage,
  } = useNavigation();
  const navigationBehavior: PageBehavior = {
    AmityStoryViewPageBehavior: {
      onCloseAction: () => {
        if (pageBehavior?.AmityStoryViewPageBehavior?.onCloseAction) {
          return pageBehavior.AmityStoryViewPageBehavior.onCloseAction();
        }
        onChangePage(PageTypes.SocialHomePage);
      },
      hyperLinkAction: (context: Record<string, unknown>) => {
        if (pageBehavior?.AmityStoryViewPageBehavior?.hyperLinkAction) {
          return pageBehavior.AmityStoryViewPageBehavior.hyperLinkAction(context);
        }
      },
    },
    AmityDraftStoryPageBehavior: {
      onCloseAction: () => {
        if (pageBehavior?.AmityDraftStoryPageBehavior?.onCloseAction) {
          return pageBehavior.AmityDraftStoryPageBehavior.onCloseAction();
        }
        if (page.type === PageTypes.DraftPage && page.context.storyType === 'communityFeed') {
          goToCommunityProfilePage(page.context.targetId);
        } else {
          goToSocialHomePage();
        }
      },
    },
    onClickHyperLink: () => {},
    AmitySocialHomePageBehavior: {},
    AmityGlobalFeedComponentBehavior: {
      goToPostDetailPage: (context: { postId: string }) => {
        if (pageBehavior?.AmityGlobalFeedComponentBehavior?.goToPostDetailPage) {
          return pageBehavior?.AmityGlobalFeedComponentBehavior.goToPostDetailPage(context);
        }
        goToPostDetailPage(context.postId);
      },
      goToViewStoryPage: (context: {
        targetId: string;
        targetType: Amity.StoryTargetType;
        storyType: 'communityFeed' | 'globalFeed';
      }) => {
        if (pageBehavior?.AmityGlobalFeedComponentBehavior?.goToViewStoryPage) {
          return pageBehavior?.AmityGlobalFeedComponentBehavior.goToViewStoryPage(context);
        }
        goToViewStoryPage({
          targetId: context.targetId,
          targetType: context.targetType,
          storyType: context.storyType,
        });
      },
    },
    AmityPostDetailPageBehavior: {},
    AmityPostContentComponentBehavior: {
      goToCommunityProfilePage: (context: { communityId: string }) => {
        if (pageBehavior?.AmityPostContentComponentBehavior?.goToCommunityProfilePage) {
          return pageBehavior.AmityPostContentComponentBehavior.goToCommunityProfilePage(context);
        }
        goToCommunityProfilePage(context.communityId);
      },
      goToUserProfilePage: (context: { userId: string }) => {
        if (pageBehavior?.AmityPostContentComponentBehavior?.goToUserProfilePage) {
          return pageBehavior.AmityPostContentComponentBehavior.goToUserProfilePage(context);
        }
        goToUserProfilePage(context.userId);
      },
      goToPostComposerPage: (context: { mode: Mode.EDIT; post: Amity.Post }) => {
        if (pageBehavior?.AmityPostContentComponentBehavior?.goToPostComposerPage) {
          return pageBehavior.AmityPostContentComponentBehavior.goToPostComposerPage(context);
        }
        goToPostComposerPage(context);
      },
    },

    AmitySocialGlobalSearchPageBehavior: {},
    AmityCommunitySearchResultComponentBehavior: {
      goToCommunityProfilePage: (context: { communityId: string }) => {
        if (pageBehavior?.AmityCommunitySearchResultComponentBehavior?.goToCommunityProfilePage) {
          return pageBehavior.AmityCommunitySearchResultComponentBehavior.goToCommunityProfilePage(
            context,
          );
        }
        goToCommunityProfilePage(context.communityId);
      },
    },
    AmityUserSearchResultComponentBehavior: {
      goToUserProfilePage: (context: { userId: string }) => {
        if (pageBehavior?.AmityUserSearchResultComponentBehavior?.goToUserProfilePage) {
          return pageBehavior.AmityUserSearchResultComponentBehavior.goToUserProfilePage(context);
        }
        goToUserProfilePage(context.userId);
      },
    },
    AmityCreatePostMenuComponentBehavior: {
      goToSelectPostTargetPage() {
        if (pageBehavior?.AmityCreatePostMenuComponentBehavior?.goToSelectPostTargetPage) {
          return pageBehavior.AmityCreatePostMenuComponentBehavior.goToSelectPostTargetPage();
        }
        goToSelectPostTargetPage();
      },
      goToStoryTargetSelectionPage() {
        if (pageBehavior?.AmityCreatePostMenuComponentBehavior?.goToStoryTargetSelectionPage) {
          return pageBehavior.AmityCreatePostMenuComponentBehavior.goToStoryTargetSelectionPage();
        }
        goToStoryTargetSelectionPage();
      },
    },
    AmityPostTargetSelectionPage: {
      goToPostComposerPage: (context: {
        mode: Mode.CREATE;
        targetId: string | null;
        targetType: 'community' | 'user';
        community?: Amity.Community;
      }) => {
        if (pageBehavior?.AmityPostTargetSelectionPage?.goToPostComposerPage) {
          return pageBehavior.AmityPostTargetSelectionPage.goToPostComposerPage(context);
        }
        goToPostComposerPage(context);
      },
    },
    AmityStoryTargetSelectionPage: {
      goToStoryCreationPage: (context: {
        targetId: string;
        targetType: Amity.StoryTargetType;
        mediaType: { type: 'image'; url: string } | { type: 'video'; url: string };
        storyType: 'communityFeed' | 'globalFeed';
      }) => {
        if (pageBehavior?.AmityStoryTargetSelectionPage?.goToStoryCreationPage) {
          return pageBehavior.AmityStoryTargetSelectionPage.goToStoryCreationPage(context);
        }
        goToStoryCreationPage(context);
      },
    },
    AmityPostComposerPageBehavior: {
      goToSocialHomePage() {
        if (pageBehavior?.AmityPostComposerPageBehavior?.goToSocialHomePage) {
          return pageBehavior.AmityPostComposerPageBehavior.goToSocialHomePage();
        }
        goToSocialHomePage();
      },
    },
    AmityCommunityProfilePageBehavior: {
      goToPostComposerPage(context: {
        mode: Mode.CREATE;
        targetId: string | null;
        targetType: 'community' | 'user';
        community?: Amity.Community;
        post?: Amity.Post;
      }) {
        if (pageBehavior?.AmityCommunityProfilePageBehavior?.goToPostComposerPage) {
          return pageBehavior.AmityCommunityProfilePageBehavior.goToPostComposerPage(context);
        }
        goToPostComposerPage(context);
      },
      goToPostDetailPage(context: {
        postId: string;
        hideTarget?: boolean;
        category?: AmityPostCategory;
      }) {
        if (pageBehavior?.AmityCommunityProfilePageBehavior?.goToPostDetailPage) {
          return pageBehavior.AmityCommunityProfilePageBehavior.goToPostDetailPage(context);
        }
        goToPostDetailPage(context.postId, context.hideTarget, context.category);
      },
      goToCommunitySettingPage(context: { community: Amity.Community }) {
        if (pageBehavior?.AmityCommunityProfilePageBehavior?.goToCommunitySettingPage) {
          return pageBehavior.AmityCommunityProfilePageBehavior.goToCommunitySettingPage(context);
        }
        goToCommunitySettingPage?.(context.community);
      },
      goToPendingPostPage(context: { communityId: string }) {
        if (pageBehavior?.AmityCommunityProfilePageBehavior?.goToPendingPostPage) {
          return pageBehavior.AmityCommunityProfilePageBehavior.goToPendingPostPage(context);
        }
        goToPendingPostPage?.(context.communityId);
      },
      goToMembershipPage(context: { community: Amity.Community }) {
        if (pageBehavior?.AmityCommunityProfilePageBehavior?.goToMembershipPage) {
          return pageBehavior.AmityCommunityProfilePageBehavior.goToMembershipPage(context);
        }
        goToMembershipPage?.(context.community);
      },
      goToStoryCreationPage: (context: {
        targetId: string;
        targetType: Amity.StoryTargetType;
        mediaType: { type: 'image'; url: string } | { type: 'video'; url: string };
        storyType: 'communityFeed' | 'globalFeed';
      }) => {
        if (pageBehavior?.AmityStoryTargetSelectionPage?.goToStoryCreationPage) {
          return pageBehavior.AmityStoryTargetSelectionPage.goToStoryCreationPage(context);
        }
        goToStoryCreationPage(context);
      },
    },
    AmityCommunitySetupPageBehavior: {
      goToAddCategoryPage(context: { categories?: Amity.Category[] }) {
        if (pageBehavior?.AmityCommunitySetupPageBehavior?.goToAddCategoryPage) {
          return pageBehavior.AmityCommunitySetupPageBehavior.goToAddCategoryPage(context);
        }
        goToAddCategoryPage?.(context);
      },
      goToAddMemberPage(context: {
        members?: MemberCommunitySetup[];
        communityId?: string;
        onAddedAction?: (userId: string[]) => void;
      }) {
        if (pageBehavior?.AmityCommunitySetupPageBehavior?.goToAddMemberPage) {
          return pageBehavior.AmityCommunitySetupPageBehavior.goToAddMemberPage(context);
        }
        goToAddMemberPage?.(context);
      },
    },
    AmityCommunitySettingPageBehavior: {
      goToEditCommunityPage(context: {
        mode: AmityCommunitySetupPageMode;
        community: Amity.Community;
      }) {
        if (pageBehavior?.AmityCommunitySettingPageBehavior?.goToEditCommunityPage) {
          return pageBehavior.AmityCommunitySettingPageBehavior.goToEditCommunityPage(context);
        }
        goToEditCommunityPage?.({
          mode: context.mode,
          community: context.community,
        });
      },
      goToMembershipPage(context: { community: Amity.Community }) {
        if (pageBehavior?.AmityCommunitySettingPageBehavior?.goToMembershipPage) {
          return pageBehavior.AmityCommunitySettingPageBehavior.goToMembershipPage(context);
        }
        goToMembershipPage?.(context.community);
      },
      goToPostPermissionPage(context: { community: Amity.Community }) {
        if (pageBehavior?.AmityCommunitySettingPageBehavior?.goToPostPermissionPage) {
          return pageBehavior.AmityCommunitySettingPageBehavior.goToPostPermissionPage(context);
        }
        goToPostPermissionPage?.(context.community);
      },
      goToStorySettingPage(context: { community: Amity.Community }) {
        if (pageBehavior?.AmityCommunitySettingPageBehavior?.goToStorySettingPage) {
          return pageBehavior.AmityCommunitySettingPageBehavior.goToStorySettingPage(context);
        }
        goToStorySettingPage?.(context.community);
      },
      goToSocialHomePage() {
        if (pageBehavior?.AmityCommunitySettingPageBehavior?.goToSocialHomePage) {
          return pageBehavior.AmityCommunitySettingPageBehavior.goToSocialHomePage();
        }
        goToSocialHomePage();
      },
    },
    AmityCommunityMembershipPage: {
      goToAddMemberPage(context: {
        members?: MemberCommunitySetup[];
        communityId?: string;
        onAddedAction?: (userId: string[]) => void;
      }) {
        if (pageBehavior?.AmityCommunityMembershipPage?.goToAddMemberPage) {
          return pageBehavior.AmityCommunityMembershipPage.goToAddMemberPage(context);
        }
        goToAddMemberPage?.(context);
      },
      goToUserProfilePage: (context: { userId: string }) => {
        if (pageBehavior?.AmityCommunityMembershipPage?.goToUserProfilePage) {
          return pageBehavior.AmityCommunityMembershipPage.goToUserProfilePage(context);
        }
        goToUserProfilePage(context.userId);
      },
    },
  };

  return (
    <PageBehaviorContext.Provider value={navigationBehavior}>
      {children}
    </PageBehaviorContext.Provider>
  );
};

export const usePageBehavior = () => {
  const pageBehavior = useContext(PageBehaviorContext);
  if (!pageBehavior) {
    throw new Error('usePageBehavior must be used within a PageBehaviorProvider');
  }
  return pageBehavior;
};
