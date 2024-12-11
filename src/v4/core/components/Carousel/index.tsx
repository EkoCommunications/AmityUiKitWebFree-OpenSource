import React, { PropsWithChildren, useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { ArrowLeft } from '~/v4/icons/ArrowLeft';
import ChevronRight from '~/v4/icons/ChevronRight';
import { Button } from '~/v4/core/natives/Button/Button';
import styles from './styles.module.css';

type CarouselProps = PropsWithChildren<{
  isHidden?: boolean;
  scrollOffset?: number;
  iconClassName?: string;
  leftArrowClassName?: string;
  rightArrowClassName?: string;
}>;

export const Carousel = ({
  children,
  isHidden,
  iconClassName,
  leftArrowClassName,
  scrollOffset = 250,
  rightArrowClassName,
}: CarouselProps) => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [isScrollable, setIsScrollable] = useState(false);
  const [isArrowLeftButtonShown, setIsArrowLeftButtonShown] = useState(false);
  const [isArrowRightButtonShown, setIsArrowRightButtonShown] = useState(true);

  const handleScroll = (scrollOffset: number) => {
    if (carouselRef.current)
      carouselRef.current.scrollBy({ left: scrollOffset, behavior: 'smooth' });
  };

  const scrollLeft = () => handleScroll(-scrollOffset);

  const scrollRight = () => handleScroll(scrollOffset);

  const checkScrollButtonsVisibility = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      setIsArrowLeftButtonShown(scrollLeft > 0); // Show left button if not at the start
      setIsArrowRightButtonShown(scrollLeft + clientWidth < scrollWidth); // Show right button if not at the end
    }
  };

  useEffect(() => {
    checkScrollButtonsVisibility();
    const carousel = carouselRef.current;
    if (carousel) {
      carousel.addEventListener('scroll', checkScrollButtonsVisibility);
      setIsScrollable(carouselRef.current.scrollWidth > carouselRef.current.clientWidth); // Check if carousel is scrollable
    }
    return () => {
      if (carousel) carousel.removeEventListener('scroll', checkScrollButtonsVisibility);
    };
  }, [carouselRef.current]);

  return (
    <section className={styles.carousel}>
      {isScrollable && !isHidden && (
        <Button
          onPress={scrollLeft}
          className={clsx(leftArrowClassName)}
          data-shown={isArrowLeftButtonShown}
          isDisabled={!isArrowLeftButtonShown}
        >
          <ArrowLeft className={clsx(iconClassName)} />
        </Button>
      )}
      {React.cloneElement(children as React.ReactElement, { ref: carouselRef })}
      {isScrollable && !isHidden && (
        <Button
          onPress={scrollRight}
          data-shown={isArrowRightButtonShown}
          isDisabled={!isArrowRightButtonShown}
          className={clsx(rightArrowClassName)}
        >
          <ChevronRight className={clsx(iconClassName)} />
        </Button>
      )}
    </section>
  );
};
