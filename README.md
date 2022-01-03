
# Project Name

> The Fridge | 
> Live demo [https://fridge2-marcinsutula.vercel.app/]

## Table of Contents

- [General Info](#general-information)
- [Technologies Used](#technologies-used)
- [Features](#features)
- [Screenshots](#screenshots)
- [Setup](#setup)
- [Usage](#usage)
- [Project Status](#project-status)
- [Room for Improvement](#room-for-improvement)
- [Acknowledgements](#acknowledgements)
- [Contact](#contact)

## General Information

The Fridge is a tool to help better manage contents of a fridge. It divides in three main features.

First one is My Food, where an user can store information about bought and already stored products such as:

- Name
- Type
- Weight
- Quantity
- Expiration Date

Furthermore it gives you ability to check summary, edit, sort, send to shopping list.
Products date which is expired/about to expire is highlited.
The information is stored online, so an user can always check it, for instance whilst shopping.

Second feature is My Recipes. User can create his/her own recipes with description, where it will be shown which ingredients are missing with an option to pass given ingredients to shopping list.

Third feature is My Shopping List. A simple list of products to buy with an option to add, edit, remove.

It's my first project to help build my portfolio.

## Technologies Used

- Next.js 11.1.2
- Redux Toolkit 1.6.1 (Redux 4.1.1)
- Firebase 9.1.3 (Firestore and Authentication)
- Material-UI

## Features

- Food
- Recipes 
- Shopping list

## Screenshots

![Food example](https://github.com/MarcinSutula/TheFridge/blob/main/public/foodtableprintscreen.JPG)
![Recipes example](https://github.com/MarcinSutula/TheFridge/blob/main/public/recipiesprintscreen.JPG)
![Recipes example2](https://github.com/MarcinSutula/TheFridge/blob/main/public/recipeexample.JPG)
![Shopping list example](https://github.com/MarcinSutula/TheFridge/blob/main/public/shoppinglistprintscreen.JPG)

## Setup

Install Node.js on your computer (https://nodejs.org/en/)
Install dependencies - `npm install`
Start development server - `npm run dev`

## Usage

Pages that should be used only if user is logged in are protected with components/control/withAuth.js, which checks if an user is logged in. If he is not, user is redirected to the main page.
All API calls apart from one in index.js are in Redux thunks and middleware.
API payloads are created in seperate functions in components/control/API payloads/  
Inputs validated by Yup in components/control/input validation/
If input is invalid, reusable InputError component is rendered components/InputError.js
Config contains all non programmable variables, in components/control/config.js
All modals (as add Food, add Recipe, edit Food etc.) are in components/modals
Reusable functions, icons and spinner are in components/utils/
Redux reducers are divided in folders related to user/food/recipe/shopping list actions
Redux thunks are used for authentication and creating an account(Firebase Authentication)
Authentication is based on token from Firebase Auth and stored or removed from local storage.
Redux middlewares are used for Firestore fetches 

## Project Status

Project is: in progress.

## Room for Improvement

- More reliable authentication with expiring tokens
- Clearer CSS
- More responsive CSS

To do:

- Add polish and italian language
- implement server side rendering

## Acknowledgements

This project was based on :

- [React - The Complete Guide (incl Hooks, React Router, Redux) by Maximilian Schwarzmuller](https://www.udemy.com/course/react-the-complete-guide-incl-redux/)
- [The Complete JavaScript Course 2021: From Zero to Expert! by Jonas Schmedtmann](https://www.udemy.com/course/the-complete-javascript-course/)

## Contact

Created by [@MarcinSutula](https://github.com/MarcinSutula) - feel free to contact me!

