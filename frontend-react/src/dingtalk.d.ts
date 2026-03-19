declare global {
  interface Window {
    Dingdocs?: {
      base?: {
        host?: {
          saveConfigAndGoNext: (config: any) => Promise<void>;
          getAuthCode: (corpId: string) => Promise<string>;
        };
      };
    };
  }
}

export {};
