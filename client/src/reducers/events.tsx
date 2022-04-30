import { GameEvent, EventActionTypes, EVENT_ACTIONS } from "../types";

export const eventsReducer = (
  state: Array<GameEvent>,
  action: EventActionTypes
): Array<GameEvent> => {
  switch (action.type) {
    case EVENT_ACTIONS.new_event:
      return [...state, action.event];
    default:
      return state;
  }
};
