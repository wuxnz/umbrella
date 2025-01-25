import * as React from 'react';

// RootNavigation is used to navigate between screens
// It's a singleton so it can be used globally in the app
// The refs are used to check if the navigation is ready

export const navigationRef: any = React.createRef();

export const isReadyRef: any = React.createRef();

export function navigate(name: string, params: any) {
  navigationRef.current?.navigate(name, params);
}

export function getCurrentRoute() {
  return navigationRef.current?.getCurrentRoute();
}
