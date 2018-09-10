# -*- coding: utf-8 -*-
#########################################################################
#
# Copyright (C) 2017 OSGeo
#
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with this program. If not, see <http://www.gnu.org/licenses/>.
#
#########################################################################

from tastypie.api import Api

from django.conf import settings
from django.conf.urls import url, include
from django.core import urlresolvers
from django.http import HttpResponse
from django.views.generic import TemplateView

from geonode.urls import urlpatterns

# WorldMap API - to replace some of the slow GeoNode API endpoints
from .api import LayerResource, MapResource, OwnerResource, TopicCategoryResource
from .views import wm_home

wm_api = Api(api_name='wm_api')
wm_api.register(LayerResource())
wm_api.register(MapResource())
wm_api.register(OwnerResource())
wm_api.register(TopicCategoryResource())

urlpatterns = [
   url(r'^/?$', wm_home, name='home_page'),
   url(r'^api/', include(wm_api.urls)),
 ] + urlpatterns

# django debug toolbar stuff, including a custom decorator for debuggin not html
# response (and in TastyPie)

def html_decorator(func):
    """
    This decorator wraps the output in html.
    (From http://stackoverflow.com/a/14647943)
    """

    def _decorated(*args, **kwargs):
        response = func(*args, **kwargs)

        wrapped = ("<html><body>",
                   response.content,
                   "</body></html>")

        return HttpResponse(wrapped)

    return _decorated


@html_decorator
def debug(request):
    """
    Debug endpoint that uses the html_decorator,
    """
    path = request.META.get("PATH_INFO")
    api_url = path.replace("debug/", "")

    view = urlresolvers.resolve(api_url)

    accept = request.META.get("HTTP_ACCEPT")
    accept += ",application/json"
    request.META["HTTP_ACCEPT"] = accept

    res = view.func(request, **view.kwargs)
    return HttpResponse(res._container)


# if settings.DEBUG:
#
#     import debug_toolbar
#
#     urlpatterns = [
#         url(r'^debug/', debug),
#         url(r'^__debug__/', include(debug_toolbar.urls)),
#     ] + urlpatterns
