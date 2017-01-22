import json, urllib, urllib2

def recipe_puppy(ingredients):
    data = {}
    # data['key'] = '6730dbcfc93bbf55b087446894878089'
    data['i'] = ingredients
    data['q'] = None
    # data['p'] = '1'
    url_values = urllib.urlencode(data)
    url = 'http://www.recipepuppy.com/api/'
    full_url = url + '?' + url_values
    print full_url
    data = urllib2.urlopen(full_url)
    data = json.load(data)
    return data['results']

def chef_curry(adjective, food_key, number):
    adjective = adjective
    food_key = food_key
    number = str(number)
    data = {}
    data['kitchenKey'] = adjective + '-' + food_key + '-' + number
    url_values = urllib.urlencode(data)
    url = 'http://chefcurry.herokuapp.com/alexa/'
    req = urllib2.Request(url, url_values)
    # full_url = url + '?' + url_value
    try: 
        data = urllib2.urlopen(req)
        result = json.load(data)
        print result
    except urllib2.HTTPError, e:
        print 'This messed up'

def get_items():
    kitchenKey = 'pungent-steak-68'
    item = 'bacon'
    quantity = '1'
    owner = 'Isaac'
    data = {}
    data['ingredientName'] = item
    data['quantity'] = quantity
    data['nickName'] = owner
    data['kitchenKey'] = kitchenKey
    url_values = urllib.urlencode(data)
    url = 'http://chefcurry.herokuapp.com/item'
    req = urllib2.urlopen(url, url_values)
    req.request('POST', url, url_values)
    data = urllib2.urlopen(url)
    result = json.load(data)
    print result

def create_attributes(ingredients=False, attempt=False,kitchenKey=False):
    attributes = dict()
    if ingredients:
        attributes["ingredients"] = ingredients
    elif attempt:
        attributes["attempt"] = attempt
    elif kitchenKey:
        attributes["kitchenKey"] = kitchenKey
    return attributes

create_attributes(attempt=0)

get_items()

my kitchen is pungent and steak and sixty eight