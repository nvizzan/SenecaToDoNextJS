import NextAuth from "next-auth";
import Providers from "next-auth/providers";

const providers = [
	Providers.Credentials({
		name: "Credentials",
		authorize: async (credentials) => {
			let url = `${process.env.SENECA_BACKEND_URL}/user/login`;

			console.log("creds: ", credentials);
			console.log("url: ", url);

			try {
				const response = await fetch(url, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						email: credentials.email,
						password: credentials.password,
					}),
				});

				let errorMessage = "";

				console.log("response: ", response);

				if (response.status == 400) {
					errorMessage = "Invalid Username or Password.";
					throw new Error(errorMessage);
				}

				//console.log('response: ', response);

				const user = await response.json();

				/*let res = JSON.stringify({
					user: {
						age: 30,
						_id: "61cb308b56ddc90017809ce3",
						name: "Nimish Kumar",
						email: "viz.nimish2010@gmail.com",
						createdAt: "2021-12-28T15:43:07.259Z",
						updatedAt: "2021-12-28T16:14:40.623Z",
						__v: 13,
					},
					token:
						"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MWNiMzA4YjU2ZGRjOTAwMTc4MDljZTMiLCJpYXQiOjE2NDA3MDgwODB9.DNDMdK6TL7cFmQGf2QNKmWzIe4EISKOlRCpNaBRwx6Y",
				}); */

				//let user = JSON.parse(res);

				console.log("res: ", user);

				if (typeof user.user == "undefined") {
					errorMessage = user.message[0]["messages"][0]["message"];

					if (errorMessage.search("Identifier") != -1) {
						errorMessage = "Invalid Username or Password.";
					}

					throw new Error(errorMessage);
				} else {
					return { status: "success", data: user };
					//return user;
				}
			} catch (e) {
				console.log("error: ", e);
				// Redirecting to the login page with error message in the URL

				if (typeof e["errno"] != "undefined") {
					if (e.errno) {
						e =
							"Server Error, Please try again later or contact administrator.";
					}
				}

				throw new Error(e);
			}
		},
	}),
];

const callbacks = {
	async jwt(token, user) {
		//console.log('me-token: ', token);
		//console.log('me-user: ', user);

		if (user) {
			token.accessToken = user.data.token;
			token.user = user.data.user;
		}

		//console.log('Token : ', token);
		//console.log('Token accessToken: ', token.accessToken);
		return token;
	},

	async session(session, token) {
		session.accessToken = token.accessToken;
		session.user = token.user;

		//console.log('session here: ', session);
		return session;
	},
};

const options = {
	providers,
	callbacks,
	// pages: {
	//   error: '/login' // Changing the error redirect page to our custom login page
	// }
};

const Auth = (req, res) => NextAuth(req, res, options);

export default Auth;
