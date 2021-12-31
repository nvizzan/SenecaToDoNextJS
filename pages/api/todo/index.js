import { getSession } from "next-auth/client";
import { getAccessToken } from "../../../utils/helper";

export default async function handler(req, res) {
	let backendURL = process.env.SENECA_BACKEND_URL;

	if (req.method === "POST") {
		let todoURL = `${backendURL}/task`;
		let token = getAccessToken(req);
		let body = JSON.stringify(req.body); 

		if (!token) return res.status(400).json({ errorMsg: "Bad Request" });

		try {
			const todosRaw = await fetch(todoURL, {
				method: "POST",
				headers: {
					"Content-type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: body,
			});

			const todo = await todosRaw.json();

			return res.status(200).json(todo);
		} catch (err) {
			return res.status(400).json({ errorMsg: "Bad Request" });
		}
	} else if (req.method === "GET") {
		// Handle any other HTTP method
		let todoURL = `${backendURL}/task`;
		let token = getAccessToken(req);
		if (!token) return res.status(400).json({ errorMsg: "Bad Request" });

		try {
			const todosRaw = await fetch(todoURL, {
				method: "GET",
				headers: {
					"Content-type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			});

			const todos = await todosRaw.json();

			return res.status(200).json(todos);
		} catch (err) {
			console.log("error: , ", err);
			return res.status(400).json({ errorMsg: "Bad Request" });
		}
	}
}
