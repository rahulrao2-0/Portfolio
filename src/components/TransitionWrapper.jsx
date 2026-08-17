import React, { useRef } from 'react';
import { Transition } from 'react-transition-group';
import { slidePage, PAGE_TRANSITION_MS } from '../utils/pageTransition';

const TransitionWrapper = ({ children, ...props }) => {
  const nodeRef = useRef(null);

  return (
    <Transition
      {...props}
      nodeRef={nodeRef}
      timeout={PAGE_TRANSITION_MS}
      onEnter={(isAppearing) => {
        slidePage(nodeRef.current, true);
        if (props.onEnter) props.onEnter(isAppearing);
      }}
      onExit={() => {
        slidePage(nodeRef.current, false);
        if (props.onExit) props.onExit();
      }}
    >
      <div
        ref={nodeRef}
        className="page-container"
        // The scroll navigation hook uses this to find the panel that owns the
        // viewport, so it can check that panel's scroll edges before paging.
        data-active={props.in ? 'true' : 'false'}
        aria-hidden={props.in ? undefined : 'true'}
      >
        {children}
      </div>
    </Transition>
  );
};

export default TransitionWrapper;
