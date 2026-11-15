import React from "react";
import { Mail } from "lucide-react";
import GithubIcon from "../components/Icons/GitHubIcon";
import LinkedinIcon from "../components/Icons/LinkedInIcon";

import {
  ContactItem,
  StaticPageButton,
  StaticPageCard,
  StaticPageShell,
} from "../components/StaticPage";

const contactLinks = [
  {
    icon: Mail,
    href: "mailto:christianvieux.dev@gmail.com",
    label: "christianvieux.dev@gmail.com",
  },
  {
    icon: LinkedinIcon,
    href: "https://linkedin.com/in/christian-vieux-dev",
    label: "linkedin.com/in/christian-vieux-dev",
    isExternal: true,
  },
  {
    icon: GithubIcon,
    href: "https://github.com/christianvieux",
    label: "github.com/christianvieux",
    isExternal: true,
  },
];

const projectSkills = [
  "Next.js",
  "React",
  "Tailwind CSS",
  "Responsive Design",
  "API Integration",
  "User Authentication",
];

export default function ContactPage() {
  return (
    <StaticPageShell title="Get in Touch">
      <div className="mb-8 min-w-0 space-y-4 text-base leading-relaxed sm:mb-12 sm:space-y-6 sm:text-lg">
        <p>
          Thank you for exploring TrackFusionWeb. As a full stack web developer,
          I&apos;m always interested in discussing new opportunities, receiving
          feedback on my projects, or engaging in technical discussions about
          web development.
        </p>

        <StaticPageCard
          title="Contact Information"
          titleClassName="text-2xl text-primary sm:text-3xl"
        >
          <div className="min-w-0 space-y-5 sm:space-y-6">
            {contactLinks.map((contact) => (
              <ContactItem key={contact.href} {...contact} />
            ))}
          </div>
        </StaticPageCard>

        <StaticPageCard title="About This Project">
          <p>
            TrackFusionWeb is part of my web development portfolio,
            demonstrating expertise in:
          </p>

          <div className="mt-4 grid min-w-0 grid-cols-1 gap-3 text-primary sm:grid-cols-2 sm:gap-4">
            {projectSkills.map((skill) => (
              <div key={skill} className="min-w-0 break-words">
                • {skill}
              </div>
            ))}
          </div>
        </StaticPageCard>
      </div>

      <StaticPageButton href="/home">Back to Home</StaticPageButton>
    </StaticPageShell>
  );
}
