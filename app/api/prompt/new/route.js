import { connectToDB } from "@utils/database";
import Prompt from "@models/prompt";

export const POST = async (req, res) => {
  // req.json parses the json to js
  const { userId, prompt, tag } = await req.json();
  console.log(userId, prompt, tag);

  try {
    // reminder this is a lambda func, meaning only connects when need to
    // and dies when process completes
    await connectToDB();
    const newPrompt = new Prompt({
      creator: userId,
      prompt,
      tag,
    });

    await newPrompt.save();

    return new Response(JSON.stringify(newPrompt), { status: 201 });
  } catch (error) {
    return new Response("Failed to create a new prompt", { status: 500 });
  }
};
