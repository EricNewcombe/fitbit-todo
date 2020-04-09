// { status: 400, message: "" },
module.exports = {

    ERROR_MESSAGES : {
        INVALID_PASSWORD_PATTERN: { status: 400, message: "Password must be at least 8 characters long, contain at least one upper case letter, at least one lower case letter and at least one number." },
        INVALID_EMAIL_ADDRESS: { status: 400, message: "Please provide a valid email address." },
        PASSWORD_UNEQUAL_TO_SECONDARY: { status: 400, message: "Password and confirmation of password sent do not match." },
        NO_PASSWORD_SENT: {status: 400, message: "No password was sent in request"},
        NO_SECOND_PASSWORD_SENT: { status: 400, message: "Password confirmation was not sent in request" },
        NO_EMAIL_SENT: { status: 400, message: "No email was sent in request" },
        USER_ALREADY_EXISTS: { status: 400, message: "A user with that email already exists" },
        ERROR_WHILE_FINDING_ACCOUNT: { status: 500, message: "An error occurred while trying to find the account." },
        ACCOUNT_NOT_FOUND: { status: 400, message: "Account was unable to be found" },
        ERROR_SAVING_USER_TO_DATABASE: { status: 500, message: "An error occurred while saving user to the database." },
        UNKNOWN_ERROR: { status: 500, message: "An unknown error has occurred" },
        INVALID_USERNAME_OR_PASSWORD: { status: 400, message: "Invalid username or password." },
        PASSWORD_COMPARE_ERROR: { status: 500, message: "Error comparing passwords."}
    },
    SUCCESS_MESSAGES : {
        ACCOUNT_CREATED_SUCCESSFULLY: "Account was successfully created",
        SUCCESSFUL_LOGIN: "Successfully logged in."
    }
}