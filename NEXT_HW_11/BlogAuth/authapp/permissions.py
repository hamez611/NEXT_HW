from functools import wraps
from django.shortcuts import get_object_or_404, render
from django.core.exceptions import PermissionDenied
from django.contrib.auth.decorators import login_required
from django.utils import timezone


def is_owner_or_admin(request, obj):
    return obj.creator == request.user or request.user.is_superuser


def check_is_creator_or_admin(model_class, field_name):
    def decorator(func):
        def wrapper(request, *args, **kwargs):
            item = model_class.objects.get(pk=kwargs[field_name])
            # 현재 사용자 또는 관리자인지 확인
            if item.creator == request.user or request.user.is_superuser:
                return func(request, *args, **kwargs)
            else:
                raise PermissionDenied("작성자 또는 관리자만 이 작업을 수행할 수 있습니다.")
        return wrapper
    return decorator


def check_is_creator_or_admin(model_cls, lookup_field="pk"):
    def decorator(view_func):
        @wraps(view_func)
        def _wrapped_view(request, *args, **kwargs):
            # 선택한 인자를 kwrags에서 가져옵니다. kwargs는 URL 매칭에서 전달된 인자를 포함합니다.
            obj_id = kwargs.get(lookup_field)
            if not obj_id:
                return render(request, "error.html", {"error": "Object ID not found."})

            # Retrieve the object based on ID and your model
            # You might need to adjust this part based on how your models are structured
            obj = get_object_or_404(model_cls, **{"pk": obj_id})
            # 요 위랑 아래? 부분만 고치면 됨
            # Call the permission check function
            if not is_owner_or_admin(request, obj):
                raise PermissionDenied("권한이 없습니다.")

            return view_func(request, *args, **kwargs)

        return _wrapped_view

    return decorator


def update_last_viewed(model_cls, lookup_field="pk"):
    def decorator(view_func):
        @wraps(view_func)
        def wrapped_view(request, *args, **kwargs):
            # 특정 모델의 인스턴스를 가져옵니다.
            obj_id = kwargs.get(lookup_field)
            obj = get_object_or_404(model_cls, pk=obj_id)

            # 마지막 열람 시간 및 유저를 업데이트합니다.
            obj.last_viewed = timezone.now()
            obj.last_viewed_by = request.user
            obj.save()

            return view_func(request, *args, **kwargs)

        return wrapped_view
    return decorator
