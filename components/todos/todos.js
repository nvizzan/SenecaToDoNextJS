import TodoContext from "../../context/todo-context";
import AddTodoForm from "./add_todo";
import TodosCompleted from "./todos_completed";
import TodosCurrent from "./todos_current";
import { useState } from "react";
import { useSession } from "next-auth/client";
import eventBus from "../../utils/event-bus";

const Todos = (props) => {
	let todos = [];
	if (props.todos) todos = props.todos;
	let nextAuthURL = props.nextAuthURL;

	const [todoItems, setTodoItems] = useState(todos);
	const [session, status] = useSession();

	//console.log("SEssion value here: ", session);

	let currentTodos = [];
	let completedTodos = [];

	//console.log("HERE - ", process.env.STRAPI_BACKEND_URL);

	if (todoItems.length) {
		// console.log("todoitems here :", todoItems);
		currentTodos = todoItems.filter((todo) => todo.completed !== true);
		completedTodos = todoItems.filter((todo) => todo.completed === true);
	}

	const createTodo = async (todo) => {
		let toDoURL = `${nextAuthURL}/api/todo`;
		let responseRaw = null;
		let response = null;

		let data = { ...todo };
		let id_old = data._id;
		delete data._id;

		let options = {
			method: "POST",
			headers: {
				"Content-type": "application/json",
				Authorization: `Bearer ${session.accessToken}`,
			},
			body: JSON.stringify(data),
		};

		try {
			responseRaw = await fetch(toDoURL, options);

			try {
			} catch (e) {
				console.log(e);
			}
			response = await responseRaw.json();
			//console.log("Response: ", response);

			if (response.data) {
				let updatedItems = todoItems.filter((item) => item._id !== id_old);
				updatedItems = [...updatedItems, response.data];
				setTodoItems(updatedItems);

				//Need to implement event bus so that the input element can be cleared ... and we can show a success message.
			}
		} catch (e) {
			console.log(e);
		}
	};

	const updateTodo = async (todo, data) => {
		let toDoURL = `${nextAuthURL}/api/todo/${todo._id}`;
		let responseRaw = null;
		let response = null;

		let options = {
			method: "PUT",
			headers: {
				"Content-type": "application/json",
				Authorization: `Bearer ${session.accessToken}`,
			},
			body: JSON.stringify(data),
		};

		try {
			responseRaw = await fetch(toDoURL, options);

			try {
			} catch (e) {
				console.log(e);
			}
			response = await responseRaw.json();
			//console.log("Response: ", response);

			if (typeof response["success"] == "undefined") return; // need to put a case for this scenario

			if (response.success) {
				//do nothing
			}
		} catch (e) {
			console.log(e);
		}
	};

	const deleteTodo = async (todo) => {
		let toDoURL = `${nextAuthURL}/api/todo/${todo._id}`;
		let responseRaw = null;
		let response = null;

		let options = {
			method: "DELETE",
			headers: {
				"Content-type": "application/json",
				Authorization: `Bearer ${session.accessToken}`,
			},
		};

		try {
			responseRaw = await fetch(toDoURL, options);

			try {
			} catch (e) {
				console.log(e);
			}
			response = await responseRaw.json();

			if (typeof response["success"] == "undefined") return; // need to put a case for this scenario

			if (response.success) {
				//do nothing
			}
		} catch (e) {
			console.log(e);
		}
	};

	let contextObject = {
		todos: todoItems,
		nextAuthURL: nextAuthURL,
		addTodoItem: async (todo) => {
			setTodoItems((prevTodos) => {
				return [...prevTodos, todo];
			});
			eventBus.dispatch("clear-input", { message: "clear" });
			createTodo(todo);
		},
		updateTodoItem: async (todo, data) => {
			setTodoItems((prevTodos) => {
				if (data.completed) {
					todo.completed = true;
				}

				let updatedItems = [];

				updatedItems = prevTodos.filter((item) => item._id !== todo._id);
				updatedItems = [...updatedItems, todo];

				//todo sort by updated time
				/*updatedItems = updatedItems.sort(
					(b, a) => b["updatedAt"] - a["updatedAt"]
				);*/

				return [...updatedItems];
			});
			updateTodo(todo, data);
		},
		deleteTodoItem: async (todo) => {
			setTodoItems((prevTodos) => {
				todo.completed = true;

				let updatedItems = prevTodos.filter((item) => item._id !== todo._id);

				return [...updatedItems];
			});
			deleteTodo(todo);
		},
	};

	console.log("currentTodos: ", currentTodos);
	console.log("completedTodos: ", completedTodos);

	return (
		<TodoContext.Provider value={contextObject}>
			<TodosCurrent todos={currentTodos} />
			<TodosCompleted todos={completedTodos} />
		</TodoContext.Provider>
	);
};

export default Todos;
