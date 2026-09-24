import type { Metadata } from "next";
import { MentorCard } from "@/components/site/mentor-card";
import { CtaBand, PageHero } from "@/components/site/sections";
import { getMentors, getSettings } from "@/lib/data";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Mentors",
  description: "Meet the mentors at Leafclutch Academy who guide learners through AI, data, development and design programs.",
  alternates: { canonical: "/mentors" },
};

export default async function MentorsPage() {
  const [settings, mentors] = await Promise.all([getSettings(), getMentors()]);

  return (
    <>
      <PageHero
        eyebrow="Our mentors"
        title="Learn from people who build real products"
        description="Mentors guide you through live classes, code reviews, projects and career decisions, one learner at a time."
        breadcrumb={[{ href: "/mentors", label: "Mentors" }]}
      />
      <section className="container-x py-12 sm:py-16">
        {mentors.length ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {mentors.map((m) => (
              <MentorCard key={m.id} mentor={m} />
            ))}
          </div>
        ) : (
          <p className="text-center text-muted">Mentor profiles are coming soon.</p>
        )}
      </section>
      <CtaBand
        title="Want to mentor with us?"
        text="We are always looking for practitioners who love teaching. Get in touch with the team."
        whatsapp={settings.whatsapp}
      />
    </>
  );
}
