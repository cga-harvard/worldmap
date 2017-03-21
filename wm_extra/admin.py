from django.contrib import admin

from .models import LayerStats, MapStats, Endpoint


class LayerStatsAdmin(admin.ModelAdmin):
    list_display = (
        'layer',
        'visits',
        'uniques',
        'last_modified',
    )

class MapStatsAdmin(admin.ModelAdmin):
    list_display = (
        'map',
        'visits',
        'uniques',
        'last_modified',
    )

class EndpointAdmin(admin.ModelAdmin):
    list_display = ('id', 'description', 'owner', 'url')
    list_display_links = ('id',)
    search_fields = ['description', 'url']


admin.site.register(LayerStats, LayerStatsAdmin)
admin.site.register(MapStats, MapStatsAdmin)
admin.site.register(Endpoint, EndpointAdmin)
