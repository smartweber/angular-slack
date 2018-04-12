const validateBody = data => {

    let errors = {};
    let isValid = true;

    // Simple test validations
    if( !data.email || data.email.length < 2 ){
        errors.email = "Email is required!";
        isValid = false;
    }
    if( !data.password || data.password.length < 2 ){
        errors.password = "Password is required!";
        isValid = false;
    }

    // is unique?
    // .....

    return {
        errors: { "errors": errors },
        isValid
    };
};

module.exports = validateBody;
