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

const Deposit = () => {
    const [users, setUsers] = useState([])
    const [username, setUsername] = useState("")
    const [amount, setAmount] = useState("")
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        axios.get("http://localhost:8000/api/users/")
        .then(res => {
            setUsers(res?.data)
        })
        .catch(err => console.log("Error: ", err))
    },[])

    const handleDeposit = () => {
        setLoading(true)
        let payload = {
            username: username,
            deposit: amount,
        }

        const csrfToken = getCookie('csrftoken')

        axios.post("http://localhost:8000/api/deposit",JSON.stringify(payload),{headers: {"X-CSRFToken": csrfToken}})
        .then(res => {
            setLoading(false)
            alert("Money added successfully")
            window.location.reload(false);
        })
        .catch(err => {
            console.log("Post error: ", err)
            setLoading(false)
            alert("Error in adding money")
        })
    }

    return (
        <Container fluid={true}>
            <Row className='p-4 justify-content-center'>
                <Col xs="4">
                <div className="NewUser">
                        <h2>Deposit</h2>
                        <Form className="form mt-4">
                        <FormGroup>
                            <Label for="username">Username</Label>
                            <Input
                                className="mb-3"
                                type="select"
                                onChange={(e) => setUsername(e.target.value)}
                            >
                                <option>
                                Select a user
                                </option>
                                {users.map((user, index) => 
                                    <option value={user?.username}>
                                    {user?.username}
                                    </option>
                                )}
                            </Input>
                        </FormGroup>
                        <FormGroup>
                            <Label for="email">Amount</Label>
                            <Input
                            type="text"
                            name="amount"
                            id="amount"
                            onChange={(e) => setAmount(e.target.value)}
                            />
                        </FormGroup>
                        <Button onClick={handleDeposit}>Add Money</Button>
                    </Form>
                    </div>
                </Col>
            </Row>
            
        </Container>
    );
};

export default Deposit;