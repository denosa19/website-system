import type {
  TimelineEvent,
  TimelineEventType,
} from "@/types/timeline";

type ProjectTimelineProps = {
  projectId: string;
  events: TimelineEvent[];
};

function formatTimelineDate(date: string) {
  return new Intl.DateTimeFormat("de-DE", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}

function getEventLabel(type: TimelineEventType) {
  switch (type) {
    case "project_created":
      return "Projekt";
    case "comment_added":
      return "Kommentar";
    case "project_updated":
      return "Aktualisierung";
    case "status_changed":
      return "Status";
    case "priority_changed":
      return "Priorität";
    case "owner_changed":
      return "Verantwortung";
    case "deadline_changed":
      return "Deadline";
    default:
      return "Ereignis";
  }
}

export default function ProjectTimeline({
  projectId,
  events,
}: ProjectTimelineProps) {
  const projectEvents = events
    .filter((event) => event.projectId === projectId)
    .sort(
      (firstEvent, secondEvent) =>
        new Date(secondEvent.createdAt).getTime() -
        new Date(firstEvent.createdAt).getTime()
    );

  return (
    <section className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.14em] text-neutral-500">
            Projektverlauf
          </p>

          <h2 className="mt-2 text-2xl font-bold text-white">
            Timeline
          </h2>
        </div>

        <span className="rounded-full border border-neutral-700 px-3 py-1 text-xs text-neutral-400">
          {projectEvents.length}{" "}
          {projectEvents.length === 1
            ? "Ereignis"
            : "Ereignisse"}
        </span>
      </div>

      <div className="mt-8">
        {projectEvents.length === 0 ? (
          <div className="rounded-xl border border-dashed border-neutral-700 bg-neutral-950 px-5 py-8 text-center">
            <p className="text-sm text-neutral-500">
              Für dieses Projekt gibt es noch keine
              Timeline-Einträge.
            </p>
          </div>
        ) : (
          <ol className="space-y-0">
            {projectEvents.map((event, index) => {
              const isLastEvent =
                index === projectEvents.length - 1;

              return (
                <li
                  key={event.id}
                  className="relative grid grid-cols-[28px_1fr] gap-4"
                >
                  <div className="relative flex justify-center">
                    <span className="relative z-10 mt-1.5 h-3 w-3 rounded-full border-2 border-neutral-400 bg-neutral-900" />

                    {!isLastEvent && (
                      <span className="absolute bottom-0 top-4 w-px bg-neutral-800" />
                    )}
                  </div>

                  <article
                    className={
                      isLastEvent
                        ? "pb-0"
                        : "pb-8"
                    }
                  >
                    <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-5">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <span className="inline-flex rounded-full border border-neutral-700 px-3 py-1 text-xs font-medium text-neutral-400">
                            {getEventLabel(event.type)}
                          </span>

                          <h3 className="mt-3 font-semibold text-white">
                            {event.title}
                          </h3>
                        </div>

                        <time
                          dateTime={event.createdAt}
                          className="shrink-0 text-xs text-neutral-500"
                        >
                          {formatTimelineDate(
                            event.createdAt
                          )}
                        </time>
                      </div>

                      {event.description && (
                        <p className="mt-3 leading-7 text-neutral-400">
                          {event.description}
                        </p>
                      )}

                      <p className="mt-4 text-xs text-neutral-600">
                        Ausgeführt von {event.author}
                      </p>
                    </div>
                  </article>
                </li>
              );
            })}
          </ol>
        )}
      </div>
    </section>
  );
}