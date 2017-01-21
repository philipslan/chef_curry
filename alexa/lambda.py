"""
This sample demonstrates a simple skill built with the Amazon Alexa Skills Kit.
The Intent Schema, Custom Slots, and Sample Utterances for this skill, as well
as testing instructions are located at http://amzn.to/1LzFrj6

For additional samples, visit the Alexa Skills Kit Getting Started guide at
http://amzn.to/1LGWsLG
"""

from __future__ import print_function
import random
import json, urllib, urllib2


# --------------- Helpers that build all of the responses ----------------------

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


# --------------- Functions that control the skill's behavior ------------------

def get_welcome_response():
    """ If we wanted to initialize the session to have some attributes we could
    add those here
    """

    session_attributes = {}
    card_title = "Welcome"
    speech_output = "Welcome to Chef Curry. " + \
                    "What ingredient do you want to cook with?"
    # If the user either does not reply to the welcome message or says something
    # that is not understood, they will be prompted again with this text.
    reprompt_text = "What ingredient do you want to cook with?"
    should_end_session = False
    return build_response(session_attributes, build_speechlet_response(
        card_title, speech_output, reprompt_text, should_end_session))


def handle_session_end_request():
    card_title = "Session Ended"
    speech_output = "Thank you for trying Chef Curry. " \
                    "Have a nice day! "
    # Setting this to true ends the session and exits the skill.
    should_end_session = True
    return build_response({}, build_speechlet_response(
        card_title, speech_output, None, should_end_session))


def create_attributes(ingredients, attempt):
    return {"ingredients": ingredients, \
            "attempt": attempt}


def set_ingredients_in_session(intent, session):
    """ Sets the ingredients in the session and prepares the speech to reply to the
    user.
    """

    card_title = intent['name']
    session_attributes = {}
    should_end_session = False

    if 'Ingredients' in intent['slots']:
        ingredients = intent['slots']['Ingredients']['value']
        session_attributes = create_attributes(ingredients, 0)
        data = recipe_puppy(ingredients)
        recipe = data[0]['title']
        if recipe:
            speech_output = "You should make " + recipe + ". " + "Does this sound good? Yes or no?"
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
        data = recipe_puppy(ingredients)
        recipe = data[0]['title']
        if recipe:
            speech_output = "You should make " + recipe + ". " + "Does this sound good? Yes or no?"
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
    return build_response(session_attributes, build_speechlet_response( \
        intent['name'], speech_output, reprompt_text, should_end_session))

def check_recipe(intent, session):
    card_title = intent['name']
    session_attributes = {}
    should_end_session = False

    if 'Affirmation' in intent['slots']:
        affirmation = intent['slots']['Affirmation']['value']
        if affirmation == 'yes':
            speech_output = "Great! Have a nice day!"
            reprompt_text = None
            should_end_session = True
        else:
            ingredients = session['attributes']['ingredients']
            session['attributes']['attempt'] += 1
            attempt = session['attributes']['attempt']
            session_attributes = create_attributes(ingredients, attempt)
            data = recipe_puppy(ingredients)
            recipe = data[attempt]['title']
            speech_output = "Okay, you could also make " + recipe + ". Does that sound good? Yes or no?"
            reprompt_text = None
    else:
        speech_output = "I'm not sure what that means. " + \
                        "Try again."
        reprompt_text = "I'm not sure what that means. " + \
                        "Try again."
    return build_response(session_attributes, build_speechlet_response(
        card_title, speech_output, reprompt_text, should_end_session))

def recipe_puppy(ingredients):
    data = {}
    # data['key'] = '6730dbcfc93bbf55b087446894878089'
    data['i'] = ingredients
    data['q'] = None
    # data['p'] = '1'
    url_values = urllib.urlencode(data)
    url = 'http://www.recipepuppy.com/api/'
    full_url = url + '?' + url_values
    data = urllib2.urlopen(full_url)
    data = json.load(data)
    return data['results']


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
    if intent_name == "GetIngredients":
        return set_ingredients_in_session(intent, session)
    elif intent_name == "FindRecipe":
        return find_recipe(intent, session)
    elif intent_name == "CheckRecipe":
        return check_recipe(intent, session)
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
