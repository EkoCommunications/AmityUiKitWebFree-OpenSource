import React, { useState } from 'react';

import { customizableComponent } from 'hocs/customization';
import { getCommunities, getCategories } from 'mock';
import Modal from 'components/Modal';
import { MenuItem } from 'components/Menu';

import Community from './Community';
import TrendingCommunity from './TrendingCommunity';
import ExploreHeader from './ExploreHeader';

import {
  Avatar,
  ExploreHomeContainer,
  Blocks,
  Block,
  BlockHeader,
  CommunityItems,
  Categories,
  Category,
  TrendingCommunities,
  ViewAllButton,
  RightIcon,
  CategoryModalBody,
} from './styles';

const ExploreHome = ({
  onSearchResultCommunityClick,
  onRecomendedCommunityClick,
  onTrendingCommunityClick,
  onCreateCommunityClick,
  onCategoryClick,
}) => {
  const communities = getCommunities();

  const categories = getCategories();

  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const openCategoryModal = () => setShowCategoryModal(true);
  const closeCategoryModal = () => setShowCategoryModal(false);

  const modal = showCategoryModal ? (
    <Modal title="Category" onCancel={closeCategoryModal}>
      <CategoryModalBody>
        {categories.map(category => (
          <MenuItem key={category.id} onClick={() => onCategoryClick(category.id)}>
            <Category>
              <Avatar key={category.id} avatar={category.avatar} /> {category.name}
            </Category>
          </MenuItem>
        ))}
      </CategoryModalBody>
    </Modal>
  ) : null;

  return (
    <ExploreHomeContainer>
      <ExploreHeader
        onSearchResultCommunityClick={onSearchResultCommunityClick}
        onCreateCommunityClick={onCreateCommunityClick}
      />
      <Blocks>
        <Block>
          <BlockHeader>Recommended for you</BlockHeader>
          <CommunityItems>
            {communities.slice(0, 5).map(community => (
              <Community
                key={community.communityId}
                onClick={() => onRecomendedCommunityClick(community)}
                community={community}
              />
            ))}
          </CommunityItems>
        </Block>

        <Block>
          <BlockHeader>Today&apos;s Trending</BlockHeader>
          <TrendingCommunities>
            {communities.slice(0, 6).map(community => (
              <TrendingCommunity
                key={community.communityId}
                onClick={() => onTrendingCommunityClick(community)}
                community={community}
              />
            ))}
          </TrendingCommunities>
        </Block>

        <Block>
          <BlockHeader>Categories</BlockHeader>
          <Categories>
            {categories.map(category => (
              <Category key={category.id} onClick={() => onCategoryClick(category.id)}>
                <Avatar avatar={category.avatar} /> {category.name}
              </Category>
            ))}
          </Categories>
          <ViewAllButton onClick={openCategoryModal}>
            View all
            <RightIcon />
          </ViewAllButton>
        </Block>
      </Blocks>
      {modal}
    </ExploreHomeContainer>
  );
};

export default customizableComponent('ExploreHome', ExploreHome);
