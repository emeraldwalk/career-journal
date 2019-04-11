import { useState } from 'react';
import { Dict } from './common';

type PendingAction = 'CREATE' | 'DELETE' | 'UPDATE';

export function usePending() {
  const [pending, setPendingInternal] = useState({} as Dict<PendingAction>);

  function resetPending(): void {
    setPendingInternal({});
  }

  function setPending(
    id: string,
    action: PendingAction
  ): void {
    // If pending creation don't flag for update
    if(action === 'UPDATE' && pending[id] === 'CREATE') {
      return;
    }

    if(action === 'DELETE' && pending[id] === 'CREATE') {
      delete pending[id];
      setPendingInternal({
        ...pending
      });
      return;
    }

    setPendingInternal({
      ...pending,
      [id]: action
    });
  }

  return {
    pending,
    resetPending,
    setPending
  };
}

export function useStateDict<T>(init: Dict<T>) {
  const [state, setStateInit] = useState(init);

  function remove(key: string): void {
    delete state[key];
    setStateInit({
      ...state
    });
  }

  function set(
    key: string,
    value: T
  ): void {
    setStateInit({
      ...state,
      [key]: value
    });
  }

  function setAll(
    data: Dict<T>
  ): void {
    setStateInit(data);
  }

  return {
    remove,
    set,
    setAll,
    state,
  };
}