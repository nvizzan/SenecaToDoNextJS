import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import LoginForm from "../components/auth/login-form";
import { getSession, getCsrfToken } from "next-auth/client";
import ReactBody from 'react-body';

const Login = ({ csrfToken }) => { 
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
 
    console.log('process.env.SENECA_BACKEND_URL: ', process.env.SENECA_BACKEND_URL); 
    console.log('process.env.NEXTAUTH_URL: ', process.env.NEXTAUTH_URL); 

    useEffect(() => {
        getSession().then(session => {
            if(session) {
                router.replace('/');
            }else {
                setIsLoading(false); 
            }
        }) 
    }, [router]);

    if(isLoading) { 
        return (
            <>
                <div className="pageloader is-active">
                    <span className="title"></span>
                </div>
            </>
        );
    }

    return (
        <>
            <ReactBody className="page-login" />
            <LoginForm csrfToken={csrfToken} /> 
        </>
    )
}

export async function getServerSideProps(context) {
  return {
    props: {
      csrfToken: await getCsrfToken(context),
    },
  }
}

export default Login;