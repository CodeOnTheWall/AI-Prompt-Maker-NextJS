import Feed from "@components/Feed";

export default function Home() {
  return (
    // reminder justify is main axis, and items is cross axis
    <section className=" w-full flex-center flex-col">
      <h1 className=" head_text text-center">
        Discover & Share {/* md above hide, break on small devices */}
        <br className=" max-md:hidden" />
        <span className=" orange_gradient text-center">Ai Powered Prompts</span>
      </h1>
      <p className=" desc text-center">
        Promptzila is an open-source AI prompting tool for modern world to
        discover, create and share creative prompts
      </p>
      <Feed />
    </section>
  );
}
