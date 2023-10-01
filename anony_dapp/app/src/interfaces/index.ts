interface TodoState {
  addTodo: (description: string) => void;
  removeTodo: (id: string) => void;
  toggleCompletedState: (id: string) => void;
}
