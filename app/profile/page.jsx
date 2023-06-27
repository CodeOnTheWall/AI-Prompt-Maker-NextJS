"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import Profile from "@components/Profile";

// reminder: component renders, then useEffect runs and fetches posts,
// setPosts state with those posts, and then we re render again
export default function MyProfile() {
  // useSession hook is called on every page load, which causes a component re render
  // if we have a session
  const { data: session } = useSession();
  // console.log(session);

  const router = useRouter();

  const [posts, setPosts] = useState([]);
  // console.log(posts);

  // console.log("component mounted");

  useEffect(() => {
    // this flow applies on a refresh/first load, on subsequent we already
    // have the session, hence on the first useEffect, fetchPosts runs
    // first useEffect runs after component mounts/renders, but fetchPosts
    // doesnt run as session hasnt been loaded yet, session is initially
    // undefined as it takes a second to be fetched from nextauth api
    // obviously at this point posts is also still empty array
    // user session finally loads, causing component to re render, posts still
    // empty array, then useEffect again (since useEffect is always after
    // page renders), and this time we have session, so fetchPosts func runs
    // causing another re render, and not posts is a loaded array

    // console.log("inside use effect");
    // test test test

    const fetchPosts = async () => {
      // console.log("fetching posts");
      const response = await fetch(`/api/users/${session?.user.id}/posts`);
      const data = await response.json();

      setPosts(data);
    };
    if (session?.user.id) fetchPosts();
  }, [session?.user.id]);

  const handleEdit = (post) => {
    router.push(`/update-prompt?id=${post._id}`);
  };
  const handleDelete = async (post) => {
    const hasConfirmed = confirm(
      "Are you sure you want to delete this prompt?"
    );

    if (hasConfirmed) {
      try {
        await fetch(`/api/prompt/${post._id.toString()}`, { method: "DELETE" });

        const filteredPosts = posts.filter((p) => p._id !== post._id);

        setPosts(filteredPosts);
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <Profile
      name="My"
      desc="Welcome to your personalized profile page"
      data={posts}
      handleEdit={handleEdit}
      handleDelete={handleDelete}
    />
  );
}
