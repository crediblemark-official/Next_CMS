# Next CMS

A powerful Next.js application for building and managing content with CredBuild. This project features a robust dashboard for page management, SEO optimization, and dynamic content rendering.

## Features

- **Page Builder**: Visual editing with CredBuild.
- **Content Management**: Dashboard to manage pages, posts, products, and more.
- **SEO Optimized**: Built-in support for meta tags, Open Graph, Sitemap, and Robots.txt.
- **Authentication**: Secure access for dashboard and editing routes.
- **Database**: PostgreSQL with Prisma ORM for efficient data management.

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL Database
- Cloudflare R2 (for storage)

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/crediblemark-official/Next_CMS.git
    cd Next_CMS
    ```

2.  Install dependencies:
    ```bash
    bun install
    ```

3.  Configure Environment Variables:
    Create a `.env` file in the root directory and add the following:

    ```env
    DATABASE_URL="postgresql://user:password@host/db?sslmode=require"
    R2_ACCOUNT_ID="your-r2-account-id"
    R2_ACCESS_KEY_ID="your-r2-access-key"
    R2_SECRET_ACCESS_KEY="your-r2-secret-key"
    R2_BUCKET_NAME="your-bucket-name"
    R2_PUBLIC_DOMAIN="https://your-r2-domain.com"
    NEXTAUTH_SECRET="your-nextauth-secret"
    NEXTAUTH_URL="https://build.crediblemark.com"
    NEXT_PUBLIC_APP_URL="https://build.crediblemark.com"
    ```

    > **Important**: `NEXT_PUBLIC_APP_URL` is required for SEO features (Sitemap, Robots.txt, Open Graph) to work correctly.

4.  Run Database Migrations:
    ```bash
    npx prisma db push
    ```

5.  Start the Development Server:
    ```bash
    bun dev
    ```

    Navigate to [https://build.crediblemark.com](https://build.crediblemark.com).

## Default Accounts
| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@univedpress.com` | `admin` |
| **Editor** | `editor@univedpress.com` | `editor` |
| **User** | `user@univedpress.com` | `user` |

> **Note**: These accounts are created by running `bun scripts/seed-user.ts`.

## Usage

### Managing Pages
1.  Go to `https://build.crediblemark.com/dashboard/pages`.
2.  Click **Create New Page**.
3.  Enter the Title, URL Path, content, and **SEO metadata** (Description, Image URL).
4.  Click **Save**.

### Editing Content
- Use the Dashboard to manage site content.
- Use the CredBuild editor (if configured) for visual page building.

## SEO Configuration
The application automatically generates:
- **Sitemap**: `/sitemap.xml`
- **Robots.txt**: `/robots.txt`

Ensure `NEXT_PUBLIC_APP_URL` is set to your production domain (e.g., `https://build.crediblemark.com`) when deploying to ensure these files contain correct absolute URLs.
