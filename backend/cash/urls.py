from django.urls import path

from .views import create_user, deposit, transfer
app_name = "cash"

urlpatterns = [
    # path("usersdata", myusers, name="users_data"),
    path("create", create_user, name="create_user"),
    path("deposit", deposit, name="deposit_money"),
    path("transfer", transfer, name="transfer_money"),
]