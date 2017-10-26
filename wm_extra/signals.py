from django.db.models.signals import post_save
from django.contrib.auth.models import Group

from geonode.people.models import Profile


def save_profile(sender, instance, created, **kwargs):
    """
    Add a user to the 'Registered users' group on creation.
    """
    if created:
        group, is_created = Group.objects.get_or_create(name='Registered users')
        group.user_set.add(instance)

post_save.connect(save_profile, sender=Profile)
