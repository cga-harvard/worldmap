from django.conf.urls import url
from .views import certify, uncertify, certified_by_user

urlpatterns = [
    url(r'^(?P<username>[a-zA-Z\.]+)/?$',
        certified_by_user,
        name='certified_by_user'),
    url(r'^(?P<modeltype>[a-zA-Z\.]+)/(?P<modelid>\d+)/certify/?$',
        certify,
        name='certify'),
    url(r'^(?P<modeltype>[a-zA-Z\.]+)/(?P<modelid>\d+)/uncertify/?$',
        uncertify,
        name='uncertify'),
    ]
