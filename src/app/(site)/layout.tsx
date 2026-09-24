import { Footer } from "@/components/site/footer";
import { Header, type HeaderMenu } from "@/components/site/header";
import { ScrollToTop } from "@/components/site/scroll-to-top";
import { WhatsAppFloat } from "@/components/site/sections";
import { popularCourses, toLite, topCareers, topSkills } from "@/lib/catalog";
import { getCategories, getCourses, getSettings } from "@/lib/data";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [settings, categories, courses] = await Promise.all([getSettings(), getCategories(), getCourses()]);

  const menu: HeaderMenu = {
    categories: categories
      .filter((c) => courses.some((x) => x.category_id === c.id))
      .map((c) => ({ slug: c.slug, name: c.name, icon: c.icon })),
    careers: topCareers(courses, 9),
    skills: topSkills(courses, 10),
    courses: courses.map(toLite),
    favourites: popularCourses(courses).slice(0, 8).map(toLite),
  };

  return (
    <>
      {!isSupabaseConfigured && (
        <div className="bg-amber-400 px-4 py-1.5 text-center text-xs font-semibold text-amber-950">
          Supabase is not connected, so there is no content to show. Add your keys to .env.local (see supabase/README.md).
        </div>
      )}
      <Header menu={menu} phone={settings.phone} />
      {settings.announcement && (
        <div className="border-b border-line bg-tint">
          <p className="container-x py-2 text-center text-sm font-medium text-navy">
            <span className="mr-2 inline-block size-2 rounded-full bg-leaf align-middle" aria-hidden />
            {settings.announcement}
          </p>
        </div>
      )}
      <div className="pb-16 lg:pb-0">
        <main id="main">{children}</main>
        <Footer settings={settings} courses={courses} categories={menu.categories} />
      </div>
      <ScrollToTop />
      <WhatsAppFloat number={settings.whatsapp} />
    </>
  );
}
