from django.contrib import admin

from .models import LayerStats, MapStats


class LayerStatsAdmin(admin.ModelAdmin):
    model = LayerStats
    list_display = (
        'layer',
        'visits',
        'uniques',
        'last_modified',
    )

class MapStatsAdmin(admin.ModelAdmin):
    model = MapStats
    list_display = (
        'map',
        'visits',
        'uniques',
        'last_modified',
    )

admin.site.register(LayerStats, LayerStatsAdmin)
admin.site.register(MapStats, MapStatsAdmin)
