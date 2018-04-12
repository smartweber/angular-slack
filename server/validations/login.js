const validateBody = data => {

    let errors = {};
    let isValid = true;

    // Simulate database query
    if( data.email !== "admin" ) {
        errors.email = "Incorrect Email";
        isValid = false;
    }
    if( data.password !== "1234" ) {
        errors.password = "Incorrect Password";
        isValid = false;
    }

    // Simple test validations
    if( !data.email || data.email.length < 2 ){
        errors.email = "Email is required!";
        isValid = false;
    }
    if( !data.password || data.password.length < 2 ){
        errors.password = "Password is required!";
        isValid = false;
    }

    return {
        errors: {"errors": errors},
        isValid
    };
};

module.exports = validateBody;
