import * as React from "react";

export const navigationRef: any = React.createRef();

export const isReadyRef: any = React.createRef();

export function navigate(name: string, params: any) {
  navigationRef.current?.navigate(name, params);
}

export function getCurrentRoute() {
  return navigationRef.current?.getCurrentRoute();
}
