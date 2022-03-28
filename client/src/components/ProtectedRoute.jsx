import { Box } from '@chakra-ui/react';
import { Navigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { useContext } from 'react';

const ProtectedRoute = ({ children }) => {
    const { isLoggedIn, isLoading } = useContext(AuthContext);
    if (isLoading) {
        return <Box>Loading...</Box>
    }

    if (!isLoggedIn) {
        return <Navigate to='/' replace />
    }

    return children;
}

export default ProtectedRoute;