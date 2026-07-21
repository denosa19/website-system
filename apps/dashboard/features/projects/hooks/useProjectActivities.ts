"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import type {
  ProjectActivity,
  ProjectActivityAction,
} from "../../../types/activity";

type CreateProjectActivityData = {
  user?: string;
  projectId: string;
  projectTitle: string;
  action: ProjectActivityAction;
  title: string;
  description: string;
};

type ActivityGroup = {
  key: string;
  activityId: string;
  updatedAt: number;
};

const ACTIVITIES_STORAGE_KEY =
  "internet-firma-project-activities";

const MAX_ACTIVITY_ENTRIES = 100;
const ACTIVITY_GROUP_TIMEOUT = 1000;

function isRecord(
  value: unknown
): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isProjectActivityAction(
  value: unknown
): value is ProjectActivityAction {
  return (
    value === "project_created" ||
    value === "project_deleted" ||
    value === "status_changed" ||
    value === "priority_changed" ||
    value === "progress_changed" ||
    value === "task_changed" ||
    value === "seo_changed"
  );
}

function migrateActivity(
  value: unknown
): ProjectActivity | null {
  if (!isRecord(value)) {
    return null;
  }

  if (
    typeof value.id !== "string" ||
    typeof value.timestamp !== "string" ||
    typeof value.user !== "string" ||
    typeof value.projectId !== "string" ||
    typeof value.projectTitle !== "string" ||
    !isProjectActivityAction(value.action) ||
    typeof value.title !== "string" ||
    typeof value.description !== "string"
  ) {
    return null;
  }

  return {
    id: value.id,
    timestamp: value.timestamp,
    user: value.user,
    projectId: value.projectId,
    projectTitle: value.projectTitle,
    action: value.action,
    title: value.title,
    description: value.description,
  };
}

function loadStoredActivities(): ProjectActivity[] {
  try {
    const storedValue = window.localStorage.getItem(
      ACTIVITIES_STORAGE_KEY
    );

    if (!storedValue) {
      return [];
    }

    const parsedValue: unknown = JSON.parse(storedValue);

    if (!Array.isArray(parsedValue)) {
      return [];
    }

    return parsedValue
      .map(migrateActivity)
      .filter(
        (activity): activity is ProjectActivity =>
          activity !== null
      )
      .slice(0, MAX_ACTIVITY_ENTRIES);
  } catch (error) {
    console.error(
      "Projektaktivitäten konnten nicht geladen werden:",
      error
    );

    return [];
  }
}

function createActivityId() {
  return `activity_${Date.now()}_${Math.random()
    .toString(36)
    .slice(2, 9)}`;
}

export function useProjectActivities() {
  const [activities, setActivities] = useState<
    ProjectActivity[]
  >([]);
  const [storageLoaded, setStorageLoaded] =
    useState(false);

  const activitiesRef = useRef<ProjectActivity[]>([]);
  const activityGroupRef = useRef<ActivityGroup | null>(
    null
  );

  const replaceActivities = useCallback(
    (nextActivities: ProjectActivity[]) => {
      activitiesRef.current = nextActivities;
      setActivities(nextActivities);
    },
    []
  );

  useEffect(() => {
    const storedActivities = loadStoredActivities();

    activitiesRef.current = storedActivities;
    activityGroupRef.current = null;

    setActivities(storedActivities);
    setStorageLoaded(true);
  }, []);

  useEffect(() => {
    if (!storageLoaded) {
      return;
    }

    try {
      window.localStorage.setItem(
        ACTIVITIES_STORAGE_KEY,
        JSON.stringify(activities)
      );
    } catch (error) {
      console.error(
        "Projektaktivitäten konnten nicht gespeichert werden:",
        error
      );
    }
  }, [activities, storageLoaded]);

  const addActivity = useCallback(
    (
      data: CreateProjectActivityData,
      groupKey?: string
    ) => {
      const now = Date.now();
      const activeGroup = activityGroupRef.current;

      const belongsToActiveGroup =
        Boolean(groupKey) &&
        activeGroup?.key === groupKey &&
        now - activeGroup.updatedAt <=
          ACTIVITY_GROUP_TIMEOUT;

      if (
        belongsToActiveGroup &&
        activeGroup?.activityId
      ) {
        const nextActivities =
          activitiesRef.current.map((activity) =>
            activity.id === activeGroup.activityId
              ? {
                  ...activity,
                  timestamp: new Date(now).toISOString(),
                  user: data.user?.trim() || "Dennis",
                  projectId: data.projectId,
                  projectTitle: data.projectTitle,
                  action: data.action,
                  title: data.title,
                  description: data.description,
                }
              : activity
          );

        activityGroupRef.current = {
          key: groupKey as string,
          activityId: activeGroup.activityId,
          updatedAt: now,
        };

        replaceActivities(nextActivities);
        return;
      }

      const activity: ProjectActivity = {
        id: createActivityId(),
        timestamp: new Date(now).toISOString(),
        user: data.user?.trim() || "Dennis",
        projectId: data.projectId,
        projectTitle: data.projectTitle,
        action: data.action,
        title: data.title,
        description: data.description,
      };

      const nextActivities = [
        activity,
        ...activitiesRef.current,
      ].slice(0, MAX_ACTIVITY_ENTRIES);

      activityGroupRef.current = groupKey
        ? {
            key: groupKey,
            activityId: activity.id,
            updatedAt: now,
          }
        : null;

      replaceActivities(nextActivities);
    },
    [replaceActivities]
  );

  const resetActivityGroup = useCallback(() => {
    activityGroupRef.current = null;
  }, []);

  const clearActivities = useCallback(() => {
    activityGroupRef.current = null;
    replaceActivities([]);
  }, [replaceActivities]);

  return {
    activities,
    addActivity,
    resetActivityGroup,
    clearActivities,
  };
}