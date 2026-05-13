import { useState, useEffect, useCallback } from 'react';
import { getJoiningBonusProgress } from '../services/JoiningBonusService';

const initialState = {
  loading: true,
  error: null,
  program: null,
  progress: null,
  sortedTasks: [],
};

const buildTaskProgress = (task) => {
  const progress = task.progress || {};

  return {
    current: progress.completedOrders || 0,
    target: progress.nextTargetOrders || 0,
    percentage: progress.progressPercentage || 0,
    isCompleted: progress.isCompleted || false,
    status: progress.status,
    label: progress.isCompleted
  ? 'Completed'
  : `${progress.completedOrders || 0} Orders`,
  };
};

const buildSortedTasks = (tasks = []) => {
  return [...tasks]
    .sort((a, b) => a.dayNumber - b.dayNumber)
    .map((task) => ({
      ...task,
      rewardAmount:
        task.slabs?.[task.slabs.length - 1]?.rewardAmount || 0,
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

      const res = await getJoiningBonusProgress();

      setPartial({
        loading: false,
        program: res.program,
        progress: res.data,
        sortedTasks: buildSortedTasks(res.data?.tasks || []),
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