from geonode.base.models import Link
from geonode.layers.models import Layer, Style
from geonode.people.models import Profile

#layers = Layer.objects.all()
blewis = Profile.objects.get(id=16)
layers = Layer.objects.filter(owner=blewis)

# delete links and styles
Link.objects.all().delete()
Style.objects.all().delete()

# start of process
errors = []

for layer in layers:
    print 'Saving layer %s: %s' % (count, layer.name)
    #layer.save()
    try:
        errors.append(layer.name)
        print 'here'
    except Exception as err:
        errors.append(layer.name)
        print err
