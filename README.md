# Threadly

## Project goals

reposnive image

Threadly is designed to be a content sharing platform, users are able to interact with a multitude of content from various niche channel.

# Table of Contents

1. [Threadly](#threadly)
   1. [Project goals](#project-goals)
   2. [Table of contents](#table-of-contents)
   3. [User Stories](#user-stories)
      1. [User](#user)
      2. [Profile](#profile)
      3. [Channel](#channel)
      4. [ChannelFollower](#channelfollower)
      5. [Post](#post)
      6. [Comment](#comment)
      7. [Follower](#follower)
      8. [Like](#like)
      9. [Vote](#vote)
   4. [Themes](#themes)
      1. [User Management](#user-management)
      2. [Profile Management](#profile-management)
      3. [Channel Interaction](#channel-interaction)
      4. [Content Sharing](#content-sharing)
      5. [Community Interaction](#community-interaction)
      6. [Social Features](#social-features)
      7. [Engagement and Feedback](#engagement-and-feedback)
   5. [Agile development methodology](#agile-development-methodology)
      1. [Threadly Agile Development Process](#threadly-agile-development-process)
   6. [Planning](#planning)
      1. [Mockups](#mockups)
      2. [Data models](#data-models)
   7. [Design](#design)
      1. [Colours](#colours)
      2. [Fonts](#fonts)
   8. [Features](#features)
      1. [CRUD functionality](#crud-functionality)
         1. [Account Management](#account-management)
         2. [Channel Management](#channel-management)
         3. [Profile Management](#profile-management)
         4. [Likes](#likes)
         5. [Comments](#comments)
         6. [Votes](#votes)
      2. [Future improvements and features](#future-improvements-and-features)
   9. [Frameworks, libraries and dependencies](#frameworks-libraries-and-dependencies)
      1. [React-Router-DOM](#react-router-dom)
      2. [ReactDOM](#reactdom)
      3. [Axios](#axios)
      4. [JWT Decode](#jwt-decode)
      5. [Bootstrap](#bootstrap)
      6. [Tooltip](#tooltip)
   10. [React features used to enhance user experience](#react-features-used-to-enhance-user-experience)
      1. [Custom hooks](#custom-hooks)
      2. [Custom Hooks](#custom-hooks)
         1. [useClickOutsideToggle](#useclickoutsidetoggle)
         2. [useRedirect](#useredirect)
   11. [Testing](#testing)
      1. [Manual testing](#manual-testing)
      2. [Automated tests](#automated-tests)
      3. [Validator testing](#validator-testing)
      4. [W3C CSS validator](#w3c-css-validator)
      5. [ESLint JavaScript validator](#eslint-javascript-validator)
      6. [Lighthouse testing](#lighthouse-testing)
      7. [Resolved bugs](#resolved-bugs)
      8. [Unresolved bugs](#unresolved-bugs)
   12. [Deployment](#deployment)
   13. [Credits](#credits)



## User Stories

### User

1. **As a user,** I want to create an account so that I can log in and access the platform.
2. **As a user,** I want to log in to my account so that I can access my personalized content and interact with the community.
3. **As a user,** I want to update my account details so that I can keep my profile information current.

### Profile

1. **As a user,** I want to create a profile so that I can share information about myself with the community.
2. **As a user,** I want to view my profile so that I can see the information I have shared.
3. **As a user,** I want to edit my profile so that I can update my personal information and preferences.

### Channel

1. **As a user,** I want to create a channel so that I can start a new topic of discussion.
2. **As a user,** I want to view a list of channels so that I can find topics that interest me.
3. **As a user,** I want to follow a channel so that I can stay updated on new posts within that channel.
4. **As a user,** I want to edit a channel I own so that I can update its information and settings.

### ChannelFollower

1. **As a user,** I want to follow a channel so that I receive updates on new posts and activity within the channel.
2. **As a user,** I want to view the channels I follow so that I can easily access my favorite content.

### Post

1. **As a user,** I want to create a post so that I can share content with the community.
2. **As a user,** I want to view a post so that I can read its content and comments.
3. **As a user,** I want to edit a post I created so that I can update or correct its content.
4. **As a user,** I want to delete a post I created so that I can remove content that is no longer relevant or appropriate.

### Comment

1. **As a user,** I want to comment on a post so that I can participate in the discussion.
2. **As a user,** I want to edit a comment I made so that I can update or correct my input.
3. **As a user,** I want to delete a comment I made so that I can remove input that is no longer relevant or appropriate.

### Follower

1. **As a user,** I want to follow other users so that I can see their posts and activity.
2. **As a user,** I want to view the users I follow so that I can easily access their profiles and posts.

### Like

1. **As a user,** I want to like a post so that I can show my appreciation for the content.
2. **As a user,** I want to view the posts I have liked so that I can revisit content that I enjoyed.

### Vote

1. **As a user,** I want to upvote a post so that I can show support for high-quality content.
2. **As a user,** I want to downvote a post so that I can express disapproval of low-quality content.
3. **As a user,** I want to see the vote count on a post so that I can gauge the community's opinion of the content.

## Themes

### User Management

- **Account Creation and Management**
  - Enables the creation and management of user accounts, including registration, login, and updating account details.

### Profile Management

- **Profile Creation and Editing**
  - Facilitates the creation, viewing, and editing of user profiles to share personal information with the community.

### Channel Interaction

- **Channel Creation and Following**
  - Supports the creation of channels for discussion topics, viewing a list of channels, following channels to stay updated, and editing channel details.

### Content Sharing

- **Post Creation and Management**
  - Allows the creation, viewing, editing, and deletion of posts to share content with the community.

### Community Interaction

- **Commenting and Feedback**
  - Provides functionality for commenting on posts, editing comments, and deleting comments to participate in discussions.

### Social Features

- **Following Users and Content**
  - Includes features for following other users and channels, viewing followed users and channels, and staying updated on their activity.

### Engagement and Feedback

- **Likes and Votes**
  - Implements liking posts to show appreciation, viewing liked posts, upvoting and downvoting posts to express opinions, and seeing the community's feedback on posts.

## Agile development methodology

### Threadly Agile Development Process

GitHub issues and projects were used to document and track an agile development approach for Threadly. A GitHub issue was created for each user story. A GitHub milestone was created to represent the product backlog, where all user stories were initially added.

Development work was scheduled using a series of iterations, each with a timebox of around 2 weeks.
User stories were moved from the product backlog into the relevant iteration as each cycle of work began.

A project Kanban board was used to track progress, with user stories moved between 'Todo', 'In Progress', and 'Done' columns as appropriate.

The project board can be found in the DRF API Repo -

## Planning

### Mockups

Figma was used to design the mockup wireframes - https://www.figma.com/design/bViM8YceKmq6FSrMfEC0bP/PP5---Community-forum?node-id=0-1&t=I1nKotAgNEHeaB44-1

### Data models

See link to Data models in DRF API

## Design

### Colours

A simple blue was used as a header with accents of black and white throughout the website to create a simple but elegant design.

### Fonts

Monserat was used throughoht the project

## Features

### CRUD functionality

#### Account Management

Add Post
Edit Post
Delete Post

#### Channel Management

Add Channel
Edit Channel
Delete Channel

##### Profile Management

Add Profile
Edit Profile
Delete Profile

#### Likes

Like Post
Unlike Post

#### Comments

Comment

#### Votes

Upvote
Downvote

### Future improvements and features

Admin Panel
Spam control
Direct Message Service

## Frameworks, libraries and dependencies

## Frameworks, Libraries and Dependencies

### React-Router-DOM

**react-router-dom** - This library enables 'client side routing' for React web applications and is used to implement basic routing in Threadly, i.e., to implement the links on the bottom navbar, and register, sign-in, and sign-out links. Using React-Router-DOM also enabled the implementation of 'single page mode' to enhance the experience for users on larger screens. The `useSinglePage` custom hook is referenced in App.js, with different Route components conditionally rendered for the various paths depending on whether the app is running in single page mode. The `useLocation` hook from React-Router-DOM is used in some components to determine the current URL and respond accordingly, for example, by ensuring the correct nav button is highlighted in the bottom navbar for mobile users.

### ReactDOM

**react-dom** - react-dom is used to manipulate the DOM outside of a specific component and supports the user experience by enabling modal dialogs to be appended to the top level of the DOM (important for accessibility) and alerts to be appended to specific components. For example, notifications are fetched by the NotificationsMenu component, but this takes the form of a dropdown menu, so using ReactDOM allows the component to 'reach out' into the DOM and display error alerts in a more obvious location than inside the dropdown.

### Axios

**Axios** - The axios library was chosen to simplify making HTTP requests to the REST API (e.g., not having to manually configure HTTP headers), and because it enables simple implementation of 'interceptors' which are used to request a refresh token in the event of an HTTP 401 error. This enhances the user experience because an authenticated user remains signed in for up to 24 hours, rather than having to sign in again after five minutes.

### JWT Decode

**jwt-decode** - Used to decode Base64URL encoded JSON web tokens.

### Bootstrap

**Bootstrap** - A popular front-end framework for developing responsive and mobile-first websites. It provides a collection of CSS and JavaScript tools for creating a consistent and functional user interface.

### Tooltip

**react-tooltip** - A flexible and lightweight library used to create tooltips in React applications, enhancing user experience by providing additional information on hover.

## React features used to enhance user experience

### Custom hooks

## Custom Hooks

### useClickOutsideToggle

This custom hook manages the state of an expandable element (e.g., a dropdown menu) and automatically collapses it when a click is detected outside the element.

### useRedirect

This custom hook handles user redirection based on their authentication status. It attempts to refresh the authentication token and redirects users accordingly.

## Testing

### Manual testing

[Testing Doc](testing.md)

### Automated tests

### Validator testing

### W3C CSS validator

### ESLint JavaScript validator

### Lighthouse testing

### Resolved bugs

### Unresolved bugs

## Deployment

To deploy to Heroku, follow these steps:

- Fork or clone this repository in GitHub.
- If you have also cloned and deployed your own version of the TribeHub Django Rest Framework API, you will need to ensure the value of `axios.defaults.baseURL` in `src/api/axiosDefaults.js` is set to the base URL for your API. Pull to your local development environment and push back to GitHub if necessary; otherwise, leave as is to use the original TribeHub API.
- Log in to Heroku.
- Select 'Create new app' from the 'New' menu at the top right.
- Enter a name for the app and select the appropriate region.
- Select 'Create app'.
- Select the 'Deploy' tab at the top.
- Select 'GitHub' from the deployment method options to confirm you wish to deploy using GitHub. You may be asked to enter your GitHub password.
- Find the 'Connect to GitHub' section and use the search box to locate your repo.
- Select 'Connect' when found.
- Optionally choose the main branch under 'Automatic Deploys' and select 'Enable Automatic Deploys' if you wish your deployed site to be automatically redeployed every time you push changes to GitHub.
- Find the 'Manual Deploy' section, choose 'main' as the branch to deploy and select 'Deploy Branch'.

When deployment is complete, you will be given a link to the deployed site.

## Credits

The coding institue moments react app was used as influence and a base
