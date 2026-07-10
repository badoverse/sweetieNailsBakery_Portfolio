declare interface Env {
  readonly NODE_ENV: string;
  readonly NG_APP_EMAILJS_SERVICE_ID: string;
  readonly NG_APP_EMAILJS_TEMPLATE_ID_NOTIFY: string;
  readonly NG_APP_EMAILJS_PUBLIC_KEY: string;
  readonly NG_APP_GOOGLE_CLIENT_ID: string;
  [key: string]: any;
}

declare interface ImportMeta {
  readonly env: Env;
}   