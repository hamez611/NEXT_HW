from django import forms
from .models import User
from django.contrib.auth import authenticate
from django.core.exceptions import ValidationError


class UserCreationForm(forms.ModelForm):
    password1 = forms.CharField(
        label="Password",
        widget=forms.PasswordInput,
        min_length=8,
        error_messages={"min_length": "!오류: 비밀번호는 8자 이상이어야 합니다!"},
    )
    password2 = forms.CharField(
        label="Password Confirmation",
        widget=forms.PasswordInput,
    )

    class Meta:
        model = User
        fields = ("username",)

    def clean(self):
        cleaned_data = super().clean()
        password1 = cleaned_data.get("password1")
        password2 = cleaned_data.get("password2")
        username = cleaned_data.get("username")

        errors = []

        # Username validation
        if username and len(username) < 8:
            errors.append("!오류: 아이디는 8자 이상이어야 합니다.")

        # Password validation
        if password1 != password2:
            errors.append("!오류: 비밀번호가 일치하지 않습니다.")

        if errors:
            raise ValidationError(errors)

        return cleaned_data

    def save(self, commit=True):
        user = User.objects.create_user(
            username=self.cleaned_data["username"],
            password=self.cleaned_data["password1"],
        )
        if commit:
            user.save()
        return user


class LoginForm(forms.Form):
    username = forms.CharField()
    password = forms.CharField(widget=forms.PasswordInput)
