import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { PostTargetType } from '@amityco/js-sdk';

import withSDK from '~/core/hocs/withSDK';

import UserInfo from '~/social/components/UserInfo';
import FeedHeaderTabs from '~/social/components/FeedHeaderTabs';

import PageLayout from '~/social/layouts/Page';
import Feed from '~/social/components/Feed';
import ConditionalRender from '~/core/components/ConditionalRender';
import Followers from '~/social/pages/UserFeed/Followers';

import { tabs, UserFeedTabs } from './constants';
import { FollowersTabs } from '~/social/pages/UserFeed/Followers/constants';
import useNetworkSettings from '~/core/hooks/useNetworkSettings';
import useFollow from '~/core/hooks/useFollow';

const UserFeed = ({ userId, currentUserId }) => {
  const [activeTab, setActiveTab] = useState(UserFeedTabs.TIMELINE);
  const [followActiveTab, setFollowActiveTab] = useState(FollowersTabs.FOLLOWINGS);

  const { isPrivateNetwork } = useNetworkSettings();
  const { isFollowAccepted } = useFollow(currentUserId, userId);

  const isMe = userId === currentUserId;
  const isHiddenProfile = !isMe && isPrivateNetwork && !isFollowAccepted;

  const filteredTabs = isHiddenProfile
    ? tabs.filter(({ value }) => value === UserFeedTabs.TIMELINE)
    : tabs;

  return (
    // key prop is necessary here, without it this part will never re-render !!!
    <PageLayout
      aside={
        <UserInfo
          key={userId}
          userId={userId}
          setActiveTab={setActiveTab}
          setFollowActiveTab={setFollowActiveTab}
        />
      }
    >
      <FeedHeaderTabs tabs={filteredTabs} activeTab={activeTab} onChange={setActiveTab} />

      <ConditionalRender condition={activeTab === UserFeedTabs.TIMELINE}>
        <Feed
          targetType={isMe ? PostTargetType.MyFeed : PostTargetType.UserFeed}
          targetId={userId}
          showPostCreator={isMe}
          isHiddenProfile={isHiddenProfile}
        />
      </ConditionalRender>
      <ConditionalRender condition={activeTab === UserFeedTabs.FOLLOWERS}>
        <Followers userId={userId} activeTab={followActiveTab} setActiveTab={setFollowActiveTab} />
      </ConditionalRender>
    </PageLayout>
  );
};

UserFeed.propTypes = {
  userId: PropTypes.string.isRequired,
  currentUserId: PropTypes.string.isRequired,
};

export default withSDK(UserFeed);
