import pytest
from cash.models import User
from .factories import UserFactory # created this to create users on the fly
from bson.json_util import dumps
import json, bson

# test to check that the url @ /api is accessible
def test_api_base_is_accessible(client):
    response = client.get("/api/")
    assert response.status_code == 200

# test to check that the users endpoint us accessible for fetching all the users
@pytest.mark.django_db
def test_users_endpoint_returns_successfully(client):
    response = client.get("/api/users/")
    assert response.status_code == 200

# test to ensure the users endpoint is returning a list of users
@pytest.mark.django_db
def test_users_endpoint_returns_list_of_users(client):
    # user1 = UserFactory()
    # user2 = UserFactory()

    # the users can also be created with the commented code above
    user = User.objects.create_newuser("mudiobriki@gmail.com", "kingmudi", "password")
    user2 = User.objects.create_newuser("kingmudi@gmail.com", "kingobriki", "password")

    response = client.get("/api/users/")
    assert response.status_code == 200
    assert "mudiobriki@gmail.com" in str(response.content)
    assert "kingmudi@gmail.com" in str(response.content)

# test to ensure the create users endpoint is receiving data from the form
@pytest.mark.django_db
def test_create_user_endpoint_received_data(client):
    form_data = {"username": "kingmudi", "email": "kingmudi@gmail.com", "password": "password"}
    response = client.post(path="/api/create", data=form_data, content_type='application/json')
    assert response.status_code == 200
    
    #confirm the user is created
    response = client.get("/api/users/")
    assert "kingmudi@gmail.com" in str(response.content)

# test to ensure the deposit endpoint into an account
@pytest.mark.django_db
def test_deposit_endpoint_updates_user_balance(client):
    user = User.objects.create_newuser("mudiobriki@gmail.com", "kingmudi", "password")
    # check the initial balance
    assert user.balance == 0.0
    # test adding money to the balace
    form_data = {"username": "kingmudi", "deposit": 50}
    response = client.post(path="/api/deposit", data=form_data, content_type='application/json')
    assert response.status_code == 200
    assert '"balance": 50' in str(response.content)

# test to ensure the transfer endpoint works properly
@pytest.mark.django_db
def test_transfer_endpoint_updates_users_balances(client):
    user1 = User.objects.create_newuser("mudiobriki@gmail.com", "kingmudi", "password")
    user2 = User.objects.create_newuser("kingmudi@gmail.com", "mudi", "password")
    # check the initial balance
    assert user1.balance == 0.0
    # test adding money to the balace
    form_data = {"username": "kingmudi", "deposit": 50}
    response = client.post(path="/api/deposit", data=form_data, content_type='application/json')
    assert response.status_code == 200
    assert '"balance": 50' in str(response.content)

    # test transferring money from user1 to user2
    form_data = {"from": "kingmudi", "to": "mudi", "amount": 30}
    response = client.post(path="/api/transfer", data=form_data, content_type='application/json')
    assert response.status_code == 200
    assert '"balance": 30' in str(response.content)
