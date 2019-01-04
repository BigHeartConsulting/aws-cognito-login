This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Getting Started

Go to the AWS Cognito console and create a new user pool. Click review defaults. You may want to consider how strong to make your password requirements here.

Click Add app client. Make sure that `Generate client secret` is unchecked, then create an app client. Then click `return to pool details`

Click `Create pool`

In the project directory, make a file called .env with the contents:

### `REACT_APP_CLIENT_ID="your Cognito app client id"`
### `REACT_APP_POOL_ID="your Cognito user pool id"`

The app client id can be found in "App clients" and the user pool id can be found in "General seetings" in the AWS Cognito console.

In the project directory, run:

### `npm install` and `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.
