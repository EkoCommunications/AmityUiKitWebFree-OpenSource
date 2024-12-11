import clsx from 'clsx';
import { Typography } from '~/v4/core/components';
import React, { Fragment, useEffect } from 'react';
import ChevronRight from '~/v4/icons/ChevronRight';
import { Carousel } from '~/v4/core/components/Carousel';
import { Button } from '~/v4/core/natives/Button/Button';
import { useAmityComponent } from '~/v4/core/hooks/uikit';
import { useExplore } from '~/v4/social/providers/ExploreProvider';
import { useNavigation } from '~/v4/core/providers/NavigationProvider';
import { CategoryChip } from '~/v4/social/elements/CategoryChip/CategoryChip';
import { CategoryChipSkeleton } from '~/v4/social/elements/CategoryChip/CategoryChipSkeleton';
import styles from './ExploreCommunityCategories.module.css';

type ExploreCommunityCategoriesProps = {
  pageId?: string;
};

export const ExploreCommunityCategories = ({ pageId = '*' }: ExploreCommunityCategoriesProps) => {
  const componentId = 'explore_community_categories';
  const { accessibilityId, themeStyles } = useAmityComponent({
    pageId,
    componentId,
  });

  const { goToAllCategoriesPage, goToCommunitiesByCategoryPage } = useNavigation();

  const { categories, isCategoryLoading, fetchCommunityCategories } = useExplore();

  useEffect(() => {
    fetchCommunityCategories();
  }, []);

  return (
    <Carousel
      scrollOffset={300}
      isHidden={isCategoryLoading}
      iconClassName={styles.exploreCommunityCategories__arrowIcon}
      leftArrowClassName={clsx(styles.exploreCommunityCategories__arrow, styles.left)}
      rightArrowClassName={clsx(styles.exploreCommunityCategories__arrow, styles.right)}
    >
      <div
        style={themeStyles}
        data-qa-anchor={accessibilityId}
        className={styles.exploreCommunityCategories}
      >
        {isCategoryLoading ? (
          Array.from({ length: 6 }).map((_, index) => <CategoryChipSkeleton key={index} />)
        ) : (
          <Fragment>
            {categories.map((category) => (
              <div
                className={styles.exploreCommunityCategories__categoryChip}
                key={category.categoryId}
              >
                <CategoryChip
                  pageId={pageId}
                  category={category}
                  onClick={(categoryId) => goToCommunitiesByCategoryPage({ categoryId })}
                />
              </div>
            ))}
            {categories.length >= 5 ? (
              <Typography.BodyBold
                renderer={({ typoClassName }) => (
                  <Button
                    className={clsx(typoClassName, styles.exploreCommunityCategories__seeMore)}
                    onPress={() => goToAllCategoriesPage()}
                  >
                    <div>See more</div>
                    <ChevronRight className={styles.exploreCommunityCategories__seeMoreIcon} />
                  </Button>
                )}
              />
            ) : null}
          </Fragment>
        )}
      </div>
    </Carousel>
  );
};
