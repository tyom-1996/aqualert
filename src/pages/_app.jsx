// pages/_app.jsx
import { AuthProvider } from '../context/AuthContext';
// import '../assets/css/variables.css';

function MyApp({ Component, pageProps }) {
    return (
        <AuthProvider>
            <Component {...pageProps} />
        </AuthProvider>
    );
}

export default MyApp;
