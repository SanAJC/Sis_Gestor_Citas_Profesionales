from django.dispatch import receiver
from allauth.account.signals import user_signed_up
from django.conf import settings

@receiver(user_signed_up)
def handle_user_signed_up(request, sociallogin, user, **kwargs):

    if not sociallogin:
        return
    else:
        extra_data = sociallogin.account.extra_data
        
        user.email = extra_data.get('email')
        user.username = extra_data.get('username')
        
        user.save()


    
