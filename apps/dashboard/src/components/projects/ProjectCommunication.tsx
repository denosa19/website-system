import { comments } from "@/data/comments";
import { timeline } from "@/data/timeline";
import ProjectComments from "./ProjectComments";
import ProjectTimeline from "./ProjectTimeline";

type ProjectCommunicationProps = {
  projectId: string;
};

export default function ProjectCommunication({
  projectId,
}: ProjectCommunicationProps) {
  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <ProjectComments
        projectId={projectId}
        initialComments={comments}
      />

      <ProjectTimeline
        projectId={projectId}
        events={timeline}
      />
    </div>
  );
}