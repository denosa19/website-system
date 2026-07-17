"use client";

import type { SeoData } from "../../../types/seo";

type Props = {
  seo: SeoData;
};

type SeoCheck = {
  id: string;
  title: string;
  description: string;
  passed: boolean;
  points: number;
};

function containsKeyword(value: string, keyword: string) {
  const normalizedValue = value.trim().toLowerCase();
  const normalizedKeyword = keyword.trim().toLowerCase();

  if (!normalizedKeyword) {
    return false;
  }

  return normalizedValue.includes(normalizedKeyword);
}

function getScoreLabel(score: number) {
  if (score >= 90) {
    return "Sehr gut";
  }

  if (score >= 70) {
    return "Gut";
  }

  if (score >= 50) {
    return "Ausbaufähig";
  }

  return "Unvollständig";
}

function getScoreClasses(score: number) {
  if (score >= 90) {
    return {
      text: "text-green-300",
      border: "border-green-900",
      background: "bg-green-950/40",
      progress: "bg-green-400",
    };
  }

  if (score >= 70) {
    return {
      text: "text-lime-300",
      border: "border-lime-900",
      background: "bg-lime-950/40",
      progress: "bg-lime-400",
    };
  }

  if (score >= 50) {
    return {
      text: "text-yellow-300",
      border: "border-yellow-900",
      background: "bg-yellow-950/40",
      progress: "bg-yellow-400",
    };
  }

  return {
    text: "text-red-300",
    border: "border-red-900",
    background: "bg-red-950/40",
    progress: "bg-red-400",
  };
}

export default function SeoScore({ seo }: Props) {
  const checks: SeoCheck[] = [
    {
      id: "main-keyword",
      title: "Hauptkeyword vorhanden",
      description: "Lege ein eindeutiges Hauptkeyword für die Seite fest.",
      passed: seo.mainKeyword.trim().length > 0,
      points: 15,
    },
    {
      id: "keyword-meta-title",
      title: "Hauptkeyword im Meta Title",
      description:
        "Das Hauptkeyword sollte im Seitentitel für Google enthalten sein.",
      passed: containsKeyword(seo.metaTitle, seo.mainKeyword),
      points: 15,
    },
    {
      id: "keyword-h1",
      title: "Hauptkeyword in der H1",
      description:
        "Die Hauptüberschrift sollte das Hauptkeyword sinnvoll enthalten.",
      passed: containsKeyword(seo.h1, seo.mainKeyword),
      points: 15,
    },
    {
      id: "meta-title-length",
      title: "Meta Title hat die richtige Länge",
      description: "Der Meta Title sollte zwischen 30 und 60 Zeichen haben.",
      passed:
        seo.metaTitle.trim().length >= 30 &&
        seo.metaTitle.trim().length <= 60,
      points: 15,
    },
    {
      id: "meta-description-length",
      title: "Meta Description hat die richtige Länge",
      description:
        "Die Meta Description sollte zwischen 120 und 160 Zeichen haben.",
      passed:
        seo.metaDescription.trim().length >= 120 &&
        seo.metaDescription.trim().length <= 160,
      points: 15,
    },
    {
      id: "secondary-keywords",
      title: "Nebenkeywords vorhanden",
      description:
        "Ergänze passende Nebenkeywords und thematisch verwandte Suchbegriffe.",
      passed: seo.secondaryKeywords.length > 0,
      points: 10,
    },
    {
      id: "robots",
      title: "Robots.txt eingerichtet",
      description:
        "Bestätige, dass die Robots-Datei eingerichtet und geprüft wurde.",
      passed: seo.robots,
      points: 7,
    },
    {
      id: "sitemap",
      title: "Sitemap eingerichtet",
      description:
        "Bestätige, dass die XML-Sitemap eingerichtet und geprüft wurde.",
      passed: seo.sitemap,
      points: 8,
    },
  ];

  const score = checks.reduce(
    (total, check) => total + (check.passed ? check.points : 0),
    0
  );

  const passedChecks = checks.filter((check) => check.passed).length;
  const scoreLabel = getScoreLabel(score);
  const scoreClasses = getScoreClasses(score);

  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div>
          <p className="text-sm text-neutral-500">
            Automatische Qualitätsprüfung
          </p>

          <h3 className="mt-1 text-xl font-bold">SEO-Score</h3>

          <p className="mt-2 text-sm text-neutral-400">
            Die Bewertung aktualisiert sich direkt während der Eingabe.
          </p>
        </div>

        <div
          className={`min-w-36 rounded-2xl border p-4 text-center ${scoreClasses.border} ${scoreClasses.background}`}
        >
          <p className={`text-4xl font-bold ${scoreClasses.text}`}>
            {score}
          </p>

          <p className="mt-1 text-xs text-neutral-500">von 100 Punkten</p>

          <p className={`mt-2 text-sm font-semibold ${scoreClasses.text}`}>
            {scoreLabel}
          </p>
        </div>
      </div>

      <div className="mt-6">
        <div className="flex items-center justify-between text-sm">
          <span className="text-neutral-400">Gesamtfortschritt</span>

          <span className="text-neutral-300">
            {passedChecks}/{checks.length} Prüfungen bestanden
          </span>
        </div>

        <div className="mt-3 h-3 overflow-hidden rounded-full bg-neutral-800">
          <div
            className={`h-full rounded-full transition-all duration-300 ${scoreClasses.progress}`}
            style={{ width: `${score}%` }}
          />
        </div>
      </div>

      <div className="mt-6 grid gap-3">
        {checks.map((check) => (
          <div
            key={check.id}
            className={`rounded-xl border p-4 ${
              check.passed
                ? "border-green-900 bg-green-950/20"
                : "border-neutral-800 bg-neutral-950"
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div
                  className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                    check.passed
                      ? "bg-green-500 text-black"
                      : "bg-neutral-800 text-neutral-400"
                  }`}
                >
                  {check.passed ? "✓" : "!"}
                </div>

                <div>
                  <p
                    className={
                      check.passed
                        ? "font-medium text-green-300"
                        : "font-medium text-neutral-200"
                    }
                  >
                    {check.title}
                  </p>

                  <p className="mt-1 text-sm text-neutral-500">
                    {check.description}
                  </p>
                </div>
              </div>

              <span
                className={
                  check.passed
                    ? "shrink-0 text-sm font-semibold text-green-300"
                    : "shrink-0 text-sm text-neutral-600"
                }
              >
                +{check.points}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}