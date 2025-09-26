// components/withAuth.js
import { useRouter } from 'next/router';
import {useEffect, useState} from 'react';

const withAuth = (WrappedComponent) => {
    return (props) => {
        const router = useRouter();
        const [loading, setLoading] = useState(true)

        useEffect(() => {
            // const token = localStorage.getItem('token');
            if (!token) {
                router.replace('/');
            } else {
                setLoading(false)
            }
        }, []);

        if (!loading) {
            return <WrappedComponent {...props} />;
        }
    };
};

export default withAuth;
