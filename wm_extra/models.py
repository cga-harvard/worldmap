from django.db import models
from django.utils.translation import ugettext_lazy as _

from geonode.layers.models import Layer
from geonode.maps.models import Map
from geonode.people.models import Profile


class MapStats(models.Model):
    map = models.ForeignKey(Map, unique=True)
    visits = models.IntegerField(_("Visits"), default= 0)
    uniques = models.IntegerField(_("Unique Visitors"), default = 0)
    last_modified = models.DateTimeField(auto_now=True,null=True)

    class Meta:
        verbose_name_plural = 'Map stats'


class LayerStats(models.Model):
    layer = models.ForeignKey(Layer, unique=True)
    visits = models.IntegerField(_("Visits"), default = 0)
    uniques = models.IntegerField(_("Unique Visitors"), default = 0)
    downloads = models.IntegerField(_("Downloads"), default = 0)
    last_modified = models.DateTimeField(auto_now=True, null=True)

    class Meta:
        verbose_name_plural = 'Layer stats'


class Endpoint(models.Model):
    """
    Model for a remote endpoint.
    """
    description = models.TextField(_('Describe Map Service'))
    url = models.URLField(_('Map service URL'))
    owner = models.ForeignKey(Profile, blank=True, null=True)
