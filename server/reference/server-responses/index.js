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
        UNABLE_TO_FIND_USER: { status: 400, message: "User was unable to be found."},
        PASSWORD_COMPARE_ERROR: { status: 500, message: "Error comparing passwords."},
        ERROR_GENERATING_RESET_TOKEN: { status: 500, message: "An error occurred while generating a reset token" },
        ERROR_SAVING_RESET_TOKEN: { status: 500, message: "An error occurred while saving a reset token" },
        EMAIL_DOES_NOT_EXIST: { status: 200, message: "An email with a reset link has been sent if the email exists in our system."},
        NO_EMAIL_TO_UPDATE_SENT: { status: 400, message: "Email to update to was not sent"},
    },
    SUCCESS_MESSAGES : {
        ACCOUNT_CREATED_SUCCESSFULLY: "Account was successfully created",
        SUCCESSFUL_LOGIN: "Successfully logged in.",
        EMAIL_SENT_IF_EXISTS: "An email with a reset link has been sent if the email exists in our system.",
        ACCOUNT_UPDATED_SUCCESSFULLY: "Account was successfully updated."
    }
}