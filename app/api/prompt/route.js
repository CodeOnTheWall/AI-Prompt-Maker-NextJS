import { connectToDB } from "@utils/database";
import Prompt from "@models/prompt";

export const GET = async (req, res) => {
  try {
    // reminder this is a lambda func, meaning only connects when need to
    // and dies when process completes
    await connectToDB();
    // have to populate the creator since its its own model (user)
    // otherwise we would only get the id of the creator, but not the full user model
    const prompts = await Prompt.find({}).populate("creator");

    return new Response(JSON.stringify(prompts), { status: 200 });
  } catch (error) {
    return new Response("Failed to fetch all prompts", { status: 500 });
  }
};
