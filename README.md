# Matcha project

## Description:

  - Matcha is a dating web app that is made with NodeJs, Express Js, Ejs Template Engine/ Material Design Bootstrap, and MySQL.
  
## Installing:

Install the app through the setup page to create automatically the database, steps:

1. **Change database credentials and create database with it's tables - Change project env variables**

    1. Copy and rename the file:
      - cp server/.env.example server/.env
      
    2. Edit File Infos
      - vim server/.env

    3. Edit database credentials:
      - vim server/config/database.js

    4. Edit database credentials:
      - vim server/config/setup.js
    
    5. Allow permission to the project folder and enclosed files:
      - chmod -R 777 .
      
    6. Copy and rename the file:
      - cp client/.env.example client/.env
      
    7. Edit File Infos
      - vim client/.env

**To Run The backend server **
  0. ** cd server folder**
  1. **Install the project dependencies:**
    - In terminal lauch the command: npm install
  2. **Lunch setup page:**
    - In terminal lauch the command: npm run setup
  3. **Run the server:**
     - In terminal lauch the command: npm run dev
     
 **To Run The frontend server **
  0. ** cd client folder**
  1. **Install the project dependencies:**
    - In terminal lauch the command: npm install
  3. **Run the server:**
     - In terminal lauch the command: npm run dev

1. **Authentication**
    - Login page: http://localhost:8080/login
    - Sign up page : http://localhost:8080/signup
        > After signing up you will need to activate you account through email

________________________________________________________________________

## Overall tasks:

- [X] Define tasks: Read the subject and identify the required tasks
- [X] Database: Create database and database tables
- [ ] Frontend: Pages and Design ..
- [ ] Backend: functions, modules and classes ..
- [ ] Testing

### Things to respect:

  - [ ] app must be compatible at least with Firefox (>= 41) and Chrome (>= 46)
  - [X] Relational Database or graph oriented Database (I used Mysql in this project)
  - [X] “micro-framework” has a router, and eventually templating, but no ORM, validators or User Accounts Manager.(Using express)
  - [X] Your website must have a decent layout: at least a header, a main section and a footer.
  - [ ] Your website must be usable on a mobile phone and keep an acceptable layout on small resolutions (Responsive).
  - [ ] Security: storing hashed passwords, protection against injection and bad files uploaded and unprotected js vars

### Major project sections and features:

Part 1:
  - [X] Project structure
  - [X] Authentification (signup & login)
  - [ ] Access Management & Session (token Autorization)
  - [ ] Force user to fill basic required info (Redirect to user profile)
  - [ ] User info and ability to edit them  
    - [X] Edit basic required info : username, email, first name, last name, gender, sexual preference, birthday, bio
    - [ ] Edit password
    - [X] Change pictures max 5 (1 is for profile)
    - [X] Set picture as profile picture
    - [X] Edit interests (tags)
    - [ ] Autocomplete interests (tags)
    - [ ] Locating the position of user automatically
    - [ ] Edit location
  - [ ] User profile: All info except mail and pass
  - [ ] like/like back/unlike profiles 
  - [ ] Block/ unblock user
  - [ ] report user
  - [ ] User statut (online or offline) - see last connected time if offline
  - [ ] fame rating (calculated)
  - [ ] Visits history
  - [ ] Like history

Part 2: 
  - [ ] Chat: real time chat (10 secs max)
  - [ ] Search profiles based on critera
  - [ ] Suggesting profiles based on critera
  - [ ] Notifications: 
    - [ ] New message
    - [ ] The user received a “like”.
    - [ ] The user’s profile has been checked.
    - [ ] The user received a message.
    - [ ] A “liked” user “liked” back.
    - [ ] A connected user “unliked” you.
    - [ ] Blocked user (won't generate notifications)

### Frontend:

  - **Pages (Views) **

    - [X] Sign up
    - [X] Sign in
    - [X] Reset password (Email form)
    - [X] Reset password (new password form)
    - [X] Profile
    - [X] Edit profile (edit infos + update password)
    - [ ] Welcome page (Visits history +  Likes history)
    - [ ] Visits history
    - [ ] Likes history
    - [ ] Suggested profiles Discover people (like or not)
    - [ ] Search
    - [ ] Chat
    - [ ] Notifications

  - **Components**

    - [X] Header (Nav)
      - Non connected user
        - signup
        - signin
      - connected user
        -  Links to : Home, logout, profile, edit profile, search, match, chat
        -  Notifications: Messages , general (connecting , likes, visits ..)
    - [X] Footer

  - **Design** 

    - [ ] Template (Layout & Theme) - Material Design Bootstrap
    - [ ] Responsive

  - **Functions**

    - [ ] Routing
    - [ ] Rendering
    - [ ] Middlewares

### Backend:

  - **Functions**

    - [ ] Validation
    - [ ] Controllers
    - [ ] Models

  - **Modules**

    - [X] DatabaseManager
    - [X] Mailer
    - [X] Validation

### Database:

  - **Tables**

    - [X] users
    - [X] pictures
    - [X] tags
    - [X] reported_users
    - [X] blocked_users
    - [X] liked_profiles
    - [X] visited_profiles
    - [X] notifications
    - [X] conversations
    - [X] messages
    
  - [X] Setup : Create Database, Creates tables if not exists
________________________________________________________________________

### Project details:

  - **Registration**

    - [X] at least an email address, a username, a last name, a first name and a password
    - [X] After the registration, an e-mail with an unique link must be sent to the registered user to verify his account
  
  - **Signing-in** 

    - [X] connect with his/her username and password
    - [X] able to receive an email allowing him/her to re-initialize his/her password in case of forgetting his/her password 
    - [ ] Disconnect with 1 click from any pages on the site.

  - **User profile**

    - [ ] Once connected user must complete his or her profile:
      ◦ [X] The gender.
      ◦ [X] Sexual preferences.
      ◦ [X] A short biography.
      ◦ [ ] A list of interests with tags (ex: #vegan, #geek, #piercing etc...). These tags must be reusable.
      ◦ [X] Pictures, max 5, including 1 as profile picture.
    - [ ] At any time, the user must be able to modify these information, as well as the last name, first name, email and password.
    - [ ] The user should be able to change or reinitialize his password despite been connected or not.
    - [ ] The user must be able to check who visited his/her profile as well as who “liked” him/her.
    - [ ] The user must have a public “fame rating”:
      ◦ Up to you to define what “fame rating” means as long as your criteria are consistent
    - [ ] The user must be located using GPS positioning, up to his/her neighborhood. If the user does not want to be positioned, you must find a way to locate him/her even without his/her consent.2 The user must be able to modify his/her position in his/her profile.


  - **Matching**

    - [ ] The user must be able to easily get a list of suggestions that match his/her profile
    - [ ] The user can see this page only if he/she fill his profile
    - You will only propose “interesting” profiles for example, only men for a heterosexual girls.
      - You must manage bisexuality. If the orientation isn’t specified, the user will be considered bi-sexual by default.
      - You must match profiles based on (in priority):
          - Sexual orientation
          - Close geographic area as the user.
          - With a maximum of common tags. 
          - With their “fame rating”.
      - The list must be sortable by age, location, “fame rating” and common tags.
      - The list must be filterable by age, location, “fame rating” and common tags.

  - **Search**

    [ ] The user must be able to run an advanced research selecting one or a few criterias such as:
      - A age gap.
      - A “fame rating” gap.
      - A location.
      - One or multiple interests tags.
    As per the suggestion list, the resulting list must be sortable and filterable by age, location, “fame rating” and tags.
      - A blocked user should not appear in the search.

  - **Profile of other users**

    - [ ] A user must be able to consult the profile of other users. Profiles must contain all the information available about them, except for the email address and the password.
    - [ ] When a user consults a profile, it must appear in his/her visit history.
    - [ ] The user must also be able to:
      - Like or Unlike the another user profile if this one has at least one picture.
      - See if the other user has already liked the user and like him back.
      - Check the “fame rating”.
      - See if the user is online, and if not see the date and time of the last connection.
      When two people “like” each other, we will say that they are “connected” and are now able to chat.
      If the current user does not have a picture, he/she cannot complete this action.
      - [ ] Report the user as a “fake account”.
      - [ ] Block the user. A blocked user won’t appear anymore in the research results and won’t generate additional notifications.

    - [ ] A user can clearly see if the consulted profile is connected or “like” his/her profile and
    must be able to “unlike” or be disconnected from that profile.

  - **Chat**

    - [ ] When two users are connected,(Meaning they “like” each other.) they must be able to “chat” in real time.(We’ll tolerate a 10 secondes delay.) How you will implement the chat is totally up to you. The user must be able to see from any page if a new message is received.

  - **Notifications**

    - [ ] A user must be notified in real time(We’ll also tolerate a 10 secondes delay.) of the following events:

      - [ ] The user received a “like”.
      - [ ] The user’s profile has been visited.
      - [ ] The user received a message.
      - [ ] A “liked” user “liked” back.
      - [ ] A connected user “unliked” you.

    - [ ] A user must be able to see, from any page that a notification hasn’t been read.

