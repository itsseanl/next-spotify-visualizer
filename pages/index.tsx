import React, { useState } from "react";
import Link from "next/link";

const Home = (url) => {
	const authURL =
		"https://accounts.spotify.com/authorize?client_id=680a695ebdd6426c88761c2addb026e3&redirect_uri=http://localhost:3000/&scope=user-read-currently-playing&response_type=token&state=123";
	let returned = url.url.asPath;
	let authCode = returned.substring(15, 163);

	console.log(authCode);
	return (
		<>
			<div className="welcome">
				{authCode != "" ? (
					<h1>Welcome!</h1>
				) : (
					<h1>
						Welcome. Please <a href={authURL}>sign in</a> to get started.
					</h1>
				)}
			</div>
		</>
	);
};
const getInitialPropr = () => {
	const getBaseUrl = (req) => {
		let url;

		if (req) {
			// Server side rendering
			console.log(req);
			console.log(req.connection.encrypted); // undefined
			console.log(req.protocol); // undefined
			url = req.protocol + "://" + req.headers.host;
		} else {
			// Client side rendering
			console.log("else");
			url = window.location.protocol;
		}

		return url;
	};
};

export default Home;
