

interface ImportMetaEnv {
  readonly NG_APP_EMAILJS_SERVICE_ID: string;
  readonly NG_APP_EMAILJS_TEMPLATE_ID_NOTIFY: string;
  readonly NG_APP_EMAILJS_PUBLIC_KEY: string;
  readonly NG_APP_GOOGLE_CLIENT_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}   