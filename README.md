# Blog Website

This is a blog website built using Node.js, Express.js, JWT, Mongoose, Multer, Sharp, EJS, Bcrypt, JavaScript, and SCSS. The website has the ability to login, logout, register users, create, update and delete blogs, update user profile and password hashing. The website also uses JWT tokens for user authentication and authorization.

## Requirements

To run this application, you need to have the following installed:

- Node.js
- MongoDB

You can install these dependencies using the following command:\
`npm install`

## Usage

To run the application, navigate to the root directory and execute the following command:\
`npm start`\
This will start the Node.js server on [http://localhost:3000/](http://localhost:3000). You can then open this URL in your web browser to access the blog website.

## Features

The blog website has the following features:\

- User Registration: Users can register for the website by providing their name, address, email address, and password. The website checks whether a user already exists with the same email address before allowing registration.

- User Login: Registered users can log in to the website using their email address and password.

- Password Hashing: Passwords are hashed and salted using Bcrypt to ensure secure storage in the database.

- Validity Check: The website checks the validity of the user credentials and JWT token to ensure that they are authentic.

- Error Handling: The website provides error handling for invalid form submissions and displays appropriate error messages to the user.

- User Authentication and Authorization: The website uses JWT tokens to authenticate and authorize users to access certain resources such as creating, updating, and deleting blogs.

- Session Management: The website uses JWT tokens and cookies to manage user sessions and keep them logged in across different pages.

- Blog Creation: Authenticated users can create new blog posts by providing a title, description, categorie, tags and image. The website also resizes and compresses uploaded images using Sharp and Multer.

- Blog Update and Delete: Authenticated users can update and delete their own blog posts.

- User Profile Update: Authenticated users can update their name, email address, and password.

## Conclusion

This blog website provides a complete and secure solution for creating, updating and deleting blog posts. It also provides user authentication and authorization using JWT tokens, password hashing using Bcrypt, and session management using cookies. The website also includes image processing using Sharp and Multer for resizing and compressing uploaded images. Feel free to use this code as a starting point for your own projects.

## Technologies

The blog website is built using the following technologies:

- Node.js: A server-side JavaScript runtime environment for building scalable web applications.

- Express.js: A popular web framework for Node.js that provides a robust set of features for building web applications.

- JWT: JSON Web Tokens are a secure way to transmit information between parties. In this case, JWT is used for user authentication and authorization.

- Mongoose: A Node.js Object Data Modeling (ODM) library that provides a simple way to interact with MongoDB.

- Multer: A Node.js middleware for handling multipart/form-data, which is primarily used for uploading files.

- Sharp: A Node.js module for processing and resizing images.

- EJS: Embedded JavaScript templates for rendering dynamic content on the server-side.

- Bcrypt: A popular password hashing function used for securely storing passwords in the database.

- JavaScript: A programming language used for building web applications.

- SCSS: A CSS preprocessor that extends the capabilities of CSS and makes styling easier and more efficient.

## Contribution

Feel free to fork the repository and contribute to this project by submitting a pull request. Any contributions, whether they are bug fixes or new features, are greatly appreciated!

## Licensing

This project has no License.

## Contact

If you have any questions or suggestions, feel free to contact me at [mdp020479@gmail.com](mailto:mdp020479@gmail.com)
