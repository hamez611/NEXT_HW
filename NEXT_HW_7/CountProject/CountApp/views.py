from django.shortcuts import render

# Create your views here.
def count(request):
    return render(request,'count.html')

def result(request):
    text=request.POST['text']
    total_len = len(text)
    input = text
    xspace = len(text.replace(' ',''))
    words = len(text.split(' '))
    return render(request, 'result.html',{
        'input':input,
        'total_len':total_len,
        'xspace':xspace,
        'words':words,
        })