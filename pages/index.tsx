import React, { useState } from "react";
import Link from "next/link";
import fetch from "isomorphic-unfetch";

import Header from "../components/Header";

const Home = url => {
  const authURL =
    "https://accounts.spotify.com/authorize?client_id=680a695ebdd6426c88761c2addb026e3&redirect_uri=http://localhost:3000/&scope=user-read-currently-playing&response_type=token&state=123";
  const returned = url.url.asPath;
  const authCode = returned.substring(15, 163);

  return (
    <>
      <div className="welcome">
        {authCode != "" ? (
          <Header authCode={authCode} url={url} />
        ) : (
          <h1>
            Welcome. Please <a href={authURL}>sign in</a> to get started.
          </h1>
        )}
      </div>
      <style jsx>{`
        * {
          margin: 0 !important;
          padding: 0;
        }
      `}</style>
    </>
  );
};
export default Home;
