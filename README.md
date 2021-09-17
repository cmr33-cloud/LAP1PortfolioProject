
# LAP1PortfolioProject
Community journaling website created by Callum, Elena and Quinn


## Project Description
This is a community journaling website where users can create journal entries anonymously and interact with other users posts with reactions and comments.

- Usera can view other peoples' entries.  
- Users can react to other peoples’ entries with an emoji.  
- Users have three emojis to choose from.  
- Users can comment on other people’s entries.  
- Users scan search post by keywords to filter the timeline. 
- Users scan use the website on different devices and screen sizes  
## 

## Installation & Usage

### Installation

* Clone or download the repo.
* npm install to install dependencies


### Usage

* Open the terminal.
* Navigate to main folder
* Type `npm start` to start server (server is currently hosted on heroku but this can be changed to localhost)

## Technologies

* JavaScript
* Express
* Cors
* Heroku
* Netlify
* Bootstrap


### Testing

* Jest
* Jest-fetch-mock
* Test coverage is approximately 60% on the server side, but significantly less on the client side as we struggled with this


## Process
* We began by designing a draft using Excalidraw to plan out the layout and functionality
* Created some skeleton code for the general layout we wanted for the project
* We created a kanban board with issue cards to distribute tasks to group members
* Each issue was assigned to one or more people
* We started with creating the HTML and the server on localhost with a few routes
* Then we worked on the basic functionality of the website along with testing
* We migrated from using localhost to using heroku so our website could be deployed
* Finally we worked on styling the website using mainly bootstrap


## Wins & Challenges

### Wins
* Getting the server and client to communicate properly for all functionality
* Implementing an additional feature, a search function which allows the user to search posts by keyword
* Learning how to deploy on Heroku and seeing our website live



### Challenges
* client side testing was a challenge as none of us are familiar with how to do this
* We ran into some CORS issues which slowed us down
* Figuring out the right request to use when fetching from the server


## Bugs
* If description doesn't have 3 significant words, the entry will not post
* Its possible to exploit the emoji feature to add more than you should be able to

## Future features
* Multiple gifs previewing at once so you get a better collection
* Ability to sort the timeline by number of reactions and/or comments


## Licence
* MIT

