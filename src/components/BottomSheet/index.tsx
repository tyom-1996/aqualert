import React, { memo, useEffect, useRef } from "react";
import classNames from "classnames";
import SwipeableBottomSheet from '@sergeymyssak/swipeable-bottom-sheet';
import '@sergeymyssak/swipeable-bottom-sheet/lib/min.css';
import "./index.css";

interface BottomSheetProps {
  isOpen: boolean;
  disableSwipe?: boolean;
  onChange: (isOpen: boolean) => void;
  children: React.ReactNode;
  containerClassName?: string;
  bodyClassName?: string;
}

// Global counter to manage body scroll lock when multiple sheets are open
let __openBottomSheets = 0;

const BottomSheet: React.FC<BottomSheetProps> = ({
  isOpen,
  disableSwipe = false,
  onChange,
  children,
  containerClassName,
  bodyClassName
}) => {
  const wasOpenRef = useRef<boolean>(false);

  useEffect(() => {
    const lock = () => {
      try {
        document.body.style.setProperty('overflow', 'hidden', 'important');
        document.documentElement.style.setProperty('overflow', 'hidden', 'important');
        document.body.classList.add('modal-open');
        document.documentElement.classList.add('modal-open');
      } catch {}
    };
    const unlock = () => {
      try {
        document.body.style.removeProperty('overflow');
        document.documentElement.style.removeProperty('overflow');
        document.body.classList.remove('modal-open');
        document.documentElement.classList.remove('modal-open');
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
      } catch {}
    };

    if (isOpen && !wasOpenRef.current) {
      wasOpenRef.current = true;
      __openBottomSheets += 1;
      if (__openBottomSheets === 1) lock();
    } else if (!isOpen && wasOpenRef.current) {
      wasOpenRef.current = false;
      __openBottomSheets = Math.max(0, __openBottomSheets - 1);
      if (__openBottomSheets === 0) unlock();
    }

    return () => {
      if (wasOpenRef.current) {
        wasOpenRef.current = false;
        __openBottomSheets = Math.max(0, __openBottomSheets - 1);
        if (__openBottomSheets === 0) unlock();
      }
    };
  }, [isOpen]);

  return (
    <SwipeableBottomSheet
      isOpen={isOpen}
      onChange={onChange}
      swipeableViewsProps={{
        disabled: disableSwipe,
        animateTransitions: true,
        springConfig: {
          duration: '0.45s',
          easeFunction: 'cubic-bezier(0.25, 0.8, 0.25, 1)',
          delay: '0s'
        }
      }}
      containerClassName={classNames("custom-bottom-sheet", containerClassName)}
      bodyClassName={classNames("custom-bottom-sheet__body", bodyClassName)}
    >
      {children}
    </SwipeableBottomSheet>
  );
};

export default memo(BottomSheet); 