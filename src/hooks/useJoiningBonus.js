import { useState, useEffect, useCallback } from 'react';
import {
  getJoiningBonusProgram,
  joinJoiningBonus,
  getJoiningBonusProgress,
} from '../services/JoiningBonusService';

const initialState = {
  loading: true,
  joining: false,
  error: null,
  program: null,
  hasJoined: false,
  progress: null,
  sortedTasks: [],
};

const getTaskTarget = (task) => {
  const conditions = task.conditions || {};

  switch (task.taskType) {
    case 'ORDERS':
      return conditions.minOrders || 0;
    case 'ACCEPTANCE_RATE':
      return conditions.minAcceptanceRate || 0;
    case 'PEAK_SLOTS':
      return conditions.minPeakSlots || 0;
    case 'EARNINGS':
      return conditions.minEarnings || 0;
    default:
      return 0;
  }
};

const getTaskProgressLabel = (taskType, current, target, isCompleted) => {
  if (isCompleted) return 'Completed';

  switch (taskType) {
    case 'EARNINGS':
      return `₹${current}/₹${target}`;
    case 'ACCEPTANCE_RATE':
      return `${current}%/${target}%`;
    default:
      return `${current}/${target}`;
  }
};

const buildSortedTasks = (progressData) => {
  return [...(progressData?.tasks || [])]
    .sort((a, b) => a.dayNumber - b.dayNumber)
    .map((task) => ({
      ...task,
      minOrders: task.conditions?.minOrders,
      minAcceptanceRate: task.conditions?.minAcceptanceRate,
      minPeakSlots: task.conditions?.minPeakSlots,
      minEarnings: task.conditions?.minEarnings,
      progress: buildTaskProgress(task),
    }));
};

const buildTaskProgress = (task) => {
  const target = getTaskTarget(task);
  const current = task.progressValue || 0;
  const isCompleted = !!task.isCompleted;
      // const current =
      //   task.dayNumber === 2
      //     ? 50
      //     : task.progressValue || 0;

      // const isCompleted =
      //   task.dayNumber === 3
      //     ? false
      //     : !!task.isCompleted;


  const percentage = isCompleted
    ? 100
    : target > 0
    ? Math.min(100, Math.round((current / target) * 100))
    : 0;

  return {
    current,
    target,
    percentage,
    isCompleted,
    label: getTaskProgressLabel(task.taskType, current, target, isCompleted),
  };
};



const useJoiningBonus = ({ cityId, pincodeId } = {}) => {
  const [state, setState] = useState(initialState);

  const setPartial = (patch) => {
    setState((prev) => ({ ...prev, ...patch }));
  };

  const load = useCallback(async () => {
    try {
      setPartial({ loading: true, error: null });

      const programSummary = await getJoiningBonusProgram({
        cityId,
        pincodeId,
      });

      let progress = null;

      try {
        progress = await getJoiningBonusProgress(programSummary.id);
      } catch (e) {
        progress = null;
      }

      const resolvedProgram = progress?.program
        ? {
            ...programSummary,
            ...progress.program,
          }
        : programSummary;

      setPartial({
        loading: false,
        program: resolvedProgram,
        hasJoined: progress?.enrollment?.status === 'ACTIVE' || !!programSummary.isEnrolled,
        progress,
        sortedTasks: buildSortedTasks(progress),
      });
    } catch (e) {
      setPartial({
        loading: false,
        error: e?.response?.data?.message || e.message || 'Something went wrong',
      });
    }
  }, [cityId, pincodeId]);

  const join = useCallback(async () => {
    if (!state.program) {
      return { success: false, message: 'Program not found' };
    }

    try {
      setPartial({ joining: true });

      const res = await joinJoiningBonus(state.program.id);
      const progress = await getJoiningBonusProgress(state.program.id);

      const updatedProgram = progress?.program
        ? {
            ...state.program,
            ...progress.program,
            isEnrolled: true,
            enrollmentStatus: 'ENROLLED',
          }
        : {
            ...state.program,
            isEnrolled: true,
            enrollmentStatus: 'ENROLLED',
          };

      setPartial({
        joining: false,
        hasJoined: true,
        program: updatedProgram,
        progress,
        sortedTasks: buildSortedTasks(progress),
      });

      return {
        success: true,
        message: res?.message || 'Program joined successfully',
      };
    } catch (e) {
      const message =
        e?.response?.data?.message || e.message || 'Could not join. Please try again.';
      setPartial({ joining: false });
      return { success: false, message };
    }
  }, [state.program]);

  useEffect(() => {
    load();
  }, [load]);

  return {
    ...state,
    load,
    join,
  };
};

export default useJoiningBonus;