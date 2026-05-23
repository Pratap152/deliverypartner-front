import { useState, useEffect, useCallback } from 'react';
import {
  getReferralPrograms,
  getReferralProgramsProgress,
} from '../services/JoiningBonusService';

const initialState = {
  loading: true,
  error: null,
  program: null,
  progress: null,
  sortedTasks: [],
};

const buildTaskProgress = (task) => {
  const progress = task.progress || {};

  let label = '';

  switch (task.taskRuleType) {

    case 'SLAB':
      label = progress.isCompleted
        ? 'Completed'
        : `${progress.completedOrders || 0} Orders`;
      break;

    case 'FIXED_TARGET':
      label = `${progress.completedOrders || 0}/${progress.targetOrders || 0}`;
      break;

    case 'PER_ORDER':
      label = `₹${progress.earnedAmount || 0}`;
      break;

    case 'HYBRID':
      label = `${progress.progressPercentage || 0}%`;
      break;

    default:
      label = 'In Progress';
  }

  return {
    current: progress.completedOrders || 0,

    target:
      progress.targetOrders ||
      progress.nextTargetOrders ||
      0,

    percentage: progress.progressPercentage || 0,

    isCompleted: progress.isCompleted || false,

    status: progress.status,

    label,
  };
};

const buildSortedTasks = (tasks = []) => {
  return [...tasks]
    .sort((a, b) => a.dayNumber - b.dayNumber)
    .map((task) => ({
      ...task,
      rewardAmount:
  task.reward?.amount ||
  task.maxEarning ||
  task.slabs?.[task.slabs.length - 1]?.rewardAmount ||
  0,
      progressData: buildTaskProgress(task),
    }));
};

const useJoiningBonus = () => {
  const [state, setState] = useState(initialState);

  const setPartial = (patch) => {
    setState((prev) => ({ ...prev, ...patch }));
  };

  const load = useCallback(async () => {
    try {
      setPartial({
        loading: true,
        error: null,
      });
const [programRes, progressRes] = await Promise.all([
  getReferralPrograms(),
  getReferralProgramsProgress(),
]);

const activeProgram = programRes?.data?.[0];
const activeProgress = progressRes?.data?.[0];
const mergedTasks =
  activeProgress?.tasks?.map((progressTask) => {

    const programTask =
      activeProgram?.tasks?.find(
        (t) => t.dayNumber === progressTask.dayNumber
      );

    return {
      ...programTask,
      ...progressTask,
    };
  }) || [];

      setPartial({
        loading: false,
        program: activeProgram,
progress: activeProgress,
sortedTasks: buildSortedTasks(mergedTasks),
      });
    } catch (e) {
      setPartial({
        loading: false,
        error:
          e?.response?.data?.message ||
          e.message ||
          'Something went wrong',
      });
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return {
    ...state,
    load,
  };
};

export default useJoiningBonus;