import { useState, useCallback } from 'react';

// A custom hook to manage state with undo/redo capabilities.
export const useUndoableState = <T>(initialState: T) => {
  const [state, setState] = useState<{
    past: T[];
    present: T;
    future: T[];
  }>({
    past: [],
    present: initialState,
    future: [],
  });

  const canUndo = state.past.length > 0;
  const canRedo = state.future.length > 0;

  // Reverts to the previous state in history.
  const undo = useCallback(() => {
    setState(currentState => {
      const { past, present, future } = currentState;
      if (!canUndo) {
        return currentState;
      }
      const previous = past[past.length - 1];
      const newPast = past.slice(0, past.length - 1);
      return {
        past: newPast,
        present: previous,
        future: [present, ...future],
      };
    });
  }, [canUndo]);

  // Moves forward to a state that has been undone.
  const redo = useCallback(() => {
    setState(currentState => {
      const { past, present, future } = currentState;
      if (!canRedo) {
        return currentState;
      }
      const next = future[0];
      const newFuture = future.slice(1);
      return {
        past: [...past, present],
        present: next,
        future: newFuture,
      };
    });
  }, [canRedo]);

  // Sets a new state and clears the redo history.
  const set = useCallback((update: (prevState: T) => T) => {
     setState(currentState => {
      const { past, present } = currentState;
      const newPresent = update(present);
       if (newPresent === present) {
        return currentState;
      }
       return {
        past: [...past, present],
        present: newPresent,
        future: [],
      };
     })
  }, []);

  return { state: state.present, setState: set, undo, redo, canUndo, canRedo };
};
