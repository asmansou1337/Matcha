# Matcha project

## Description:

  - Matcha is a dating web app that is made with NodeJs, Express Js, Ejs Template Engine/ Material Design Bootstrap, and MySQL.

** To Run The backend server **
  0. ** cd server folder**
  1. **Install the project dependencies:**
    - In terminal lauch the command: npm install
  2. **Lunch setup:**
    - In terminal lauch the command: npm run setup
  3. **Fill The DB with fake data:**
    - In terminal lauch the command: npm run seed
  3. **Run the server:**
     - In terminal lauch the command: npm run dev
     
** To Run The frontend server **
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
- [X] Frontend: Pages and Design ..
- [X] Backend: functions, modules and classes ..
- [ ] Testing

### Things to respect:

  - [ ] app must be compatible at least with Firefox (>= 41) and Chrome (>= 46)
  - [X] Relational Database or graph oriented Database (I used Mysql in this project)
  - [X] “micro-framework” has a router, and eventually templating, but no ORM, validators or User Accounts Manager.(Using express)
  - [X] Your website must have a decent layout: at least a header, a main section and a footer.
  - [X] Your website must be usable on a mobile phone and keep an acceptable layout on small resolutions (Responsive).
  - [X] Security: storing hashed passwords, protection against injection and bad files uploaded and unprotected js vars

### Major project sections and features:

Part 1:
  - [X] Project structure
  - [X] Authentification (signup & login)
  - [X] Access Management & Session (token Autorization)
  - [X] Force user to fill basic required info (Redirect to user profile)
  - [X] User info and ability to edit them  
    - [X] Edit basic required info : username, email, first name, last name, gender, sexual preference, birthday, bio
    - [X] Edit password
    - [X] Change pictures max 5 (1 is for profile)
    - [X] Set picture as profile picture
    - [X] Edit interests (tags)
    - [X] Autocomplete interests (tags)
    - [X] Locating the position of user automatically
    - [X] Edit location
  - [X] User profile: All info except mail and pass
  - [X] like/like back/unlike profiles 
  - [X] Block/ unblock user
  - [X] report user
  - [X] User statut (online or offline) - see last connected time if offline
  - [X] fame rating (calculated)
  - [X] Visits history
  - [X] Like history

Part 2: 
  - [ ] Chat: real time chat (10 secs max)
  - [X] Search profiles based on critera
  - [X] Suggesting profiles based on critera
  - [X] Notifications: 
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
    - [X] Welcome page (Visits history +  Likes history)
    - [X] Visits history
    - [X] Likes history
    - [X] Suggested profiles Discover people (like or not)
    - [X] Search
    - [X] Chat
    - [X] Notifications

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

    - [X] Template (Layout & Theme) - Material Design Bootstrap
    - [X] Responsive

  - **Functions**

    - [X] Routing
    - [X] Rendering
    - [X] Middlewares

### Backend:

  - **Functions**

    - [X] Validation
    - [X] Controllers
    - [X] Models

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
    - [X] Disconnect with 1 click from any pages on the site.

  - **User profile**

    - [X] Once connected user must complete his or her profile:
      ◦ [X] The gender.
      ◦ [X] Sexual preferences.
      ◦ [X] A short biography.
      ◦ [X] A list of interests with tags (ex: #vegan, #geek, #piercing etc...). These tags must be reusable.
      ◦ [X] Pictures, max 5, including 1 as profile picture.
    - [X] At any time, the user must be able to modify these information, as well as the last name, first name, email and password.
    - [X] The user should be able to change or reinitialize his password despite been connected or not.
    - [X] The user must be able to check who visited his/her profile as well as who “liked” him/her.
    - [X] The user must have a public “fame rating”:
      ◦ Up to you to define what “fame rating” means as long as your criteria are consistent
    - [X] The user must be located using GPS positioning, up to his/her neighborhood. If the user does not want to be positioned, you must find a way to locate him/her even without his/her consent.2 The user must be able to modify his/her position in his/her profile.


  - **Matching**

    - [X] The user must be able to easily get a list of suggestions that match his/her profile
    - [X] The user can see this page only if he/she fill his profile
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

    [X] The user must be able to run an advanced research selecting one or a few criterias such as:
      - A age gap.
      - A “fame rating” gap.
      - A location.
      - One or multiple interests tags.
    As per the suggestion list, the resulting list must be sortable and filterable by age, location, “fame rating” and tags.
      - A blocked user should not appear in the search.

  - **Profile of other users**

    - [X] A user must be able to consult the profile of other users. Profiles must contain all the information available about them, except for the email address and the password.
    - [X] When a user consults a profile, it must appear in his/her visit history.
    - [X] The user must also be able to:
      - [X] Like or Unlike the another user profile if this one has at least one picture.
      - [X] See if the other user has already liked the user and like him back.
      - [X] Check the “fame rating”.
      - [X] See if the user is online, and if not see the date and time of the last connection.
      When two people “like” each other, we will say that they are “connected” and are now able to chat.
      If the current user does not have a picture, he/she cannot complete this action.
      - [X] Report the user as a “fake account”.
      - [X] Block the user. A blocked user won’t appear anymore in the research results and won’t generate additional notifications.

    - [X] A user can clearly see if the consulted profile is connected or “like” his/her profile and
    must be able to “unlike” or be disconnected from that profile.

  - **Chat**

    - [ ] When two users are connected,(Meaning they “like” each other.) they must be able to “chat” in real time.(We’ll tolerate a 10 secondes delay.) How you will implement the chat is totally up to you. The user must be able to see from any page if a new message is received.

  - **Notifications**

    - [ ] A user must be notified in real time(We’ll also tolerate a 10 secondes delay.) of the following events:

      - [X] The user received a “like”.
      - [X] The user’s profile has been visited.
      - [ ] The user received a message.
      - [X] A “liked” user “liked” back.
      - [X] A connected user “unliked” you.

    - [X] A user must be able to see, from any page that a notification hasn’t been read.

    - **Links**
    For sorting array of objects with mutiple option
    https://stackoverflow.com/questions/6913512/how-to-sort-an-array-of-objects-by-multiple-fields

