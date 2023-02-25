const { Schema, model } = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Profile = require("./profile");
const chalk = require("chalk");

//create User Schema
const UserSchema = new Schema(
  {
    userName: {
      type: String,
      required: true,
    },
    phone: {
      type: Number,
      unique: true,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    confirmPassword: {
      type: String,
      required: true,
    },
    profile: {
      type: Schema.Types.ObjectId,
      ref: "Profile",
    },
    profilePic: {
      type: String,
      default: "../../static/img/default-user.png",
    },
    tokens: [
      {
        token: {
          type: String,
          require: true,
        },
      },
    ],
  },
  { timestamps: true }
);

//generate token
UserSchema.methods.generateAuthToken = async function () {
  try {
    const token = jwt.sign(
      { _id: this._id.toString() },
      process.env.JWT_SEKRET_KEY
    );

    this.tokens = this.tokens.concat({ token });
    await this.save();

    return token;
  } catch (error) {
    console.log(error);
  }
};

// password hashing
UserSchema.pre("save", async function (next) {
  if (this.isModified("password") && this.password == this.confirmPassword) {
    const round = 10;
    this.password = await bcrypt.hash(this.password, round);
    this.confirmPassword = await bcrypt.hash(this.confirmPassword, round);
  }

  next();
});

console.log("user schema is connected successfully...");

module.exports = User = new model("User", UserSchema);
