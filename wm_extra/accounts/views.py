from forms import SignupForm
from django.views.generic.edit import FormView
from django.contrib import auth, messages
from django.utils.translation import ugettext_lazy as _
class SignupView(FormView):

    template_name = "account/signup.html"
    template_name_ajax = "account/ajax/signup.html"
    template_name_email_confirmation_sent = "account/email_confirmation_sent.html"
    template_name_email_confirmation_sent_ajax = "account/ajax/email_confirmation_sent.html"
    template_name_admin_approval_sent = "account/admin_approval_sent.html"
    template_name_admin_approval_sent_ajax = "account/ajax/admin_approval_sent.html"
    template_name_signup_closed = "account/signup_closed.html"
    template_name_signup_closed_ajax = "account/ajax/signup_closed.html"
    form_class = SignupForm
    form_kwargs = {}
    redirect_field_name = "next"
    identifier_field = "username"
    messages = {
        "email_confirmation_sent": {
            "level": messages.INFO,
            "text": _("Confirmation email sent to {email}.")
        },
        "invalid_signup_code": {
            "level": messages.WARNING,
            "text": _("The code {code} is invalid.")
        }
    }
