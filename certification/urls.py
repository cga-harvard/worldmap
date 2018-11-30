from django.conf.urls import url
from .views import certify, uncertify

urlpatterns = [
    url(r'^(?P<modeltype>[a-zA-Z\.]+)/(?P<modelid>\d+)/certify/?$',
        certify,
        name='certify'),
    url(r'^(?P<modeltype>[a-zA-Z\.]+)/(?P<modelid>\d+)/uncertify/?$',
        uncertify,
        name='uncertify'),
    ]
