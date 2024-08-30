import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { DataContext } from "../dataContext/dataContext";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';

import { PostData } from "../utils/PostData";

function Login() {

    const { setIsLoggedIn } = useContext(DataContext);

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [buttonStatus, setButtonDisabled] = useState(false);
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();
    const { error: errorParam } = useParams();

    useEffect(() => {
        if (errorParam) {
            if (errorParam === 'Successfully_Created_Account_Please_Login') {
                setSuccess('Account created successfully. Please login.');
                return;
            } else if (errorParam === 'Password_reset_successfully') {
                setSuccess('Password reset successfully. Please login.');
                return;
            }
            setError(errorParam.replace(/_/g, ' '));
        }
    }, [errorParam]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setButtonDisabled(true);

        if (username === '' || password === '') {
            setError('Please fill in all fields');
            setButtonDisabled(false);
            return;
        }

        PostData('login.php', { "username": username, "password": password })
            .then((result) => {

                if (result.status === 'error') {
                    setError(result.message);
                    setButtonDisabled(false);
                    return;
                }

                const userData = result.userData;
                sessionStorage.setItem('userData', JSON.stringify(userData));
                setIsLoggedIn(true);
                navigate('/dashboard');
            })
            .catch((error) => {
                setError(error.message);
                setButtonDisabled(false);
            });
    }

    return (
        <main>
            <center>
                <h1>Login</h1>
                <p>Here is where the login form will go.</p>
                <hr />
            </center>
            <center>
                <Form className="w-50">

                    {error && <Alert variant="danger">{error}</Alert>}
                    {success && <Alert variant="success">{success}</Alert>}

                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label className="w-100 text-start">Email address</Form.Label>
                        <Form.Control type="email" placeholder="Enter email" onInput={(e) => setUsername(e.target.value)} />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label className="w-100 text-start">Password</Form.Label>
                        <Form.Control type="password" placeholder="Password" onInput={(e) => setPassword(e.target.value)} />
                    </Form.Group>
                    <Form.Group className="mb-3 d-flex justify-content-center gap-5" controlId="formBasicCheckbox">
                        <Link to="/signup">Sign Up</Link>
                        <Link to="/forgot_password">Forgot Password</Link>
                    </Form.Group>
                    <Button className="mb-2" variant="primary" type="submit" onClick={(e) => handleSubmit(e)} disabled={buttonStatus}>
                        Submit
                    </Button>
                </Form>
            </center>
        </main>
    );
}

export default Login;
