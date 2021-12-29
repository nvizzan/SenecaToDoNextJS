import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { signIn, useSession } from 'next-auth/client';
import { Form, Formik } from 'formik'; 
import * as Yup from 'yup'; 
import MyTextInput from '../form/text-input';
import styles from './login-form.module.scss'; 

const LoginForm = () => {
  const [isLoginStarted, setIsLoginStarted] = useState(false);
  const [loginError, setLoginError] = useState(false);

  const router = useRouter();
    
  useEffect(() => {  
    if(router.query.error) {
      setLoginError(router.query.error);
      setIsLoginStarted(false);
    }
  }, [router.query.error]);

  return (
      <>  
        <Formik
          initialValues={{
            email: '',
            password: ''
          }}

          validationSchema={Yup.object({
            email: Yup.string()
              .email('Please enter a valid Email.')
              .required('Please enter a valid Email.'),
            password: Yup.string() 
              .required('Please enter a valid Password.')  
              .min(8, 'Password is too short - should be 8 chars minimum.')
          })}

          onSubmit={ async (values, { setSubmitting }) => {
            setIsLoginStarted(true);
            console.log('values: ', values);

            const response = await signIn('credentials', {
              email: values.email,
              password: values.password,
              redirect: false,
              callbackUrl: `${window.location.origin}/index`
            });

            console.log('response: ', response);

            if(response['error'] != null) {
              setLoginError(response.error);
              setIsLoginStarted(false);
            } else {
              router.replace('/'); 
            }
          }} 
        >
          <Form>
            <div className={`${styles.login__box} box`}>
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

              {loginError && <div className="error">{loginError}</div>}       

              <button type="submit"  disabled={isLoginStarted} className={`${styles.login__button} button is-primary`}>
                {isLoginStarted ?  'Logging in ...' : 'Login' }
              </button>
            </div>
          </Form>
        </Formik>
      </>
  ) 
} 

export default LoginForm; 