import TodosItem from "./todos_item";

const TodosList = ({ todos }) => {
	if (!todos) return <></>;

	console.log("todolist: ", todos);

	return (
		<ul>
			{todos.map((todo) => {
				return <TodosItem todo={todo} key={todo._id} />;
			})}
		</ul>
	);
};

export default TodosList;
