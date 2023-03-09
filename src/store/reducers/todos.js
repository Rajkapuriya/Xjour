import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  todoGroups: [],
  todoGroupItems: {},
  todoGroupItemsExpanded: {},
  todoGroupItemsSortFilter: {},
  todoGroupItemsDraggable: {},
};

const todos = createSlice({
  name: "todos",
  initialState,
  reducers: {
    setTodoGroups: (state, action) => {
      state.todoGroups = action.payload;
    },
    setTodoGroupItems: (state, action) => {
      state.todoGroupItems = action.payload;
    },
    setTodoGroupItemsExpanded: (state, action) => {
      state.todoGroupItemsExpanded = action.payload;
    },
    setSingleTodoGroupItemsExpanded: (state, action) => {
      state.todoGroupItemsExpanded = {
        ...state.todoGroupItemsExpanded,
        ...action.payload,
      };
    },
    setTodoGroupItemsSortFilter: (state, action) => {
      state.todoGroupItemsSortFilter = action.payload;
    },
    setTodoGroupItemsDraggable: (state, action) => {
      state.todoGroupItemsDraggable = action.payload;
    },
    setMultiple: (state, action) => {
      return (state = {
        ...state,
        ...action.payload,
      });
    },
  },
});

export const {
  setTodoGroups,
  setTodoGroupItems,
  setTodoGroupItemsExpanded,
  setSingleTodoGroupItemsExpanded,
  setTodoGroupItemsSortFilter,
  setTodoGroupItemsDraggable,
  setMultiple,
} = todos.actions;
export const todosSelector = (state) => state.todos;
export default todos.reducer;
