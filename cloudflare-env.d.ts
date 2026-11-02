declare namespace Cloudflare {
  interface Env {
    DB?: D1Database;
    BUCKET?: R2Bucket;
    ADMIN_PASSWORD_HASH?: string;
    ADMIN_USERNAME?: string;
    SESSION_SECRET?: string;
    WEB3FORMS_ACCESS_KEY?: string;
    GOOGLE_SITE_VERIFICATION?: string;
    VERCEL_ENV?: string;
    SUPABASE_URL?: string;
    SUPABASE_SERVICE_ROLE_KEY?: string;
    SUPABASE_STORAGE_BUCKET?: string;
  }
}
