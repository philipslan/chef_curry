"""
This sample demonstrates a simple skill built with the Amazon Alexa Skills Kit.
The Intent Schema, Custom Slots, and Sample Utterances for this skill, as well
as testing instructions are located at http://amzn.to/1LzFrj6

For additional samples, visit the Alexa Skills Kit Getting Started guide at
http://amzn.to/1LGWsLG
"""

from __future__ import print_function
import random
import json
import urllib
import urllib2


# --------------- Helpers that build all of the responses ----------------

def build_speechlet_response(title, output, reprompt_text, should_end_session):
    return {
        'outputSpeech': {
            'type': 'PlainText',
            'text': output
        },
        'card': {
            'type': 'Simple',
            'title': "SessionSpeechlet - " + title,
            'content': "SessionSpeechlet - " + output
        },
        'reprompt': {
            'outputSpeech': {
                'type': 'PlainText',
                'text': reprompt_text
            }
        },
        'shouldEndSession': should_end_session
    }


def build_response(session_attributes, speechlet_response):
    return {
        'version': '1.0',
        'sessionAttributes': session_attributes,
        'response': speechlet_response
    }


# --------------- Functions that control the skill's behavior ------------

def get_welcome_response():
    """ If we wanted to initialize the session to have some attributes we could
    add those here
    """

    session_attributes = {}
    card_title = "Welcome"
    speech_output = "Chef Curry with the pot boy! " + \
                    "Tell me ingredients you want to cook with, or, ask me what's in my kitchen?"
    # If the user either does not reply to the welcome message or says something
    # that is not understood, they will be prompted again with this text.
    reprompt_text = "Tell me ingredients you want to cook with, or, ask me what's in my kitchen?"
    should_end_session = False
    return build_response(session_attributes, build_speechlet_response(
        card_title, speech_output, reprompt_text, should_end_session))


def handle_session_end_request():
    card_title = "Session Ended"
    speech_output = "Chef Curry out. " \
                    "Have a nice day! "
    # Setting this to true ends the session and exits the skill.
    should_end_session = True
    return build_response({}, build_speechlet_response(
        card_title, speech_output, None, should_end_session))


def create_attributes(ings=False, attempt=False, key=False):
    attributes = dict()
    attributes["ings"] = ings
    attributes["attempt"] = attempt
    attributes["key"] = key
    return attributes


def what_to_make_ing(intent, session):
    """ Finds recipe to make given ingredients spoken
    """

    card_title = intent['name']
    session_attributes = {}
    should_end_session = False

    if 'Ingredients' in intent['slots']:
        ingredients = intent['slots']['Ingredients']['value']
        # splits if multiple ingredients
        if ' ' in ingredients:
            ingredients = ingredients.split()
            ingredients = ','.join(ingredients)
        session_attributes = create_attributes(ingredients, 0)
        data = recipe_puppy(ingredients)
        if data:
            recipe = data[0]['title']
            recipeLink = data[0]
            if 'recipe' in recipe.lower():
                recipe = recipe[:len(recipe) - 6]
            speech_output = "You should make " + recipe + \
                ". " + "Does this sound good? Yes or no?"
            # send_url(session, recipeLink)
            reprompt_text = None
        else:
            speech_output = "I'm not sure what ingredient that is. " + \
                "Try another."
            reprompt_text = "I'm not sure what ingredient that is. " + \
                "Try another."
    else:
        speech_output = "I'm not sure what ingredient that is. " + \
                        "Try another."
        reprompt_text = "I'm not sure what ingredient that is. " + \
                        "Try another."
    return build_response(session_attributes, build_speechlet_response(
        card_title, speech_output, reprompt_text, should_end_session))


def find_recipe(intent, session):
    session_attributes = {}
    reprompt_text = None

    if session.get('attributes', {}) and "ingredients" in session.get('attributes', {}):
        ingredients = session['attributes']['ingredients']
        if ' ' in ingredients:
            ingredients = ingredients.split()
            ingredients = ','.join(ingredients)
        data = recipe_puppy(ingredients)
        recipe = data[0]['title']
        if 'recipe' in recipe.lower():
            recipe = recipe[:len(recipe) - 6]
        if recipe:
            speech_output = "You should make " + recipe + \
                ". " + "Does this sound good? Yes or no?"
            reprompt_text = None

        else:
            speech_output = "I'm not sure what ingredient that is. " + \
                "Try another."
            reprompt_text = "I'm not sure what ingredient that is. " + \
                "Try another."
    else:
        speech_output = "What ingredient do you want to cook with?"
        should_end_session = False

    # Setting reprompt_text to None signifies that we do not want to reprompt
    # the user. If the user does not respond or says something that is not
    # understood, the session will end.
    return build_response(session_attributes, build_speechlet_response(
        intent['name'], speech_output, reprompt_text, should_end_session))


def send_url(session, recipeLink):
    # link = recipeLink['href']
    link = recipeLink['source_url']
    data = {}
    data['url'] = link
    data['kitchenKey'] = get_kitchen_key(session)
    print(data)
    url_values = urllib.urlencode(data)
    url = 'http://chefcurry.herokuapp.com/link'
    req = urllib2.Request(url, url_values)
    data = urllib2.urlopen(req)


def check_recipe(intent, session):
    card_title = intent['name']
    session_attributes = {}
    should_end_session = False
    yes = ["yes", "yeah", "ok sure", "fuck yeah",
           "that\'s some good shit Alexa", "mmmmmmm"]
    no = ["no", "nah", "what the fuck is that", "that sounds disgusting",
          "you're not even trying to find something good"]
    if 'Affirmation' in intent['slots']:
        affirmation = intent['slots']['Affirmation']['value']
        if affirmation in yes:
            speech_output = "Great! Sending you the URL now!"
            reprompt_text = None
            should_end_session = True
        elif affirmation in no:
            ingredients = session['attributes']['ingredients']
            session['attributes']['attempt'] += 1
            attempt = session['attributes']['attempt']
            if session.get('attributes', {}) and "kitchenKey" in session.get('attributes', {}):
                kitchenKey = session['attributes']['kitchenKey']
                session_attributes = create_attributes(
                    ingredients, attempt, kitchenKey)
            else:
                session_attributes = create_attributes(ingredients, attempt)
            data = recipe_puppy(ingredients)
            recipeLink = data[attempt]
            recipe = data[attempt]['title']
            if 'recipe' in recipe.lower():
                recipe = recipe[:len(recipe) - 6]
            speech_output = "Okay, you could also make " + recipe + ". Does that sound good?"
            reprompt_text = "I'm not sure what that means. " + \
                            "Try again."
            send_url(session, recipeLink)
        else:
            speech_output = "I'm not sure what that means. " + \
                            "Try again."
            reprompt_text = "I'm not sure what that means. " + \
                            "Try again."
    else:
        speech_output = "I'm not sure what that means. " + \
                        "Try again."
        reprompt_text = "I'm not sure what that means. " + \
                        "Try again."
    return build_response(session_attributes, build_speechlet_response(
        card_title, speech_output, reprompt_text, should_end_session))


def help_add_kitchen(intent, session):
    card_title = intent['name']
    session_attributes = {}
    should_end_session = False
    speech_output = "Add a kitchen by describing an adjective, foodkey, number, triplet, in the form of, my kitchen is pungent and steak and 68"
    reprompt_text = "Add a kitchen by describing an adjective, foodkey, number, triplet, in the form of, my kitchen is pungent and steak and 68"
    return build_response(session_attributes, build_speechlet_response(
        card_title, speech_output, reprompt_text, should_end_session))


def add_kitchen(intent, session):
    card_title = intent['name']
    session_attributes = {}
    should_end_session = False
    if 'Adjective' in intent['slots'] and 'FoodKey' in intent['slots'] and 'Number' in intent['slots']:
        adjective = intent['slots']['Adjective']['value']
        food_key = intent['slots']['FoodKey']['value']
        number = str(intent['slots']['Number']['value'])
        kitchenKey = adjective + '-' + food_key + '-' + number
        data = {}
        data['kitchenKey'] = kitchenKey
        data['alexaId'] = session['user']['userId']
        url_values = urllib.urlencode(data)
        url = 'http://chefcurry.herokuapp.com/kitchen/alexa/'
        req = urllib2.Request(url, url_values)
        try:
            data = urllib2.urlopen(req)
            result = json.load(data)
            speech_output = "Kitchen Added! Ask me what's in my kitchen, for a recipe, add an item, or remove an item."
            reprompt_text = None
            session_attributes = create_attributes(kitchenKey=kitchenKey)

        except urllib2.HTTPError, e:
            speech_output = "That's not a valid kitchen. Add a kitchen by describing an adjective, foodkey, number, triplet, in the form of, my kitchen is pungent and steak and 68"
            reprompt_text = "Add a kitchen by describing an adjective, foodkey, number triplet, in the form of, my kitchen is pungent and steak and 68"
    else:
        speech_output = "Add a kitchen by describing an adjective, foodkey, number, triplet, in the form of, my kitchen is pungent and steak and 68"
        reprompt_text = "Add a kitchen by describing an adjective, foodkey, number, triplet, in the form of, my kitchen is pungent and steak and 68"

    return build_response(session_attributes, build_speechlet_response(
        card_title, speech_output, reprompt_text, should_end_session))


def get_list_of_items(intent, session):
    card_title = intent['name']
    session_attributes = {}
    should_end_session = False
    reprompt_text = None

    url = 'http://chefcurry.herokuapp.com/items/' + get_kitchen_key(session)
    try:
        data = urllib2.urlopen(url)
        result = json.load(data)  # result is list of ingredient objects
        if result:
            speech_output = "You have "
            for item in result:
                speech_output += str(item['quantity']) + \
                    " " + item['ingredientName'] + ", "
        else:
            speech_output = "Something went wrong. Try telling me what you want to cook with."
            reprompt_text = "Something went wrong. Try telling me what you want to cook with."

    except urllib2.HTTPError, e:
        speech_output = "That's not a valid kitchen. Add a kitchen by describing an adjective, foodkey, number, triplet, in the form of, my kitchen is pungent and steak and 68"
        reprompt_text = "Add a kitchen by describing an adjective, foodkey, number triplet, in the form of, my kitchen is pungent and steak and 68"
    # else:
    #     speech_output = "Add a kitchen by describing an adjective, foodkey, number, triplet, in the form of, my kitchen is pungent and steak and 68"
    #     reprompt_text = "Add a kitchen by describing an adjective, foodkey, number, triplet, in the form of, my kitchen is pungent and steak and 68"

    return build_response(session_attributes, build_speechlet_response(
        card_title, speech_output, reprompt_text, should_end_session))


def add_item(intent, session):
    card_title = intent['name']
    session_attributes = {}
    should_end_session = False
    reprompt_text = None
    if 'Item' in intent['slots'] and 'Quantity' in intent['slots'] and 'Owner' in intent['slots']:
        item = intent['slots']['Item']['value']
        quantity = str(intent['slots']['Quantity']['value'])
        owner = intent['slots']['Owner']['value']
        data = {}
        data['ingredientName'] = item
        data['quantity'] = quantity
        data['nickName'] = owner
        data['kitchenKey'] = get_kitchen_key(session)
        url_values = urllib.urlencode(data)
        url = 'http://chefcurry.herokuapp.com/item'
        req = urllib2.Request(url, url_values)
        try:
            data = urllib2.urlopen(req)
            speech_output = quantity + " " + item + " " + "successfully added!"
        except urllib2.HTTPError, e:
            speech_output = "Something went wrong. Try asking me what's in my kitchen?"
            reprompt_text = "Something went wrong. Try asking me what's in my kitchen?"
    # else:
    #     speech_output = "Please add a kitchen by describing an adjective, foodkey, number, triplet, in the form of, my kitchen is pungent and steak and 68"
    #     reprompt_text = "Please add a kitchen by describing an adjective, foodkey, number, triplet, in the form of, my kitchen is pungent and steak and 68"
    return build_response(session_attributes, build_speechlet_response(
        card_title, speech_output, reprompt_text, should_end_session))


def remove_item(intent, session):
    card_title = intent['name']
    session_attributes = {}
    should_end_session = False
    reprompt_text = None
    if 'Item' in intent['slots'] and 'Quantity' in intent['slots'] and 'Owner' in intent['slots']:
        item = intent['slots']['Item']['value']
        quantity = str(intent['slots']['Quantity']['value'])
        owner = intent['slots']['Owner']['value']
        data = {}
        data['ingredientName'] = item
        data['quantity'] = quantity
        data['nickName'] = owner
        data['kitchenKey'] = get_kitchen_key(session)
        url_values = urllib.urlencode(data)
        url = 'http://chefcurry.herokuapp.com/item'
        req = urllib2.Request(url, url_values)
        req.get_method = lambda: 'PUT'
        try:
            data = urllib2.urlopen(req)
            speech_output = quantity + " " + item + " " + "successfully removed!"
        except urllib2.HTTPError, e:
            speech_output = "Something went wrong. Try asking me what's in my kitchen?"
            reprompt_text = "Something went wrong. Try asking me what's in my kitchen?"
    # else:
    #     speech_output = "Please add a kitchen by describing an adjective, foodkey, number, triplet, in the form of, my kitchen is pungent and steak and 68"
    #     reprompt_text = "Please add a kitchen by describing an adjective, foodkey, number triplet, in the form of, my kitchen is pungent and steak and 68"
    return build_response(session_attributes, build_speechlet_response(
        card_title, speech_output, reprompt_text, should_end_session))


def get_kitchen_key(session):
    alexaId = session['user']['userId']
    url = 'http://chefcurry.herokuapp.com/alexa/' + alexaId
    data = urllib2.urlopen(url)
    key = json.load(data)
    return key


def recipe_puppy(ingredients):
    data = {}
    data['key'] = '6730dbcfc93bbf55b087446894878089'
    # data['i'] = ingredients
    data['q'] = ingredients
    url_values = urllib.urlencode(data)
    # url = 'http://www.recipepuppy.com/api/'
    url = 'http://food2fork.com/api/search'
    full_url = url + '?' + url_values

    data = urllib2.urlopen(full_url)
    data = json.load(data)
    # return data['results']
    return data['recipes']


# --------------- Events ------------------

def on_session_started(session_started_request, session):
    """ Called when the session starts """

    print("on_session_started requestId=" + session_started_request['requestId']
          + ", sessionId=" + session['sessionId'])


def on_launch(launch_request, session):
    """ Called when the user launches the skill without specifying what they
    want
    """

    print("on_launch requestId=" + launch_request['requestId'] +
          ", sessionId=" + session['sessionId'])
    # Dispatch to your skill's launch
    return get_welcome_response()


def on_intent(intent_request, session):
    """ Called when the user specifies an intent for this skill """

    print("on_intent requestId=" + intent_request['requestId'] +
          ", sessionId=" + session['sessionId'])

    intent = intent_request['intent']
    intent_name = intent_request['intent']['name']

    # Dispatch to your skill's intent handlers
    if intent_name == "WhatToMake":
        return what_to_make(intent, session)
    elif intent_name == "WhatToMakeIng":
        return what_to_make_ing(intent, session)
    elif intent_name == "RecipeResponse":
        return recipe_response(intent, session)
    elif intent_name == "YesResponse":
        return yes_response(intent, session)
    elif intent_name == "AddIng":
        return add_ing(intent, session)
    elif intent_name == "AddIngFor":
        return add_ing_for(intent, session)
    elif intent_name == "RemoveIng":
        return remove_ing(intent, session)
    elif intent_name == "RemoveIngFor":
        return remove_ing_for(intent, session)
    elif intent_name == "GetIngs":
        return get_ings(intent, session)
    elif intent_name == "InitKitchen":
        return init_kitchen(intent, session)
    elif intent_name == "AMAZON.HelpIntent":
        return get_welcome_response()
    elif intent_name == "AMAZON.CancelIntent" or intent_name == "AMAZON.StopIntent":
        return handle_session_end_request()
    else:
        raise ValueError("Invalid intent")


def on_session_ended(session_ended_request, session):
    """ Called when the user ends the session.

    Is not called when the skill returns should_end_session=true
    """
    print("on_session_ended requestId=" + session_ended_request['requestId'] +
          ", sessionId=" + session['sessionId'])
    # add cleanup logic here


# --------------- Main handler ------------------

def lambda_handler(event, context):
    """ Route the incoming request based on type (LaunchRequest, IntentRequest,
    etc.) The JSON body of the request is provided in the event parameter.
    """
    print("event.session.application.applicationId=" +
          event['session']['application']['applicationId'])

    """
    Uncomment this if statement and populate with your skill's application ID to
    prevent someone else from configuring a skill that sends requests to this
    function.
    """
    # if (event['session']['application']['applicationId'] !=
    #         "amzn1.echo-sdk-ams.app.[unique-value-here]"):
    #     raise ValueError("Invalid Application ID")

    if event['session']['new']:
        on_session_started({'requestId': event['request']['requestId']},
                           event['session'])

    if event['request']['type'] == "LaunchRequest":
        return on_launch(event['request'], event['session'])
    elif event['request']['type'] == "IntentRequest":
        return on_intent(event['request'], event['session'])
    elif event['request']['type'] == "SessionEndedRequest":
        return on_session_ended(event['request'], event['session'])
