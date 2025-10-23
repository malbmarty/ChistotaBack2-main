from django.shortcuts import render
import requests
from .models import (AboutMain, Services, ScopeServices, OrderInfo,
                     Order, QuestionAnswer, Contact, Feedback, PriceServices,
                     VideoMain, Employee, Logo)
from django.http.response import JsonResponse
import json
from django.core.serializers.json import DjangoJSONEncoder


# def gis_data_company():
#     response = requests.get(
#         'http://195.133.27.193/api/twoGis-data/',
#         params={'company': 'Чистота Дв'}
#     )
#     response.raise_for_status()

#     data = response.json()

#     return data


# def vl_data_company():
#     response = requests.get(
#         'http://195.133.27.193/api/vl-data/',
#         params={'company': 'Чистота Дв'}
#     )
#     response.raise_for_status()

#     data = response.json()

#     return data


# def yandex_data_company():
#     response = requests.get(
#         'http://195.133.27.193/api/yandex-data/',
#         params={'company': 'Чистота Дв'}
#     )
#     response.raise_for_status()

#     data = response.json()

#     return data


# def gis_reviews_data():
#     response = requests.get(
#         'http://195.133.27.193/api/twoGis-reviews/',
#         params={'company': 'Чистота Дв', 'cnt': 50, 'min_rating': 5}
#     )
#     response.raise_for_status()

#     data = response.json()['reviews']

#     return data


def gis_data_company():
    """
    Заглушка для данных 2GIS
    """
    return {
        'average_rating': 4.8,
        'reviews_count': 127,
        'profile_url': 'https://go.2gis.com/0UnDt'
    }

def gis_reviews_data():
    """
    Заглушка для отзывов 2GIS
    """
    return [
        {
            'author_name': 'Мария Иванова',
            'rating': 5,
            'review_text': 'Отличная уборка, быстро и качественно! Будем обращаться еще.',
            'author_avatar_url': '/static/images/reviews/avatar.png',
            'photos': []
        },
        {
            'author_name': 'Александр Петров',
            'rating': 5,
            'review_text': 'Очень доволен сервисом. Приехали вовремя, убрали идеально.',
            'author_avatar_url': '/static/images/reviews/avatar.png',
            'photos': []
        },
        {
            'author_name': 'Елена Сидорова',
            'rating': 5,
            'review_text': 'Регулярно заказываем уборку офиса. Всегда чисто и аккуратно.',
            'author_avatar_url': '/static/images/reviews/avatar.png',
            'photos': []
        }
    ]

def vl_data_company():
    """
    Заглушка для VL.ru
    """
    return {
        'average_rating': 4.9,
        'reviews_count': 89,
        'profile_url': 'https://www.vl.ru/chistota-dv'
    }

def yandex_data_company():
    """
    Заглушка для Яндекс
    """
    return {
        'average_rating': 4.7,
        'reviews_count': 156,
        'profile_url': 'https://yandex.ru/maps/-/CHWKmQ7K'
    }



def home(request):
    about_main = AboutMain.objects.first()
    services = Services.objects.all()
    scope_services = ScopeServices.objects.all()

    used_orders_scope_ids = Order.objects.values_list('scope', flat=True).distinct()
    scope_services_for_orders = ScopeServices.objects.filter(id__in=used_orders_scope_ids)

    order_info = OrderInfo.objects.first()
    orders = Order.objects.all()
    gis_data = gis_data_company()
    gis_reviews = gis_reviews_data()
    vl_data = vl_data_company()
    yandex_data = yandex_data_company()
    questions = QuestionAnswer.objects.all()
    contact = Contact.objects.first()
    list_square = PriceServices.objects.values_list('square', flat=True).distinct()
    videos = VideoMain.objects.all()
    employee = Employee.objects.all()
    logo = Logo.objects.all()

    reviews_for_slider = []

    

    for review in gis_reviews:
        slider_review = {
            'author_name': review.get('author_name', 'Аноним'),
            'rating': review.get('rating', 4),
            'review_text': review.get('review_text', ''),
            
            'photo': review.get('author_avatar_url', '/static/images/reviews/avatar.png'),
            'service': 'Уборка',
            'link': {
                'url': 'https://go.2gis.com/Q5sPN',
                'text': 'Читать на 2GIS',
                'icon': 'static/pages/icons/2gis.png',
                'image': review.get('photos', [])[0] if review.get('photos', []) else ''
            }
        }
        reviews_for_slider.append(slider_review)

    reviews_for_slider.sort(key=lambda x: not bool(x['link']['image']))
    gis_reviews_json = json.dumps(reviews_for_slider, cls=DjangoJSONEncoder, ensure_ascii=False)

    return render(request, 'index.html', {
        'about_main': about_main,
        'services': services,
        'scope_services': scope_services,
        'order_info': order_info,
        'orders': orders,
        'gis_data': gis_data,
        'gis_reviews': gis_reviews,
        'gis_reviews_json': gis_reviews_json,
        'questions': questions,
        'contact': contact,
        'list_square': list_square,
        'videos': videos,
        'vl_data': vl_data,
        'yandex_data': yandex_data,
        'employee': employee,
        'scope_services_for_orders': scope_services_for_orders,
        'logo': logo
    })


def post_feedback(request):
    if request.method == 'POST':
        name = request.POST.get('name')
        phone = request.POST.get('phone')
        message = request.POST.get('message')

        Feedback.objects.create(name=name, phone=phone, message=message)

        return JsonResponse({'status': 'success'})


def calculate_price(request):
    if request.method == 'POST':
        body = json.loads(request.body)
        square_int = int(body['square'])
        price_obj = PriceServices.objects.filter(scope__name=body['service'], square=square_int).first()

        if price_obj:
            price = price_obj.price
        else:
            price = 0

        return JsonResponse({'price': price})
