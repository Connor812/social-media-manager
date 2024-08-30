import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Alert from "react-bootstrap/Alert";

import { PostData } from "../utils/PostData";

function Signup() {

    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [buttonStatus, setButtonDisabled] = useState(false);

    function handleSubmit(e) {
        e.preventDefault();
        setButtonDisabled(true);

        if (username === '' || email === '' || password === '') {
            setError('Please fill in all fields');
            setButtonDisabled(false);
            return;
        }

        PostData('signup.php', { "username": username, "email": email, "password": password })
            .then((result) => {

                if (result.status === 'error') {
                    setError(result.message);
                    setButtonDisabled(false);
                    return;
                }

                if (result.status === 'success') {
                    navigate('/login/Successfully_Created_Account_Please_Login');
                }
            })
            .catch((error) => {
                setError(error.message);
                setButtonDisabled(false);
            });

    }

    return (
        <main>
            <center>
                <h1>Signup</h1>
                <hr />

                <Form className="w-50">
                    <Form.Group className="mb-3" controlId="formBasicEmail">

                        {error === "" ? "" : <Alert variant="danger">{error}</Alert>}

                        <Form.Label>Username</Form.Label>
                        <Form.Control type="text" placeholder="Enter username" onInput={(e) => setUsername(e.target.value)} />
                        <Form.Label>Email address</Form.Label>
                        <Form.Control type="email" placeholder="Enter email" onInput={(e) => setEmail(e.target.value)} />
                        <Form.Text className="text-muted">
                            We'll never share your email with anyone else.
                        </Form.Text>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" placeholder="Password" onInput={(e) => setPassword(e.target.value)} />
                    </Form.Group>
                    <Form.Group className="mb-3 d-flex justify-content-center gap-5" controlId="formBasicCheckbox">
                        <Link to="/login">Login</Link>
                    </Form.Group>
                    <Button className="mb-2" variant="primary" type="button" onClick={(e) => handleSubmit(e)} disabled={buttonStatus}>
                        Submit
                    </Button>
                </Form>
            </center>
        </main>
    );
}

export default Signup;