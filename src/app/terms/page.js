import React from "react";

import {
  StaticPageCard,
  StaticPageShell,
} from "../components/StaticPage";

const usageTerms = [
  "Provide accurate account information and keep your credentials private.",
  "Do not misuse the service, interfere with its operation, or attempt unauthorized access.",
  "The service is provided as available and may change, experience interruptions, or be discontinued.",
  "Accounts or content that violate these terms may be removed.",
];

const contentGuidelines = [
  "Users are responsible for the content they upload.",
  "Copyrighted material should not be uploaded without permission.",
  "Inappropriate or illegal content is strictly prohibited.",
];

function NumberedList({ items }) {
  return (
    <ol className="list-decimal space-y-4 pl-5">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ol>
  );
}

export default function TermsPage() {
  return (
    <StaticPageShell title="Terms of Service">
      <div className="space-y-6 text-lg">
        <p>
          TrackFusionWeb is a portfolio music-sharing service. By creating an
          account or using the application, you agree to the following terms:
        </p>

        <StaticPageCard title="Usage Terms">
          <NumberedList items={usageTerms} />
        </StaticPageCard>

        <StaticPageCard title="Content Guidelines">
          <NumberedList items={contentGuidelines} />
        </StaticPageCard>
      </div>
    </StaticPageShell>
  );
}
