"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { signIn, signOut, useSession, getProviders } from "next-auth/react";

// Nav Render Cycle
// 1. component mounts, useSession runs, if null or undefined, then useEffect will run
// 2. if theres a session, this will cause component to re render and then code
// that relies on session? will render then
// 3. useEffect will run which updates providers, since this is a change state, this causes
// the component to re render
// 4. useSession state hasnt changed so that wont re run, since states dont get wiped
// on re renders, since this isnt considered a component unmount, on page refreshes yes

// NextAuth flow notes
// 1. User clicks login button. User is redirected to the auth provider
// 2. After successful auth, provider sends an auth token to nextauth
// 3. nextauth receives the auth token and exchanges it with provider for aT and profile.
// 4. nextauth passes profile to `signIn` callback.
// 5. `signIn` callback uses profile to create or update user in database.
// 6. nextauth then creates session object and sets session cookie in user's browser.

export default function Nav() {
  // useSession hook gets the next-auth session token cookie from browser
  // and decrypts and verifies the token
  // useSession hook then calls the async session callback (it itself is the callback), which uses the
  // session token cookie to get the users info from db, then the async session
  // callback returns the session object (re naming data to session)
  // useSession uses useState behind the scenes with causes re render if there is
  // a session, if null or undefined, this wont cause a re render
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
    // getProviders fetchs the list of providers via /api/auth/[...nextauth]
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

  /* The Object.values() method returns an array of all the 
          values in an object. The providers variable is an object that
          contains the list of providers. Object.values(providers) method
          will return an array of all the values in the providers object.
         */
  const SignInButtons = () => (
    <>
      {providers &&
        Object.values(providers).map((provider) => (
          <button
            type="button"
            key={provider.name}
            // causes component to re render which then should get the session
            onClick={() => signIn(provider.id)}
            className="black_btn"
          >
            Sign In
          </button>
        ))}
    </>
  );

  return (
    <nav className="flex-between w-full mb-16 mt-5 pt-2">
      <Link href="/" className=" flex gap-3 flex-center">
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
      <div className="hidden sm:flex ">
        {/* session?.user - The session object is being accessed using optional 
        chaining (?.). This means that if the session object is null or undefined,
         the expression will short-circuit and evaluate to undefined without
          throwing an error. If the session object exists, it will proceed to
           check the user property within the session object. */}
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
                // using option chaining to prevent errors, if session is null or
                // undefined, we wont try to evaluate user
                src={session?.user.image}
                width={37}
                height={37}
                className=" rounded-full"
                alt="profile"
              />
            </Link>
          </div>
        ) : (
          <SignInButtons />
        )}
      </div>

      {/* Mobile Nav */}
      {/* above sm its hidden */}
      <div className="flex sm:hidden relative">
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
          <SignInButtons />
        )}
      </div>
    </nav>
  );
}
