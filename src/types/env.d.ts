/// <reference types="vite/client" />

declare namespace NodeJS {
  interface ProcessEnv {
    readonly RELEASE: string;
  }
}
