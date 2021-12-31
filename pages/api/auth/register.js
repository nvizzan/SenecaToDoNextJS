import { getSession } from "next-auth/client";
import { getAccessToken } from "../../../utils/helper";

export default async function handler(req, res) {
	let backendURL = process.env.SENECA_BACKEND_URL; 

	if (req.method === "POST") {
		let registerURL = `${backendURL}/user/register`;
		let body = JSON.stringify(req.body);  

    console.log('body: ', body); 

		try {
			const todosRaw = await fetch(registerURL, {
				method: "POST",
				headers: {
					"Content-type": "application/json"
				},
				body: body,
			});

			const todo = await todosRaw.json();

			return res.status(200).json(todo);
		} catch (err) {
			return res.status(400).json({ errorMsg: "Bad Request" }); 
		}
	} else{
		// Handle any other HTTP method
		return res.status(400).json({ errorMsg: "Bad Request" });
  }  
}
