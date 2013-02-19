#!/usr/bin/env python
# -*- coding: UTF-8 -*-
__author__ = 'sanpingz'

DB_NAME = 'location.info'

get_url = 'http://135.252.143.226:8080/ParlayREST/1.0/location/queries/location'
post_url = 'http://135.252.143.226:8080/ParlayREST/1.0/location/subscriptions/periodic'
post_http = ['135.252.143.226:8080', '/ParlayREST/1.0/location/subscriptions/periodic']

post_xml =\
'''<?xml version="1.0" encoding="UTF-8"?>
<tl:periodicNotificationSubscription xmlns:tl="urn:oma:xml:rest:terminallocation:1">
<clientCorrelator>%(clientCorrelator)s</clientCorrelator>
<callbackReference>
    <notifyURL>%(notifyURL)s</notifyURL>
    <callbackData>%(callbackData)s</callbackData>
</callbackReference>
<address>%(address)s</address>
<requestedAccuracy>%(requestedAccuracy)s</requestedAccuracy>
<frequency>%(frequency)s</frequency>
</tl:periodicNotificationSubscription>'''

xml_info = '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<ns6:terminalLocationList xmlns:ns2="urn:oma:xml:rest:common:1" xmlns:ns4="urn:oma:xml:rest:thirdpartycall:1" xmlns:ns3="urn:oma:xml:rest:callnotification:1" xmlns:ns5="urn:oma:xml:rest:audiocall:1" xmlns:ns6="urn:oma:xml:rest:terminallocation:1" xmlns:ns7="urn:oma:xml:rest:qos:1">
    <terminalLocation>
        <address>sip:+16309792001@ims.lucentlab.com</address>
        <locationRetrievalStatus>Retrieved</locationRetrievalStatus>
        <currentLocation>
            <latitude>36.0</latitude>
            <longitude>120.0</longitude>
            <accuracy>1000</accuracy>
            <timestamp>2013-01-24T07:16:47.139+08:00</timestamp>
        </currentLocation>
    </terminalLocation>
</ns6:terminalLocationList>'''

get_params = {
    'acceptableAccuracy': 1000,
    'maximumAge': 180,
    'requestedAccuracy': 1000,
    'responseTime': 300,
    'tolerance': 'LowDelay'
}

post_params = {
    'clientCorrelator': '0001',
    #'notifyURL': 'http://135.252.143.60:8080/notifications/LocationNotification',
    #'notifyURL': 'http://135.252.143.60:8989',
    'notifyURL': 'http://135.252.143.60:8080/location/cgi-bin/notify.cgi',
    'callbackData': '1234',
    'requestedAccuracy': 10,
    'frequency': 10
}

qos_url = 'http://135.252.143.226:8080/ParlayREST/1.0/qos/subscriptions/qos'
qos_http = ['135.252.143.226:8080', '/ParlayREST/1.0/qos/subscriptions/qos']
qos_xml = '''<?xml version="1.0" encoding="UTF-8"?>
<cn:qosSubscription xmlns:cn="urn:oma:xml:rest:qos:1">
   <address>%(address)s</address>
   <qosRank>%(qosRank)s</qosRank>
   <clientCorrelator>212345</clientCorrelator>
</cn:qosSubscription>'''

http_code = {
    '400': 'Bad Request',
    '403': 'Forbidden',
    '404': 'Not Found',
    '408': 'Request Timeout',
    '480': 'Temporarily Unavailable',
    '500': 'Internal Server Error'
}

def json_dumps(d):
    res = '{'
    if d and isinstance(d,dict):
        for key, val in d.items():
            if str(val).isdigit():
                res += '"%s": %s,' % (key, val)
            else:
                res += '"%s": "%s",' % (key, val)
        res = res[:-1]+'}'
    else:
        res = {}
    return res