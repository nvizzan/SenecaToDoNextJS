import { useState, useContext, useRef, useEffect } from "react";
import TodoContext from "../../context/todo-context";
import eventBus from "../../utils/event-bus";
import styles from "./add_todo.module.scss";
import { v4 as uuidv4 } from "uuid";

const AddTodoForm = (props) => {
	const [todo, setTodo] = useState("");
	const todoContext = useContext(TodoContext);
	const inputRef = useRef(null);

	useEffect(() => {
		eventBus.on("clear-input", (data) => {
			setTodo("");
		});

		return () => {
			eventBus.remove("clear-input");
		};
	});

	const onSubmitHandler = (e) => {
		e.preventDefault();

		if (!todo) {
			alert("Please enter a valid Todo");
			return;
		}

		let todoObj = {
			_id: uuidv4(),
			description: todo,
			completed: false,
		};

		//console.log(todoObj);
		todoContext.addTodoItem(todoObj);
		return;
	};

	return (
		<form onSubmit={onSubmitHandler}>
			<div className={`${styles.form_inner}`}>
				<input
					tyoe="text"
					name="todo"
					className={`${styles.input} input`}
					value={todo}
					onChange={(e) => setTodo(e.target.value)}
					placeholder="Todo Description"
					ref={inputRef}
				/>
				<input
					className={`${styles.button} button is-danger`}
					type="submit"
					value="Add a Todo"
				/>
			</div>
		</form>
	);
};

export default AddTodoForm;
