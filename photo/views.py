from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from django.template.loader import render_to_string
from django.views import View

from .forms import PhotoForm
from .models import Photo 

# Create your views here.
class BasicUploadView(View):
    def get(self, request):
        photos = Photo.objects.all()
        return render(self.request, 'home.html', {'photos': photos})

    def post(self, request):
        form = PhotoForm(self.request.POST, self.request.FILES)
        if form.is_valid():
            photo = form.save()
            data = {'is_valid': True, 'name': photo.file.name, 'url': photo.file.url }
        else:
            data = {'is_valid': False}
        return JsonResponse(data)

def photo_delete(request, pk):
    photo = get_object_or_404(Photo, pk=pk)
    data = dict()
    if request.method == 'POST':
        photo.file.delete()
        photo.delete()
        data['form_is_valid'] = True
        photos = Photo.objects.all()
        data['html_photo_list'] = render_to_string('photo_list.html', {'photos': photos})
    else:
        context = {'photo': photo}
        data['html_form'] = render_to_string('photo_delete_form.html', context, request=request)   
    return JsonResponse(data)