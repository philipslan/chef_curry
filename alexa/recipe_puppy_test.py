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

print recipe_puppy('bacon')