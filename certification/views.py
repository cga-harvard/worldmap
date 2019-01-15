from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import get_object_or_404
from django.shortcuts import render
from django.template import RequestContext
from django.contrib.auth.decorators import login_required
from django.apps import apps

from geonode.people.models import Profile

from .models import Certification


@login_required
def uncertify(request, modelid, modeltype):
    ''' Delete a certification '''

    model = apps.get_model(*modeltype.split('.',1))
    model_obj = model.objects.get(pk=modelid)

    model_title = modelid

    if hasattr(model_obj, 'title'):
        model_title = model_obj.title

    if request.method == 'GET':
        return render(request, 'certification/certification_remove.html',
            { "modeltype": modeltype,
              "modelid": modelid,
              "title": model_title
            }
        )
    elif request.method == 'POST':
        certification = Certification.objects.uncertify(request.user,model_obj)
        redirecturl = model_obj.get_absolute_url()
        return HttpResponseRedirect(redirecturl)

@login_required
def certify(request, modeltype, modelid):
    ''' Certify a map or layer'''
    model = apps.get_model(*modeltype.split('.',1))
    model_obj = model.objects.get(pk=modelid)
    model_title = modelid

    if hasattr(model_obj, 'title'):
        model_title = model_obj.title

    if request.method == 'GET':
        return render(request, 'certification/certification_add.html',
            { "modeltype": modeltype,
              "modelid": modelid,
              "title": model_title
            }
        )
    elif request.method == 'POST':
        certification = Certification.objects.certify(request.user,model_obj)
        redirecturl = model_obj.get_absolute_url()
        return HttpResponseRedirect(redirecturl)

def certified_by_user(request, username):
    ''' Get certified objects per user '''
    profile = Profile.objects.get(username=username)
    cert_objects = Certification.objects.certifications_user(profile)

    return render(request, 'certification/certified_by_user.html',
        {
          'cert_objects': cert_objects,
          'profile': profile,
        }
    )
