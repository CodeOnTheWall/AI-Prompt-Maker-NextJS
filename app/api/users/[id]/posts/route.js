import { connectToDB } from "@utils/database";
import Prompt from "@models/prompt";

// params get populated if you pass dynamic variables into the url
// which I am passing via profile
export const GET = async (req, { params }) => {
  try {
    // reminder this is a lambda func, meaning only connects when need to
    // and dies when process completes
    await connectToDB();

    const prompts = await Prompt.find({ creator: params.id }).populate(
      "creator"
    );

    return new Response(JSON.stringify(prompts), { status: 200 });
  } catch (error) {
    return new Response("Failed to fetch all prompts", { status: 500 });
  }
};
