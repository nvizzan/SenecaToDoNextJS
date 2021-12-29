import styles from "./todos_item.module.scss";
import Image from "next/image";
import { useContext, useState } from "react";
import TodoContext from "../../context/todo-context";
import { InlineInputEdit } from "react-inline-input-edit";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faTimesCircle, faTimes } from "@fortawesome/free-solid-svg-icons";

library.add(faTimesCircle, faTimes);

const TodosItem = ({ todo }) => {
	const todoContext = useContext(TodoContext);

	let css = {};

	if (todo.completed) {
		css = { textDecoration: "line-through" };
	}

	const statusChangeHandler = (e) => {
		e.preventDefault();
		todoContext.updateTodoItem(todo, { completed: true });
	};

	const deleteHandler = (e) => {
		e.preventDefault();

		let text;
		if (confirm("Are you sure!") == true) {
			todoContext.deleteTodoItem(todo);
		} else {
			//do nothing
		}
	};

	const _handleFocus = () => {
		//cdo nothing
	};

	const _handleFocusOut = (text) => {
		todo = { ...todo, description: text };

		console.log("todo: ", todo);

		todoContext.updateTodoItem(todo, { description: text });
	};

	return (
		<li data-id={todo._id} key={todo._id}>
			<div className={`${styles.todo_item} todo_item`}>
				<div className={`${styles.todo_item_checkbox} checkbox`}>
					{!todo.completed && (
						<label className="checkbox">
							<input type="checkbox" onClick={statusChangeHandler} />
						</label>
					)}
					{todo.completed && (
						<Image width="35" height="35" src="/tick.png" alt="chekced" />
					)}
				</div>
				{false && (
					<div
						className={`${styles.todo_item_description} todo_item_description`}
						style={css}
					>
						{todo.description}
					</div>
				)}
				<div
					className={`${styles.todo_item_description} todo_item_description`}
					style={css}
				>
					<InlineInputEdit
						text={`${todo.description}`}
						inputWidth="410px"
						inputHeight="40px"
						inputMaxLength={250}
						onFocus={_handleFocus}
						onFocusOut={_handleFocusOut}
					/>
				</div>

				<div className={`${styles.todo_item_remove} todo_item_remove`}>
					<FontAwesomeIcon icon="times" onClick={deleteHandler} />
				</div>
			</div>
		</li>
	);
};

export default TodosItem;
