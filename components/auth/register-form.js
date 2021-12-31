import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { signIn, useSession } from 'next-auth/client';
import { Form, Formik } from 'formik'; 
import * as Yup from 'yup'; 
import MyTextInput from '../form/text-input';
import styles from './login-form.module.scss'; 

const RegisterForm = ({csrfToken, nextAuthURL}) => {
  const [isSignupStarted, setIsSignupStarted] = useState(false);
  const [signUpError, setSignUpError] = useState(false);
  const [signUpMessage, setSignUpMessage] = useState('');
  const router = useRouter(); 
    
  useEffect(() => {  
    if(router.query.error) {
      setSignUpError(router.query.error);
      isSignupStarted(false);
    }
  }, [router.query.error]);

  const submitHandler = async (values, { setSubmitting }) => {
      setIsSignupStarted(true);
      let signUpURL = `${nextAuthURL}/api/auth/register`;
      let responseRaw = null;
      let response = null;
      let data = {...values};

      delete['passwordConfirmation'];
      console.log('values: ', data);  

      let options = {
        method: "POST",
        headers: {
          "Content-type": "application/json"
        },
        body: JSON.stringify(data),
      }; 

      try {
        responseRaw = await fetch(signUpURL, options);

        try {
        } catch (e) {
          console.log(e);
        }

        response = await responseRaw.json();

        if (response.user) {
          setSignUpMessage('User Registered Successfully');
          //Need to implement event bus so that the input element can be cleared ... and we can show a success message.
        }
      } catch (e) {
        console.log(e);
      }

      console.log('response: ', response);

      if(response['status'] == 'error') {
        setSignUpError(response.error.message); 
        setIsSignupStarted(false);  
      } else {
        router.replace('/'); 
      }
  }

  return (
      <>  
        <Formik
          initialValues={{
            name: '',
            email: '',
            password: '',
            passwordConfirmation: '',
            age: ''
          }}

          validationSchema={Yup.object({
            name: Yup.string()
              .required('Please enter a valid Name'),
            email: Yup.string()
              .email('Please enter a valid Email.')
              .required('Please enter a valid Email.'),
            password: Yup.string() 
              .required('Please enter a valid Password.')  
              .min(8, 'Password is too short - should be 8 chars minimum.'),
            passwordConfirmation: Yup.string()
              .oneOf([Yup.ref('password'), null], 'Passwords must match'),  
            age: Yup.number() 
          })}

          onSubmit={submitHandler} 
        >
          <Form>
            {signUpMessage && <div className="notification is-primary">
              <button className="delete"></button>
              {signUpMessage}
            </div>}
            <div className={`${styles.login__box} box`}>
              <input name="csrfToken" type="hidden" defaultValue={csrfToken} /> 

              <MyTextInput 
                label="Name"
                name="name" 
                type="text"
                placeholder="Enter Your Name" 
              /> 

              <MyTextInput 
                label="Email"
                name="email"
                type="email"
                placeholder="Enter Email Address"
              />

              <MyTextInput 
                label="Password"
                name="password"
                type="password" 
                placeholder="Enter Password"
              />

              <MyTextInput 
                label="Confirm Password" 
                name="passwordConfirmation"
                type="password" 
                placeholder="Confirm Password"
              />

              <MyTextInput 
                label="Age"
                name="age"
                type="text" 
                placeholder="Enter Your Age"
              />

              {signUpError && <div className="error">{signUpError}</div>}       

              <button type="submit"  disabled={isSignupStarted} className={`${styles.login__button} button is-primary`}>
                {isSignupStarted ?  'Logging in ...' : 'Login' }
              </button>
            </div>
          </Form>
        </Formik>
      </>
  ) 
} 

export default RegisterForm;  