from django.shortcuts import render
from django.http import JsonResponse
from django.views import View

from .forms import PhotoForm
from .models import Photo 

# Create your views here.
class BasicUploadView(View):
    def get(self, request):
        photos = Photo.objects.all()
        return render(self.request, 'photos.html', {'photos': photos})

    def post(self, request):
        form = PhotoForm(self.request.POST, self.request.FILES)
        if form.is_valid():
            photo = form.save()
            data = {'is_valid': True, 'name': photo.file.name, 'url': photo.file.url }
        else:
            data = {'is_valid': False}
        return JsonResponse(data)