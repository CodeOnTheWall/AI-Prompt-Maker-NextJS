"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { signIn, signOut, useSession, getProviders } from "next-auth/react";

// NEXT-AUTH notes
// 1. user signs in through provider
// 2. NextAuth sets sessionToken cookie in browser
// session token by default is a signed JWT containing information about
// the user
// pages that use useSession will verify the signedJWT via nextauth, which
// verifies against the nextauth env key

export default function Nav() {
  // useSession hook gets the next-auth session token cookie from browser
  // useSession hook then calls the async session callback, which uses the
  // session token cookie to get the users info from db, then the async session
  // callback returns the session object
  const { data: session } = useSession();

  // Just Learned; can use useStateSnippet!
  const [providers, setProviders] = useState(null);
  const [toggleDropdown, setToggleDropdown] = useState(false);

  // The setProviders() function is called.
  // The setProviders() function returns a promise.
  // The useEffect hook waits for the promise to resolve.
  // Once the promise has resolved, the useEffect hook sets the providers
  // state variable to the response from the getProviders() function.
  useEffect(() => {
    // getProviders fetchs the list of providers via /api/auth/[...nextaut]
    const setUpProviders = async () => {
      const response = await getProviders();
      setProviders(response);
    };
    setUpProviders();
    // [] empty dependency only runs once, after initial render of component
    // reminder that component always loads first then useEffect runs, then after state
    // updating, the component re renders again, and reminder that react will
    // only render the parts of UI that have changed thanks to a comparison
    // of virtual DOM to the actual DOM
  }, []);

  // const signOut = async () => {
  //   // Clear the session state variable.
  //   session = null;

  //   // Clear the session from NextAuth.
  //   await nextAuth.signOut();

  //   // Redirect the user to the home page.
  //   window.location.href = "/";
  // };

  return (
    <nav className="flex-between w-full mb-16 mt-5 pt-2">
      <Link href="/" className=" flex gap-2 flex-center">
        <Image
          width={30}
          height={30}
          className=" object-contain"
          src="/assets/images/logo.svg"
          alt="Promptzila Logo"
        />
        <p className=" logo_text">Promptzila</p>
      </Link>

      {/* Desktop Nav */}
      {/* above sm its given flex */}
      <div className="sm:flex hidden">
        {session?.user ? (
          <div className="flex gap-3 md:gap-5">
            <Link href="/create-prompt" className="black_btn">
              Create Post
            </Link>

            <button type="button" onClick={signOut} className="outline_btn">
              Sign Out
            </button>

            <Link href="/profile">
              <Image
                // The ?. (optional chaining) operator is used to handle
                // cases where the session object or the user object might
                // be null or undefined. If any of these objects are null
                // or undefined, the expression short-circuits and
                // evaluates to undefined.
                src={session?.user.image}
                width={37}
                height={37}
                className=" rounded-full"
                alt="profile"
              />
            </Link>
          </div>
        ) : (
          <>
            {/* The Object.values() method returns an array of all the 
            values in an object. The providers variable is an object that
            contains the list of providers. Object.values(providers) method
            will return an array of all the values in the providers object.
           */}
            {providers &&
              Object.values(providers).map((provider) => (
                <button
                  type="button"
                  key={provider.name}
                  onClick={() => signIn(provider.id)}
                  className="black_btn"
                >
                  Sign In
                </button>
              ))}
          </>
        )}
      </div>

      {/* Mobile Nav */}
      {/* above sm its hidden */}
      <div className="sm:hidden flex relative">
        {session?.user ? (
          <div className="flex">
            <Image
              src={session?.user.image}
              width={37}
              height={37}
              className=" rounded-full"
              alt="profile"
              // always use prev for flipping state
              onClick={() => setToggleDropdown((prev) => !prev)}
            />
            {toggleDropdown && (
              <div className="dropdown">
                <Link
                  href="/profile"
                  className="dropdown_link"
                  onClick={() => setToggleDropdown(false)}
                >
                  My Profile
                </Link>
                <Link
                  href="/create-prompt"
                  className="dropdown_link"
                  onClick={() => setToggleDropdown(false)}
                >
                  Create Prompt
                </Link>
                <button
                  type="button"
                  // callback func is the anonymous arrow func that calls the 2 other funcs
                  onClick={() => {
                    setToggleDropdown(false);
                    signOut();
                  }}
                  className="mt-5 w-full black_btn"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            {/* The Object.values() method returns an array of all the 
          values in an object. The providers variable is an object that
          contains the list of providers. Object.values(providers) method
          will return an array of all the values in the providers object.
         */}
            {providers &&
              Object.values(providers).map((provider) => (
                <button
                  type="button"
                  key={provider.name}
                  onClick={() => signIn(provider.id)}
                  className="black_btn"
                >
                  Sign In
                </button>
              ))}
          </>
        )}
      </div>
    </nav>
  );
}
