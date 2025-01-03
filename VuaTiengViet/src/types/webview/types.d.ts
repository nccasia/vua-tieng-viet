declare global {
  interface Window {
    Mezon: {
      WebView?: IMezonWebView;
    };
  }
}
export declare enum MezonAppEvent {
  ThemeChanged = 'theme_changed',
  ViewPortChanged = 'viewport_changed',
  SetCustomStyle = 'set_custom_style',
  ReloadIframe = 'reload_iframe',
}
export declare enum MezonWebViewEvent {
  IframeReady = 'iframe_ready',
  IframeWillReloaded = 'iframe_will_reload',
}
export type MezonEventHandler<T> = (
  eventType: MezonAppEvent,
  eventData?: T
) => void;
export type EventHandlers<T> = Record<string, MezonEventHandler<T>[]>;
export type InitParams = Record<string, string | null>;
export interface IMezonWebView {
  initParams: InitParams;
  isIframe: boolean;
  onEvent<T>(eventType: string, callback: MezonEventHandler<T>): void;
  offEvent<T>(eventType: MezonAppEvent, callback: MezonEventHandler<T>): void;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  postEvent<T>(eventType: string, eventData: T, callback: Function): void;
  receiveEvent<T>(event: string, eventData?: T): void;
}
