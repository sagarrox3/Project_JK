Blog Application Documentation

Project Overview
This project is a blog application built using NestJS for the backend and React for the frontend. The app allows users to log in using their Google or Facebook account, create and manage posts, and view post details. It includes authentication via JWT tokens, CRUD operations for blog posts, and uses Terraform for deployment to AWS.

Backend (NestJS)
Folder Structure:
src/auth: Contains authentication-related files like login, JWT generation, and guards.

auth.controller.ts: Handles authentication requests.
1.Imports
AuthService: This service contains the logic for user validation and generating JWT tokens for authenticated users.
UsersService: This service is used to manage user data, such as finding or creating users in the database.
OAuth2Client: From the google-auth-library, this is used to verify the Google ID token that the frontend sends after a successful login.

2. Controller Definition
The AuthController class has a single POST route (/auth/login/google) which handles the Google login functionality.

3. Constructor
The constructor injects the AuthService and UsersService to handle user validation and authentication operations.

4. login Method
Accepts a Google ID token: The frontend will send the token received from Google’s OAuth2 process.
Verifies the Google ID Token:
It uses the OAuth2Client to verify the ID token.
If the token is invalid, it throws an UnauthorizedException.
Extracts User Data: It extracts the user payload from the token using ticket.getPayload().
If no payload is found, it throws an UnauthorizedException indicating the token is invalid.
Validates the User: The authService.validateUser() method checks whether the user exists or needs to be created.
If no user is found, it throws an UnauthorizedException.
Generates a JWT: If the user is valid, it calls authService.login(user) to generate and return the JWT that will be used for subsequent authenticated requests.

5. Error Handling
UnauthorizedException: Thrown when something goes wrong, like an invalid token or missing user. This ensures that only valid requests are processed.

auth.service.ts: Manages authentication logic (Google).
1. Imports
JwtService: From @nestjs/jwt, this service is used to generate the JWT.
UsersService: This service interacts with the user model to manage user data, such as finding or creating users.

2. Constructor
The constructor injects two services:
usersService: Handles interactions with user data.
jwtService: Used to create JWT tokens for authenticated users.

3. validateUser Method
This method validates the user based on the information provided in the payload (received from Google):
email, name, sub, picUrl: The payload contains the user’s email, name, Google ID (sub), and profile picture URL.
Find the user: The method calls usersService.findByEmail() to check if the user already exists in the database.
Create the user if not found: If no user is found, it calls usersService.createUser() to create a new user in the database with the details from the Google payload.
Verify Google ID: If the user is found, it checks if the googleId matches the sub (Google ID) in the payload.
If the Google ID is correct, the user is returned.
If the Google ID doesn’t match or the user is invalid, it throws an UnauthorizedException.

4. login Method
This method generates a JWT for the authenticated user:
Payload: The JWT payload contains the user's email and _id (user ID from the database).
JWT Generation: The JWT is created using this.jwtService.sign(payload).
Response: The method returns the access_token (JWT) and the user object, which can be used for authentication in future requests.


jwt-auth.guard.ts: Guards for protected routes.
The JwtAuthGuard is a custom authentication guard in NestJS that extends the built-in AuthGuard from the @nestjs/passport package. It uses JWT authentication to protect certain routes in your application, ensuring that only authenticated users can access them. Here's a detailed breakdown:
1. Imports
CanActivate: An interface used to define guards in NestJS. It has a canActivate method that checks whether a route can be accessed.
ExecutionContext: Provides context about the current request, including information like the request, response, and handler.
UnauthorizedException: A custom exception used to indicate when a user is not authenticated.
AuthGuard: A NestJS guard for handling authentication strategies. The jwt strategy is used here.


2. JwtAuthGuard Class
This class extends AuthGuard('jwt') to use the JWT strategy for authentication.
canActivate Method
Purpose: This method is called to determine whether the route can be accessed.
super.canActivate(context): The method calls the canActivate method of the parent AuthGuard. This ensures that the default JWT authentication logic is executed (i.e., the token is verified and decoded).
Returns: It returns the result of the canActivate method, which is a boolean or a promise of a boolean. If true, the route is accessible; otherwise, the request is denied.

handleRequest Method
Purpose: This method is used to handle the user after the authentication process has completed. It will be called after the JWT token is successfully verified.
Parameters:
err: If an error occurs during the authentication process (e.g., invalid token), this will be set.
user: The authenticated user (if the token is valid).
info: Any additional information (usually about errors during the authentication process).
context: Provides context about the current request.

Error Handling:
If an error (err) or no user is found (!user), an UnauthorizedException is thrown with the message 'User not authenticated!!'.
If everything is valid, the user is returned, allowing the request to proceed.

jwt.strategy.ts: Strategy to validate JWT.
1. Imports
Injectable: A decorator that marks the class as a provider, allowing it to be injected into other classes (like controllers or services).
ConfigService: A service provided by NestJS that retrieves environment variables or configuration settings (e.g., the JWT secret).
PassportStrategy: A NestJS class that facilitates the integration of Passport strategies. By extending this, you create a custom Passport strategy.
ExtractJwt and Strategy: These come from the passport-jwt package. ExtractJwt provides utility methods to extract the JWT from a request, and Strategy is the base strategy that Passport uses for JWT authentication.

2. JwtStrategy Class
This class is the core of the JWT-based authentication system.
Constructor
configService: Injects the ConfigService to retrieve configuration values such as the JWT secret key.
super(): Calls the constructor of PassportStrategy(Strategy). This is where the JWT strategy is configured.
jwtFromRequest: Specifies how to extract the JWT token from the request. Here, ExtractJwt.fromAuthHeaderAsBearerToken() extracts the token from the Authorization header, which should follow the format Bearer <JWT>.
ignoreExpiration: If set to false, the expiration of the JWT will be validated.
secretOrKey: The secret key used to sign and verify the JWT. This is fetched from the ConfigService, typically from an environment variable.
validate Method
Purpose: This method is called after the JWT token is successfully extracted and decoded.
Parameters:
payload: The decoded JWT payload, which contains the data that was included in the token (like sub, email, etc.).
Return Value:
The validate method returns the user's information (in this case, the userId and email).
This return value will be attached to the request object and made available for the route handler. This ensures that the user details are accessible in subsequent parts of the application (e.g., in controllers).

src/controller: Handles the main logic for blog and user-related routes.

blogs.controller.ts: Routes for CRUD operations on blogs.

1. Imports
Controller: A decorator that defines the class as a controller to handle requests.
Get, Post, Put, Delete: Decorators that handle HTTP GET, POST, PUT, and DELETE requests, respectively.
Body, Param, Req: Decorators used to access request data like the body, parameters, and request object.
UseGuards: A decorator used to apply guards (in this case, the JwtAuthGuard) to specific routes.
Request: The Express request object, used to access request data.
JwtAuthGuard: Custom guard that checks if the user is authenticated via JWT token.
BlogDTO: A Data Transfer Object (DTO) used for validating and typing blog-related data.
Blog: The blog model representing the MongoDB schema.
BlogsService: A service that contains the business logic for handling blog operations.

2. BlogsController Class
This class defines the routes and their corresponding handler methods for managing blogs.
Constructor
The constructor injects the BlogsService that will handle the actual data operations (e.g., fetching, creating, updating, deleting blogs).
Route Handlers

@Get() - Get All Blogs
Path: /blogs
Description: Retrieves all blogs from the database.
Method: getAllBlogs(@Req() req: Request)
Logic: Calls findAll() method from the BlogsService to fetch all blog posts.

@Get(':id') - Get a Single Blog
Path: /blogs/:id
Description: Retrieves a specific blog based on its id.
Method: getBlog(@Param('id') id: string)
Logic: Calls findOne(id) from the BlogsService to fetch a specific blog by id.

@UseGuards(JwtAuthGuard) @Post() - Create a New Blog
Path: /blogs
Description: Allows authenticated users to create a new blog post.
Method: createBlog(@Body() body: BlogDTO, @Req() req: any)


Logic:
The JwtAuthGuard ensures that the user is authenticated before they can create a blog.
Calls create(title, content, userId, tags) from BlogsService to create a new blog post.
The userId is extracted from the authenticated user (req.user.userId), ensuring that the blog post is associated with the logged-in user.

@UseGuards(JwtAuthGuard) @Put(':id') - Update an Existing Blog
Path: /blogs/:id
Description: Allows authenticated users to update an existing blog post.
Method: updateBlog(@Param('id') id: string, @Body() updateData: Partial<Blog>)
Logic:
The JwtAuthGuard ensures the user is authenticated before updating the blog.
Calls update(id, updateData) from BlogsService to update the blog post with the given id and data.

@UseGuards(JwtAuthGuard) @Delete(':id') - Delete a Blog
Path: /blogs/:id
Description: Allows authenticated users to delete a specific blog post.
Method: deleteBlog(@Param('id') id: string)
Logic:
The JwtAuthGuard ensures that the user is authenticated before deleting a blog.
Calls delete(id) from BlogsService to delete the blog post with the specified id.


users.controller.ts: User-related routes (currently not detailed).

1. Imports
Controller: A decorator that defines the class as a NestJS controller responsible for handling HTTP requests.
Get, Post, Param, Body, UseGuards: Decorators used for HTTP operations (GET, POST) and to access route parameters (@Param) and request body (@Body). @UseGuards is used for applying guards (in this case, JwtAuthGuard).
User: The user model representing the user schema in MongoDB.
UsersService: The service that handles the business logic related to user management (e.g., finding all users, finding a specific user).
JwtAuthGuard: A guard that ensures the route is protected and that only authenticated users can access it.

2. UsersController Class
This class defines the routes related to user operations. It is designed to interact with the UsersService to handle user-related functionality.


Constructor
The constructor injects the UsersService to perform the business logic related to user operations.
Route Handlers

@UseGuards(JwtAuthGuard) @Get() - Get All Users
Path: /users
Description: Retrieves all users from the database.
Method: getAllUsers()
Logic:
The JwtAuthGuard ensures that only authenticated users can access this route.
Calls the findAll() method from the UsersService to fetch all users from the database.

@UseGuards(JwtAuthGuard) @Get(':id') - Get a Single User by ID
Path: /users/:id
Description: Retrieves a specific user based on their id.
Method: getUser(@Param('id') id: string)
Logic:
The JwtAuthGuard ensures that only authenticated users can access this route.
Calls the findOne(id) method from the UsersService to fetch the user data associated with the specified id.


src/dto: Contains Data Transfer Objects for request validation.
blog.dto.ts: DTO for blog operations.
user.dto.ts: DTO for user-related operations.

src/models: Defines schema for MongoDB models.
blog.schema.ts: Schema for the blog posts.
user.schema.ts: Schema for users.

src/service: Contains business logic for handling data and operations.
blogs.service.ts: Logic to manage blog data.

1. Imports

HttpException, HttpStatus, Injectable:
HttpException is used to throw HTTP errors with custom status codes and messages.
HttpStatus provides various HTTP status codes like NOT_FOUND, OK, etc.
Injectable marks this service as a provider that can be injected into other components in the NestJS framework.

InjectModel:
A decorator that allows the injection of Mongoose models into the service.

Model:
A Mongoose Model used to interact with the MongoDB collections for Blog and User.
Blog, BlogDocument:
These are the Mongoose model and document types for the Blog collection.
User, UserDocument:
These are the Mongoose model and document types for the User collection.

2. Constructor
The constructor is used to inject Mongoose models for the Blog and User collections, allowing the service to interact with the database.

3. Service Methods
async findAll() - Get All Blogs
Description: Retrieves all blog posts from the database.
Logic:
Uses the blogModel to fetch all blog documents from the Blog collection.
Returns a response with a code (indicating success), a message, the totalCount of blogs, and the blogs array.

async findOne(id: string) - Get a Single Blog by ID

Description: Fetches a blog post by its id.
Logic:
Uses blogModel.findById(id) to find a blog by its unique identifier.
If the blog is not found, an HttpException with a NOT_FOUND status is thrown.
Returns a response with a success message and the blog data.

async create(title: string, content: string, authorId: string, tags: string[]) - Create a New Blog Post

Description: Creates a new blog post and associates it with an author.
Logic:
The blogModel.create() method is used to create a new blog post with the provided title, content, tags, and authorId.
After creating the blog, the author's document is updated with the blog's ID using the $push operator to associate the blog with the user in the blogs array.
Returns a response with a success message and the newly created blog data.

async update(id: string, updateData: Partial<Blog>) - Update an Existing Blog

Description: Updates an existing blog post with the provided data.
Logic:
Uses blogModel.findByIdAndUpdate(id, updateData, { new: true }) to update the blog post with the new data.
If the blog is not found, an HttpException with a NOT_FOUND status is thrown.
Returns a response with a success message and the updated blog data.



async delete(id: string) - Delete a Blog Post

Description: Deletes a blog post by its id.
Logic:
Uses blogModel.findByIdAndDelete(id) to delete the blog post.
If the blog is not found, an HttpException with a NOT_FOUND status is thrown.
Returns a response with a success message and the deleted blog data.


users.service.ts: Handles user-related data and operations.

1. Imports
ConflictException, Injectable:
ConflictException is used to throw an HTTP exception when there is a conflict (e.g., duplicate email).
Injectable marks this service as a provider that can be injected into other components.

User, UserDocument:
These represent the Mongoose model and document types for the User collection.
InjectModel:
A decorator to inject the Mongoose model into the service for interacting with the User collection.
Model:
A Mongoose Model used to interact with the MongoDB User collection.

2. Constructor
The constructor is used to inject the Mongoose model for the User collection, which allows the service to interact with the database for user-related operations.

3. Service Methods
async findAll() - Get All Users
Description: Retrieves all users from the database.
Logic: Uses userModel.find() to fetch all users.
Returns a list of all users.

async findOne(id: string) - Get User by ID
Description: Fetches a user by its unique id.
Logic: Uses userModel.findById(id) to find a user document by its id.
Returns the user with the specified ID.

async createUser(email: string, name: string, googleId: string, picUrl: string) - Create a New User
Description: Creates a new user if the email doesn't already exist.
Logic:
First, it checks if a user already exists with the given email by calling userModel.findOne({ email }).
If the email already exists, a ConflictException is thrown with the message "Email already exists".
If no existing user is found, the user is created using userModel.create() with the provided name, email, googleId, and picUrl. Returns the newly created user.


async findByEmail(email: string) - Find User by Email
Description: Searches for a user by email and excludes certain fields from the result.
Logic:
Uses userModel.findOne({ email }) to find a user by their email.
The .select('-blogs -__v -createdAt -updatedAt') portion excludes the blogs, __v, createdAt, and updatedAt fields from the result.
Returns the user found by email.
4. Error Handling
ConflictException:
In the createUser() method, if a user with the same email already exists, a ConflictException is thrown, preventing the creation of a duplicate user.

5. Return Structure

findAll():
Returns an array of all users in the system.
findOne(id: string):
Returns the user document with the specified ID.

createUser():
Returns the newly created user object.
findByEmail(email: string):
Returns the user document found by the provided email, with some fields excluded.

src/app.module.ts: Main application module that imports other modules.
1. Imports
ConfigModule.forRoot():
Initializes the configuration module, making the environment variables available globally across the application.
The envFilePath: '.env' option specifies the path to the .env file where environment variables are stored.
MongooseModule.forRoot(process.env.MONGODB_HOST):
Sets up the connection to MongoDB using Mongoose.
process.env.MONGODB_HOST gets the MongoDB connection URI from the environment variables, ensuring flexibility across environments.
UsersModule, BlogsModule, AuthModule:
These modules are imported to manage the user, blog, and authentication functionalities within the application.
Each module is responsible for a specific area of functionality and can be reused and maintained independently.

2. Controllers
AppController:
The main controller for your app, usually serving as the entry point for basic routes and other generic endpoints.
ServiceController:
A controller responsible for handling specific service-related routes, likely related to the Service functionality in the provider/service/service.controller.ts.

3. Providers
AppService:
A service that can be injected into controllers or other providers to provide core business logic or shared functionality. It could be used by AppController to manage application-wide operations.

4. Module Configuration
The @Module() decorator is used to define the root module.
imports: Lists all the modules that are required to run the application (configuration, MongoDB connection, and other feature modules).
controllers: Defines all the controllers that will handle HTTP requests.
providers: Lists all the providers (services, repositories, etc.) that will be used for business logic and can be injected into controllers or other services.


src/main.ts: Entry point for the application.
src/exception.filter.ts: Custom exception filter for error handling.

APIs:
/login: Authenticates the user via Google or Facebook and returns a JWT.
/posts:
GET: Fetch all posts.
POST: Create a new post.
PUT: Update an existing post.
DELETE: Delete a post.

Frontend (React)

Folder Structure:

src/components: Contains React components for the UI.

LoginComponent.js: Displays the login UI with Google/Facebook authentication options.
·  Imports necessary hooks and libraries:
·  useDispatch and useSelector from Redux for dispatching actions and accessing authentication state.
GoogleLogin from @react-oauth/google for Google OAuth authentication.
useNavigate from react-router-dom for navigation.
·  Defines the LoginForm component:
·  Extracts loading and error from the Redux auth state.
On Google login success, dispatches loginWithGoogle with the Google credential and navigates to the home page ('/').
On Google login failure, logs an error.
·  Renders the login UI:
·  Displays a Google login button with the onSuccess and onError handlers.
Shows an error message if login fails.




HomeComponent.js: Displays a list of posts.

Fetch Blogs on Mount:
Uses useEffect to dispatch fetchBlogs() when the component loads.
dispatch(fetchBlogs()) retrieves blogs from the backend via Redux actions.

Retrieve Blogs from Redux Store:
useSelector(state => state.blog.blogs) extracts the list of blogs from the Redux state.
Uses to ensure it defaults to an empty array if blogs is undefined.

Render the UI:
Displays a welcome message.
Renders BlogList, passing the fetched blogs as props.

CreateBlog.js: Allows the creation of new posts.
·  Authentication Check:
·  Uses useSelector to check if the user is authenticated (state.auth.isAuthenticated).
If not authenticated, it displays a message: "You must be logged in to create a post."
·  Form Handling:
·  Manages form state (title, content, tags) using useState.
Updates state on user input via handleChange().
On submission, dispatches createBlog(formData) to Redux and resets the form.
·  Submit Button Control:
·  Uses useRef (submitRef) to disable the button while submitting to prevent multiple clicks.
·  Styled UI:
·  A visually appealing form with hover effects, responsive layout, and smooth transitions.


BlogInfo.js: Displays details of a selected post.
·  Props Handling:
·  Accepts title, content, tags, and author as props.
Renders the blog's title, content, and author information.
·  Tag Rendering:
·  Maps through tags and displays each tag as #tag.
Uses key={index} to ensure unique keys for list items.
·  Styled UI (BlogInfo.css):
·  Uses CSS classes (blog-title, blog-content, etc.) for styling.

Header.js: Contains the header for the site with navigation links.
src/redux: State management using Redux.
actions: Defines actions for managing state (login, logout, post CRUD).
slices: Contains Redux slices to manage posts and authentication.
store.js: Sets up the Redux store.
src/utils/axiosConfig.js: Configures axios for making API requests, including setting the JWT token for authenticated requests.

Frontend Routes:
/home: Displays a list of blogs.
/create: Allows the creation of a new post.
/blog/:id: Shows details for a specific blog post.
/login: Google/Facebook login page.
/logout: Logs out the user.

Authentication Flow
Login: Users can log in using their Google or Facebook account via the frontend. Upon successful login, a JWT token is received.

import { GoogleLogin } from "@react-oauth/google";

localStorage.setItem("token", credential);


JWT Authentication: The token is stored in local storage and used for all subsequent authenticated requests to the backend (e.g., creating, fetching posts).

router.post("/google-login", async (req, res) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  res.json({ token });
});


Token Validation: The backend validates the JWT token using PassportJS and the JWT strategy before granting access to protected routes.


passport.authenticate("jwt", { session: false }, (err, user) => {
  if (!user) return res.status(401).json({ message: "Unauthorized" });
  req.user = user;
  next();
});


Deployment (Terraform, Docker, AWS)
Docker: Each component (frontend and backend) is containerized using Docker to ensure consistency across different environments.
AWS ECR: The Docker images are pushed to AWS Elastic Container Registry (ECR) for easy retrieval during deployment.
AWS EKS: The application is deployed to AWS Elastic Kubernetes Service (EKS) for efficient scaling and management.
Terraform: Terraform is used to automate the creation and configuration of AWS resources (ECR, EKS, etc.) for seamless deployment.

Unit & Integration Tests
Unit Tests: Ensure that individual functions (e.g., authentication, post CRUD operations) work correctly.
Integration Tests: Test the interaction between different parts of the system, ensuring that the frontend can successfully communicate with the backend and display correct data.

Future Improvements
Role-based Access Control (RBAC)
Commenting System for Posts
Post Categories/Tags
Image Uploads for Posts
Search Functionality
Pagination and Infinite Scroll
Email Notifications and Social Sharing
API Rate Limiting

Conclusion
This simple blog application leverages modern technologies like NestJS, React, and AWS for scalable, secure, and interactive web applications. It supports Google and Facebook authentication, providing a seamless user experience, while enabling easy deployment with Terraform, Docker, and AWS.
