# Matcha project

## Description:

  - Matcha is a dating web app made with NodeJs, Express Js, Ejs Template Engine/ Material Design Bootstrap, and MySQL.
  - This project is part of the 1337 Khouribga Curriculum.
  - Goals: Micro-framework - Advanced User Accounts - real time chat - Geolocalisation - Security / Data Validation
  
- **Installation**

  - Follow this [instructions](how-to-install.md)

- **To Run The backend server**

  **cd Project folder and run the script ./startServer.sh**
  
  This will install the project dependencies, lunch setup to create Database, Fill The DB with fake data then run the server.
     
- **To Run The frontend server**

  **cd Project folder and run the script ./startClient.sh**
  
  This will install the project dependencies then run the server.

- **Authentication**

    - Login page: http://localhost:8080/login
    
    - Sign up page : http://localhost:8080/signup
    
        > After signing up you will need to activate you account through email
    
________________________________________________________________________

### Project details:

  - **Registration**

    - [X] at least an email address, a username, a last name, a first name and a password
    - [X] After the registration, an e-mail with an unique link must be sent to the registered user to verify his account
    
    ![Alt text](screenshots/signup.png?raw=true "SignUP")
  
  - **Signing-in** 

    - [X] connect with his/her username and password
    - [X] able to receive an email allowing him/her to re-initialize his/her password in case of forgetting his/her password 
    - [X] Disconnect with 1 click from any pages on the site.
    
    ![Alt text](screenshots/login.png?raw=true "Login")

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
    - [X] The user must be located using GPS positioning, up to his/her neighborhood. If the user does not want to be positioned, you must find a way to locate him/her even without his/her consent.
    - [X] The user must be able to modify his/her position in his/her profile.
    
    ![Alt text](screenshots/edit-profile.png?raw=true "Edit Profile")
    ![Alt text](screenshots/edit-basic.png?raw=true "Edit Basic Infos")
    ![Alt text](screenshots/edit-pass.png?raw=true "Edit Password")
    ![Alt text](screenshots/edit-profilepic.png?raw=true "Edit Profile Picture")
    ![Alt text](screenshots/edit-pics.png?raw=true "Edit Other pics")
    ![Alt text](screenshots/edit-tags.png?raw=true "Edit Tags")
    ![Alt text](screenshots/edit-tags3.png?raw=true "Edit Tags")
    ![Alt text](screenshots/edit-location.png?raw=true "Edit Location")
    - Home Page:
    ![Alt text](screenshots/home.png?raw=true "Home")

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
      
      ![Alt text](screenshots/browse2.png?raw=true "Matching Users")

  - **Search**

    [X] The user must be able to run an advanced research selecting one or a few criterias such as:
      - A age gap.
      - A “fame rating” gap.
      - A location.
      - One or multiple interests tags.
    As per the suggestion list, the resulting list must be sortable and filterable by age, location, “fame rating” and tags.
      - A blocked user should not appear in the search.
      
      ![Alt text](screenshots/search.png?raw=true "Search Users")

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
    
    ![Alt text](screenshots/profileview.png?raw=true "Profile View")

  - **Chat**

    - [X] When two users are connected,(Meaning they “like” each other.) they must be able to “chat” in real time.(We’ll tolerate a 10 secondes delay.) How you will implement the chat is totally up to you. The user must be able to see from any page if a new message is received.
    
    ![Alt text](screenshots/chat.png?raw=true "Chat")
    ![Alt text](screenshots/chat1.png?raw=true "Chat")
    ![Alt text](screenshots/chat2.png?raw=true "Chat")

  - **Notifications**

    - [X] A user must be notified in real time(We’ll also tolerate a 10 secondes delay.) of the following events:

      - [X] The user received a “like”.
      - [X] The user’s profile has been visited.
      - [X] The user received a message.
      - [X] A “liked” user “liked” back.
      - [X] A connected user “unliked” you.

    - [X] A user must be able to see, from any page that a notification hasn’t been read.
    
    ![Alt text](screenshots/notification.png?raw=true "Notification")
    
 - **Delete Reported Users By an admin**

    - [X] A admin can view and delete a reported user
    
    ![Alt text](screenshots/reported.png?raw=true "Reported Users")

    - **Links**
    For sorting array of objects with mutiple option
    https://stackoverflow.com/questions/6913512/how-to-sort-an-array-of-objects-by-multiple-fields

