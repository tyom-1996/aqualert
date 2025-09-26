// components/withAuth.js
import { useRouter } from 'next/router';
import {useEffect, useState} from 'react';

const withOutAuth = (WrappedComponent) => {
    return (props) => {
        const router = useRouter();
        const [loading, setLoading] = useState(true)

        useEffect(() => {
            // const token = localStorage.getItem('token');
            if (!token) {
                setLoading(false)
            } else {
                router.replace('/');
            }
        }, []);

        if (!loading) {
            return <WrappedComponent {...props} />;
        }
    };
};

export default withOutAuth;
