import Head from "next/head";
import { getSession, session } from "next-auth/client";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Todos from "../components/todos/todos";
import { signOut } from "next-auth/client";

export default function Home(props) {
	const [isLoading, setIsLoading] = useState(true);
	const router = useRouter();
	let backendURL = process.env.SENECA_BACKEND_URL;
	let nextAuthURL = process.env.NEXTAUTH_URL;

	console.log("props: ", props);

	let todos = [];
	if (props.todos) todos = props.todos;

	useEffect(() => {
		getSession().then((session) => {
			console.log("session frontend: ", session);

			if (!session) {
				router.replace("/login");
			} else {
				setIsLoading(false);
			}
		});
	}, [router]);

	if (isLoading) {
		return (
			<div
				className="pageloader is-active"
				style={{ backgroundColor: "transparent" }}
			></div>
		);
	}

	return (
		<>
			<Head></Head>
			<div className={`home-container container`}>
				<div className="columns">
					<div className="column is-12">
						<Todos todos={todos} nextAuthURL={nextAuthURL} />
					</div>
				</div>
				<div className="columns">
					<div className="footer column is-12">
						<div className="logout">
							<div className="button-container">
								<button className="button" onClick={() => signOut()}>
									Sign out
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

export async function getServerSideProps(ctx) {
	const session = await getSession(ctx);
	let SENECA_backend_url = process.env.SENECA_BACKEND_URL;

	console.log("session static here: ", session);

	if (!session) {
		return {
			props: {},
		};
	}

	const { user, accessToken } = session;
	let toDoURL = `${process.env.NEXTAUTH_URL}/api/todo`;

	let toDoRawResponse = null;
	let toDoResponse = null;

  console.log("fetching user data here");
	console.log("access token: ", accessToken);

	//fetching user data
	try {
		toDoRawResponse = await fetch(toDoURL, {
			method: "GET",
			headers: {
				"Content-type": "application/json",
				Authorization: `Bearer ${accessToken}`,
			},
		});

		try {
			toDoResponse = await toDoRawResponse.json();

			let todos = [];

			if (toDoResponse.data.length) {
				todos = toDoResponse.data;
			}

			//todos = JSON.stringify(todos);

			return {
				props: {
					todos: todos,
					user: user,
					accessToken: accessToken,
					SENECA_backend_url: SENECA_backend_url,
				},
			};
		} catch (e) {
			//console.log("error:", e);

			return {
				props: {
					todos: [],
					user: user,
					accessToken: accessToken,
					SENECA_backend_url: SENECA_backend_url,
				},
			};
		}
	} catch (e) {
		return {
			props: {
				todos: [],
				user: user,
				accessToken: accessToken,
				SENECA_backend_url: SENECA_backend_url,
			},
		};
	}
}
