import TodosList from "./todos_list";
import styles from "./todos_completed.module.scss";

const TodosCompleted = (props) => {
	if (!props.todos) return <></>;

	return (
		<div className={`${styles.box} box`}>
			<h3 className={`${styles.title} title`}>List of completed todo&apos;s</h3>
			<TodosList todos={props.todos} />
		</div>
	);
};

export default TodosCompleted;
