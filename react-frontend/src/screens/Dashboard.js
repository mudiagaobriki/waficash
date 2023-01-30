import React, { useEffect, useState } from 'react';
import Navigation from '../components/Navigation';
import { Container, Row, Col, Table, Form, FormGroup, Label, Input, Button } from 'reactstrap';
import axios from "axios";
axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
axios.defaults.xsrfCookieName = "csrftoken";

function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

const Dashboard = () => {
    const [users, setUsers] = useState([])
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        axios.get("http://localhost:8000/api/users/")
        .then(res => {
            setUsers(res?.data)
        })
        .catch(err => console.log("Error: ", err))
    },[])

    const handleCreate = () => {
        setLoading(true)
        let payload = {
            username: username,
            email: email,
            password: password
        }

        const csrfToken = getCookie('csrftoken')

        axios.post("http://localhost:8000/api/create",JSON.stringify(payload),{headers: {"X-CSRFToken": csrfToken}})
        .then(res => {
            setLoading(false)
            alert("User created successfully")
            window.location.reload(false);
        })
        .catch(err => {
            console.log("Post error: ", err)
            setLoading(false)
            alert("Error in creating user")
        })
    }

    return (
        <Container fluid={true}>
            <Row className='p-4'>
                <Col xs="8" className='p-4'>
                <Table borderless>
                <thead>
                    <tr>
                    <th>#</th>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Balance</th>
                    </tr>
                </thead>
                <tbody>
                    {users?.map((user, index) => 
                        <tr>
                        <th scope="row">{index + 1}</th>
                        <td>{user?.username}</td>
                        <td>{user?.email}</td>
                        <td>{user?.balance}</td>
                        </tr>
                    )}
                </tbody>
            </Table>
                </Col>
                <Col>
                <div className="NewUser">
                        <h2>New User</h2>
                        <Form className="form">
                        <FormGroup>
                            <Label for="username">Username</Label>
                            <Input
                            type="text"
                            name="username"
                            id="username"
                            onChange={(e) => setUsername(e.target.value)}
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="email">Email</Label>
                            <Input
                            type="email"
                            name="email"
                            id="email"
                            onChange={(e) => setEmail(e.target.value)}
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="password">Password</Label>
                            <Input
                            type="password"
                            name="password"
                            id="password"
                            onChange={(e) => setPassword(e.target.value)}
                            />
                        </FormGroup>
                        <Button onClick={handleCreate}>Create</Button>
                    </Form>
                    </div>
                </Col>
            </Row>
            
        </Container>
    );
};

export default Dashboard;