# Coordinator Job Posting Board

A modern, high-performance job listing platform built with **Next.js 16**, **Supabase**, and **Tailwind CSS**. This project features a public-facing job board for candidates and a secure, protected admin dashboard for managing listings.

## 🚀 Features

- **Public Job Board**: Clean, high-contrast UI for browsing jobs with search and pagination.
- **Admin Dashboard**: Secure management area at `/dashboard` for creating and deleting job listings.
- **Admin Authentication**: Email/Password based login protected by Next.js Middleware.
- **Real-time Updates**: Instant revalidation of listings when changes are made.
- **Modern UI/UX**: Built with Radix UI components, Lucide icons, and responsive layouts.
- **Resume Integration**: Ready-to-use application flow with resume extraction support.

## 🛠️ Tech Stack

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **Database**: [Supabase](https://supabase.com/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **State/Fetching**: [SWR](https://swr.vercel.app/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Components**: Radix UI & Shadcn UI

---

## 🏃 Local Setup

Follow these steps to get the project running on your machine:

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd Coordinator-job-posting
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env` file in the root directory and add the following variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Admin Credentials (Set these for dashboard access)
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your_secure_password
```


### 5. Run the development server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to see the result.

---

## 🔐 Admin Access

- **Login Route**: `/login`
- **Dashboard Route**: `/dashboard` (Protected)

Unauthorized attempts to access the dashboard will be redirected to the login page. Once logged in, the session is managed via a secure HTTP-only cookie.

---

## 📁 Project Structure

- `app/`: Next.js App Router (Pages & API routes)
- `components/`: Reusable UI components (JobCard, JobForm, JobTable, etc.)
- `hooks/`: Custom React hooks
- `lib/`: Configuration files (Supabase client)
- `middleware.ts`: Route protection and authentication logic

## 📝 Usage

1. **Main Page**: Candidates can view, search, and filter jobs.
2. **Login**: Admin signs in using the credentials defined in `.env`.
3. **Dashboard**: Admin fills out the "Add New Job" form. 
   - Note: **Pipline ID** should be the numeric ID from your internal recruitment pipeline.
4. **Management**: Admin can delete stale listings with a single click.

---

## 📄 License
This project is private and intended for use by Coordinators.pro.
