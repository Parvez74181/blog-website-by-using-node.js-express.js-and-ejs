const express = require("express");
const route = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../database/model/user");
const Post = require("../database/model/post");
const Comment = require("../database/model/comment");
const Category = require("../database/model/category");
const Profile = require("../database/model/profile");
const session = require("express-session");
const userAuth = require("../middelware/userAuthentication");
const chalk = require("chalk");

//END POINTS
//GET Requiests

// home page
route.get("/", async (req, res) => {
  // find the posts from the database and sort them to show the new post first
  try {
    let posts = await Post.find()
      .sort({ _id: -1 }) //sorting the post from new to old
      .limit(8)
      .populate("authore")
      .setOptions({ allowDiskUse: true })
      .exec();

    // to get the token everytime and check that is this the new generated token?
    const token = req.cookies.jwt;
    let category = await Category.find().sort({ createdAt: -1 });

    if (token) {
      const verify = jwt.verify(token, process.env.JWT_SEKRET_KEY);
      const user = await User.findOne({ _id: verify._id });

      let bookmarks = [];
      let profile = await Profile.findOne({ user })
        .setOptions({ allowDiskUse: true })
        .exec();

      if (profile) {
        bookmarks = profile.bookmarks;
      }

      res.status(200).render("home", {
        verify,
        user,
        posts,
        bookmarks,
        category,
        title: "Unidef.com",
      });
    } else {
      res.status(200).render("home", {
        posts,
        category,
        verify: "failed",
        user: "",
        bookmarks: "",
        title: "Unidef.com",
      });
    }
  } catch (error) {
    console.log(error);
  }
});

// blog page
route.get("/blog", async (req, res) => {
  try {
    let currentPage = parseInt(req.query.page) || 1;
    let itemPerPage = 3; // how many post i wanted to show

    // find the posts from the database and sort them to show the new post first
    let posts = await Post.find()
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
    let category = await Category.find().sort({ createdAt: -1 });
    if (token) {
      const verify = jwt.verify(token, process.env.JWT_SEKRET_KEY);
      const user = await User.findOne({ _id: verify._id });

      let bookmarks = [];
      let profile = await Profile.findOne({ user })
        .setOptions({ allowDiskUse: true })
        .exec();

      if (profile) {
        bookmarks = profile.bookmarks;
      }
      res.status(200).render("blog", {
        verify,
        posts,
        itemPerPage,
        currentPage,
        totalPage,
        user,
        bookmarks,
        category,
        title: "Blog | Unidef.com",
      });
    } else {
      res.status(200).render("blog", {
        posts,
        itemPerPage,
        currentPage,
        totalPage,
        category,
        verify: "failed",
        user: "",
        bookmarks: "",
        title: "Blog | Unidef.com",
      });
    }
  } catch (error) {
    console.log(error);
  }
});

// news page
// TODO: this needs to modify
route.get("/news", async (req, res) => {
  let currentPage = parseInt(req.query.page) || 1;
  let itemPerPage = 30; // how many post i wanted to show

  // find the posts from the database and sort them to show the new post first
  let posts = await Post.find()
    .sort({ _id: -1 }) //sorting the post from new to old
    .skip(itemPerPage * currentPage - itemPerPage) // skip the given values like this=> ((10*1)-1 =0)
    .limit(itemPerPage)
    .setOptions({ allowDiskUse: true })
    .exec(); // showing limited post

  // total page
  let totalPost = await Post.countDocuments();
  let totalPage = Math.ceil(totalPost / itemPerPage);
  let category = await Category.find().sort({ createdAt: -1 });
  try {
    // to get the token everytime and check that is this the new generated token?
    const token = req.cookies.jwt;
    const verify = jwt.verify(token, process.env.JWT_SEKRET_KEY);

    const user = await User.findOne({ _id: verify._id });
    res.status(200).render("news", {
      verify,
      user,
      category,
      posts,
      itemPerPage,
      currentPage,
      totalPage,
      title: "News | Unidef.com",
    });
  } catch (error) {
    res.status(200).render("news", {
      posts,
      category,
      itemPerPage,
      currentPage,
      totalPage,
      verify: "failed",
      title: "News | Unidef.com",
    });
  }
});

// about-us page
route.get("/about-us", async (req, res) => {
  try {
    // to get the token everytime and check that is this the new generated token?
    const token = req.cookies.jwt;

    if (token) {
      const verify = jwt.verify(token, process.env.JWT_SEKRET_KEY);

      const user = await User.findOne({ _id: verify._id });

      res.status(200).render("about-us", {
        verify,
        user,
        category: "",
        title: "About Us | Unidef.com",
      });
    } else {
      res.status(200).render("about-us", {
        verify: "failed",
        category: "",
        title: "About Us | Unidef.com",
      });
    }
  } catch (error) {
    console.log(error);
  }
});

// contact-us page
route.get("/contact-us", async (req, res) => {
  try {
    // to get the token everytime and check that is this the new generated token?
    const token = req.cookies.jwt;
    if (token) {
      const verify = jwt.verify(token, process.env.JWT_SEKRET_KEY);

      const user = await User.findOne({ _id: verify._id });
      res.status(200).render("contact-us", {
        verify,
        user,
        category: "",
        title: "Contact Us | Unidef.com",
      });
    } else {
      res.status(200).render("contact-us", {
        category: "",
        verify: "failed",
        title: "Contact Us | Unidef.com",
      });
    }
  } catch (error) {
    console.log(error);
  }
});

// single post page
route.get("/:postId", async (req, res) => {
  let { postId } = req.params;

  let post = await Post.findById(postId)
    .populate("authore")
    .setOptions({ allowDiskUse: true })
    .exec();

  let posts = []; // for showing 'you might like also' in single pos page and every time show the random posts
  let randomArr = [];
  let content = 8; // how many content i wanted to show
  for (let i = 0; i < content; i++) {
    let random = Math.floor(
      Math.random() * (await Post.find().countDocuments())
    );
    if (random === 0) random = 1; //if random value is '0' then make it '1'
    randomArr.push(random);
  }

  /* checking that is there any duplicate number has in the randomArr. if duplicate value is there then remove that value
   */
  const toFindDuplicates = (arry) =>
    arry.filter((item, index) => arry.indexOf(item) !== index);
  const duplicateElements = toFindDuplicates(randomArr);
  for (let i = 0; i < duplicateElements.length; i++) {
    let index = randomArr.indexOf(duplicateElements[i]);
    randomArr.splice(index, 1);
  }

  // genereting posts for recent post section
  for (let i = 0; i < randomArr.length; i++) {
    posts.push(await Post.find({ siNo: randomArr[i] }).populate("authore"));
  }

  let views = post.views;
  views += 1;
  await Post.findByIdAndUpdate(
    {
      _id: postId,
    },
    {
      $set: {
        views,
      },
    }
  );

  let comments = await Comment.find({ post: postId }).populate("user");

  if (!post) {
    throw new Error("page not found");
  }

  // let bookmarks = [];
  // let profile = await Profile.findOne({ user: req.user._id })
  //     if (profile) {
  //         bookmarks = profile.bookmarks;
  //   }

  let liked = false;
  let totalLikes;
  let verify;
  let user;
  try {
    // to get the token everytime and check that is this the new generated token or not
    const token = req.cookies.jwt;
    if (token) {
      verify = jwt.verify(token, process.env.JWT_SEKRET_KEY);
      user = await User.findOne({ _id: verify._id });
      let isLiked = await Post.findById(postId);

      // if this user id includes in the post likes, then set that the user is already liked the post
      if (isLiked.likes.includes(user._id)) {
        liked = true;
        totalLikes = post.likes.length;
      }
      // if this user id not includes in the post likes, then set that the user is not liked the post
      else {
        liked = false;
        totalLikes = post.likes.length;
      }
    } else {
      liked = false;
      totalLikes = post.likes.length;
    }

    if (verify) {
      res.render("singlePost", {
        verify,
        user,
        post,
        liked,
        totalLikes,
        comments,
        views,
        posts,
        category: "",
        title: post.title,
      });
    } else {
      res.render("singlePost", {
        post,
        liked,
        totalLikes,
        comments,
        views,
        posts,
        verify: "failed",
        user: "",
        category: "",
        title: post.title,
      });
    }
  } catch (error) {
    console.log(error);
  }
});

console.log(chalk.green("main basic user router is connected"));

module.exports = route;
