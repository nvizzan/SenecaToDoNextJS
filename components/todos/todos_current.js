import AddTodoForm from "./add_todo";
import TodosList from "./todos_list";
import styles from "./todos_current.module.scss";

const TodosCurrent = (props) => {
	if (!props.todos)
		return (
			<>
				<h1>No Todos in the list</h1>
			</>
		);

	return (
		<div className={`${styles.box} box`}>
			<h3 className={`${styles.title} title`}>Todo's List</h3>
			<TodosList todos={props.todos} />
			<AddTodoForm />
		</div>
	);
};

export default TodosCurrent;
