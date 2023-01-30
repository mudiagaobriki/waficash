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

const Transfer = () => {
    const [users, setUsers] = useState([])
    const [from, setFrom] = useState("")
    const [to, setTo] = useState("")
    const [validToAccounts, setValidToAccounts] = useState([])
    const [amount, setAmount] = useState("")
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        axios.get("http://localhost:8000/api/users/")
        .then(res => {
            setUsers(res?.data)
        })
        .catch(err => console.log("Error: ", err))
    },[])

    const handleFromSelected = (selected) => {
        setFrom(selected)
        let validTos = users?.filter(el => el?.username !== selected)
        setValidToAccounts(validTos)
    }

    const handleTransfer = () => {
        setLoading(true)
        let payload = {
            from: from,
            to: to,
            amount: amount,
        }

        // var csrfCookie = Cookies.get('XSRF-TOKEN');
        const csrfToken = getCookie('csrftoken')

        axios.post("http://localhost:8000/api/transfer",JSON.stringify(payload),{headers: {"X-CSRFToken": csrfToken}})
        .then(res => {
            setLoading(false)
            alert("Money transferred successfully")
            window.location.reload(false);
        })
        .catch(err => {
            console.log("Post error: ", err)
            setLoading(false)
            alert("Error in transferring money")
        })
    }

    return (
        <Container fluid={true}>
            {/* <Navigation /> */}
            <Row className='p-4 justify-content-center'>
                <Col xs="4">
                <div className="NewUser">
                        <h2>Transfer</h2>
                        <Form className="form mt-4">
                        <FormGroup>
                            <Label for="fromUser">From Account</Label>
                            <Input
                                className="mb-3"
                                type="select"
                                onChange={(e) => handleFromSelected(e.target.value)}
                            >
                                <option>
                                Select account from
                                </option>
                                {users.map((user, index) => 
                                    <option value={user?.username}>
                                    {user?.username}
                                    </option>
                                )}
                            </Input>
                        </FormGroup>
                        <FormGroup>
                            <Label for="toUser">To Account</Label>
                            <Input
                                className="mb-3"
                                type="select"
                                onChange={(e) => setTo(e.target.value)}
                            >
                                <option>
                                Select account to
                                </option>
                                {validToAccounts.map((user, index) => 
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
                        <Button onClick={handleTransfer}>Send Money</Button>
                    </Form>
                    </div>
                </Col>
            </Row>
            
        </Container>
    );
};

export default Transfer;