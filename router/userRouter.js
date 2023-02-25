const express = require("express");
const route = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../database/model/user");
const Post = require("../database/model/post");
const Category = require("../database/model/category");
const userAuth = require("../middelware/userAuthentication");
const upload = require("../middelware/multer");
const errorFormatter = require("../utils/validatorErrorFormatter");
const { body, validationResult } = require("express-validator");
const Profile = require("../database/model/profile");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");
const chalk = require("chalk");

const signUpValidator = [
  // userName Check
  body("userName")
    .isLength({ min: 2, max: 15 })
    .withMessage("Username Must Be Between 2 to 15 Charecter")
    .trim(),

  // Phone Check
  body("phone")
    .isNumeric()
    .withMessage("Please Provide a Valid Phone")
    .isLength({ min: 10, max: 12 })
    .withMessage("Please Provide a Valid Phone")
    .custom(async (phone) => {
      const userPhone = await User.findOne({ phone });
      if (userPhone) {
        return Promise.reject("Phone Is Already In Use");
      }
      return true;
    }),

  // Email Check
  body("email")
    .isEmail()
    .withMessage("Please Provide A Valid Email")
    .trim()
    .custom(async (email) => {
      const userEmail = await User.findOne({ email });
      if (userEmail) {
        return Promise.reject("Email Is Already In Use");
      }
      return true;
    }),

  // Address Check
  body("address").trim(),

  // Password Check
  body("password")
    .isLength({ min: 5 })
    .withMessage("Your Password Must Be Greater Than 5 Charecter"),

  // confirmPassword Check
  body("confirmPassword")
    .isLength({ min: 5 })
    .withMessage("Your Password Must Be Greater Than 5 Charecter")
    .custom((confirmPassword, { req }) => {
      if (confirmPassword !== req.body.password) {
        throw new Error("Password Does Not Matched");
      }
      return true;
    }),
];

const postUploadValidatior = [
  // Thumbnail Check
  body("thumbnail").isEmpty().withMessage("Please Select An Image"),

  // Title Check
  body("title").isEmpty().withMessage("Please Provide A Title").trim(),

  // Description Check
  body("description").isEmpty().withMessage("Please Write Somthing"),

  // tag Check
  body("tags").isEmpty().withMessage("Please Write Somthing"),

  // categories Check
  body("categories").isEmpty().withMessage("Please Write Somthing"),
];

// sign-in page
route.get("/sign-in", (req, res) => {
  res.status(200).render("sign-in", {
    verify: "failed",
    signUpSuccess: "",
    invalidPassword: "",
    invalidLogin: "",
    error: "",
    category: "",
    title: "Sign In | Unidef.com",
  });
});

// sign-up page
route.get("/sign-up", (req, res) => {
  res.status(200).render("sign-up", {
    verify: "failed",
    signUpSuccess: "",
    invalidPassword: "",
    invalidLogin: "",
    error: "",
    value: "",
    category: "",
    title: "Create Your Account | Unidef.com",
  });
});

// admin-dashboard page
// route.get('/admin-dashboard', userAuth, async (req, res) => {
//     try {
//         // to get the token everytime and check that is this the new generated token?
//         const token = req.cookies.jwt;
//         const verify = jwt.verify(token, process.env.JWT_SEKRET_KEY);

//         const user = await User.findOne({ _id: verify._id });
//         res.status(200).render('admin-dashboard', { verify, user });
//     } catch (error) {
//         res.status(400).render('sign-in');
//         console.log(error);
//     };
// });

// user-dashboard page
route.get("/dashboard", userAuth, async (req, res) => {
  try {
    let currentPage = parseInt(req.query.page) || 1;
    let itemPerPage = 6; // how many post i wanted to show

    // find the posts from the database and sort them to show the new post first
    let posts = await Post.find({ authore: req.user._id })
      .sort({ _id: -1 }) //sorting the post from new to old
      .skip(itemPerPage * currentPage - itemPerPage) // skip the given values like this=> ((10*1)-1 =0)
      .limit(itemPerPage) // showing limited post
      .populate("authore")
      .setOptions({ allowDiskUse: true })
      .exec();
    // total page
    let totalPost = await Post.countDocuments();
    let totalPage = Math.ceil(totalPost / itemPerPage);

    // to get the token everytime and check that is this the new generated token?
    const token = req.cookies.jwt;
    const verify = jwt.verify(token, process.env.JWT_SEKRET_KEY);

    const user = await User.findOne({ _id: verify._id });

    let bookmarks = [];
    let profile = await Profile.findOne({ user })
      .setOptions({ allowDiskUse: true })
      .exec();

    if (profile) {
      bookmarks = profile.bookmarks;
    }
    res.status(200).render("dashboard", {
      verify,
      user,
      posts,
      itemPerPage,
      currentPage,
      totalPage,
      bookmarks,
      category: "",
      title: "Dashboard | Unidef.com",
    });
  } catch (error) {
    res.status(400).render("sign-in");
    console.log(error);
  }
});

// post upload page
route.get("/upload", userAuth, async (req, res) => {
  try {
    // to get the token everytime and check that is this the new generated token?
    const token = req.cookies.jwt;
    const verify = jwt.verify(token, process.env.JWT_SEKRET_KEY);

    const user = await User.findOne({ _id: verify._id });
    const category = await Category.find();
    res.status(200).render("upload-page", {
      verify,
      user,
      category,
      success: "",
      unsuccess: "",
      title: "",
      description: "",
    });
  } catch (error) {
    res.status(400).render("sign-in");
    console.log(error);
  }
});

// profile edit page
route.get("/profile-edit", userAuth, async (req, res) => {
  try {
    // to get the token everytime and check that is this the new generated token?
    const token = req.cookies.jwt;
    const verify = jwt.verify(token, process.env.JWT_SEKRET_KEY);

    const user = await User.findOne({ _id: verify._id }); // fine the user
    const profile = await Profile.findOne({ user: req.user._id }); //find the profile
    if (profile === null) {
      res.status(200).render("profile-edit", {
        verify,
        user,
        category: "",
        success: "",
        unsuccess: "",
        error: "",
        value: "",
        profile: "",
        title: "Edit Your Profile | Unidef.com",
      });
    } else {
      res.status(200).render("profile-edit", {
        verify,
        user,
        profile,
        category: "",
        success: "",
        unsuccess: "",
        error: "",
        value: "",
        title: "Edit Your Profile | Unidef.com",
      });
    }
  } catch (error) {
    res.status(400).render("sign-in");
    console.log(error);
  }
});

// log-out page
route.get("/log-out", userAuth, async (req, res) => {
  // deleting token from the database
  req.user.tokens = [];
  res.clearCookie("jwt"); //clear the cookie from the website
  await req.user.save(); // after deleting the token, update the database
  res.status(200).redirect("/");
});

//POST Requiests
//User post methode
route.post("/registration", signUpValidator, async (req, res) => {
  const { password, confirmPassword, userName, email, phone, address } =
    req.body;

  let errors = validationResult(req).formatWith(errorFormatter);
  if (!errors.isEmpty()) {
    return res.render("sign-up", {
      error: errors.mapped(),
      verify: "failed",
      category: "",
      signUpSuccess: "",
      invalidPassword: "Invalid Password",
      invalidLogin: "",
      title: "Create Your Account | Unidef.com",
      value: {
        userName,
        email,
        phone,
        address,
      },
    });
  }
  try {
    if (password == confirmPassword) {
      // creating the database using user requests
      const register = User({
        userName: userName,
        email: email,
        phone: phone,
        address: address,
        password: password,
        confirmPassword: confirmPassword,
      });
      // getting the token from the User model before save
      const token = await register.generateAuthToken();
      await register.save(); // saving the data into the database
      res.json("fasd");
      res.status(201).redirect("/user/sign-in");
    } else {
      res.status(401).render("sign-up", {
        verify: "failed",
        signUpSuccess: "",
        category: "",
        invalidPassword: "Invalid Password",
        invalidLogin: "",
        title: "Create Your Account | Unidef.com",
      });
    }
  } catch (error) {
    console.log(error);
  }
});

// sign in post methode
route.post("/sign-in", async (req, res) => {
  try {
    const { email, password } = req.body;

    const userEmail = await User.findOne({ email }); // find the email in the database

    //if there is no email found
    if (userEmail == null) {
      res.status(401).render("sign-in", {
        verify: "failed",
        signUpSuccess: "",
        invalidPassword: "",
        category: "",
        title: "Sign In | Unideff.com",
        invalidLogin: "invalid",
      });
    }

    //if there are emails found
    else if (userEmail) {
      const passwordMatched = await bcrypt.compare(
        password,
        userEmail.password
      ); // comparing the user password and database hash password

      const token = await userEmail.generateAuthToken(); // getting the token from the User model

      //generate a new cookie
      res.cookie("jwt", token, {
        expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1day
        httpOnly: true,
      });

      if (passwordMatched) {
        res.status(202).redirect("/user/dashboard");
      } else {
        res.status(401).render("sign-in", {
          verify: "failed",
          signUpSuccess: "",
          invalidPassword: "",
          invalidLogin: "Invalid login",
          caegory: "",
          title: "Sign In | Unidef.com",
        });
      }
    } else {
      res.status(401).render("sign-in", {
        verify: "failed",
        signUpSuccess: "",
        invalidPassword: "",
        caegory: "",
        invalidLogin: "Invalid login",
        title: "Sign In | Unidef.com",
      });
    }
  } catch (err) {
    res.status(401).render("sign-in", {
      verify: "failed",
      signUpSuccess: "",
      invalidPassword: "",
      invalidLogin: "Invalid login",
    });
  }
});

//Blog upload post methode
route.post(
  "/upload",
  userAuth,
  upload.single("thumbnail"),
  async (req, res) => {
    // to get the token everytime and check that is this the new generated token?
    const token = req.cookies.jwt;
    const verify = jwt.verify(token, process.env.JWT_SEKRET_KEY);
    let thumbnail;
    const user = await User.findOne({ _id: verify._id });
    const { title, description, categories, tags } = req.body;

    // save categories
    try {
      if (typeof categories === "string") {
        const isCategoryAvailable = await Category.find({
          category: categories,
        });

        // find category schema and if find something then do this
        if (isCategoryAvailable.length > 0) {
          for (let i = 0; i < isCategoryAvailable.length; i++) {
            const e = isCategoryAvailable[i];

            if (!e.category.includes(categories)) {
              let createdCategory = new Category({
                category: categories,
              });
              await createdCategory.save();
            }
          }
        } else {
          // if category schema has no file then do this

          let createdCategory = new Category({
            category: categories,
          });
          await createdCategory.save();
        }
      } else {
        [...categories].forEach(async (category) => {
          const isCategoryAvailable = await Category.find({ category });

          // find category schema and if find something then do this
          if (isCategoryAvailable.length > 0) {
            for (let i = 0; i < isCategoryAvailable.length; i++) {
              const e = isCategoryAvailable[i];

              if (!e.category.includes(category)) {
                let createdCategory = new Category({
                  category,
                });
                await createdCategory.save();
              }
            }
          } else {
            // if category schema has no file then do this

            let createdCategory = new Category({
              category,
            });
            await createdCategory.save();
          }
        });
      }
    } catch (error) {
      console.log(error);
    }

    // resize an image
    if (req.file) {
      const { filename: image } = req.file;
      try {
        await sharp(req.file.path)
          .resize(400)
          .jpeg({ quality: 90 })
          .toFile(path.resolve("static/img/uploads/resized", image));

        // unlink the main file after resised the image
        fs.unlinkSync(`static/img/uploads/${req.file.filename}`);
      } catch (error) {
        console.log(error);
      }
      thumbnail = `../static/img/uploads/resized/${req.file.filename}`;
    }

    try {
      // get the date & time
      let months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];

      let new_date = new Date();
      let date_with_month = months[new_date.getMonth()];
      let date = new_date.getDate();
      let final_date = `${date < 10 ? `0${date}` : date} ${date_with_month}`;

      function formatAMPM(date) {
        let hours = date.getHours();
        let minutes = date.getMinutes();
        let ampm = hours >= 12 ? "PM" : "AM";
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? "0" + minutes : minutes;
        let strTime = hours + ":" + minutes + " " + ampm;
        return strTime;
      }
      let time = formatAMPM(new_date);

      let siNo = await Post.find().countDocuments();
      siNo += 1;
      //save the post data to the collection
      const post = new Post({
        title,
        description,
        authore: req.user._id,
        thumbnail,
        date: final_date,
        views: 0,
        siNo,
        time,
        tags,
        categories,
      });
      await post.save();

      // save the post id into the profile of the user
      await Profile.findOneAndUpdate(
        { user: req.user._id },
        {
          $push: {
            posts: [post._id],
          },
        }
      );

      res.status(200).redirect("/user/dashboard");
    } catch (error) {
      res.status(200).render("upload-page", {
        success: "",
        unsuccess: "Somthing is invalid",
        verify,
        user,
        title,
        description,
        authore: req.user._id,
        thumbnail,
        tags,
        categories,
      });
      console.log(error);
    }
  }
);

console.log(chalk.green("user router is connected"));

module.exports = route;
