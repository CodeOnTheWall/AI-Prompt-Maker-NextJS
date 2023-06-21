import { Schema, model, models } from "mongoose";

const UserSchema = new Schema({
  email: {
    type: String,
    // second value in array is if not unique, the message that comes back
    unique: [true, "Email already exists!"],
    required: [true, "Email is required"],
  },
  username: {
    type: String,
    // second value in array is if not unique, the message that comes back
    unique: [true, "Username already exists!"],
    required: [true, "Username is required"],
    match: [
      // regex
      // ^(?=.{8,20} This ensures that the username is at least 8 characters
      //    long and at most 20 characters long.(?![_.]) This ensures
      // that the username does not start with an underscore or period.
      // (?!.*[_.]{2}) This ensures that the username does not contain two
      // consecutive underscores. [a-zA-Z0-9._]+: This allows any
      //  alphanumeric character, underscore, or period in the username.
      //  (?<![_.]) This ensures that the username does not end with
      //  an underscore or period.
      /^(?=.{8,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/,
      "Username invalid, it should contain 8-20 alphanumeric letters and be unique!",
    ],
  },
  image: {
    type: String,
  },
});

// this would be thr express way where the server is always up and running
// but in nextJS its only up when its needed/called
// const User = model("User", UserSchema);
// export default User;

// look into the models first, if not there (||), create new one
const User = models.User || model("User", UserSchema);
export default User;
