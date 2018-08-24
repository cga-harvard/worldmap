from tastypie import fields
from tastypie.resources import ModelResource
from tastypie.constants import ALL, ALL_WITH_RELATIONS

from geonode.base.models import TopicCategory
from geonode.layers.models import Layer


class TopicCategoryResource(ModelResource):

    class Meta:
        queryset = TopicCategory.objects.all()
        resource_name = 'categories'
        filtering = {'identifier': ALL,
                    }


class LayerResource(ModelResource):
    category = fields.ToOneField(
        TopicCategoryResource,
        'category',
        null=True,
        full=True)

    class Meta:
        queryset = Layer.objects.all()
        resource_name = 'layers'
        filtering = {'title': ALL,
                     #'keywords': ALL_WITH_RELATIONS,
                     #'tkeywords': ALL_WITH_RELATIONS,
                     #'regions': ALL_WITH_RELATIONS,
                     'category': ALL_WITH_RELATIONS,
                     #'group': ALL_WITH_RELATIONS,
                     #'owner': ALL_WITH_RELATIONS,
                     #'date': ALL,
                     }
        ordering = ['date', 'title', ]
