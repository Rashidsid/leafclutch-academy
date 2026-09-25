/**
 * Admin panel resource definitions.
 *
 * Each managed table is described once here: which columns the list shows,
 * which fields the editor renders and how values are saved. Adding a field to
 * the admin is usually a one-line change in this file plus a column in SQL.
 */
import { ICON_OPTIONS } from "@/lib/icons";

export type FieldType =
  | "text"
  | "slug"
  | "textarea"
  | "number"
  | "select"
  | "switch"
  | "date"
  | "image"
  | "color"
  | "icon"
  | "list"
  | "modes"
  | "curriculum"
  | "faqs"
  | "installments"
  | "stats"
  | "udemy"
  | "pricing"
  | "relation";

export interface Option {
  value: string;
  label: string;
}

export type OptionSource = "categories" | "courses" | "mentors" | "programs";

export interface Field {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  help?: string;
  placeholder?: string;
  options?: Option[];
  optionsFrom?: OptionSource;
  /** Span the full width of the form grid */
  wide?: boolean;
  rows?: number;
  /** For slug fields: the field the slug is generated from */
  from?: string;
  /** Storage folder for image uploads */
  folder?: string;
}

export interface Group {
  title: string;
  description?: string;
  fields: Field[];
}

export interface Column {
  name: string;
  label: string;
  kind?: "text" | "money" | "bool" | "date" | "badge" | "image" | "mode";
}

export interface Relation {
  /** Virtual field name holding the selected ids */
  field: string;
  table: string;
  ownKey: string;
  otherKey: string;
}

export interface ContentResource {
  kind: "content";
  key: string;
  table: string;
  label: string;
  singular: string;
  description: string;
  icon: string;
  select: string;
  order: { column: string; ascending?: boolean }[];
  titleField: string;
  searchFields: string[];
  columns: Column[];
  groups: Group[];
  relation?: Relation;
  /** Public page for a row, used for "View on site" */
  publicPath?: (row: Record<string, unknown>) => string | null;
}

export interface InboxResource {
  kind: "inbox";
  key: string;
  table: string;
  label: string;
  singular: string;
  description: string;
  icon: string;
  select: string;
  titleField: string;
  subtitleFields: string[];
  searchFields: string[];
  statuses: Option[];
  details: { name: string; label: string; kind?: "mode" | "date" | "email" | "phone" }[];
}

export type Resource = ContentResource | InboxResource;

const MODE_OPTIONS: Option[] = [
  { value: "online", label: "Online" },
  { value: "hybrid", label: "Hybrid" },
  { value: "physical", label: "Physical" },
];

const publishing = (extra: Field[] = []): Group => ({
  title: "Visibility",
  fields: [
    { name: "is_published", label: "Published", type: "switch", help: "Unpublished items are hidden from the website." },
    ...extra,
    { name: "sort_order", label: "Sort order", type: "number", help: "Lower numbers appear first." },
  ],
});

/* ------------------------------------------------------------------ */

const courses: ContentResource = {
  kind: "content",
  key: "courses",
  table: "courses",
  label: "Courses",
  singular: "Course",
  description: "Programs, fees, curriculum, tools, FAQs and mentors.",
  icon: "book-open",
  select: "*, category:categories(name), course_mentors(mentor_id)",
  order: [{ column: "sort_order" }, { column: "title" }],
  titleField: "title",
  searchFields: ["title", "subtitle"],
  columns: [
    { name: "thumbnail_url", label: "", kind: "image" },
    { name: "title", label: "Course" },
    { name: "category.name", label: "Category", kind: "badge" },
    { name: "fee", label: "From", kind: "money" },
    { name: "is_featured", label: "Featured", kind: "bool" },
    { name: "is_published", label: "Published", kind: "bool" },
  ],
  relation: { field: "mentor_ids", table: "course_mentors", ownKey: "course_id", otherKey: "mentor_id" },
  publicPath: (row) => (row.slug ? `/courses/${row.slug}` : null),
  groups: [
    {
      title: "Basics",
      fields: [
        { name: "title", label: "Course title", type: "text", required: true, wide: true },
        { name: "slug", label: "URL slug", type: "slug", from: "title", help: "Used in the address: /courses/slug. Leave blank to generate." },
        { name: "category_id", label: "Category", type: "select", optionsFrom: "categories" },
        { name: "subtitle", label: "Short description", type: "textarea", rows: 2, wide: true, help: "One or two sentences shown on course cards." },
        { name: "level", label: "Level", type: "text", placeholder: "Beginner to Intermediate" },
        { name: "duration", label: "Duration", type: "text", required: true, placeholder: "3 Months" },
        { name: "badge", label: "Badge", type: "text", placeholder: "New, Popular…", help: "Optional label on the course card." },
        { name: "is_ai_integrated", label: "AI Integrated", type: "switch" },
      ],
    },
    {
      title: "Artwork",
      description: "Upload a thumbnail, or leave it empty to use the generated cover from the icon and colour.",
      fields: [
        { name: "thumbnail_url", label: "Thumbnail image", type: "image", folder: "courses", wide: true },
        { name: "icon", label: "Cover icon", type: "icon" },
        { name: "accent", label: "Cover colour", type: "color" },
      ],
    },
    {
      title: "Pricing & learning modes",
      description: "Tick the modes this course is offered in and set a price and optional discount for each. Learners get the same content in every mode. Requires supabase/15mode-pricing.sql.",
      fields: [
        { name: "pricing", label: "Price by learning mode", type: "pricing", wide: true },
        { name: "installments", label: "Payment plan (percent of the chosen mode’s price)", type: "installments", wide: true },
      ],
    },
    {
      title: "Course content",
      fields: [
        { name: "description", label: "Course overview", type: "textarea", rows: 8, wide: true, help: "Leave a blank line between paragraphs." },
        { name: "outcomes", label: "What you will learn", type: "list", wide: true },
        { name: "tools", label: "Tools covered", type: "list", wide: true },
        { name: "includes", label: "This course includes", type: "list", wide: true, help: "e.g. Recorded video of every session" },
        { name: "prerequisites", label: "Who can join / prerequisites", type: "list", wide: true },
        { name: "careers", label: "Career opportunities", type: "list", wide: true },
      ],
    },
    { title: "Curriculum", fields: [{ name: "curriculum", label: "Modules", type: "curriculum", wide: true }] },
    {
      title: "Free Udemy courses (lifetime access)",
      description: "Udemy courses learners can choose for free when they enroll. Shown under “What you get” with an Explore button. Requires supabase/14udemy-courses.sql.",
      fields: [{ name: "udemy_courses", label: "Udemy courses", type: "udemy", wide: true }],
    },
    { title: "Course FAQs", fields: [{ name: "faqs", label: "Questions", type: "faqs", wide: true }] },
    { title: "Mentors", fields: [{ name: "mentor_ids", label: "Mentors teaching this course", type: "relation", optionsFrom: "mentors", wide: true }] },
    {
      title: "Search engines (SEO)",
      fields: [
        { name: "seo_title", label: "SEO title", type: "text", wide: true, help: "Optional. Defaults to “<Course> Training in Nepal”." },
        { name: "seo_description", label: "SEO description", type: "textarea", rows: 2, wide: true },
      ],
    },
    publishing([{ name: "is_featured", label: "Featured", type: "switch", help: "Highlight on the home page." }]),
  ],
};

const categories: ContentResource = {
  kind: "content",
  key: "categories",
  table: "categories",
  label: "Categories",
  singular: "Category",
  description: "Groups used for course filters and the menu.",
  icon: "tags",
  select: "*",
  order: [{ column: "sort_order" }, { column: "name" }],
  titleField: "name",
  searchFields: ["name"],
  columns: [
    { name: "name", label: "Name" },
    { name: "slug", label: "Slug", kind: "badge" },
    { name: "sort_order", label: "Order" },
  ],
  groups: [
    {
      title: "Category",
      fields: [
        { name: "name", label: "Name", type: "text", required: true },
        { name: "slug", label: "Slug", type: "slug", from: "name" },
        { name: "description", label: "Description", type: "textarea", rows: 2, wide: true },
        { name: "icon", label: "Icon", type: "icon" },
        { name: "sort_order", label: "Sort order", type: "number" },
      ],
    },
  ],
};

const mentors: ContentResource = {
  kind: "content",
  key: "mentors",
  table: "mentors",
  label: "Mentors",
  singular: "Mentor",
  description: "Tutor profiles and the courses they teach.",
  icon: "graduation-cap",
  select: "*, course_mentors(course_id)",
  order: [{ column: "sort_order" }, { column: "name" }],
  titleField: "name",
  searchFields: ["name", "role"],
  columns: [
    { name: "photo_url", label: "", kind: "image" },
    { name: "name", label: "Name" },
    { name: "role", label: "Role", kind: "badge" },
    { name: "is_published", label: "Published", kind: "bool" },
  ],
  relation: { field: "course_ids", table: "course_mentors", ownKey: "mentor_id", otherKey: "course_id" },
  groups: [
    {
      title: "Profile",
      fields: [
        { name: "name", label: "Full name", type: "text", required: true },
        { name: "slug", label: "Slug", type: "slug", from: "name" },
        { name: "role", label: "Role / title", type: "text", required: true, placeholder: "Mentor" },
        { name: "linkedin_url", label: "LinkedIn URL", type: "text", placeholder: "https://linkedin.com/in/…" },
        { name: "photo_url", label: "Photo", type: "image", folder: "mentors", wide: true, help: "Portrait photos work best." },
        { name: "bio", label: "Bio", type: "textarea", rows: 4, wide: true },
        { name: "expertise", label: "Expertise", type: "list", wide: true },
      ],
    },
    { title: "Courses", fields: [{ name: "course_ids", label: "Courses this mentor teaches", type: "relation", optionsFrom: "courses", wide: true }] },
    publishing(),
  ],
};

const batches: ContentResource = {
  kind: "content",
  key: "batches",
  table: "batches",
  label: "Batches",
  singular: "Batch",
  description: "Upcoming class schedules shown on course pages and Upcoming Courses.",
  icon: "calendar-days",
  select: "*, course:courses(title)",
  order: [{ column: "start_date", ascending: false }],
  titleField: "course.title",
  searchFields: ["title", "schedule"],
  columns: [
    { name: "course.title", label: "Course" },
    { name: "start_date", label: "Starts", kind: "date" },
    { name: "mode", label: "Mode", kind: "mode" },
    { name: "status", label: "Status", kind: "badge" },
    { name: "is_published", label: "Published", kind: "bool" },
  ],
  groups: [
    {
      title: "Batch",
      fields: [
        { name: "course_id", label: "Course", type: "select", optionsFrom: "courses", required: true },
        { name: "title", label: "Batch name", type: "text", help: "Optional, e.g. “Weekend batch”. Defaults to the course title." },
        { name: "start_date", label: "Start date", type: "date", required: true },
        { name: "mode", label: "Mode", type: "select", options: MODE_OPTIONS, required: true },
        { name: "schedule", label: "Days & time", type: "text", placeholder: "Sun – Thu, 7:00 – 8:30 AM" },
        { name: "seats", label: "Seats", type: "number" },
        {
          name: "status",
          label: "Status",
          type: "select",
          required: true,
          options: [
            { value: "open", label: "Seats open" },
            { value: "filling", label: "Filling fast" },
            { value: "full", label: "Full" },
            { value: "closed", label: "Closed (hidden)" },
          ],
        },
        { name: "is_published", label: "Published", type: "switch" },
      ],
    },
  ],
};

const testimonials: ContentResource = {
  kind: "content",
  key: "testimonials",
  table: "testimonials",
  label: "Testimonials",
  singular: "Testimonial",
  description: "Learner reviews for the scrolling testimonial carousel.",
  icon: "quote",
  select: "*, course:courses(title)",
  order: [{ column: "sort_order" }, { column: "created_at", ascending: false }],
  titleField: "name",
  searchFields: ["name", "quote", "organization"],
  columns: [
    { name: "image_url", label: "", kind: "image" },
    { name: "name", label: "Name" },
    { name: "course.title", label: "Course", kind: "badge" },
    { name: "rating", label: "Rating" },
    { name: "is_published", label: "Published", kind: "bool" },
  ],
  groups: [
    {
      title: "Review",
      fields: [
        { name: "name", label: "Learner name", type: "text", required: true },
        { name: "course_id", label: "Course", type: "select", optionsFrom: "courses" },
        { name: "role", label: "Role", type: "text", placeholder: "Data Analyst" },
        { name: "organization", label: "Organisation / college", type: "text", placeholder: "Company or college" },
        { name: "quote", label: "Testimonial", type: "textarea", rows: 4, required: true, wide: true },
        {
          name: "rating",
          label: "Rating",
          type: "select",
          required: true,
          options: [5, 4, 3, 2, 1].map((n) => ({ value: String(n), label: `${n} star${n > 1 ? "s" : ""}` })),
        },
      ],
    },
    {
      title: "Photos",
      description: "The large photo appears at the top of the card (e.g. learner at work or at graduation).",
      fields: [
        { name: "image_url", label: "Card photo (landscape)", type: "image", folder: "testimonials" },
        { name: "avatar_url", label: "Profile photo (optional)", type: "image", folder: "testimonials" },
      ],
    },
    publishing(),
  ],
};

const programs: ContentResource = {
  kind: "content",
  key: "programs",
  table: "programs",
  label: "Corporate programs",
  singular: "Program",
  description: "Programs for companies, schools, colleges and institutes.",
  icon: "briefcase",
  select: "*",
  order: [{ column: "sort_order" }],
  titleField: "title",
  searchFields: ["title", "summary"],
  columns: [
    { name: "title", label: "Program" },
    { name: "audience", label: "Audience", kind: "badge" },
    { name: "duration", label: "Duration" },
    { name: "is_published", label: "Published", kind: "bool" },
  ],
  groups: [
    {
      title: "Program",
      fields: [
        { name: "title", label: "Title", type: "text", required: true },
        { name: "slug", label: "Slug", type: "slug", from: "title" },
        {
          name: "audience",
          label: "Audience",
          type: "select",
          required: true,
          options: [
            { value: "corporate", label: "Companies" },
            { value: "school", label: "Schools" },
            { value: "college", label: "Colleges" },
            { value: "institution", label: "Institutes" },
          ],
        },
        { name: "duration", label: "Duration", type: "text", placeholder: "1 – 4 weeks" },
        { name: "icon", label: "Icon", type: "icon" },
        { name: "summary", label: "Summary", type: "textarea", rows: 3, wide: true },
        { name: "highlights", label: "Highlights", type: "list", wide: true },
      ],
    },
    publishing(),
  ],
};

const faqs: ContentResource = {
  kind: "content",
  key: "faqs",
  table: "faqs",
  label: "FAQs",
  singular: "FAQ",
  description: "General questions on the home and contact pages. Course FAQs live inside each course.",
  icon: "circle-help",
  select: "*",
  order: [{ column: "sort_order" }],
  titleField: "question",
  searchFields: ["question", "answer"],
  columns: [
    { name: "question", label: "Question" },
    { name: "topic", label: "Topic", kind: "badge" },
    { name: "is_published", label: "Published", kind: "bool" },
  ],
  groups: [
    {
      title: "FAQ",
      fields: [
        { name: "question", label: "Question", type: "text", required: true, wide: true },
        { name: "answer", label: "Answer", type: "textarea", rows: 4, required: true, wide: true },
        {
          name: "topic",
          label: "Topic",
          type: "select",
          required: true,
          options: [
            { value: "general", label: "General" },
            { value: "fees", label: "Fees & payment" },
            { value: "learning", label: "Learning" },
            { value: "career", label: "Career & certificate" },
          ],
        },
      ],
    },
    publishing(),
  ],
};

const partners: ContentResource = {
  kind: "content",
  key: "partners",
  table: "partners",
  label: "Partners",
  singular: "Partner",
  description: "Hiring and institutional partner logos on the home page.",
  icon: "handshake",
  select: "*",
  order: [{ column: "sort_order" }, { column: "name" }],
  titleField: "name",
  searchFields: ["name"],
  columns: [
    { name: "logo_url", label: "", kind: "image" },
    { name: "name", label: "Name" },
    { name: "is_published", label: "Published", kind: "bool" },
  ],
  groups: [
    {
      title: "Partner",
      fields: [
        { name: "name", label: "Name", type: "text", required: true },
        { name: "website_url", label: "Website", type: "text", placeholder: "https://…" },
        { name: "logo_url", label: "Logo", type: "image", folder: "partners", wide: true },
      ],
    },
    publishing(),
  ],
};

const certificates: ContentResource = {
  kind: "content",
  key: "certificates",
  table: "certificates",
  label: "Certificates",
  singular: "Certificate",
  description: "Issued certificates that anyone can verify by code on /verify.",
  icon: "award",
  select: "*",
  order: [{ column: "issued_on", ascending: false }],
  titleField: "student_name",
  searchFields: ["code", "student_name", "course_title"],
  columns: [
    { name: "code", label: "Code", kind: "badge" },
    { name: "student_name", label: "Student" },
    { name: "course_title", label: "Course" },
    { name: "issued_on", label: "Issued", kind: "date" },
    { name: "status", label: "Status", kind: "badge" },
  ],
  groups: [
    {
      title: "Certificate",
      fields: [
        { name: "code", label: "Certificate code", type: "text", required: true, placeholder: "LCA-2026-0001", help: "Printed on the certificate. Must be unique." },
        { name: "student_name", label: "Student name", type: "text", required: true },
        { name: "course_id", label: "Course", type: "select", optionsFrom: "courses" },
        { name: "course_title", label: "Course title (as printed)", type: "text", help: "Leave blank to use the selected course's title." },
        { name: "mode", label: "Learning mode", type: "select", options: MODE_OPTIONS },
        { name: "issued_on", label: "Issued on", type: "date", required: true },
        {
          name: "status",
          label: "Status",
          type: "select",
          required: true,
          options: [
            { value: "valid", label: "Valid" },
            { value: "revoked", label: "Revoked" },
          ],
        },
        { name: "remarks", label: "Internal remarks", type: "textarea", rows: 2, wide: true },
      ],
    },
  ],
};

/* ------------------------------------------------------------------ */

const enrollments: InboxResource = {
  kind: "inbox",
  key: "enrollments",
  table: "enrollments",
  label: "Enrollments",
  singular: "Enrollment",
  description: "Enrollment requests from the website.",
  icon: "user-plus",
  select: "*, batch:batches(start_date, schedule)",
  titleField: "full_name",
  subtitleFields: ["course_title", "mode"],
  searchFields: ["full_name", "email", "phone", "course_title"],
  statuses: [
    { value: "new", label: "New" },
    { value: "contacted", label: "Contacted" },
    { value: "enrolled", label: "Enrolled" },
    { value: "cancelled", label: "Cancelled" },
  ],
  details: [
    { name: "course_title", label: "Course" },
    { name: "mode", label: "Mode", kind: "mode" },
    { name: "batch.start_date", label: "Preferred batch", kind: "date" },
    { name: "phone", label: "Phone", kind: "phone" },
    { name: "email", label: "Email", kind: "email" },
    { name: "udemy_course", label: "Free Udemy course" },
    { name: "education", label: "Education / job" },
    { name: "message", label: "Message" },
  ],
};

const corporateInquiries: InboxResource = {
  kind: "inbox",
  key: "corporate-inquiries",
  table: "corporate_inquiries",
  label: "Corporate inquiries",
  singular: "Inquiry",
  description: "Proposal requests from companies, schools, colleges and institutes.",
  icon: "building-2",
  select: "*",
  titleField: "organization",
  subtitleFields: ["org_type", "program_title"],
  searchFields: ["organization", "contact_name", "email", "phone"],
  statuses: [
    { value: "new", label: "New" },
    { value: "contacted", label: "Contacted" },
    { value: "proposal_sent", label: "Proposal sent" },
    { value: "won", label: "Won" },
    { value: "closed", label: "Closed" },
  ],
  details: [
    { name: "contact_name", label: "Contact person" },
    { name: "phone", label: "Phone", kind: "phone" },
    { name: "email", label: "Email", kind: "email" },
    { name: "program_title", label: "Program" },
    { name: "participants", label: "Participants" },
    { name: "preferred_dates", label: "Preferred dates" },
    { name: "message", label: "Message" },
  ],
};

const messages: InboxResource = {
  kind: "inbox",
  key: "messages",
  table: "contact_messages",
  label: "Messages",
  singular: "Message",
  description: "Messages from the contact form.",
  icon: "mail",
  select: "*",
  titleField: "name",
  subtitleFields: ["subject"],
  searchFields: ["name", "email", "subject", "message"],
  statuses: [
    { value: "new", label: "New" },
    { value: "read", label: "Read" },
    { value: "replied", label: "Replied" },
    { value: "closed", label: "Closed" },
  ],
  details: [
    { name: "email", label: "Email", kind: "email" },
    { name: "phone", label: "Phone", kind: "phone" },
    { name: "subject", label: "Subject" },
    { name: "message", label: "Message" },
  ],
};

/* ------------------------------------------------------------------ */

export const settingsGroups: Group[] = [
  {
    title: "General",
    fields: [
      { name: "site_name", label: "Site name", type: "text", required: true },
      { name: "tagline", label: "Tagline", type: "text" },
      { name: "announcement", label: "Announcement bar", type: "text", wide: true, help: "Shown above the header on every page. Leave blank to hide." },
    ],
  },
  {
    title: "Home page hero",
    fields: [
      { name: "hero_eyebrow", label: "Small label", type: "text", wide: true },
      { name: "hero_title", label: "Headline", type: "text" },
      { name: "hero_highlight", label: "Highlighted words", type: "text", help: "Shown in gradient after the headline." },
      { name: "hero_subtitle", label: "Subheading", type: "textarea", rows: 3, wide: true },
    ],
  },
  {
    title: "Home page stats",
    fields: [{ name: "stats", label: "Stats", type: "stats", wide: true }],
  },
  {
    title: "Contact details",
    fields: [
      { name: "phone", label: "Phone", type: "text" },
      { name: "whatsapp", label: "WhatsApp number", type: "text", help: "With country code, digits only, e.g. 9779766715768" },
      { name: "email", label: "Email", type: "text" },
      { name: "office_hours", label: "Office hours", type: "text" },
      { name: "address", label: "Address", type: "text", wide: true },
      { name: "map_embed_url", label: "Google Maps embed URL", type: "text", wide: true, help: "Google Maps → Share → Embed a map → copy the src URL." },
    ],
  },
  {
    title: "Certificate",
    description: "Shown on every course page. Leave empty to use the built-in Leafclutch certificate design.",
    fields: [
      { name: "certificate_image_url", label: "Certificate sample image", type: "image", folder: "certificates", wide: true, help: "Landscape image of your certificate (JPG or PNG). Requires supabase/13certificate-and-detailed-curriculum.sql." },
    ],
  },
  {
    title: "Social links",
    fields: [
      { name: "facebook_url", label: "Facebook", type: "text" },
      { name: "instagram_url", label: "Instagram", type: "text" },
      { name: "linkedin_url", label: "LinkedIn", type: "text" },
      { name: "tiktok_url", label: "TikTok", type: "text" },
      { name: "youtube_url", label: "YouTube", type: "text" },
      { name: "discord_url", label: "Discord", type: "text" },
    ],
  },
];

export const RESOURCES: Resource[] = [
  courses,
  categories,
  batches,
  mentors,
  testimonials,
  faqs,
  programs,
  partners,
  certificates,
  enrollments,
  corporateInquiries,
  messages,
];

export const NAV_GROUPS: { title: string; keys: string[] }[] = [
  { title: "Catalogue", keys: ["courses", "categories", "batches", "mentors"] },
  { title: "Content", keys: ["testimonials", "faqs", "programs", "partners"] },
  { title: "Inbox", keys: ["enrollments", "corporate-inquiries", "messages"] },
  { title: "Records", keys: ["certificates"] },
];

export function getResource(key: string) {
  return RESOURCES.find((r) => r.key === key);
}

export function getContentResource(key: string) {
  const r = getResource(key);
  return r?.kind === "content" ? r : undefined;
}

export { ICON_OPTIONS };

/** Read "a.b" style paths from joined rows. */
export function readPath(row: Record<string, unknown>, path: string): unknown {
  return path.split(".").reduce<unknown>((acc, key) => (acc && typeof acc === "object" ? (acc as Record<string, unknown>)[key] : undefined), row);
}
