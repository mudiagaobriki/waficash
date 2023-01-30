# this file takes care of creating users for the test cases, instead of creating them manually
import factory

from cash.models import User
from django.contrib.auth.hashers import make_password

class UserFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = User

    username = factory.Sequence(lambda n: f"user_{n:03}")
    email = factory.LazyAttribute(lambda user: f"{user.username}@waficash.com")
    password = factory.LazyFunction(lambda: make_password("password"))