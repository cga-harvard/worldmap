from tastypie.resources import ModelResource
from tastypie import fields
from taggit.models import Tag

from geonode.maps.models import Layer
from geonode.base.models import TopicCategory, ResourceBase

from actstream.models import Action

class TopicCategoryResource(ModelResource):
    """
    A resource representing a TopicCategory.
    """

    class Meta:
        queryset = TopicCategory.objects.all()
        allowed_methods = ['get', ]
        fields = ['name', 'description']


class TagResource(ModelResource):
    """
    A resource representing a Tag.
    """

    class Meta:
        queryset = Tag.objects.all()
        fields = ['name', ]


class LayerResource(ModelResource):
    """
    A resource representing a Layer.
    """
    bbox = fields.CharField(readonly=True)
    created_dttm = fields.DateTimeField(readonly=True)
    is_public = fields.BooleanField(readonly=True)
    keywords = fields.ToManyField(TagResource, 'keywords', full = True)
    owner_username = fields.CharField(readonly=True)
    topic_category = fields.CharField(readonly=True)

    def dehydrate_created_dttm(self, bundle):
        # TODO maybe implement created_dttm in GeoNode? For now let's set it to Date, but it is not the same thing
        return bundle.obj.date

    def dehydrate_bbox(self, bundle):
        return bundle.obj.bbox

    def dehydrate_topic_category(self, bundle):
        if bundle.obj.category:
            return bundle.obj.category.gn_description
        else:
            return None

    def dehydrate_owner_username(self, bundle):
        return bundle.obj.owner.username

    def dehydrate_is_public(self, bundle):
        # TODO implement this with new permission system
        # return bundle.request.user.has_perm('maps.view_layer', obj=bundle.obj)
        return True

    class Meta:
        queryset = Layer.objects.all()
        allowed_methods = ['get', ]
        ordering = ['date', ]
        fields = ['abstract', 'bbox', 'created_dttm', 'date', 'date_type', 'is_public', 'keywords',
            'name', 'owner_username', 'srs', 'temporal_extent_end',
            'temporal_extent_start', 'title', 'topic_category', 'typename', 'uuid',
        ]


class ActionLayerDeleteResource(ModelResource):

    class Meta:
        queryidarr = Action.objects.filter(data__contains={'raw_action': 'created'}, action_object_content_type_id=53).order_by('-timestamp').values_list('action_object_object_id', flat=True)
        queryidarrint = []
        for queryid in queryidarr:
            queryidarrint.append(int(queryid))
        queryset = ResourceBase.objects.filter(id__in=queryidarrint)
        allowed_methods = ['get', ]
        fields = ['uuid',]