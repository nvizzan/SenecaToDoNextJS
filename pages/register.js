import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import RegisterForm from "../components/auth/register-form"; 
import { getSession, getCsrfToken } from "next-auth/client";
import ReactBody from 'react-body';

const Register = ({ csrfToken }) => { 
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
            <ReactBody className="page-register" />
            <RegisterForm csrfToken={csrfToken} nextAuthURL={process.env.NEXTAUTH_URL} />
        </>
    ) 
}

export async function getServerSideProps(context) {
  return {
    props: {
      csrfToken: await getCsrfToken(context),
      NEXTAUTH_URL: process.env.NEXTAUTH_URL 
    },
  }
}

export default Register;