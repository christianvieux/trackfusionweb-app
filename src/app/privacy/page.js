import React from "react";

import {
  StaticPageCard,
  StaticPageShell,
} from "../components/StaticPage";

const collectedData = [
  "Account information, including username and email address.",
  "Profile images, uploaded audio, and the metadata supplied with that content.",
  "Favorites and the session data required to keep an account signed in.",
  "Limited technical logs used to operate and protect the service.",
];

const dataUsage = [
  "To create and authenticate accounts.",
  "To store, process, play, and share user-submitted content.",
  "To provide favorites, profiles, and other requested features.",
  "To troubleshoot failures, prevent abuse, and maintain service security.",
];

function BulletList({ items }) {
  return (
    <ul className="list-disc space-y-4 pl-5">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

export default function PrivacyPage() {
  return (
    <StaticPageShell title="Privacy Policy">
      <div className="space-y-6 text-lg">
        <p>
          TrackFusionWeb processes the information needed to operate its account,
          upload, playback, analysis, profile, and favorites features.
        </p>

        <StaticPageCard title="Data Collection">
          <div className="space-y-4">
            <p>The service may collect:</p>
            <BulletList items={collectedData} />
          </div>
        </StaticPageCard>

        <StaticPageCard title="Data Usage">
          <BulletList items={dataUsage} />
        </StaticPageCard>

        <StaticPageCard title="Service Providers">
          <p>
            TrackFusionWeb relies on hosting, storage, database, and email
            delivery providers to operate. Information is shared with those
            providers only as needed to deliver the service.
          </p>
        </StaticPageCard>

        <p className="mt-6 text-sm">
          Questions about personal information or account deletion can be sent
          through the Contact page.
        </p>
      </div>
    </StaticPageShell>
  );
}
