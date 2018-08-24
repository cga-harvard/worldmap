from tastypie import fields
from tastypie.resources import ModelResource
from tastypie.constants import ALL, ALL_WITH_RELATIONS

from django.contrib.auth import get_user_model

from geonode.base.models import TopicCategory
from geonode.layers.models import Layer
from guardian.shortcuts import get_objects_for_user


class TopicCategoryResource(ModelResource):

    class Meta:
        queryset = TopicCategory.objects.all()
        resource_name = 'categories'
        filtering = {'identifier': ALL,
                    }


class OwnerResource(ModelResource):
    """Owners api, lighter and faster version of the profiles api"""
    class Meta:
        queryset = get_user_model().objects.exclude(username='AnonymousUser')
        resource_name = 'owners'
        allowed_methods = ['get']
        ordering = ['username', 'date_joined']
        excludes = ['is_staff', 'password', 'is_superuser',
                    'is_active', 'last_login']
        filtering = {
            'username': ALL,
        }


class LayerResource(ModelResource):
    category = fields.ToOneField(
        TopicCategoryResource,
        'category',
        null=True,
        full=True)
    owner = fields.ToOneField(OwnerResource, 'owner', full=True)

    def get_object_list(self, request):
        visible_resources = get_objects_for_user(request.user, 'base.view_resourcebase')
        visible_resources_ids = visible_resources.values_list('id', flat=True)
        return super(LayerResource, self).get_object_list(request).filter(pk__in=visible_resources_ids)

    class Meta:
        queryset = Layer.objects.all()
        resource_name = 'layers'
        filtering = {'title': ALL,
                     #'keywords': ALL_WITH_RELATIONS,
                     #'tkeywords': ALL_WITH_RELATIONS,
                     #'regions': ALL_WITH_RELATIONS,
                     'category': ALL_WITH_RELATIONS,
                     #'group': ALL_WITH_RELATIONS,
                     'owner': ALL_WITH_RELATIONS,
                     #'date': ALL,
                     }
        ordering = ['date', 'title', ]
